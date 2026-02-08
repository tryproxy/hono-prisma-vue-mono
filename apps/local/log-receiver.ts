const PORT = 8787;

Bun.serve({
  port: PORT,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("OK");
  },
  websocket: {
    open() {
      console.log("[log] client connected");
    },
    message(_ws, message) {
      console.log(String(message));
    },
    close() {
      console.log("[log] client disconnected");
    },
  },
});

console.log(`ws://localhost:${PORT}`);
