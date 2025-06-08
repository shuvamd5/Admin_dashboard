export interface Product {
  id: string;
  url: string;
  alt_text: string;
  product: string;
  category: string;
  price: number;
  remaining_stock: number;
}

export interface ProductPayload {
  product: {
    title: string;
    bodyHtml: string;
    price: number;
    sku: string;
    storeId: string;
    isActive: boolean;
    stockQuantity: number;
  };
  category: { categoryId: string };
  tags: { tagId: string }[];
  productVariants: {
    sku: string;
    price: number;
    variantValueId: string;
  }[];
  productImages: {
    url: string;
    altText: string;
    isMain: boolean;
  }[];
}

export interface DeletePayload {
  voidRemarks: string;
}