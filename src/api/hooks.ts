import { useQuery } from "@tanstack/react-query";
import { FinMindResponse, StockInfo, MonthlyRevenue } from "./finmind";

const QUERY_CONFIG = {
  stockList: {
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
  },
  monthlyRevenue: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
  },
};

const DEFAULT_STOCK_ID = "2867";

export type ApiResponse<T> = FinMindResponse<T>;

export const calculateYoYChange = (data: MonthlyRevenue[]) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedData.map((item) => {
    const lastYear = sortedData.find((d) => {
      const currentDate = new Date(item.date);
      const compareDate = new Date(d.date);
      return (
        compareDate.getMonth() === currentDate.getMonth() &&
        compareDate.getFullYear() === currentDate.getFullYear() - 1
      );
    });

    const yoyChangeRate = lastYear
      ? ((item.revenue - lastYear.revenue) / lastYear.revenue) * 100
      : null;

    const prevMonth = sortedData.find((d) => {
      const currentDate = new Date(item.date);
      const compareDate = new Date(d.date);
      const prevMonthDate = new Date(currentDate);
      prevMonthDate.setMonth(currentDate.getMonth() - 1);

      return (
        compareDate.getMonth() === prevMonthDate.getMonth() &&
        compareDate.getFullYear() === prevMonthDate.getFullYear()
      );
    });

    const momChangeRate = prevMonth
      ? ((item.revenue - prevMonth.revenue) / prevMonth.revenue) * 100
      : null;

    return {
      ...item,
      yoyChangeRate,
      momChangeRate,
      formattedRevenue: formatRevenue(item.revenue),
    };
  });
};

/**
 * format revenue to readable format (e.g.: 1,234,567)
 * input: 1234567
 * output: 1,234,567
 */
const formatRevenue = (revenue: number): string => {
  return new Intl.NumberFormat("zh-TW").format(revenue);
};

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
