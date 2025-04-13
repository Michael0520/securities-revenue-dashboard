"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DEFAULT_STOCK_ID } from "@/api/hooks";

export default function Home() {
  const router = useRouter();
  const defaultStockId = DEFAULT_STOCK_ID;

  useEffect(() => {
    router.push(`/stock/${defaultStockId}`);
  }, [router]);
  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress size={40} />
      <Typography variant="body1" sx={{ ml: 2 }}>
        正在前往股票資訊頁面...
      </Typography>
    </Box>
  );
}
