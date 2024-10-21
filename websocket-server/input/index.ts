// websocket-server.js
const WS = require("ws");

const wss = new WS.Server({ port: 8080 });

wss.on("connection", (ws: any) => {
  console.log("A new client connected");

  ws.on("message", (message: any) => {
    wss.clients.forEach((client: any) => {
      if (client !== ws && client.readyState === WS.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("A client disconnected");
  });
});

console.log("welcome to typescript");