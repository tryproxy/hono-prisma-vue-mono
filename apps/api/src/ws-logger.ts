// ws-logger.ts
type LogEvent = {
  ts: string;
  kind: "message" | "callback" | "update";
  userId?: number;
  username?: string;
  text?: string;
  data?: string;
};

const WS_LOG_URL = process.env.WS_LOG_URL;

let ws: WebSocket | null = null;
let connected = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function connect() {
  if (!WS_LOG_URL) return;

  ws = new WebSocket(WS_LOG_URL);

  ws.addEventListener("open", () => {
    connected = true;
    console.log(`[ws-log] connected ${WS_LOG_URL}`);
  });

  ws.addEventListener("close", () => {
    connected = false;
    console.log("[ws-log] disconnected, retrying...");
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, 3000);
    }
  });

  ws.addEventListener("error", () => {
    // silence noisy errors; close will trigger reconnect
  });
}

export function initWsLogger() {
  if (!WS_LOG_URL) {
    console.log("[ws-log] WS_LOG_URL not set; disabled");
    return;
  }
  connect();
}

export function sendLog(event: LogEvent) {
  if (!connected || !ws) return;
  ws.send(JSON.stringify(event));
}
