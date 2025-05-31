class AccountDataManager {
    constructor() {
        this.accountsData = {};
    }

    initializeAccount(accountNumber) {
        this.accountsData[accountNumber] = {
            status: 'Connecting...',
            last_update: new Date().toLocaleString()
        };
    }

    updateAccountStatus(accountNumber, status) {
        if (!this.accountsData[accountNumber]) {
            this.initializeAccount(accountNumber);
        }
        this.accountsData[accountNumber].status = status;
        this.accountsData[accountNumber].last_update = new Date().toLocaleString();
    }

    updateAccountData(accountNumber, data) {
        this.accountsData[accountNumber] = {
            ...this.accountsData[accountNumber],
            ...data,
            last_update: new Date().toLocaleString()
        };
    }

    updateLastActivity(accountNumber) {
        if (this.accountsData[accountNumber]) {
            this.accountsData[accountNumber].last_update = new Date().toLocaleString();
        }
    }

    getAccountsData() {
        return this.accountsData;
    }

    getAccountData(accountNumber) {
        return this.accountsData[accountNumber];
    }
}

module.exports = AccountDataManager;