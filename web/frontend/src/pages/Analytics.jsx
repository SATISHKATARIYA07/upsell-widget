import React, { useEffect, useState } from "react";
import {
  Page,
  Card,
  Layout,
  DataTable,
  Text,
  Box,
  Banner,
  BlockStack,
} from "@shopify/polaris";
import axios from "axios";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/upsell/analytics")
      .then((res) => setData(res.data.analytics))
      .catch(console.error);
  }, []);

  if (!data) return <Page title="Analytics"><Text>Loading...</Text></Page>;

  return (
    <Page title="📊 Analytics">
      <Layout>
        <Layout.Section>
          <Banner status="info" title="Analytics Overview">
            Track your upsell performance and revenue impact.
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {[
              { label: "💡 Total Impressions", value: data.impressions, desc: "Times offer was shown" },
              { label: "👆 Total Clicks", value: data.clicks, desc: "Times offer was clicked" },
              { label: "✅ Conversions", value: data.conversions, desc: "Completed upsell purchases" },
              { label: "💰 Extra Revenue", value: `$${data.revenue}`, desc: "Revenue from upsells" },
            ].map((stat) => (
              <Card key={stat.label}>
                <Box padding="400">
                  <BlockStack gap="100">
                    <Text variant="headingMd">{stat.label}</Text>
                    <Text variant="headingXl" fontWeight="bold">
                      {stat.value}
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      {stat.desc}
                    </Text>
                  </BlockStack>
                </Box>
              </Card>
            ))}
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Box padding="400">
              <Text variant="headingMd">Performance Summary</Text>
            </Box>
            <DataTable
              columnContentTypes={["text", "numeric", "numeric", "numeric", "text"]}
              headings={["Metric", "Value", "Target", "Previous", "Change"]}
              rows={[
                ["Conversion Rate", data.conversionRate, "25%", "22.1%", "▲ +5.8%"],
                ["Avg Order Boost", "$50.00", "$45.00", "$42.00", "▲ +19%"],
                ["Active Rules", data.activeRules, data.totalRules, data.totalRules - 1, "▲ +1"],
                ["Total Revenue", `$${data.revenue}`, "$5000", "$3200", "▲ +35%"],
              ]}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
