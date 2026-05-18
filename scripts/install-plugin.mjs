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
const dest = join(
  homedir(),
  'Library/Application Support/com.elgato.StreamDeck/Plugins',
  PLUGIN_DIR,
);

if (existsSync(dest) || lstatSync(dest, { throwIfNoEntry: false })) {
  console.log('Removing existing installation…');

  try {
    unlinkSync(dest);
  }

  catch {
    rmSync(dest, { recursive: true });
  }
}

symlinkSync(src, dest);
console.log(`✓ Symlinked:\n  ${ src }\n  → ${ dest }`);
console.log('\nRestart Stream Deck to load the plugin.');
