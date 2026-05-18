import { action, SingletonAction, type KeyDownEvent } from '@elgato/streamdeck';
import { vscodeServer } from '../server/vscode-server.js';

export interface InsertSnippetSettings {
  [key: string]: string | undefined;
  name: string;
}

@action({ UUID: 'dev.boylett.vscode.insert-snippet' })
export class InsertSnippetAction extends SingletonAction<InsertSnippetSettings> {
  /**
   * Inserts a snippet by name into the active editor
   *
   * @param ev - The key-down event
   */
  override async onKeyDown(ev: KeyDownEvent<InsertSnippetSettings>): Promise<void> {
    const name = ev.payload.settings.name?.trim();

    if (!name) {
      return;
    }

    vscodeServer.send({
      id: 'InsertSnippetMessage',
      payload: { name },
    });
  }
}
