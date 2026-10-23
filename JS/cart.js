// Keycap Lab - Unified Cart & Wishlist Management
(() => {
  const CART_KEY = "keycap-lab-cart";
  const WISHLIST_KEY = "keycap-lab-wishlist";
  const COUPON_KEY = "keycap-lab-coupon";
  const COUPONS = { KEYS10: 0.1, LAB15: 0.15, WELCOME: 0.1 };

  function readStorage(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? fallback : JSON.parse(stored);
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // storage unavailable
    }
  }

  // --- Cart State ---
  let cartItems = readStoredCart();
  let coupon = readStoredCoupon();

  function readStoredCart() {
    const list = readStorage(CART_KEY, []);
    if (!Array.isArray(list)) return [];
    return list
      .filter((item) => item && typeof item.id === "string" && item.name)
      .map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        qty: Math.max(1, Math.floor(Number(item.qty) || 1)),
      }));
  }

  function readStoredCoupon() {
    const c = readStorage(COUPON_KEY, null);
    return typeof c === "string" && COUPONS[c.toUpperCase()]
      ? c.toUpperCase()
      : null;
  }

  function persistCart() {
    writeStorage(CART_KEY, cartItems);
    writeStorage(COUPON_KEY, coupon);
  }

  function updateCartCounters() {
    const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = String(totalCount);
    });
  }

  function emitCartChange() {
    persistCart();
    updateCartCounters();
    if (typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("cart:changed", {
          detail: {
            items: [...cartItems],
            subtotal: getCartSubtotal(),
            count: getCartCount(),
          },
        }),
      );
    }
  }

  function getCartItems() {
    return cartItems.map((item) => ({
      ...item,
      parts: item.parts ? [...item.parts] : undefined,
    }));
  }

  function addCartItem(item) {
    if (!item || !item.id || !item.name) {
      return { ok: false, error: "Product information is incomplete." };
    }
    const price = Number(item.price) || 0;
    const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
    const existing = cartItems.find((entry) => entry.id === item.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cartItems.push({
        id: item.id,
        name: item.name,
        desc: String(item.desc || item.subtitle || ""),
        price,
        qty,
        image: item.image || "",
        ...(Array.isArray(item.parts) ? { parts: [...item.parts] } : {}),
      });
    }

    emitCartChange();
    showToast(`Added ${item.name} to cart!`, "success");
    return { ok: true };
  }

  function updateCartQty(id, qty) {
    const item = cartItems.find((entry) => entry.id === id);
    const validQty = Math.floor(Number(qty));
    if (!item) return false;
    if (validQty <= 0) {
      return removeCartItem(id);
    }
    item.qty = validQty;
    emitCartChange();
    return true;
  }

  function removeCartItem(id) {
    const prevLen = cartItems.length;
    cartItems = cartItems.filter((entry) => entry.id !== id);
    if (cartItems.length !== prevLen) {
      emitCartChange();
      showToast("Item removed from cart.", "info");
      return true;
    }
    return false;
  }

  function clearCart() {
    cartItems = [];
    coupon = null;
    emitCartChange();
  }

  function getCartCount() {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  }

  function getCartSubtotal() {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }

  function applyCoupon(code) {
    const cleanCode = String(code || "")
      .trim()
      .toUpperCase();
    if (!COUPONS[cleanCode]) {
      return {
        ok: false,
        error: "Invalid coupon code. Try 'KEYS10' for 10% off.",
      };
    }
    coupon = cleanCode;
    emitCartChange();
    showToast(
      `Coupon ${coupon} applied: ${COUPONS[coupon] * 100}% discount!`,
      "success",
    );
    return { ok: true, code: coupon, rate: COUPONS[coupon] };
  }

  function removeCoupon() {
    if (coupon) {
      coupon = null;
      emitCartChange();
      showToast("Coupon removed.", "info");
    }
  }

  // --- Wishlist State ---
  let wishlistItems = readStoredWishlist();

  function readStoredWishlist() {
    const list = readStorage(WISHLIST_KEY, []);
    return Array.isArray(list) ? list.filter((item) => item && item.id) : [];
  }

  function persistWishlist() {
    writeStorage(WISHLIST_KEY, wishlistItems);
  }

  function updateWishlistCounters() {
    const count = wishlistItems.length;
    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = String(count);
    });
    // Update heart icons across the page
    document.querySelectorAll("[data-wishlist-toggle]").forEach((btn) => {
      const id = btn.dataset.productId || btn.dataset.id;
      const isFavorited = hasWishlist(id);
      btn.setAttribute("aria-pressed", String(isFavorited));
      const icon = btn.querySelector("i");
      if (icon) {
        if (isFavorited) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid", "text-accent");
        } else {
          icon.classList.remove("fa-solid", "text-accent");
          icon.classList.add("fa-regular");
        }
      }
    });
  }

  function emitWishlistChange() {
    persistWishlist();
    updateWishlistCounters();
    if (typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("wishlist:changed", {
          detail: { items: [...wishlistItems], count: wishlistItems.length },
        }),
      );
    }
  }

  function hasWishlist(id) {
    return wishlistItems.some((item) => item.id === id);
  }

  function toggleWishlist(product) {
    if (!product || !product.id) return false;
    const index = wishlistItems.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      wishlistItems.splice(index, 1);
      emitWishlistChange();
      showToast(`Removed ${product.name || "item"} from wishlist.`, "info");
      return false;
    } else {
      wishlistItems.push({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        subtitle: product.subtitle || "",
        image: product.image || product.rootImage || "",
      });
      emitWishlistChange();
      showToast(`Saved ${product.name} to wishlist!`, "success");
      return true;
    }
  }

  function removeWishlist(id) {
    const prevLen = wishlistItems.length;
    wishlistItems = wishlistItems.filter((item) => item.id !== id);
    if (wishlistItems.length !== prevLen) {
      emitWishlistChange();
      showToast("Removed from wishlist.", "info");
      return true;
    }
    return false;
  }

  // --- Toast notification utility ---
  function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className =
        "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const isSuccess = type === "success";
    toast.className = `pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 ${
      isSuccess
        ? "bg-surface-2 border-accent/40 text-text"
        : "bg-surface border-border text-text"
    }`;

    const iconClass = isSuccess
      ? "fa-circle-check text-accent"
      : "fa-circle-info text-muted";
    toast.innerHTML = `
      <i class="fa-solid ${iconClass} text-lg shrink-0" aria-hidden="true"></i>
      <p class="text-sm font-medium flex-1">${message}</p>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
    });

    // Remove after 3s
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => {
        if (typeof toast.remove === "function") toast.remove();
      }, 300);
    }, 3200);
  }

  window.showToast = showToast;

  // --- Global Event Handlers ---
  document.addEventListener("DOMContentLoaded", () => {
    updateCartCounters();
    updateWishlistCounters();
  });

  document.addEventListener("click", (event) => {
    // Add to cart click
    const cartBtn = event.target.closest("[data-cart-add]");
    if (cartBtn) {
      event.preventDefault();
      const parent = cartBtn.closest("[data-cart-product]") || cartBtn;
      const id = parent.dataset.id;
      const name = parent.dataset.name;
      const price = parent.dataset.price;
      const subtitle = parent.dataset.subtitle || parent.dataset.desc;
      const image = parent.dataset.image;
      const qtyInput = parent.querySelector("[data-cart-quantity]");
      const qty = qtyInput
        ? Number(qtyInput.value)
        : Number(parent.dataset.qty) || 1;

      addCartItem({ id, name, price, subtitle, image, qty });

      if (cartBtn.dataset.cartRedirect) {
        window.location.href = cartBtn.dataset.cartRedirect;
      }
      return;
    }

    // Wishlist toggle click
    const wishlistBtn = event.target.closest("[data-wishlist-toggle]");
    if (wishlistBtn) {
      event.preventDefault();
      event.stopPropagation();
      const parent = wishlistBtn.closest("[data-cart-product]") || wishlistBtn;
      const id = wishlistBtn.dataset.productId || parent.dataset.id;
      const name = wishlistBtn.dataset.productName || parent.dataset.name;
      const price = wishlistBtn.dataset.productPrice || parent.dataset.price;
      const subtitle =
        wishlistBtn.dataset.productSubtitle || parent.dataset.subtitle;
      const image = wishlistBtn.dataset.productImage || parent.dataset.image;

      toggleWishlist({ id, name, price, subtitle, image });
      return;
    }
  });

  // Export to global window
  window.KeycapCart = {
    getItems: getCartItems,
    addItem: addCartItem,
    updateQty: updateCartQty,
    removeItem: removeCartItem,
    clear: clearCart,
    getCount: getCartCount,
    getSubtotal: getCartSubtotal,
    applyCoupon,
    removeCoupon,
    getCoupon: () => coupon,
    getCouponDiscountRate: () => (coupon ? COUPONS[coupon] || 0 : 0),
  };

  window.KeycapWishlist = {
    getItems: () => [...wishlistItems],
    has: hasWishlist,
    toggle: toggleWishlist,
    removeItem: removeWishlist,
    getCount: () => wishlistItems.length,
  };
})();
