export type OperationType = Operation['type'];

export type Operation =
  | {
      type: 'halt' | 'noop' | 'error';
      length: number;
      args?: number[];
    }
  | JumpOperation
  | JumpTrueOperation
  | OutOperation;

type JumpOperation = {
  type: 'jmp';
  length: 2;
  args: [number];
};

type JumpTrueOperation = {
  type: 'jt';
  length: 3;
  args: [number, number];
};

type OutOperation = {
  type: 'out';
  length: 2;
  args: [number];
};

export const jumpOperations: OperationType[] = ['jmp', 'jt'];
