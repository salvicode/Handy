# Setup prompt

Paste everything below the line into Claude Code on a Windows 11 machine. Use an empty folder as the working directory.

---

Build and install a custom fork of the Handy speech-to-text app on this Windows 11 machine, then configure it.
Fork: https://github.com/salvicode/Handy, branch `feat/final-pass-model` (upstream cjpais/Handy v0.10.0 plus a
"Final Pass Model" setting: a streaming model draws the live preview, and on key release a second model
re-decodes the recording and that text is pasted). Do not open PRs or post anything upstream.

1. Prerequisites via winget (silent, accept agreements): `Rustlang.Rustup`, `Oven-sh.Bun`, `Kitware.CMake`,
   `KhronosGroup.VulkanSDK`, and Visual Studio 2022 Build Tools with the C++ workload
   (`Microsoft.VisualStudio.2022.BuildTools`, override `--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended`).
   Then refresh PATH in the shell (or open a new one) and set `VULKAN_SDK` from the machine environment.
   Check `rustc`, `cargo`, `bun`, `cmake` run.
2. Clone: `git clone --branch feat/final-pass-model https://github.com/salvicode/Handy` into a short path
   (for example `C:\projects\Handy`; short paths avoid Windows path-length problems).
3. Read `AGENTS.md` and `BUILD.md` in the repo. Download the VAD model:
   `src-tauri/resources/models/silero-vad-v6.2-F32.gguf` from
   `https://huggingface.co/handy-computer/silero-vad-v6.2-gguf/resolve/main/silero-vad-v6.2-F32.gguf`.
4. `bun install`, then build with a local override that drops upstream's Azure code-signing command (that tool
   does not exist here) and the updater signing key: write
   `{"bundle":{"createUpdaterArtifacts":false,"targets":["nsis"],"windows":{"signCommand":null}}}` to a temp file
   and run `bun run tauri build --config <that file>`. The first Rust build takes 15-20 minutes. Run it in the
   background and read the log. Do not edit the tracked `tauri.conf.json`.
5. If a stock Handy is installed, quit it. Run `src-tauri\target\release\bundle\nsis\Handy_0.10.0_x64-setup.exe /S`
   (same bundle id, so settings carry over), then launch `%LOCALAPPDATA%\Handy\handy.exe`. The installer is
   unsigned, so SmartScreen may warn; that is expected.
6. Configure in the Handy UI (tell me what to click if you cannot do it yourself): select the model
   Nemotron Streaming 3.5 with the Live overlay, then Settings → Advanced → Transcription → Final Pass Model =
   Whisper large-v3-turbo. Both models download on first use.
7. Verify with one dictation, then check the Handy log: the second model should re-decode right after key release.
   Report what you built, where it is installed, and anything that failed.
