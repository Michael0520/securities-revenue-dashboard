/**
 * format date string to year month
 * @param dateString: 2023-01-01
 * @return 202301
 */
export const formatYearMonth = (dateString: string): string => {
  const [year, month] = dateString.split("-");
  return `${year}${month.padStart(2, "0")}`;
}; 