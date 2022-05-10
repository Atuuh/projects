export type OperationType = Operation['type'];

export type Operation =
  | {
      type: 'halt' | 'noop' | 'error';
      length: number;
      args?: number[];
    }
  | JumpOperation
  | OutOperation;

type JumpOperation = {
  type: 'jmp';
  length: 2;
  args: [number];
};

type OutOperation = {
  type: 'out';
  length: 2;
  args: [number];
};

export const jumpOperations: OperationType[] = ['jmp'];
