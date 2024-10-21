"use strict";
// websocket-server.js
const WS = require("ws");
const wss = new WS.Server({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("A new client connected");
    ws.on("message", (message) => {
        wss.clients.forEach((client) => {
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
