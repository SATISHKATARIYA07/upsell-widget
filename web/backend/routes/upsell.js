import { Router } from "express";

const router = Router();

// ─── In-memory store (replace with Prisma/DB in production) ─────────────────
let upsellRules = [
  {
    id: "1",
    triggerProductId: "TRIGGER_PRODUCT_ID",
    triggerProductTitle: "Example T-Shirt",
    upsellProductId: "UPSELL_PRODUCT_ID",
    upsellProductTitle: "Premium T-Shirt",
    discountPercent: 15,
    type: "upsell",
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// ─── GET all upsell rules ─────────────────────────────────────────────────────
router.get("/rules", (req, res) => {
  res.json({ success: true, rules: upsellRules });
});

// ─── GET single rule ──────────────────────────────────────────────────────────
router.get("/rules/:id", (req, res) => {
  const rule = upsellRules.find((r) => r.id === req.params.id);
  if (!rule) return res.status(404).json({ error: "Rule not found" });
  res.json({ success: true, rule });
});

// ─── CREATE new upsell rule ───────────────────────────────────────────────────
router.post("/rules", (req, res) => {
  const {
    triggerProductId,
    triggerProductTitle,
    upsellProductId,
    upsellProductTitle,
    discountPercent,
    type,
  } = req.body;

  if (!triggerProductId || !upsellProductId) {
    return res
      .status(400)
      .json({ error: "triggerProductId and upsellProductId are required" });
  }

  const newRule = {
    id: Date.now().toString(),
    triggerProductId,
    triggerProductTitle,
    upsellProductId,
    upsellProductTitle,
    discountPercent: discountPercent || 10,
    type: type || "upsell", // "upsell" or "crosssell"
    active: true,
    createdAt: new Date().toISOString(),
  };

  upsellRules.push(newRule);
  res.status(201).json({ success: true, rule: newRule });
});

// ─── UPDATE rule ──────────────────────────────────────────────────────────────
router.put("/rules/:id", (req, res) => {
  const index = upsellRules.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Rule not found" });

  upsellRules[index] = { ...upsellRules[index], ...req.body };
  res.json({ success: true, rule: upsellRules[index] });
});

// ─── DELETE rule ──────────────────────────────────────────────────────────────
router.delete("/rules/:id", (req, res) => {
  upsellRules = upsellRules.filter((r) => r.id !== req.params.id);
  res.json({ success: true, message: "Rule deleted" });
});

// ─── TOGGLE rule active/inactive ─────────────────────────────────────────────
router.patch("/rules/:id/toggle", (req, res) => {
  const rule = upsellRules.find((r) => r.id === req.params.id);
  if (!rule) return res.status(404).json({ error: "Rule not found" });

  rule.active = !rule.active;
  res.json({ success: true, rule });
});

// ─── GET upsell offer for a product (used by storefront widget) ───────────────
// GET upsell offer for a product
router.get("/offer/:productId", (req, res) => {
  let { productId } = req.params;

  // ─── Fix: GID format handle કરો ──────────────
  if (productId.includes("gid://shopify/Product/")) {
    productId = productId.split("gid://shopify/Product/")[1];
  }

  const matchingRule = upsellRules.find(
    (r) => r.triggerProductId === productId && r.active
  );

  if (!matchingRule) {
    return res.json({ success: true, offer: null });
  }

  res.json({
    success: true,
    offer: {
      ruleId: matchingRule.id,
      type: matchingRule.type,
      upsellProductId: matchingRule.upsellProductId,
      upsellProductTitle: matchingRule.upsellProductTitle,
      discountPercent: matchingRule.discountPercent,
      message:
        matchingRule.type === "upsell"
          ? `Upgrade to ${matchingRule.upsellProductTitle} and save ${matchingRule.discountPercent}%!`
          : `Customers also buy: ${matchingRule.upsellProductTitle} — ${matchingRule.discountPercent}% OFF!`,
    },
  });
});

// ─── GET analytics (simple) ───────────────────────────────────────────────────
router.get("/analytics", (req, res) => {
  res.json({
    success: true,
    analytics: {
      totalRules: upsellRules.length,
      activeRules: upsellRules.filter((r) => r.active).length,
      impressions: 1240,
      clicks: 312,
      conversions: 87,
      revenue: 4350.5,
      conversionRate: "27.9%",
    },
  });
});

export default router;
