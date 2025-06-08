export interface ApiResponse<T> {
  responseCode: string;
  responseMessage: string;
  data?: T;
  datas?: T[];
}

export enum DiscountType {
  Percentage = 'percentage',
  Fixed = 'fixed',
  Flat = 'flat',
}

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export enum PaymentStatus {
  Paid = 'Paid',
  Pending = 'Pending',
  Failed = 'Failed',
}