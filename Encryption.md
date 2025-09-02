# AES-GCM Encryption with PBKDF2 Key Derivation

This project demonstrates how to securely encrypt and decrypt data in the browser using the **Web Crypto API**.  
It uses **PBKDF2** to derive an AES key from a password and **AES-GCM** with a random IV for secure encryption.

---

## 🔑 How it Works

1. **Password → Key**  
   - A user-provided password is converted into an AES-256-GCM key using PBKDF2.  
   - Salt ensures that the same password used across different applications generates different keys.  
   - PBKDF2 parameters:  
     - Salt: `"mysalt"` (can be randomized for stronger security).  
     - Iterations: `100,000`.  
     - Hash: `SHA-256`.  

   > ⚠️ Key derivation is **deterministic**: same password + same salt → same AES key.

2. **Encryption**  
   - A new **random IV (Initialization Vector)** is generated for every encryption.  
   - AES-GCM uses the derived key + random IV to encrypt the plaintext.  
   - Output is `ciphertext + IV`.

3. **Decryption**  
   - The password and salt derive the same AES key again.  
   - The stored IV is passed along with the ciphertext.  
   - AES-GCM decrypts and returns the original plaintext.
