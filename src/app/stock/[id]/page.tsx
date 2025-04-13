"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useStockInfo, useMonthlyRevenue } from "@/api/hooks";

import { RevenueChart } from "./components/chart/RevenueChart";
import { CHART_CONFIG, TIME_RANGE_CONFIG, BUTTON_STYLE, TimeRangeKey } from "./config";

const formatYearMonth = (dateString: string) => {
  const [year, month] = dateString.split("-");
  return `${year}${month.padStart(2, "0")}`;
};

export default function StockDetailPage() {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const params = useParams();
  const stockId = (params?.id as string) || "2867";

  const [showDetailedData, setShowDetailedData] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeKey>('THREE_YEARS');
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleTimeRangeSelect = (timeRange: TimeRangeKey) => {
    setSelectedTimeRange(timeRange);
    handleClose();
  };

  const now = new Date();
  const startDate = new Date();

  startDate.setFullYear(now.getFullYear() - TIME_RANGE_CONFIG[selectedTimeRange].years);

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

  const displayMonths = [...sortedData].reverse();

  const chartData = useMemo(() => {
    const data = [...sortedData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return data.map((item) => {
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
  }, [sortedData]);

  const uniqueYears = Array.from(new Set(chartData.map((item) => item.year)));

  const naColor =
    mode === "dark"
      ? CHART_CONFIG.colors.neutral
      : theme.palette.text.secondary;

  const tableScrollContainerRef = useRef<HTMLDivElement>(null);

  // auto scroll to right
  useEffect(() => {
    if (tableScrollContainerRef.current && !isLoading) {
      const scrollContainer = tableScrollContainerRef.current;
      const timeoutId = setTimeout(() => {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth;
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, sortedData]);

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
              justifyContent: "space-between",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={BUTTON_STYLE}
            >
              每月營收
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                ...BUTTON_STYLE,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
              aria-controls={open ? "time-range-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {TIME_RANGE_CONFIG[selectedTimeRange].label}
            </Button>
            <Menu
              id="time-range-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {Object.entries(TIME_RANGE_CONFIG).map(([key, config]) => (
                <MenuItem 
                  key={key} 
                  onClick={() => handleTimeRangeSelect(key as TimeRangeKey)}
                  selected={key === selectedTimeRange}
                >
                  {config.label}
                </MenuItem>
              ))}
            </Menu>
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

          {/* Custom Table */}
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
                    年度月份
                  </th>
                  {displayMonths.map((item) => (
                    <th
                      key={item.date}
                      style={{ whiteSpace: "nowrap", textAlign: "right" }}
                    >
                      {formatYearMonth(item.date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ whiteSpace: "nowrap", textAlign: "left" }}>
                    每月營收
                  </td>
                  {displayMonths.map((item) => (
                    <td
                      key={`revenue-${item.date}`}
                      style={{ textAlign: "right" }}
                    >
                      {item.formattedRevenue}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ whiteSpace: "nowrap", textAlign: "left" }}>
                    單月營收年增率 (%)
                  </td>
                  {displayMonths.map((item) => (
                    <td
                      key={`yoy-${item.date}`}
                      style={{
                        textAlign: "right",
                        color: item.yoyChangeRate
                          ? item.yoyChangeRate > 0
                            ? CHART_CONFIG.colors.positive
                            : CHART_CONFIG.colors.negative
                          : naColor,
                      }}
                    >
                      {item.yoyChangeRate
                        ? item.yoyChangeRate.toFixed(2)
                        : "N/A"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Box>

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
