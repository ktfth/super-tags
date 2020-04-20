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
      '<!DOCTYPE HTML>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '	<meta charset="UTF-8">\n' +
      '	<title></title>\n' +
      '</head>\n' +
      '<body>\n' +
      '\n' +
      '</body>\n' +
      '</html>'
    );
  });
});

describe('Expand', () => {
  it('should produce a tag', () => {
    assert.equal(lib.expand('p'), '<p></p>');
  });

  it('should produce two tags expressed on the pattern', () => {
    assert.equal(lib.expand('p+p'), '<p></p>\n<p></p>');
  });

  it('should produce three tags expresse on the pattern', () => {
    assert.equal(lib.expand('p*3'), '<p></p>\n<p></p>\n<p></p>');
  });

  it('should produce a tag with class', () => {
    assert.equal(lib.expand('p.text-align'), '<p class="text-align"></p>');
  });

  it('should produce two tags with class', () => {
    assert.equal(
      lib.expand('p.text-align+p.text-wrapper'),
      '<p class="text-align"></p>\n<p class="text-wrapper"></p>'
    );
  });

  it('should produce three tags with class', () => {
    assert.equal(
      lib.expand('p.text-wrapper*3'),
      '<p class="text-wrapper"></p>\n' +
      '<p class="text-wrapper"></p>\n' +
      '<p class="text-wrapper"></p>'
    );
  });

  it('should produce a tag with id', () => {
    assert.equal(lib.expand('p#first-paragraph'), '<p id="first-paragraph"></p>');
  });

  it('should produce two tags with id', () => {
    assert.equal(
      lib.expand('p#spotted+p#first-paragraph'),
      '<p id="spotted"></p>\n' +
      '<p id="first-paragraph"></p>'
    );
  });

  it('should produce three tags with id and different numbers on there', () => {
    assert.equal(
      lib.expand('p#paragraph-$$*3'),
      '<p id="paragraph-01"></p>\n' +
      '<p id="paragraph-02"></p>\n' +
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
      '<p>\n\xa0\xa0<a></a>\xa0\xa0\n</p>'
    );
  });

  it('should produce a markup from a deep pattern of 3', () => {
    assert.equal(lib.expand('p>a>span'), '<p>\n\xa0\xa0<a>\n\xa0\xa0\xa0\xa0<span></span>\xa0\xa0\xa0\xa0\n\xa0\xa0</a>\xa0\xa0\n</p>');
  });

  it('should produce a markup from a deep pattern of 4', () => {
    assert.equal(
      lib.expand('p>a>span>b'),
      '<p>\n\xa0\xa0<a>\n\xa0\xa0\xa0\xa0<span>\n\xa0\xa0\xa0\xa0\xa0\xa0<b></b>\xa0\xa0\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0</span>\xa0\xa0\xa0\xa0\n\xa0\xa0</a>\xa0\xa0\n</p>'
    );
  });
});

describe('High Level Expansion', () => {
  it('should produce a markup from a complex pattern 1', () => {
    assert.equal(
      lib.highLevelExpansion('p>a+article>section'),
      '<p>\n\xa0\xa0<a></a>\xa0\xa0\n</p><article>\n\xa0\xa0<section></section>\xa0\xa0\n</article>'
    );
  });

  it('should produce a markup from a complex pattern 2', () => {
    assert.equal(
      lib.highLevelExpansion('p*3>a'),
      '<p>\n<a></a>\n</p>\n<p>\n<a></a>\n</p>\n<p>\n\xa0\xa0<a></a>\xa0\xa0\n</p>'
    );
  });

  // it('should produce a markup from a complex pattern 3', () => {
  //   assert.equal(
  //     lib.highLevelExpansion('p*3>a+p>span'),
  //     '<p>\n\xa0\xa0<a></a>\n</p>\n<p>\n\xa0\xa0<a></a>\n</p>\n<p>\n\xa0\xa0<a></a>\n</p><p>\n\xa0\xa0<span></span>\n</p>'
  //   );
  // });
});
