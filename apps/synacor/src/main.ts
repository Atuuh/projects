import { stdin, stdout } from 'process';
import * as readline from 'readline';
import { createVm, reader } from '@projects/synacor-lib';

const data = reader('./apps/synacor/challenge.bin');

let bufferInput = '';
const getChar = () => {
  if (bufferInput.length > 0) {
    const char = bufferInput[0];
    bufferInput = bufferInput.slice(1);
    return char;
  }
  throw new Error('No text remaining');
};

const getInput = async () =>
  new Promise<string>((resolve) => {
    if (bufferInput.length > 0) {
      resolve(getChar());
    } else {
      const rl = readline.createInterface({ input: stdin, output: stdout });
      rl.question('> ', (line) => {
        bufferInput = line.concat('\n');
        resolve(getChar());
        rl.close();
      });
    }
  });

const machine = createVm({
  logger: (val) => process.stdout.write(val),
  getInput,
});

machine.run(data).then((result) => console.log(result));
