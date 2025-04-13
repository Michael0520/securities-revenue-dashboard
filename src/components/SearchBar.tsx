"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Paper, InputBase, IconButton, Box, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
}

export default function SearchBar({
  placeholder = "輸入台 / 美股代號、查看公司價值",
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stockIdMatch = pathname.match(/\/stock\/([^\/]+)/);
    if (stockIdMatch && stockIdMatch[1]) {
      setQuery(stockIdMatch[1]);
    } else if (pathname === "/") {
      setQuery("");
    }
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/stock/${query.trim()}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: 2,
          boxShadow: (theme) =>
            `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{ "aria-label": "搜索股票" }}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="搜索">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
