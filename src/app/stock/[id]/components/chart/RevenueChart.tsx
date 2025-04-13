"use client";

import { Box, Typography } from "@mui/material";
import {
  ChartsYAxis,
  ChartsTooltip,
  ChartsLegend,
  ChartsAxisHighlight,
  BarPlot,
  LinePlot,
  ResponsiveChartContainer,
} from "@mui/x-charts";

import { CHART_CONFIG } from "../../config";
import { ChartDataItem } from "../../types";

interface RevenueChartProps {
  chartData: ChartDataItem[];
  uniqueYears: string[];
  theme: any;
}

export function RevenueChart({
  chartData,
  uniqueYears,
}: RevenueChartProps) {
  if (chartData.length === 0) {
    return <Typography color="text.secondary">圖表區域 - 無數據</Typography>;
  }

  return (
    <Box width="100%" height="100%" position="relative">
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "calc(100% - 30px)",
            mt: 4,
            overflow: "hidden",
            "& .MuiChartsLegend-root": {
              paddingTop: 0,
              paddingLeft: 0,
            },
          }}
        >
          <ResponsiveChartContainer
            xAxis={[
              {
                scaleType: "band",
                data: chartData.map((item) => item.date),
                tickLabelStyle: { fontSize: CHART_CONFIG.axis.fontSize },
              },
            ]}
            yAxis={[
              {
                id: "leftAxis",
                scaleType: "linear",
                label: "千元",
                valueFormatter: (value: number) =>
                  `${Math.round(value).toLocaleString("zh-TW")}`,
                tickSize: CHART_CONFIG.axis.tickSize,
                tickLabelStyle: {
                  fontSize: CHART_CONFIG.axis.fontSize,
                },
              },
              {
                id: "rightAxis",
                scaleType: "linear",
                position: "right",
                label: "%",
                valueFormatter: (value: number) => `${value}`,
                tickSize: CHART_CONFIG.axis.tickSize,
                tickLabelStyle: {
                  fontSize: CHART_CONFIG.axis.fontSize,
                },
              },
            ]}
            series={[
              {
                id: "revenue",
                type: "bar",
                data: chartData.map((item) => item.revenue),
                label: "每月營收",
                yAxisKey: "leftAxis",
                color: CHART_CONFIG.colors.bar,
                valueFormatter: (value: number | null) =>
                  value !== null
                    ? `${Math.round(value).toLocaleString("zh-TW")} 千元`
                    : "N/A",
              },
              {
                id: "growthRate",
                type: "line",
                data: chartData.map((item) => {
                  return item.yoyChangeRate !== null &&
                    item.yoyChangeRate !== undefined
                    ? item.yoyChangeRate
                    : null;
                }),
                label: "單月營收年增率 (%)",
                yAxisKey: "rightAxis",
                color: CHART_CONFIG.colors.line,
                valueFormatter: (value: number | null) => {
                  if (value === null) {
                    return "N/A";
                  }
                  return `${value?.toFixed(2)}%`;
                },
                showMark: false,
                curve: "natural",
              },
            ]}
            margin={CHART_CONFIG.margins}
            height={CHART_CONFIG.height}
          >
            <BarPlot />
            <LinePlot />
            <ChartsLegend
              position={{ vertical: "top", horizontal: "left" } as const}
              direction="row"
            />
            <ChartsAxisHighlight />
            <ChartsTooltip />
            <ChartsYAxis axisId="leftAxis" />
            <ChartsYAxis axisId="rightAxis" />
          </ResponsiveChartContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 6,
            width: "100%",
            mt: 1,
          }}
        >
          {uniqueYears.map((year) => (
            <Typography key={year} variant="body2" color="text.secondary">
              {year}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
