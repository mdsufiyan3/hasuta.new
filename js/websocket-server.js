const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Store all connected clients
const clients = new Set();

wss.on('connection', function connection(ws) {
    clients.add(ws);

    ws.on('message', function incoming(message) {
        // Broadcast the message to all connected clients
        const data = JSON.parse(message);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

console.log('WebSocket server running on port 8080');
