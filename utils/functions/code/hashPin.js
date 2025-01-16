//---------------------------------------------------------------------------------------------
// Start of hashPin.js -- Responsible for encrypting the user given pin
//---------------------------------------------------------------------------------------------
//using all necessary npm packages
const crypto = require('crypto');

//---------------------------------------------------------------------------------------------
// Initializing key global variables for the encryption process
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

//---------------------------------------------------------------------------------------------
// encrypt method
const encrypt = text => {
  
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  }
}

//---------------------------------------------------------------------------------------------
// decrypt method
const decrypt = hash => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString();
}

//---------------------------------------------------------------------------------------------
//exports HashPin methods encrypt and decrypt to be used in other .js files
module.exports = {
    encrypt,
    decrypt
}

//---------------------------------------------------------------------------------------------
// End of hashPin.js
//---------------------------------------------------------------------------------------------
