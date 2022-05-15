import { decode, encode } from './factorio-blueprint';
import { testDecodedObject, testEncodedString } from '../test';

describe('factorioBlueprint', () => {
  it('should decode correctly', () => {
    expect(decode(testEncodedString)).toEqual(testDecodedObject);
  });

  it('should encode correctly', () => {
    expect(encode(testDecodedObject)).toEqual(testEncodedString);
  });
});
