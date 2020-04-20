'use strict';

const root = this;

function expandAbbreviationHandler(p='', v='') {
  if (v) return `<${p}>\n\xa0\xa0${v}\n</${p}>`;
  return `<${p}></${p}>`;
}
root.expandAbbreviation = expandAbbreviationHandler;

function isClassAttr(v='') { return v.indexOf('.') > -1; }

function produceClass(v='') {
  let g = v.split('.').filter(v => v !== '').join(' ').trim();
  return `class="${g}"`;
}

function isIdAttr(v='') { return v.indexOf('#') > -1; }

function produceId(v='') {
  let out = '';
  let g = v.split('#').filter(v => v !== '');
  if (g.length === 1) {
    g = g.join(' ').trim();
    out = `id="${g}"`;
  }
  return out;
}

function expandAttributeHandler(a) {
  let out = '';
  if (isClassAttr(a)) {
    out = produceClass(a);
  } else if (isIdAttr(a)) {
    out = produceId(a);
  }
  return out;
}
root.expandAttribute = expandAttributeHandler;
