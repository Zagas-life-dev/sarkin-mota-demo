/**
 * Server-side encryption utilities for message encryption/decryption
 * Uses Node.js crypto module (works in API routes)
 */

import crypto from 'crypto'

// Get encryption key from environment variable
function getEncryptionKey(): string {
  const key = process.env.MESSAGE_ENCRYPTION_KEY
  if (!key) {
    throw new Error('MESSAGE_ENCRYPTION_KEY environment variable is required')
  }
  return key
}

// Derive encryption key using PBKDF2
function deriveKey(): Buffer {
  const keyString = getEncryptionKey()
  const salt = Buffer.from('message-encryption-salt-v1', 'utf-8')
  
  return crypto.pbkdf2Sync(keyString, salt, 100000, 32, 'sha256')
}

/**
 * Encrypt a message string
 * Returns base64-encoded encrypted data with IV and auth tag prepended
 * Format: IV (12 bytes) + Auth Tag (16 bytes) + Ciphertext (raw bytes)
 * This matches the client-side format for compatibility
 */
export function encryptMessage(plaintext: string): string {
  if (!plaintext) return plaintext
  
  try {
    const key = deriveKey()
    
    // Generate a random IV (Initialization Vector)
    const iv = crypto.randomBytes(12)
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    
    // Encrypt the message (get raw bytes, not base64)
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ])
    
    // Get authentication tag
    const authTag = cipher.getAuthTag()
    
    // Combine IV (12 bytes), auth tag (16 bytes), and encrypted data (raw bytes)
    const combined = Buffer.concat([
      iv,
      authTag,
      encrypted
    ])
    
    // Return as base64
    return combined.toString('base64')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt message')
  }
}

/**
 * Decrypt a message string
 * Expects base64-encoded encrypted data with IV and auth tag prepended
 */
export function decryptMessage(encryptedData: string): string {
  if (!encryptedData) return encryptedData
  
  // Check if data looks encrypted (must be at least 28 bytes: IV + auth tag)
  if (!isEncrypted(encryptedData)) {
    // Not encrypted, return as-is (legacy unencrypted message)
    return encryptedData
  }
  
  try {
    const key = deriveKey()
    
    // Decode from base64
    let combined: Buffer
    try {
      combined = Buffer.from(encryptedData, 'base64')
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
    const encrypted = combined.slice(28)
    
    // Check if we have encrypted data
    if (encrypted.length === 0) {
      // No encrypted data, return as-is
      return encryptedData
    }
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    
    // Decrypt the message from raw bytes to utf-8 string
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8')

    return decrypted
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
    const decoded = Buffer.from(data, 'base64')
    return decoded.length >= 28
  } catch {
    return false
  }
}

