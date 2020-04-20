'use strict';

const root = this;

function expandAbbreviationHandler(p='', v='') {
  if (v) return `<${p}>\n\xa0\xa0${v}\n</${p}>`;
  return `<${p}></${p}>`;
}
root.expandAbbreviation = expandAbbreviationHandler;
