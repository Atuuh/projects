export type Stack<T> = {
  push: (value: T) => void;
  pop: () => T;
  values: ReadonlyArray<T>;
};

export const createStack = <T>(): Stack<T> => {
  const values: T[] = [];

  const push = (value: T) => {
    values.push(value);
  };

  const pop = () => {
    const value = values.pop();
    if (value === undefined) {
      throw new Error('Empty stack cannot be popped');
    }
    return value;
  };

  return {
    push,
    pop,
    values: values as ReadonlyArray<T>,
  };
};
