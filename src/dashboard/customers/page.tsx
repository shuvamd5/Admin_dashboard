'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchCustomersThunk, createCustomerThunk, updateCustomerThunk, deleteCustomerThunk } from '@/lib/redux/slices/customerSlice';
import { Customer, CustomerRegisterPayload } from '@/lib/types/customer';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CustomersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { customers, loading, error } = useSelector((state: RootState) => state.customer);
  const [formData, setFormData] = useState<CustomerRegisterPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
    isActive: true,
    dateOfBirth: '',
    storeId: '010dd7072dac47a0a64a2025fd913d99',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchCustomersThunk());
    }
  }, [dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateCustomerThunk({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createCustomerThunk(formData)).unwrap();
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobileNumber: '',
        isActive: true,
        dateOfBirth: '',
        storeId: '010dd7072dac47a0a64a2025fd913d99',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const payload = { voidRemarks: 'Mistake' };
      await dispatch(deleteCustomerThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      password: '',
      mobileNumber: customer.mobileNumber,
      isActive: customer.isActive || true,
      dateOfBirth: customer.birthDate || '',
      storeId: '010dd7072dac47a0a64a2025fd913d99',
    });
    setEditingId(customer.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editingId}
        />
        <Input
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
          required
        />
        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          required
        />
        <div className="flex items-center">
          <label className="mr-2">Active</label>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
        </div>
        <Button type="submit" className="md:col-span-2">{editingId ? 'Update' : 'Create'} Customer</Button>
      </form>
      <Table headers={['Name', 'Email', 'Mobile', 'Actions']}>
        {customers.map((customer) => (
          <tr key={customer.id} className="border-b border-border">
            <td className="px-4 py-2">{`${customer.firstName} ${customer.lastName}`}</td>
            <td className="px-4 py-2">{customer.email}</td>
            <td className="px-4 py-2">{customer.mobileNumber}</td>
            <td className="px-4 py-2">
              <Button variant="secondary" onClick={() => handleEdit(customer)} className="mr-2">
                Edit
              </Button>
              <Button variant="error" onClick={() => handleDelete(customer.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default CustomersPage;