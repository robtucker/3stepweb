'use strict';

var bulk = require('bulk-require');

var filtersModule = angular.module('sp.filters', []);
var files = bulk(__dirname, ['./**/!(*index|*.spec).js']);

Object.keys(files).forEach(function(key) {
    var item = files[key];
    filtersModule.controller(item.name, item.fn);
});

module.exports = filtersModule;