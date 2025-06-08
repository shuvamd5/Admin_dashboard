import { OrderStatus, PaymentStatus } from "./common";

export interface OrderItem {
  id: string;
  product: string;
  productVariant: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  mobileNumber: string;
  trackingNumber: string;
  address: string;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  statusRemarks: string | null;
  deliveryStatus: string | null;
  deliveryRemarks: string | null;
}

export interface OrderPayload {
  order: {
    customerId: string;
    totalPrice: number;
    discountAmount: number;
    netAmount: number;
    orderDiscountId: string;
    promoCodeId: string;
    storeId: string;
    orderStatus: OrderStatus;
  };
  orderItems: {
    productId: string;
    productVariantId: string;
    quantity: number;
    unitPrice: number;
  }[];
  payment: {
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    amountPaid: number;
    paymentDate: string;
  };
  shipping: {
    shippingAddress: string;
    trackingNumber: string;
    shippedDate: string;
  };
}