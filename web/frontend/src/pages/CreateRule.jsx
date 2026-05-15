import React, { useState } from "react";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Select,
  RangeSlider,
  Button,
  Banner,
  Box,
  Text,
  InlineStack,
  BlockStack,
  Badge,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateRule() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    triggerProductId: "",
    triggerProductTitle: "",
    upsellProductId: "",
    upsellProductTitle: "",
    discountPercent: 10,
    type: "upsell",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.triggerProductId || !form.upsellProductId) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/upsell/rules", form);
      setSuccess(true);
      setTimeout(() => navigate("/rules"), 1500);
    } catch (err) {
      setError("Failed to create rule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title="Create Upsell Rule"
      breadcrumbs={[{ content: "Rules", url: "/rules" }]}
    >
      <Card>
        <Box padding="400">
          <BlockStack gap="400">
            {error && <Banner status="critical">{error}</Banner>}
            {success && (
              <Banner status="success">
                Rule created successfully! Redirecting...
              </Banner>
            )}

            <Text variant="headingMd">Rule Type</Text>
            <Select
              label="Offer Type"
              options={[
                {
                  label: "⬆ Upsell — Suggest a better/premium product",
                  value: "upsell",
                },
                {
                  label: "↔ Cross-sell — Suggest a complementary product",
                  value: "crosssell",
                },
              ]}
              value={form.type}
              onChange={handleChange("type")}
              helpText={
                form.type === "upsell"
                  ? "Show a premium version of the product (e.g. Basic → Premium)"
                  : "Show a related product (e.g. Phone → Phone Case)"
              }
            />

            <Text variant="headingMd">Trigger Product (When customer adds THIS)</Text>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Product ID *"
                  value={form.triggerProductId}
                  onChange={handleChange("triggerProductId")}
                  placeholder="gid://shopify/Product/1234567890"
                  helpText="Copy from Shopify Admin > Products URL"
                />
                <TextField
                  label="Product Title"
                  value={form.triggerProductTitle}
                  onChange={handleChange("triggerProductTitle")}
                  placeholder="Basic T-Shirt"
                />
              </FormLayout.Group>
            </FormLayout>

            <Text variant="headingMd">Offer Product (Show THIS as upsell)</Text>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Product ID *"
                  value={form.upsellProductId}
                  onChange={handleChange("upsellProductId")}
                  placeholder="gid://shopify/Product/9876543210"
                />
                <TextField
                  label="Product Title"
                  value={form.upsellProductTitle}
                  onChange={handleChange("upsellProductTitle")}
                  placeholder="Premium T-Shirt"
                />
              </FormLayout.Group>
            </FormLayout>

            <Text variant="headingMd">Discount Offer</Text>
            <RangeSlider
              label={`Discount: ${form.discountPercent}% OFF`}
              min={0}
              max={50}
              step={5}
              value={form.discountPercent}
              onChange={handleChange("discountPercent")}
              output
            />

            {/* Preview */}
            <Box
              background="bg-surface-secondary"
              padding="400"
              borderRadius="200"
            >
              <Text variant="headingSm">📱 Preview Message:</Text>
              <Box paddingBlockStart="200">
                <Badge status="success" size="large">
                  {form.type === "upsell"
                    ? `Upgrade to ${form.upsellProductTitle || "Premium Product"} and save ${form.discountPercent}%!`
                    : `Customers also buy: ${form.upsellProductTitle || "Related Product"} — ${form.discountPercent}% OFF!`}
                </Badge>
              </Box>
            </Box>

            <InlineStack gap="300" align="end">
              <Button onClick={() => navigate("/rules")}>Cancel</Button>
              <Button
                primary
                loading={loading}
                onClick={handleSubmit}
              >
                Create Rule
              </Button>
            </InlineStack>
          </BlockStack>
        </Box>
      </Card>
    </Page>
  );
}
