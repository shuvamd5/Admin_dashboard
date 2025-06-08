// app/register/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { registerCustomer, getStores, clearMessage } from '@/lib/redux/slices/authSlice';
import Link from 'next/link';

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, message, stores } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
    dateOfBirth: '',
    storeId: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Added local success message

  useEffect(() => {
    dispatch(getStores());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setSuccessMessage(message);
      // We don't clear message immediately if it's for this page, let it display.
      // Can add a timeout to clear it if desired, or let the redirect handle it.
      setTimeout(() => {
        dispatch(clearMessage());
        router.push('/login'); // Redirect after success message for clarity
      }, 3000);
    }
  }, [message, dispatch, router]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous success messages
    if (!formData.storeId) {
      alert('Please select a store.'); // Consider a more integrated error display
      return;
    }
    try {
      await dispatch(registerCustomer({
        ...formData,
        isActive: true, // Assuming default for new customer
        storeId: formData.storeId,
      })).unwrap();
      // Success message will be set by useEffect
    } catch (err) {
      setSuccessMessage(null); // Ensure success message is cleared on error
      console.error(err);
      // Error handled by Redux state
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen"> {/* Centering wrapper */}
      <div className="card"> {/* Applying global card style */}
        <h1 className="landing-title mb-8">Register Customer Account</h1> {/* Reusing title style */}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {loading && (
          <div className="text-center">
            <div className="spinner"></div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="storeId" className="label">Select Store</label>
            <select
              id="storeId"
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className="input"
              required
              disabled={loading || stores.length === 0}
              aria-label="Select a store"
            >
              <option value="" disabled>Select a store</option>
              {stores.map((store) => (
                <option key={store.storeId} value={store.storeId}>{store.storeName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="firstName" className="label">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="label">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber" className="label">Mobile Number</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth" className="label">Date of Birth</label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-6"
            disabled={loading}
            aria-label={loading ? 'Registering...' : 'Register'}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="form-links mt-4">
          Already have an account?{' '}
          <Link href="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;