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
import { setSelectedProductId, setSelectedVariantTypeId } from '@/lib/redux/slices/selectionSlice';
import { fetchProductsThunk } from '@/lib/redux/slices/productSlice';
import { VariantType, VariantValue, DeletePayload } from '@/lib/types/variant';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar';
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
  const { products } = useSelector((state: RootState) => state.product);
  const { selectedProductId, selectedVariantTypeId } = useSelector((state: RootState) => state.selection);
  const [activeTab, setActiveTab] = useState<'table' | 'values'>('table');
  const [formData, setFormData] = useState<FormData>({
    variantType: '',
    variantTypeId: null,
    variantValues: [],
    editingTypeId: null,
    editingValueId: null,
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchVariantTypesThunk());
      dispatch(fetchVariantValuesThunk());
      dispatch(fetchProductsThunk());
    }
  }, [dispatch, router]);

  const filteredVariantTypes = selectedProductId
    ? variantTypes.filter(
        (vt) =>
          vt.productId === selectedProductId &&
          vt.variantType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : variantTypes.filter((vt) => vt.variantType.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredVariantValues = selectedProductId && selectedVariantTypeId
    ? variantValues.filter(
        (vv) =>
          vv.productId === selectedProductId &&
          vv.variantTypeId === selectedVariantTypeId &&
          vv.variantName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : variantValues.filter((vv) => vv.variantName.toLowerCase().includes(searchTerm.toLowerCase()));

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
        await dispatch(
          updateVariantTypeThunk({ id: formData.editingTypeId, payload: { variantType: formData.variantType } })
        ).unwrap();
        variantTypeId = formData.editingTypeId;
        setFormData({ ...formData, editingTypeId: null });
      } else if (!variantTypeId && formData.variantType.trim()) {
        const typeResponse = await dispatch(
          createVariantTypeThunk({ variantType: formData.variantType, productId: selectedProductId! })
        ).unwrap();
        variantTypeId = typeResponse.id;
      }
      if (variantTypeId) {
        for (const variantName of formData.variantValues.filter((name) => name.trim() !== '')) {
          if (formData.editingValueId) {
            await dispatch(
              updateVariantValueThunk({
                id: formData.editingValueId,
                payload: { variantTypeId, variantName, productId: selectedProductId! },
              })
            ).unwrap();
            setFormData({ ...formData, editingValueId: null });
          } else {
            await dispatch(
              createVariantValueThunk({ variantTypeId, variantName, productId: selectedProductId! })
            ).unwrap();
          }
        }
      }
      setFormData({ variantType: '', variantTypeId: null, variantValues: [], editingTypeId: null, editingValueId: null });
    } catch (err) {
      console.error('Variant creation/update failed:', err);
    }
  };

  const handleDeleteType = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const payload: DeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteVariantTypeThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Variant type deletion failed:', err);
    }
  };

  const handleDeleteValue = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const payload: DeletePayload = { voidRemarks: 'Mistake' };
      await dispatch(deleteVariantValueThunk({ id, payload })).unwrap();
    } catch (err) {
      console.error('Variant value deletion failed:', err);
    }
  };

  const handleEditType = (e: React.MouseEvent, variantType: VariantType) => {
    e.stopPropagation();
    setFormData({
      variantType: variantType.variantType,
      variantTypeId: variantType.id,
      variantValues: [],
      editingTypeId: variantType.id,
      editingValueId: null,
    });
  };

  const handleEditValue = (e: React.MouseEvent, variantValue: VariantValue) => {
    e.stopPropagation();
    setFormData({
      ...formData,
      variantType: variantTypes.find((vt) => vt.id === variantValue.variantTypeId)?.variantType || '',
      variantTypeId: variantValue.variantTypeId,
      variantValues: [variantValue.variantName],
      editingValueId: variantValue.id,
    });
  };

  const handleSelectProduct = (id: string) => {
    dispatch(setSelectedProductId(id));
    dispatch(setSelectedVariantTypeId(null));
    setSearchTerm(''); // Reset search when product changes
    setFormData({ variantType: '', variantTypeId: null, variantValues: [], editingTypeId: null, editingValueId: null });
  };

  const handleSelectVariantType = (id: string) => {
    dispatch(setSelectedVariantTypeId(id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Variants</h1>
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
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'table' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('table')}
        >
          Variants
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'values' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('values')}
        >
          Variant Values
        </button>
      </div>
      {activeTab === 'table' && (
        <>
          <div className={styles.actions}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search variants..."
            />
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <div className={styles.typeInputContainer}>
                <Input
                  label="Variant Type"
                  name="variantType"
                  value={formData.variantType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      variantType: e.target.value,
                      variantTypeId: null,
                      editingTypeId: null,
                    })
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
                  disabled={!selectedProductId}
                >
                  <History size={20} />
                </Button>
              </div>
              {showTypeDropdown && filteredVariantTypes.length > 0 && (
                <div className={styles.dropdown}>
                  {filteredVariantTypes.map((type) => (
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
            <Button
              type="submit"
              className="btn-primary"
              disabled={!selectedProductId}
              title={selectedProductId ? 'Create or update variant' : 'Select a product first'}
            >
              {formData.editingTypeId || formData.editingValueId ? 'Update' : 'Create'}
            </Button>
          </form>
          <Table headers={['Variant Type', 'Variant Name', 'Actions']}>
            {filteredVariantTypes.map((type) => [
              <tr
                key={`type-${type.id}`}
                className={`${styles.tableRow} ${
                  selectedVariantTypeId === type.id ? styles.selectedRow : ''
                }`}
                onClick={() => handleSelectVariantType(type.id)}
              >
                <td className={styles.tableCell}>{type.variantType}</td>
                <td className={styles.tableCell}>-</td>
                <td className={styles.tableCell}>
                  <Button
                    variant="secondary"
                    onClick={(e) => handleEditType(e, type)}
                    className={styles.actionButton}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="error"
                    onClick={(e) => handleDeleteType(e, type.id)}
                    className={styles.actionButton}
                  >
                    Delete
                  </Button>
                </td>
              </tr>,
              ...filteredVariantValues
                .filter((value) => value.variantTypeId === type.id)
                .map((value) => (
                  <tr key={`value-${value.id}`} className={styles.tableRow}>
                    <td className={styles.tableCell}>{type.variantType}</td>
                    <td className={styles.tableCell}>{value.variantName}</td>
                    <td className={styles.tableCell}>
                      <Button
                        variant="secondary"
                        onClick={(e) => handleEditValue(e, value)}
                        className={styles.actionButton}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="error"
                        onClick={(e) => handleDeleteValue(e, value.id)}
                        className={styles.actionButton}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )),
            ])}
          </Table>
        </>
      )}
      {activeTab === 'values' && (
        <>
          <div className={styles.actions}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search variant values..."
            />
          </div>
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
                    onClick={(e) => handleEditValue(e, variantValue)}
                    className={styles.actionButton}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="error"
                    onClick={(e) => handleDeleteValue(e, variantValue.id)}
                    className={styles.actionButton}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </>
      )}
    </div>
  );
};

export default VariantsPage;