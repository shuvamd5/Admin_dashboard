'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createVariantTypeThunk, updateVariantTypeThunk, deleteVariantTypeThunk } from '@/lib/redux/slices/variantSlice';
import { setSelectedVariantTypeId } from '@/lib/redux/slices/selectionSlice';
import { VariantType, VariantTypePayload, DeletePayload } from '@/lib/types/variant';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
import { Plus } from 'lucide-react';
import styles from './section.module.css';

const VariantTypesSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { variantTypes } = useSelector((state: RootState) => state.variant);
  const { selectedProductId, selectedVariantTypeId } = useSelector((state: RootState) => state.selection);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<VariantTypePayload>({ variantType: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVariantTypes = selectedProductId
    ? variantTypes.filter(
        (vt) =>
          vt.productId === selectedProductId &&
          vt.variantType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateVariantTypeThunk({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createVariantTypeThunk({ ...formData, productId: selectedProductId! })).unwrap();
      }
      setFormData({ variantType: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Variant type operation failed:', err);
    }
  };

  const handleEdit = (e: React.MouseEvent, variantType: VariantType) => {
    e.stopPropagation();
    setFormData({ variantType: variantType.variantType });
    setEditingId(variantType.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const payload: DeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteVariantTypeThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Variant type deletion failed:', err);
    }
  };

  const handleSelect = (id: string) => {
    dispatch(setSelectedVariantTypeId(id));
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Variant Types</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          aria-label="Add variant type"
          disabled={!selectedProductId}
          title={selectedProductId ? 'Add new variant type' : 'Select a product first'}
        >
          <Plus size={20} />
        </Button>
      </div>
      {selectedProductId ? (
        <>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search variant types..."
          />
          <Table headers={['Variant Type', 'Actions']}>
            {filteredVariantTypes.map((variantType) => (
              <tr
                key={variantType.id}
                className={`${styles.tableRow} ${selectedVariantTypeId === variantType.id ? styles.selectedRow : ''}`}
                onClick={() => handleSelect(variantType.id)}
              >
                <td className={styles.tableCell}>{variantType.variantType}</td>
                <td className={styles.tableCell}>
                  <Button
                    variant="secondary"
                    onClick={(e) => handleEdit(e, variantType)}
                    className={styles.actionButton}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="error"
                    onClick={(e) => handleDelete(e, variantType.id)}
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
        <p className={styles.emptyMessage}>Please select a product to view or add variant types.</p>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Variant Type' : 'Add Variant Type'}>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <Input
            label="Variant Type"
            name="variantType"
            value={formData.variantType}
            onChange={(e) => setFormData({ ...formData, variantType: e.target.value })}
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

export default VariantTypesSection;