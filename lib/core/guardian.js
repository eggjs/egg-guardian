'use strict';

const compose = require('koa-compose');
const RuleManager = require('../util/rule_manager');


class Guardian {
  constructor() {
    this.ruleManager = new RuleManager();
  }

  /**
   * generate guard middleware
   * @return {Function} - guardianMiddleware(ctx, next)
   */
  guardianMiddleware() {
    if (!this._mw) {
      const mws = this.ruleManager.rules
        .map(t => t.ruleMw.bind(t));
      this._mw = compose(mws);
    }
    return this._mw;
  }
}

module.exports = Guardian;
