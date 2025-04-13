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


export const DEFAULT_TIME_RANGE: TimeRangeKey = 'THREE_YEARS'; 