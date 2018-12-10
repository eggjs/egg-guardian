'use strict';

const Base = require('sdk-base');

class Interrupter extends Base {
  /**
   * interrupt request
   * @param {Context} ctx -
   * @return {boolean} - should continue process
   */
  /* istanbul ignore next */
  /* eslint-disable-next-line no-unused-vars */
  interrupt(ctx) {
    return false;
  }
}

module.exports = Interrupter;
