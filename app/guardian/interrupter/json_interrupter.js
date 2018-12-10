'use strict';

module.exports = app => {
  return class JsonInterrupter extends app.GuardianInterrupter {
    constructor(options) {
      super(options);
      const { config } = options;
      this.responseContent = config.responseContent;
      this.responseStatus = config.responseStatus;
      this.ready(true);
    }

    interrupt(ctx) {
      ctx.body = this.responseContent;
      ctx.status = this.responseStatus;
      return true;
    }
  };
};
