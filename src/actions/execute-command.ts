import { action, SingletonAction, type KeyDownEvent } from '@elgato/streamdeck';
import { vscodeServer } from '../server/vscode-server.js';

export interface ExecuteCommandSettings {
  [key: string]: string | undefined;
  command: string;
  arguments: string;
}

@action({ UUID: 'dev.boylett.vscode.execute-command' })
export class ExecuteCommandAction extends SingletonAction<ExecuteCommandSettings> {
  /**
   * Forwards the configured VS Code command (and optional JSON arguments)
   * to the active window when the key is pressed
   *
   * @param ev - The key-down event
   */
  override async onKeyDown(ev: KeyDownEvent<ExecuteCommandSettings>): Promise<void> {
    const { command, arguments: args } = ev.payload.settings;

    if (!command?.trim()) {
      return;
    }

    vscodeServer.send({
      id: 'ExecuteCommandMessage',
      payload: { command: command.trim(), arguments: args ?? '' },
    });
  }
}
