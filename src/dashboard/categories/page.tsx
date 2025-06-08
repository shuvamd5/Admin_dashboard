'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/redux/slices/categorySlice';
import { setSelectedCategoryId } from '@/lib/redux/slices/selectionSlice';
import { Category, CategoryPayload, CategoryDeletePayload } from '@/lib/types/category';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Plus } from 'lucide-react';
import styles from './page.module.css';

const CategoriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories, loading, error } = useSelector((state: RootState) => state.category);
  const { selectedCategoryId } = useSelector((state: RootState) => state.selection);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryPayload>({ categoryName: '', categoryUrl: '', categoryAltText: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchCategories());
    }
  }, [dispatch, router]);

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }
      setFormData({ categoryName: '', categoryUrl: '', categoryAltText: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Category operation failed:', err);
    }
  };

  const handleEdit = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setFormData({
      categoryName: category.category,
      categoryUrl: category.url,
      categoryAltText: category.altText,
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const payload: CategoryDeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteCategory({ id, payload })).unwrap();
    } catch (err) {
      console.error('Category deletion failed:', err);
    }
  };

  const handleSelect = (id: string) => {
    dispatch(setSelectedCategoryId(id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Categories</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <div className={styles.actions}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search categories..."
        />
        <Button onClick={() => setIsModalOpen(true)} className="btn-primary" aria-label="Add category">
          <Plus size={20} /> Add Category
        </Button>
      </div>
      <Table headers={['Category', 'Actions']}>
        {filteredCategories.map((category) => (
          <tr
            key={category.id}
            className={`${styles.tableRow} ${selectedCategoryId === category.id ? styles.selectedRow : ''}`}
            onClick={() => handleSelect(category.id)}
          >
            <td className={styles.tableCell}>{category.category}</td>
            <td className={styles.tableCell}>
              <Button
                variant="secondary"
                onClick={(e) => handleEdit(e, category)}
                className={styles.actionButton}
              >
                Edit
              </Button>
              <Button
                variant="error"
                onClick={(e) => handleDelete(e, category.id)}
                className={styles.actionButton}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <Input
            label="Category Name"
            name="categoryName"
            value={formData.categoryName}
            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            required
            className="input"
          />
          <Input
            label="Category Image URL"
            name="categoryUrl"
            value={formData.categoryUrl}
            onChange={(e) => setFormData({ ...formData, categoryUrl: e.target.value })}
            className="input"
          />
          <Input
            label="Alt Text"
            name="categoryAltText"
            value={formData.categoryAltText}
            onChange={(e) => setFormData({ ...formData, categoryAltText: e.target.value })}
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

export default CategoriesPage;