#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "macOS 安装包必须在 macOS 上构建。" >&2
  exit 1
fi

for arch in x64 arm64; do
  if [[ ! -x "resources/tools/tunnel-client-darwin-$arch" ]]; then
    echo "缺少 resources/tools/tunnel-client-darwin-$arch" >&2
    echo "请先运行 scripts/prepare-tunnel-client-mac.sh。" >&2
    exit 1
  fi
done

npm install
npm run dist:mac
