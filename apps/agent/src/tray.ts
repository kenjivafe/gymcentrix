/**
 * tray.ts
 *
 * System tray integration using node-systray-v2 (Edgar-P-yan fork).
 * Displays the Gymcentrix Agent icon in the Windows notification area
 * with a menu for status, settings, logs, restart, and exit.
 */

import { SysTray, MenuItem } from "node-systray-v2";
import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";
import { logger } from "./logger";

const ICON_PATH = path.resolve(__dirname, "../assets/icon.ico");
const CONFIG_PATH = path.resolve(process.cwd(), "agent-config.json");
const LOG_PATH = path.resolve(process.cwd(), "logs/agent.log");

const SEPARATOR: MenuItem = { title: "─────────────", tooltip: "", checked: false, enabled: false };

// Runtime state
let readerStatus = "Unknown";
let internetStatus = "Unknown";
let trayInstance: SysTray | null = null;

export function setReaderStatus(status: string): void {
  readerStatus = status;
  if (trayInstance) {
    trayInstance.sendAction({
      type: "update-item",
      item: { title: `Reader: ${status}`, tooltip: "", checked: false, enabled: false },
      seq_id: 1,
    });
  }
}

export function setInternetStatus(status: string): void {
  internetStatus = status;
  if (trayInstance) {
    trayInstance.sendAction({
      type: "update-item",
      item: { title: `Internet: ${status}`, tooltip: "", checked: false, enabled: false },
      seq_id: 2,
    });
  }
}


export function createTray(): void {
  // Read the icon as Base64 (node-systray-v2 requires base64-encoded icon)
  let iconBase64: string;
  try {
    iconBase64 = fs.readFileSync(ICON_PATH).toString("base64");
  } catch {
    logger.warn("Tray icon not found at assets/icon.ico. Run: node scripts/prepare-icon.js");
    iconBase64 = "";
  }

  trayInstance = new SysTray({
    menu: {
      icon: iconBase64,
      title: "",
      tooltip: "Gymcentrix Agent",
      items: [
        { title: "Status: Running", tooltip: "", checked: false, enabled: false },
        { title: `Reader: ${readerStatus}`, tooltip: "", checked: false, enabled: false },
        { title: `Internet: ${internetStatus}`, tooltip: "", checked: false, enabled: false },
        SEPARATOR,
        { title: "Open Settings", tooltip: "Edit agent-config.json", checked: false, enabled: true },
        { title: "View Logs", tooltip: "Open agent.log", checked: false, enabled: true },
        SEPARATOR,
        { title: "Restart Agent", tooltip: "Restart process", checked: false, enabled: true },
        { title: "Exit", tooltip: "Quit agent", checked: false, enabled: true },
      ],
    },
    debug: false,
  });

  trayInstance.onClick((action) => {
    const title = action.item?.title ?? "";
    logger.debug(`Tray menu clicked: "${title}"`);

    switch (title) {
      case "Open Settings":
        exec(`notepad "${CONFIG_PATH}"`);
        break;

      case "View Logs":
        exec(`notepad "${LOG_PATH}"`);
        break;

      case "Restart Agent":
        logger.info("Restarting agent via tray menu...");
        if (trayInstance) trayInstance.kill();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        (require("child_process") as typeof import("child_process")).spawn(
          process.execPath,
          [process.argv[1]],
          { detached: true, stdio: "ignore" }
        ).unref();
        process.exit(0);
        break;

      case "Exit":
        logger.info("Exiting agent via tray menu");
        if (trayInstance) trayInstance.kill();
        process.exit(0);
        break;
    }
  });

  logger.info("System tray initialized");
}

export function killTray(): void {
  if (trayInstance) {
    trayInstance.kill();
    trayInstance = null;
  }
}
