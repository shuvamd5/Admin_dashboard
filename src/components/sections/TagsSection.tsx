'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createTagThunk, updateTagThunk, deleteTagThunk } from '@/lib/redux/slices/tagSlice';
import { Tag, TagPayload, TagDeletePayload } from '@/lib/types/tag';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
import { Plus } from 'lucide-react';
import styles from './section.module.css';

const TagsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags } = useSelector((state: RootState) => state.tag);
  const { selectedProductId } = useSelector((state: RootState) => state.selection);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TagPayload>({ tagName: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTags = selectedProductId
    ? tags.filter(
        (t) =>
          t.productId === selectedProductId &&
          t.tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Tags</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          aria-label="Add tag"
          disabled={!selectedProductId}
          title={selectedProductId ? 'Add new tag' : 'Select a product first'}
        >
          <Plus size={20} />
        </Button>
      </div>
      {selectedProductId ? (
        <>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search tags..."
          />
          <Table headers={['Tag', 'Actions']}>
            {filteredTags.map((tag) => (
              <tr key={tag.id} className={styles.tableRow}>
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
        </>
      ) : (
        <p className={styles.emptyMessage}>Please select a product to view or add tags.</p>
      )}
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

export default TagsSection;