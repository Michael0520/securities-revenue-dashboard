"use client";

import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ModeSwitch from "./ModeSwitch";

export default function Header() {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: "background.paper",
      }}
    >
      <Toolbar>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            py: { xs: 1, sm: 0 },
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              mr: { xs: 0, sm: 3 },
              mb: { xs: 1, sm: 0 },
              textDecoration: "none",
              color: "text.primary",
              flexShrink: 0,
              fontWeight: 600,
            }}
          >
            股票資訊
          </Typography>

          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
          </Box>

          <Box sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
            <ModeSwitch />
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
