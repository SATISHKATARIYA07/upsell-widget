import { Router } from "express";

const router = Router();

// ─── Orders Create Webhook ────────────────────────────────────────────────────
router.post("/orders-create", express.raw({ type: "application/json" }), (req, res) => {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  // TODO: Verify HMAC signature with your SHOPIFY_API_SECRET
  // const verified = verifyWebhook(req.body, hmac, process.env.SHOPIFY_API_SECRET);

  try {
    const order = JSON.parse(req.body);
    console.log(`📦 New order: #${order.order_number} from ${order.email}`);
    console.log(`   Total: ${order.total_price} ${order.currency}`);
    // TODO: Track upsell conversions here
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook parse error:", err);
    res.status(400).send("Bad Request");
  }
});

// ─── App Uninstalled Webhook ──────────────────────────────────────────────────
router.post("/app-uninstalled", express.raw({ type: "application/json" }), (req, res) => {
  try {
    const data = JSON.parse(req.body);
    console.log(`❌ App uninstalled from shop: ${data.domain}`);
    // TODO: Clean up shop data from DB
    res.status(200).send("OK");
  } catch (err) {
    res.status(400).send("Bad Request");
  }
});

export default router;
