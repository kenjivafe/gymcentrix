import { EventEmitter } from "events";
import * as path from "path";
import * as readline from "readline";
import { spawn, ChildProcess } from "child_process";
import { logger } from "./logger";
import { config } from "./config";

/**
 * RfidListener
 *
 * Captures global keyboard input via a spawned PowerShell hook script.
 * Uses SetWindowsHookEx WinAPI (pure PowerShell — no native binary required).
 * The PowerShell script outputs one line per RFID scan to stdout.
 */
export class RfidListener extends EventEmitter {
  private process: ChildProcess | null = null;
  private isRunning = false;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    const scriptPath = path.resolve(__dirname, "../scripts/rfid-hook.ps1");

    this.process = spawn(
      "powershell.exe",
      [
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", scriptPath,
      ],
      {
        env: {
          ...process.env,
          RFID_LENGTH: String(config.rfidLength),
          RFID_TIMEOUT_MS: String(config.rfidTimeoutMs),
        },
        windowsHide: true,
      }
    );

    if (!this.process.stdout) {
      logger.error("Failed to attach stdout to PowerShell RFID hook");
      return;
    }

    const rl = readline.createInterface({ input: this.process.stdout });

    rl.on("line", (line: string) => {
      const uid = line.trim();
      if (uid.length === config.rfidLength && /^\d+$/.test(uid)) {
        logger.info(`RFID scan detected: ${uid}`);
        this.emit("rfid", uid);
      }
    });

    this.process.stderr?.on("data", (data: Buffer) => {
      const msg = data.toString().trim();
      if (msg) logger.warn(`RFID hook stderr: ${msg}`);
    });

    this.process.on("exit", (code) => {
      if (this.isRunning) {
        logger.warn(`RFID hook process exited (code ${code}) — restarting in 3s`);
        setTimeout(() => {
          if (this.isRunning) this.start();
        }, 3000);
      }
    });

    this.process.on("error", (err) => {
      logger.error(`RFID hook spawn error: ${err.message}`);
    });

    logger.info(
      `RFID listener started via PowerShell hook (length=${config.rfidLength}, timeout=${config.rfidTimeoutMs}ms)`
    );
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    logger.info("RFID listener stopped");
  }
}
