'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchCategories } from '@/lib/redux/slices/categorySlice';
import { fetchProductsThunk } from '@/lib/redux/slices/productSlice';
import { fetchTagsThunk } from '@/lib/redux/slices/tagSlice';
import { fetchVariantTypesThunk, fetchVariantValuesThunk } from '@/lib/redux/slices/variantSlice';
import CategoriesSection from '@/components/sections/CategoriesSection';
import ProductsSection from '@/components/sections/ProductsSection';
import TagsSection from '@/components/sections/TagsSection';
import VariantTypesSection from '@/components/sections/VariantTypesSection';
import VariantValuesSection from '@/components/sections/VariantvaluesSection';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './page.module.css';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading: categoryLoading, error: categoryError } = useSelector((state: RootState) => state.category);
  const { loading: productLoading, error: productError } = useSelector((state: RootState) => state.product);
  const { loading: tagLoading, error: tagError } = useSelector((state: RootState) => state.tag);
  const { loading: variantLoading, error: variantError } = useSelector((state: RootState) => state.variant);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchCategories());
      dispatch(fetchProductsThunk());
      dispatch(fetchTagsThunk());
      dispatch(fetchVariantTypesThunk());
      dispatch(fetchVariantValuesThunk());
    }
  }, [dispatch, router]);

  const isLoading = categoryLoading || productLoading || tagLoading || variantLoading;
  const error = categoryError || productError || tagError || variantError;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Management Dashboard</h1>
      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingSpinner />}
      <div className={styles.firstRow}>
        <Card className={styles.sectionCard}>
          <CategoriesSection />
        </Card>
        <Card className={styles.sectionCard}>
          <ProductsSection />
        </Card>
      </div>
      <div className={styles.secondRow}>
        <Card className={styles.sectionCard}>
          <TagsSection />
        </Card>
        <Card className={styles.sectionCard}>
          <VariantTypesSection />
        </Card>
        <Card className={styles.sectionCard}>
          <VariantValuesSection />
        </Card>
      </div>
    </div>
  );
};

export default HomePage;