import type { ProductSummary, ProductError } from '../types/product';

export const fetchProductSummary = async (productId: number): Promise<ProductSummary> => {
  const response = await fetch(`/api/products/${productId}/summary`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '제품 정보를 불러오는데 실패했습니다.' }));
    const error: ProductError = {
      message: errorData.message || '제품 정보를 불러오는데 실패했습니다.',
      status: response.status,
    };
    throw error;
  }

  return response.json();
}; 