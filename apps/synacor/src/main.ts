import { reader, getVM } from '@projects/synacor-lib';
import { stdin, stdout } from 'process';
import * as readline from 'readline';

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

const vm = getVM({ logger: (val) => process.stdout.write(val), getInput });

const intcodePrint = (message: string) =>
  message.split('').flatMap((char) => [19, char.charCodeAt(0)]);

vm.run(data);
