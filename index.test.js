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
});
