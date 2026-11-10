import { useState, type FormEvent } from 'react';
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { loginAdmin, changeAdminPassword, recoverAdminPassword, saveAdminSession } from '../lib/adminAuth';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface LoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function Login({ onLoginSuccess, onBackToHome }: LoginProps) {
  const [username, setUsername] = useState('Olakunle');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // First-time setup / forced password change state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState<string | null>(null);

  // Recovery modal state
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryPin, setRecoveryPin] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      saveAdminSession({
        username: user.displayName || user.email || 'Sunday Okegbemi',
        token: user.uid,
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
        mustChangePassword: false
      });

      onLoginSuccess();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Google authentication failed.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await loginAdmin(username, password);
      setIsLoading(false);

      if (!res.success) {
        setError(res.error || 'Invalid credentials.');
        return;
      }

      if (res.mustChangePassword) {
        setCurrentPasswordForChange(password);
        setShowPasswordChangeModal(true);
        return;
      }

      onLoginSuccess();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  const handleForcedPasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setChangeError(null);

    if (newPassword.length < 8) {
      setChangeError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('New passwords do not match.');
      return;
    }
    if (newPassword === 'Sunday@1234') {
      setChangeError('You must choose a new password different from the initial default.');
      return;
    }

    setIsLoading(true);
    const res = await changeAdminPassword(currentPasswordForChange, newPassword);
    setIsLoading(false);

    if (!res.success) {
      setChangeError(res.error || 'Failed to update password.');
      return;
    }

    setShowPasswordChangeModal(false);
    onLoginSuccess();
  };

  const handleRecoverySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);

    if (!recoveryPin) {
      setRecoveryError('Please enter your emergency recovery PIN.');
      return;
    }
    if (recoveryNewPassword.length < 8) {
      setRecoveryError('New password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    const res = await recoverAdminPassword(recoveryPin, recoveryNewPassword);
    setIsLoading(false);

    if (!res.success) {
      setRecoveryError(res.error || 'Emergency recovery failed.');
      return;
    }

    setShowRecoveryModal(false);
    setPassword(recoveryNewPassword);
    setSuccessMsg('Password recovered successfully! You can now log in with your new password.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio Home
        </button>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Central Admin Portal
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Secure Control Centre for Portfolio & MIT 624 Learning Platform
            </p>
          </div>

          {/* Initial Setup Notification Badge */}
          <div className="mt-6 rounded-2xl bg-blue-50/80 p-4 border border-blue-200/60 dark:bg-blue-950/40 dark:border-blue-800/60">
            <div className="flex items-start gap-3">
              <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                <span className="font-bold block text-blue-900 dark:text-blue-100">Administrator Initial Access:</span>
                Default username: <code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">Olakunle</code><br />
                Initial setup password: <code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">Sunday@1234</code><br />
                <span className="text-[11px] opacity-80 mt-1 block">You will be prompted to create your private password on first login.</span>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/60">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Administrator Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Olakunle"
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:bg-slate-900"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold cursor-pointer"
                >
                  Forgot / Recover?
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In to Admin Control Centre
                </>
              )}
            </button>

            {/* Firebase Auth Google Divider & Button */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-2 text-slate-500 dark:bg-slate-900">
                  Or Firebase Authentication
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google (Firebase Auth)</span>
            </button>
          </form>

          {/* Security Guarantee Notice */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Argon2 / PBKDF2 Encrypted Session Protection
            </p>
            <p className="mt-1 text-[11px] opacity-75">
              Public registration is disabled. Only authorized administrators can access this system.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory First-Time Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Security Requirement</h3>
                <p className="text-xs text-slate-500">First-time password change required</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Welcome, <span className="font-bold text-blue-600">Olakunle</span>! For your security, you must replace the default initial password with your own private, strong password before accessing the admin dashboard.
            </p>

            {changeError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                {changeError}
              </div>
            )}

            <form onSubmit={handleForcedPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  New Private Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Encrypting & Updating...' : 'Set Password & Enter Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Password Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Emergency Account Recovery</h3>
                  <p className="text-xs text-slate-500">Reset your admin password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Enter your emergency recovery PIN (initial setup PIN: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">703567</code>) and choose a new password.
            </p>

            {recoveryError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                {recoveryError}
              </div>
            )}

            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Recovery PIN
                </label>
                <input
                  type="password"
                  required
                  value={recoveryPin}
                  onChange={(e) => setRecoveryPin(e.target.value)}
                  placeholder="Enter 6-digit recovery PIN"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={recoveryNewPassword}
                  onChange={(e) => setRecoveryNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? 'Resetting...' : 'Reset & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
