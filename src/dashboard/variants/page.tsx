'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import {
  fetchVariantTypesThunk,
  fetchVariantValuesThunk,
  createVariantTypeThunk,
  updateVariantTypeThunk,
  deleteVariantTypeThunk,
  createVariantValueThunk,
  updateVariantValueThunk,
  deleteVariantValueThunk,
} from '@/lib/redux/slices/variantSlice';
import { VariantType, VariantValue, DeletePayload } from '@/lib/types/variant';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { History, Plus, X } from 'lucide-react';
import styles from './page.module.css';

interface FormData {
  variantType: string;
  variantTypeId: string | null;
  variantValues: string[];
  editingTypeId: string | null;
  editingValueId: string | null;
}

const VariantsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { variantTypes, variantValues, loading, error } = useSelector((state: RootState) => state.variant);
  const [formData, setFormData] = useState<FormData>({
    variantType: '',
    variantTypeId: null,
    variantValues: [],
    editingTypeId: null,
    editingValueId: null,
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchVariantTypesThunk());
      dispatch(fetchVariantValuesThunk());
    }
  }, [dispatch, router]);

  const handleSelectExistingType = (type: VariantType) => {
    setFormData({
      ...formData,
      variantType: type.variantType,
      variantTypeId: type.id,
      editingTypeId: null,
      variantValues: [],
    });
    setShowTypeDropdown(false);
  };

  const handleAddVariantValue = () => {
    setFormData({ ...formData, variantValues: [...formData.variantValues, ''] });
  };

  const handleRemoveVariantValue = (index: number) => {
    setFormData({
      ...formData,
      variantValues: formData.variantValues.filter((_, i) => i !== index),
    });
  };

  const handleVariantValueChange = (index: number, value: string) => {
    const updatedValues = [...formData.variantValues];
    updatedValues[index] = value;
    setFormData({ ...formData, variantValues: updatedValues });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let variantTypeId = formData.variantTypeId;
      if (formData.editingTypeId) {
        // Update existing type
        await dispatch(
          updateVariantTypeThunk({ id: formData.editingTypeId, payload: { variantType: formData.variantType } })
        ).unwrap();
        variantTypeId = formData.editingTypeId;
        setFormData({ ...formData, editingTypeId: null });
      } else if (!variantTypeId && formData.variantType.trim()) {
        // Create new type
        const typeResponse = await dispatch(createVariantTypeThunk({ variantType: formData.variantType })).unwrap();
        variantTypeId = typeResponse.id;
      }
      if (variantTypeId) {
        // Create or update values
        for (const variantName of formData.variantValues.filter((name) => name.trim() !== '')) {
          if (formData.editingValueId) {
            await dispatch(
              updateVariantValueThunk({ id: formData.editingValueId, payload: { variantTypeId, variantName } })
            ).unwrap();
            setFormData({ ...formData, editingValueId: null });
          } else {
            await dispatch(createVariantValueThunk({ variantTypeId, variantName })).unwrap();
          }
        }
      }
      setFormData({ variantType: '', variantTypeId: null, variantValues: [], editingTypeId: null, editingValueId: null });
    } catch (err) {
      console.error('Variant creation/update failed:', err);
    }
  };

  const handleDeleteType = async (id: string) => {
    try {
      const payload: DeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteVariantTypeThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Variant type deletion failed:', err);
    }
  };

  const handleDeleteValue = async (id: string) => {
    try {
      const payload: DeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteVariantValueThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Variant value deletion failed:', err);
    }
  };

  const handleEditType = (variantType: VariantType) => {
    setFormData({
      variantType: variantType.variantType,
      variantTypeId: variantType.id,
      variantValues: [],
      editingTypeId: variantType.id,
      editingValueId: null,
    });
  };

  const handleEditValue = (variantValue: VariantValue) => {
    setFormData({
      ...formData,
      variantType: variantTypes.find((vt) => vt.id === variantValue.variantTypeId)?.variantType || '',
      variantTypeId: variantValue.variantTypeId,
      variantValues: [variantValue.variantName],
      editingValueId: variantValue.id,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Variants</h1>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <div className={styles.typeInputContainer}>
            <Input
              label="Variant Type"
              name="variantType"
              value={formData.variantType}
              onChange={(e) =>
                setFormData({ ...formData, variantType: e.target.value, variantTypeId: null, editingTypeId: null })
              }
              placeholder="Enter or select variant type (e.g., Color, Size)"
              className="input"
              required={!formData.variantTypeId}
            />
            <Button
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className={styles.historyButton}
              aria-label="Select existing variant type"
            >
              <History size={20} />
            </Button>
          </div>
          {showTypeDropdown && variantTypes.length > 0 && (
            <div className={styles.dropdown}>
              {variantTypes.map((type) => (
                <div
                  key={type.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelectExistingType(type)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelectExistingType(type)}
                >
                  {type.variantType}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <Button
            type="button"
            onClick={handleAddVariantValue}
            className="btn-secondary"
            disabled={!formData.variantType.trim() && !formData.variantTypeId}
            aria-label="Add variant value"
          >
            <Plus size={20} /> Add Variant Value
          </Button>
        </div>
        {formData.variantValues.length > 0 && (
          <div className={styles.variantValuesContainer}>
            <h3 className={styles.subtitle}>Variant Values</h3>
            {formData.variantValues.map((value, index) => (
              <div key={index} className={styles.variantValueItem}>
                <Input
                  label={`Value ${index + 1}`}
                  name={`variantValue-${index}`}
                  value={value}
                  onChange={(e) => handleVariantValueChange(index, e.target.value)}
                  required
                  placeholder="Enter variant value (e.g., Red, Small)"
                  className="input"
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveVariantValue(index)}
                  className="btn-error"
                  aria-label={`Remove variant value ${index + 1}`}
                >
                  <X size={20} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button type="submit" className="btn-primary">
          {formData.editingTypeId || formData.editingValueId ? 'Update' : 'Create'}
        </Button>
      </form>
      <Table headers={['Variant Type', 'Variant Name', 'Actions']}>
        {variantTypes.map((type) => [
          <tr key={`type-${type.id}`} className="border-b border-border">
            <td className="px-4 py-2">{type.variantType}</td>
            <td className="px-4 py-2">-</td>
            <td className="px-4 py-2">
              <Button variant="secondary" onClick={() => handleEditType(type)} className="mr-2">
                Edit
              </Button>
              <Button variant="error" onClick={() => handleDeleteType(type.id)}>
                Delete
              </Button>
            </td>
          </tr>,
          ...variantValues
            .filter((value) => value.variantTypeId === type.id)
            .map((value) => (
              <tr key={`value-${value.id}`} className="border-b border-border">
                <td className="px-4 py-2">{type.variantType}</td>
                <td className="px-4 py-2">{value.variantName}</td>
                <td className="px-4 py-2">
                  <Button variant="secondary" onClick={() => handleEditValue(value)} className="mr-2">
                    Edit
                  </Button>
                  <Button variant="error" onClick={() => handleDeleteValue(value.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            )),
        ])}
      </Table>
    </div>
  );
};

export default VariantsPage;