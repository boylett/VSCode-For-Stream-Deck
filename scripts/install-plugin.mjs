/**
 * Symlinks the .sdPlugin folder into Stream Deck's plugins directory so
 * the app picks up live changes without copying after every build
 *
 * Run: node scripts/install-plugin.mjs
 */

import { existsSync, lstatSync, rmSync, symlinkSync, unlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PLUGIN_DIR = 'dev.boylett.vscode.sdPlugin';
const src = join(__dirname, '..', PLUGIN_DIR);
const dest = join(getPluginsDir(), PLUGIN_DIR);

if (existsSync(dest) || lstatSync(dest, { throwIfNoEntry: false })) {
  console.log('Removing existing installation…');

  try {
    unlinkSync(dest);
  }

  catch {
    rmSync(dest, { recursive: true });
  }
}

// `junction` only matters on Windows; it lets non-admin users create
// directory links without enabling Developer Mode. On macOS Node ignores
// the type argument and creates a regular symlink
symlinkSync(src, dest, 'junction');
console.log(`✓ Symlinked:\n  ${ src }\n  → ${ dest }`);
console.log('\nRestart Stream Deck to load the plugin.');

/**
 * Resolves the Stream Deck plugins directory for the current platform
 */
function getPluginsDir() {
  if (process.platform === 'darwin') {
    return join(homedir(), 'Library/Application Support/com.elgato.StreamDeck/Plugins');
  }

  if (process.platform === 'win32') {
    const appData = process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming');

    return join(appData, 'Elgato', 'StreamDeck', 'Plugins');
  }

  throw new Error(`Unsupported platform: ${ process.platform }. The Elgato Stream Deck app is only available on macOS and Windows.`);
}
