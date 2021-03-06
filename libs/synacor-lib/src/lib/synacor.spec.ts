import { createVm } from './synacor';

describe('synacor vm', () => {
  it('should handle print commands', () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    vm.run(new Uint16Array([19, 97]));

    expect(logFn).toBeCalledWith('a');
  });

  it('should handle halt commands', () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    vm.run(new Uint16Array([0, 19, 97]));

    expect(logFn).not.toBeCalledWith('a');
  });

  it('should handle gt commands', async () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    const result = await vm.run(
      new Uint16Array([
        5, 32768, 4, 2, 5, 32769, 2, 4, 5, 32770, 32768, 32769, 5, 32771, 0,
        32768, 5, 32772, 10, 10,
      ])
    );

    expect(result.__debug.registers[0]).toBe(1);
    expect(result.__debug.registers[1]).toBe(0);
    expect(result.__debug.registers[2]).toBe(1);
    expect(result.__debug.registers[3]).toBe(0);
    expect(result.__debug.registers[4]).toBe(0);
  });

  it('should handle push and pop commands', async () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    const result = await vm.run(
      new Uint16Array([2, 5, 2, 10, 2, 15, 3, 32768, 3, 32769, 3, 32770])
    );

    expect(result.__debug.registers[0]).toBe(15);
    expect(result.__debug.registers[1]).toBe(10);
    expect(result.__debug.registers[2]).toBe(5);
  });

  it('should handle call commands', async () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    await vm.run(
      new Uint16Array([
        17,
        5,
        19,
        'a'.charCodeAt(0),
        0,
        19,
        'b'.charCodeAt(0),
        3,
        32768,
        6,
        32768,
        19,
        'z'.charCodeAt(0),
        0,
      ])
    );

    expect(logFn).toHaveBeenNthCalledWith(1, 'b');
    expect(logFn).toHaveBeenNthCalledWith(2, 'a');
    expect(logFn).not.toHaveBeenCalledWith('z');
  });

  it('should handle ret commands', async () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    await vm.run(
      new Uint16Array([
        17,
        5,
        19,
        'a'.charCodeAt(0),
        0,
        19,
        'b'.charCodeAt(0),
        18,
        19,
        'z'.charCodeAt(0),
        0,
      ])
    );

    expect(logFn).toHaveBeenNthCalledWith(1, 'b');
    expect(logFn).toHaveBeenNthCalledWith(2, 'a');
    expect(logFn).not.toHaveBeenCalledWith('z');
  });

  it('should handle not operations', async () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    const result = await vm.run(new Uint16Array([14, 32768, 0x00ff]));

    expect(result.__debug.registers[0]).toBe(0x7f00);
  });

  it('should handle wmem operations', async () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    const result = await vm.run(
      new Uint16Array([16, 3, 19, 0, 'a'.charCodeAt(0)])
    );

    expect(logFn).toBeCalledWith('a');
  });

  it('should handle rmem operations', async () => {
    const logFn = jest.fn();
    const inputFn = jest.fn();
    const vm = createVm({ logger: logFn, getInput: inputFn });

    const result = await vm.run(new Uint16Array([15, 32768, 4, 0, 100]));

    expect(result.__debug.registers[0]).toBe(100);
  });
});
