# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [7.0.0] - 2026-05-18

### Added

- Built on the official Elgato Node.js SDK ([@elgato/streamdeck](https://www.npmjs.com/package/@elgato/streamdeck)) - no more .NET runtime dependency.
- Native Apple Silicon and Windows ARM support out of the box.
- Shared Property Inspector CSS/JS layer so each action's UI is just a small HTML file.
- `streamdeck validate` and `streamdeck restart` first-class developer workflows.

### Changed

- Plugin UUID changed from `com.nicollasr.streamdeckvsc` to `dev.boylett.vscode`. Existing button bindings need to be re-added.
- Manifest updated to SDK version 3 with `Software.MinimumVersion` 6.9 (Elgato Marketplace requirements for new submissions).
- README rewritten as a user-facing install / usage guide.

### Removed

- The C# project, `StreamDeckVSC.sln`, `App.config`, the PowerShell build scripts (`export.ps1`, `postbuild.ps1`), `BarRaider/StreamDeck-Tools`, `Fleck`, `Newtonsoft.Json`, and the `Microsoft.Extensions.Configuration.*` stack. The previous code lives on in the git history.

### Compatibility

The bridge server still listens on `127.0.0.1:48969` and speaks the same `{ id, data }` envelope behind the `X-VSSessionID` handshake, so older VS Code extension builds remain wire-compatible.

## [5.1.3] - 2020-05-15

### Fixed

- macOS connection lost.

## [5.1.2] - 2020-05-28

### Added

- Open folder action.

### Fixed

- macOS configuration default values loading.

## [4.1.2] - 2020-03-02

### Added

- macOS support.

## [3.1.2] - 2020-02-24

### Added

- Multi-action support.

## [3.0.2] - 2020-01-01

### Added

- Insert snippet key.

### Changed

- Auto-install dependencies.

## [2.0.2] - 2019-12-09

### Added

- Change language key.

### Changed

- "Execute Command" key now supports arguments.

[Unreleased]: https://github.com/boylett/VSCode-For-Stream-Deck/compare/v7.0.0...HEAD
[7.0.0]: https://github.com/boylett/VSCode-For-Stream-Deck/releases/tag/v7.0.0
