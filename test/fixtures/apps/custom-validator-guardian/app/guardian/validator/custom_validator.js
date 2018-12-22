'use strict';

const Base = require('sdk-base');

module.exports = class CustomValidator extends Base {
  constructor(options) {
    super(options);
    this.counter = 0;
    this.ready(true);
  }

  sufValidate() {
    return this.counter++ % 2 === 0;
  }
};
