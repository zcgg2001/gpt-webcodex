#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_DIR="${TMPDIR:-/tmp}/gpt-webcodex-tunnel-client"
REVISION="${TUNNEL_CLIENT_REVISION:-3799d021976b6fa923498c2bcbfa4a189aef07b5}"

command -v git >/dev/null || { echo "需要 git。" >&2; exit 1; }
command -v go >/dev/null || { echo "需要 Go 1.24 或更高版本。" >&2; exit 1; }

rm -rf "$SOURCE_DIR"
git clone https://github.com/openai/tunnel-client.git "$SOURCE_DIR"
git -C "$SOURCE_DIR" checkout --detach "$REVISION"

mkdir -p "$ROOT/resources/tools"
for pair in "amd64:x64" "arm64:arm64"; do
  go_arch="${pair%%:*}"
  app_arch="${pair##*:}"
  (
    cd "$SOURCE_DIR"
    CGO_ENABLED=0 GOOS=darwin GOARCH="$go_arch" \
      go build -trimpath -ldflags "-s -w -X github.com/openai/tunnel-client/pkg/version.GitSHA=${REVISION:0:7}" \
      -o "$ROOT/resources/tools/tunnel-client-darwin-$app_arch" ./cmd/client
  )
  chmod 755 "$ROOT/resources/tools/tunnel-client-darwin-$app_arch"
done

echo "macOS Tunnel binaries are ready."
