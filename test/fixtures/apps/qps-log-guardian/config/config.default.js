'use strict';

module.exports = () => {
  return {
    keys: 'my keys',
    guardian: {
      clients: {
        http: {
          rules: [
            'WorkerQpsLogRule',
          ],
        },
      },
      rules: {
        WorkerQpsLogRule: {
          thresholdMap: {
            'POST-/foo/:id': 10,
            'GET-/foo': 10,
          },
        },
      },
    },
  };
};
