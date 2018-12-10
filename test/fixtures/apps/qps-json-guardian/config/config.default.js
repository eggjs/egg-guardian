'use strict';

module.exports = () => {
  return {
    keys: 'my keys',
    guardian: {
      clients: {
        http: {
          rules: [
            'WorkerQpsJsonRule',
          ],
        },
      },
      rules: {
        WorkerQpsJsonRule: {
          thresholdMap: {
            'POST-/foo/:id': 10,
            'GET-/foo': 10,
          },
          responseContent: { hello: 'guardian' },
        },
      },
    },
  };
};
