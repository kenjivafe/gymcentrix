import * as fs from "fs";
import * as path from "path";

export interface AgentConfig {
  agentId: string;
  branchId: string;
  apiUrl: string;
  apiKey: string;
  wsPort: number;
  retryIntervalMs: number;
  rfidTimeoutMs: number;
  rfidLength: number;
}

const CONFIG_PATH = path.resolve(process.cwd(), "agent-config.json");

const DEFAULTS: Partial<AgentConfig> = {
  wsPort: 4010,
  retryIntervalMs: 30_000,
  rfidTimeoutMs: 500,
  rfidLength: 10,
};

function loadConfig(): AgentConfig {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(
      `agent-config.json not found at ${CONFIG_PATH}. ` +
        `Please create it based on the example in the README.`
    );
  }

  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  const parsed = JSON.parse(raw) as Partial<AgentConfig>;

  const config: AgentConfig = { ...DEFAULTS, ...parsed } as AgentConfig;

  // Validate required fields
  const required: (keyof AgentConfig)[] = [
    "agentId",
    "branchId",
    "apiUrl",
    "apiKey",
  ];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(
        `Missing required config field: "${key}" in agent-config.json`
      );
    }
  }

  return config;
}

// Singleton export
export const config: AgentConfig = loadConfig();
