'use strict';

const assert = require('assert');

class RuleManager {
  constructor() {
    this._rules = [];
  }

  /**
   * insert rule to the tail
   * @param {Rule} rule -
   */
  insertRule(rule) {
    const sameRule = this._rules.find(t => t.name === rule.name);
    assert(!sameRule, `${rule.name} have used`);
    this._rules.push(rule);
  }

  /**
   * delete rule
   * @param {string} ruleName -
   */
  deleteRule(ruleName) {
    const index = this._rules.findIndex(t => t.name === ruleName);
    if (index === -1) return;
    this._rules.splice(index, 1);
  }

  /**
   * has rule
   * @param {string} ruleName -
   * @return {boolean} rule exists
   */
  hasRule(ruleName) {
    return !!this._rules.find(t => t.name === ruleName);
  }

  /**
   * insert rule before which named param
   * @param {Rule} rule -
   * @param {string} name -
   */
  insertRuleBefore(rule, name) {
    const index = this._rules.findIndex(t => t.name === name);
    assert(index >= 0, `can not find rule ${name}`);
    this._rules.splice(index, 0, rule);
  }

  /**
   * insert rule after which named param
   * @param {Rule} rule -
   * @param {string} name -
   */
  insertRuleAfter(rule, name) {
    const index = this._rules.findIndex(t => t.name === name);
    assert(index >= 0, `can not find rule ${name}`);
    this._rules.splice(index + 1, 0, rule);
  }

  get rules() {
    return this._rules.slice();
  }
}

module.exports = RuleManager;
