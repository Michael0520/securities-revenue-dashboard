"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  useTheme,
  alpha,
  useColorScheme,
} from "@mui/material";
import { useStockInfo, useMonthlyRevenue } from "@/api/hooks";

import { RevenueChart } from "./components/chart/RevenueChart";
import { RevenueTable } from "./components/table/RevenueTable";
import { TimeRange } from "./types";
import { CHART_CONFIG, TIME_RANGE_CONFIG, BUTTON_STYLE } from "./config";

const formatYearMonth = (dateString: string) => {
  const [year, month] = dateString.split("-");
  return `${year}${month.padStart(2, "0")}`;
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

  const sortedData = useMemo(() => {
    const data = monthlyRevenueQuery.data?.data || [];
    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [monthlyRevenueQuery.data]);

  const recentMonths = sortedData.slice(0, 6);
  const displayMonths = [...recentMonths].reverse();

  const chartData = useMemo(() => {
    const data = [...sortedData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const filteredData =
      timeRange === TimeRange.ONE_YEAR ? data.slice(-12) : data.slice(-60);

    return filteredData.map((item) => {
      const [year, month] = item.date.split("-");
      return {
        date: formatYearMonth(item.date),
        revenue: item.revenue / 1000,
        yoyChangeRate: item.yoyChangeRate || 0,
        year,
        month,
        fullDate: item.date,
      };
    });
  }, [sortedData, timeRange]);

  const uniqueYears = Array.from(new Set(chartData.map((item) => item.year)));

  const naColor =
    mode === "dark"
      ? CHART_CONFIG.colors.neutral
      : theme.palette.text.secondary;

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

          <Box
            sx={{
              height: 450,
              bgcolor: "background.paper",
              p: 2,
              pt: 5,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            {chartData.length > 0 ? (
              <RevenueChart
                chartData={chartData}
                uniqueYears={uniqueYears}
                theme={theme}
              />
            ) : (
              <Typography color="text.secondary">圖表區域 - 無數據</Typography>
            )}
          </Box>
        </Box>

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

          <RevenueTable recentMonths={displayMonths} naColor={naColor} />

          <Box
            sx={{ px: 2, py: 1, textAlign: "right", borderTop: "1px solid" }}
          >
            <Typography variant="caption" color="text.secondary">
              圖表單位：千元，數據來自公開資訊觀測站
            </Typography>
          </Box>

          {showDetailedData && (
            <Box p={2} sx={{ borderTop: "1px solid" }}>
              <Typography variant="subtitle2" gutterBottom>
                原始數據({sortedData.length}筆):
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
