import { reader, getVM } from '@projects/synacor-lib';

console.log('Hello World!');

const data = reader('./libs/synacor/challenge.bin');

const vm = getVM({ logger: (val) => process.stdout.write(val) });

vm.run(data);
