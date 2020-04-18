'use strict';

const lib = require('./');
const assert = require('assert');

describe('Fragment template', () => {
  it('should produce a tag', () => {
    assert.equal(lib.fragmentTemplate('p'), '<p></p>');
  });

  it('should produce html 5 markup', () => {
    assert.equal(
      lib.fragmentTemplate('html:5'),
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
  });
});
