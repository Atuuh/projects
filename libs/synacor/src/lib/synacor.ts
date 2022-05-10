import { waitForDebugger } from 'inspector';
import { Operation } from './operations';
import { newStack } from './stack';

export function synacor(): string {
  return 'synacor';
}

type VMConfig = {
  logger: (char: string) => void;
};

const getOperation = (
  cursor: number,
  program: Program,
  registers: Registers
): Operation => {
  const getArgs = (length: number) =>
    program
      .slice(cursor + 1, cursor + 1 + length)
      .map((arg) => getValue(arg, registers));

  const op = getValue(program[cursor], registers);

  switch (op) {
    case 0: {
      return {
        type: 'halt',
        length: 1,
      };
    }
    case 1: {
      const args = getArgs(2);
      if (args[0] < 0 || args[0] > 7) {
        throw new Error('Attempted to address register index out of range');
      }
      return {
        type: 'set',
        length: 3,
        args: [program[cursor + 1] - 32768, args[1]],
      };
    }
    case 2: {
      const args = getArgs(1);
      return {
        type: 'push',
        length: 2,
        args: [args[0]],
      };
    }
    case 3: {
      const args = getArgs(1);
      return {
        type: 'pop',
        length: 2,
        args: [args[0]],
      };
    }
    case 4: {
      const args = getArgs(3);
      return {
        type: 'add',
        length: 4,
        args: [program[cursor + 1] - 32768, args[1], args[2]],
      };
    }
    case 6: {
      const args = getArgs(1);
      return {
        type: 'jmp',
        length: 2,
        args: [args[0]],
      };
    }
    case 7: {
      const args = getArgs(2);
      return {
        type: 'jt',
        length: 3,
        args: [args[0], args[1]],
      };
    }
    case 8: {
      const args = getArgs(2);
      return {
        type: 'jf',
        length: 3,
        args: [args[0], args[1]],
      };
    }
    case 9: {
      const args = getArgs(3);
      return {
        type: 'add',
        length: 4,
        args: [program[cursor + 1] - 32768, args[1], args[2]],
      };
    }
    case 19: {
      const args = getArgs(1);
      return {
        type: 'out',
        length: 2,
        args: [args[0]],
      };
    }
    case 21: {
      return {
        type: 'noop',
        length: 1,
      };
    }
    default: {
      console.log('Cant read op code', { op });

      return {
        type: 'error',
        length: -1,
      };
    }
  }
};

const getValue = (value: number, registers: Registers) => {
  if (value !== (value & 0xffff)) {
    throw new Error(`${value} is not 16bit`);
  }
  if (value >= 0 && value <= 32767) {
    return value;
  } else if (value >= 32768 && value <= 32775) {
    return registers[value - 32768];
  } else {
    throw new Error(`${value} is invalid`);
  }
};

type Registers = Uint16Array;
type Program = Uint16Array;

export const getVM = ({ logger }: VMConfig) => {
  const stack = newStack<number>();
  const registers: Registers = new Uint16Array(8);

  const run = (program: Program) => {
    const commandHistory = [];
    let cursor = 0;
    let running = true;

    while (running) {
      let jumped = false;
      const op = getOperation(cursor, program, registers);
      commandHistory.push(op);

      switch (op.type) {
        case 'halt':
          running = false;
          break;

        case 'set':
          registers[op.args[0]] = op.args[1];
          break;

        case 'push':
          stack.push(op.args[0]);
          break;

        case 'pop':
          registers[op.args[0]] = stack.pop();
          break;

        case 'eq':
          waitForDebugger();
          registers[op.args[0]] = op.args[1] === op.args[2] ? 1 : 0;
          break;

        case 'jmp':
          cursor = op.args[0];
          jumped = true;
          break;

        case 'jt':
          if (op.args[0] !== 0) {
            cursor = op.args[1];
            jumped = true;
          }
          break;

        case 'jf':
          if (op.args[0] === 0) {
            cursor = op.args[1];
            jumped = true;
          }
          break;

        case 'add':
          registers[op.args[0]] = (op.args[1] + op.args[2]) % 32768;
          break;

        case 'out':
          logger(String.fromCharCode(op.args[0]));
          break;

        case 'error':
          throw new Error('VM crashed!');
      }

      if (!jumped) {
        cursor += op.length;
        if (cursor === program.length) {
          running = false;
          logger('Reached end of program. Terminating');
        }
      }
    }

    true &&
      console.log({
        commands: commandHistory
          .slice(-20)
          .reverse()
          .map((op) => ({
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
