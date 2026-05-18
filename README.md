<div align="center">

<img src="https://raw.githubusercontent.com/boylett/boylett.github.io/assets/vscode-for-stream-deck/icon.png" alt="Visual Studio Code for Stream Deck" width="120" />

# Visual Studio Code for Stream Deck

[![Version](https://img.shields.io/badge/version-7.0.0-3b3b3b?style=flat-square&logo=elgato&logoColor=white)](https://github.com/boylett/VSCode-For-Stream-Deck/releases)

The Stream Deck half of a two-piece integration that puts Visual Studio Code on your physical deck. Drag actions onto buttons, configure them in the Property Inspector, and your Stream Deck starts driving VS Code.

</div>

## Install

Grab **Visual Studio Code for Stream Deck** from the Elgato Marketplace, or drop the latest `.streamDeckPlugin` from the [releases page](https://github.com/boylett/VSCode-For-Stream-Deck/releases) onto the Stream Deck app.

You'll also need the companion [Stream Deck for Visual Studio Code](https://github.com/boylett/Stream-Deck-For-VSCode) extension installed in VS Code. Once both halves are running, VS Code's status bar shows `Deck | Connected | Active` for the window currently receiving commands.

## Actions

| Action | What it does |
|--------|--------------|
| **Execute Command** | Runs any VS Code command by ID (e.g. `workbench.action.tasks.runTask`), with optional JSON arguments |
| **Execute Terminal Command** | Sends text to the currently active integrated terminal |
| **Create Terminal** | Opens a new terminal with a configurable name, working directory, shell and environment variables |
| **Insert Snippet** | Triggers a named user or workspace snippet in the active editor |
| **Change Language** | Switches the active editor's language mode |
| **Open Folder** | Opens a folder or workspace, optionally in a new window |

## How focus works

Multiple VS Code windows can be open at once. The plugin sends button presses to whichever window is currently flagged as **active**, and VS Code claims that flag automatically when its window receives focus. Switch windows and your Stream Deck follows.

If you ever need to nudge it manually, click the `Deck | ...` entry in any window's status bar to mark that window active.

## Finding a VS Code command ID

In VS Code, open `File > Preferences > Keyboard Shortcuts`, find the command you want, right-click and choose `Copy Command ID`. Paste it into the **Execute Command** button's Property Inspector.

## Settings

The bridge runs on `127.0.0.1:48969` by default. If you need to change host or port, do it inside VS Code via the `streamdeck.serverHost` and `streamdeck.serverPort` settings - both halves pick up the change automatically.

If VS Code is connected to a remote machine over SSH, forward the bridge port back to your local machine:

```
RemoteForward 48969 127.0.0.1:48969
```

## Support

If this is useful to you and you'd like to support its development, you can buy me a coffee on Ko-fi - always optional, always appreciated.

<a href="https://ko-fi.com/boylett"><img src="https://raw.githubusercontent.com/boylett/boylett.github.io/assets/ko-fi.jpg" alt="Support me on Ko-fi" width="360" /></a>

## License

MIT - see [LICENSE](LICENSE).
