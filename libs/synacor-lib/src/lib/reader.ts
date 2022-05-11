import * as fs from 'fs';
import { resolve } from 'path';

export const reader = (path: string) => {
  const fullPath = resolve(path);
  const buffer = fs.readFileSync(fullPath);
  return new Uint16Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.length / Uint16Array.BYTES_PER_ELEMENT
  );
};
