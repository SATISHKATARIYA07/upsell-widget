/**
 * Upsell & Cross-sell Storefront Widget
 * This script is injected into the Shopify store theme
 * It shows upsell/cross-sell offers when customer adds product to cart
 */

(function () {
  "use strict";

  const APP_URL = "https://YOUR_APP_URL.com"; // Replace with your app URL
  const WIDGET_STYLE = `
    #upsell-widget-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    #upsell-widget-modal {
      background: #fff;
      border-radius: 12px;
      padding: 28px;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
    #upsell-widget-modal h3 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
    }
    #upsell-widget-modal p {
      margin: 0 0 20px;
      color: #555;
      font-size: 14px;
      line-height: 1.5;
    }
    .upsell-badge {
      display: inline-block;
      background: #ff4747;
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .upsell-btn-accept {
      display: block;
      width: 100%;
      padding: 14px;
      background: #008060;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 10px;
      transition: background 0.2s;
    }
    .upsell-btn-accept:hover { background: #006048; }
    .upsell-btn-decline {
      display: block;
      width: 100%;
      padding: 10px;
      background: transparent;
      color: #888;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .upsell-btn-decline:hover { background: #f5f5f5; }
    .upsell-product-info {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .upsell-product-emoji { font-size: 32px; }
  `;

  // ─── Inject Styles ──────────────────────────────────────────────────────────
  const styleEl = document.createElement("style");
  styleEl.textContent = WIDGET_STYLE;
  document.head.appendChild(styleEl);

  // ─── Show Upsell Modal ──────────────────────────────────────────────────────
  function showUpsellModal(offer, productTitle) {
    // Remove existing modal if any
    const existing = document.getElementById("upsell-widget-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "upsell-widget-overlay";
    overlay.innerHTML = `
      <div id="upsell-widget-modal">
        <span class="upsell-badge">🎉 Special Offer!</span>
        <h3>${offer.type === "upsell" ? "Upgrade Your Order!" : "Customers Also Buy!"}</h3>
        <div class="upsell-product-info">
          <span class="upsell-product-emoji">${offer.type === "upsell" ? "⬆️" : "🛍️"}</span>
          <div>
            <strong>${offer.upsellProductTitle}</strong>
            <br>
            <span style="color:#008060; font-weight:700;">${offer.discountPercent}% OFF — Limited Time!</span>
          </div>
        </div>
        <p>${offer.message}</p>
        <button class="upsell-btn-accept" id="upsell-accept-btn">
          ✅ Yes! Add to Cart (${offer.discountPercent}% OFF)
        </button>
        <button class="upsell-btn-decline" id="upsell-decline-btn">
          No thanks, I'll pass
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Accept button
    document.getElementById("upsell-accept-btn").addEventListener("click", () => {
      addUpsellToCart(offer.upsellProductId, offer.discountPercent);
      overlay.remove();
    });

    // Decline button
    document.getElementById("upsell-decline-btn").addEventListener("click", () => {
      overlay.remove();
    });

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    // Track impression
    trackEvent("impression", offer.ruleId);
  }

  // ─── Add Upsell Product to Cart ─────────────────────────────────────────────
  async function addUpsellToCart(productId, discountPercent) {
    try {
      // Fetch product variants
      const variantId = productId.replace("gid://shopify/Product/", "");
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: variantId,
          quantity: 1,
          properties: {
            _upsell: "true",
            _discount: `${discountPercent}%`,
          },
        }),
      });
      if (response.ok) {
        showSuccessToast(`Item added with ${discountPercent}% discount! 🎉`);
      }
    } catch (err) {
      console.error("Upsell add to cart error:", err);
    }
  }

  // ─── Success Toast ───────────────────────────────────────────────────────────
  function showSuccessToast(message) {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: #008060; color: white;
      padding: 12px 20px; border-radius: 8px;
      font-size: 14px; font-weight: 600;
      z-index: 10000; animation: slideUp 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,128,96,0.4);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ─── Track Events ────────────────────────────────────────────────────────────
  function trackEvent(event, ruleId) {
    fetch(`${APP_URL}/api/upsell/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ruleId }),
    }).catch(() => {});
  }

  // ─── Intercept Add to Cart ───────────────────────────────────────────────────
  async function checkAndShowOffer(productId) {
    try {
      const res = await fetch(`${APP_URL}/api/upsell/offer/${productId}`);
      const data = await res.json();
      if (data.success && data.offer) {
        setTimeout(() => showUpsellModal(data.offer, productId), 500);
      }
    } catch (err) {
      // Silently fail — never break the store
    }
  }

  // ─── Override fetch to intercept cart/add.js ─────────────────────────────────
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = typeof args[0] === "string" ? args[0] : args[0]?.url || "";

    if (url.includes("/cart/add") || url.includes("cart/add.js")) {
      try {
        const cloned = response.clone();
        const body = await cloned.json();
        const productId = `gid://shopify/Product/${body.product_id}`;
        checkAndShowOffer(productId);
      } catch {}
    }
    return response;
  };

  console.log("✅ Upsell & Cross-sell Widget loaded");
})();
