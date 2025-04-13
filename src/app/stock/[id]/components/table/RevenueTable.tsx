"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { CHART_CONFIG } from "../../config";
import { RevenueItem } from "../../types";

const formatYearMonth = (dateString: string) => {
  const [year, month] = dateString.split("-");
  return `${year}${month.padStart(2, "0")}`;
};

interface RevenueTableProps {
  recentMonths: RevenueItem[];
  naColor: string;
}

export function RevenueTable({ recentMonths, naColor }: RevenueTableProps) {
  return (
    <TableContainer sx={{ overflow: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 2, width: "auto", whiteSpace: "nowrap" }}>
              年度月份
            </TableCell>
            {recentMonths.map((item) => (
              <TableCell
                key={item.date}
                align="right"
                sx={{ width: "auto", whiteSpace: "nowrap" }}
              >
                {formatYearMonth(item.date)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              component="th"
              scope="row"
              sx={{ pl: 2, whiteSpace: "nowrap" }}
            >
              每月營收
            </TableCell>
            {recentMonths.map((item) => (
              <TableCell key={`revenue-${item.date}`} align="right">
                {item.formattedRevenue}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell
              component="th"
              scope="row"
              sx={{ pl: 2, whiteSpace: "nowrap" }}
            >
              單月營收年增率 (%)
            </TableCell>
            {recentMonths.map((item) => (
              <TableCell
                key={`yoy-${item.date}`}
                align="right"
                sx={{
                  color: item.yoyChangeRate
                    ? item.yoyChangeRate > 0
                      ? CHART_CONFIG.colors.positive
                      : CHART_CONFIG.colors.negative
                    : naColor,
                }}
              >
                {item.yoyChangeRate ? item.yoyChangeRate.toFixed(2) : "N/A"}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
