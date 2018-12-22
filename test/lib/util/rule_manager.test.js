'use strict';

const assert = require('assert');
const RuleManager = require('../../../lib/util/rule_manager');

describe('test/lib/util/rule_manager.test.js', () => {
  describe('rule order', () => {
    describe('insert rule', () => {
      it('should insert to tail', () => {
        const ruleManager = new RuleManager();
        ruleManager.insertRule({ name: 'rule1' });
        ruleManager.insertRule({ name: 'rule2' });
        ruleManager.insertRule({ name: 'rule3' });
        const names = ruleManager._rules.map(t => t.name);
        assert.deepStrictEqual(names, [ 'rule1', 'rule2', 'rule3' ]);
      });
    });

    describe('delete rule', () => {
      describe('rule exists', () => {
        it('should success', () => {
          const ruleManager = new RuleManager();
          ruleManager.insertRule({ name: 'rule1' });
          ruleManager.deleteRule('rule1');
          const names = ruleManager._rules.map(t => t.name);
          assert.deepStrictEqual(names, []);
        });
      });

      describe('rule not exists', () => {
        it('should not throw error', () => {
          const ruleManager = new RuleManager();
          ruleManager.deleteRule('rule1');
        });
      });
    });

    describe('has rule', () => {
      it('should success', () => {
        const ruleManager = new RuleManager();
        ruleManager.insertRule({ name: 'rule1' });
        assert(ruleManager.hasRule('rule1') === true);
        assert(ruleManager.hasRule('rule2') === false);
      });
    });

    describe('insert rule before', () => {
      describe('rule is first', () => {
        it('should success', () => {
          const ruleManager = new RuleManager();
          ruleManager.insertRule({ name: 'rule2' });
          ruleManager.insertRuleBefore({ name: 'rule1' }, 'rule2');
          const names = ruleManager._rules.map(t => t.name);
          assert.deepStrictEqual(names, [ 'rule1', 'rule2' ]);
        });
      });

      describe('rule is not first', () => {
        it('should success', () => {
          const ruleManager = new RuleManager();
          ruleManager.insertRule({ name: 'rule1' });
          ruleManager.insertRule({ name: 'rule3' });
          ruleManager.insertRuleBefore({ name: 'rule2' }, 'rule3');
          const names = ruleManager._rules.map(t => t.name);
          assert.deepStrictEqual(names, [ 'rule1', 'rule2', 'rule3' ]);
        });
      });
    });

    describe('insert rule after', () => {
      describe('rule is last', () => {
        it('should success', () => {
          const ruleManager = new RuleManager();
          ruleManager.insertRule({ name: 'rule1' });
          ruleManager.insertRuleAfter({ name: 'rule2' }, 'rule1');
          const names = ruleManager._rules.map(t => t.name);
          assert.deepStrictEqual(names, [ 'rule1', 'rule2' ]);
        });
      });

      describe('rule is not last', () => {
        it('should success', () => {
          const ruleManager = new RuleManager();
          ruleManager.insertRule({ name: 'rule1' });
          ruleManager.insertRule({ name: 'rule3' });
          ruleManager.insertRuleAfter({ name: 'rule2' }, 'rule1');
          const names = ruleManager._rules.map(t => t.name);
          assert.deepStrictEqual(names, [ 'rule1', 'rule2', 'rule3' ]);
        });
      });
    });
  });
});
