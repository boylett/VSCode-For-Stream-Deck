import { action, SingletonAction, type KeyDownEvent } from '@elgato/streamdeck';
import { vscodeServer } from '../server/vscode-server.js';

export interface OpenFolderSettings {
  [key: string]: string | undefined;
  path: string;
  newWindow?: string;
}

@action({ UUID: 'dev.boylett.vscode.open-folder' })
export class OpenFolderAction extends SingletonAction<OpenFolderSettings> {
  /**
   * Opens the configured folder or workspace, optionally in a new window
   *
   * @param ev - The key-down event
   */
  override async onKeyDown(ev: KeyDownEvent<OpenFolderSettings>): Promise<void> {
    const path = ev.payload.settings.path?.trim();

    if (!path) {
      return;
    }

    vscodeServer.send({
      id: 'OpenFolderMessage',
      payload: { path, newWindow: ev.payload.settings.newWindow === 'true' },
    });
  }
}
