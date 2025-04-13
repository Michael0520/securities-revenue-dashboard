'use client'

import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import ProTip from '@/components/ProTip';
import Copyright from '@/components/Copyright';
import { useStockList, useMonthlyRevenue } from '@/api/hooks';

export default function Home() {
  const [showStockList, setShowStockList] = useState(false);
  const [showTSMCRevenue, setShowTSMCRevenue] = useState(false);

  const { 
    data: stockInfoData, 
    isLoading: stockListLoading, 
    error: stockListError,
    refetch: refetchStockList,
    isFetching: isFetchingStockList
  } = useStockList({ enabled: false });

  const { 
    data: revenueData, 
    isLoading: revenueLoading, 
    error: revenueError,
    refetch: refetchRevenue,
    isFetching: isFetchingRevenue
  } = useMonthlyRevenue('2330', undefined, undefined, { enabled: false });

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return '發生未知錯誤';
  };

  const handleFetchStockInfo = async () => {
    setShowStockList(true);
    await refetchStockList();
  };

  const handleFetchTSMCRevenue = async () => {
    setShowTSMCRevenue(true);
    await refetchRevenue();
  };

  const handleRefreshStockInfo = () => {
    refetchStockList();
  };

  const handleRefreshTSMCRevenue = () => {
    refetchRevenue();
  };

  const isLoading = isFetchingStockList || isFetchingRevenue;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          股票月營收查詢系統
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {!showStockList ? (
            <Button 
              variant="contained" 
              onClick={handleFetchStockInfo}
              disabled={isLoading}
            >
              獲取股票列表
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              onClick={handleRefreshStockInfo}
              disabled={isLoading}
              startIcon={isFetchingStockList ? <CircularProgress size={16} /> : null}
            >
              刷新股票列表
            </Button>
          )}

          {!showTSMCRevenue ? (
            <Button 
              variant="contained" 
              onClick={handleFetchTSMCRevenue}
              disabled={isLoading}
              color="secondary"
            >
              獲取台積電月營收
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              onClick={handleRefreshTSMCRevenue}
              disabled={isLoading}
              color="secondary"
              startIcon={isFetchingRevenue ? <CircularProgress size={16} color="secondary" /> : null}
            >
              刷新台積電月營收
            </Button>
          )}
        </Stack>

        <Link href="/about" color="secondary" component={NextLink} sx={{ mb: 2 }}>
          前往關於頁面
        </Link>

        {isLoading && !stockInfoData && !revenueData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {stockListError && (
          <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', mb: 2, width: '100%' }}>
            <Typography>獲取股票資訊失敗: {getErrorMessage(stockListError)}</Typography>
          </Paper>
        )}

        {revenueError && (
          <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', mb: 2, width: '100%' }}>
            <Typography>獲取月營收數據失敗: {getErrorMessage(revenueError)}</Typography>
          </Paper>
        )}

        {showStockList && stockInfoData && (
          <Paper sx={{ p: 2, mb: 3, overflow: 'auto', maxHeight: 400, width: '100%' }}>
            <Typography variant="h6" gutterBottom>股票列表（前 10 筆）</Typography>
            <pre>{JSON.stringify(stockInfoData.data.slice(0, 10), null, 2)}</pre>
            <Typography>總計 {stockInfoData.data.length} 筆資料</Typography>
          </Paper>
        )}

        {showTSMCRevenue && revenueData && (
          <Paper sx={{ p: 2, overflow: 'auto', maxHeight: 400, width: '100%' }}>
            <Typography variant="h6" gutterBottom>台積電月營收數據（前 10 筆）</Typography>
            <pre>{JSON.stringify(revenueData.data.slice(0, 10), null, 2)}</pre>
            <Typography>總計 {revenueData.data.length} 筆資料</Typography>
          </Paper>
        )}
        
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
