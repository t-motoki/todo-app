'use strict';

let custom = {};

custom.timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


module.exports = custom;