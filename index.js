'use strict';
var loaderUtils = require('loader-utils');

module.exports = function(source) {
  var query = loaderUtils.parseQuery(this.query);
  if (typeof query === "object" && query.regex && typeof query.sub === "string") {
    var regex1 = new RegExp('.'+query.regex+' ', 'g');
    var regex2 = new RegExp('.'+query.regex+'{', 'g');
    source = source.replace(regex1, '.'+query.sub+' ');
    source = source.replace(regex2, '.'+query.sub+' {');
  }

  return source;
};