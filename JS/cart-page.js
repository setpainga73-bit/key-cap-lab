// Keycap Lab - Cart Page Controller
(() => {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  document.addEventListener("DOMContentLoaded", () => {
    initCartPage();
  });

  function initCartPage() {
    const itemList = document.getElementById("cart-items-container");
    const emptyState = document.getElementById("cart-empty-state");
    const fullState = document.getElementById("cart-full-state");
    const itemCountEl = document.getElementById("cart-total-items");
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountRow = document.getElementById("cart-discount-row");
    const discountEl = document.getElementById("cart-discount");
    const shippingEl = document.getElementById("cart-shipping");
    const totalEl = document.getElementById("cart-total");
    const shippingMsg = document.getElementById("cart-shipping-message");
    const shippingProgress = document.getElementById("cart-shipping-progress");
    const checkoutBtn = document.getElementById("cart-checkout-btn");

    const couponForm = document.getElementById("cart-coupon-form");
    const couponInput = document.getElementById("cart-coupon-input");
    const couponAppliedRow = document.getElementById("cart-coupon-applied");
    const couponNameEl = document.getElementById("cart-coupon-name");
    const removeCouponBtn = document.getElementById("cart-remove-coupon");

    function render() {
      const items = window.KeycapCart.getItems();
      const subtotal = window.KeycapCart.getSubtotal();
      const count = window.KeycapCart.getCount();
      const couponCode = window.KeycapCart.getCoupon();
      const discountRate = window.KeycapCart.getCouponDiscountRate();
      const discount = subtotal * discountRate;
      const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8;
      const finalTotal = Math.max(0, subtotal - discount + shipping);

      if (itemCountEl)
        itemCountEl.textContent = `(${count} ${count === 1 ? "item" : "items"})`;

      if (items.length === 0) {
        if (fullState) fullState.classList.add("hidden");
        if (emptyState) emptyState.classList.remove("hidden");
        return;
      }

      if (fullState) fullState.classList.remove("hidden");
      if (emptyState) emptyState.classList.add("hidden");

      // Render items
      if (itemList) {
        itemList.innerHTML = "";
        items.forEach((item) => {
          const itemCard = document.createElement("article");
          itemCard.className =
            "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border hover:border-muted/50 transition-colors";

          const hasParts = Array.isArray(item.parts) && item.parts.length > 0;
          const partsPanelId = `parts-${item.id}`;

          itemCard.innerHTML = `
            <div class="flex items-start sm:items-center gap-4 flex-1 min-w-0">
              <div class="w-20 h-20 rounded-lg overflow-hidden bg-surface-2 shrink-0 border border-border flex items-center justify-center">
                ${
                  item.image
                    ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />`
                    : `<i class="fa-solid fa-keyboard text-2xl text-muted" aria-hidden="true"></i>`
                }
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-display font-medium text-base text-text truncate">${item.name}</h3>
                <p class="text-xs text-muted mb-2 line-clamp-1">${item.desc}</p>
                <div class="flex flex-wrap items-center gap-4">
                  <div class="inline-flex items-center rounded-lg border border-border bg-surface-2">
                    <button
                      type="button"
                      class="px-2.5 py-1 text-muted hover:text-text cursor-pointer transition-colors"
                      data-cart-qty-delta="-1"
                      data-item-id="${item.id}"
                      aria-label="Decrease quantity"
                    >
                      <i class="fa-solid fa-minus text-[10px]" aria-hidden="true"></i>
                    </button>
                    <span class="px-2 text-xs font-semibold text-text min-w-[20px] text-center">${item.qty}</span>
                    <button
                      type="button"
                      class="px-2.5 py-1 text-muted hover:text-text cursor-pointer transition-colors"
                      data-cart-qty-delta="1"
                      data-item-id="${item.id}"
                      aria-label="Increase quantity"
                    >
                      <i class="fa-solid fa-plus text-[10px]" aria-hidden="true"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    class="text-xs text-muted hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                    data-cart-remove-id="${item.id}"
                    aria-label="Remove ${item.name} from cart"
                  >
                    <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
                    <span>Remove</span>
                  </button>
                </div>
                ${
                  hasParts
                    ? `
                  <div class="mt-2.5">
                    <button
                      type="button"
                      class="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                      data-parts-toggle="${partsPanelId}"
                      aria-expanded="false"
                      aria-controls="${partsPanelId}"
                    >
                      <span>Included parts (${item.parts.length})</span>
                      <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200" aria-hidden="true"></i>
                    </button>
                    <ul id="${partsPanelId}" class="hidden mt-1.5 pl-3 border-l-2 border-border space-y-1 text-xs text-muted">
                      ${item.parts.map((p) => `<li>• ${typeof p === "string" ? p : p.name}</li>`).join("")}
                    </ul>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
            <div class="sm:text-right shrink-0">
              <span class="block text-xs text-muted">Item price: ${currency.format(item.price)}</span>
              <strong class="font-display font-bold text-lg text-accent">${currency.format(item.price * item.qty)}</strong>
            </div>
          `;

          itemList.appendChild(itemCard);
        });
      }

      // Order calculations
      if (subtotalEl) subtotalEl.textContent = currency.format(subtotal);

      if (discountRow) {
        if (discount > 0) {
          discountRow.classList.remove("hidden");
          if (discountEl)
            discountEl.textContent = `-${currency.format(discount)}`;
        } else {
          discountRow.classList.add("hidden");
        }
      }

      if (shippingEl) {
        shippingEl.textContent =
          shipping === 0 ? "Free" : currency.format(shipping);
      }

      if (totalEl) totalEl.textContent = currency.format(finalTotal);

      // Shipping progress
      const progressPercent = Math.min(100, Math.round((subtotal / 100) * 100));
      if (shippingProgress) {
        shippingProgress.className =
          "h-full bg-accent transition-all duration-300";
        if (progressPercent >= 100) {
          shippingProgress.classList.add("w-full");
        } else if (progressPercent >= 75) {
          shippingProgress.classList.add("w-3/4");
        } else if (progressPercent >= 50) {
          shippingProgress.classList.add("w-1/2");
        } else if (progressPercent >= 25) {
          shippingProgress.classList.add("w-1/4");
        } else if (progressPercent > 0) {
          shippingProgress.classList.add("w-1/6");
        } else {
          shippingProgress.classList.add("w-0");
        }
      }
      if (shippingMsg) {
        shippingMsg.textContent =
          subtotal >= 100
            ? "You've unlocked Free Express Shipping!"
            : `Add ${currency.format(100 - subtotal)} more to qualify for Free Shipping.`;
      }

      // Coupon banner
      if (couponAppliedRow) {
        if (couponCode) {
          couponAppliedRow.classList.remove("hidden");
          if (couponNameEl)
            couponNameEl.textContent = `${couponCode} (-${discountRate * 100}%)`;
        } else {
          couponAppliedRow.classList.add("hidden");
        }
      }
    }

    // Event delegation for item controls
    if (itemList) {
      itemList.addEventListener("click", (e) => {
        // Delta quantity
        const deltaBtn = e.target.closest("[data-cart-qty-delta]");
        if (deltaBtn) {
          const id = deltaBtn.dataset.itemId;
          const delta = parseInt(deltaBtn.dataset.cartQtyDelta, 10);
          const currentItem = window.KeycapCart.getItems().find(
            (i) => i.id === id,
          );
          if (currentItem) {
            window.KeycapCart.updateQty(id, currentItem.qty + delta);
          }
          return;
        }

        // Remove item
        const removeBtn = e.target.closest("[data-cart-remove-id]");
        if (removeBtn) {
          const id = removeBtn.dataset.cartRemoveId;
          window.KeycapCart.removeItem(id);
          return;
        }

        // Toggle parts dropdown
        const partsToggle = e.target.closest("[data-parts-toggle]");
        if (partsToggle) {
          const targetId = partsToggle.dataset.partsToggle;
          const list = document.getElementById(targetId);
          const chevron = partsToggle.querySelector("i");
          if (list) {
            const isHidden = list.classList.contains("hidden");
            list.classList.toggle("hidden", !isHidden);
            partsToggle.setAttribute("aria-expanded", String(isHidden));
            if (chevron) {
              chevron.classList.toggle("rotate-180", isHidden);
            }
          }
        }
      });
    }

    // Coupon form
    if (couponForm) {
      couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = couponInput?.value.trim();
        if (code) {
          const res = window.KeycapCart.applyCoupon(code);
          if (res.ok && couponInput) couponInput.value = "";
        }
      });
    }

    if (removeCouponBtn) {
      removeCouponBtn.addEventListener("click", () => {
        window.KeycapCart.removeCoupon();
      });
    }

    // Checkout button
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (window.KeycapCart.getItems().length > 0) {
          window.location.href = "./checkout.html";
        }
      });
    }

    window.addEventListener("cart:changed", render);
    render();
  }
})();
