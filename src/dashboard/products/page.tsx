'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { fetchCategories } from '@/lib/redux/slices/categorySlice';
import { fetchProductsThunk, createProductThunk, updateProductThunk, deleteProductThunk } from '@/lib/redux/slices/productSlice';
import { setSelectedCategoryId, setSelectedProductId } from '@/lib/redux/slices/selectionSlice';
import { Product, ProductPayload, DeletePayload } from '@/lib/types/product';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Plus } from 'lucide-react';
import styles from './page.module.css';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products, loading, error } = useSelector((state: RootState) => state.product);
  const { categories } = useSelector((state: RootState) => state.category);
  const { selectedCategoryId, selectedProductId } = useSelector((state: RootState) => state.selection);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductPayload>({
    product: { title: '', bodyHtml: '', price: 0, sku: '', storeId: '010dd7072dac47a0a64a2025fd913d99', isActive: true, stockQuantity: 0 },
    category: { categoryId: selectedCategoryId || '' },
    tags: [],
    productVariants: [],
    productImages: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchCategories());
      dispatch(fetchProductsThunk());
    }
  }, [dispatch, router]);

  const filteredProducts = selectedCategoryId
    ? products.filter(
        (p) =>
          p.category === selectedCategoryId &&
          p.product.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products.filter((p) => p.product.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateProductThunk({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createProductThunk(formData)).unwrap();
      }
      setFormData({
        product: { title: '', bodyHtml: '', price: 0, sku: '', storeId: '010dd7072dac47a0a64a2025fd913d99', isActive: true, stockQuantity: 0 },
        category: { categoryId: selectedCategoryId || '' },
        tags: [],
        productVariants: [],
        productImages: [],
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Product operation failed:', err);
    }
  };

  const handleEdit = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setFormData({
      product: {
        title: product.product,
        bodyHtml: '',
        price: product.price,
        sku: '',
        storeId: '010dd7072dac47a0a64a2025fd913d99',
        isActive: true,
        stockQuantity: product.remaining_stock,
      },
      category: { categoryId: product.category },
      tags: [],
      productVariants: [],
      productImages: [{ url: product.url, altText: product.alt_text, isMain: true }],
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const payload: DeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteProductThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Product deletion failed:', err);
    }
  };

  const handleSelectCategory = (id: string) => {
    dispatch(setSelectedCategoryId(id));
    dispatch(setSelectedProductId(null));
    setSearchTerm(''); // Reset search when category changes
  };

  const handleSelect = (id: string) => {
    dispatch(setSelectedProductId(id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Products</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <div className={styles.filter}>
        <label className={styles.label}>Filter by Category</label>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => handleSelectCategory(e.target.value)}
          className="input"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.actions}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products..."
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          aria-label="Add product"
          disabled={!selectedCategoryId}
          title={selectedCategoryId ? 'Add new product' : 'Select a category first'}
        >
          <Plus size={20} /> Add Product
        </Button>
      </div>
      <Table headers={['Product', 'Price', 'Stock', 'Actions']}>
        {filteredProducts.map((product) => (
          <tr
            key={product.id}
            className={`${styles.tableRow} ${selectedProductId === product.id ? styles.selectedRow : ''}`}
            onClick={() => handleSelect(product.id)}
          >
            <td className={styles.tableCell}>{product.product}</td>
            <td className={styles.tableCell}>${product.price.toFixed(2)}</td>
            <td className={styles.tableCell}>{product.remaining_stock}</td>
            <td className={styles.tableCell}>
              <Button
                variant="secondary"
                onClick={(e) => handleEdit(e, product)}
                className={styles.actionButton}
              >
                Edit
              </Button>
              <Button
                variant="error"
                onClick={(e) => handleDelete(e, product.id)}
                className={styles.actionButton}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <Input
            label="Title"
            name="title"
            value={formData.product.title}
            onChange={(e) => setFormData({ ...formData, product: { ...formData.product, title: e.target.value } })}
            required
            className="input"
          />
          <Input
            label="Price"
            name="price"
            type="number"
            value={formData.product.price}
            onChange={(e) => setFormData({ ...formData, product: { ...formData.product, price: parseFloat(e.target.value) } })}
            required
            className="input"
          />
          <Input
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.product.stockQuantity}
            onChange={(e) => setFormData({ ...formData, product: { ...formData.product, stockQuantity: parseInt(e.target.value) } })}
            required
            className="input"
          />
          <Input
            label="Image URL"
            name="imageUrl"
            value={formData.productImages[0]?.url || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                productImages: [{ url: e.target.value, altText: formData.productImages[0]?.altText || '', isMain: true }],
              })
            }
            className="input"
          />
          <Input
            label="Image Alt Text"
            name="imageAltText"
            value={formData.productImages[0]?.altText || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                productImages: [{ url: formData.productImages[0]?.url || '', altText: e.target.value, isMain: true }],
              })
            }
            className="input"
          />
          <label className={styles.label}>Category</label>
          <select
            value={formData.category.categoryId}
            onChange={(e) => setFormData({ ...formData, category: { categoryId: e.target.value } })}
            className="input"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </select>
          <Button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;