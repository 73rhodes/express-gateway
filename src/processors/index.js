'use strict';

const MODULES = [
  './throttle',
  './proxy',
  './oauth2'
];

const PROCESSORS = MODULES.reduce((pre, modName) => {
  return Object.assign({}, pre, require(modName));
}, {});

module.exports = name => PROCESSORS[name];