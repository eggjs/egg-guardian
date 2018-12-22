'use strict';

module.exports = app => {
  app.get('/foo', ctx => {
    ctx.body = ctx.query;
    ctx.status = 200;
  });
};
