const WebSocket = require('ws');
const config = require('../config');
const { log, logError } = require('../utils/logger');
const { displayAccountsTable } = require('../utils/display');

class WebSocketHandler {
    constructor(accountDataManager) {
        this.accountDataManager = accountDataManager;
    }

    connectAccount(token, accountNumber) {
        const wsUrl = config.BASE_URL + token;
        const displayUrl = config.BASE_URL + '...[TOKEN_REDACTED]...';

        this.accountDataManager.initializeAccount(accountNumber);
        log(`Attempting to connect to: ${displayUrl}`, accountNumber);

        const ws = new WebSocket(wsUrl, {
            headers: config.WEBSOCKET_HEADERS
        });

        let heartbeatIntervalId;

        ws.on('open', () => this.handleOpen(ws, accountNumber, heartbeatIntervalId));
        ws.on('message', (data) => this.handleMessage(ws, data, accountNumber));
        ws.on('close', (code, reason) => this.handleClose(code, reason, accountNumber, heartbeatIntervalId));
        ws.on('error', (err) => this.handleError(err, accountNumber, heartbeatIntervalId));

        return ws;
    }

    handleOpen(ws, accountNumber, heartbeatIntervalId) {
        this.accountDataManager.updateAccountStatus(accountNumber, 'Connected');
        log('WebSocket connection established successfully.', accountNumber);

        heartbeatIntervalId = setInterval(() => {
            this.sendHeartbeat(ws, accountNumber);
        }, config.HEARTBEAT_INTERVAL_MS);
    }

    handleMessage(ws, data, accountNumber) {
        try {
            const messageStr = data.toString();
            const message = JSON.parse(messageStr);

            switch (message.type) {
                case "connected":
                    this.handleConnectedMessage(ws, message, accountNumber);
                    break;
                case "NodeStart":
                    log("Node Start acknowledged from server", accountNumber);
                    break;
                case "heartbeat_ack":
                    this.handleHeartbeatAck(accountNumber);
                    break;
                case "PointsUpdate":
                    this.handlePointsUpdate(message, accountNumber);
                    break;
                default:
                    log(`Unknown message type: ${message.type}`, accountNumber);
            }
        } catch (e) {
            logError('Error processing message:', data.toString(), accountNumber);
        }
    }

    handleConnectedMessage(ws, message, accountNumber) {
        this.accountDataManager.updateAccountData(accountNumber, {
            status: 'Active',
            user_id: message.data.user_id,
            wallet_address: message.data.wallet_address,
            user_level: message.data.user_level,
            connected_at: message.data.connected_at,
            session_id: message.data.session_id
        });

        log("Connection successful from server", accountNumber);
        this.sendNodeStartMessage(ws, accountNumber);
    }

    handleHeartbeatAck(accountNumber) {
        this.accountDataManager.updateLastActivity(accountNumber);
        displayAccountsTable(this.accountDataManager.getAccountsData());
    }

    handlePointsUpdate(message, accountNumber) {
        this.accountDataManager.updateAccountData(accountNumber, {
            total_points: message.data.total_points,
            total_boost_points: message.data.total_boost_points,
            start_time: message.data.start_time
        });
        
        log(`Points updated - Total: ${message.data.total_points}, Boost: ${message.data.total_boost_points}`, accountNumber);
    }

    handleClose(code, reason, accountNumber, heartbeatIntervalId) {
        const reasonStr = reason ? reason.toString() : 'No reason provided';
        this.accountDataManager.updateAccountStatus(accountNumber, 'Disconnected');
        logError(`Connection closed. Code: ${code}, Reason: ${reasonStr}`, null, accountNumber);
        clearInterval(heartbeatIntervalId);
    }

    handleError(err, accountNumber, heartbeatIntervalId) {
        this.accountDataManager.updateAccountStatus(accountNumber, 'Error');
        logError('WebSocket error:', err.message, accountNumber);
        clearInterval(heartbeatIntervalId);
    }

    sendHeartbeat(ws, accountNumber) {
        const heartbeatMessage = { type: "Heartbeat" };
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(heartbeatMessage));
                this.accountDataManager.updateLastActivity(accountNumber);
                displayAccountsTable(this.accountDataManager.getAccountsData());
            } catch (e) {
                logError('Error sending heartbeat:', e.message, accountNumber);
            }
        } else {
            this.accountDataManager.updateAccountStatus(accountNumber, 'Disconnected');
            displayAccountsTable(this.accountDataManager.getAccountsData());
        }
    }

    sendNodeStartMessage(ws, accountNumber) {
        const nodeStartMessage = { type: "NodeStart" };
        try {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(nodeStartMessage));
                log(`NodeStart message sent`, accountNumber);
            }
        } catch (e) {
            logError('Error sending NodeStart message:', e.message, accountNumber);
        }
    }
}

module.exports = WebSocketHandler;