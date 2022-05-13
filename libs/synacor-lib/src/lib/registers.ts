export type Registers = ReturnType<typeof createRegisters>;

type Index = number & { readonly index: unique symbol };

export const isIndex = (index: number): index is Index =>
  index >= 32768 && index <= 32775;

export const createRegisters = () => {
  const registers = new Uint16Array(8);

  const set = (index: number, value: number) => {
    if (!isIndex(index)) {
      throw new RangeError(`${index} is not a valid register index`);
    }
    registers[index - 32768] = isIndex(value) ? get(value) : value;
  };

  const get = (index: number) => {
    if (!isIndex(index)) {
      throw new RangeError(`${index} is not a valid register index`);
    }
    return registers[index - 32768];
  };

  return {
    set,
    get,
    toArray: () => [...registers],
  };
};
