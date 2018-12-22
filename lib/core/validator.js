'use strict';

const Base = require('sdk-base');

class Validator extends Base {
  /**
   * validate before process request
   * @param {Context} ctx -
   * @return {Promise<Boolean>} request can be passed
   */
  /* istanbul ignore next */
  /* eslint-disable-next-line no-unused-vars */
  async preValidate(ctx) {
    return true;
  }

  /**
   * validate after process request
   * @param {Context} ctx -
   * @return {Promise<Boolean>} request can be passed
   */
  /* istanbul ignore next */
  /* eslint-disable-next-line no-unused-vars */
  async sufValidate(ctx) {
    return true;
  }
}

module.exports = Validator;
