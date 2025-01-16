//-----------------------------------------------------------------
// Start of buy.js -- Responsible as script for buy page
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const buyForm = document.querySelector('form');
const voucherMessage = document.querySelector('.voucher.error')
const pinMessage = document.querySelector('.pin.error')
const errorMessage = document.querySelector('.buy.error')

var input = document.getElementById("voucherDetail");

input.addEventListener("input", () => input.value = formatNumber(input.value.replaceAll(" ", "")));

const formatNumber = (number) => number.split("").reduce((seed, next, index) => {
  if (index !== 0 && !(index % 4)) seed += " ";
  return seed + next;
}, "");

//-----------------------------------------------------------------
// Event for when the button is clicked
buyForm.addEventListener('submit', async (e) => {
    e.preventDefault();//prevents from page refreshing when button is clicked to allow for functions to run
    document.querySelector('button').disabled = true;
    //reset error
    voucherMessage.textContent = '';
    pinMessage.textContent = '';
    errorMessage.textContent = '';

    // get the values from text fields
    var voucherDetail = buyForm.voucherDetail.value;
    var newVoucherDetail = voucherDetail.replace(/\s/g,'')
    const pin = buyForm.pin.value;
    const currency = buyForm.querySelector('select').value;
    var stringNumber = String(myNumber)
    const regex = /[^0-9]/;

    if(regex.test(newVoucherDetail)===true){
        document.querySelector('button').disabled = false;
        return voucherMessage.textContent = 'Invalid Voucher Pin.';
    }else{
        try{
            const res = await fetch('/buy', {
                method: 'POST',
                body: JSON.stringify({
                    voucherDetail: newVoucherDetail,
                    pin: pin,
                    phoneNumber: stringNumber,
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
            if(data.voucherError){
                voucherMessage.textContent = data.voucherError;
            }
            if(data.pinError){
                pinMessage.textContent = data.pinError;
            }
            if(data.result){
                errorMessage.textContent = data.result;
            }   
        }
        catch (err){
            console.log(err);
        }
        document.querySelector('button').disabled = false;
    }
});

//-----------------------------------------------------------------
// End of buy.js
//-----------------------------------------------------------------