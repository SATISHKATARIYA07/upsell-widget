import "@shopify/shopify-api/adapters/node";
import express from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import shopifyRoutes from "./routes/shopify.js";
import upsellRoutes from "./routes/upsell.js";
import webhookRoutes from "./routes/webhooks.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = parseInt(process.env.PORT || "3000", 10);

const app = express();

// ─── CORS Fix ─────────────────────────────────────────────────
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Routes
app.use("/api/webhooks", webhookRoutes);
app.use("/api/auth", shopifyRoutes);
app.use("/api/upsell", upsellRoutes);

// Frontend
const STATIC_PATH = join(__dirname, "../frontend/dist");
app.use(express.static(STATIC_PATH));

app.get("/*", (req, res) => {
  try {
    res.sendFile(join(STATIC_PATH, "index.html"));
  } catch {
    res.status(200).send(`<h1>✅ Upsell App Running</h1>`);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
