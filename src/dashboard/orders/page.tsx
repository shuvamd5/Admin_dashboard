'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchOrdersThunk, fetchOrderItemsThunk, createOrderThunk } from '@/lib/redux/slices/orderSlice';
import { OrderPayload } from '@/lib/types/order';
import { OrderStatus, PaymentStatus } from '@/lib/types/common';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './page.module.css';

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { orders, orderItems, loading, error } = useSelector((state: RootState) => state.order);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrderPayload>({
    order: {
      customerId: '',
      totalPrice: 0,
      discountAmount: 0,
      netAmount: 0,
      orderDiscountId: '',
      promoCodeId: '',
      storeId: '010dd7072dac47a0a642025fd913d99',
      orderStatus: OrderStatus.Confirmed,
    },
    orderItems: [],
    payment: { paymentMethod: 'Card', paymentStatus: PaymentStatus.Paid, amountPaid: 0, paymentDate: '' },
    shipping: { shippingAddress: '', trackingNumber: '', shippedDate: '' },
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      dispatch(fetchOrdersThunk());
    }
  }, [dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createOrderThunk(formData)).unwrap();
      setFormData({
        order: {
          customerId: '',
          totalPrice: 0,
          discountAmount: 0,
          netAmount: 0,
          orderDiscountId: '',
          promoCodeId: '',
          storeId: '010dd7072dac47a0a642025fd913d99',
          orderStatus: OrderStatus.Confirmed,
        },
        orderItems: [],
        payment: { paymentMethod: 'Card', paymentStatus: PaymentStatus.Paid, amountPaid: 0, paymentDate: '' },
        shipping: { shippingAddress: '', trackingNumber: '', shippedDate: '' },
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  };

  const handleViewItems = (orderId: string) => {
    setSelectedOrderId(orderId);
    dispatch(fetchOrderItemsThunk(orderId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
        <Button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          New Order
        </Button>
      </div>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <Card>
        <Table headers={['Customer', 'Total Price', 'Status', 'Actions']}>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border">
              <td className="px-4 py-2">{order.customerName}</td>
              <td className="px-4 py-2">${order.totalPrice.toFixed(2)}</td>
              <td className="px-4 py-2">{order.orderStatus}</td>
              <td className="px-4 py-2">
                <Button variant="secondary" onClick={() => handleViewItems(order.id)}>
                  View Items
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      {selectedOrderId && orderItems[selectedOrderId] && (
        <Card className="mt-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <Table headers={['Product', 'Variant', 'Quantity', 'Unit Price']}>
            {orderItems[selectedOrderId].map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="px-4 py-2">{item.product}</td>
                <td className="px-4 py-2">{item.productVariant}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">${item.unitPrice.toFixed(2)}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Order">
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className="form-group">
            <Input
              label="Customer ID"
              name="customerId"
              value={formData.order.customerId}
              onChange={(e) => setFormData({ ...formData, order: { ...formData.order, customerId: e.target.value } })}
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="Total Price"
              name="totalPrice"
              type="number"
              value={formData.order.totalPrice}
              onChange={(e) =>
                setFormData({ ...formData, order: { ...formData.order, totalPrice: parseFloat(e.target.value) } })
              }
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="Discount Amount"
              name="discountAmount"
              type="number"
              value={formData.order.discountAmount}
              onChange={(e) =>
                setFormData({ ...formData, order: { ...formData.order, discountAmount: parseFloat(e.target.value) } })
              }
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="Shipping Address"
              name="shippingAddress"
              value={formData.shipping.shippingAddress}
              onChange={(e) =>
                setFormData({ ...formData, shipping: { ...formData.shipping, shippingAddress: e.target.value } })
              }
              required
            />
          </div>
          <div className="form-group">
            <Button type="submit" className="btn-primary">
              Create Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrdersPage;