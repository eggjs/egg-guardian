'use strict';

module.exports = app => {
  return class LogInterrupter extends app.GuardianInterrupter {
    constructor(options) {
      super(options);
      this.ready(true);
    }

    interrupt(ctx) {
      ctx.getLogger('guardianLogger').warn('[guardian] request should interrupted');
      return false;
    }
  };
};
