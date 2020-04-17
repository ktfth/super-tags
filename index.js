'use strict';

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

function fragmentTemplateHandler(pattern) {
  let out = `<${pattern}></${pattern}>`;
  let fragment = [];
  if (pattern === 'html:5') {
    out = html5Template();
  } else if (pattern.indexOf('#') > -1 && pattern.indexOf('.') > -1) {
    let fragment = pattern.split('#');
    let subFragment = fragment[1].split('.');
    out = `<${fragment[0]} id="${subFragment[0]}" class="${subFragment[1]}">` +
          `</${fragment[0]}>`;
  } else if (pattern.indexOf('.') > -1) {
    let fragment = pattern.split('.');
    out = `<${fragment[0]} class="${fragment[1]}"></${fragment[0]}>`;
  } else if (pattern.indexOf('#') > -1) {
    let fragment = pattern.split('#');
    out = `<${fragment[0]} id="${fragment[1]}"></${fragment[0]}>`;
  }
  return out;
}
assert.equal(fragmentTemplateHandler('p'), '<p></p>');
assert.equal(
  fragmentTemplateHandler('html:5'),
  '<!DOCTYPE HTML>' +
  '<html lang="en">' +
  '<head>' +
  '	<meta charset="UTF-8">' +
  '	<title></title>' +
  '</head>' +
  '<body>' +
  '' +
  '</body>' +
  '</html>'
);

function expandHandler(pattern) {
  let out = null;
  if (pattern.indexOf('+') > -1) {
    out = pattern.split('+').map(v => fragmentTemplateHandler(v)).join('');
  } else if (pattern.indexOf('*') > -1) {
    let fragment = pattern.split('*');
    out = (new Array(parseInt(fragment[1], 10)))
            .fill(fragmentTemplateHandler(fragment[0]))
            .map((v, i) => {
              if (v.indexOf('$$') > -1) {
                return v.replace('$$', i+1 < 10 ? '0' + (i+1) : i);
              }

              return v;
            })
            .join('');
  } else {
    out = fragmentTemplateHandler(pattern);
  }
  return out;
}
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
