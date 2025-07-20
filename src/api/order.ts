import type { OrderRequest, OrderResponse, OrderError } from '../types/product';

export const createOrder = async (orderData: OrderRequest, authToken: string): Promise<OrderResponse> => {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '주문에 실패했습니다.' }));
    const error: OrderError = {
      message: errorData.message || '주문에 실패했습니다.',
      status: response.status,
    };
    throw error;
  }

  return response.json();
}; 