import { useQuery } from "@tanstack/react-query";
import { StockInfo } from "@/types/stock";
import { ApiResponse } from "@/types/api";
import { QUERY_CONFIG } from "./config";

export function useStockList(options?: { enabled?: boolean }) {
  return useQuery<ApiResponse<StockInfo>, Error>({
    queryKey: ["stockList"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/stock/info");

        if (!response.ok) {
          throw new Error(`獲取股票列表失敗: ${response.status}`);
        }

        const data = await response.json();

        return data;
      } catch (error) {
        console.error("獲取股票列表錯誤:", error);
        throw error;
      }
    },
    enabled: options?.enabled ?? false,
    ...QUERY_CONFIG.stockList,
  });
} 