# Fork changes vs upstream cjpais/Handy

Branch: `feat/final-pass-model` — one commit (`45b5a62`) on top of upstream v0.10.0.

## What it adds: "Final Pass Model"

Settings → Advanced → Transcription → **Final Pass Model**.

- A streaming model (Nemotron Streaming 3.5, with the Live overlay) draws the live preview while you speak.
- On key release, a second, more accurate model (Whisper large-v3-turbo) re-decodes the whole recording.
  That second result is what gets pasted, not the streaming preview.
- With the setting off, Handy behaves exactly like upstream.

## Files touched

- `src-tauri/src/managers/transcription.rs` — the second-pass decode after key release
- `src-tauri/src/settings.rs`, `src-tauri/src/shortcut/mod.rs`, `src-tauri/src/lib.rs` — setting + command wiring
- `src/components/settings/FinalPassModel.tsx`, `advanced/AdvancedSettings.tsx`, `src/stores/settingsStore.ts`,
  `src/bindings.ts`, `src/i18n/locales/en/translation.json` — the settings UI

## Recommended configuration

1. Live model: Nemotron Streaming 3.5, overlay mode Live.
2. Final Pass Model: Whisper large-v3-turbo.
3. Both models download from inside Handy on first selection.

## Windows build notes

Upstream's `tauri.conf.json` signs with the maintainer's Azure signing tool, which does not exist on other
machines. Build with a local override instead of editing the repo:

`bun run tauri build --config <file>` where the file contains
`{"bundle":{"createUpdaterArtifacts":false,"targets":["nsis"],"windows":{"signCommand":null}}}`.
The installer is unsigned, so SmartScreen may warn. See `docs/SETUP_PROMPT.md` for the full procedure.
