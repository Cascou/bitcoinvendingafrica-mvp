//-----------------------------------------------------------------
// Start of balance.js -- Responsible as script for balance page
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const balanceForm = document.querySelector('form');
const btc = document.querySelector('#btc');
const usdt = document.querySelector('#usdt');


//-----------------------------------------------------------------
// Event for when the button is clicked
balanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();//prevents from page refreshing when button is clicked to allow for functions to run
    document.querySelector('button').disabled = true;
    //reset balance
    btc.textContent = '**********';
    usdt.textContent = '**********';
    
    try{
        const res = await fetch('/balance', {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber: myNumber}),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        
        if(data.BTC){
            btc.textContent = 'BTC:  ' + data.BTC;
            usdt.textContent = 'USDT:  ' + data.USDT;
        }
        if(data.error){
            console.log(data.error)
        }
        if(data.BTC==='null'){
            btc.textContent = 'BTC: 0.0';
            usdt.textContent = 'USDT: 0.0';
        }
        document.querySelector('button').disabled = false;
    }
    catch (err){
        console.log(err);
    }
});

//-----------------------------------------------------------------
// End of balance.js
//-----------------------------------------------------------------


