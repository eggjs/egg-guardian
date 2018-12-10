'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { Rule } = require('../../../lib/index');
const TestUtil = require('../../util');

describe('test/rule.test.js', () => {
  let validatorOpts;
  let interrupterOpts;
  const sandbox = sinon.createSandbox();
  const ctx = {};
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };
  const initRule = () => {
    return new Rule({
      name: 'test',
      interrupter: new (TestUtil.testInterrupter(interrupterOpts))(),
      validator: new (TestUtil.testValidator(validatorOpts))(),
    });
  };

  beforeEach(() => {
    validatorOpts = {};
    interrupterOpts = {};
  });

  afterEach(() => {
    sandbox.restore();
    nextCalled = false;
  });

  describe('rule mw', () => {
    describe('pre validate not passed', () => {
      beforeEach(() => {
        validatorOpts.pre = false;
      });

      describe('interrupter interrupted', () => {
        beforeEach(() => {
          interrupterOpts.interrupted = true;
        });

        it('should not call next', async () => {
          const rule = initRule();
          await rule.ruleMw(ctx, next);
          assert(nextCalled === false);
        });
      });

      describe('interrupter not interrupted', () => {
        beforeEach(() => {
          interrupterOpts.interrupted = false;
        });

        it('should call next', async () => {
          const rule = initRule();
          await rule.ruleMw(ctx, next);
          assert(nextCalled === true);
        });
      });
    });

    describe('suf validate not passed', () => {
      beforeEach(() => {
        validatorOpts.pre = true;
        validatorOpts.suf = false;
      });

      describe('interrupter interrupted', () => {
        beforeEach(() => {
          interrupterOpts.interrupted = true;
        });

        it('should call interrupt', async () => {
          const rule = initRule();
          const interruptSpy = sandbox.spy(rule.interrupter, 'interrupt');
          await rule.ruleMw(ctx, next);
          assert(nextCalled === true);
          assert(interruptSpy.called);
        });
      });
    });

    describe('validate passed', () => {
      beforeEach(() => {
        validatorOpts.pre = true;
        validatorOpts.suf = true;
      });

      it('should not call interrupt', async () => {
        const rule = initRule();
        const interruptSpy = sandbox.spy(rule.interrupter, 'interrupt');
        await rule.ruleMw(ctx, next);
        assert(nextCalled === true);
        assert(interruptSpy.notCalled);
      });
    });
  });
});
