'use strict';

const root = this;

function expandAbbreviationHandler(p='', v='') {
  let attr = expandAttributeHandler(p).trim();

  if ((isIdAttr(p) || isClassAttr(p)) && isAttr(p)) {
    let attrFragment = p.slice(p.indexOf('['), p.indexOf(']') + 1);
    p = p.replace(attrFragment, '');
    attr = expandAttributeHandler(p).trim() +
           ' ' +
           attr;
  } else if (isAttr(p)) {
    let attrFragment = p.slice(p.indexOf('['), p.indexOf(']') + 1);
    p = p.replace(attrFragment, ' ');
  } if (isIdAttr(p) && isClassAttr(p) && p.indexOf('#') < p.indexOf('.')) {
    let classFragment = p.slice(p.indexOf('.'), p.length);
    attr = expandAttributeHandler(p.replace(classFragment, '')).trim() +
           ' ' +
           attr;
    let skip = p.slice(p.indexOf('#'), p.length);
    p = p.replace(skip, ' ');
  } if (isIdAttr(p) && isClassAttr(p) && p.indexOf('#') > p.indexOf('.')) {
    let idFragment = p.slice(p.indexOf('#'), p.length);
    attr = expandAttributeHandler(idFragment);
    let classFragment = p.slice(p.indexOf('.'), p.length);
    attr = expandAttributeHandler(p.replace(idFragment, '')).trim() +
           ' ' +
           attr;
    let skip = p.slice(p.indexOf('.'), p.length);
    p = p.replace(skip, ' ');
  } else if (isClassAttr(p)) {
    p = p.split('.')[0] + ' ';
  } else if (isIdAttr(p)) {
    p = p.split('#')[0] + ' ';
  }
  attr = attr.replace(p, '');
  if (v) return `<${p}${attr}>\n\xa0\xa0${v}\n</${p.replace(' ', '')}>`;
  return `<${p}${attr}></${p.replace(' ', '')}>`;
}
root.expandAbbreviation = expandAbbreviationHandler;

function isClassAttr(v='') { return v.indexOf('.') > -1; }

function produceClass(v='') {
  let g = v.split('.').filter(v => v !== '');
  if (v.indexOf('.') === 0) {
    g = g.join(' ').trim();
  } if (v.indexOf('.') > 0) {
    g = [g[1]].join(' ').trim();
  }
  return `class="${g}"`;
}

function isIdAttr(v='') { return v.indexOf('#') > -1; }

function produceId(v='') {
  let out = '';
  let g = v.split('#').filter(v => v !== '');
  if (v.indexOf('#') === 0) {
    g = g.slice(0, 1);
  } if (v.indexOf('#') > 0) {
    g = [g[1]];
  } if (g.length === 1) {
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
  if ((isIdAttr(a) || isClassAttr(a)) && isAttr(a)) {
    out = produceAttrs(a);
  } else if (isIdAttr(a) && isClassAttr(a) && a.indexOf('#') > a.indexOf('.')) {
    out = produceClass(a);
  } else if (isIdAttr(a) && isClassAttr(a) && a.indexOf('#') > a.indexOf('.')) {
    out = produceId(a);
  } else if (isClassAttr(a)) {
    out = produceClass(a);
  } else if (isIdAttr(a)) {
    out = produceId(a);
  } else if (isAttr(a)) {
    out = produceAttrs(a);
  }
  return out;
}
root.expandAttribute = expandAttributeHandler;

function expandOperationHandler(p='', value='') {
  let out = '';
  if (p.indexOf('+') > -1) {
    let g = p.split('+')
             .filter(v => v !== '')
             .map(v => {
               if (v.indexOf('*') > -1) return expandOperationHandler(v, value);
               return expandAbbreviationHandler(
                 v,
                 value
               );
             })
             .join('');
    out = g;
  } else if (p.indexOf('*') > -1) {
    let g = p.split('*');
    g = (new Array(parseInt(g[1], 10)))
          .fill(expandAbbreviationHandler(g[0]))
          .join('');
    out = g;
  }
  return out;
}
root.expandOperation = expandOperationHandler;

if (!module.parent) {
  let args = process.argv.slice(2);
  console.log(expandAbbreviationHandler(args[0] || ''));
}
