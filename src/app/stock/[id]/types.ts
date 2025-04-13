export type ChartDataItem = {
  date: string;
  revenue: number;
  yoyChangeRate: number | null;
  year: string;
  month: string;
  fullDate: string;
};

export type RevenueItem = {
  date: string;
  revenue: number;
  yoyChangeRate: number | null;
  formattedRevenue: string;
  fullDate?: string;
};

export enum TimeRange {
  ONE_YEAR = "ONE_YEAR",
  FIVE_YEARS = "FIVE_YEARS",
} 