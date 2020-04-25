'use strict';

const root = this;

function html5Template() {
  return '<!DOCTYPE HTML>\n' +
         '<html lang="en">\n' +
         '<head>\n' +
         '	<meta charset="UTF-8">\n' +
         '	<title></title>\n' +
         '</head>\n' +
         '<body>\n' +
         '\n' +
         '</body>\n' +
         '</html>';
}

class TemplatePattern {
  constructor(p) {
    this.p = p;
  }

  isIdAttr() { return isIdAttr(this.p); }

  isClassAttr() { return isClassAttr(this.p); }

  isAttr() { return isAttr(this.p) };

  isHTML5() { return this.p === 'html:5'; }

  expandAttr() { return expandAttributeHandler(this.p).trim(); }

  attrFragment() {
    return this.p.slice(this.p.indexOf('['), this.p.indexOf(']') + 1);
  }

  classFragment() {
    return this.p.slice(this.p.indexOf('.'), this.p.length);
  }

  idFragment() {
    return this.p.slice(this.p.indexOf('#'), this.p.length);
  }

  produceAttrs() { return produceAttrs(this.p); }

  produceClass() { return produceClass(this.p); }

  produceId() { return produceId(this.p); }
}

function expandAbbreviationHandler(p='', v='', indentation='\xa0\xa0') {
  let tp = new TemplatePattern(p);
  let attr = tp.expandAttr();

  if (tp.isHTML5()) {
    return html5Template();
  } if ((tp.isIdAttr() || tp.isClassAttr()) && tp.isAttr()) {
    let attrFragment = tp.attrFragment();
    tp.p = p.replace(attrFragment, '');
    attr = tp.expandAttr() +
           ' ' +
           attr;
  } else if (tp.isAttr()) {
    let attrFragment = tp.attrFragment();
    tp.p = p = p.replace(attrFragment, ' ');
  } if (tp.isIdAttr() && tp.isClassAttr() && tp.p.indexOf('#') < tp.p.indexOf('.')) {
    let classFragment = tp.classFragment();
    tp.p = p = tp.p.replace(classFragment, '');
    attr = tp.expandAttr() +
           ' ' +
           attr;
    let skip = tp.idFragment();
    tp.p = p = p.replace(skip, ' ');
  } if (tp.isIdAttr() && tp.isClassAttr() && tp.p.indexOf('#') > tp.p.indexOf('.')) {
    let idFragment = tp.idFragment();
    attr = expandAttributeHandler(idFragment);
    let classFragment = tp.classFragment();
    tp.p = p = p.replace(idFragment, '');
    attr = tp.expandAttr() +
           ' ' +
           attr;
    let skip = tp.classFragment();
    tp.p = p = p.replace(skip, ' ');
  } else if (tp.isClassAttr()) {
    p = p.split('.')[0] + ' ';
  } else if (tp.isIdAttr()) {
    p = p.split('#')[0] + ' ';
  }
  attr = attr.replace(p, '');
  if (p) {
    if (v) return `${indentation}<${p}${attr}>\n${v}${indentation}\n${indentation}</${p.replace(' ', '')}>`;
    return `${indentation}<${p}${attr}></${p.replace(' ', '')}>`;
  } else {
    return '';
  }
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
  let tp = new TemplatePattern(a);
  if ((tp.isIdAttr() || tp.isClassAttr()) && tp.isAttr()) {
    out = tp.produceAttrs();
  } else if (tp.isIdAttr() && tp.isClassAttr() && tp.p.indexOf('#') > tp.p.indexOf('.')) {
    out = tp.produceClass();
  } else if (tp.isIdAttr() && tp.isClassAttr() && tp.p.indexOf('#') > tp.p.indexOf('.')) {
    out = tp.produceId();
  } else if (tp.isClassAttr()) {
    out = tp.produceClass();
  } else if (tp.isIdAttr()) {
    out = tp.produceId();
  } else if (tp.isAttr()) {
    out = tp.produceAttrs();
  }
  return out;
}
root.expandAttribute = expandAttributeHandler;

function expandOperationHandler(p='', value='', indentation='') {
  let out = '';
  if (p.indexOf('+') > -1) {
    let g = p.split('+')
             .filter(v => v !== '')
             .map(v => {
               if (v.indexOf('*') > -1) return expandOperationHandler(v, value, indentation);
               return expandAbbreviationHandler(
                 v,
                 value,
                 indentation
               );
             })
             .join('\n');
    out = g;
  } else if (p.indexOf('*') > -1) {
    let g = p.split('*');
    g = (new Array(parseInt(g[1], 10)))
          .fill(expandAbbreviationHandler(g[0], value, indentation))
          .map((v, i) => v.replace('$', i + 1))
          .join('\n');
    out = g;
  } else {
    out = expandAbbreviationHandler(p, value, indentation);
  }
  return out;
}
root.expandOperation = expandOperationHandler;

const space = '\xa0\xa0';

function tabsToSpaceHandler(indentation) {
  let rTab = new RegExp('\t', 'g');
  return indentation.replace(rTab, space);
}
root.tabsToSpace = tabsToSpaceHandler;

function indentationHandler(i, indentation='') {
  let out = '';
  if (i > 0 && indentation.length > 0) {
    out = tabsToSpaceHandler(indentation) + new Array(i).fill(space).join('');
  } if (i > 0 && indentation.length === 0) {
    out = new Array(i).fill(space).join('');
  }
  return out;
}

function isHTMLHandler(p) { return /<[^>]*>/.test(p);  }
root.isHTML = isHTMLHandler;

function expandNestHandler(p='', value='', indentation='') {
  let out = '';
  let _indentation = indentation;
  if (p.indexOf('>') > -1) {
    let g = p.split('>');
    out = '{template}';
    g.forEach((v, i) => {
      indentation = indentationHandler(i, _indentation);
      let rTemplate = new RegExp('\{template\}', 'g')
      let skip = '';
      if (g[i + 1] !== undefined) {
        v = expandOperationHandler(v, '{template}', indentation);
      } if (!isHTMLHandler(v)) {
        if (v.indexOf('{') > -1 && v.indexOf('}') > -1) {
          let c = 0;
          skip = v.slice(v.indexOf('{'), v.indexOf('}') + 1);
          v = v.replace(skip, '');
          skip = indentation + space + skip.slice(1, skip.length - 1);
          out = out.replace(rTemplate, expandOperationHandler(v, skip, indentation));
          out.match(/\$/g).map((v, i) => out = out.replace('$', (i + 1).toString()));
        } else {
          out = out.replace(rTemplate, expandOperationHandler(v, value, indentation));
        }
      } else {
        out = out.replace(rTemplate, v);
      }
    });
  } else {
    out = expandOperationHandler(p, value, _indentation);
  }
  return out;
}
root.expandNest = expandNestHandler;

function highLevelExpansionHandler(p='', v='', indentation='') {
  return expandNestHandler(p, v, indentation);
}
root.highLevelExpansion = highLevelExpansionHandler;

if (!module.parent) {
  let args = process.argv.slice(2);
  console.log(highLevelExpansionHandler(args[0] || ''));
}
