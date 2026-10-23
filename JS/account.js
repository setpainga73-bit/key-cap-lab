// Keycap Lab - Account Dashboard Controller
(() => {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const defaultOrders = [
    {
      id: "KL-1042",
      date: "2026-09-29",
      status: "Shipped",
      totalCents: 35820,
      items: [{ name: "Custom 65% Build", qty: 1, price: 358.2 }],
      steps: [
        { label: "Placed", date: "Sep 29, 2026", done: true },
        { label: "Packed", date: "Sep 30, 2026", done: true },
        { label: "Shipped", date: "Oct 01, 2026", done: true },
        {
          label: "Delivered",
          date: "Est. Oct 05, 2026",
          done: false,
          estimated: true,
        },
      ],
    },
    {
      id: "KL-0988",
      date: "2026-09-12",
      status: "Delivered",
      totalCents: 12900,
      items: [{ name: "Starter 65% Kit", qty: 1, price: 129.0 }],
      steps: [
        { label: "Placed", date: "Sep 12, 2026", done: true },
        { label: "Packed", date: "Sep 13, 2026", done: true },
        { label: "Shipped", date: "Sep 14, 2026", done: true },
        { label: "Delivered", date: "Sep 16, 2026", done: true },
      ],
    },
    {
      id: "KL-0871",
      date: "2026-08-21",
      status: "Delivered",
      totalCents: 6400,
      items: [
        { name: "Gateron Oil King Linear (70x)", qty: 1, price: 45.0 },
        { name: "Keycap Lab Desk Mat", qty: 1, price: 19.0 },
      ],
      steps: [
        { label: "Placed", date: "Aug 21, 2026", done: true },
        { label: "Packed", date: "Aug 22, 2026", done: true },
        { label: "Shipped", date: "Aug 23, 2026", done: true },
        { label: "Delivered", date: "Aug 25, 2026", done: true },
      ],
    },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    initAccount();
  });

  function initAccount() {
    const isAuth = localStorage.getItem("keycap-lab-authenticated") === "true";
    if (!isAuth) {
      window.location.replace("./Login.html");
      return;
    }

    // User Profile
    let demoUser = { name: "Demo Enthusiast", email: "builder@keycaplab.demo" };
    try {
      const stored = JSON.parse(
        localStorage.getItem("keycap-lab-demo-user") || "null",
      );
      if (stored) {
        if (stored.name) demoUser.name = stored.name;
        if (stored.email) demoUser.email = stored.email;
      }
    } catch {
      // ignore
    }

    const userNameEl = document.getElementById("account-user-name");
    const userEmailEl = document.getElementById("account-user-email");
    const userAvatarEl = document.getElementById("account-user-avatar");
    if (userNameEl) userNameEl.textContent = demoUser.name;
    if (userEmailEl) userEmailEl.textContent = demoUser.email;
    if (userAvatarEl && demoUser.name) {
      userAvatarEl.textContent = demoUser.name.charAt(0).toUpperCase();
    }

    // Orders state
    let orders = [...defaultOrders];
    try {
      const userOrders = JSON.parse(
        localStorage.getItem("keycap-lab-orders") || "[]",
      );
      if (Array.isArray(userOrders) && userOrders.length > 0) {
        orders = [...userOrders, ...defaultOrders];
      }
    } catch {
      // ignore
    }

    // Saved builds
    let savedBuilds = [];
    try {
      savedBuilds = JSON.parse(
        localStorage.getItem("keycap-lab-saved-builds") || "[]",
      );
    } catch {
      savedBuilds = [];
    }

    // Wishlist items
    const wishlistItems = window.KeycapWishlist
      ? window.KeycapWishlist.getItems()
      : [];

    // Stats
    const statOrders = document.getElementById("stat-orders-count");
    const statBuilds = document.getElementById("stat-builds-count");
    const statWishlist = document.getElementById("stat-wishlist-count");
    if (statOrders) statOrders.textContent = String(orders.length);
    if (statBuilds) statBuilds.textContent = String(savedBuilds.length);
    if (statWishlist) statWishlist.textContent = String(wishlistItems.length);

    // Render Orders
    renderOrders(orders);

    // Render Saved Builds
    renderSavedBuilds(savedBuilds);

    // Render Wishlist
    renderWishlist(wishlistItems);

    // Tabs functionality
    initTabs();

    // Logout
    const logoutBtn = document.getElementById("account-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("keycap-lab-authenticated");
        window.location.replace("./Login.html");
      });
    }

    // Tracking modal close
    const trackingModal = document.getElementById("tracking-modal");
    const trackingClose = document.getElementById("tracking-modal-close");
    const trackingBackdrop = document.getElementById("tracking-modal-backdrop");
    if (trackingClose && trackingModal) {
      trackingClose.addEventListener("click", () =>
        trackingModal.classList.add("hidden"),
      );
    }
    if (trackingBackdrop && trackingModal) {
      trackingBackdrop.addEventListener("click", () =>
        trackingModal.classList.add("hidden"),
      );
    }
  }

  function renderOrders(orders) {
    const tableBody = document.getElementById("account-orders-tbody");
    const mobileCards = document.getElementById("account-orders-mobile");

    if (tableBody) {
      tableBody.innerHTML = "";
      orders.forEach((order) => {
        const tr = document.createElement("tr");
        tr.className =
          "border-b border-border/50 hover:bg-surface-2/40 transition-colors";

        const isShipped = order.status === "Shipped";
        const isDelivered = order.status === "Delivered";
        const statusBadgeClass = isShipped
          ? "bg-amber-500/10 text-accent border border-accent/30"
          : isDelivered
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            : "bg-blue-500/10 text-blue-400 border border-blue-500/30";

        tr.innerHTML = `
          <td class="py-4 px-4 font-bold text-text">${order.id}</td>
          <td class="py-4 px-4 text-muted">${order.date}</td>
          <td class="py-4 px-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass}">
              ${order.status}
            </span>
          </td>
          <td class="py-4 px-4 font-semibold text-text">${currency.format(order.totalCents / 100)}</td>
          <td class="py-4 px-4 text-right">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:border-accent text-text hover:text-accent transition-colors cursor-pointer"
              data-track-order="${order.id}"
            >
              Track Order
            </button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (mobileCards) {
      mobileCards.innerHTML = "";
      orders.forEach((order) => {
        const card = document.createElement("div");
        card.className =
          "p-4 rounded-xl bg-surface border border-border flex flex-col gap-3";
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <strong class="font-display font-bold text-base text-text">${order.id}</strong>
            <span class="text-xs px-2 py-0.5 rounded-full bg-surface-2 border border-border text-accent font-semibold">${order.status}</span>
          </div>
          <div class="flex items-center justify-between text-xs text-muted">
            <span>Date: ${order.date}</span>
            <span class="font-bold text-text">${currency.format(order.totalCents / 100)}</span>
          </div>
          <button
            type="button"
            class="w-full py-2 rounded-lg text-xs font-semibold border border-border hover:border-accent text-text hover:text-accent transition-colors cursor-pointer text-center"
            data-track-order="${order.id}"
          >
            Track Order
          </button>
        `;
        mobileCards.appendChild(card);
      });
    }

    // Attach tracking listener
    document.querySelectorAll("[data-track-order]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.dataset.trackOrder;
        const ord = orders.find((o) => o.id === orderId);
        if (ord) showOrderTracking(ord);
      });
    });
  }

  function showOrderTracking(order) {
    const modal = document.getElementById("tracking-modal");
    const titleEl = document.getElementById("tracking-order-title");
    const statusEl = document.getElementById("tracking-order-status");
    const stepsContainer = document.getElementById("tracking-steps-container");

    if (!modal) return;

    if (titleEl) titleEl.textContent = `Tracking Order: ${order.id}`;
    if (statusEl) statusEl.textContent = `Status: ${order.status}`;

    if (stepsContainer && Array.isArray(order.steps)) {
      stepsContainer.innerHTML = "";
      order.steps.forEach((step, idx) => {
        const isDone = step.done;
        const stepDiv = document.createElement("div");
        stepDiv.className = "flex items-start gap-4 relative";

        stepDiv.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              isDone
                ? "bg-accent text-on-accent"
                : "bg-surface-2 border border-border text-muted"
            }">
              ${isDone ? "✓" : idx + 1}
            </div>
            ${
              idx < order.steps.length - 1
                ? `<div class="w-0.5 h-12 ${isDone && order.steps[idx + 1]?.done ? "bg-accent" : "bg-border"} my-1"></div>`
                : ""
            }
          </div>
          <div class="pt-1">
            <h4 class="text-sm font-semibold text-text">${step.label}</h4>
            <p class="text-xs text-muted">${step.date}</p>
          </div>
        `;
        stepsContainer.appendChild(stepDiv);
      });
    }

    modal.classList.remove("hidden");
  }

  function renderSavedBuilds(builds) {
    const container = document.getElementById("account-builds-list");
    const emptyEl = document.getElementById("account-builds-empty");
    if (!container) return;

    if (builds.length === 0) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      container.classList.add("hidden");
      return;
    }

    if (emptyEl) emptyEl.classList.add("hidden");
    container.classList.remove("hidden");
    container.innerHTML = "";

    builds.forEach((build) => {
      const card = document.createElement("div");
      card.className =
        "p-5 rounded-xl bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-4";

      const partsSummary = Object.entries(build.selections || {})
        .filter(([_, v]) => v && v.name)
        .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.name}`)
        .join(" • ");

      card.innerHTML = `
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-display font-semibold text-base text-text">${build.name || "Custom Build"}</h4>
            <span class="text-xs text-muted">(${new Date(build.date).toLocaleDateString()})</span>
          </div>
          <p class="text-xs text-muted line-clamp-1 mb-2">${partsSummary}</p>
          <strong class="font-display font-bold text-accent text-lg">${currency.format(build.total || 0)}</strong>
        </div>
        <div class="flex items-center gap-3">
          <a
            href="./Builder.html"
            class="px-4 py-2 rounded-lg text-xs font-semibold bg-surface-2 hover:bg-surface border border-border hover:border-muted text-text transition-colors"
          >
            Edit in Builder
          </a>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold bg-accent hover:bg-accent-hover text-on-accent transition-colors cursor-pointer"
            data-cart-saved-build="${build.id}"
          >
            Add to Cart
          </button>
        </div>
      `;

      card
        .querySelector("[data-cart-saved-build]")
        .addEventListener("click", () => {
          window.KeycapCart.addItem({
            id: build.id,
            name: build.name,
            desc: partsSummary,
            price: build.total || 150,
            qty: 1,
            image: "./IMG/hero-keyboard.webp",
          });
        });

      container.appendChild(card);
    });
  }

  function renderWishlist(items) {
    const container = document.getElementById("account-wishlist-grid");
    const emptyEl = document.getElementById("account-wishlist-empty");
    if (!container) return;

    if (items.length === 0) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      container.classList.add("hidden");
      return;
    }

    if (emptyEl) emptyEl.classList.add("hidden");
    container.classList.remove("hidden");
    container.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className =
        "flex flex-col justify-between p-4 rounded-xl bg-surface border border-border hover:border-muted transition-colors";
      card.innerHTML = `
        <div class="relative w-full h-36 rounded-lg overflow-hidden bg-surface-2 mb-3">
          ${
            item.image
              ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />`
              : `<div class="w-full h-full flex items-center justify-center text-muted"><i class="fa-solid fa-keyboard text-2xl"></i></div>`
          }
          <button
            type="button"
            class="absolute top-2 right-2 p-1.5 rounded-full bg-bg/80 border border-border text-accent hover:text-red-400 cursor-pointer"
            data-remove-wishlist="${item.id}"
            aria-label="Remove from wishlist"
          >
            <i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
          </button>
        </div>
        <h4 class="font-display font-medium text-sm text-text mb-1">
          <a href="./Product_Detail.html?id=${item.id}" class="hover:text-accent transition-colors">${item.name}</a>
        </h4>
        <span class="font-display font-bold text-accent text-sm mb-3">${currency.format(item.price || 0)}</span>
        <button
          type="button"
          class="w-full py-2 rounded-lg text-xs font-semibold bg-surface-2 hover:bg-accent hover:text-on-accent text-text border border-border hover:border-accent transition-colors cursor-pointer"
          data-wishlist-add-cart="${item.id}"
        >
          Add to Cart
        </button>
      `;

      card
        .querySelector("[data-remove-wishlist]")
        .addEventListener("click", () => {
          window.KeycapWishlist.removeItem(item.id);
          renderWishlist(window.KeycapWishlist.getItems());
          const statWishlist = document.getElementById("stat-wishlist-count");
          if (statWishlist)
            statWishlist.textContent = String(window.KeycapWishlist.getCount());
        });

      card
        .querySelector("[data-wishlist-add-cart]")
        .addEventListener("click", () => {
          window.KeycapCart.addItem({
            id: item.id,
            name: item.name,
            desc: item.subtitle || "",
            price: item.price || 0,
            qty: 1,
            image: item.image,
          });
        });

      container.appendChild(card);
    });
  }

  function initTabs() {
    const tabButtons = document.querySelectorAll("[data-account-tab]");
    const panels = document.querySelectorAll("[data-account-panel]");

    function activateTab(tabId) {
      tabButtons.forEach((btn) => {
        const isActive = btn.dataset.accountTab === tabId;
        if (isActive) {
          btn.className =
            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface-2 text-accent border border-accent/30 transition-colors w-full text-left";
          btn.setAttribute("aria-current", "page");
        } else {
          btn.className =
            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-text hover:bg-surface-2/50 border border-transparent transition-colors w-full text-left";
          btn.removeAttribute("aria-current");
        }
      });

      panels.forEach((p) => {
        p.classList.toggle("hidden", p.dataset.accountPanel !== tabId);
      });
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        activateTab(btn.dataset.accountTab);
        if (window.history.pushState) {
          window.history.pushState(null, "", `#${btn.dataset.accountTab}`);
        }
      });
    });

    // Check hash
    const initialHash = window.location.hash.replace("#", "") || "orders";
    activateTab(initialHash);

    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "orders";
      activateTab(hash);
    });
  }
})();
