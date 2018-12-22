'use strict';

module.exports = app => {
  app.use((ctx, next) => {
    next();
  });

  app.get('/foo', ctx => {
    ctx.body = 'foo';
    ctx.status = 200;
  });

  app.post('/foo/:id', ctx => {
    ctx.body = ctx.params.id;
    ctx.status = 200;
  });
};
