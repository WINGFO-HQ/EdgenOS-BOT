const { displayAccountsTable } = require('./display');

function log(message, accountNumber = '') {
    displayAccountsTable();
    console.log(`\n[Account ${accountNumber}] ${message}`);
}

function logError(message, error, accountNumber = '') {
    displayAccountsTable();
    console.error(`\n[Account ${accountNumber}] ${message}`, error || '');
}

function logInfo(message) {
    console.log(`${message}`);
}

function logSuccess(message) {
    console.log(`${message}`);
}

module.exports = {
    log,
    logError,
    logInfo,
    logSuccess
};