import { Box } from '@mui/material';
import { useRef, useEffect, CSSProperties, ReactNode } from "react";

export interface TableItem {
  date: string;
  [key: string]: any;
}

export interface RowConfig<T extends TableItem> {
  id: string;
  label: string;
  getCellContent: (item: T) => ReactNode;
  getCellStyle?: (item: T, naColor: string) => CSSProperties;
}

export interface RevenueTableProps<T extends TableItem> {
  data: T[];
  firstColumnLabel: string;
  rows: RowConfig<T>[];
  naColor: string;
  formatMonthFn: (date: string) => string;
  autoScrollToEnd?: boolean;
}

export function RevenueTable<T extends TableItem>({
  data,
  firstColumnLabel,
  rows,
  naColor,
  formatMonthFn,
  autoScrollToEnd = true
}: RevenueTableProps<T>) {
  const tableScrollContainerRef = useRef<HTMLDivElement>(null);
  
  // auto scroll to right
  useEffect(() => {
    if (tableScrollContainerRef.current && autoScrollToEnd && data.length > 0) {
      const scrollContainer = tableScrollContainerRef.current;
      const timeoutId = setTimeout(() => {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth;
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [data, autoScrollToEnd]);

  return (
    <Box
      ref={tableScrollContainerRef}
      sx={{
        width: "100%",
        overflowX: "auto",
        "& table": {
          borderCollapse: "separate",
          borderSpacing: 0,
        },
        "& th, & td": {
          padding: "6px 16px",
          borderBottom: "1px solid",
          borderBottomColor: "divider",
        },
        "& thead th": {
          backgroundColor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 1,
        },
        "& th:first-of-type, & td:first-of-type": {
          position: "sticky",
          left: 0,
          zIndex: 2,
          backgroundColor: "background.paper",
          boxShadow: "1px 0px 0px 0px rgba(0,0,0,0.12)",
        },
        "& thead th:first-of-type": {
          zIndex: 3,
        },
      }}
    >
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ whiteSpace: "nowrap", textAlign: "left" }}>
              {firstColumnLabel}
            </th>
            {data.map((item) => (
              <th
                key={item.date}
                style={{ whiteSpace: "nowrap", textAlign: "right" }}
              >
                {formatMonthFn(item.date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ whiteSpace: "nowrap", textAlign: "left" }}>
                {row.label}
              </td>
              {data.map((item) => (
                <td
                  key={`${row.id}-${item.date}`}
                  style={row.getCellStyle ? row.getCellStyle(item, naColor) : { textAlign: "right" as const }}
                >
                  {row.getCellContent(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export default RevenueTable; 