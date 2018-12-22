# egg-guardian

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-guardian.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-guardian
[travis-image]: https://img.shields.io/travis/eggjs/egg-guardian.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-guardian
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-guardian.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-guardian?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-guardian.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-guardian
[snyk-image]: https://snyk.io/test/npm/egg-guardian/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-guardian
[download-image]: https://img.shields.io/npm/dm/egg-guardian.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-guardian

egg guardian plugin

# Install

```shell
npm i egg-guardian
```

# Usage

## Simple - use default validator and interrupter

### Use `WorkerQpsJsonRule`
Response 429 and JSON to client.
```js
// config/config.default.js
module.exports = {
  guardian: {
    clients: {
      http: {
        rule: [ 'WorkerQpsJsonRule' ]
      },
    },
    rules: {
      WorkerQpsJsonRule: {
        thresholdMap: {
          // Define threshold one worker can handle
          // Format is `${method}-${path}`
          'POST-/foo/:id': 10,
          'GET-/foo': 10,
        },
        // Json interrupter response content
        responseContent: { msg: 'System is busy' },
        // Json interrupter response status code
        responseStatus: 429,
      },
    },
  },
};
```

### Use `WorkerQpsRedirectRule`
Redirect to specified url.
```js
// config.default.js
module.exports = {
  guardian: {
    clients: {
      http: {
        rule: [ 'WorkerQpsRedirectRule' ]
      },
    },
    rules: {
      WorkerQpsRedirectRule: {
        thresholdMap: {
          // Define threshold one worker can handle
          'POST-/foo/:id': 10,
          'GET-/foo': 10,
        },
        // Redirect interrupter redirect url
        redirectUrl: 'http://foo/server_busy',
      },
    },
  },
};
```

### Use `WorkerQpsLogRule`.
Print guardian log.
```js
// config.default.js
module.exports = {
  guardian: {
    clients: {
      http: {
        rule: [ 'WorkerQpsLogRule' ]
      },
    },
    rules: {
      WorkerQpsLogRule: {
        thresholdMap: {
          // Define threshold one worker can handle
          'POST-/foo/:id': 10,
          'GET-/foo': 10,
        },
      },
    },
  },
};
```

## Advanced

### GuardianLoader
`egg-guardian` will load `app/guardian/interrupter` to app.guardianInterrupters, load `app/guardian/validator` to app.guardianInterrupters.
Loader case style is `upper`, `json_interrupter` will load to `JsonInterrupter`.
 
### DefaultInterrupter
#### JsonInterrupter
Interrupt request, response with JSON content, should set `responseStatus`(default is 429), `responseContent` in rule config.

#### LogInterrupter
Not interrupt request, just print log.

#### RedirectInterrupter
Interrupt request, redirect to `redirectUrl`, should set `redirectUrl` in rule Config.

### DefaultValidator
#### WorkerQpsValidator
If qps is over threshold, mark request should not paas. Should set `thresholdMap` in rule config.

1. convert request to `requestKey`. `GET /foo` map to `GET-/foo`
2. plus `requestKey` qps.
3. compare qps with threshold

### Define custom validator and interrupter.
1. Define validator.
```js
// guardian/validator/custom_validator.js
'use strict';

module.exports = app => {
  class CustomValidator extends app.GuardianValidator {
    /**
     * @constructor
     * @params {object} options -
     * @params {Application} options.app -
     * @params {object} config - rule config. `config.guardian.rules.rule`
     */
    constructor(options) {
      super(options);
      this.counter = 0;
      // ready(true) is required. Rule will wait to validator is ready.
      this.ready(true);
    }

    /**
     * validate before process request
     * @param {Context} ctx -
     * @return {Promise<Boolean>} request can be passed
     */
    async preValidate(ctx) {
      return true;
    }

    /**
     * validate after process request
     * @param {Context} ctx -
     * @return {Promise<Boolean>} request can be passed
     */
    async sufValidate() {
      return this.counter++ % 2 === 0;
    }
  }
};
```

2. Define interrupter.
```js
// guardian/interrupter/custom_interrupter.js
'use strict';

module.exports = app => {
  return class CustomInterrupter extends app.GuardianInterrupter {
    /**
     * @constructor
     * @params {object} options -
     * @params {Application} options.app -
     * @params {object} config - rule config. `config.guardian.rules.rule`
     */
    constructor(options) {
      super(options);
      // ready(true) is required. Rule will wait to interrupter is ready.
      this.ready(true);
    }

    /**
     * interrupt request
     * @param {Context} ctx -
     * @return {boolean} - should continue process
     */
    async interrupt(ctx) {
      ctx.status = 429;
      return false;
    }
  };
};

```

3. Define rule.
```js
// config/config.default.js
module.exports = {
  guardian: {
    clients: {
      http: {
        // Use custom rule
        rules: [ 'CustomRule' ],
      },
    },
    rules: {
      // Define custom rule
      CustomRule: {
        interrupter: 'CustomInterrupter',
        validator: 'CustomValidator',
      },
    },
  },
};
```

## License

[MIT](LICENSE)
