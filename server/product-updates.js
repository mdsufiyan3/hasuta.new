const express = require('express');
const router = express.Router();

let clients = new Set();

// Handle client connections for SSE
router.get('/api/product-updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.add(res);

    req.on('close', () => clients.delete(res));
});

// Handle updates from admin dashboard
router.post('/api/product-updates', (req, res) => {
    const update = req.body;
    
    // Broadcast to all connected clients
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(update)}\n\n`);
    });

    res.status(200).json({ message: 'Update broadcast successful' });
});

module.exports = router;
