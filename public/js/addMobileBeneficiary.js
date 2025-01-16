//-----------------------------------------------------------------
// Start of addMobileBeneficiary.js -- Responsible as script for addMobileBeneficiary page
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const addForm = document.querySelector('form');
const errorMessage = document.querySelector('.edit.error');

//-----------------------------------------------------------------
// Button Functionality for Update Button.
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();//prevents from page refreshing when button is clicked to allow for functions to run
    document.querySelector('button').disabled = true;
    //reset error
    errorMessage.textContent = '';

    // get the values from text fields
    const name = addForm.beneficiaryName.value;
    const mobile = addForm.beneficiaryMobile.value;
    const currency = addForm.querySelector('select').value;
    var stringNumber = String(myNumber);

    try{
        const res = await fetch('/addMobileBeneficiary', {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber: stringNumber,
                beneficiaryName: name,
                mobileAddress: mobile,
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
        if(data.result){
            errorMessage.textContent = data.result;
        }
        document.querySelector('button').disabled = false;
    }catch (err){
        console.log(err);
    }
});

//-----------------------------------------------------------------
// End of addMobileBeneficiary.js
//-----------------------------------------------------------------
