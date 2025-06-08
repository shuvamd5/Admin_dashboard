export interface Category {
  id: string;
  category: string;
  url: string;
  altText: string;
}

export interface CategoryPayload {
  categoryName: string;
  categoryUrl: string;
  categoryAltText: string;
}

export interface CategoryDeletePayload {
  voidRemarks: string;
}
