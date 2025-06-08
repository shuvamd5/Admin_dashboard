// components/auth/AuthForm.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { login, register, forgotPassword, resetPassword, clearMessage, bypassLogin } from '@/lib/redux/slices/authSlice';
import { RegisterPayload } from '@/lib/types/auth';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react'; // Assuming Lucide-React is installed

interface AuthFormProps {
  type: 'login' | 'register' | 'forgot-password' | 'reset-password';
}

export default function AuthForm({ type }: AuthFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, message } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<Partial<RegisterPayload>>({
    isStaff: true, // Default for staff registration
    isCustomer: false,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (message) {
      setSuccessMessage(message);
      dispatch(clearMessage());
      // Redirect logic based on form type and success
      if (type === 'forgot-password' || type === 'reset-password' || type === 'register') {
        setTimeout(() => router.push('/login'), 3000);
      }
    }
  }, [message, dispatch, router, type]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous success messages on new submission attempt
    try {
      if (type === 'login') {
        await dispatch(login({ username: formData.userName || '', password: formData.password || '' })).unwrap();
        router.push('/dashboard');
      } else if (type === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await dispatch(register(formData as RegisterPayload)).unwrap();
      } else if (type === 'forgot-password') {
        await dispatch(forgotPassword({ email: formData.email || '' })).unwrap();
      } else if (type === 'reset-password') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const token = searchParams.get('token') || '';
        await dispatch(resetPassword({
          password: formData.password || '',
          confirmPassword: formData.confirmPassword || '',
          token,
        })).unwrap();
      }
    } catch (err: unknown) { // Catch block for unwrap() rejections
      setSuccessMessage(null); // Ensure success message is cleared on error
      console.error(err)
      // The error is already in Redux state, no need to set local state `error` here.
      // console.error("Form submission error:", err); // Keep for debugging if necessary
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleBypassLogin = () => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Bypass login is only available in development mode.');
      return;
    }
    // Set mock credentials for bypass
    setFormData((prev) => ({
      ...prev,
      userName: 'devadmin',
      password: 'DevPass123!',
    }));
    dispatch(bypassLogin()); // Dispatch bypass action
    router.push('/dashboard'); // Redirect to dashboard
  };

  // Define fields based on type
  const formFields = {
    login: [
      { name: 'userName', label: 'Username', type: 'text' },
      { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password', isPassword: true },
    ],
    register: [
      { name: 'storeName', label: 'Store Name', type: 'text' },
      { name: 'domainName', label: 'Domain Name', type: 'text' },
      { name: 'email', label: 'Email Address', type: 'email' },
      { name: 'userName', label: 'Username', type: 'text' },
      { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password', isPassword: true },
      { name: 'confirmPassword', label: 'Confirm Password', type: showConfirmPassword ? 'text' : 'password', isPassword: true },
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { name: 'isStaff', label: 'Staff Account', type: 'checkbox' }, // Changed label for clarity
      { name: 'isCustomer', label: 'Customer Account', type: 'checkbox' },
    ],
    'forgot-password': [{ name: 'email', label: 'Email Address', type: 'email', isPassword: false  }], // isPassword not needed for email
    'reset-password': [
      { name: 'password', label: 'New Password', type: showPassword ? 'text' : 'password', isPassword: true },
      { name: 'confirmPassword', label: 'Confirm Password', type: showConfirmPassword ? 'text' : 'password', isPassword: true },
    ],
  };

  const currentFields = formFields[type];

  return (
    <div className="card"> {/* Applying global card style */}
      <form onSubmit={handleSubmit}>
        <h1 className="landing-title mb-8"> {/* Reusing landing title style, add mb-8 for spacing */}
          {type === 'login' ? 'Welcome Back' : type === 'register' ? 'Create Store Account' : type === 'forgot-password' ? 'Forgot Your Password?' : 'Set New Password'}
        </h1>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {loading && (
          <div className="text-center"> {/* Keeping text-center if it's a Tailwind class for alignment */}
            <div className="spinner"></div>
          </div>
        )}

        {currentFields.map((field) => (
          <div key={field.name} className={field.type === 'checkbox' ? 'checkbox-field' : 'form-group'}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <div className={field.isPassword ? 'password-input-container' : ''}>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={field.type !== 'checkbox' ? String(formData[field.name as keyof RegisterPayload] || '') : undefined}
                checked={field.type === 'checkbox' ? Boolean(formData[field.name as keyof RegisterPayload] ?? (field.name === 'isStaff' ? true : false)) : undefined}
                onChange={handleChange}
                className={field.type === 'checkbox' ? 'checkbox' : 'input'}
                required={field.type !== 'checkbox'}
                disabled={loading}
                aria-label={field.label}
              />
              {field.isPassword && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name as 'password' | 'confirmPassword')}
                  className="toggle-password-visibility"
                  aria-label={field.name === 'password' ? (showPassword ? 'Hide password' : 'Show password') : (showConfirmPassword ? 'Hide confirm password' : 'Show confirm password')}
                >
                  {field.name === 'password' ? (showPassword ? <EyeOff size={20} /> : <Eye size={20} />) : (showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />)}
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="btn btn-primary mt-6" // Added mt-6 for spacing above the button
          disabled={loading}
          aria-label={loading ? 'Submitting...' : 'Submit'}
        >
          {loading ? 'Submitting...' : type === 'login' ? 'Login' : type === 'register' ? 'Register Store' : 'Submit'}
        </button>

        {type === 'login' && process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={handleBypassLogin}
            className="btn btn-secondary mt-4" // Added mt-4 for spacing
            aria-label="Bypass Login for Development"
          >
            <LogIn size={20} className="bypass-button-icon" />
            Bypass Login
          </button>
        )}

        {(type === 'login' || type === 'register') && (
          <div className="form-links">
            {type === 'login' && (
              <>
                <Link href="/forgot-password">Forgot Password?</Link>
                <Link href="/store/register">Register a Store Account</Link> {/* Assumed route for store registration */}
              </>
            )}
            {type === 'register' && (
              <>
                Already have an account? <Link href="/login">Login here</Link>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
}