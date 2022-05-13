import { Program } from './program';
import { isIndex, Registers } from './registers';
import { Stack } from './stack';

export enum Operation {
  Halt = 0,
  Set = 1,
  Push = 2,
  Pop = 3,
  Eq = 4,
  Gt = 5,
  Jmp = 6,
  Jt = 7,
  Jf = 8,
  Add = 9,
  Mult = 10,
  Mod = 11,
  And = 12,
  Or = 13,
  Not = 14,
  Rmem = 15,
  Wmem = 16,
  Call = 17,
  Ret = 18,
  Out = 19,
  In = 20,
  Noop = 21,
}

const isValue = (value: number) => value >= 0 && value < 32768;

export type OperationHandler = (
  ...args: [number, number, number]
) => number | void | Promise<void>;
type Operations = Record<Operation, OperationHandler>;

export const getOperations = (
  program: Program,
  registers: Registers,
  stack: Stack<number>,
  getChar: () => Promise<string>,
  print: (char: string) => void,
  getCursor: () => number
): Operations => {
  const getValue = (indexOrValue: number) => {
    if (isIndex(indexOrValue)) {
      return registers.get(indexOrValue);
    } else if (isValue(indexOrValue)) {
      return indexOrValue;
    } else {
      throw new RangeError('Not a value or index');
    }
  };

  const halt = () => {
    return Number.MAX_VALUE;
  };

  const set = (a: number, b: number) => {
    registers.set(a, b);
  };

  const push = (a: number) => {
    stack.push(getValue(a));
  };

  const pop = (a: number) => {
    registers.set(a, stack.pop());
  };

  const equal = (a: number, b: number, c: number) => {
    registers.set(a, getValue(b) === getValue(c) ? 1 : 0);
  };

  const gt = (a: number, b: number, c: number) => {
    registers.set(a, getValue(b) > getValue(c) ? 1 : 0);
  };

  const jump = (a: number) => {
    return getValue(a);
  };

  const jumpTrue = (a: number, b: number) => {
    if (getValue(a) !== 0) {
      return jump(b);
    }
    return;
  };

  const jumpFalse = (a: number, b: number) => {
    if (getValue(a) === 0) {
      return jump(b);
    }
    return;
  };

  const add = (a: number, b: number, c: number) => {
    registers.set(a, (getValue(b) + getValue(c)) % 32768);
  };

  const mult = (a: number, b: number, c: number) => {
    registers.set(a, (getValue(b) * getValue(c)) % 32768);
  };

  const mod = (a: number, b: number, c: number) => {
    registers.set(a, getValue(b) % getValue(c));
  };

  const and = (a: number, b: number, c: number) => {
    registers.set(a, (getValue(b) & getValue(c)) % 32768);
  };

  const or = (a: number, b: number, c: number) => {
    registers.set(a, getValue(b) | getValue(c));
  };

  const out = (a: number) => {
    print(String.fromCharCode(getValue(a)));
  };

  const not = (a: number, b: number) => {
    registers.set(a, ~getValue(b) & 0x7fff);
  };

  const rmem = (a: number, b: number) => {
    registers.set(a, program[getValue(b)]);
  };

  const wmem = (a: number, b: number) => {
    program[getValue(a)] = getValue(b);
  };

  const call = (a: number) => {
    stack.push(getCursor() + 2);
    return jump(a);
  };

  const ret = () => {
    const value = stack.pop();
    return getValue(value);
  };

  const input = async (a: number) => {
    const input = await getChar();
    registers.set(a, input.charCodeAt(0));
    if (input === '~') {
      console.log({ registers: registers.toArray(), stack: stack.values });
    }
  };

  const noop = () => {
    return;
  };

  return {
    [Operation.Halt]: halt,
    [Operation.Set]: set,
    [Operation.Push]: push,
    [Operation.Pop]: pop,
    [Operation.Eq]: equal,
    [Operation.Gt]: gt,
    [Operation.Jmp]: jump,
    [Operation.Jt]: jumpTrue,
    [Operation.Jf]: jumpFalse,
    [Operation.Add]: add,
    [Operation.Mult]: mult,
    [Operation.Mod]: mod,
    [Operation.And]: and,
    [Operation.Or]: or,
    [Operation.Not]: not,
    [Operation.Rmem]: rmem,
    [Operation.Wmem]: wmem,
    [Operation.Call]: call,
    [Operation.Ret]: ret,
    [Operation.Out]: out,
    [Operation.In]: input,
    [Operation.Noop]: noop,
  };
};
