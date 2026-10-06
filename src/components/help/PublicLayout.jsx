import { canonicalPublicPath } from "../../site-pages.mjs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import clsx from "clsx";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardDrawer from "../dashboard/DashboardDrawer";
import styleObject from "../dashboard/styleObject";
import useClasses from "../dashboard/useClasses";
import LogoLink from "../main/LogoLink";
import HeaderBrand from "../main/HeaderBrand";
import Footer from "../main/Footer";
import { useFusionAuth } from "@fusionauth/react-sdk";
import AppearanceMenu from "../../theme/AppearanceMenu";
import Seo from "../Seo";
import { getBaseDomain } from "../dashboard/ServiceAPI";

export default function PublicLayout({ title, description, children, noIndex = false }) {
  const theme = useTheme();
  const { isLoggedIn, startLogin, startLogout } = useFusionAuth();
  const classes = useClasses(styleObject(theme, "/ping.svg"));
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    document.getElementById("public-content")?.scrollTo?.(0, 0);
  }, [pathname]);
  const current = pathname.startsWith("/docs") ? "/docs/" : canonicalPublicPath(pathname);
  return (
    <Box className={classes.root}>
      <Seo
        noIndex={noIndex}
        title={`${title} | Quantum Network Monitor`}
        description={description}
        openGraph={{
          ogUrl: `https://${getBaseDomain()}${pathname}`,
          ogType: "website",
          ogSiteName: "Quantum Network Monitor",
        }}
      />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 }, px: { xs: 2, sm: 4 } }}>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open navigation"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <LogoLink />
          <HeaderBrand sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />
          <Box sx={{ flex: { xs: 1, sm: 0 } }} />
          <AppearanceMenu />
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => (isLoggedIn ? startLogout() : startLogin())}
            sx={{ whiteSpace: "nowrap" }}
          >
            {isLoggedIn ? "Log out" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>
      <DashboardDrawer
        classes={classes}
        open={open}
        handleDrawerClose={() => setOpen(false)}
        isMediumOrLarger={desktop}
      />
      <Box
        component="main"
        id="public-content"
        className={classes.content}
        sx={{ bgcolor: "background.default", "& h1": { textAlign: "left" } }}
      >
        <Box className={classes.appBarSpacer} />
        <Container
          maxWidth={false}
          className={classes.container}
          sx={{ pb: 8 }}
        >
          <Stack
            component="nav"
            aria-label="Product help"
            direction="row"
            sx={{
              flexWrap: "wrap",
              gap: 1,
              mb: { xs: 5, md: 7 },
              borderBottom: 1,
              borderColor: "divider",
              pb: 3,
            }}
          >
            {[
              ["/features/", "Features"],
              ["/docs/", "Guides"],
              ["/download/", "Get an agent"],
              ["/faq/", "FAQ"],
            ].map(([href, label]) => (
              <Button
                key={href}
                href={href}
                variant={current === href ? "contained" : "text"}
                aria-current={current === href ? "page" : undefined}
                sx={{ borderRadius: 8, textTransform: "none", px: 4, py: 2 }}
              >
                {label}
              </Button>
            ))}
            <Button
              href="/dashboard"
              startIcon={<ArrowBackIcon />}
              sx={{ ml: { sm: "auto" }, textTransform: "none" }}
            >
              Dashboard
            </Button>
          </Stack>
          {children}
          <Box sx={{ mt: 10 }}>
            <Footer />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
