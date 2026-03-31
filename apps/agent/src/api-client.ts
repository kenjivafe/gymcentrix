import axios, { AxiosInstance, AxiosError } from "axios";
import { config } from "./config";
import { logger } from "./logger";

export interface CheckinPayload {
  uid: string;
  agentId: string;
  branchId: string;
}

export interface CheckinResponse {
  success: boolean;
  result?: string;
  reason?: string;
  member?: { name: string; [key: string]: any };
  message?: string;
  [key: string]: unknown;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: 10_000,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "X-Agent-Id": config.agentId,
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use((req) => {
      logger.debug(`API → ${req.method?.toUpperCase()} ${req.url}`);
      return req;
    });

    // Response interceptor for error normalisation
    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const status = error.response?.status ?? "NO_RESPONSE";
        
        // Suppress logging 404 errors from the root "/" connectivity check
        if (status === 404 && error.config?.url === "/") {
          return Promise.reject(error);
        }

        const data = error.response?.data ?? error.message;
        logger.error(`API error [${status}]: ${typeof data === "string" ? data : JSON.stringify(data)}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * POST /rfid/checkin
   * Returns the parsed response body on success.
   * Throws on network error or non-2xx response.
   */
  async postCheckin(uid: string): Promise<CheckinResponse> {
    const payload = {
      rfidUid: uid,
      agentId: config.agentId,
      branchId: config.branchId,
    };

    const response = await this.client.post<CheckinResponse>(
      "/rfid/checkin",
      payload
    );

    logger.info(
      `Check-in success for UID ${uid}: ${JSON.stringify(response.data)}`
    );
    return response.data;
  }

  /**
   * Simple connectivity check — HEAD request to the API root.
   * Returns true if the server responded with any status (even 4xx).
   */
  async isOnline(): Promise<boolean> {
    try {
      await this.client.head("/");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Server responded — we're online
        return true;
      }
      return false;
    }
  }
  /**
   * POST /agent/status
   * Reports the current status and local IP of the agent.
   */
  async postStatus(status: string, localIp: string): Promise<boolean> {
    try {
      await this.client.post("/agent/status", { status, localIp });
      return true;
    } catch (error) {
      logger.error("Failed to report agent status");
      return false;
    }
  }
}

// Singleton export
export const apiClient = new ApiClient();
