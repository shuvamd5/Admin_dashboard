'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { fetchTagsThunk, createTagThunk, updateTagThunk, deleteTagThunk } from '@/lib/redux/slices/tagSlice';
import { setSelectedProductId } from '@/lib/redux/slices/selectionSlice';
import { fetchProductsThunk } from '@/lib/redux/slices/productSlice';
import { Tag, TagPayload, TagDeletePayload } from '@/lib/types/tag';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Plus } from 'lucide-react';
import styles from './page.module.css';

const TagsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tags, loading, error } = useSelector((state: RootState) => state.tag);
  const { products } = useSelector((state: RootState) => state.product);
  const { selectedProductId } = useSelector((state: RootState) => state.selection);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TagPayload>({ tagName: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchTagsThunk());
      dispatch(fetchProductsThunk());
    }
  }, [dispatch, router]);

  const filteredTags = selectedProductId
    ? tags.filter(
        (t) =>
          t.productId === selectedProductId &&
          t.tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tags.filter((t) => t.tag.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateTagThunk({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createTagThunk({ ...formData, productId: selectedProductId! })).unwrap();
      }
      setFormData({ tagName: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Tag operation failed:', err);
    }
  };

  const handleEdit = (e: React.MouseEvent, tag: Tag) => {
    e.stopPropagation();
    setFormData({ tagName: tag.tag });
    setEditingId(tag.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const payload: TagDeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteTagThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Tag deletion failed:', err);
    }
  };

  const handleSelectProduct = (id: string) => {
    dispatch(setSelectedProductId(id));
    setSearchTerm(''); // Reset search when product changes
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tags</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <div className={styles.filter}>
        <label className={styles.label}>Filter by Product</label>
        <select
          value={selectedProductId || ''}
          onChange={(e) => handleSelectProduct(e.target.value)}
          className="input"
        >
          <option value="">All Products</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.product}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.actions}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search tags..."
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          aria-label="Add tag"
          disabled={!selectedProductId}
          title={selectedProductId ? 'Add new tag' : 'Select a product first'}
        >
          <Plus size={20} /> Add Tag
        </Button>
      </div>
      <Table headers={['Tag', 'Actions']}>
        {filteredTags.map((tag) => (
          <tr key={tag.id} className="border-b border-border">
            <td className={styles.tableCell}>{tag.tag}</td>
            <td className={styles.tableCell}>
              <Button
                variant="secondary"
                onClick={(e) => handleEdit(e, tag)}
                className={styles.actionButton}
              >
                Edit
              </Button>
              <Button
                variant="error"
                onClick={(e) => handleDelete(e, tag.id)}
                className={styles.actionButton}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Tag' : 'Add Tag'}>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <Input
            label="Tag Name"
            name="tagName"
            value={formData.tagName}
            onChange={(e) => setFormData({ ...formData, tagName: e.target.value })}
            required
            className="input"
          />
          <Button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default TagsPage;