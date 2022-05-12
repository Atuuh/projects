import { Program } from './program';

export type OperationType = Operation['type'];

export const getOperation = (cursor: number, program: Program): Operation => {
  const getArgs = (length: number) =>
    program.slice(cursor + 1, cursor + 1 + length);

  const op = program[cursor];

  switch (op) {
    case 0: {
      return {
        type: 'halt',
        args: undefined,
      };
    }
    case 1: {
      const args = getArgs(2);
      return {
        type: 'set',
        args: [args[0], args[1]],
      };
    }
    case 2: {
      const args = getArgs(1);
      return {
        type: 'push',
        args: [args[0]],
      };
    }
    case 3: {
      const args = getArgs(1);
      return {
        type: 'pop',
        args: [args[0]],
      };
    }
    case 4: {
      const args = getArgs(3);
      return {
        type: 'eq',
        args: [args[0], args[1], args[2]],
      };
    }
    case 5: {
      const args = getArgs(3);
      return {
        type: 'gt',
        args: [args[0], args[1], args[2]],
      };
    }
    case 6: {
      const args = getArgs(1);
      return {
        type: 'jmp',
        args: [args[0]],
      };
    }
    case 7: {
      const args = getArgs(2);
      return {
        type: 'jt',
        args: [args[0], args[1]],
      };
    }
    case 8: {
      const args = getArgs(2);
      return {
        type: 'jf',
        args: [args[0], args[1]],
      };
    }
    case 9: {
      const args = getArgs(3);
      return {
        type: 'add',
        args: [args[0], args[1], args[2]],
      };
    }
    case 10: {
      const args = getArgs(3);
      return {
        type: 'mult',
        args: [args[0], args[1], args[2]],
      };
    }
    case 11: {
      const args = getArgs(3);
      return {
        type: 'mod',
        args: [args[0], args[1], args[2]],
      };
    }
    case 12: {
      const args = getArgs(3);
      return {
        type: 'and',
        args: [args[0], args[1], args[2]],
      };
    }
    case 13: {
      const args = getArgs(3);
      return {
        type: 'or',
        args: [args[0], args[1], args[2]],
      };
    }
    case 14: {
      const args = getArgs(2);
      return {
        type: 'not',
        args: [args[0], args[1]],
      };
    }
    case 15: {
      const args = getArgs(2);
      return {
        type: 'rmem',
        args: [args[0], args[1]],
      };
    }
    case 16: {
      const args = getArgs(2);
      return {
        type: 'wmem',
        args: [args[0], args[1]],
      };
    }
    case 17: {
      const args = getArgs(1);
      return {
        type: 'call',
        args: [args[0]],
      };
    }
    case 19: {
      const args = getArgs(1);
      return {
        type: 'out',
        args: [args[0]],
      };
    }
    case 21: {
      return {
        type: 'noop',
        args: undefined,
      };
    }
    default: {
      console.log('Cant read op code', { op });

      return {
        type: 'error',
        args: undefined,
      };
    }
  }
};

export type Operation =
  | {
      type: 'error';
      args: undefined;
    }
  | HaltOperation
  | SetOperation
  | PushOperation
  | PopOperation
  | EqualsOperation
  | GreaterThanOperation
  | JumpOperation
  | JumpTrueOperation
  | JumpFalseOperation
  | AddOperation
  | MultiplyOperation
  | ModuloOperation
  | AndOperation
  | OrOperation
  | NotOperation
  | ReadOperation
  | WriteOperation
  | CallOperation
  | OutOperation
  | NoOperation;

type Operation2<
  Type extends string,
  Count extends 1 | 2 | 3 | undefined = undefined
> = {
  type: Type;
  args: Count extends 3
    ? [number, number, number]
    : Count extends 2
    ? [number, number]
    : Count extends 1
    ? [number]
    : undefined;
};

type SetOperation = Operation2<'set', 2>;

type PushOperation = Operation2<'push', 1>;

type PopOperation = Operation2<'pop', 1>;

type HaltOperation = Operation2<'halt'>;

type EqualsOperation = Operation2<'eq', 3>;

type GreaterThanOperation = Operation2<'gt', 3>;

type JumpOperation = Operation2<'jmp', 1>;

type JumpTrueOperation = Operation2<'jt', 2>;

type JumpFalseOperation = Operation2<'jf', 2>;

type AddOperation = Operation2<'add', 3>;

type MultiplyOperation = Operation2<'mult', 3>;

type ModuloOperation = Operation2<'mod', 3>;

type AndOperation = Operation2<'and', 3>;

type OrOperation = Operation2<'or', 3>;

type NotOperation = Operation2<'not', 2>;

type ReadOperation = Operation2<'rmem', 2>;

type WriteOperation = Operation2<'wmem', 2>;

type CallOperation = Operation2<'call', 1>;

type OutOperation = Operation2<'out', 1>;

type NoOperation = Operation2<'noop'>;
