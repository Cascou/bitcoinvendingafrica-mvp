//-----------------------------------------------------------------
// Start of register.js -- Responsible as script for Register page
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const registerForm = document.querySelector('form');
const errorMessage = document.querySelector(".register.error")
const phoneMessage = document.querySelector(".phone.error")
const pinMessage = document.querySelector(".pin.error")
const otpMessage = document.querySelector(".otp.error")



//-----------------------------------------------------------------
// Event for when the button is clicked
function send() {
    event.preventDefault()
    errorMessage.textContent = ''

    document.getElementById('sendOTP').disabled = true;
    const phoneNumber = registerForm.phoneNumber.value;
    const countryCode = registerForm.querySelector('select').value;
    var myNumber = String(phoneNumber);
    
    if(phoneNumber===''){
        document.getElementById('sendOTP').disabled = false; 
        return errorMessage.textContent = 'you must enter a phone number to send OTP.'
    }else{

        if(phoneNumber.startsWith('0', 0)===true){
            myNumber = myNumber.slice(1);
        }
        
        const finalPhoneNumber = countryCode + myNumber;

        fetch("https://bluredeem.azurewebsites.net/sendVerification?phoneNumber=" + finalPhoneNumber).then((response)=>{

            response.json().then((data)=>{
                if(data.error){
                    errorMessage.textContent = data.error;
                }else if (data.result){
                    errorMessage.textContent = "OTP sent to number";
                    document.getElementById('sendOTP').disabled = false;
                }
            });
        });
        document.getElementById('submitBtn').disabled = false;
    }  
}

//-----------------------------------------------------------------
// Event for when the button is clicked
registerForm.addEventListener('submit', async (e) =>{
    e.preventDefault();//prevents from page refreshing when button is clicked to allow for functions to run
    document.getElementById('submitBtn').disabled = true;
    //reset error
    errorMessage.textContent = '';
    // get the values from text fields
    
    const pinNumber = registerForm.pinNumber.value;
    const otpPin = registerForm.otpNumber.value;
    const countryCode = registerForm.querySelector('select').value;
    const phoneNumber = registerForm.phoneNumber.value;
    var myNumber = String(phoneNumber)
    
    

    if(phoneNumber.length<1 || pinNumber.length<1 || otpPin.length<1){
        errorMessage.textContent = 'please enter all empty fields to continue'
        document.getElementById('submitBtn').disabled = false;
    }else{

        if(phoneNumber.startsWith('0', 0)===true){
            myNumber = myNumber.slice(1)
        }

        const finalPhoneNumber = "+" + countryCode + myNumber;
        try{
            const res = await fetch('/register', {
                method: 'POST',
                body: JSON.stringify({
                    phoneNumber: finalPhoneNumber, 
                    pinNumber: pinNumber,
                    otpPin: otpPin}),
    
                headers:{
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            
            if(data.error){
                errorMessage.textContent = data.error;
                document.getElementById('submitBtn').disabled = false;
            }
            if(data.phoneError){
                phoneMessage.textContent = data.phoneError;
                document.getElementById('submitBtn').disabled = false;
            }
            if(data.otpError){
                otpMessage.textContent = data.otpError;
                document.getElementById('submitBtn').disabled = false;
            }
            if(data.result){
                errorMessage.textContent = data.result;
            }
            
        }
        catch (err){
            console.log(err);
        }
    } 
});

//-----------------------------------------------------------------
// End of Register.js
//-----------------------------------------------------------------
