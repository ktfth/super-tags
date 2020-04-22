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

function expandAbbreviationHandler(p='', v='', indentation='\xa0\xa0') {
  let attr = expandAttributeHandler(p).trim();

  if (p === 'html:5') {
    return html5Template();
  } if ((isIdAttr(p) || isClassAttr(p)) && isAttr(p)) {
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
  if (p) {
    if (v) return `${indentation}<${p}${attr}>\n${v}\n${indentation}</${p.replace(' ', '')}>`;
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

function expandNestHandler(p='', value='', indentation='') {
  let out = '';
  if (p.indexOf('>') > -1) {
    let g = p.split('>');
    out = '{template}';
    let _indentation = indentation;
    g.forEach((v, i) => {
      indentation = indentationHandler(i, _indentation);
      let rTemplate = new RegExp('\{template\}', 'g')
      let skip = '';
      if (g[i + 1] !== undefined) {
        v = expandOperationHandler(v, '{template}', indentation);
      } if (!/<[^>]*>/.test(v)) {
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
    out = expandOperationHandler(p, value);
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
