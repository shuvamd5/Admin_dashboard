import { DiscountType } from "./common";

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  value: number;
  minOrderTotal: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  timesUsed: number;
  storeId: string;
}

export interface PromoCodePayload {
  code: string;
  description: string;
  discountType: DiscountType;
  value: number;
  minOrderTotal: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  timesUsed: number;
  storeId: string;
}

export interface PromoCodeDeletePayload {
  voidRemarks: string;
}