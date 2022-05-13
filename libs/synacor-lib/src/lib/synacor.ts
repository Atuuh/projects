import { getOperations, Operation, OperationHandler } from './operations';
import { Program } from './program';
import { createRegisters, Registers } from './registers';
import { createStack, Stack } from './stack';

type VMConfig = {
  logger: (char: string) => void;
  getInput: () => Promise<string>;
};

export const createVm = ({ logger, getInput }: VMConfig) => {
  let registers: Registers;
  let stack: Stack<number>;
  let cursor: number;

  const init = () => {
    registers = createRegisters();
    stack = createStack();
    cursor = 0;
  };

  const doOperation = (fn: OperationHandler) => {
    const moveCursor = async (...args: Parameters<typeof fn>) => {
      // console.log('Running op', fn.name, args);
      const jumped = await fn(...args);
      if (typeof jumped === 'number') {
        cursor = jumped;
      } else {
        cursor += (args.length || 0) + 1;
      }
    };
    return moveCursor;
  };

  let opCount = 0;
  const run = async (program: Program) => {
    init();
    const operations = getOperations(
      program,
      registers,
      stack,
      getInput,
      logger,
      () => cursor
    );
    console.log(`program length: ${program.length}`);

    do {
      const opcode = program[cursor] as Operation;
      const operation = operations[opcode];

      if (!operation) {
        throw new Error(`Couldn't get operation for opcode ${opcode}`);
      }

      const getArgs = (count: number) => [
        ...program.slice(cursor + 1, cursor + 1 + count),
      ];

      const args = getArgs(operation.length || 0) as [number, number, number];
      await doOperation(operation)(...args);
      opCount += 1;
    } while (cursor < program.length);
    console.log('run finished', opCount);
    return { __debug: { registers: registers.toArray(), cursor } };
  };

  return { run };
};
