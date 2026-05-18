/**
 * Wire format for every message exchanged between this Stream Deck plugin
 * and the companion VS Code extension
 *
 * The historical protocol shipped two JSON layers: an outer envelope whose
 * `id` field names the inner payload type, and an inner `data` field that
 * is itself a JSON-encoded string. We keep that exact shape so the modern
 * VS Code extension stays compatible with anyone still running an older
 * plugin and vice versa.
 */
export interface Envelope {
  id: string;
  data: string;
}

export interface ChangeActiveSessionMessage {
  sessionId: string;
}

export interface ActiveSessionChangedMessage {
  sessionId: string;
}

export interface ExecuteCommandMessage {
  command: string;
  arguments: string;
}

export interface ExecuteTerminalCommandMessage {
  command: string;
}

export interface CreateTerminalMessage {
  name?: string;
  workingDirectory?: string;
  environment?: Record<string, string>;
  shellArgs?: string[];
  shellPath?: string;
  preserveFocus?: boolean;
}

export interface InsertSnippetMessage {
  name: string;
}

export interface ChangeLanguageMessage {
  languageId: string;
}

export interface OpenFolderMessage {
  path: string;
  newWindow?: boolean;
}

export type PluginToExtensionMessage =
  | { id: 'ChangeActiveSessionMessage'; payload: ChangeActiveSessionMessage }
  | { id: 'ActiveSessionChangedMessage'; payload: ActiveSessionChangedMessage }
  | { id: 'ExecuteCommandMessage'; payload: ExecuteCommandMessage }
  | { id: 'ExecuteTerminalCommandMessage'; payload: ExecuteTerminalCommandMessage }
  | { id: 'CreateTerminalMessage'; payload: CreateTerminalMessage }
  | { id: 'InsertSnippetMessage'; payload: InsertSnippetMessage }
  | { id: 'ChangeLanguageMessage'; payload: ChangeLanguageMessage }
  | { id: 'OpenFolderMessage'; payload: OpenFolderMessage };

/**
 * Header the extension sets when connecting, identifying which VS Code
 * window the connection belongs to
 */
export const SESSION_HEADER = 'X-VSSessionID';
