import { RowConfig } from "@/components/RevenueTable/RevenueTable";

export const TIME_RANGE_CONFIG = {
  'THREE_YEARS': {
    label: "近 3 年",
    years: 3,
  },
  'FIVE_YEARS': {
    label: "近 5 年",
    years: 5,
  },
};

export type TimeRangeKey = keyof typeof TIME_RANGE_CONFIG;

export const BUTTON_STYLE = {
  minWidth: 100,
  borderRadius: 1,
  textTransform: "none",
  fontSize: "0.875rem",
};

export const CHART_CONFIG = {
  colors: {
    bar: "#F9A826",
    line: "#D32F2F",
    positive: "#4CAF50",
    negative: "#F44336",
    neutral: "#cccccc",
  },
  margins: {
    top: 60,
    right: 100,
    bottom: 20,
    left: 100,
  },
  height: 380,
  axis: {
    tickSize: 5,
    fontSize: 10,
  },
  yAxisRange: {
    min: -100,
    max: 400,
  }
};

export interface RevenueItem {
  date: string;
  revenue: number;
  formattedRevenue: string;
  yoyChangeRate: number | null;
}

export const REVENUE_TABLE_CONFIG = {
  firstColumnLabel: '年度月份',
  rows: [
    {
      id: 'revenue',
      label: '每月營收',
      getCellContent: (item: RevenueItem) => item.formattedRevenue,
      getCellStyle: () => ({ textAlign: 'right' as const }),
    },
    {
      id: 'yoyChangeRate',
      label: '單月營收年增率 (%)',
      getCellContent: (item: RevenueItem) => {
        return item.yoyChangeRate !== null
          ? item.yoyChangeRate.toFixed(2)
          : 'N/A';
      },
      getCellStyle: (item: RevenueItem, naColor: string) => {
        const value = item.yoyChangeRate;
        if (value === null) {
          return { 
            textAlign: 'right' as const,
            color: naColor 
          };
        }
        return { 
          textAlign: 'right' as const,
          color: value > 0 
            ? CHART_CONFIG.colors.positive 
            : CHART_CONFIG.colors.negative 
        };
      }
    }
  ] as RowConfig<RevenueItem>[]
}; 