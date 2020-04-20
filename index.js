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
  let g = v.split('#').filter(v => v !== '').slice(0, 1);
  if (g.length === 1) {
    g = g.join(' ').trim();
    out = `id="${g}"`;
  }
  return out;
}

function isAttr(v='') { return v.indexOf('[') > -1 && v.indexOf(']'); }

function produceAttrs(v='') {
  let out = '';
  let g = v.slice(v.indexOf('[') + 1, v.indexOf(']')).split(' ')
           .filter(v => v !== '')
           .join(' ').trim();
  out = `${g}`;
  return out;
}

function expandAttributeHandler(a) {
  let out = '';
  if (isClassAttr(a)) {
    out = produceClass(a);
  } else if (isIdAttr(a)) {
    out = produceId(a);
  } else if (isAttr(a)) {
    out = produceAttrs(a);
  }
  return out;
}
root.expandAttribute = expandAttributeHandler;
