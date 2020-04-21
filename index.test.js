'use strict';

const lib = require('./');
const assert = require('assert');

describe('Abbreviation', () => {
  it('should be expand to a tag', () => {
    assert.equal(lib.expandAbbreviation('div'), '\xa0\xa0<div></div>');
  });

  it('should be expand to a tag with an value', () => {
    assert.equal(lib.expandAbbreviation('div', 'some-text'), '\xa0\xa0<div>\nsome-text\n\xa0\xa0</div>')
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

  it('should be expand id attribute with other fragments', () => {
    assert.equal(lib.expandAttribute('div#some-id'), 'id="some-id"');
  });

  it('should be expand other attributes', () => {
    assert.equal(
      lib.expandAttribute('[data-first="first-example"]'),
      'data-first="first-example"'
    );
  });

  it('should be expand with class attribute', () => {
    assert.equal(
      lib.expandAbbreviation('div.some-class'),
      '\xa0\xa0<div class="some-class"></div>'
    );
  });

  it('should be expand with id attribute', () => {
    assert.equal(
      lib.expandAbbreviation('div#unique-id'),
      '\xa0\xa0<div id="unique-id"></div>'
    );
  });

  it('should be expand with id and class attribute', () => {
    assert.equal(
      lib.expandAbbreviation('div#unique-id.some-class'),
      '\xa0\xa0<div id="unique-id" class="some-class"></div>'
    );
  });

  it('should be expand with class and id attribute', () => {
    assert.equal(
      lib.expandAbbreviation('div.some-class#unique-id'),
      '\xa0\xa0<div class="some-class" id="unique-id"></div>'
    );
  });

  it('should be expand with general attributes', () => {
    assert.equal(
      lib.expandAbbreviation('div[data-id="some-id"]'),
      '\xa0\xa0<div data-id="some-id"></div>'
    );
  });

  it('should be expand class with general attributes', () => {
    assert.equal(
      lib.expandAbbreviation('div.some-class[data-id="some-id"]'),
      '\xa0\xa0<div class="some-class" data-id="some-id"></div>'
    );
  });

  it('should be expand id with general attributes', () => {
    assert.equal(
      lib.expandAbbreviation('div#some-id[data-raw="raw-data"]'),
      '\xa0\xa0<div id="some-id" data-raw="raw-data"></div>'
    );
  });

  it('should be expand with id and class more attributes', () => {
    assert.equal(
      lib.expandAbbreviation('div#unique-id.some-class[data-raw="raw-data"]'),
      '\xa0\xa0<div id="unique-id" class="some-class" data-raw="raw-data"></div>'
    );
  });
});

describe('Operations', () => {
  it('should be add another tag', () => {
    assert.equal(
      lib.expandOperation('div+div'),
      '<div></div>\n<div></div>'
    );
    assert.equal(
      lib.expandOperation('div+div+p'),
      '<div></div>\n<div></div>\n<p></p>'
    );
  });

  it('should be multiple tags', () => {
    assert.equal(
      lib.expandOperation('div*3'),
      '<div></div>\n<div></div>\n<div></div>'
    );
  });

  it('should be combine both operations', () => {
    assert.equal(
      lib.expandOperation('div*3+div*3'),
      '<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>'
    );
  });
});

describe('Nesting', () => {
  it('should be nest a tag', () => {
    assert.equal(
      lib.expandNest('div>article'),
      '<div>\n\xa0\xa0<article></article>\n</div>'
    );
  });

  it('should be nest a deep tag', () => {
    assert.equal(
      lib.expandNest('div>article>section'),
      '<div>\n\xa0\xa0<article>\n\xa0\xa0\xa0\xa0<section></section>\n\xa0\xa0</article>\n</div>'
    );
  });
});
