export interface ProductSummary {
  id: number;
  name: string;
  imageURL: string;
  brandInfo?: { name: string };
  price?: { sellingPrice: number };
  description?: string;
}

export interface OrderRequest {
  productId: number;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  message?: string;
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