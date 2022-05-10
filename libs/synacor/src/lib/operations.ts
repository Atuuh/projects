export type OperationType = Operation['type'];

export type Operation =
  | {
      type: 'halt' | 'noop' | 'error';
      length: number;
      args?: number[];
    }
  | SetOperation
  | JumpOperation
  | JumpTrueOperation
  | JumpFalseOperation
  | AddOperation
  | OutOperation;

export type SetOperation = {
  type: 'set';
  length: 3;
  args: [number, number];
};

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

type JumpFalseOperation = {
  type: 'jf';
  length: 3;
  args: [number, number];
};

type AddOperation = {
  type: 'add';
  length: 4;
  args: [number, number, number];
};

type OutOperation = {
  type: 'out';
  length: 2;
  args: [number];
};
