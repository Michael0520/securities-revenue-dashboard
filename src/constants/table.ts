import { RowConfig } from "@/components/RevenueTable/RevenueTable";
import { EnhancedMonthlyRevenue } from "@/types/stock";
import { CHART_CONFIG } from "./chart";

export const REVENUE_TABLE_CONFIG = {
  firstColumnLabel: '年度月份',
  rows: [
    {
      id: 'revenue',
      label: '每月營收',
      getCellContent: (item: EnhancedMonthlyRevenue) => item.formattedRevenue,
      getCellStyle: () => ({ textAlign: 'right' as const }),
    },
    {
      id: 'yoyChangeRate',
      label: '單月營收年增率 (%)',
      getCellContent: (item: EnhancedMonthlyRevenue) => {
        return item.yoyChangeRate !== null
          ? item.yoyChangeRate.toFixed(2)
          : 'N/A';
      },
      getCellStyle: (item: EnhancedMonthlyRevenue, naColor: string) => {
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
  ] as RowConfig<EnhancedMonthlyRevenue>[]
}; 