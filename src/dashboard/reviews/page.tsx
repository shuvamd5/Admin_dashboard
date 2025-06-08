'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { fetchProductReviewsThunk, createProductReviewThunk, updateProductReviewThunk, deleteProductReviewThunk } from '@/lib/redux/slices/reviewSlice';
import { ProductReview, ProductReviewPayload, ProductReviewDeletePayload } from '@/lib/types/review';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ProductReviewsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { reviews, loading, error } = useSelector((state: RootState) => state.review);
  const [formData, setFormData] = useState<ProductReviewPayload>({
    productId: '',
    customerId: '',
    rating: 0,
    review: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else if (productId) {
      dispatch(fetchProductReviewsThunk(productId));
    }
  }, [dispatch, router, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateProductReviewThunk({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createProductReviewThunk(formData)).unwrap();
      }
      setFormData({ productId: '', customerId: '', rating: 0, review: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (review: ProductReview) => {
    setFormData({
      productId: review.productId,
      customerId: review.customerId,
      rating: review.rating,
      review: review.review,
    });
    setEditingId(review.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const payload: ProductReviewDeletePayload = { voidRemarks: id };
      await dispatch(deleteProductReviewThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 ml-64 mt-16">
      <h1 className="text-2xl font-bold mb-4">Manage Product Reviews</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <div className="mb-6">
        <Input
          label="Product ID"
          name="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Enter Product ID to fetch reviews"
        />
      </div>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col col-span-2">
          <Input
            label="Product ID"
            name="productId"
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            required
            placeholder="Enter product ID"
          />
        </div>
        <div className="flex flex-col col-span-2">
          <Input
            label="Customer ID"
            name="customerId"
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            required
            placeholder="Enter customer ID"
          />
        </div>
        <div className="flex flex-col">
          <Input
            label="Rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            required
            placeholder="Enter rating (0-5)"
          />
        </div>
        <div className="flex flex-col col-span-3">
          <Input
            label="Review"
            name="review"
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            required
            placeholder="Enter review comment"
          />
        </div>
        <Button type="submit" className="md:col-span-4">
          {editingId ? 'Update' : 'Create'} Review
        </Button>
      </form>
      <Table headers={['Customer', 'Rating', 'Review', 'Created At', 'Updated At', 'Actions']}>
        {reviews.map((review) => (
          <tr key={review.id} className="border-b border-border">
            <td className="px-4 py-2">{`${review.firstName || ''} ${review.lastName || ''}`.trim() || 'Unknown'}</td>
            <td className="px-4 py-2">{review.rating.toFixed(1)}</td>
            <td className="px-4 py-2">{review.review}</td>
            <td className="px-4 py-2">{new Date(review.createdAt).toLocaleDateString()}</td>
            <td className="px-4 py-2">{new Date(review.updatedAt).toLocaleDateString()}</td>
            <td className="px-4 py-2">
              <Button variant="secondary" onClick={() => handleEdit(review)} className="mr-2">
                Edit
              </Button>
              <Button variant="error" onClick={() => handleDelete(review.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default ProductReviewsPage;