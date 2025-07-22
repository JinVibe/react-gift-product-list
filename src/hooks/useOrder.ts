import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../api/order";
import type { OrderRequest, OrderResponse } from "../types/product";

export const useOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOrder = async (
    orderData: OrderRequest,
    authToken: string,
  ): Promise<OrderResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createOrder(orderData, authToken);

      toast.success("주문이 성공적으로 완료되었습니다!");
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "주문에 실패했습니다.";
      setError(errorMessage);

      // 401 에러 시 로그인 페이지로 리다이렉트
      if (err.status === 401) {
        toast.error("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      } else if (err.status && err.status >= 400 && err.status < 500) {
        toast.error(errorMessage);
      } else {
        toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    order: handleOrder,
  };
};
