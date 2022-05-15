import * as zlib from 'zlib';

export const decode = (encodedString: string) => {
  const buffer = zlib.inflateSync(
    Buffer.from(encodedString.slice(1), 'base64'),
    {
      level: 9,
    }
  );
  return JSON.parse(buffer.toString());
};

export const encode = (decodedString: any) => {
  const json = JSON.stringify(decodedString);
  const compressed = zlib.deflateSync(Buffer.from(json), {
    level: 9,
  });
  return '0'.concat(compressed.toString('base64'));
};
