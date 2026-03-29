/**
 * auto-start.ts
 *
 * Registers or removes the Gymcentrix Agent from the Windows auto-start
 * registry key: HKCU\Software\Microsoft\Windows\CurrentVersion\Run
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
import winreg = require("winreg");
import { logger } from "./logger";

const REG_KEY = "\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
const APP_NAME = "GymcentrixAgent";

function getRegKey(): winreg.Registry {
  return new winreg({ hive: winreg.HKCU, key: REG_KEY });
}

/**
 * Register the current executable in the Windows Run registry key so that
 * the agent starts automatically on login.
 */
export function registerAutoStart(): void {
  const exePath = process.execPath;
  const key = getRegKey();

  key.set(APP_NAME, winreg.REG_SZ, `"${exePath}"`, (err) => {
    if (err) {
      logger.warn(`Auto-start registration failed: ${err.message}`);
    } else {
      logger.info(`Auto-start registered: ${exePath}`);
    }
  });
}

/**
 * Remove the agent from the Windows Run registry key.
 */
export function unregisterAutoStart(): void {
  const key = getRegKey();

  key.remove(APP_NAME, (err) => {
    if (err) {
      logger.warn(`Auto-start removal failed: ${err.message}`);
    } else {
      logger.info("Auto-start entry removed");
    }
  });
}
