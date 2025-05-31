const fs = require('fs');
const config = require('../config');

function readTokensFromFile() {
    try {
        const fileContent = fs.readFileSync(config.DATA_FILE_PATH, 'utf8');
        const tokens = fileContent
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line && line.split('.').length === 3);

        if (tokens.length === 0) {
            throw new Error(`${config.DATA_FILE_PATH} does not contain valid tokens or is empty.`);
        }

        return tokens;
    } catch (error) {
        throw new Error(`Error reading tokens from ${config.DATA_FILE_PATH}: ${error.message}`);
    }
}

module.exports = {
    readTokensFromFile
};