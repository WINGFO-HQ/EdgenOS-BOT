const Table = require('cli-table3');
const config = require('../config');

function clearConsole() {
    console.clear();
}

function displayAccountsTable(accountsData = {}) {
    clearConsole();
    
    const mainTable = new Table(config.TABLE_CONFIG);

    if (Object.keys(accountsData).length === 0) {
        mainTable.push(['N/A', 'Waiting...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
    } else {
        Object.keys(accountsData)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach(accountNum => {
                const data = accountsData[accountNum];
                mainTable.push([
                    accountNum,
                    data.status || 'Connecting',
                    data.user_id ? data.user_id.substring(0, 18) + '...' : 'N/A',
                    data.wallet_address ? data.wallet_address.substring(0, 22) + '...' : 'N/A',
                    data.user_level || 'N/A',
                    data.total_points || '0',
                    data.total_boost_points || '0',
                    data.last_update || 'N/A'
                ]);
            });
    }

    console.log('\nEdgenOS-BOT');
    console.log('https://t.me/infomindao')
    console.log(mainTable.toString());
    console.log(`\nLast updated: ${new Date().toLocaleString()}`);
    console.log('━'.repeat(125));
}

module.exports = {
    clearConsole,
    displayAccountsTable
};