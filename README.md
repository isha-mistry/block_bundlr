# BlockBundlR

![Built with Love](https://img.shields.io/badge/Built%20with-%E2%9D%A4%EF%B8%8F-red)
![Rootstock](https://img.shields.io/badge/Powered%20by-Rootstock-blue)
![RIF](https://img.shields.io/badge/Fees%20with-RIF-orange)
![AI Automation](https://img.shields.io/badge/AI-Automation-green)
![Testnet](https://img.shields.io/badge/Deployed-Testnet-lightgrey)

---

## Problem

Sending multiple RBTC transactions on Rootstock is slow and expensive, and users must hold RBTC for gas fees. This complicates automation and limits broader DeFi usability.

---

## Solution

BlockBundlR solves this by enabling batch RBTC transfers in a single transaction, powered by AI automation. Users can pay transaction fees in RIF, making gasless transactions possible and improving accessibility for Rootstock and the RIF ecosystem.

---

## Architecture

- **Smart Contracts**:  
  - `RIFRelayBatchTransactions` – Handles batch transaction logic and manages relayed fee payments (`0x05A76962F8Bd0141c79f7C18688f56FF5964DB9D`)
  - `BatchTransactionVerifier` – Verifies batch transaction outcomes (`0x72F0799635aB4404C2b0eb363973c04D5e8ab453`)

- **AI Automation Layer**:  
  - Automatically triggers and manages DeFi operations using AI prompts.

- **Frontend**:  
  - User-friendly interface for entering batched transactions, selecting payment options (RBTC/RIF), and interacting with AI modules.

---

## Features

- **Batch Transactions**: Send RBTC to multiple addresses in a single rootstock transaction.
- **Gasless with RIF**: Pay transaction fees using RIF tokens via Rootstock’s relayer model.
- **AI Automation**: Initiate automated DeFi operations with integrated AI modules.
- **Flexible Fee Options**: Select RBTC or RIF for transaction fees.
- **Error Handling**: Robust contract logic ensures validity of batch execution and payment.

---

## Team

- **Prapti Shah** – Smart Contracts (Blockchain Developer)
- **Isha Mistry** – Frontend + Contract Integration (Full Stack Blockchain Developer)
- **Princi Patel** – Data Analytics + AI DeFi Automation (Blockchain Data Analyst & Web3 Developer)

---

## How to Test

1. **Clone & Install**
    ```
    git clone https://github.com/<your-repo>/blockbundlr.git
    cd blockbundlr
    npm install
    ```

2. **Deploy Contracts**
    - Deploy smart contracts on the Rootstock testnet.

3. **Validate Functionality**
    - Batch RBTC send: Transfer to multiple addresses, single transaction.
    - Fee flexibility: Pay fees in RBTC or RIF.
    - AI Automation: Trigger DeFi ops via integrated AI modules.
    - Check execution results and error handling.

---

## Demo

- [Video Demo Link](https://drive.google.com/file/d/12rHgr771fNNYOqWjmYPctL4weonVGnNu/view?usp=sharing) 
---

## Future Scope

- Support cross-chain asset batching for broader DeFi interoperability.
- Extend to additional fee tokens and advanced relayer models.
- Deeper AI-powered automation (predictive execution, wallet linkages).
- Integration with Dune Analytics for on-chain data visualization.
- Mainnet deployment and partnership with Rootstock Foundation.

---

## Feedback

Building on Rootstock was both exciting and valuable. Collaborative smart contract engineering, frontend design, and AI integration enabled us to deliver advanced automation and enhanced accessibility for Rootstock and RIF.

