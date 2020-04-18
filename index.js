'use strict';

const root = this;
const assert = require('assert');

function html5Template() {
  return '<!DOCTYPE HTML>\n' +
         '<html lang="en">\n' +
         '<head>\n' +
         '	<meta charset="UTF-8">\n' +
         '	<title></title>\n' +
         '</head>\n' +
         '<body>\n' +
         '\n' +
         '</body>\n' +
         '</html>';
}

function fragmentTemplateHandler(pattern, value='') {
  let out = '';
  let fragment = [];
  if (pattern === 'html:5') {
    out = html5Template();
  } else if (pattern !== undefined && pattern.indexOf('#') > -1 && pattern.indexOf('.') > -1) {
    let fragment = pattern.split('#');
    let subFragment = fragment[1].split('.');
    out = `<${fragment[0]} id="${subFragment[0]}" class="${subFragment[1]}">` +
          `\n${value}\n` +
          `</${fragment[0]}>`;
  } else if (pattern !== undefined && pattern.indexOf('.') > -1) {
    let fragment = pattern.split('.');
    out = `<${fragment[0]} class="${fragment[1]}">\n${value}\n</${fragment[0]}>`;
  } else if (pattern !== undefined && pattern.indexOf('#') > -1) {
    let fragment = pattern.split('#');
    out = `<${fragment[0]} id="${fragment[1]}">\n${value}\n</${fragment[0]}>`;
  } else if (pattern) {
    out = `<${pattern}>\n${value}\n</${pattern}>`
  }
  return out;
}
root.fragmentTemplate = fragmentTemplateHandler;

function expandHandler(pattern, value='') {
  let out = null;
  if (pattern !== undefined && pattern.indexOf('>') > -1) {
    let fragments = pattern.split('>');
    out = '$template$';
    fragments.forEach((v, i) => {
      let replacer = '$template$';
      let curr = null;
      if (i === fragments.length - 1) replacer = '';
      if (v.indexOf('+') > -1 || v.indexOf('*') > -1) {
        if (fragments[i + 1] !== undefined) {
          curr = expandHandler(fragments[i + 1], value);
          v = expandHandler(v, '$template$');
          v = v.replace('$template$', expandHandler(fragments[i + 1], value));
        } else {
          v = expandHandler(v, value);
        }
        v = v.replace('$template$', curr);
        out = out.replace('$template$', v);
      } else {
        out = out.replace('$template$', fragmentTemplateHandler(v, replacer));
      }
    });
  } else if (pattern !== undefined && pattern.indexOf('+') > -1) {
    out = pattern.split('+').map(v => fragmentTemplateHandler(v, value)).join('\n');
  } else if (pattern !== undefined && pattern.indexOf('*') > -1) {
    let fragment = pattern.split('*');
    out = (new Array(parseInt(fragment[1], 10)))
            .fill(fragmentTemplateHandler(fragment[0], value))
            .map((v, i) => {
              if (v.indexOf('$$') > -1) {
                return v.replace('$$', i+1 < 10 ? '0' + (i+1) : i);
              }

              return v;
            })
            .join('\n');
  } else {
    out = fragmentTemplateHandler(pattern, value);
  }
  return out;
}
root.expand = expandHandler;

function highLevelExpansionHandler(pattern) {
  let out = null;
  if (pattern !== undefined && pattern.indexOf('+')) {
    out = pattern.split('+').map(v => expandHandler(v)).join('');
  }
  return out;
}
root.highLevelExpansion = highLevelExpansionHandler;
