# Bitcoin Vending Africa (BVA) - Transaction Engine

#### *Proof of Concept*
Transaction engine enabling prepiad voucher and cryptocurrency remittance in Africa. This system aims to bridge the informal economy with crypto markets by enabled simple interactions using prepiad vouchers (cash) into Crypto (BTC/USDT).

## 🧰 Tech Stack

| Layer          | Technology              |
|----------------|--------------------------|
| **Backend**    | Node.js, Express.js      |
| **Frontend**   | HTML, CSS                |
| **CI/CD**      | GitHub (manual)          |
| **Deployment** | Azure (App + DB)         |
| **Architecture** | Client/Server         |
| **Design Pattern** | MVC (Model-View-Controller) |

## ℹ Project Status
> ⚠ *This is a Proof of Concept**, testing in a production-like environment.
> Made to secure funding and investor backing

## 🚀 Future Improvements
- ♾ *UI/UX Revamp* - modern design, responsive UI.
- 🔐 *Security Enhancements* - input sanitization, JWT/session-based auth, rate limiting, better logging, encryption.
- 🧱 *Modular Architecture* - reduce nesting, reusable mdules, cleaner separation of concerns.
- ⚙ *Database Optimization* - stored procedures, enable connection pooling.
- 🕸 *Web3 Integration* - Enable further interactions, On-chain transactions, and staking protocols.
- 🛠 *Testing Suite*

## 🔑 Core Features

### 💳 Prepaid Vouchers & Crypto
- Buy BTC/USDT with prepaid vouchers.
- Sell BTC/USDT for prepaid vouchers.
  
### ♾ Internal & External Remittance
- Transfer Crypto to other BVA members (internal).
- Transfer Crypto to External Wallet Addresses (EOA).

## 💡 Notes
- *Liquidity Provider:* Used a custodial wallet via [VALR]() (Web2 setup).
- *Web3 Status:* No blockchain libraries used due to centralzied liquidity provider.

## 🖥 Local Development
### Clone the repository
```
git clone https://github.com/your-username/bitcoin-vending-africa.git
```
### Enter repository
```
cd bitcoin-vending-africa
```
### Install dependencies
```
npm install
```
### Start development server
```
npm run dev
```
> 📁Entry Point: ```src/index.js```
> ⚠ Not fully functional without ```.env``` variables stored on production server

