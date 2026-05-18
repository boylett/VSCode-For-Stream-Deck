import { action, SingletonAction, type KeyDownEvent } from '@elgato/streamdeck';
import { vscodeServer } from '../server/vscode-server.js';

export interface CreateTerminalSettings {
  [key: string]: string | undefined;
  name?: string;
  workingDirectory?: string;
  shellPath?: string;
  shellArgs?: string;
  environment?: string;
  preserveFocus?: string;
}

@action({ UUID: 'dev.boylett.vscode.create-terminal' })
export class CreateTerminalAction extends SingletonAction<CreateTerminalSettings> {
  /**
   * Opens a new integrated terminal in the active VS Code window using the
   * configured name, working directory, shell and environment
   *
   * @param ev - The key-down event
   */
  override async onKeyDown(ev: KeyDownEvent<CreateTerminalSettings>): Promise<void> {
    const settings = ev.payload.settings;

    vscodeServer.send({
      id: 'CreateTerminalMessage',
      payload: {
        name: settings.name?.trim() || undefined,
        workingDirectory: settings.workingDirectory?.trim() || undefined,
        shellPath: settings.shellPath?.trim() || undefined,
        shellArgs: parseShellArgs(settings.shellArgs),
        environment: parseJsonObject(settings.environment),
        preserveFocus: settings.preserveFocus === 'true',
      },
    });
  }
}

/**
 * Parses a shell-args string into an array of arguments. Accepts either a
 * JSON array or a space-separated string
 *
 * @param raw - The configured shell-args value
 */
function parseShellArgs(raw: string | undefined): string[] | undefined {
  const trimmed = raw?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;

      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
    }

    catch {
      // fall through and treat as a space-separated list
    }
  }

  return trimmed.split(/\s+/);
}

/**
 * Parses a JSON object string, returning undefined if the input is missing
 * or invalid rather than throwing
 *
 * @param raw - The configured JSON string
 */
function parseJsonObject(raw: string | undefined): Record<string, string> | undefined {
  const trimmed = raw?.trim();

  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  }

  catch {
    // ignore and return undefined
  }

  return undefined;
}
