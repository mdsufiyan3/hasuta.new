const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        // Broadcast the update to all connected clients
        const data = JSON.parse(message);
        broadcastUpdate(data);
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

function broadcastUpdate(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
