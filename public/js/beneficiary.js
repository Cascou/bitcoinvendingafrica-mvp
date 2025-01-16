//-------------------------------------------------------------------------
// DeleteWalletBeneficiary Method to delete specific beneficiary
function DeleteWalletBeneficiary(myBeneficiaryID){

    const variableValue = myBeneficiaryID
    
    fetch('/deleteWalletBeneficiary/' + variableValue, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
    });  
    
    alert('Beneficiary successfully deleted');
    
    window.location.reload('/beneficiary');
}

//-----------------------------------------------------------------
// DeleteMobileBeneficiary Method to delete specific beneficiary
function DeleteMobileBeneficiary(myBeneficiaryID){

  const variableValue = myBeneficiaryID
  
  fetch('/deleteMobileBeneficiary/' + variableValue, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
  });  
  
  alert('Beneficiary successfully deleted');
  
  window.location.reload('/beneficiary');
}

//-------------------------------------------------------------------------
//Hashing for Edit Mobile Links
function securelyHashEditMobileBeneficiaryID() {

  const editLink = event.target;
  const mobileAddress = editLink.getAttribute('data-beneficiary-id');
  
  // Hash the data.beneficiaryID using SHA-256
  const hashedmobileAddress = CryptoJS.SHA256(mobileAddress.toString()).toString();
  
  //Construct the new URL with the hashed beneficiaryID
  const newURL = `/editMobileBeneficiary?ID=${encodeURIComponent(hashedmobileAddress)}`;

  // Update the link's href with the hashed beneficiaryID
  editLink.href = newURL;
}

//-------------------------------------------------------------------------
//Hashing for Send Mobile Links
function securelyHashSendMobileBeneficiaryID() {

  const sendLink = event.target;
  const mobileAddress = sendLink.getAttribute('data-beneficiary-id');
  
  // Hash the data.beneficiaryID using SHA-256
  const hashedmobileAddress = CryptoJS.SHA256(mobileAddress.toString()).toString();
  
  //Construct the new URL with the hashed beneficiaryID
  const newURL = `/sendMobileBeneficiary?ID=${encodeURIComponent(hashedmobileAddress)}`;

  // Update the link's href with the hashed beneficiaryID
  sendLink.href = newURL;
}

//-------------------------------------------------------------------------
//Hashing for Send Mobile Links
function securelyHashSendWalletBeneficiaryID() {

  const sendLink = event.target;
  const walletAddress = sendLink.getAttribute('data-beneficiary-id');
  
  // Hash the data.beneficiaryID using SHA-256
  const hashedwalletAddress = CryptoJS.SHA256(walletAddress.toString()).toString();
  
  //Construct the new URL with the hashed beneficiaryID
  const newURL = `/sendWalletBeneficiary?ID=${encodeURIComponent(hashedwalletAddress)}`;

  // Update the link's href with the hashed beneficiaryID
  sendLink.href = newURL;
}

//-------------------------------------------------------------------------
//Hashing for Edit Wallet Links
function securelyHashEditWalletBeneficiaryID() {

  const editWalletLink = event.target;
  const walletAddress = editWalletLink.getAttribute('data-beneficiary-id');
  
  // Hash the data.beneficiaryID using SHA-256
  const hashedwalletAddress = CryptoJS.SHA256(walletAddress.toString()).toString();
  
  //Construct the new URL with the hashed beneficiaryID
  const newURL = `/editWalletBeneficiary?ID=${encodeURIComponent(hashedwalletAddress)}`;

  // Update the link's href with the hashed beneficiaryID
  editWalletLink.href = newURL;
}

//-------------------------------------------------------------------------
// Dynamic event trigger for edit Wallet Links
document.addEventListener('DOMContentLoaded', function () {
  const editWalletLinks = document.querySelectorAll('.editWalletLink');
  editWalletLinks.forEach(function (editWalletLink){
    editWalletLink.addEventListener('click', securelyHashEditWalletBeneficiaryID);
  });
});

//-------------------------------------------------------------------------
// Dynamic event trigger for edit Mobile Links
document.addEventListener('DOMContentLoaded', function () {
  const editLinks = document.querySelectorAll('.editMobileLink');
  editLinks.forEach(function (editLink) {
    editLink.addEventListener('click', securelyHashEditMobileBeneficiaryID);
  });
});

//-------------------------------------------------------------------------
// Dynamic event trigger for send Mobile Links
document.addEventListener('DOMContentLoaded', function () {
  const sendLinks = document.querySelectorAll('.sendMobileLink');
  sendLinks.forEach(function (sendLink){
    sendLink.addEventListener('click', securelyHashSendMobileBeneficiaryID);
  });
});

//-------------------------------------------------------------------------
// Dynamic event trigger for send Wallet Links
document.addEventListener('DOMContentLoaded', function () {
  const sendWalletLinks = document.querySelectorAll('.sendWalletLink');
  sendWalletLinks.forEach(function (sendWalletLink){
    sendWalletLink.addEventListener('click', securelyHashSendWalletBeneficiaryID);
  });
});


//-------------------------------------------------------------------------
//End of Beneficiary.js
//-------------------------------------------------------------------------