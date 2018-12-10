'use strict';

const assert = require('assert');

/**
 * @param {object} options -
 * @param {string} options.name -
 * @param {Application} options.app -
 * @param {object} options.config - e.g. config.guardian.http
 * @param {string} options.interrupterName -
 * @param {string} options.validatorName -
 * @return {Rule} -
 */
exports.initRule = options => {
  const { app, config } = options;
  const validator = initValidator({
    app,
    config,
    name: options.validatorName,
  });
  const interrupter = initInterrupter({
    app,
    config,
    name: options.interrupterName,
  });
  return new app.GuardianRule({
    name: options.name,
    validator,
    interrupter,
  });
};

/**
 * @param {object} options -
 * @param {Application} options.app -
 * @param {string} options.name -
 * @param {object} options.config -
 * @return {Validator} -
 */
function initValidator(options) {
  const { app, name, config } = options;
  const Validator = app.guardianValidators[name];
  assert(Validator, `Validator ${name} not exists`);
  return new Validator({ app, config });
}

/**
 * @param {object} options -
 * @param {Application} options.app -
 * @param {string} options.name -
 * @param {object} options.config -
 * @return {Interrupter} -
 */
function initInterrupter(options) {
  const { app, name, config } = options;
  const Interrupter = app.guardianInterrupters[name];
  assert(Interrupter, `Interrupter ${name} not exists`);
  return new Interrupter({ app, config });
}
