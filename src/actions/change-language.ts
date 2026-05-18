import { action, SingletonAction, type KeyDownEvent } from '@elgato/streamdeck';
import { vscodeServer } from '../server/vscode-server.js';

export interface ChangeLanguageSettings {
  [key: string]: string | undefined;
  languageId: string;
}

@action({ UUID: 'dev.boylett.vscode.change-language' })
export class ChangeLanguageAction extends SingletonAction<ChangeLanguageSettings> {
  /**
   * Switches the active editor's language to the configured language ID
   *
   * @param ev - The key-down event
   */
  override async onKeyDown(ev: KeyDownEvent<ChangeLanguageSettings>): Promise<void> {
    const languageId = ev.payload.settings.languageId?.trim();

    if (!languageId) {
      return;
    }

    vscodeServer.send({
      id: 'ChangeLanguageMessage',
      payload: { languageId },
    });
  }
}
