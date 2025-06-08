export interface VariantType {
  id: string;
  variantType: string;
  productId?: string;
}

export interface VariantValue {
  id: string;
  variantTypeId: string;
  variantName: string;
  productId?: string;
}

export interface VariantTypePayload {
  variantType: string;
  productId?: string;
}

export interface VariantValuePayload {
  variantTypeId: string;
  variantName: string;
  productId?: string;
}

export interface DeletePayload {
  voidRemarks: string;
}