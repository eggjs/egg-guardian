'use strict';

module.exports = {
  keys: 'my key',
  guardian: {
    clients: {
      http: {
        rules: [ 'BrokenRule' ],
      },
    },
    rules: {
      BrokenRule: {
        interrupter: 'LogInterrupter',
        validator: 'BrokenValidator',
      },
    },
  },
};
