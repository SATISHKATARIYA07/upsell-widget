import React, { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  Banner,
  Button,
  DataTable,
  Badge,
  Box,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/upsell/analytics"),
      axios.get("/api/upsell/rules"),
    ])
      .then(([analyticsRes, rulesRes]) => {
        setAnalytics(analyticsRes.data.analytics);
        setRules(rulesRes.data.rules);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statsCards = analytics
    ? [
        { label: "Total Rules", value: analytics.totalRules, color: "#5C6AC4" },
        { label: "Active Rules", value: analytics.activeRules, color: "#47C1BF" },
        { label: "Impressions", value: analytics.impressions.toLocaleString(), color: "#F49342" },
        { label: "Conversions", value: analytics.conversions, color: "#50B83C" },
        { label: "Conv. Rate", value: analytics.conversionRate, color: "#DE3618" },
        { label: "Revenue", value: `$${analytics.revenue}`, color: "#9C6ADE" },
      ]
    : [];

  return (
    <Page
      title="🚀 Upsell & Cross-sell Dashboard"
      primaryAction={{
        content: "Create New Rule",
        onAction: () => navigate("/rules/create"),
      }}
    >
      <Layout>
        {/* Welcome Banner */}
        <Layout.Section>
          <Banner
            title="Welcome to Upsell & Cross-sell App!"
            status="info"
            action={{ content: "Create First Rule", onAction: () => navigate("/rules/create") }}
          >
            <p>
              Boost your Average Order Value by showing smart upsell and
              cross-sell offers to customers during checkout.
            </p>
          </Banner>
        </Layout.Section>

        {/* Stats Cards */}
        {analytics && (
          <Layout.Section>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              {statsCards.map((stat) => (
                <Card key={stat.label}>
                  <Box padding="400">
                    <BlockStack gap="200">
                      <Text variant="bodySm" color="subdued">
                        {stat.label}
                      </Text>
                      <Text
                        variant="headingXl"
                        fontWeight="bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </Text>
                    </BlockStack>
                  </Box>
                </Card>
              ))}
            </div>
          </Layout.Section>
        )}

        {/* Recent Rules */}
        <Layout.Section>
          <Card>
            <Box padding="400">
              <InlineStack align="space-between">
                <Text variant="headingMd">Recent Upsell Rules</Text>
                <Button onClick={() => navigate("/rules")}>View All</Button>
              </InlineStack>
            </Box>
            {rules.length > 0 ? (
              <DataTable
                columnContentTypes={["text", "text", "text", "text"]}
                headings={["Trigger Product", "Upsell Product", "Discount", "Status"]}
                rows={rules.slice(0, 5).map((r) => [
                  r.triggerProductTitle,
                  r.upsellProductTitle,
                  `${r.discountPercent}%`,
                  <Badge status={r.active ? "success" : "critical"}>
                    {r.active ? "Active" : "Inactive"}
                  </Badge>,
                ])}
              />
            ) : (
              <Box padding="400">
                <Text color="subdued">
                  No rules yet. Create your first upsell rule!
                </Text>
              </Box>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
