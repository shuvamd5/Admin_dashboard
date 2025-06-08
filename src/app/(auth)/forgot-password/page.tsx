// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // To show success

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Mock API call - in a real app, you'd dispatch an action here
      console.log('Sending password reset link to:', email);
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setSuccessMessage('Password reset link sent to your email. Please check your inbox.');
      router.push('/reset-password'); // Only redirect if this page actually performs the reset.
                                      // If it just sends an email, don't redirect immediately.
    } catch (err) {
      setError((err as Error).message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card"> {/* Applying global card style */}
        <h1 className="landing-title mb-8">Forgot Password</h1> {/* Reusing title style */}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group"> {/* Using global form-group */}
            <label htmlFor="email" className="label">Email Address</label> {/* Using global label */}
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary mt-6"> {/* Using global button styles */}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="form-links mt-4"> {/* Using global form-links style */}
          Remember your password?{' '}
          <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;