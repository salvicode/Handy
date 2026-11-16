# Setup prompt (macOS)

Paste everything below the line into Claude Code on a MacBook (Apple Silicon or Intel, recent macOS). Use an empty folder as the working directory.

---

Build and install a custom fork of the Handy speech-to-text app on this Mac, then configure it.
Fork: https://github.com/salvicode/Handy, branch `feat/final-pass-model` (upstream cjpais/Handy v0.10.0 plus a
"Final Pass Model" setting: a streaming model draws the live preview, and on key release a second model
re-decodes the recording and that text is pasted). Do not open PRs or post anything upstream.

1. Prerequisites: Xcode Command Line Tools (`xcode-select --install`; skip if `xcode-select -p` already works),
   Homebrew if missing, then `brew install cmake oven-sh/bun/bun` and Rust via rustup
   (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`, then `source ~/.cargo/env`).
   Check `rustc`, `cargo`, `bun`, `cmake` run.
2. Clone: `git clone --branch feat/final-pass-model https://github.com/salvicode/Handy ~/projects/Handy`.
3. Read `AGENTS.md` and `BUILD.md` in the repo. Download the VAD model:
   `mkdir -p src-tauri/resources/models && curl -L -o src-tauri/resources/models/silero-vad-v6.2-F32.gguf https://huggingface.co/handy-computer/silero-vad-v6.2-gguf/resolve/main/silero-vad-v6.2-F32.gguf`
4. `bun install`, then `CMAKE_POLICY_VERSION_MINIMUM=3.5 bun run tauri build`. The first Rust build takes 15-20
   minutes (Metal GPU backend, nothing extra to install); run it in the background and read the log. The updater
   signing step may fail with a missing `TAURI_SIGNING_PRIVATE_KEY`; if so, rebuild with a local override that sets
   `createUpdaterArtifacts` to false (`bun run tauri build --config <file>` with
   `{"bundle":{"createUpdaterArtifacts":false}}`). Do not edit the tracked `tauri.conf.json`. The build uses ad-hoc
   signing (`signingIdentity: "-"`), which is fine for local use.
5. If a stock Handy is installed, quit it (`osascript -e 'tell application id "com.pais.handy" to quit' || true`).
   Copy `src-tauri/target/release/bundle/macos/Handy.app` to `/Applications/` (replace the old one; same bundle id,
   so settings carry over), then `open /Applications/Handy.app`.
6. Permissions: grant Microphone and Accessibility when prompted (System Settings > Privacy & Security). If Handy
   stays on "Waiting..." after a rebuild, the old Accessibility record is stale: quit Handy, run
   `tccutil reset Accessibility com.pais.handy`, reopen, and grant Accessibility again (see BUILD.md,
   "macOS Accessibility remains enabled after a local rebuild").
7. Configure in the Handy UI (tell me what to click if you cannot do it yourself): select the model
   Nemotron Streaming 3.5 with the Live overlay, then Settings > Advanced > Transcription > Final Pass Model =
   Whisper large-v3-turbo. Both models download on first use.
8. Verify with one dictation, then check the Handy log: the second model should re-decode right after key release.
   Report what you built, where it is installed, and anything that failed.
