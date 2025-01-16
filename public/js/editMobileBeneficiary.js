//-----------------------------------------------------------------
// Start of editMobileBeneficiary.js -- Responsible as script for editMobileBeneficiary page
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Initializing all npm packages necessary
const editForm = document.querySelector('form');
const errorMessage = document.querySelector('.edit.error');

//-----------------------------------------------------------------
// GetBeneficiary Method to get specific beneficiary into form.
function GetBeneficiary(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const variableValue = urlParams.get('ID');
    console.log(decodeURIComponent(variableValue));
   
    fetch('/getMobileBeneficiary/'+ variableValue)
        .then((response) => response.json())
        .then((data) => {
            // Store the balances in local storage
            editForm.beneficiaryName.value = data.beneficiaryName;
            let tempNumber = data.beneficiaryMobile.slice(2);
            let updateNumber = tempNumber.padStart(tempNumber.length + 1, "0");
            editForm.beneficiaryMobile.value = updateNumber;
            editForm.querySelector('select').value = data.currency;
        })
        .catch((error) => console.log(error));    
}

//-----------------------------------------------------------------
// Button Functionality for Update Button.
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();//prevents from page refreshing when button is clicked to allow for functions to run
    document.querySelector('button').disabled = true;
    //reset error
    errorMessage.textContent = '';

    // get the values from text fields
    const name = editForm.beneficiaryName.value;
    const mobile = editForm.beneficiaryMobile.value;
    const currency = editForm.querySelector('select').value;
    var stringNumber = String(myNumber);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const variableValue = urlParams.get('ID');

    try{
        const res = await fetch('/editMobileBeneficiary', {
            method: 'POST',
            body: JSON.stringify({
                beneficiaryID: variableValue,
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
// End of editMobileBeneficiary.js
//-----------------------------------------------------------------
