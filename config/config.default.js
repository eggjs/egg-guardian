'use strict';

const path = require('path');

module.exports = appInfo => {
  return {
    guardian: {
      clients: {
        // request type
        http: {
          // guardian rules
          rules: [],
        },
      },
      rules: {
        WorkerQpsLogRule: {
          interrupter: 'LogInterrupter',
          validator: 'WorkerQpsValidator',
          // Define threshold one worker can handle
          thresholdMap: {
          },
        },
        WorkerQpsJsonRule: {
          interrupter: 'JsonInterrupter',
          validator: 'WorkerQpsValidator',
          // Define threshold one worker can handle
          thresholdMap: {
          },
          // Json interrupter response status code
          responseStatus: 429,
          // Json interrupter response content
          responseContent: '',
        },
        WorkerQpsRedirectRule: {
          interrupter: 'RedirectInterrupter',
          validator: 'WorkerQpsValidator',
          // Define threshold one worker can handle
          thresholdMap: {
          },
          // Redirect interrupter redirect url
          redirectUrl: '',
        },
      },
    },
    customLogger: {
      guardianLogger: {
        file: path.join(appInfo.root, `logs/${appInfo.name}/guardian/guardian-default.log`),
      },
    },
  };
};
