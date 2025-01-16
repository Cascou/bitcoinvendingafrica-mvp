# Bitcoin Vending Africa (BVA) - Transaction Engine
-------------------------------------------------
## Tech Stack: 
            Backend: Express, Node.js
            Frontend: HTML/CSS
            CI/CD: version control through Github
            Deployment: Server and Database is hosted on Azure

            Architecture: Client/Server
            Design Pattern: Model View Controller (MVC)
-------------------------------------------------
#### Description
The full intent of this software is Proof of Concept in a production environment.
To be used & improved whilst finding investors. 

Once receiving investment:
- Revamp the UI/UX.
- Implement better security practices.
- Modularize and refactor code.
- Implement new features

Better Practices:
- stored procedures
- allow open connection for multiple db calls.
- web3 intergration
- Modularize, structure code better (reduce nested if-statements) etc..
-------------------------------------------------
### Core Features:

#### Prepaid Vouchers & Cryptocurrencies
- Allowing members to use their prepaid vouchers to purchase Bitcoin or USDT.
- Allowing members to sell their Bitcoin or USDT for prepaid vouchers.
   
#### Internal and External Remittance
- Users can send Bitcoin or USDT to other BVA members.
- Users can send Bitcoin or USDT to EOA
 
#### Notes:
- We used a Wallet from VALR as the liquidity provider, this is a Web2 instance.
- Therefore, no Web3 libraries could be used in-order to facilitate external remittance.
- These would've been steps that we would've taken once funding was achieved.  
-------------------------------------------------
## Local Usage
            # Install Dependencies
            npm install

            # Run Instance
            npm run dev

            Server File is under 'src'-> 'index.js'
            *should not be operational, as all environmental variables are stored on the server.
