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
        type: 'add',
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
      };
    }
    default: {
      console.log('Cant read op code', { op });

      return {
        type: 'error',
      };
    }
  }
};

export type Operation =
  | {
      type: 'halt' | 'noop' | 'error';
      args?: number[];
    }
  | SetOperation
  | PushOperation
  | PopOperation
  | EqualsOperation
  | GreaterThanOperation
  | JumpOperation
  | JumpTrueOperation
  | JumpFalseOperation
  | AddOperation
  | AndOperation
  | OrOperation
  | NotOperation
  | CallOperation
  | OutOperation;

type SetOperation = {
  type: 'set';
  args: [number, number];
};

type PushOperation = {
  type: 'push';
  args: [number];
};

type PopOperation = {
  type: 'pop';
  args: [number];
};

type EqualsOperation = {
  type: 'eq';
  args: [number, number, number];
};

type GreaterThanOperation = {
  type: 'gt';
  args: [number, number, number];
};

type JumpOperation = {
  type: 'jmp';
  args: [number];
};

type JumpTrueOperation = {
  type: 'jt';
  args: [number, number];
};

type JumpFalseOperation = {
  type: 'jf';
  args: [number, number];
};

type AddOperation = {
  type: 'add';
  args: [number, number, number];
};

type AndOperation = {
  type: 'and';
  args: [number, number, number];
};

type OrOperation = {
  type: 'or';
  args: [number, number, number];
};

type NotOperation = {
  type: 'not';
  args: [number, number];
};

type CallOperation = {
  type: 'call';
  args: [number];
};

type OutOperation = {
  type: 'out';
  args: [number];
};
