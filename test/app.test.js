'use strict';

const assert = require('assert');
const mm = require('egg-mock');
const sleep = require('mz-modules/sleep');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('app.test.js', () => {

  let app;

  afterEach(() => {
    return app && app.close();
  });

  const doRequest = async (app, time) => {
    const ps = [];
    for (let i = 0; i < time; ++i) {
      ps.push(app.httpRequest()
        .get('/foo')
        .expect(200));
      app.mockCsrf();
      ps.push(app.httpRequest()
        .post('/foo/321')
        .expect(200));
    }
    await Promise.all(ps);
  };

  describe('qps-log-guardian', () => {
    beforeEach(async () => {
      app = mm.app({
        baseDir: 'apps/qps-log-guardian',
      });
      await app.ready();
    });

    it('should success', async () => {
      await doRequest(app, 11);
      await sleep(2000);
      await doRequest(app, 10);
      const logPath = path.join(__dirname,
        'fixtures/apps/qps-log-guardian/logs/qps-log-guardian/guardian/guardian-default.log');
      const content = fs.readFileSync(logPath).toString().trim();
      const lines = content.split(os.EOL);
      assert(lines.length === 2);
      for (const line of lines) {
        assert(/\[guardian] request should interrupted/.test(line));
      }
    });
  });

  describe('qps-json-guardian', () => {
    beforeEach(async () => {
      app = mm.app({
        baseDir: 'apps/qps-json-guardian',
      });
      await app.ready();
    });

    describe('request matched', () => {
      it('should interrupt request', async () => {
        await doRequest(app, 10);
        await app.httpRequest()
          .get('/foo')
          .expect(429)
          .expect(res => {
            assert.deepStrictEqual(res.body, { hello: 'guardian' });
          });
        app.httpRequest()
          .post('/foo/321')
          .expect(429)
          .expect(res => {
            assert.deepStrictEqual(res.body, { hello: 'guardian' });
          });
      });
    });

    describe('request not matched', () => {
      it('should success', async () => {
        for (let i = 0; i < 20; ++i) {
          await app.httpRequest()
            .get('/bar')
            .expect(404);
        }
      });
    });
  });

  describe('qps-redirect-guardian', () => {
    beforeEach(async () => {
      app = mm.app({
        baseDir: 'apps/qps-redirect-guardian',
      });
      await app.ready();
    });

    it('should interrupt request', async () => {
      await doRequest(app, 10);
      await app.httpRequest()
        .get('/foo')
        .expect(302)
        .expect(res => {
          assert(res.headers.location, 'http://foo.com');
        });
      app.httpRequest()
        .post('/foo/321')
        .expect(302)
        .expect(res => {
          assert(res.headers.location, 'http://foo.com');
        });
    });
  });

  describe('custom-validator-guardian', () => {
    beforeEach(async () => {
      app = mm.app({
        baseDir: 'apps/custom-validator-guardian',
      });
      await app.ready();
    });

    it('should change status', async () => {
      await app.httpRequest()
        .get('/foo?p=1')
        .expect(200)
        .expect(res => {
          assert.deepStrictEqual(res.body, { p: '1' });
        });
      await app.httpRequest()
        .get('/foo?p=1')
        .expect(429)
        .expect(res => {
          assert.deepStrictEqual(res.body, { p: '1' });
        });
      await app.httpRequest()
        .get('/foo?p=1')
        .expect(200)
        .expect(res => {
          assert.deepStrictEqual(res.body, { p: '1' });
        });
    });
  });

  describe('broken-validator-guardian', () => {
    beforeEach(async () => {
      app = mm.app({
        baseDir: 'apps/broken-validator-guardian',
      });
      await app.ready();
    });

    it('should catch error', async () => {
      await app.httpRequest()
        .get('/foo')
        .expect(500);
    });
  });
});
