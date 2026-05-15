import "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(",") || [
    "read_products",
    "write_products",
    "read_orders",
    "write_orders",
  ],
  hostName: process.env.HOST?.replace(/https?:\/\//, "") || "localhost:3000",
  hostScheme: process.env.HOST?.startsWith("https") ? "https" : "http",
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
});

// ─── Begin OAuth ──────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    await shopify.auth.begin({
      shop: shopify.utils.sanitizeShop(req.query.shop, true),
      callbackPath: "/api/auth/callback",
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  } catch (error) {
    console.error("Auth begin error:", error);
    res.status(500).send("Authentication failed");
  }
});

// ─── OAuth Callback ───────────────────────────────────────────
router.get("/callback", async (req, res) => {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });
    const session = callback.session;
    console.log(`✅ App installed: ${session.shop}`);
    res.redirect(`/?shop=${session.shop}&host=${req.query.host}`);
  } catch (error) {
    console.error("Auth callback error:", error);
    res.status(500).send("Authentication callback failed");
  }
});

export default router;