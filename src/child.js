const spawn = require('cross-spawn');

const head = (string) => string.split(' ')[0];
const tail = (string) => string.split(' ').slice(1);

const child = (name, cmd, keep, term) => {
  let process;
  let output = [];

  const start = () => {
    term(`\nstarting ${name}...\n`);
    process = spawn(head(cmd), tail(cmd));
    process.on('exit', () => {
      term(`\n ${name} exited\n`);
      kill();
    })
    process.on('error', error)

    process.stdout.on('data', out)
    process.stderr.on('data', error)
  }

  const out = (data) => {
    const msg = data.toString('utf-8');
    if (msg.toLowerCase().includes('error')) {
      error(msg);
      return;
    }

    output.push(msg);
  }

  const kill = (force = false) => {
    if (!process) return;
    process.kill();
    process = null;
    if (keep && !force) start();
  }

  const error = (error) => {
    console.error(error);
    kill();
  }

  return {
    name,
    cmd,
    keep,
    start,
    out,
    kill,
    output
  };
}

module.exports = child;