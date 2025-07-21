export interface ProductSummary {
  id: number;
  name: string;
  imageURL: string;
  brandName: string;
  price: number;
  description?: string;
}

export interface OrderRequest {
  productId: number;
  message: string;
  messageCardId: string;
  ordererName: string;
  receivers: {
    name: string;
    phoneNumber: string;
    quantity: number;
  }[];
}

export interface OrderResponse {
  orderId: string;
  status: string;
  message: string;
}

export interface ProductError {
  message: string;
  status?: number;
}

export interface OrderError {
  message: string;
  status?: number;
}
