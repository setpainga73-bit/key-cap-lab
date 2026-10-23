// Keycap Lab - Checkout & Order Confirmation
(() => {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  document.addEventListener("DOMContentLoaded", () => {
    initCheckout();
  });

  function initCheckout() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    const itemsContainer = document.getElementById("checkout-items-list");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountEl = document.getElementById("checkout-discount");
    const discountRow = document.getElementById("checkout-discount-row");
    const shippingEl = document.getElementById("checkout-shipping");
    const totalEl = document.getElementById("checkout-total");
    const confirmationModal = document.getElementById(
      "order-confirmation-modal",
    );
    const confirmOrderIdEl = document.getElementById("confirm-order-id");
    const confirmDateEl = document.getElementById("confirm-delivery-date");
    const confirmTotalEl = document.getElementById("confirm-total-amount");

    // Pre-fill user if demo session exists
    try {
      const demoUser = JSON.parse(
        localStorage.getItem("keycap-lab-demo-user") || "null",
      );
      if (demoUser && demoUser.email) {
        const emailInput = document.getElementById("checkout-email");
        if (emailInput && !emailInput.value) emailInput.value = demoUser.email;
        if (demoUser.name) {
          const parts = demoUser.name.split(" ");
          const firstInput = document.getElementById("checkout-first-name");
          const lastInput = document.getElementById("checkout-last-name");
          if (firstInput && !firstInput.value)
            firstInput.value = parts[0] || "";
          if (lastInput && !lastInput.value)
            lastInput.value = parts.slice(1).join(" ") || "";
        }
      }
    } catch {
      // ignore
    }

    function renderOrderSummary() {
      const items = window.KeycapCart.getItems();
      const subtotal = window.KeycapCart.getSubtotal();
      const discountRate = window.KeycapCart.getCouponDiscountRate();
      const discount = subtotal * discountRate;

      const shippingMethod =
        document.querySelector('input[name="shipping-method"]:checked')
          ?.value || "standard";
      const standardCost = subtotal >= 100 || subtotal === 0 ? 0 : 8;
      const expressCost = 18;
      const shipping =
        shippingMethod === "express" ? expressCost : standardCost;

      const total = Math.max(0, subtotal - discount + shipping);

      if (itemsContainer) {
        itemsContainer.innerHTML = "";
        if (items.length === 0) {
          itemsContainer.innerHTML = `
            <li class="py-4 text-center text-xs text-muted">
              Your cart is empty. <a href="./shop.html" class="text-accent underline">Browse products</a>
            </li>
          `;
        } else {
          items.forEach((item) => {
            const li = document.createElement("li");
            li.className =
              "flex items-center justify-between gap-3 text-xs text-muted";
            li.innerHTML = `
              <div class="flex items-center gap-2 min-w-0">
                <span class="font-medium text-text truncate">${item.name}</span>
                <span class="text-[11px] text-muted shrink-0">× ${item.qty}</span>
              </div>
              <strong class="text-text shrink-0">${currency.format(item.price * item.qty)}</strong>
            `;
            itemsContainer.appendChild(li);
          });
        }
      }

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

      if (shippingEl)
        shippingEl.textContent =
          shipping === 0 ? "Free" : currency.format(shipping);
      if (totalEl) totalEl.textContent = currency.format(total);

      const standardLabel = document.getElementById("standard-shipping-label");
      if (standardLabel) {
        standardLabel.textContent =
          standardCost === 0 ? "Free" : currency.format(standardCost);
      }
    }

    // Shipping method changes
    document
      .querySelectorAll('input[name="shipping-method"]')
      .forEach((radio) => {
        radio.addEventListener("change", renderOrderSummary);
      });

    // Formatting credit card input
    const cardInput = document.getElementById("checkout-card-number");
    if (cardInput) {
      cardInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 16);
        let formatted = value.match(/.{1,4}/g)?.join(" ") || "";
        e.target.value = formatted;
      });
    }

    // Formatting expiry date MM/YY
    const expiryInput = document.getElementById("checkout-card-expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (value.length > 2) {
          e.target.value = `${value.slice(0, 2)}/${value.slice(2)}`;
        } else {
          e.target.value = value;
        }
      });
    }

    // Formatting CVC
    const cvcInput = document.getElementById("checkout-card-cvc");
    if (cvcInput) {
      cvcInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
      });
    }

    // Validation
    function validateInput(input) {
      const errorMsg = document.getElementById(`${input.id}-error`);
      let isValid = true;
      let message = "";

      const val = input.value.trim();

      if (input.required && !val) {
        isValid = false;
        message = "This field is required.";
      } else if (input.type === "email" && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          isValid = false;
          message = "Please enter a valid email address.";
        }
      } else if (input.id === "checkout-card-number" && val) {
        const digits = val.replace(/\s/g, "");
        if (digits.length < 15 || digits.length > 16) {
          isValid = false;
          message = "Enter a valid 15 or 16-digit card number.";
        }
      } else if (input.id === "checkout-card-expiry" && val) {
        const match = val.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
        if (!match) {
          isValid = false;
          message = "Use MM/YY format.";
        }
      } else if (input.id === "checkout-card-cvc" && val) {
        if (val.length < 3) {
          isValid = false;
          message = "Enter 3 or 4 digit CVC.";
        }
      }

      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.toggle("hidden", isValid);
      }
      input.classList.toggle("border-red-500", !isValid);
      input.classList.toggle("border-border", isValid);
      input.setAttribute("aria-invalid", String(!isValid));

      return isValid;
    }

    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("blur", () => validateInput(input));
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") {
          validateInput(input);
        }
      });
    });

    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const items = window.KeycapCart.getItems();
      if (items.length === 0) {
        window.showToast(
          "Your cart is empty. Please add items before checking out.",
          "info",
        );
        return;
      }

      let formIsValid = true;
      let firstInvalidInput = null;

      form.querySelectorAll("input").forEach((input) => {
        if (!validateInput(input)) {
          formIsValid = false;
          if (!firstInvalidInput) firstInvalidInput = input;
        }
      });

      if (!formIsValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      // Successful demo checkout
      const randomId = `KL-${Math.floor(1000 + Math.random() * 9000)}`;
      const subtotal = window.KeycapCart.getSubtotal();
      const discountRate = window.KeycapCart.getCouponDiscountRate();
      const discount = subtotal * discountRate;
      const shippingMethod =
        document.querySelector('input[name="shipping-method"]:checked')
          ?.value || "standard";
      const shippingCost =
        shippingMethod === "express" ? 18 : subtotal >= 100 ? 0 : 8;
      const orderTotal = subtotal - discount + shippingCost;

      // Save order to account history
      try {
        const orders = JSON.parse(
          localStorage.getItem("keycap-lab-orders") || "[]",
        );
        const newOrder = {
          id: randomId,
          date: new Date().toISOString().split("T")[0],
          status: "Processing",
          totalCents: Math.round(orderTotal * 100),
          items: [...items],
          steps: [
            {
              label: "Placed",
              date: new Date().toISOString().split("T")[0],
              done: true,
            },
            { label: "Packed", date: "Upcoming", done: false },
            { label: "Shipped", date: "Upcoming", done: false },
            {
              label: "Delivered",
              date: "Estimated 3-5 business days",
              done: false,
              estimated: true,
            },
          ],
        };
        orders.unshift(newOrder);
        localStorage.setItem("keycap-lab-orders", JSON.stringify(orders));
        localStorage.setItem("keycap-lab-authenticated", "true");
      } catch {
        // ignore
      }

      // Clear cart
      window.KeycapCart.clear();

      // Show confirmation modal
      if (confirmOrderIdEl) confirmOrderIdEl.textContent = randomId;
      if (confirmTotalEl)
        confirmTotalEl.textContent = currency.format(orderTotal);
      if (confirmDateEl) {
        const d = new Date();
        d.setDate(d.getDate() + 4);
        confirmDateEl.textContent = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (confirmationModal) {
        confirmationModal.classList.remove("hidden");
        confirmationModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
      }
    });

    renderOrderSummary();
    window.addEventListener("cart:changed", renderOrderSummary);
  }
})();
