import React, { useEffect, useState } from "react";
import {
  Page,
  Card,
  DataTable,
  Badge,
  Button,
  InlineStack,
  Box,
  Text,
  Toast,
  Frame,
  EmptyState,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpsellRules() {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchRules = () => {
    axios
      .get("/api/upsell/rules")
      .then((res) => setRules(res.data.rules))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggle = async (id) => {
    try {
      await axios.patch(`/api/upsell/rules/${id}/toggle`);
      fetchRules();
      setToast({ content: "Rule updated!", error: false });
    } catch {
      setToast({ content: "Failed to update rule", error: true });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    try {
      await axios.delete(`/api/upsell/rules/${id}`);
      fetchRules();
      setToast({ content: "Rule deleted!", error: false });
    } catch {
      setToast({ content: "Failed to delete rule", error: true });
    }
  };

  const rows = rules.map((rule) => [
    rule.triggerProductTitle,
    rule.upsellProductTitle,
    <Badge status={rule.type === "upsell" ? "info" : "warning"}>
      {rule.type === "upsell" ? "⬆ Upsell" : "↔ Cross-sell"}
    </Badge>,
    `${rule.discountPercent}% OFF`,
    <Badge status={rule.active ? "success" : "critical"}>
      {rule.active ? "Active" : "Paused"}
    </Badge>,
    <InlineStack gap="200">
      <Button size="slim" onClick={() => handleToggle(rule.id)}>
        {rule.active ? "Pause" : "Activate"}
      </Button>
      <Button
        size="slim"
        destructive
        onClick={() => handleDelete(rule.id)}
      >
        Delete
      </Button>
    </InlineStack>,
  ]);

  return (
    <Frame>
      <Page
        title="Upsell & Cross-sell Rules"
        primaryAction={{
          content: "+ Create Rule",
          onAction: () => navigate("/rules/create"),
        }}
      >
        <Card>
          {rules.length === 0 ? (
            <EmptyState
              heading="No upsell rules yet"
              action={{
                content: "Create First Rule",
                onAction: () => navigate("/rules/create"),
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Create upsell and cross-sell rules to boost your Average Order Value.
              </p>
            </EmptyState>
          ) : (
            <DataTable
              columnContentTypes={[
                "text","text","text","text","text","text",
              ]}
              headings={[
                "Trigger Product",
                "Offer Product",
                "Type",
                "Discount",
                "Status",
                "Actions",
              ]}
              rows={rows}
            />
          )}
        </Card>
      </Page>
      {toast && (
        <Toast
          content={toast.content}
          error={toast.error}
          onDismiss={() => setToast(null)}
        />
      )}
    </Frame>
  );
}
