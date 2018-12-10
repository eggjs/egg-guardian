'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const mw = ctx.app.guardian.get('http').guardianMiddleware();
    return mw(ctx, next);
  };
};
