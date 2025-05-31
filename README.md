# EdgenOS-BOT - LayerEdge WebSocket Monitor Multi-Account

## Description

EdgenOS-BOT is a multi-account WebSocket monitor for LayerEdge. It connects to the LayerEdge WebSocket API using tokens provided in a data file and displays account information.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/WINGFO-HQ/EdgenOS-BOT.git
   ```
2. Navigate to the project directory:
   ```bash
   cd EdgenOS-BOT
   ```
3. Install dependencies using npm:
   ```bash
   npm install
   ```

## Usage

1. Add your LayerEdge account tokens to the `data.txt` file, with each token on a new line.
2. Start the bot using one of the following commands:
   - To run the bot:
     ```bash
     npm start
     ```

## Configuration

The bot can be configured via the `config.js` file. This file contains settings such as the data file path, heartbeat interval, WebSocket URL, and table display configuration. 