// index.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

// Initialize Express app
const app = express();

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Create a WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection event
wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log("Received message:", message.toString());

    // Respond back to the client
    // ws.send(`Server received: ${message}`);
  });

  // Handle WebSocket connection close event
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  // Send a welcome message to the client
  //   ws.send("Hello from the WebSocket server");
});

// Handle HTTP GET request on the root path
app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

// Define the port to listen on
const PORT = process.env.PORT || 8080;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
