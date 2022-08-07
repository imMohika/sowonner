const termkit = require('terminal-kit');
const term = termkit.terminal;

const child = require('./child');

const runningProcesses = [];
const exitedProcesses = [];

const terminate = (code = 0) => {
  term.grabInput(false);
  setTimeout(() => {
    term.processExit(code);
  }, 100);
}

term.on('key', (name, matches, data) => {
  if (name === "CTRL_C") {
    terminate();
  }
})

const println = (str) => term(str + '\n');

println('-=- sOwOnner -=-');
println('commands:')
println('- add [name] {-k} -{l} [cmd]');
println('- remove [name]');
println('- show [name]');
println('- list');
println('- exit');
println('----')

const run = async () => {
  while (true) {
    term('\n> ');
    const input = await term.inputField({}).promise;
    const [cmd, ...args] = input.split(' ');
    const name = args[0]?.toLowerCase();
    term('\n')

    switch (cmd) {
      case 'add':
        const cmd = args.slice(1).join(' ');
        const keep = args.includes('-k');
        if (!name || !cmd) {
          term.error('invalid arguments');
        }

        println(`adding ${name}...`);
        const newChild = child(name, cmd, keep, term);
        newChild.start();
        runningProcesses.push(newChild);
        println(`added ${name}!`);
        break;
      case 'remove':
        if (!name) {
          term.error('invalid arguments');
          terminate(1);
        }

        println(`removing ${name}`);
        const childToRemove = runningProcesses.find(c => c.name === name);
        childToRemove.kill(true);
        break;
      case 'list':
        runningProcesses.forEach(p => {
          println(`${p.name} - ${p.cmd}`);
        });
        break;
      case 'show':
        const process = runningProcesses.find(p => p.name === name)
        if (!process) {
          println(`could not find process ${name}`);
          return;
        }
        println(`${process.name} - ${process.cmd}`);
        println(process.output.join('\n'))
        break;
      case 'exit':
        terminate();
        break;
      default:
        term.error('invalid command');
    }
  }
}

run();
