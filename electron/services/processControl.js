const { run } = require('./commandRunner');

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function isAlive(pid) {
  if (!Number.isInteger(pid)) return false;
  try { process.kill(pid, 0); return true; } catch { return false; }
}

async function terminateProcess(pid) {
  if (!isAlive(pid)) return false;
  if (process.platform === 'win32') {
    await run('taskkill.exe', ['/PID', String(pid), '/T', '/F'], { allowFailure: true });
    return true;
  }
  try { process.kill(pid, 'SIGTERM'); } catch { return false; }
  for (let index = 0; index < 20; index += 1) {
    if (!isAlive(pid)) return true;
    await wait(100);
  }
  try { process.kill(pid, 'SIGKILL'); } catch { /* already exited */ }
  return true;
}

module.exports = { isAlive, terminateProcess };
