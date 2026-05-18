import streamDeck from '@elgato/streamdeck';
import { ChangeLanguageAction } from './actions/change-language.js';
import { CreateTerminalAction } from './actions/create-terminal.js';
import { ExecuteCommandAction } from './actions/execute-command.js';
import { ExecuteTerminalCommandAction } from './actions/execute-terminal-command.js';
import { InsertSnippetAction } from './actions/insert-snippet.js';
import { OpenFolderAction } from './actions/open-folder.js';
import { vscodeServer } from './server/vscode-server.js';

// Start the bridge server first so it's ready before any action fires
vscodeServer.start();

// Restart after the system wakes from sleep — long-lived sockets sometimes
// survive in a half-open state otherwise
streamDeck.system.onSystemDidWakeUp(() => {
  streamDeck.logger.info('System woke up — restarting VS Code bridge');
  vscodeServer.stop();
  vscodeServer.start();
});

streamDeck.actions.registerAction(new ExecuteCommandAction());
streamDeck.actions.registerAction(new ExecuteTerminalCommandAction());
streamDeck.actions.registerAction(new CreateTerminalAction());
streamDeck.actions.registerAction(new InsertSnippetAction());
streamDeck.actions.registerAction(new ChangeLanguageAction());
streamDeck.actions.registerAction(new OpenFolderAction());

streamDeck.connect();
