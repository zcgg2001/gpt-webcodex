const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const { normalizeProxyValue } = require('../electron/services/proxyService');

test('macOS packages and both CPU architectures are configured', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.deepEqual(pkg.build.mac.target, ['dmg', 'zip']);
  assert.match(pkg.scripts['dist:mac'], /--x64 --arm64/);
  const preparation = read('scripts/prepare-tunnel-client-mac.sh');
  assert.match(preparation, /GOARCH=\"\$go_arch\"/);
  assert.match(preparation, /amd64:x64/);
  assert.match(preparation, /arm64:arm64/);
  assert.equal(fs.existsSync(path.join(root, 'resources/tools/tunnel-client-darwin-x64')), true);
  assert.equal(fs.existsSync(path.join(root, 'resources/tools/tunnel-client-darwin-arm64')), true);
});

test('runtime paths and process lifecycle are platform aware', () => {
  assert.match(read('electron/paths.js'), /tunnel-client-darwin-\$\{arch\}/);
  assert.match(read('electron/services/environmentService.js'), /python3\.12/);
  assert.match(read('electron/services/processControl.js'), /SIGTERM/);
  assert.match(read('electron/services/buildVerificationService.js'), /\/bin\/sh/);
  assert.match(read('electron/services/proxyService.js'), /scutil/);
});

test('portable proxy normalization accepts host and port values', () => {
  assert.equal(normalizeProxyValue('127.0.0.1:7890'), 'http://127.0.0.1:7890');
});
