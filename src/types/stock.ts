export interface StockInfo {
  industry_category: string;
  stock_id: string;
  stock_name: string;
  type: string;
  date: string;
}

export interface MonthlyRevenue {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

export interface EnhancedMonthlyRevenue extends MonthlyRevenue {
  yoyChangeRate: number | null;
  momChangeRate: number | null;
  formattedRevenue: string;
}

export interface ChartDataItem {
  date: string;
  revenue: number;
  yoyChangeRate: number;
  year: string;
  month: string;
  fullDate: string;
} 