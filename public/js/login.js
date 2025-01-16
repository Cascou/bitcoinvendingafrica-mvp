//-----------------------------------------------------------------
// Start of login.js -- Responsible as script for Login page
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const loginForm = document.querySelector('form');
const phoneMessage = document.querySelector('.phone.error')
const pinMessage = document.querySelector('.pin.error')
const errorMessage = document.querySelector('.login.error')


//-----------------------------------------------------------------
// Event for when the button is clicked
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();//prevents from page refreshing when button is clicked to allow for functions to run

    document.querySelector('button').disabled = true;
    //reset error
    phoneMessage.textContent = '';
    pinMessage.textContent = '';
    errorMessage.textContent = '';

    // get the values from text fields
    const phoneNumber = loginForm.phoneNumber.value;
    const pinNumber = loginForm.pinNumber.value;
    const countryCode = loginForm.querySelector('select').value;
    var myNumber = String(phoneNumber)

    if(phoneNumber.length<1 || pinNumber.length<1){
        errorMessage.textContent = 'please enter all empty fields to continue'
    }
    if(phoneNumber.startsWith('0', 0)===true){
        myNumber = myNumber.slice(1)
    }

    const finalPhoneNumber = "+" + countryCode + myNumber;
    
    try{
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber: finalPhoneNumber,
                pinNumber: pinNumber}),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        
        if(data.error){
            errorMessage.textContent = data.error;
        }
        if(data.phoneError){
            phoneMessage.textContent = data.phoneError;
        }
        if(data.pinError){
            pinMessage.textContent = data.pinError;
        }
        if(data.user){
            location.assign('dashboard');
        }
        document.querySelector('button').disabled = false;
    }
    catch (err){
        console.log(err);
    }
});

//-----------------------------------------------------------------
// End of login.js
//-----------------------------------------------------------------