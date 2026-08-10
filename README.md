# 网页 MCP 助手 (GPT-WebCodex)

一个让网页版 ChatGPT 能直接读写你本地代码的小工具。**当 Codex / Cursor 额度用尽后，可以用它无缝充当“低配版 Codex”，彻底解决额度不够用的问题**。无需安装 Docker，支持 Windows 10/11 与 macOS 12+（Intel / Apple Silicon）。

---

## 📌 为什么搞这个工具？

很多做开发的朋友应该都遇到过这个尴尬情况：**Codex 或 Cursor 的订阅额度没用几天就提示耗尽限额了**，想继续用网页版 ChatGPT 来写代码，但网页端偏偏无法直接读取和修改本地的文件，手动复制粘贴代码简直折磨人。

做这个小助手的核心目的就是：**提供一个易配置的“平替低配版 Codex”**。Windows 安装包内置 Python 运行时；macOS 版复用系统中已安装的 Python 3.11+，并为 Intel 与 Apple Silicon 分别提供原生安装包。

启动助手后，你在熟悉的网页版 ChatGPT 聊天框里下指令，AI 就能：
- 📁 **直接读取桌面与本地项目的代码文件**
- ✏️ **直接在你的本地目录里新建文件、修改代码、修复 Bug**

Codex 额度不够用时，直接切到网页版 ChatGPT 接上这个助手，继续丝滑做本地代码重构。

---

## 💡 几个大家关心的点

- **平替低配 Codex**：Codex 额度用光也不慌，用网页版 ChatGPT 配套助手继续改本地代码。
- **免装 Docker**：Windows 版内置便携 Python；macOS 版会自动检测 `python3`，缺少时可从界面打开安装流程。
- **目录权限隔离**：每次只向它授权你选择的**单一工程目录**，绝对不会去越权读取你电脑里的其他盘符和隐私文件。
- **密钥本地加密**：API Key 通过 Electron `safeStorage` 保存（Windows DPAPI / macOS Keychain），不上传任何第三方服务器。
- **自动代理重连**：能自动识别系统代理，后台带连接诊断，掉线了会静默重连。

---

## 📦 怎么下载和使用？

普通使用**完全不需要配置任何开发环境**：

1. 直接点击 GitHub 页面右侧的 **[Releases](../../releases)** 链接。
2. Windows 下载 `.exe`；macOS 按芯片选择 `x64`（Intel）或 `arm64`（Apple Silicon）的 `.dmg`。
3. macOS 首次运行前请确认已安装 Python 3.11+：`python3 --version`。

---

## 💻 开发者源码编译（可选）

如果你想修改代码或自己打包：

开发环境需要 Node.js 22.12+；macOS 构建还需要 Go 1.24+（用于准备官方 Tunnel 客户端）。

```bash
# 克隆项目并安装依赖
git clone https://github.com/3169657175/gpt-webcodex.git
cd gpt-webcodex
npm install

# 本地运行
npm start

# 当前系统打包
npm run dist
```

### macOS 打包

macOS 安装包必须在 macOS 机器上构建：

```bash
./scripts/prepare-tunnel-client-mac.sh
./scripts/build-mac.sh
```

脚本会同时输出 Intel（x64）与 Apple Silicon（arm64）的 dmg/zip。未签名的本地构建可能被 Gatekeeper 拦截；正式发布请配置 Apple Developer ID 并完成 notarization。

---

## 📜 开源协议

- 本项目基于 [MIT License](LICENSE) 开源。
- 内置集成 [Coding Tools MCP](https://github.com/anthropics/anthropic-tools) 源码，遵循 Apache License 2.0 规范，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
