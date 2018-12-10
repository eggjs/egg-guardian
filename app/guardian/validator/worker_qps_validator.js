'use strict';

const QPSCounter = require('qps');

module.exports = app => {
  return class WorkerQpsValidator extends app.GuardianValidator {
    constructor(options) {
      super(options);
      const { app, config } = options;
      this.thresholdMap = config.thresholdMap;
      this.counterMap = {};
      this.logger = app.getLogger('guardianLogger');
      this.router = app.router;
      this.ready(true);
    }

    convertRequest(ctx) {
      const matched = this.router.match(ctx.path, ctx.method);
      const matchedLayers = matched.pathAndMethod;
      if (!matchedLayers.length) return null;
      const mostSpecificLayer = matchedLayers[matchedLayers.length - 1];
      return `${ctx.method}-${mostSpecificLayer.path}`;
    }

    preValidate(ctx) {
      const key = this.convertRequest(ctx);
      if (this.thresholdMap[key] === undefined) {
        return true;
      }
      if (!this.counterMap[key]) {
        this.counterMap[key] = new QPSCounter();
      }
      const counter = this.counterMap[key];
      const threshold = this.thresholdMap[key];
      counter.plus();
      return counter.get() <= threshold;
    }
  };
};
