export type OperationType = Operation['type'];

export type Operation =
  | {
      type: 'halt' | 'noop' | 'error';
      length: number;
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
  | OutOperation;

type SetOperation = {
  type: 'set';
  length: 3;
  args: [number, number];
};

type PushOperation = {
  type: 'push';
  length: 2;
  args: [number];
};

type PopOperation = {
  type: 'pop';
  length: 2;
  args: [number];
};

type EqualsOperation = {
  type: 'eq';
  length: 4;
  args: [number, number, number];
};

type GreaterThanOperation = {
  type: 'gt';
  length: 4;
  args: [number, number, number];
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

type AndOperation = {
  type: 'and';
  length: 4;
  args: [number, number, number];
};

type OutOperation = {
  type: 'out';
  length: 2;
  args: [number];
};
