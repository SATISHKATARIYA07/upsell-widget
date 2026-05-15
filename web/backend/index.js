import express from "express";
import serveStatic from "serve-static";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import shopifyRoutes from "./routes/shopify.js";
import upsellRoutes from "./routes/upsell.js";
import webhookRoutes from "./routes/webhooks.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.use(express.json());

// ─── Webhook Routes (raw body needed) ───────────────────────────────────────
app.use("/api/webhooks", webhookRoutes);

// ─── Shopify Auth Routes ─────────────────────────────────────────────────────
app.use("/api/auth", shopifyRoutes);

// ─── Upsell API Routes ───────────────────────────────────────────────────────
app.use("/api/upsell", upsellRoutes);

// ─── Frontend ────────────────────────────────────────────────────────────────
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", async (req, res) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
    );
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
