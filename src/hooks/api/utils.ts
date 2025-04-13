import { MonthlyRevenue } from "@/types/stock";

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
 * format revenue number
 * @param revenue: number 1234567
 * @returns string 1,234,567
 */
export const formatRevenue = (revenue: number): string => {
  return new Intl.NumberFormat("zh-TW").format(revenue);
}; 