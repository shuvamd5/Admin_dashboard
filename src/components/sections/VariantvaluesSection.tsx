'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createVariantValueThunk, updateVariantValueThunk, deleteVariantValueThunk } from '@/lib/redux/slices/variantSlice';
import { VariantValue, VariantValuePayload, DeletePayload } from '@/lib/types/variant';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
import { Plus } from 'lucide-react';
import styles from './section.module.css';

const VariantValuesSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { variantTypes, variantValues } = useSelector((state: RootState) => state.variant);
  const { selectedProductId, selectedVariantTypeId } = useSelector((state: RootState) => state.selection);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<VariantValuePayload>({ variantTypeId: selectedVariantTypeId || '', variantName: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVariantValues = selectedProductId && selectedVariantTypeId
    ? variantValues.filter(
        (vv) =>
          vv.productId === selectedProductId &&
          vv.variantTypeId === selectedVariantTypeId &&
          vv.variantName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const filteredVariantTypes = selectedProductId
    ? variantTypes.filter((vt) => vt.productId === selectedProductId)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateVariantValueThunk({ id: editingId, payload: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createVariantValueThunk({ ...formData, productId: selectedProductId! })).unwrap();
      }
      setFormData({ variantTypeId: selectedVariantTypeId || '', variantName: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Variant value operation failed:', err);
    }
  };

  const handleEdit = (e: React.MouseEvent, variantValue: VariantValue) => {
    e.stopPropagation();
    setFormData({ variantTypeId: variantValue.variantTypeId, variantName: variantValue.variantName });
    setEditingId(variantValue.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const payload: DeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteVariantValueThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Variant value deletion failed:', err);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Variant Values</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          aria-label="Add variant value"
          disabled={!selectedProductId || !selectedVariantTypeId}
          title={selectedProductId && selectedVariantTypeId ? 'Add new variant value' : 'Select a product and variant type first'}
        >
          <Plus size={20} />
        </Button>
      </div>
      {selectedProductId && selectedVariantTypeId ? (
        <>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search variant values..."
          />
          <Table headers={['Variant Type', 'Variant Value', 'Actions']}>
            {filteredVariantValues.map((variantValue) => (
              <tr key={variantValue.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  {variantTypes.find((vt) => vt.id === variantValue.variantTypeId)?.variantType || 'Unknown'}
                </td>
                <td className={styles.tableCell}>{variantValue.variantName}</td>
                <td className={styles.tableCell}>
                  <Button
                    variant="secondary"
                    onClick={(e) => handleEdit(e, variantValue)}
                    className={styles.actionButton}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="error"
                    onClick={(e) => handleDelete(e, variantValue.id)}
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
        <p className={styles.emptyMessage}>Please select a product and variant type to view or add variant values.</p>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Variant Value' : 'Add Variant Value'}>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <label className={styles.label}>Variant Type</label>
          <select
            value={formData.variantTypeId}
            onChange={(e) => setFormData({ ...formData, variantTypeId: e.target.value })}
            className="input"
            required
          >
            <option value="" disabled>Select Variant Type</option>
            {filteredVariantTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.variantType}
              </option>
            ))}
          </select>
          <Input
            label="Variant Value"
            name="variantName"
            value={formData.variantName}
            onChange={(e) => setFormData({ ...formData, variantName: e.target.value })}
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

export default VariantValuesSection;