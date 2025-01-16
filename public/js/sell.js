//-----------------------------------------------------------------
// Start of sell.js -- Responsible as script for sell page
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const sellForm = document.querySelector('form');
const btcAmount = document.querySelector('.inputBTC');
const usdtAmount = document.querySelector('.inputUSDT');
const pinMessage = document.querySelector('.pin.error');
const errorMessage = document.querySelector('.sell.error');
const btcZarMessage = document.querySelector('.btc.zar');
const usdtZarMessage = document.querySelector('.usdt.zar');

var btcSlider = document.getElementById("btcRange");
var usdtSlider = document.getElementById("usdtRange");
var usdtOutput = document.querySelector(".usdtNumber");
var btcOutput = document.querySelector(".btcNumber");

var btcBalance = 0;
var usdtBalance = 0;
var btcPrice = 0;
var usdtPrice = 0;

//-----------------------------------------------------------------
// GetBalance Method to get balance for specific user.
function getBalance(){
    fetch('/getBalance')
    .then((response) => response.json())
    .then((data) => {
        // Store the balances in local storage
        btcBalance = data.btcBalance;
        usdtBalance = data.usdtBalance;
    })
    .catch((error) => console.log(error));

    fetch('/getSummary')
    .then((response) => response.json())
    .then((data) => {
        // Store the balances in local storage
        btcPrice = data.btcPrice;
        usdtPrice = data.usdtPrice;
    })
    .catch((error) => console.log(error));
}

// Display the default sliders value
btcOutput.innerHTML = btcSlider.value;
usdtOutput.innerHTML = usdtSlider.value; 

// Update the current slider value (each time you drag the slider handle)
btcSlider.oninput = function() {
    btcOutput.innerHTML = this.value + '%';
}

// Update the current slider value (each time you drag the slider handle)
usdtSlider.oninput = function() {
    usdtOutput.innerHTML = this.value + '%';
}

btcAmount.addEventListener('input', () => {
    // Calls getbtcPrice Method
    var value = Number(btcAmount.value)
    getbtcPrice(value);
});

function getbtcPrice(value){
    zarValue = value * btcPrice;
    btcZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
}

btcSlider.onchange = function(){
    var value = 0;
    var zarValue = 0;

    if(btcOutput.innerHTML === '25%'){
       value = btcBalance * 0.25;
       btcAmount.value = value;
       zarValue = value * btcPrice;
       btcZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 

    }else if(btcOutput.innerHTML === '50%'){
        value = btcBalance * 0.50;
        btcAmount.value = value
        zarValue = value * btcPrice;
        btcZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
    }else if(btcOutput.innerHTML === '75%'){
        value = btcBalance * 0.75;
        btcAmount.value = value
        zarValue = value * btcPrice;
        btcZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
    }else if(btcOutput.innerHTML === '100%'){
        value = btcBalance * 1;
        btcAmount.value = value
        zarValue = value * btcPrice;
        btcZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
    }else if(btcOutput.innerHTML === '0%'){
        value = btcBalance * 0;
        btcAmount.value = value
        zarValue = value * btcPrice;
        btcZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
    }
}

usdtAmount.addEventListener('input', () => {
    // Calls getUSDTPrice Method
    var value = Number(usdtAmount.value)
    getUSDTPrice(value);
});

function getUSDTPrice(value){
    zarValue = value * usdtPrice;
    usdtZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
}

usdtSlider.onchange = function(){
    var value = 0;
    var zarValue = 0;

    if(usdtOutput.innerHTML === '25%'){
       value = usdtBalance * 0.25;
       usdtAmount.value = value
       zarValue = value * usdtPrice;
       usdtZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 

    }else if(usdtOutput.innerHTML === '50%'){
        value = usdtBalance * 0.50;
        usdtAmount.value = value
        zarValue = value * usdtPrice;
        usdtZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
    }else if(usdtOutput.innerHTML === '75%'){
        value = usdtBalance * 0.75;
        usdtAmount.value = value
        zarValue = value * usdtPrice;
        usdtZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
    }else if(usdtOutput.innerHTML === '100%'){
        value = usdtBalance * 1;
        usdtAmount.value = value
        zarValue = value * usdtPrice;
        usdtZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
    }else if(usdtOutput.innerHTML === '0%'){
        value = usdtBalance * 0;
        usdtAmount.value = value
        zarValue = value * usdtPrice;
        usdtZarMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
    }
}

//-----------------------------------------------------------------
// Button Functionality for BTC.
document.getElementById("btcbtn").onclick = async()=>{
    event.preventDefault();
    document.getElementById('usdtbtn').disabled = true;
    document.getElementById('btcbtn').disabled = true;
    //reset error values
    pinMessage.textContent = '';
    errorMessage.textContent = '';

    //get other necessary values
    const pinNumber = sellForm.pinNumber.value;
    var stringNumber = String(myNumber);
    const currency = 'BTC';
    const amount = btcAmount.value;
    const marketPrice = btcPrice;
    
    if(pinNumber===''){
        document.getElementById('usdtbtn').disabled = false;
        document.getElementById('btcbtn').disabled = false;
        return pinMessage.textContent = 'you must enter pin field.'
    }else{
        try{
            const res = await fetch('/sell', {
                method: 'POST',
                body: JSON.stringify({
                    pin: pinNumber,
                    phoneNumber: stringNumber,
                    amount: amount,
                    marketPrice: marketPrice,
                    currency: currency
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            
            if(data.error){
                errorMessage.textContent = data.error;
            }
            if(data.pinError){
                pinMessage.textContent = data.pinError;
            }
            if(data.result){
                alert("Voucher Pin: " + data.result + '\n' + 
                "Blu Voucher Amount: R" + data.amount/100 + '\n' + 
                "Serial Number: " + data.serial + '\n' + 
                "Transaction Reference: " + data.transRef + '\n' +
                "Instructions: " + data.instruction);
                                
                location.reload();
            }
        }
        catch (err){
            console.log(err);
        }
    } 
}

//-----------------------------------------------------------------
// Button Functionality for USDT.
document.getElementById("usdtbtn").onclick = async()=>{
    event.preventDefault()
    document.getElementById('usdtbtn').disabled = true;
    document.getElementById('btcbtn').disabled = true;
    
    //reset error values
    pinMessage.textContent = '';
    errorMessage.textContent = '';

    //get other necessary values
    const pinNumber = sellForm.pinNumber.value;
    var stringNumber = String(myNumber);
    const currency = 'USDT';
    const amount = usdtAmount.value;
    const marketPrice = usdtPrice;
    
    if(pinNumber===''){
        document.getElementById('usdtbtn').disabled = false;
        document.getElementById('btcbtn').disabled = false;
        return pinMessage.textContent = 'you must enter pin field.'
    }else{
        try{
            const res = await fetch('/sell', {
                method: 'POST',
                body: JSON.stringify({
                    pin: pinNumber,
                    phoneNumber: stringNumber,
                    amount: amount,
                    marketPrice: marketPrice,
                    currency: currency
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            
            if(data.error){
                errorMessage.textContent = data.error;
            }
            if(data.pinError){
                pinMessage.textContent = data.pinError;
            }
            if(data.result){
                alert("Voucher Pin: " + data.token + '\n' + 
                "Blu Voucher Amount: R" + data.amount/100 + '\n' + 
                "Serial Number: " + data.serial + '\n' + 
                "Transaction Reference: " + data.transRef + '\n' +
                "Instructions: " + data.instruction);
               
                location.reload();
            }
            
        }
        catch (err){
            console.log(err);
        }
    } 
}

//-----------------------------------------------------------------
// End of sell.js
//-----------------------------------------------------------------
