'use strict';

const assert = require('assert');
const { Guardian, Rule, Validator, Interrupter } = require('../../../lib/index');

describe('test/guardian.test.js', () => {
  describe('guardian mw', () => {
    it('should success', () => {
      const guardian = new Guardian();
      const rule = new Rule({
        name: 'rule1',
        validator: new Validator(),
        interrupter: new Interrupter(),
      });
      guardian.ruleManager.insertRule(rule);
      const mw = guardian.guardianMiddleware();
      assert(mw);
    });
  });
});
