import { useQuery } from "@tanstack/react-query";
import { StockInfo } from "@/types/stock";
import { ApiResponse } from "@/types/api";
import { QUERY_CONFIG } from "./config";

export function useStockInfo(stockId: string) {
  return useQuery<StockInfo | null>({
    queryKey: ["stockInfo", stockId],
    queryFn: async () => {
      if (!stockId) return null;

      try {
        const response = await fetch("/api/stock/info");

        if (!response.ok) {
          throw new Error(`獲取股票資訊失敗: ${response.status}`);
        }

        const data: ApiResponse<StockInfo> = await response.json();
        return data.data.find((stock) => stock.stock_id === stockId) || null;
      } catch (error) {
        console.error("獲取股票信息錯誤:", error);
        throw error;
      }
    },
    enabled: !!stockId,
    ...QUERY_CONFIG.stockList,
  });
} 