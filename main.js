const { logInfo, logSuccess, logError } = require('./utils/logger');
const { displayAccountsTable } = require('./utils/display');
const { readTokensFromFile } = require('./utils/fileReader');
const AccountDataManager = require('./services/AccountDataManager');
const WebSocketHandler = require('./services/WebSocketHandler');

class LayerEdgeMonitor {
    constructor() {
        this.accountDataManager = new AccountDataManager();
        this.webSocketHandler = new WebSocketHandler(this.accountDataManager);
    }

    async start() {
        logInfo("Starting LayerEdge WebSocket Monitor Multi-Account...\n");
        
        try {
            const tokens = readTokensFromFile();
            logSuccess(`Found ${tokens.length} accounts. Starting connections...\n`);
            
            displayAccountsTable(this.accountDataManager.getAccountsData());
            
            this.connectAllAccounts(tokens);
            
        } catch (error) {
            logError('Initialization error:', error.message);
            process.exit(1);
        }
    }

    connectAllAccounts(tokens) {
        tokens.forEach((token, index) => {
            setTimeout(() => {
                this.webSocketHandler.connectAccount(token, index + 1);
            }, index * 1000);
        });
    }
}

const monitor = new LayerEdgeMonitor();
monitor.start();