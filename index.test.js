'use strict';

const lib = require('./');
const assert = require('assert');

describe('Abbreviation', () => {
  it('should be expand to a tag', () => {
    assert.equal(lib.expandAbbreviation('div'), '<div></div>');
  });

  it('should be expand to a tag with an value', () => {
    assert.equal(lib.expandAbbreviation('div', 'some-text'), '<div>\n\xa0\xa0some-text\n</div>')
  });

  it('should be expand class attribute', () => {
    assert.equal(lib.expandAttribute('.some-class'), 'class="some-class"');
  });

  it('should be expand class attribute with two or more values', () => {
    assert.equal(
      lib.expandAttribute('.first-class.second-class'),
      'class="first-class second-class"'
    );

    assert.equal(
      lib.expandAttribute('.first-class.second-class.third-class'),
      'class="first-class second-class third-class"'
    );
  });

  it('should be expand id attribute', () => {
    assert.equal(lib.expandAttribute('#some-id'), 'id="some-id"');
  });

  it('should be expand one id attribute', () => {
    assert.equal(lib.expandAttribute('#some-id#lock'), 'id="some-id"');
  });
});
