import { waitForDebugger } from 'inspector';
import { Operation } from './operations';
import { newStack } from './stack';

export function synacor(): string {
  return 'synacor';
}

type VMConfig = {
  logger: (char: string) => void;
};

const getOperation = (cursor: number, program: Program): Operation => {
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

type Registers = Uint16Array;
type Program = Uint16Array;

export const getVM = ({ logger }: VMConfig) => {
  const stack = newStack<number>();
  const registers: Registers = new Uint16Array(8);

  const set = (index: number, indexOrValue: number) => {
    if (index < 32768 || index > 32775) {
      throw new Error(`Register index ${index} invalid`);
    }
    const value = get(indexOrValue);
    registers[index - 32768] = value;
  };

  const get = (indexOrValue: number) => {
    if (indexOrValue >= 0 && indexOrValue < 32768) {
      return indexOrValue;
    } else if (indexOrValue >= 32768 && indexOrValue <= 32775) {
      return registers[indexOrValue - 32768];
    } else {
      throw new Error(`Got invalid value ${indexOrValue}`);
    }
  };

  const run = (program: Program) => {
    const commandHistory = [];
    let cursor = 0;
    let running = true;
    let jumped = false;

    const jump = (indexOrValue: number) => {
      const value = get(indexOrValue);
      jumped = true;
      cursor = value;
    };

    while (running) {
      jumped = false;
      const op = getOperation(cursor, program);
      commandHistory.push({
        ...op,
        cursor,
        args: op.args?.map(
          (arg) => `${arg}${arg !== get(arg) ? ` (${get(arg)})` : ''}`
        ),
      });

      switch (op.type) {
        case 'halt':
          running = false;
          break;

        case 'set':
          set(op.args[0], get(op.args[1]));
          break;

        case 'push':
          stack.push(get(op.args[0]));
          break;

        case 'pop':
          console.log('Pop op', {
            commands: program.slice(cursor, cursor + 5),
            cursor,
          });
          set(op.args[0], get(stack.pop()));
          break;

        case 'eq':
          set(op.args[0], get(op.args[1]) === get(op.args[2]) ? 1 : 0);
          break;

        case 'gt':
          console.log(
            `gt: ${op.args[1]}(${get(op.args[1])}) > ${op.args[2]}(${get(
              op.args[2]
            )})`
          );
          set(op.args[0], get(op.args[1]) > get(op.args[2]) ? 1 : 0);
          break;

        case 'jmp':
          jump(op.args[0]);
          break;

        case 'jt':
          if (get(op.args[0]) !== 0) {
            jump(op.args[1]);
          }
          break;

        case 'jf':
          if (get(op.args[0]) === 0) {
            jump(op.args[1]);
          }
          break;

        case 'add':
          set(op.args[0], (get(op.args[1]) + get(op.args[2])) % 32768);
          break;

        case 'and':
          set(op.args[0], get(op.args[1]) & get(op.args[2]));
          break;

        case 'or':
          set(op.args[0], get(op.args[1]) | get(op.args[2]));
          break;

        case 'not':
          set(op.args[0], ~get(op.args[1]));
          break;

        case 'call':
          console.log('Call op', {
            commands: program.slice(cursor, cursor + 5),
            cursor,
          });
          stack.push(cursor + 2);
          jump(op.args[0]);
          break;

        case 'out':
          logger(String.fromCharCode(get(op.args[0])));
          break;

        case 'error':
          throw new Error('VM crashed!');
      }

      if (!jumped) {
        cursor += (op.args?.length || 0) + 1;
        if (cursor === program.length) {
          running = false;
          logger('Reached end of program. Terminating');
        }
      }
    }

    true &&
      console.log({
        commands: commandHistory
          .slice(-30)
          .reverse()
          .map((op) => ({
            cursor: op.cursor,
            op: op.type,
            args: op.args?.join(', '),
          })),
      });
  };

  return {
    run,
    memory: {
      stack,
      registers,
    },
  };
};

getVM({ logger: console.log });
