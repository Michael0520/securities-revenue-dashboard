import { useQuery } from "@tanstack/react-query";
import { MonthlyRevenue } from "@/types/stock";
import { ApiResponse } from "@/types/api";
import { QUERY_CONFIG, DEFAULT_STOCK_ID } from "./config";
import { calculateYoYChange } from "./utils";

export function useMonthlyRevenue(
  stockId: string = DEFAULT_STOCK_ID,
  startDate?: string,
  endDate?: string,
  options?: { enabled?: boolean }
) {
  return useQuery<
    ApiResponse<MonthlyRevenue>,
    Error,
    ApiResponse<
      MonthlyRevenue & {
        yoyChangeRate: number | null;
        momChangeRate: number | null;
        formattedRevenue: string;
      }
    >
  >({
    queryKey: ["monthlyRevenue", stockId, startDate, endDate],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append("stock_id", stockId);
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);

        const url = `/api/stock/monthly-revenue?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`獲取月營收數據失敗: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("獲取月營收數據錯誤:", error);
        throw error;
      }
    },
    select: (data) => {
      return {
        ...data,
        data: calculateYoYChange(data.data),
      };
    },
    enabled: !!stockId && (options?.enabled ?? false),
    ...QUERY_CONFIG.monthlyRevenue,
    placeholderData: (previousData) => previousData,
  });
} 