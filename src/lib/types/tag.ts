export interface Tag {
  id: string;
  tag: string;
  productId?: string;
}

export interface TagPayload {
  tagName: string;
  productId?: string;
}

export interface TagDeletePayload {
  voidRemarks: string;
}