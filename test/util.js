'use strict';

const { Validator, Interrupter } = require('..');

exports.testValidator = options => {
  return class TestValidator extends Validator {
    preValidate() {
      return options.pre;
    }

    sufValidate() {
      return options.suf;
    }
  };
};

exports.testInterrupter = options => {
  return class TestInterrupter extends Interrupter {
    interrupt() {
      return options.interrupted;
    }
  };
};
