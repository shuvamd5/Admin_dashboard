import { DiscountType } from "./common";

export interface ProductDiscount {
  id: string;
  referenceId?: string;
  productId: string;
  product?: string;
  discountType: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
}

export interface ProductDiscountPayload {
  productId: string;
  discountType: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
}

export interface OrderDiscount {
  id: string;
  code: string;
  discountType: DiscountType;
  value: number;
  minOrderTotal: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  timesUsed?: number;
  storeId: string;
}

export interface OrderDiscountPayload {
  code: string;
  discountType: DiscountType;
  value: number;
  minOrderTotal: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  timesUsed?: number;
  storeId: string;
}

export interface DiscountDeletePayload {
  voidRemarks: string;
}