'use strict';

const Base = require('sdk-base');
const assert = require('assert');
const debug = require('debug')('guardian:rule');

class Rule extends Base {
  /**
   * @constructor
   * @param {object} options -
   * @param {Validator} options.validator -
   * @param {Interrupter} options.interrupter -
   * @param {string} options.name -
   */
  constructor(options) {
    assert(options.validator);
    assert(options.interrupter);
    assert(
      options.validator.preValidate || options.validator.sufValidate,
      'validator should implement preValidate or sufValidate method');
    assert(options.interrupter.interrupt, 'interrupter should implement interrupt method');
    super(Object.assign({}, options, { initMethod: '_init' }));
    this.name = options.name;
    this.validator = options.validator;
    this.interrupter = options.interrupter;
  }

  async _init() {
    await this.validator.ready();
    await this.interrupter.ready();
  }

  async ruleMw(ctx, next) {
    // prefix validate
    let canPass = true;
    if (this.validator.preValidate) {
      canPass = await this.validator.preValidate(ctx);
    }
    debug('pre validate can pass ', canPass);
    if (!canPass) {
      // interrupt request
      const interrupted = await this.interrupter.interrupt(ctx);
      debug('pre: interrupted ', interrupted);
      // If interrupted, should not continue
      if (interrupted !== false) return;
    }
    await next();
    // suffix validate
    canPass = true;
    if (this.validator.sufValidate) {
      canPass = await this.validator.sufValidate(ctx);
    }
    debug('suf validate can pass', canPass);
    if (!canPass) {
      // interrupt request
      await this.interrupter.interrupt(ctx);
    }
  }
}

module.exports = Rule;
