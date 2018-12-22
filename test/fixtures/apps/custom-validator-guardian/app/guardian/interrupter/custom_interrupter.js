'use strict';

module.exports = app => {
  return class CustomInterrupter extends app.GuardianInterrupter {
    constructor(options) {
      super(options);
      this.ready(true);
    }

    interrupt(ctx) {
      ctx.status = 429;
    }
  };
};
