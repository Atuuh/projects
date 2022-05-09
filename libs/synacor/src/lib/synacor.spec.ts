import { getVM } from './synacor';

describe('synacor vm', () => {
  it('should handle print commands', () => {
    const logFn = jest.fn();
    const vm = getVM({ logger: logFn });

    vm.run([19, 97]);

    expect(logFn).toBeCalledWith('a');
  });

  it('should handle halt commands', () => {
    const logFn = jest.fn();
    const vm = getVM({ logger: logFn });

    vm.run([0, 19, 97]);

    expect(logFn).not.toBeCalledWith('a');
  });
});
