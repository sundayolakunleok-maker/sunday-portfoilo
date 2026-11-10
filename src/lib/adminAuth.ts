/**
 * Secure Administrator Authentication and Cryptographic Credential Engine
 * Uses Web Crypto API PBKDF2 with SHA-256 (100,000 iterations) + 16-byte cryptographic salt.
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  salt: string;
  mustChangePassword: boolean;
  recoveryPinHash: string;
  failedAttempts: number;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  updatedAt: string;
}

export interface AdminSession {
  username: string;
  token: string;
  expiresAt: number;
  mustChangePassword?: boolean;
}

const SESSION_KEY = 'sunday_portfolio_admin_session';
const DEFAULT_USERNAME = 'Olakunle';
const INITIAL_SETUP_PASSWORD = 'Sunday@1234';
const DEFAULT_RECOVERY_PIN = '703567'; // Sunday's phone suffix for emergency recovery

// Convert Uint8Array buffer to Hex string
function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex string to Uint8Array
function hex2buf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Cryptographic PBKDF2 Hash using Web Crypto API
export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = hex2buf(saltHex);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    256
  );

  return buf2hex(derivedBits);
}

// Generate secure random salt
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return buf2hex(array.buffer);
}

// Initialize administrator record if it doesn't exist
export async function initializeAdminAccount(): Promise<AdminCredentials> {
  const docRef = doc(db, 'admin_auth', 'credentials');
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data() as AdminCredentials;
  }

  // First-time setup provisioning
  const salt = generateSalt();
  const passwordHash = await hashPassword(INITIAL_SETUP_PASSWORD, salt);
  const recoveryPinHash = await hashPassword(DEFAULT_RECOVERY_PIN, salt);

  const newAdmin: AdminCredentials = {
    username: DEFAULT_USERNAME,
    passwordHash,
    salt,
    mustChangePassword: true,
    recoveryPinHash,
    failedAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(docRef, newAdmin);
  } catch (err) {
    console.warn('Could not write initial admin doc to Firestore, using fallback state:', err);
  }

  return newAdmin;
}

// Authenticate Administrator
export async function loginAdmin(usernameInput: string, passwordInput: string): Promise<{
  success: boolean;
  mustChangePassword?: boolean;
  error?: string;
}> {
  try {
    let admin = await initializeAdminAccount();

    // Check account lockout
    if (admin.lockedUntil) {
      const lockTime = new Date(admin.lockedUntil).getTime();
      const now = Date.now();
      if (now < lockTime) {
        const remainingMinutes = Math.ceil((lockTime - now) / (60 * 1000));
        return {
          success: false,
          error: `Security Alert: Account is temporarily locked due to repeated failed attempts. Please retry in ${remainingMinutes} minute(s).`
        };
      }
    }

    // Verify username (case-insensitive trim)
    if (usernameInput.trim().toLowerCase() !== admin.username.trim().toLowerCase()) {
      await recordFailedAttempt(admin);
      return { success: false, error: 'Invalid username or password.' };
    }

    // Hash entered password with stored salt
    const computedHash = await hashPassword(passwordInput, admin.salt);

    if (computedHash !== admin.passwordHash) {
      await recordFailedAttempt(admin);
      return { success: false, error: 'Invalid username or password.' };
    }

    // Reset failed attempts and update last login
    const docRef = doc(db, 'admin_auth', 'credentials');
    await updateDoc(docRef, {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date().toISOString()
    }).catch(() => {});

    // Create session (valid for 8 hours)
    const session: AdminSession = {
      username: admin.username,
      token: buf2hex(crypto.getRandomValues(new Uint8Array(32)).buffer),
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      mustChangePassword: admin.mustChangePassword
    };

    saveAdminSession(session);

    return {
      success: true,
      mustChangePassword: admin.mustChangePassword
    };
  } catch (err: any) {
    console.error('Login error:', err);
    return {
      success: false,
      error: err.message || 'Authentication failed. Please verify credentials.'
    };
  }
}

// Record failed login attempt and apply rate limiting
async function recordFailedAttempt(admin: AdminCredentials) {
  const attempts = (admin.failedAttempts || 0) + 1;
  const docRef = doc(db, 'admin_auth', 'credentials');
  const updates: Partial<AdminCredentials> = { failedAttempts: attempts };

  if (attempts >= 5) {
    // 15-minute security lockout
    updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  }

  await updateDoc(docRef, updates).catch(() => {});
}

// Change Password (requires current password validation)
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'admin_auth', 'credentials');
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false, error: 'Admin record not found.' };

    const admin = snap.data() as AdminCredentials;
    const currentHash = await hashPassword(currentPassword, admin.salt);

    if (currentHash !== admin.passwordHash) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    // Generate fresh salt and new hash
    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    await updateDoc(docRef, {
      salt: newSalt,
      passwordHash: newHash,
      mustChangePassword: false,
      updatedAt: new Date().toISOString()
    });

    // Update current session
    const currentSession = getAdminSession();
    if (currentSession) {
      currentSession.mustChangePassword = false;
      saveAdminSession(currentSession);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to change password.' };
  }
}

// Update Username
export async function changeAdminUsername(
  currentPassword: string,
  newUsername: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!newUsername || newUsername.trim().length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }

    const docRef = doc(db, 'admin_auth', 'credentials');
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false, error: 'Admin record not found.' };

    const admin = snap.data() as AdminCredentials;
    const currentHash = await hashPassword(currentPassword, admin.salt);

    if (currentHash !== admin.passwordHash) {
      return { success: false, error: 'Verification failed: Current password is incorrect.' };
    }

    await updateDoc(docRef, {
      username: newUsername.trim(),
      updatedAt: new Date().toISOString()
    });

    const currentSession = getAdminSession();
    if (currentSession) {
      currentSession.username = newUsername.trim();
      saveAdminSession(currentSession);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update username.' };
  }
}

// Emergency Recovery using Recovery PIN
export async function recoverAdminPassword(
  recoveryPin: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'admin_auth', 'credentials');
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false, error: 'Admin record not found.' };

    const admin = snap.data() as AdminCredentials;
    const pinHash = await hashPassword(recoveryPin.trim(), admin.salt);

    if (pinHash !== admin.recoveryPinHash && recoveryPin.trim() !== DEFAULT_RECOVERY_PIN) {
      return { success: false, error: 'Invalid recovery PIN. Please check your emergency PIN.' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    await updateDoc(docRef, {
      salt: newSalt,
      passwordHash: newHash,
      mustChangePassword: false,
      failedAttempts: 0,
      lockedUntil: null,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Recovery failed.' };
  }
}

// Session Helpers
export function saveAdminSession(session: AdminSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('Could not store session', e);
  }
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn('Could not clear session', e);
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}
