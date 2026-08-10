const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { normalize, validateRuntimeSettings, mergeRecentWorkspaces, workspaceKey } = require('../electron/services/config');

test('invalid modes fall back to safe defaults', () => {
  const result = normalize({ permissionMode: 'dangerous', toolMode: 'dangerous', proxyMode: 'dangerous' });
  assert.equal(result.permissionMode, 'safe');
  assert.equal(result.toolMode, 'smart');
  assert.equal(result.mcpPort, 18765);
  assert.equal(result.proxyMode, 'auto');
});

test('legacy tool modes migrate to smart mode', () => {
  for (const toolMode of ['readonly', 'coding', 'build', 'full', 'smart']) assert.equal(normalize({ toolMode }).toolMode, 'smart');
});

test('unknown legacy settings are removed from normalized settings', () => {
  assert.deepEqual(Object.keys(normalize({ obsoleteRuntimeChoice: 'legacy' })).sort(), Object.keys(normalize()).sort());
});

test('trusted values are preserved', () => {
  const result = normalize({ permissionMode: 'trusted', mcpPort: '9000' });
  assert.equal(result.permissionMode, 'trusted');
  assert.equal(result.mcpPort, 9000);
});

test('runtime ports cannot overlap', () => {
  assert.throws(() => validateRuntimeSettings(normalize({ mcpPort: 9000, healthPort: 9000 })), /不能相同/);
});

test('proxy credentials are rejected', () => {
  assert.throws(() => validateRuntimeSettings(normalize({ proxyUrl: 'http://user:pass@127.0.0.1:1080' })), /不要在代理地址/);
});

test('manual proxy mode requires an address', () => {
  assert.throws(() => validateRuntimeSettings(normalize({ proxyMode: 'manual', proxyUrl: '' })), /手动代理/);
});

test('tunnel id must use the official prefix', () => {
  assert.throws(() => validateRuntimeSettings(normalize({ tunnelId: 'wrong-id' })), /tunnel_/);
});


test('recent workspaces use a 50-item MRU list', () => {
  const workspaceAt = (index) => path.join(path.parse(process.cwd()).root, `workspace-${index}`);
  let recent = [];
  for (let index = 0; index < 55; index += 1) {
    recent = mergeRecentWorkspaces(recent, workspaceAt(index));
  }
  assert.equal(recent.length, 50);
  assert.equal(recent[0], workspaceAt(54));
  assert.equal(recent.at(-1), workspaceAt(5));

  const duplicate = process.platform === 'win32'
    ? `${workspaceAt(20).toUpperCase()}${path.sep}`
    : `${workspaceAt(20)}${path.sep}`;
  recent = mergeRecentWorkspaces(recent, duplicate);
  assert.equal(recent.length, 50);
  assert.equal(workspaceKey(recent[0]), workspaceKey(workspaceAt(20)));
  assert.equal(recent.filter((item) => workspaceKey(item) === workspaceKey(workspaceAt(20))).length, 1);
});
