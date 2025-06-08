'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createProductThunk, updateProductThunk, deleteProductThunk } from '@/lib/redux/slices/productSlice';
import { setSelectedProductId } from '@/lib/redux/slices/selectionSlice';
import { Product, ProductPayload, DeletePayload } from '@/lib/types/product';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
import { Plus } from 'lucide-react';
import styles from './section.module.css';

const ProductsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
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

  const filteredProducts = selectedCategoryId
    ? products.filter(
        (p) =>
          p.category === selectedCategoryId &&
          p.product.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

  const handleSelect = (id: string) => {
    dispatch(setSelectedProductId(id));
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Products</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          aria-label="Add product"
          disabled={!selectedCategoryId}
          title={selectedCategoryId ? 'Add new product' : 'Select a category first'}
        >
          <Plus size={20} />
        </Button>
      </div>
      {selectedCategoryId ? (
        <>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search products..."
          />
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
        </>
      ) : (
        <p className={styles.emptyMessage}>Please select a category to view or add products.</p>
      )}
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

export default ProductsSection;