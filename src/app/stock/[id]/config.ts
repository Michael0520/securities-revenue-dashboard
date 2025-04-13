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