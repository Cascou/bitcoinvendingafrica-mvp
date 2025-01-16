//-----------------------------------------------------------------
// Start of addWalletBeneficiary.js -- Responsible as script for addWalletBeneficiary page
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
    const address = addForm.beneficiaryAddress.value;
    const currency = addForm.querySelector('select').value;
    var stringNumber = String(myNumber);

    try{
        const res = await fetch('/addWalletBeneficiary', {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber: stringNumber,
                beneficiaryName: name,
                walletAddress: address,
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
// End of addWalletBeneficiary.js
//-----------------------------------------------------------------
