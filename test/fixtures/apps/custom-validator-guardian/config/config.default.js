'use strict';

module.exports = {
  keys: 'my key',
  guardian: {
    clients: {
      http: {
        rules: [ 'SufValidatorRule' ],
      },
    },
    rules: {
      SufValidatorRule: {
        interrupter: 'CustomInterrupter',
        validator: 'CustomValidator',
      },
    },
  },
};
