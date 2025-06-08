// src/app/dashboard/discounts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchProductDiscountsThunk, createProductDiscountThunk, updateProductDiscountThunk, deleteProductDiscountThunk } from '@/lib/redux/slices/discountSlice';
import { ProductDiscount, ProductDiscountPayload } from '@/lib/types/discount';
import { DiscountType } from '@/lib/types/common';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ProductDiscountsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { productDiscounts, loading, error } = useSelector((state: RootState) => state.discount);
  const [formData, setFormData] = useState<ProductDiscountPayload>({
    productId: '',
    discountType: DiscountType.Percentage,
    value: 0,
    startDate: '',
    endDate: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchProductDiscountsThunk());
    }
  }, [dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateProductDiscountThunk({ id: editingId, payload: [formData] })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createProductDiscountThunk([formData])).unwrap();
      }
      setFormData({ productId: '', discountType: DiscountType.Percentage, value: 0, startDate: '', endDate: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const payload = { voidRemarks: 'Mistake' };
      await dispatch(deleteProductDiscountThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (discount: ProductDiscount) => {
    setFormData({
      productId: discount.productId,
      discountType: discount.discountType,
      value: discount.value,
      startDate: discount.startDate,
      endDate: discount.endDate,
    });
    setEditingId(discount.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Discounts</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product ID"
          name="productId"
          value={formData.productId}
          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium mb-1">Discount Type</label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
            className="w-full px-3 py-2 border rounded focus:border-border-focus focus:outline-none"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
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
        <Button type="submit" className="md:col-span-2">{editingId ? 'Update' : 'Create'} Discount</Button>
      </form>
      <Table headers={['Product', 'Discount Type', 'Value', 'Start Date', 'End Date', 'Actions']}>
        {productDiscounts.map((discount) => (
          <tr key={discount.id} className="border-b border-border">
            <td className="px-4 py-2">{discount.product || 'N/A'}</td>
            <td className="px-4 py-2">{discount.discountType}</td>
            <td className="px-4 py-2">{discount.value}</td>
            <td className="px-4 py-2">{discount.startDate}</td>
            <td className="px-4 py-2">{discount.endDate}</td>
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

export default ProductDiscountsPage;