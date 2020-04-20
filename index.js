'use strict';

const root = this;
const assert = require('assert');

const HTML5 = 'html:5';

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

function hasPattern(p) { return p !== undefined; }
function hasPatternId(p) { return hasPattern(p) && p.indexOf('#') > -1; }
function hasPatternClass(p) { return hasPattern(p) && p.indexOf('.') > -1; }

function fullTemplate(tag='', idProp='', classProp='', value='', identation='') {
  if (value) {
    return `<${tag} id="${idProp}" class="${classProp}">` +
           `\n${value}\n${identation}` +
           `</${tag}>`;
  } else {
    return `<${tag} id="${idProp}" class="${classProp}">` +
           `` +
           `</${tag}>`;
  }
}

function classTemplate(tag='', classProp='', value='', identation='') {
  if (value) {
    return `<${tag} class="${classProp}">\n${value}\n${identation}</${tag}>`;
  } else {
    return `<${tag} class="${classProp}"></${tag}>`;
  }
}

function idTemplate(tag='', idProp='', value='', identation='') {
  if (value) {
    return `<${tag} id="${idProp}">\n${value}\n${identation}</${tag}>`;
  } else {
    return `<${tag} id="${idProp}"></${tag}>`;
  }
}

function minimalTemplate(tag='', value='', identation='') {
  if (value) {
    return `<${tag}>\n${value}\n${identation}</${tag}>`;
  } else {
    return `<${tag}></${tag}>`;
  }
}

function fragmentTemplateHandler(pattern, value='', identation='') {
  let out = '';
  let fragment = [];
  if (pattern === HTML5) {
    out = html5Template();
  } else if (hasPatternId(pattern) && hasPatternClass(pattern)) {
    let fragment = pattern.split('#');
    let subFragment = fragment[1].split('.');
    out = fullTemplate(fragment[0], subFragment[0], subFragment[1], value, identation);
  } else if (hasPatternClass(pattern)) {
    let fragment = pattern.split('.');
    out = classTemplate(fragment[0], fragment[1], value, identation);
  } else if (hasPatternId(pattern)) {
    let fragment = pattern.split('#');
    out = idTemplate(fragment[0], fragment[1], value, identation);
  } else if (pattern) {
    out = minimalTemplate(pattern, value, identation);
  }
  return out;
}
root.fragmentTemplate = fragmentTemplateHandler;

function hasMultSymbol(p) { return hasPattern(p) && p.indexOf('*') > -1; }
function hasMergeSymbol(p) { return hasPattern(p) && p.indexOf('+') > -1; }

const TEMPLATE = '$template$';

function expandHandler(pattern, value='', identation='') {
  let out = null;
  if (pattern !== undefined && pattern.indexOf('>') > -1) {
    let fragments = pattern.split('>');
    out = TEMPLATE;
    fragments.forEach((v, i) => {
      let replacer = '$template$';
      let curr = null;
      let identation = i > 0 ? new Array(i).fill('\xa0\xa0').join('') : ''
      if (i === fragments.length - 1) {
        replacer = '';
      }
      if (hasMergeSymbol(v) || hasMultSymbol(v)) {
        if (fragments[i + 1] !== undefined) {
          curr = expandHandler(fragments[i + 1], identation + value + identation, identation);
          v = expandHandler(v, TEMPLATE);
          v = v.replace('$template$', identation + expandHandler(fragments[i + 1], identation + value + identation, identation)) + identation;
        } else {
          v = expandHandler(v, identation + value + identation, identation);
        }
        v = v.replace('$template$', identation + curr + identation);
        out = out.replace('$template$', v);
      } else if (i > 0) {
        out = out.replace('$template$', identation + expandHandler(v, replacer, identation) + identation);
      } else {
        out = out.replace('$template$', expandHandler(v, replacer, identation));
      }
    });
  } else if (hasMergeSymbol(pattern)) {
    out = pattern.split('+').map(v => fragmentTemplateHandler(v, value)).join('\n');
  } else if (hasMultSymbol(pattern)) {
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
    out = fragmentTemplateHandler(pattern, value, identation);
  }
  return out;
}
root.expand = expandHandler;

function highLevelExpansionHandler(pattern) {
  let out = null;
  if (hasMergeSymbol(pattern)) {
    out = pattern.split('+').map(v => expandHandler(v)).join('');
  } else {
    out = expandHandler(pattern);
  }
  return out;
}
root.highLevelExpansion = highLevelExpansionHandler;

if (!module.parent) {
  let args = process.argv.slice(2);
  console.log(highLevelExpansionHandler(args[0] || ''));
}
