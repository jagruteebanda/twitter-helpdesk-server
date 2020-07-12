const http = require("http");
const socketIo = require("socket.io");

// let receiverSocket;
// let broadcastSocket;

/**
 * INGESTION PORT CONNECTIONS
 */
// Specify ingestion socket port
const ingestionPort = process.env.IPORT || 5001;
// Creating ingestion server
const ingestionServer = http.createServer(global.app);
// Socket connection for ingestion
const receiver = socketIo(ingestionServer);
receiver.on("connection", receiverSocket => {
  console.log('Connected to ingestion client');

  // global.receiverSocket = receiverSocket;
  module.exports.receiver = receiverSocket;

  receiverSocket.on("disconnect", () => console.log("Client disconnected"));
});
// Ingestion server listening to Ingestion port
ingestionServer.listen(ingestionPort, () => console.log(`Receiver socket listening on port ${ingestionPort}`));


/**
 * BROADCAST PORT CONNECTIONS
 */
// Specify broadcast socket port
const broadcastPort = process.env.BPORT || 5002;
// Creating broadcast server
const broadcastServer = http.createServer(global.app);
// Socket connection for broadcast
const broadcast = socketIo(broadcastServer);
broadcast.on("connection", (broadcastSocket) => {
  console.log("Connected to broadcast client");

  // global.broadcastSocket = broadcastSocket;
  module.exports.broadcast = broadcastSocket;

  broadcastSocket.on("disconnect", () => console.log("Client disconnected"));
});
// Ingestion server listening to Broadcast port
broadcastServer.listen(broadcastPort, () =>
  console.log(`Broadcast socket listening on port ${broadcastPort}`)
);