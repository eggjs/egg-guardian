'use strict';

const assert = require('assert');

module.exports = app => {
  return class RedirectInterrupter extends app.GuardianInterrupter {
    constructor(options) {
      super(options);
      const { config } = options;
      assert(config.redirectUrl, 'should set redirectUrl');
      this.redirectUrl = config.redirectUrl;
      this.ready(true);
    }

    interrupt(ctx) {
      ctx.redirect(this.redirectUrl);
      return true;
    }
  };
};
