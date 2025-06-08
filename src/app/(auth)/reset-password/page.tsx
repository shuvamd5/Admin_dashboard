// app/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; // For password visibility toggle

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      // Mock API call - in a real app, you'd dispatch an action here
      console.log('Resetting password with:', formData.password);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setSuccessMessage('Your password has been reset successfully!');
      setTimeout(() => router.push('/login'), 2000); // Redirect after a short delay
    } catch (err) {
      setError((err as Error).message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card"> {/* Applying global card style */}
        <h1 className="landing-title mb-8">Set New Password</h1> {/* Reusing title style */}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="label">New Password</label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="toggle-password-visibility"
                aria-label={showPassword ? 'Hide new password' : 'Show new password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="toggle-password-visibility"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary mt-6">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="form-links mt-4">
          Back to{' '}
          <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;