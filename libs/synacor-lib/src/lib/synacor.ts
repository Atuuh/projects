import { getOperation } from './operations';
import { Program } from './program';
import { Registers } from './registers';
import { newStack } from './stack';

type VMConfig = {
  logger: (char: string) => void;
  getInput: () => Promise<string>;
};

export const getVM = ({ logger, getInput }: VMConfig) => {
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

  const run = async (program: Program) => {
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
          set(op.args[0], get(stack.pop()));
          break;

        case 'eq':
          set(op.args[0], get(op.args[1]) === get(op.args[2]) ? 1 : 0);
          break;

        case 'gt':
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
          stack.push(cursor + 2);
          jump(op.args[0]);
          break;

        case 'ret':
          jump(stack.pop());
          break;

        case 'out':
          logger(String.fromCharCode(get(op.args[0])));
          break;

        case 'in': {
          const input = await getInput();
          set(op.args[0], input.charCodeAt(0));
          if (input === '~') {
            console.log(registers, stack.values);
          }
          break;
        }

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
  };

  return {
    run,
    memory: {
      stack,
      registers,
    },
  };
};
