import { action, SingletonAction, type KeyDownEvent } from '@elgato/streamdeck';
import { vscodeServer } from '../server/vscode-server.js';

export interface ExecuteTerminalCommandSettings {
  [key: string]: string | undefined;
  command: string;
}

@action({ UUID: 'dev.boylett.vscode.execute-terminal-command' })
export class ExecuteTerminalCommandAction extends SingletonAction<ExecuteTerminalCommandSettings> {
  /**
   * Sends the configured shell command into the active VS Code terminal
   *
   * @param ev - The key-down event
   */
  override async onKeyDown(ev: KeyDownEvent<ExecuteTerminalCommandSettings>): Promise<void> {
    const { command } = ev.payload.settings;

    if (!command?.trim()) {
      return;
    }

    vscodeServer.send({
      id: 'ExecuteTerminalCommandMessage',
      payload: { command },
    });
  }
}
