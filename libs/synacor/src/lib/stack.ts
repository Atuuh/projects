export const newStack = <T>() => {
  const values: T[] = [];

  const push = (value: T) => {
    values.push(value);
    console.log(`stack: pushed ${value} onto [${values.join(', ')}]`);
  };

  const pop = () => {
    const value = values.pop();
    console.log(`stack: popped ${value} from [${values.join(', ')}]`);

    if (value === undefined) {
      throw new Error('Empty stack cannot be popped');
    }
    return value;
  };

  return {
    push,
    pop,
  };
};
