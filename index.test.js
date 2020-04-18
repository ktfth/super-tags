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

describe('Expand', () => {
  it('should produce a tag', () => {
    assert.equal(lib.expand('p'), '<p></p>');
  });

  it('should produce two tags expressed on the pattern', () => {
    assert.equal(lib.expand('p+p'), '<p></p><p></p>');
  });

  it('should produce three tags expresse on the pattern', () => {
    assert.equal(lib.expand('p*3'), '<p></p><p></p><p></p>');
  });

  it('should produce a tag with class', () => {
    assert.equal(lib.expand('p.text-align'), '<p class="text-align"></p>');
  });

  it('should produce two tags with class', () => {
    assert.equal(
      lib.expand('p.text-align+p.text-wrapper'),
      '<p class="text-align"></p><p class="text-wrapper"></p>'
    );
  });

  it('should produce three tags with class', () => {
    assert.equal(
      lib.expand('p.text-wrapper*3'),
      '<p class="text-wrapper"></p>' +
      '<p class="text-wrapper"></p>' +
      '<p class="text-wrapper"></p>'
    );
  });

  it('should produce a tag with id', () => {
    assert.equal(lib.expand('p#first-paragraph'), '<p id="first-paragraph"></p>');
  });

  it('should produce two tags with id', () => {
    assert.equal(
      lib.expand('p#spotted+p#first-paragraph'),
      '<p id="spotted"></p>' +
      '<p id="first-paragraph"></p>'
    );
  });

  it('should produce three tags with id and different numbers on there', () => {
    assert.equal(
      lib.expand('p#paragraph-$$*3'),
      '<p id="paragraph-01"></p>' +
      '<p id="paragraph-02"></p>' +
      '<p id="paragraph-03"></p>'
    );
  });

  it('should produce a tag with id and class', () => {
    assert.equal(
      lib.expand('p#first-paragraph.spotted'),
      '<p id="first-paragraph" class="spotted"></p>'
    );
  });

  it('should produce a tag inside of another of 2', () => {
    assert.equal(
      lib.expand('p>a'),
      '<p><a></a></p>'
    );
  });

  it('should produce a markup from a deep pattern of 3', () => {
    assert.equal(lib.expand('p>a>span'), '<p><a><span></span></a></p>');
  });

  it('should produce a markup from a deep pattern of 4', () => {
    assert.equal(
      lib.expand('p>a>span>b'),
      '<p><a><span><b></b></span></a></p>'
    );
  });

  it('should produce a deep markup with two tags inside of child', () => {
    assert.equal(
      lib.expand('p>a+span'),
      '<p><a></a><span></span></p>'
    );
  });

  it('should produce a deep markup with three tags inside of child', () => {
    assert.equal(
      lib.expand('p>a*3'),
      '<p><a></a><a></a><a></a></p>'
    );
  });
});

describe('High Level Expansion', () => {
  it('should produce a markup from a complex pattern 1', () => {
    assert.equal(
      lib.highLevelExpansion('p>a+article>section'),
      '<p><a></a></p><article><section></section></article>'
    );
  });

  it('should produce a markup from a complex pattern 2', () => {
    assert.equal(
      lib.highLevelExpansion('p*3>a'),
      '<p><a></a></p><p><a></a></p><p><a></a></p>'
    );
  });

  it('should produce a markup from a complex pattern 3', () => {
    assert.equal(
      lib.highLevelExpansion('p*3>a+p>span'),
      '<p><a></a></p><p><a></a></p><p><a></a></p><p><span></span></p>'
    );
  });
});
