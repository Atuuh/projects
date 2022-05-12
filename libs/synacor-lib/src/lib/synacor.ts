import { getOperation } from './operations';
import { Program } from './program';
import { isRegisterIndex, Registers } from './registers';
import { newStack } from './stack';

type VMConfig = {
  logger: (char: string) => void;
};

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

        case 'mult':
          set(op.args[0], (get(op.args[1]) * get(op.args[2])) % 32768);
          break;

        case 'mod':
          set(op.args[0], get(op.args[1]) % get(op.args[2]));
          break;

        case 'or':
          set(op.args[0], get(op.args[1]) | get(op.args[2]));
          break;

        case 'not':
          set(op.args[0], ~get(op.args[1]) & 0x7fff);
          break;

        case 'rmem':
          set(op.args[0], program[get(op.args[1])]);
          break;

        case 'wmem':
          program[get(op.args[0])] = get(op.args[1]);
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
