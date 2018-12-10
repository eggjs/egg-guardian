'use strict';

const assert = require('assert');
const is = require('is-type-of');
const path = require('path');
const GuardianUtil = require('./lib/util/guardian_util');
const {
  Guardian,
  Interrupter,
  Validator,
  Rule,
} = require('./lib');
const VALIDATOR_DIR = 'app/guardian/validator';
const INTERRUPTER_DIR = 'app/guardian/interrupter';

class GuardianBoot {
  constructor(app) {
    this.app = app;
    this.loader = this.app.loader;
  }

  configWillLoad() {
    this.app.GuardianRule = Rule;
    this.app.GuardianInterrupter = Interrupter;
    this.app.GuardianValidator = Validator;
  }

  configDidLoad() {
    const initializer = obj => {
      if (is.function(obj) && !is.class(obj)) {
        obj = obj(this.app);
      }
      return obj;
    };

    const loadUnits = this.loader.getLoadUnits().map(t => t.path);
    const interrupterDirs = loadUnits.map(unit => path.join(unit, INTERRUPTER_DIR));
    const validatorDirs = loadUnits.map(unit => path.join(unit, VALIDATOR_DIR));

    // load interrupter to guardianInterrupters
    this.loader.loadToApp(interrupterDirs, 'guardianInterrupters', {
      caseStyle: 'upper',
      directory: interrupterDirs,
      initializer,
    });
    // load validator to validatorInterrupters
    this.loader.loadToApp(validatorDirs, 'guardianValidators', {
      caseStyle: 'upper',
      directory: validatorDirs,
      initializer,
    });

    // inject HTTP guardian middleware
    const coreMiddleIndex = this.app.config.coreMiddlewares.indexOf('guardian');
    if (coreMiddleIndex === -1) {
      this.app.config.coreMiddlewares.push('guardian');
    }
  }

  /**
   * load rule in didLoad
   * allow plugin prepare resource for rule in configDidLoad
   * @return {Promise<void>} -
   */
  async didLoad() {
    // init guardian instances
    this.app.addSingleton('guardian', async config => {
      const guardian = new Guardian();
      // init rules
      for (const name of config.rules) {
        const rule = this._initRule({ name, guardian });
        await rule.ready();
        // insert rule
        guardian.ruleManager.insertRule(rule);
      }
      return guardian;
    });
  }

  _initRule({ name, guardian }) {
    const ruleConfig = this.app.config.guardian.rules[name];
    assert(ruleConfig, `can not find rule config named ${name}`);
    return GuardianUtil.initRule({
      name,
      app: this.app,
      config: ruleConfig,
      guardian,
      interrupterName: ruleConfig.interrupter,
      validatorName: ruleConfig.validator,
    });
  }
}

module.exports = GuardianBoot;
