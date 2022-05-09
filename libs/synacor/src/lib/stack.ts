export const newStack = <T>() => {
  const values: T[] = [];

  return {
    push: values.push,
    pop: values.pop,
  };
};
