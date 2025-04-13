export const API_CONFIG = {
  FINMIND: {
    BASE_URL: process.env.NEXT_PUBLIC_FINMIND_API_URL || 'https://api.finmindtrade.com/api/v4/data',
    TOKEN: process.env.FINMIND_API_TOKEN || '',
    DATASETS: {
      STOCK_INFO: 'TaiwanStockInfo',
      MONTHLY_REVENUE: 'TaiwanStockMonthRevenue'
    }
  }
}; 