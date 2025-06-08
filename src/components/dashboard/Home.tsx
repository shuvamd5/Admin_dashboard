// components/dashboard/Home.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store'; // Assuming you have AppDispatch and RootState types
import {
  fetchStatisticalAnalysis,
  fetchOrderCounts,
  fetchDeliveryStatusCounts,
  fetchDeliveryCarrierCounts,
  fetchTopSellingProducts,
  setOrderFilter,
} from '@/lib/redux/slices/dashboardSlice'; // Your dashboard slice actions
import styles from './Home.module.css';
import Card from '@/components/ui/Card'; // Import the Card component

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    statisticalAnalysis,
    orderCounts,
    deliveryStatusCounts,
    deliveryCarrierCounts,
    topSellingProducts,
    loading,
    error,
    orderFilter,
  } = useSelector((state: RootState) => state.dashboard);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchStatisticalAnalysis({ startDate: startDate || undefined, endDate: endDate || undefined }));
      dispatch(fetchOrderCounts(orderFilter));
      dispatch(fetchDeliveryStatusCounts());
      dispatch(fetchDeliveryCarrierCounts());
      dispatch(fetchTopSellingProducts());
    }
  }, [dispatch, startDate, endDate, orderFilter]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleFilterClick = (status: string | null) => {
    dispatch(setOrderFilter(status));
  };

  if (loading === 'pending') {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div> {/* Assuming 'spinner' is a global CSS class */}
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">Error: {error}</div>; // Assuming 'alert' and 'alert-error' are global CSS classes
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard Overview</h1>

      {/* Statistical Analysis */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Statistical Analysis</h2>
        <div className={styles.datePicker}>
          <div className={styles.datePickerGroup}>
            <label htmlFor="start-date" className={styles.label}>Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={handleStartDateChange}
              className="input" // Assuming 'input' is a global utility class
            />
          </div>
          <div className={styles.datePickerGroup}>
            <label htmlFor="end-date" className={styles.label}>End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleEndDateChange}
              className="input" // Assuming 'input' is a global utility class
            />
          </div>
        </div>
        <div className={styles.statsGrid}>
          <Card>
            <span className={styles.cardLabel}>Follow-ups</span>
            <span className={styles.cardValue}>{statisticalAnalysis?.followups ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.cardLabel}>Orders</span>
            <span className={styles.cardValue}>{statisticalAnalysis?.orders ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.cardLabel}>Customers</span>
            <span className={styles.cardValue}>{statisticalAnalysis?.customers ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.cardLabel}>Comments</span>
            <span className={styles.cardValue}>{statisticalAnalysis?.comments ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.cardLabel}>Visitors</span>
            <span className={styles.cardValue}>{statisticalAnalysis?.visitors ?? 0}</span>
          </Card>
        </div>
      </section>

      {/* Order Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Order Overview</h2>
        <div className={styles.orderSummary}>
          Total Completed Orders: <span className={styles.highlightValue}>{orderCounts?.totalCompleted ?? 0}</span>
        </div>
        <div className={styles.filterButtons}>
          <button
            className={`btn-primary ${orderFilter === 'new' ? styles.activeButton : ''}`} // Assuming 'btn-primary' is a global utility class
            onClick={() => handleFilterClick('new')}
          >
            New ({orderCounts?.new ?? 0})
          </button>
          <button
            className={`btn-primary ${orderFilter === 'hold' ? styles.activeButton : ''}`}
            onClick={() => handleFilterClick('hold')}
          >
            Hold ({orderCounts?.hold ?? 0})
          </button>
          <button
            className={`btn-primary ${orderFilter === 'rescheduled' ? styles.activeButton : ''}`}
            onClick={() => handleFilterClick('rescheduled')}
          >
            Rescheduled ({orderCounts?.rescheduled ?? 0})
          </button>
          <button
            className={`btn-primary ${orderFilter === 'confirmed' ? styles.activeButton : ''}`}
            onClick={() => handleFilterClick('confirmed')}
          >
            Confirmed ({orderCounts?.confirmed ?? 0})
          </button>
          <button
            className={`btn-primary ${orderFilter === null ? styles.activeButton : ''}`}
            onClick={() => handleFilterClick(null)}
          >
            All
          </button>
        </div>
      </section>

      {/* Delivery Status */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Delivery Status</h2>
        <div className={styles.deliveryStatusGrid}>
          <Card>
            <span className={styles.statusLabel}>Cancelled</span>
            <span className={styles.statusCount}>{deliveryStatusCounts?.cancelled ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.statusLabel}>New</span>
            <span className={styles.statusCount}>{deliveryStatusCounts?.new ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.statusLabel}>Picked</span>
            <span className={styles.statusCount}>{deliveryStatusCounts?.picked ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.statusLabel}>Transferred</span>
            <span className={styles.statusCount}>{deliveryStatusCounts?.transferred ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.statusLabel}>Handed</span>
            <span className={styles.statusCount}>{deliveryStatusCounts?.handed ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.statusLabel}>On Route</span>
            <span className={styles.statusCount}>{deliveryStatusCounts?.onroute ?? 0}</span>
          </Card>
          <Card>
            <span className={styles.statusLabel}>Completed</span>
            <span className={styles.statusCount}>{deliveryStatusCounts?.completed ?? 0}</span>
          </Card>
        </div>
      </section>

      <div className={styles.bottomSectionsGrid}>
        {/* Assigned Delivery */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Assigned Delivery Carriers</h2>
          {deliveryCarrierCounts && deliveryCarrierCounts.length > 0 ? (
            <ul className={styles.list}>
              {deliveryCarrierCounts.map((item) => (
                <Card as="li" key={item.carrier}> {/* Use Card component for list items */}
                  <span className={styles.listItemLabel}>{item.carrier}</span>
                  <span className={styles.listItemValue}>{item.count}</span>
                </Card>
              ))}
            </ul>
          ) : (
            <p>No delivery carrier data available.</p>
          )}
        </section>

        {/* Top Selling Products */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Selling Products</h2>
          {topSellingProducts && topSellingProducts.length > 0 ? (
            <ul className={styles.list}>
              {topSellingProducts.map((product) => (
                <Card as="li" key={product.name}> {/* Use Card component for list items */}
                  <span className={styles.listItemLabel}>{product.name}</span>
                  <span className={styles.listItemValue}>{product.count} sales</span>
                </Card>
              ))}
            </ul>
          ) : (
            <p>No top selling products data available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;