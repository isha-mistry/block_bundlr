@echo off
echo 🚀 Starting RIF Relay Server...
echo 📍 Server URL: http://localhost:8090
echo 🔗 Network: Rootstock Testnet
echo.

REM Set environment variables
set NODE_ENV=development
set RELAY_SERVER_PORT=8090
set RPC_URL=https://public-node.testnet.rsk.co
set CHAIN_ID=31

REM Start the server
npm start
