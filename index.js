'use strict';

const assert = require('assert');

function fragmentTemplateHandler(pattern) {
  let out = `<${pattern}></${pattern}>`;
  let fragment = [];
  if (pattern.indexOf('.') > -1) {
    let fragment = pattern.split('.');
    out = `<${fragment[0]} class="${fragment[1]}"></${fragment[0]}>`;
  }
  return out;
}
assert.equal(fragmentTemplateHandler('p'), '<p></p>');

function expandHandler(pattern) {
  let out = null;
  if (pattern.indexOf('+') > -1) {
    out = pattern.split('+').map(v => fragmentTemplateHandler(v)).join('');
  } else if (pattern.indexOf('*') > -1) {
    let fragment = pattern.split('*');
    out = (new Array(parseInt(fragment[1], 10)))
            .fill(fragmentTemplateHandler(fragment[0]))
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
