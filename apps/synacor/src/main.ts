import { reader, getVM } from '@projects/synacor-lib';
import { stdin, stdout } from 'process';
import * as readline from 'readline';

const data = reader('./apps/synacor/challenge.bin');

// const getInput = () =>
//   new Promise<string>((resolve) => {
//     stdin.setRawMode(true);
//     stdin.resume();
//     stdin.setEncoding('utf-8');
//     stdin.once('data', (character) => {
//       const char = character as unknown as string;
//       stdin.pause();
//       if (char === '\x03') {
//         process.exit();
//       }
//       stdout.write(char);
//       resolve(char.replace('\r', '\n'));
//     });
//   });

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
      rl.question('', (line) => {
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
