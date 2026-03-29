# Gymcentrix Agent

> Windows tray application that bridges a USB RFID keyboard-wedge reader to the Gymcentrix cloud API and serves real-time events to a local kiosk browser via WebSocket.

## Architecture

```
RFID Reader (USB HID) → Agent Process → Gymcentrix API
                                      ↓
                             ws://localhost:4010
                                      ↓
                           kiosk-client.html (browser)
```

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Windows | 10 / 11 |

## Setup

### 1. Install dependencies
```bash
cd apps/agent
npm install
```

### 2. Prepare the tray icon
```bash
node scripts/prepare-icon.js
```
> Optionally convert to a proper `.ico` using ImageMagick:
> ```bash
> magick convert assets/icon.ico -resize 256x256 assets/icon.ico
> ```

### 3. Configure the agent

Edit `agent-config.json`:

```jsonc
{
  "agentId": "device-01",      // Unique ID for this PC
  "branchId": "branch-01",     // Gymcentrix branch ID
  "apiUrl": "https://api.gymcentrix.com",
  "apiKey": "your-api-key",
  "wsPort": 4010,              // Local WebSocket port
  "retryIntervalMs": 30000,    // Offline retry interval
  "rfidTimeoutMs": 500,        // Max ms between RFID digit keystrokes
  "rfidLength": 10             // Expected UID digit count
}
```

## Running

### Development (with hot reload)
```bash
npm run dev
```

### Production (compiled)
```bash
npm run build
npm start
```

## Building the Windows Executable

```bash
# 1. Compile TypeScript
npm run build

# 2. Package into a single .exe
npm run package
```

This produces `GymcentrixAgent.exe` in the project root using [pkg](https://github.com/vercel/pkg).

## Auto-Start

The agent automatically registers itself in the Windows Run registry key on first launch:

```
HKCU\Software\Microsoft\Windows\CurrentVersion\Run
  GymcentrixAgent = "C:\path\to\GymcentrixAgent.exe"
```

To remove it, call `unregisterAutoStart()` from `src/auto-start.ts` or delete the registry entry manually.

## Kiosk Setup

1. Open `kiosk-client.html` in any browser on the same PC.
2. The page connects to `ws://localhost:4010` automatically.
3. RFID scan events are displayed in real-time.

## Tray Menu

| Item | Action |
|---|---|
| Status: Running | Informational |
| Reader: Active | RFID listener state |
| Internet: Online | API connectivity |
| Open Settings | Opens `agent-config.json` in Notepad |
| View Logs | Opens `logs/agent.log` in Notepad |
| Restart Agent | Restarts the process |
| Exit | Gracefully exits |

## Logs

Logs are written to `logs/agent.log` (max 5 MB × 5 files, then rotated).

## Offline Queue

When the API is unreachable, scans are stored in `queue.json`:

```json
[
  { "uid": "1323539291", "timestamp": 1711000000000 }
]
```

The retry loop checks every `retryIntervalMs` ms and drains the queue when connectivity is restored.

## Project Structure

```
apps/agent/
├── assets/
│   └── icon.ico              # Tray icon
├── logs/                     # Runtime logs (auto-created)
├── scripts/
│   └── prepare-icon.js       # Icon setup helper
├── src/
│   ├── index.ts              # Entry point
│   ├── config.ts             # Config loader
│   ├── logger.ts             # Winston logger
│   ├── rfid-listener.ts      # Global RFID capture
│   ├── api-client.ts         # Gymcentrix API client
│   ├── queue.ts              # Offline queue + retry
│   ├── websocket-server.ts   # Local WS server
│   ├── tray.ts               # System tray
│   └── auto-start.ts         # Windows registry auto-start
├── kiosk-client.html          # Example kiosk browser client
├── agent-config.json          # Local device configuration
├── package.json
└── tsconfig.json
```

## Notes

- `node-global-key-listener` uses a Windows keyboard hook. Some antivirus tools may flag this — add an exception for the agent executable.
- Run the agent as a **standard user**, not elevated (keyboard hooks don't fire on `SYSTEM` or UAC-elevated processes by default).
- The WebSocket server binds to `127.0.0.1` only (not exposed to the network).
