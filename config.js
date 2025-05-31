module.exports = {
    DATA_FILE_PATH: 'data.txt',
    HEARTBEAT_INTERVAL_MS: 25000,
    BASE_URL: 'wss://websocket.layeredge.io/ws/node?token=',
    WEBSOCKET_HEADERS: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8"
    },
    TABLE_CONFIG: {
        head: ['Account', 'Status', 'User ID', 'Wallet Address', 'Level', 'Total Points', 'Boost Points', 'Last Update'],
        colWidths: [8, 12, 20, 25, 8, 12, 12, 20]
    }
};