// Derive a 256-bit AES key from a password
async function deriveKey(password, salt = "mysalt") {
  const enc = new TextEncoder();

  // Import raw password
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // Derive AES-256-GCM key
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false, // not extractable
    ["encrypt", "decrypt"]
  );
}

// Encrypt a message
export async function encrypt(message, password) {
  const key = await deriveKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM IV

  const enc = new TextEncoder();
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(message)
  );

  // Convert to hex for easy display
  const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, "0")).join("");
  const encryptedHex = Array.from(new Uint8Array(encryptedBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return { iv: ivHex, encrypted: encryptedHex };
}

// Decrypt a message
export async function decrypt(encryptedHex, ivHex, password) {
  const key = await deriveKey(password);

  const encryptedBytes = new Uint8Array(encryptedHex.match(/.{2}/g).map(h => parseInt(h, 16)));
  const iv = new Uint8Array(ivHex.match(/.{2}/g).map(h => parseInt(h, 16)));

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedBytes
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}