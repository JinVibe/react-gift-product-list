import type { OrderRequest, OrderResponse, OrderError } from "../types/product";

export const createOrder = async (
  orderData: OrderRequest,
  authToken: string,
): Promise<OrderResponse> => {
  const response = await fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  console.log("[API] /api/order 응답:", data);

  if (!response.ok) {
    const error: OrderError = {
      message: data.message || "주문에 실패했습니다.",
      status: response.status,
    };
    throw error;
  }

  return data;
};
