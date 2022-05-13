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
    // console.log(
    //   `call op: saving ${getCursor() + 2}, jumping to ${getValue(a)}`
    // );
    return jump(a);
  };

  const ret = () => {
    const value = stack.pop();
    // console.log(`ret op: returning to ${value}`);
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

// export type OperationType = Operation3['type'];

// export const getOperation = (cursor: number, program: Program): Operation3 => {
//   const getArgs = (length: number) =>
//     program.slice(cursor + 1, cursor + 1 + length);

//   const op = program[cursor];

//   switch (op) {
//     case 0: {
//       return {
//         type: 'halt',
//         args: undefined,
//       };
//     }
//     case 1: {
//       const args = getArgs(2);
//       return {
//         type: 'set',
//         args: [args[0], args[1]],
//       };
//     }
//     case 2: {
//       const args = getArgs(1);
//       return {
//         type: 'push',
//         args: [args[0]],
//       };
//     }
//     case 3: {
//       const args = getArgs(1);
//       return {
//         type: 'pop',
//         args: [args[0]],
//       };
//     }
//     case 4: {
//       const args = getArgs(3);
//       return {
//         type: 'eq',
//         args: [args[0], args[1], args[2]],
//       };
//     }
//     case 5: {
//       const args = getArgs(3);
//       return {
//         type: 'gt',
//         args: [args[0], args[1], args[2]],
//       };
//     }
//     case 6: {
//       const args = getArgs(1);
//       return {
//         type: 'jmp',
//         args: [args[0]],
//       };
//     }
//     case 7: {
//       const args = getArgs(2);
//       return {
//         type: 'jt',
//         args: [args[0], args[1]],
//       };
//     }
//     case 8: {
//       const args = getArgs(2);
//       return {
//         type: 'jf',
//         args: [args[0], args[1]],
//       };
//     }
//     case 9: {
//       const args = getArgs(3);
//       return {
//         type: 'add',
//         args: [args[0], args[1], args[2]],
//       };
//     }
//     case 10: {
//       const args = getArgs(3);
//       return {
//         type: 'mult',
//         args: [args[0], args[1], args[2]],
//       };
//     }
//     case 11: {
//       const args = getArgs(3);
//       return {
//         type: 'mod',
//         args: [args[0], args[1], args[2]],
//       };
//     }
//     case 12: {
//       const args = getArgs(3);
//       return {
//         type: 'and',
//         args: [args[0], args[1], args[2]],
//       };
//     }
//     case 13: {
//       const args = getArgs(3);
//       return {
//         type: 'or',
//         args: [args[0], args[1], args[2]],
//       };
//     }
//     case 14: {
//       const args = getArgs(2);
//       return {
//         type: 'not',
//         args: [args[0], args[1]],
//       };
//     }
//     case 15: {
//       const args = getArgs(2);
//       return {
//         type: 'rmem',
//         args: [args[0], args[1]],
//       };
//     }
//     case 16: {
//       const args = getArgs(2);
//       return {
//         type: 'wmem',
//         args: [args[0], args[1]],
//       };
//     }
//     case 17: {
//       const args = getArgs(1);
//       return {
//         type: 'call',
//         args: [args[0]],
//       };
//     }
//     case 18: {
//       return {
//         type: 'ret',
//         args: undefined,
//       };
//     }
//     case 19: {
//       const args = getArgs(1);
//       return {
//         type: 'out',
//         args: [args[0]],
//       };
//     }
//     case 20: {
//       const args = getArgs(1);
//       return {
//         type: 'in',
//         args: [args[0]],
//       };
//     }
//     case 21: {
//       return {
//         type: 'noop',
//         args: undefined,
//       };
//     }
//     default: {
//       console.log('Cant read op code', { op });

//       return {
//         type: 'error',
//         args: undefined,
//       };
//     }
//   }
// };

// export type Operation3 =
//   | {
//       type: 'error';
//       args: undefined;
//     }
//   | HaltOperation
//   | SetOperation
//   | PushOperation
//   | PopOperation
//   | EqualsOperation
//   | GreaterThanOperation
//   | JumpOperation
//   | JumpTrueOperation
//   | JumpFalseOperation
//   | AddOperation
//   | MultiplyOperation
//   | ModuloOperation
//   | AndOperation
//   | OrOperation
//   | NotOperation
//   | ReadOperation
//   | WriteOperation
//   | CallOperation
//   | ReturnOperation
//   | OutOperation
//   | InOperation
//   | NoOperation;

// type Operation2<
//   Type extends string,
//   Count extends 1 | 2 | 3 | undefined = undefined
// > = {
//   type: Type;
//   args: Count extends 3
//     ? [number, number, number]
//     : Count extends 2
//     ? [number, number]
//     : Count extends 1
//     ? [number]
//     : undefined;
// };

// type SetOperation = Operation2<'set', 2>;

// type PushOperation = Operation2<'push', 1>;

// type PopOperation = Operation2<'pop', 1>;

// type HaltOperation = Operation2<'halt'>;

// type EqualsOperation = Operation2<'eq', 3>;

// type GreaterThanOperation = Operation2<'gt', 3>;

// type JumpOperation = Operation2<'jmp', 1>;

// type JumpTrueOperation = Operation2<'jt', 2>;

// type JumpFalseOperation = Operation2<'jf', 2>;

// type AddOperation = Operation2<'add', 3>;

// type MultiplyOperation = Operation2<'mult', 3>;

// type ModuloOperation = Operation2<'mod', 3>;

// type AndOperation = Operation2<'and', 3>;

// type OrOperation = Operation2<'or', 3>;

// type NotOperation = Operation2<'not', 2>;

// type ReadOperation = Operation2<'rmem', 2>;

// type WriteOperation = Operation2<'wmem', 2>;

// type CallOperation = Operation2<'call', 1>;

// type ReturnOperation = Operation2<'ret'>;

// type OutOperation = Operation2<'out', 1>;

// type InOperation = Operation2<'in', 1>;

// type NoOperation = Operation2<'noop'>;
