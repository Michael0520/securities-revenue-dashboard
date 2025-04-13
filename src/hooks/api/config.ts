export const QUERY_CONFIG = {
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

export const DEFAULT_STOCK_ID = "2867";