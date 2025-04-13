import { API_CONFIG } from './config';

interface FinMindRequestParams {
  dataset: string;
  data_id?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

export interface FinMindResponse<T> {
  status: number;
  data: T[];
  error?: string;
}

export interface StockInfo {
  industry_category: string;
  stock_id: string;
  stock_name: string;
  type: string;
  date: string;
}

export interface MonthlyRevenue {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

export async function finmindFetch<T>(params: FinMindRequestParams): Promise<FinMindResponse<T>> {
  try {
    const queryParams = new URLSearchParams();
    
    queryParams.append('token', API_CONFIG.FINMIND.TOKEN);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `${API_CONFIG.FINMIND.BASE_URL}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('FinMind API 錯誤:', error);
    throw error;
  }
}

export async function getStockInfo(): Promise<FinMindResponse<StockInfo>> {
  return finmindFetch<StockInfo>({
    dataset: API_CONFIG.FINMIND.DATASETS.STOCK_INFO,
  });
}

export async function getMonthlyRevenue(
  stockId: string, 
  startDate?: string, 
  endDate?: string
): Promise<FinMindResponse<MonthlyRevenue>> {
  const currentDate = new Date();
  const defaultEndDate = currentDate.toISOString().split('T')[0];
  
  const threeYearsAgo = new Date(currentDate);
  threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);
  const defaultStartDate = threeYearsAgo.toISOString().split('T')[0];

  return finmindFetch<MonthlyRevenue>({
    dataset: API_CONFIG.FINMIND.DATASETS.MONTHLY_REVENUE,
    data_id: stockId,
    start_date: startDate || defaultStartDate,
    end_date: endDate || defaultEndDate,
  });
} 