'use strict';

const Base = require('sdk-base');

class BrokenValidator extends Base {
  constructor(options) {
    super(options);
    this.ready(true);
  }

  preValidate() {
    throw new Error('mock error');
  }
}

module.exports = BrokenValidator;
