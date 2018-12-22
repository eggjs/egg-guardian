'use strict';

module.exports = app => {
  app.get('/foo', ctx => {
    ctx.body = 'foo';
    ctx.status = 200;
  });

  app.post('/foo/:id', ctx => {
    ctx.body = ctx.params.id;
    ctx.status = 200;
  });
};
