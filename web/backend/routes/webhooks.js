import express, { Router } from "express";

const router = Router();

// ─── Orders Create Webhook ────────────────────────────────────
router.post(
  "/orders-create",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const order = JSON.parse(req.body);
      console.log(`📦 New order: #${order.order_number}`);
      res.status(200).send("OK");
    } catch (err) {
      console.error("Webhook parse error:", err);
      res.status(400).send("Bad Request");
    }
  }
);

// ─── App Uninstalled Webhook ──────────────────────────────────
router.post(
  "/app-uninstalled",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const data = JSON.parse(req.body);
      console.log(`❌ App uninstalled: ${data.domain}`);
      res.status(200).send("OK");
    } catch (err) {
      res.status(400).send("Bad Request");
    }
  }
);

export default router;