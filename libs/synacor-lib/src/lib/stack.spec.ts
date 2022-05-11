import { newStack } from './stack';

describe('stack', () => {
  it('should work correctly', () => {
    const stack = newStack();

    stack.push(5);
    stack.push(10);
    stack.push(15);

    expect(stack.pop()).toBe(15);
    expect(stack.pop()).toBe(10);
    expect(stack.pop()).toBe(5);
  });
});
