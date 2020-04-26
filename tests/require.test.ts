// eslint-disable-next-line @typescript-eslint/no-var-requires
const WaitQueue = require('../src/index');

describe('require WaitQueue', function () {
  it('expect WaitQueue to be a function', function () {
    expect(typeof WaitQueue).toEqual('function');
  });
  it('new WaitQueue', function () {
    expect(new WaitQueue()).toBeInstanceOf(WaitQueue);
  });
});
