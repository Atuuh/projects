import { reader } from './lib/reader';
import { getVM } from './lib/synacor';

export * from './lib/synacor';

const data = reader('./libs/synacor/challenge.bin');

const vm = getVM({ logger: (val) => process.stdout.write(val) });

vm.run(data);
