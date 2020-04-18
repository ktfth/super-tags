'use strict';

const root = this;
const assert = require('assert');

function html5Template() {
  return '<!DOCTYPE HTML>' +
         '<html lang="en">' +
         '<head>' +
         '	<meta charset="UTF-8">' +
         '	<title></title>' +
         '</head>' +
         '<body>' +
         '' +
         '</body>' +
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
          `${value}` +
          `</${fragment[0]}>`;
  } else if (pattern !== undefined && pattern.indexOf('.') > -1) {
    let fragment = pattern.split('.');
    out = `<${fragment[0]} class="${fragment[1]}">${value}</${fragment[0]}>`;
  } else if (pattern !== undefined && pattern.indexOf('#') > -1) {
    let fragment = pattern.split('#');
    out = `<${fragment[0]} id="${fragment[1]}">${value}</${fragment[0]}>`;
  } else if (pattern) {
    out = `<${pattern}>${value}</${pattern}>`
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
    out = pattern.split('+').map(v => fragmentTemplateHandler(v, value)).join('');
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
            .join('');
  } else {
    out = fragmentTemplateHandler(pattern, value);
  }
  return out;
}
root.expand = expandHandler;
assert.equal(expandHandler('p'), '<p></p>');
assert.equal(expandHandler('p+p'), '<p></p><p></p>');
assert.equal(expandHandler('p*3'), '<p></p><p></p><p></p>');

assert.equal(expandHandler('p.text-align'), '<p class="text-align"></p>');
assert.equal(
  expandHandler('p.text-align+p.text-wrapper'),
  '<p class="text-align"></p><p class="text-wrapper"></p>'
);
assert.equal(
  expandHandler('p.text-wrapper*3'),
  '<p class="text-wrapper"></p>' +
  '<p class="text-wrapper"></p>' +
  '<p class="text-wrapper"></p>'
);

assert.equal(expandHandler('p#first-paragraph'), '<p id="first-paragraph"></p>');
assert.equal(
  expandHandler('p#spotted+p#first-paragraph'),
  '<p id="spotted"></p>' +
  '<p id="first-paragraph"></p>'
);
assert.equal(
  expandHandler('p#paragraph-$$*3'),
  '<p id="paragraph-01"></p>' +
  '<p id="paragraph-02"></p>' +
  '<p id="paragraph-03"></p>'
);

assert.equal(
  expandHandler('p#first-paragraph.spotted'),
  '<p id="first-paragraph" class="spotted"></p>'
);

assert.equal(
  expandHandler('p>a'),
  '<p><a></a></p>'
);
assert.equal(expandHandler('p>a>span'), '<p><a><span></span></a></p>');
assert.equal(
  expandHandler('p>a>span>b'),
  '<p><a><span><b></b></span></a></p>'
);
assert.equal(
  expandHandler('p>a+span'),
  '<p><a></a><span></span></p>'
);
assert.equal(
  expandHandler('p>a*3'),
  '<p><a></a><a></a><a></a></p>'
);

function highLevelExpansionHandler(pattern) {
  let out = null;
  if (pattern !== undefined && pattern.indexOf('+')) {
    out = pattern.split('+').map(v => expandHandler(v)).join('');
  }
  return out;
}
root.highLevelExpansion = highLevelExpansionHandler;
assert.equal(
  highLevelExpansionHandler('p>a+article>section'),
  '<p><a></a></p><article><section></section></article>'
);
assert.equal(
  highLevelExpansionHandler('p*3>a'),
  '<p><a></a></p><p><a></a></p><p><a></a></p>'
);
assert.equal(
  highLevelExpansionHandler('p*3>a+p>span'),
  '<p><a></a></p><p><a></a></p><p><a></a></p><p><span></span></p>'
);
