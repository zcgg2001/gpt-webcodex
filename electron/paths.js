const path = require('node:path');
const { app } = require('electron');

function resourcesRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(app.getAppPath(), 'resources');
}

function dataRoot() {
  return app.getPath('userData');
}

function tunnelBinaryName(platform = process.platform, arch = process.arch) {
  if (platform === 'win32') return 'tunnel-client.exe';
  if (platform === 'darwin') return `tunnel-client-darwin-${arch}`;
  return `tunnel-client-${platform}-${arch}`;
}

function portablePythonPath(platform = process.platform) {
  return platform === 'win32'
    ? path.join(resourcesRoot(), 'native-python', 'python.exe')
    : path.join(resourcesRoot(), 'native-python', 'bin', 'python3');
}

module.exports = {
  resourcesRoot,
  dataRoot,
  settingsFile: () => path.join(dataRoot(), 'settings.json'),
  secretsFile: () => path.join(dataRoot(), 'secrets.bin'),
  stateFile: () => path.join(dataRoot(), 'runtime-state.json'),
  logFile: () => path.join(dataRoot(), 'logs', 'assistant.log'),
  mcpLogFile: () => path.join(dataRoot(), 'logs', 'mcp.log'),
  tunnelLogFile: () => path.join(dataRoot(), 'logs', 'tunnel.log'),
  tunnelExecutable: () => path.join(resourcesRoot(), 'tools', tunnelBinaryName()),
  portablePython: () => portablePythonPath(),
  tunnelBinaryName,
  portablePythonPath
};

