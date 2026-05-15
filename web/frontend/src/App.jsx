import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Frame, Navigation, TopBar, Page } from "@shopify/polaris";
import {
  HomeIcon,
  ProductIcon,
  ChartVerticalIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";

import Dashboard from "./pages/Dashboard";
import UpsellRules from "./pages/UpsellRules";
import CreateRule from "./pages/CreateRule";
import Analytics from "./pages/Analytics";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            label: "Dashboard",
            icon: HomeIcon,
            url: "/",
            onClick: () => navigate("/"),
          },
          {
            label: "Upsell Rules",
            icon: ProductIcon,
            url: "/rules",
            onClick: () => navigate("/rules"),
          },
          {
            label: "Analytics",
            icon: ChartVerticalIcon,
            url: "/analytics",
            onClick: () => navigate("/analytics"),
          },
          {
            label: "Settings",
            icon: SettingsIcon,
            url: "/settings",
            onClick: () => navigate("/settings"),
          },
        ]}
      />
    </Navigation>
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={
        <TopBar.UserMenu
          name="Merchant"
          detail="Upsell App"
          initials="U"
          open={false}
          onToggle={() => {}}
          actions={[]}
        />
      }
    />
  );

  return (
    <Frame navigation={navigationMarkup} topBar={topBarMarkup}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rules" element={<UpsellRules />} />
        <Route path="/rules/create" element={<CreateRule />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Frame>
  );
}
