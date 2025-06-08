export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  firstName?: string;
  lastName?: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewPayload {
  productId: string;
  customerId: string;
  rating: number;
  review: string;
}

export interface ProductReviewDeletePayload {
  voidRemarks: string;
}