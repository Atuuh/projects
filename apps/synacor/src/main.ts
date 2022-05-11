import { reader, getVM } from '@projects/synacor-lib';

const data = reader('./apps/synacor/challenge.bin');

const vm = getVM({ logger: (val) => process.stdout.write(val) });

const intcodePrint = (message: string) =>
  message.split('').flatMap((char) => [19, char.charCodeAt(0)]);

vm.run(data);
//   new Uint16Array([
//     1,
//     32768,
//     10,
//     1,
//     32769,
//     15,
//     5,
//     32770,
//     32769,
//     32768,
//     7,
//     32770,
//     14,
//     0,
//     ...intcodePrint('ERROR FAILED\n'),
//     0,
//   ])
