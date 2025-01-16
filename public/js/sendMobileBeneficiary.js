//-----------------------------------------------------------------
// Start of sendMobileBeneficiary.js -- Responsible as script for sendMobileBeneficiary page
//-----------------------------------------------------------------
//-----------------------------------------------------------------
// Initializing all npm packages necessary
const sendForm = document.querySelector('form');
const currencyAmount = document.querySelector('.inputCurrency');
const pinMessage =  document.querySelector('.pin.error');
const errorMessage = document.querySelector('.send.error');
const currencyMessage = document.querySelector('.currency.zar');

var currencySlider = document.getElementById("currencyRange");
var currencyOutput = document.querySelector(".currencyNumber");

var btcBalance = 0;
var usdtBalance = 0;
var btcPrice = 0;
var usdtPrice = 0;

//-----------------------------------------------------------------
// GetBeneficiary Method to get specific beneficiary into form.
function GetBeneficiary(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const variableValue = urlParams.get('ID');
   
    
    fetch('/getMobileBeneficiary/'+ variableValue)
        .then((response) => response.json())
        .then((data) => {
            // Store the balances in local storage
            sendForm.beneficiaryName.value = data.beneficiaryName;
            sendForm.beneficiaryMobile.value = data.beneficiaryMobile;
            sendForm.querySelector('select').value = data.currency;
        })
        .catch((error) => console.log(error));    
}

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
currencyOutput.innerHTML = currencySlider.value;


// Update the current slider value (each time you drag the slider handle)
currencySlider.oninput = function() {
    currencyOutput.innerHTML = this.value + '%';
}

currencyAmount.addEventListener('input', () => {
    // Calls getbtcPrice Method
    var value = Number(currencyAmount.value)
    getCurrencyPrice(value);
});


function getCurrencyPrice(value){
    if(sendForm.querySelector('select').value ==='BTC'){
        zarValue = value * btcPrice;
        currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
    }else{
        zarValue = value * usdtPrice;
        currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
    }
}

sendForm.querySelector('select').onchange = function(){
    currencyMessage.textContent = '(est. R 0.00)';
    currencyAmount.value = "0.00";
    currencyOutput.innerHTML = '0%'
    currencySlider.value = 0;
}

currencySlider.onchange = function(){
    var value = 0;
    var zarValue = 0;
    

    if(sendForm.querySelector('select').value ==='BTC'){

        if(currencyOutput.innerHTML === '25%'){
            value = btcBalance * 0.25;
            currencyAmount.value = value;
            zarValue = value * btcPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
        }else if(currencyOutput.innerHTML === '50%'){
            value = btcBalance * 0.50;
            currencyAmount.value = value
            zarValue = value * btcPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
        }else if(currencyOutput.innerHTML === '75%'){
            value = btcBalance * 0.75;
            currencyAmount.value = value
            zarValue = value * btcPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
        }else if(currencyOutput.innerHTML === '100%'){
            value = btcBalance * 1;
            currencyAmount.value = value
            zarValue = value * btcPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
        }else if(currencyOutput.innerHTML === '0%'){
            value = btcBalance * 0;
            currencyAmount.value = value
            zarValue = value * btcPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
        }
    }else{

        if(currencyOutput.innerHTML === '25%'){
            value = usdtBalance * 0.25;
            currencyAmount.value = value
            zarValue = value * usdtPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
        }else if(currencyOutput.innerHTML === '50%'){
            value = usdtBalance * 0.50;
            currencyAmount.value = value
            zarValue = value * usdtPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')'; 
        }else if(currencyOutput.innerHTML === '75%'){
            value = usdtBalance * 0.75;
            currencyAmount.value = value
            zarValue = value * usdtPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
        }else if(currencyOutput.innerHTML === '100%'){
            value = usdtBalance * 1;
            currencyAmount.value = value
            zarValue = value * usdtPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
        }else if(currencyOutput.innerHTML === '0%'){
            value = usdtBalance * 0;
            currencyAmount.value = value
            zarValue = value * usdtPrice;
            currencyMessage.textContent = '(est. R ' + zarValue.toFixed(2).toString() + ')';
        }
    }
}

//-----------------------------------------------------------------
// Button Functionality for sendBtn.
document.getElementById("sendbtn").onclick = async()=>{
    event.preventDefault();
    document.getElementById('sendbtn').disabled = true;
    //reset error values
    pinMessage.textContent = '';
    errorMessage.textContent = '';

    //get other necessary values
    const pinNumber = sendForm.pinNumber.value;
    const mobileAddress = sendForm.beneficiaryMobile.value;
    var stringNumber = String(myNumber);
    const currency = sendForm.querySelector('select').value;
    const amount = sendForm.currencyAmount.value;
        
    if(pinNumber===''){
        document.getElementById('sendbtn').disabled = false;
        return pinMessage.textContent = 'you must enter pin field.'
    }else{
        try{
            const res = await fetch('/sendMobileBeneficiary', {
                method: 'POST',
                body: JSON.stringify({
                    phoneNumber: stringNumber,
                    mobileAddress: mobileAddress,
                    currency: currency,
                    amount: amount,
                    pin: pinNumber
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            
            if(data.error){
                errorMessage.textContent = data.error;
                document.querySelector('button').disabled = false;
            }
            if(data.pinError){
                pinMessage.textContent = data.pinError;
                document.querySelector('button').disabled = false;
            }
            if(data.result){
                alert("Successfully sent crypto to BVA number");                
                location.reload();
            }
        }
        catch (err){
            console.log(err);
        }
    } 
}

//-------------------------------------------------------------------------
//End of sendMobileBeneficiary.js
//-------------------------------------------------------------------------
