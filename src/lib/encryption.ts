/**
 * Encryption utilities for message encryption/decryption
 * Uses AES-GCM for authenticated encryption
 */

// Get encryption key from environment variable
function getEncryptionKey(): string {
  const key = process.env.NEXT_PUBLIC_MESSAGE_ENCRYPTION_KEY || process.env.MESSAGE_ENCRYPTION_KEY
  if (!key) {
    throw new Error('MESSAGE_ENCRYPTION_KEY environment variable is required')
  }
  return key
}

// Convert string key to CryptoKey
async function getCryptoKey(): Promise<CryptoKey> {
  const keyString = getEncryptionKey()
  
  // Import the key material
  const keyData = new TextEncoder().encode(keyString)
  
  // Derive a key using PBKDF2
  const baseKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )
  
  // Derive the actual encryption key
  const salt = new TextEncoder().encode('message-encryption-salt-v1')
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  )
  
  return derivedKey
}

/**
 * Encrypt a message string
 * Returns base64-encoded encrypted data with IV and auth tag prepended
 */
export async function encryptMessage(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext
  
  try {
    const key = await getCryptoKey()
    
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    // Encrypt the message
    const encodedText = new TextEncoder().encode(plaintext)
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedText
    )
    
    // In Web Crypto API, the encrypted data includes the auth tag at the end
    // We need to extract it and store separately to match server-side format
    const encryptedArray = new Uint8Array(encryptedData)
    const authTag = encryptedArray.slice(-16) // Last 16 bytes are auth tag
    const ciphertext = encryptedArray.slice(0, -16) // Rest is ciphertext
    
    // Combine IV (12 bytes), auth tag (16 bytes), and ciphertext
    const combined = new Uint8Array(iv.length + authTag.length + ciphertext.length)
    combined.set(iv, 0)
    combined.set(authTag, iv.length)
    combined.set(ciphertext, iv.length + authTag.length)
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt message')
  }
}

/**
 * Decrypt a message string
 * Expects base64-encoded encrypted data with IV and auth tag prepended
 */
export async function decryptMessage(encryptedData: string): Promise<string> {
  if (!encryptedData) return encryptedData
  
  // Check if data looks encrypted (must be at least 28 bytes: IV + auth tag)
  if (!isEncrypted(encryptedData)) {
    // Not encrypted, return as-is (legacy unencrypted message)
    return encryptedData
  }
  
  try {
    const key = await getCryptoKey()
    
    // Decode from base64
    let combined: Uint8Array
    try {
      combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
    } catch (e) {
      // Invalid base64, return as-is
      return encryptedData
    }
    
    // Check minimum length (IV 12 + auth tag 16 = 28 bytes minimum)
    if (combined.length < 28) {
      // Too short to be encrypted, return as-is
      return encryptedData
    }
    
    // Extract IV (first 12 bytes), auth tag (next 16 bytes), and encrypted data
    const iv = combined.slice(0, 12)
    const authTag = combined.slice(12, 28)
    const ciphertext = combined.slice(28)
    
    // Check if we have ciphertext
    if (ciphertext.length === 0) {
      // No ciphertext, return as-is
      return encryptedData
    }
    
    // Combine ciphertext and auth tag for Web Crypto API
    const encrypted = new Uint8Array(ciphertext.length + authTag.length)
    encrypted.set(ciphertext, 0)
    encrypted.set(authTag, ciphertext.length)
    
    // Decrypt the message
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    )
    
    // Convert back to string
    return new TextDecoder().decode(decryptedData)
  } catch (error) {
    console.error('Decryption error:', error)
    // If decryption fails, return the original (might be unencrypted legacy data)
    return encryptedData
  }
}

/**
 * Check if a string is encrypted (base64 format check)
 */
export function isEncrypted(data: string): boolean {
  if (!data) return false
  try {
    // Check if it's valid base64 and has minimum length for IV + auth tag + some data
    const decoded = atob(data)
    return decoded.length >= 28
  } catch {
    return false
  }
}

