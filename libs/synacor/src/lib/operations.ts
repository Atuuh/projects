export type OperationType = Operation['type'];

export type Operation =
  | {
      type: 'halt' | 'noop' | 'error';
      length: number;
      args?: number[];
    }
  | OutOperation;

type OutOperation = {
  type: 'out';
  length: 2;
  args: [number];
};

export const jumpOperations: OperationType[] = [];
