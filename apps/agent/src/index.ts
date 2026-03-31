/**
 * index.ts — Gymcentrix Agent Entry Point
 *
 * Wires together:
 *   - System tray
 *   - Global RFID listener
 *   - Gymcentrix API client
 *   - Offline queue / retry loop
 *   - Local WebSocket server (kiosk)
 *   - Windows auto-start registration
 */

import { logger } from "./logger";
import { config } from "./config";
import { RfidListener } from "./rfid-listener";
import { apiClient } from "./api-client";
import { enqueue, startRetryLoop } from "./queue";
import { startWebSocketServer, broadcast, stopWebSocketServer } from "./websocket-server";
import { createTray, killTray, setInternetStatus, setReaderStatus } from "./tray";
import { registerAutoStart } from "./auto-start";
import os from "os";

// ─────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────

logger.info("=".repeat(60));
logger.info("Gymcentrix Agent starting...");
logger.info(`Agent ID : ${config.agentId}`);
logger.info(`Branch ID: ${config.branchId}`);
logger.info(`API URL  : ${config.apiUrl}`);
logger.info(`WS Port  : ${config.wsPort}`);
logger.info("=".repeat(60));

// 1. Register Windows auto-start
registerAutoStart();

// 2. Start WebSocket server
startWebSocketServer();

// 3. Start offline retry loop
startRetryLoop();

// 4. Start RFID listener
const rfid = new RfidListener();

rfid.on("rfid", async (uid: string) => {
  // Broadcast raw scan to kiosk immediately
  broadcast({ event: "scan", uid });

  try {
    const result = await apiClient.postCheckin(uid);
    setInternetStatus("Online");

    // Broadcast check-in result to kiosk
    broadcast({
      event: "scan_success",
      uid,
      result: result.result || "AUTHORIZED",
      reason: result.reason,
      member: { name: result.member?.name || (result as any).name || "Member" },
      message: result.message,
    });
  } catch (err: any) {
    const apiError = err.response?.data?.error || err.message || "Unknown error";
    const apiResult = err.response?.data?.result || "DENIED";
    const apiReason = err.response?.data?.reason;

    logger.error(`Check-in failed for UID ${uid}: ${apiError}`);
    
    // If the error was a 4xx, it means the API rejected it (not offline).
    // If it's a 5xx or no response, the agent queues it for offline retry.
    const status = err.response?.status;
    const isOfflineData = !status || status >= 500;

    if (isOfflineData) {
      setInternetStatus("Offline");
      enqueue(uid);
      broadcast({
        event: "scan_offline",
        uid,
      });
    } else {
      setInternetStatus("Online");
      broadcast({
        event: "scan_error",
        uid,
        result: apiResult,
        reason: apiReason,
        error: apiError,
      });
    }
  }
});

rfid.start();
setReaderStatus("Active");

// 5. Initial API connectivity check
apiClient.isOnline().then(online => {
  setInternetStatus(online ? "Online" : "Offline");
  // The tray doesn't auto-refresh unless a new item is pushed,
  // but since createTray runs immediately after, it might catch it.
  // Actually, we'll just let the next event update it, or we can rebuild the menu natively.
  // For now, setting the state variable is enough for the initial render.
});

// 6. Create system tray (keeps the process alive)
createTray();

logger.info("Gymcentrix Agent is running");
 
// 7. Status Reporting Loop (Autonomous Discovery)
function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Ignore internal (127.0.0.1) and non-ipv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}
 
async function startStatusHeartbeat() {
  const report = async () => {
    const ip = getLocalIp();
    logger.debug(`Reporting local IP to cloud: ${ip}`);
    await apiClient.postStatus("ONLINE", ip);
  };
 
  // Initial report
  await report();
  
  // Periodic report every 60 seconds
  setInterval(report, 60_000);
}
 
startStatusHeartbeat();

// ─────────────────────────────────────────────
// Graceful shutdown
// ─────────────────────────────────────────────

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal} — shutting down gracefully...`);
  rfid.stop();
  await stopWebSocketServer();
  logger.info("Gymcentrix Agent stopped");
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught exception: ${err.message}\n${err.stack}`);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled rejection: ${String(reason)}`);
});
