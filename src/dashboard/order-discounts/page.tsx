'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchOrderDiscountsThunk, createOrderDiscountThunk, updateOrderDiscountThunk, deleteOrderDiscountThunk } from '@/lib/redux/slices/discountSlice';
import { OrderDiscountPayload, DiscountDeletePayload, OrderDiscount } from '@/lib/types/discount';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { DiscountType } from '@/lib/types/common';

const OrderDiscountsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { orderDiscounts, loading, error } = useSelector((state: RootState) => state.discount);
  const [formData, setFormData] = useState<OrderDiscountPayload>({
    code: '',
    discountType: DiscountType.Flat,
    value: 0,
    minOrderTotal: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: 0,
    timesUsed: 0,
    storeId: '010dd7072dac47a0a642025fd913d99',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchOrderDiscountsThunk());
    }
  }, [dispatch, router]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateOrderDiscountThunk({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createOrderDiscountThunk(formData)).unwrap();
      }
      setFormData({
        code: '',
        discountType: DiscountType.Flat,
        value: 0,
        minOrderTotal: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        usageLimit: 0,
        timesUsed: 0,
        storeId: '010dd7072dac47a0a642025fd913d99',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const payload: DiscountDeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteOrderDiscountThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (discount: OrderDiscount) => {
    setFormData({
      code: discount.code,
      discountType: discount.discountType,
      value: discount.value,
      minOrderTotal: discount.minOrderTotal,
      startDate: discount.startDate,
      endDate: discount.endDate,
      isActive: discount.isActive,
      usageLimit: discount.usageLimit,
      timesUsed: discount.timesUsed || 0,
      storeId: discount.storeId,
    });
    setEditingId(discount.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Discounts</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-text mb-1">Discount Type</label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType.Flat | DiscountType.Percentage })}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <Input
          label="Value"
          name="value"
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
          required
        />
        <Input
          label="Min Order Total"
          name="minOrderTotal"
          type="number"
          value={formData.minOrderTotal}
          onChange={(e) => setFormData({ ...formData, minOrderTotal: parseFloat(e.target.value) })}
          required
        />
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
        />
        <Input
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          required
        />
        <Input
          label="Usage Limit"
          name="usageLimit"
          type="number"
          value={formData.usageLimit}
          onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
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
        <Button type="submit" className="md:col-span-2">{editingId ? 'Update' : 'Create'} Order Discount</Button>
      </form>
      <Table headers={['Code', 'Discount Type', 'Value', 'Min Order', 'Start Date', 'End Date', 'Usage Limit', 'Times Used', 'Actions']}>
        {orderDiscounts.map((discount) => (
          <tr key={discount.id} className="border-b border-border">
            <td className="px-4 py-2">{discount.code}</td>
            <td className="px-4 py-2">{discount.discountType}</td>
            <td className="px-4 py-2">{discount.value}{discount.discountType === 'percentage' ? '%' : '$'}</td>
            <td className="px-4 py-2">${discount.minOrderTotal}</td>
            <td className="px-4 py-2">{discount.startDate}</td>
            <td className="px-4 py-2">{discount.endDate}</td>
            <td className="px-4 py-2">{discount.usageLimit}</td>
            <td className="px-4 py-2">{discount.timesUsed || 0}</td>
            <td className="px-4 py-2">
              <Button variant="secondary" onClick={() => handleEdit(discount)} className="mr-2">
                Edit
              </Button>
              <Button variant="error" onClick={() => handleDelete(discount.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default OrderDiscountsPage;