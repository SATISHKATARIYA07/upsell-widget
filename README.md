# 🛍️ Shopify Upsell & Cross-sell App

Node.js + React (Polaris) વડે બનેલ complete Shopify App

---

## 📁 Project Structure

```
shopify-upsell-app/
├── web/
│   ├── backend/
│   │   ├── index.js              ← Express server
│   │   └── routes/
│   │       ├── shopify.js        ← OAuth authentication
│   │       ├── upsell.js         ← Upsell API (CRUD)
│   │       └── webhooks.js       ← Shopify webhooks
│   └── frontend/
│       └── src/
│           ├── App.jsx           ← Main app with navigation
│           └── pages/
│               ├── Dashboard.jsx ← Home dashboard
│               ├── UpsellRules.jsx ← Rules list
│               ├── CreateRule.jsx  ← Create new rule
│               └── Analytics.jsx   ← Analytics page
├── extensions/
│   └── upsell-widget/
│       └── src/
│           └── storefront-widget.js ← Store front popup
├── prisma/
│   └── schema.prisma             ← Database schema
├── shopify.app.toml              ← Shopify app config
└── .env.example                  ← Environment variables template
```

---

## 🚀 Setup Steps (Step by Step)

### Step 1: Shopify Partner Account
1. https://partners.shopify.com/ પર account બનાવો
2. Apps → Create App → Custom App
3. API Key અને Secret copy કરો

### Step 2: Project Setup
```bash
# Project folder માં જાઓ
cd shopify-upsell-app

# .env file બનાવો
cp .env.example .env

# .env file edit કરો — API keys ભરો
nano .env
```

### Step 3: Install Dependencies
```bash
# Root
npm install

# Backend
cd web && npm install

# Frontend
cd frontend && npm install && cd ..
```

### Step 4: Database Setup
```bash
cd web
npx prisma generate
npx prisma db push
```

### Step 5: Local Development
```bash
# Shopify CLI install (once)
npm install -g @shopify/cli

# App run કરો
shopify app dev
```

---

## 🌐 Render.com પર Deploy કરવું

### Step 1: GitHub પર push
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Render Dashboard
1. render.com પર account બનાવો
2. New → Web Service
3. GitHub repo connect કરો
4. Settings:
   - **Build Command:** `cd web && npm install && cd frontend && npm install && npm run build`
   - **Start Command:** `cd web && npm start`
   - **Node Version:** 18

### Step 3: Environment Variables (Render Dashboard)
```
SHOPIFY_API_KEY      = your_api_key
SHOPIFY_API_SECRET   = your_api_secret
HOST                 = https://your-app.onrender.com
SCOPES               = read_products,write_products,read_orders,write_orders
NODE_ENV             = production
DATABASE_URL         = file:./dev.db
```

### Step 4: Shopify App URL Update
- Partners Dashboard → App → App Setup
- App URL: `https://your-app.onrender.com`
- Redirect URL: `https://your-app.onrender.com/api/auth/callback`

---

## 🧩 Storefront Widget Install

`extensions/upsell-widget/src/storefront-widget.js` file:

1. `APP_URL` replace with your deployed URL
2. Shopify Admin → Online Store → Themes → Edit Code
3. `theme.liquid` file ના `</body>` પહેલા paste:
```html
<script src="{{ 'storefront-widget.js' | asset_url }}"></script>
```
4. File ને `Assets` folder માં upload કરો

---

## 💡 Features

- ✅ Upsell Rules Create / Edit / Delete / Toggle
- ✅ Cart intercept — Add to cart trigger
- ✅ Popup modal on storefront
- ✅ Discount % setting (0–50%)
- ✅ Analytics dashboard
- ✅ Shopify Polaris UI
- ✅ OAuth Authentication
- ✅ Webhook handling
- ✅ Prisma Database schema ready

---

## 📈 Monetization Ideas

| Plan | Price | Features |
|------|-------|---------|
| Free | $0 | 3 rules |
| Basic | $9.99/mo | 20 rules + analytics |
| Pro | $29.99/mo | Unlimited + A/B testing |

---

## 🆘 Support

Issues? Check:
1. `.env` file ભરેલ છે?
2. Shopify API keys correct છે?
3. Render deploy logs check કરો
