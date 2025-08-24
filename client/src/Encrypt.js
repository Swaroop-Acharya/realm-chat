import CryptoJS from 'crypto-js';

// Secret key (keep this safe!)
let SECRET_KEY = 'my_super_secret_key_123!';

// Function to set a new secret key
export const setSecretKey = (newKey) => {
  if (!newKey || newKey.length < 1) {
    throw new Error('Secret key cannot be empty');
  }
  SECRET_KEY = newKey;
};

// Encrypt function
export const encryptText = (text) => {
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  return ciphertext;
};

// Decrypt function
export const decryptText = (ciphertext) => {
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
