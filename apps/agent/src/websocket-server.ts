import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger";
import { config } from "./config";

export type WsEventType =
  | "scan_success"
  | "scan_error"
  | "scan_offline"
  | "scan"
  | "AGENT_STATUS";

export interface WsEvent {
  event: WsEventType;
  member?: { name: string };
  uid?: string;
  error?: string;
  message?: string;
  timestamp?: number;
}

const clients = new Set<WebSocket>();

let wss: WebSocketServer | null = null;

/**
 * Start the local WebSocket server on the configured port.
 */
export function startWebSocketServer(): WebSocketServer {
  wss = new WebSocketServer({ port: config.wsPort, host: "127.0.0.1" });

  wss.on("listening", () => {
    logger.info(`WebSocket server listening on ws://localhost:${config.wsPort}`);
  });

  wss.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress ?? "unknown";
    logger.info(`WebSocket client connected: ${ip}`);
    clients.add(ws);

    // Send greeting
    sendTo(ws, { event: "AGENT_STATUS", message: "Gymcentrix Agent connected" });

    ws.on("close", () => {
      clients.delete(ws);
      logger.info(`WebSocket client disconnected: ${ip}`);
    });

    ws.on("error", (err) => {
      logger.warn(`WebSocket client error: ${err.message}`);
      clients.delete(ws);
    });
  });

  wss.on("error", (err) => {
    logger.error(`WebSocket server error: ${err.message}`);
  });

  return wss;
}

/**
 * Broadcast an event to all connected kiosk clients.
 */
export function broadcast(event: WsEvent): void {
  const payload = JSON.stringify({ ...event, timestamp: Date.now() });
  let sent = 0;

  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
      sent++;
    }
  }

  if (sent > 0) {
    logger.debug(`WS broadcast [${event.event}] → ${sent} client(s)`);
  }
}

function sendTo(ws: WebSocket, event: WsEvent): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ ...event, timestamp: Date.now() }));
  }
}

export function stopWebSocketServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!wss) return resolve();
    wss.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
