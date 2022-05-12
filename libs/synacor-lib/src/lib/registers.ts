export type Registers = Uint16Array;

export const isRegisterIndex = (index: number) =>
  index >= 32768 && index <= 32775;
