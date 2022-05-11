export type OperationType = Operation['type'];

export type Operation =
  | {
      type: 'halt' | 'noop' | 'error';
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
  | OrOperation
  | NotOperation
  | CallOperation
  | OutOperation;

type SetOperation = {
  type: 'set';
  args: [number, number];
};

type PushOperation = {
  type: 'push';
  args: [number];
};

type PopOperation = {
  type: 'pop';
  args: [number];
};

type EqualsOperation = {
  type: 'eq';
  args: [number, number, number];
};

type GreaterThanOperation = {
  type: 'gt';
  args: [number, number, number];
};

type JumpOperation = {
  type: 'jmp';
  args: [number];
};

type JumpTrueOperation = {
  type: 'jt';
  args: [number, number];
};

type JumpFalseOperation = {
  type: 'jf';
  args: [number, number];
};

type AddOperation = {
  type: 'add';
  args: [number, number, number];
};

type AndOperation = {
  type: 'and';
  args: [number, number, number];
};

type OrOperation = {
  type: 'or';
  args: [number, number, number];
};

type NotOperation = {
  type: 'not';
  args: [number, number];
};

type CallOperation = {
  type: 'call';
  args: [number];
};

type OutOperation = {
  type: 'out';
  args: [number];
};
