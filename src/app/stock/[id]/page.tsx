"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  useColorScheme,
} from "@mui/material";
import { useStockInfo, useMonthlyRevenue } from "@/api/hooks";

enum TimeRange {
  ONE_YEAR = "ONE_YEAR",
  FIVE_YEARS = "FIVE_YEARS",
}

const TIME_RANGE_CONFIG = {
  [TimeRange.ONE_YEAR]: {
    label: "每月營收",
    years: 1,
  },
  [TimeRange.FIVE_YEARS]: {
    label: "近 5 年",
    years: 5,
  },
};

const BUTTON_STYLE = {
  minWidth: 100,
  borderRadius: 1,
  textTransform: "none",
  fontSize: "0.875rem",
};

export default function StockDetailPage() {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const params = useParams();
  const stockId = (params?.id as string) || "2867";
  
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.ONE_YEAR);
  const [showDetailedData, setShowDetailedData] = useState(false);
  
  const now = new Date();
  const startDate = new Date();
  
  const selectedTimeConfig = TIME_RANGE_CONFIG[timeRange];
  startDate.setFullYear(now.getFullYear() - selectedTimeConfig.years);
  
  const stockInfoQuery = useStockInfo(stockId);
  
  const monthlyRevenueQuery = useMonthlyRevenue(
    stockId,
    startDate.toISOString().split("T")[0],
    now.toISOString().split("T")[0],
    { enabled: true }
  );
  
  const isLoading = stockInfoQuery.isLoading || monthlyRevenueQuery.isLoading;
  
  const error = stockInfoQuery.error || monthlyRevenueQuery.error;
  
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            正在載入股票數據...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
          <Typography variant="h6" color="error">
            獲取數據時發生錯誤
          </Typography>
          <Typography variant="body1">{error.message}</Typography>
        </Paper>
      </Container>
    );
  }
  
  const stockInfo = stockInfoQuery.data;
  const monthlyRevenueData = monthlyRevenueQuery.data?.data || [];
  
  const sortedData = [...monthlyRevenueData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const formatYearMonth = (dateString: string) => {
    const [year, month] = dateString.split("-");
    return `${year}${month.padStart(2, "0")}`;
  };
  
  const recentMonths = sortedData.slice(0, 6);
  
  const naColor = mode === "dark" ? "#aaa" : theme.palette.text.secondary;
  
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper
        sx={{
          p: 0,
          mb: 4,
          overflow: "hidden",
          borderRadius: 1,
          border: "1px solid",
        }}
      >
        {/* Stock Title Area */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" component="h1" fontWeight="normal">
            {stockInfo?.stock_name} ({stockInfo?.stock_id})
          </Typography>
        </Box>

        <Box
          sx={{
            borderBottom: "1px solid",
            position: "relative",
          }}
        >
          {/* Time Range Button Group */}
          <Box
            sx={{
              px: 2,
              py: 2,
              display: "flex",
              gap: 1,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
            }}
          >
            {Object.entries(TIME_RANGE_CONFIG).map(
              ([rangeKey, rangeConfig]) => (
                <Button
                  key={rangeKey}
                  variant={timeRange === rangeKey ? "contained" : "outlined"}
                  onClick={() => setTimeRange(rangeKey as TimeRange)}
                  size="small"
                  sx={BUTTON_STYLE}
                >
                  {rangeConfig.label}
                </Button>
              )
            )}
          </Box>

          {/* Chart Area */}
          <Box
            sx={{
              height: 450,
              bgcolor: "background.paper",
              p: 2,
              pt: 5,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pt: 5,
              }}
            >
              <Typography color="text.secondary">圖表區域</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "auto",
                pt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                2019
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2020
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2021
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2022
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2023
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Detail Data Table Area */}
        <Box
          sx={{
            borderTop: "1px solid",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ px: 2, py: 2, borderBottom: "1px solid" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowDetailedData(!showDetailedData)}
              size="small"
              sx={BUTTON_STYLE}
            >
              詳細數據
            </Button>
          </Box>

          <TableContainer sx={{ overflow: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ pl: 2, width: "auto", whiteSpace: "nowrap" }}
                  >
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
                            ? theme.palette.success.main
                            : theme.palette.error.main
                          : naColor,
                      }}
                    >
                      {item.yoyChangeRate
                        ? item.yoyChangeRate.toFixed(2)
                        : "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{ px: 2, py: 1, textAlign: "right", borderTop: "1px solid" }}
          >
            <Typography variant="caption" color="text.secondary">
              圖表單位：千元，數據來自公開資訊觀測站
            </Typography>
          </Box>

          {/* debug mode */}
          {showDetailedData && (
            <Box p={2} sx={{ borderTop: "1px solid" }}>
              <Typography variant="subtitle2" gutterBottom>
                原始數據({monthlyRevenueData.length}筆):
              </Typography>
              <pre
                style={{
                  overflowX: "auto",
                  background:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.2)
                      : alpha(theme.palette.action.hover, 0.1),
                  padding: "10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {JSON.stringify(sortedData.slice(0, 10), null, 2)}
                {sortedData.length > 10 && "\n... 更多數據省略"}
              </pre>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
