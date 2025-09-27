@echo off
echo 🚀 Starting BlockBundlR Development Server
echo ==========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Start the development server
echo 🔥 Starting Next.js development server...
echo.
echo 📍 Available URLs:
echo    • Main App: http://localhost:3000/same-chain
echo    • RIF Test: http://localhost:3000/rif-test
echo    • Home: http://localhost:3000
echo.
echo 🔧 RIF Integration Features:
echo    • Payment method selection (rBTC vs RIF)
echo    • Smart wallet deployment
echo    • RIF token approval
echo    • Gas-less batch transactions
echo.
echo ⚠️  Make sure to:
echo    1. Connect wallet to Rootstock Testnet (Chain ID: 31)
echo    2. Have some RIF tokens for testing
echo    3. Test the /rif-test page first
echo.

npm run dev
