import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger";
import { apiClient } from "./api-client";
import { config } from "./config";

export interface QueueEntry {
  uid: string;
  timestamp: number;
}

const QUEUE_PATH = path.resolve(process.cwd(), "queue.json");

function readQueue(): QueueEntry[] {
  try {
    if (!fs.existsSync(QUEUE_PATH)) return [];
    const raw = fs.readFileSync(QUEUE_PATH, "utf-8").trim();
    if (!raw) return [];
    return JSON.parse(raw) as QueueEntry[];
  } catch {
    logger.warn("Failed to read queue.json — starting with empty queue");
    return [];
  }
}

function writeQueue(entries: QueueEntry[]): void {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

/**
 * Append a failed scan to the offline queue.
 */
export function enqueue(uid: string): void {
  const entries = readQueue();
  entries.push({ uid, timestamp: Date.now() });
  writeQueue(entries);
  logger.info(`Queued UID ${uid} for retry (queue size: ${entries.length})`);
}

/**
 * Start a background retry loop.
 * Every `retryIntervalMs` ms the queue is drained over the API.
 */
export function startRetryLoop(): void {
  setInterval(async () => {
    const entries = readQueue();
    if (entries.length === 0) return;

    const online = await apiClient.isOnline();
    if (!online) {
      logger.debug("Retry loop: API is offline, skipping");
      return;
    }

    logger.info(`Retry loop: attempting to flush ${entries.length} queued scan(s)`);

    const remaining: QueueEntry[] = [];
    for (const entry of entries) {
      try {
        await apiClient.postCheckin(entry.uid);
        logger.info(`Retry success for queued UID ${entry.uid}`);
      } catch (err: any) {
        const status = err.response?.status;
        const isOfflineData = !status || status >= 500;

        if (isOfflineData) {
          logger.warn(`Retry failed for queued UID ${entry.uid} (Offline/500) — keeping in queue`);
          remaining.push(entry);
        } else {
          logger.warn(`Retry rejected by API for queued UID ${entry.uid} (${status}) — dropping from queue`);
        }
      }
    }

    writeQueue(remaining);

    if (remaining.length < entries.length) {
      logger.info(
        `Retry loop: flushed ${entries.length - remaining.length} scan(s), ` +
          `${remaining.length} remaining`
      );
    }
  }, config.retryIntervalMs);

  logger.info(
    `Offline retry loop started (interval: ${config.retryIntervalMs}ms)`
  );
}
