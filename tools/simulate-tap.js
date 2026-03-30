const http = require('http');

/**
 * GYMCENTRIX RFID SIMULATOR
 * Use this tool to trigger tap-in events without physical hardware.
 */

const API_URL = 'http://localhost:3001';
const AGENT_API_KEY = 'agent-1-key'; // Default from seed
const RFID_UIDS = {
  AUTHORIZED: '1234567890',
  EXPIRED: 'CARD-67890',
  DENIED: 'CARD-99999',
  UNKNOWN: 'UNKNOWN-TAG-' + Math.floor(Math.random() * 1000)
};

function simulateTap(rfidUid) {
  const data = JSON.stringify({ rfidUid });
  const url = new URL(`${API_URL}/rfid/checkin`);

  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-api-key': AGENT_API_KEY
    }
  };

  console.log(`\x1b[36m[Simulator]\x1b[0m Sending tap-in for UID: \x1b[33m${rfidUid}\x1b[0m...`);

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log(`\x1b[32m[Success]\x1b[0m Status: ${res.statusCode}`);
        console.log(JSON.parse(body));
      } else {
        console.log(`\x1b[31m[Error]\x1b[0m Status: ${res.statusCode}`);
        try {
          console.log(JSON.parse(body));
        } catch (e) {
          console.log(body);
        }
      }
    });
  });

  req.on('error', (error) => {
    console.error(`\x1b[31m[Connection Failed]\x1b[0m Is the API running on ${API_URL}?`);
    console.error(error.message);
  });

  req.write(data);
  req.end();
}

// Get UID from args or use default
const type = process.argv[2]?.toUpperCase() || 'AUTHORIZED';
const uid = RFID_UIDS[type] || process.argv[2] || RFID_UIDS.AUTHORIZED;

simulateTap(uid);
