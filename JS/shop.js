// Keycap Lab - Shop Page Functionality
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    initShop();
  });

  function initShop() {
    const products = window.KeycapProducts || [];
    const grid = document.getElementById("product-grid");
    const countEl = document.getElementById("shop-result-count");
    const emptyState = document.getElementById("empty-results");
    const searchInput = document.getElementById("shop-search-input");
    const sortSelect = document.getElementById("shop-sort");
    const activeFiltersContainer = document.getElementById("active-filters");
    const clearAllBtn = document.getElementById("clear-all-filters");
    const priceRangeInput = document.getElementById("max-price-range");
    const priceDisplay = document.getElementById("price-range-display");

    // Mobile filter drawer elements
    const mobileFilterToggle = document.getElementById("mobile-filter-toggle");
    const mobileFilterDrawer = document.getElementById("mobile-filter-drawer");
    const mobileFilterBackdrop = document.getElementById(
      "mobile-filter-backdrop",
    );
    const mobileFilterClose = document.getElementById("mobile-filter-close");
    const mobileFilterApply = document.getElementById("mobile-filter-apply");

    // State
    const state = {
      search: "",
      category: "all",
      layouts: [],
      maxPrice: 250,
      sort: "featured",
    };

    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("search")) {
      state.search = urlParams.get("search");
      if (searchInput) searchInput.value = state.search;
    }
    if (urlParams.has("category")) {
      state.category = urlParams.get("category");
    }
    if (urlParams.has("layout")) {
      const layoutParam = urlParams.get("layout").toLowerCase();
      state.layouts = [layoutParam];
    }
    if (window.location.hash === "#bundles") {
      state.category = "kits";
    }

    // Sync form inputs with state
    syncInputsFromState();

    function syncInputsFromState() {
      // Category radios/checkboxes
      document.querySelectorAll('input[name="category"]').forEach((input) => {
        input.checked = input.value === state.category;
      });
      // Layout checkboxes
      document.querySelectorAll('input[name="layout"]').forEach((input) => {
        input.checked = state.layouts.includes(input.value.toLowerCase());
      });
      // Price
      if (priceRangeInput) {
        priceRangeInput.value = state.maxPrice;
        if (priceDisplay) priceDisplay.textContent = `$${state.maxPrice}`;
      }
      // Sort
      if (sortSelect) {
        sortSelect.value = state.sort;
      }
    }

    function renderActiveFilterPills() {
      if (!activeFiltersContainer) return;
      activeFiltersContainer.innerHTML = "";
      let hasFilters = false;

      if (state.search) {
        hasFilters = true;
        createPill(`Search: "${state.search}"`, () => {
          state.search = "";
          if (searchInput) searchInput.value = "";
          updateView();
        });
      }

      if (state.category !== "all") {
        hasFilters = true;
        const catName =
          state.category === "kits"
            ? "Preset Kits"
            : state.category.charAt(0).toUpperCase() + state.category.slice(1);
        createPill(catName, () => {
          state.category = "all";
          syncInputsFromState();
          updateView();
        });
      }

      state.layouts.forEach((layout) => {
        hasFilters = true;
        createPill(layout === "tkl" ? "TKL" : `${layout}%`, () => {
          state.layouts = state.layouts.filter((l) => l !== layout);
          syncInputsFromState();
          updateView();
        });
      });

      if (state.maxPrice < 250) {
        hasFilters = true;
        createPill(`Under $${state.maxPrice}`, () => {
          state.maxPrice = 250;
          syncInputsFromState();
          updateView();
        });
      }

      if (clearAllBtn) {
        clearAllBtn.classList.toggle("hidden", !hasFilters);
      }
    }

    function createPill(text, onRemove) {
      const pill = document.createElement("span");
      pill.className =
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-2 border border-border text-text";
      pill.innerHTML = `
        ${text}
        <button type="button" class="text-muted hover:text-text cursor-pointer p-0.5" aria-label="Remove filter ${text}">
          <i class="fa-solid fa-xmark text-[10px]" aria-hidden="true"></i>
        </button>
      `;
      pill.querySelector("button").addEventListener("click", onRemove);
      activeFiltersContainer.appendChild(pill);
    }

    function getFilteredProducts() {
      return products.filter((product) => {
        // Search
        if (state.search) {
          const q = state.search.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchSub = product.subtitle.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchSub && !matchDesc) return false;
        }

        // Category
        if (state.category !== "all") {
          if (product.category !== state.category) return false;
        }

        // Layout
        if (state.layouts.length > 0) {
          if (
            product.layout !== "all" &&
            !state.layouts.includes(product.layout)
          ) {
            return false;
          }
        }

        // Price
        if (product.price > state.maxPrice) {
          return false;
        }

        return true;
      });
    }

    function sortProducts(list) {
      const sorted = [...list];
      switch (state.sort) {
        case "price-asc":
          return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
          return sorted.sort((a, b) => b.price - a.price);
        case "name-asc":
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "name-desc":
          return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case "rating-desc":
          return sorted.sort((a, b) => b.rating - a.rating);
        default:
          return sorted; // featured default order
      }
    }

    function renderProductCard(product) {
      const isFavorited = window.KeycapWishlist
        ? window.KeycapWishlist.has(product.id)
        : false;
      const isKit = product.category === "kits";
      const detailHref = `./Product_Detail.html?id=${encodeURIComponent(product.id)}`;

      const article = document.createElement("article");
      article.className =
        "group relative flex flex-col justify-between p-4 bg-surface rounded-xl border border-border hover:border-muted transition-colors duration-200";
      article.dataset.cartProduct = "true";
      article.dataset.id = product.id;
      article.dataset.name = product.name;
      article.dataset.price = product.price;
      article.dataset.subtitle = product.subtitle;
      article.dataset.image = product.image;

      article.innerHTML = `
        <div class="relative w-full h-48 rounded-lg overflow-hidden bg-surface-2 mb-4">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          ${
            product.badge
              ? `<span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-bg/85 border border-border text-accent backdrop-blur-xs">${product.badge}</span>`
              : ""
          }
          <button
            type="button"
            class="absolute top-2.5 right-2.5 p-2 rounded-full bg-bg/80 border border-border text-muted hover:text-accent hover:border-accent transition-colors cursor-pointer z-10"
            data-wishlist-toggle="true"
            data-product-id="${product.id}"
            data-product-name="${product.name}"
            data-product-price="${product.price}"
            data-product-subtitle="${product.subtitle}"
            data-product-image="${product.image}"
            aria-label="Save ${product.name} to wishlist"
            aria-pressed="${isFavorited}"
          >
            <i class="${isFavorited ? "fa-solid text-accent" : "fa-regular"} fa-heart text-sm" aria-hidden="true"></i>
          </button>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="flex items-center gap-1.5 mb-1 text-xs text-muted">
            <span class="text-accent flex items-center gap-1">
              <i class="fa-solid fa-star text-[10px]" aria-hidden="true"></i>
              <span class="font-semibold text-text">${product.rating}</span>
            </span>
            <span>(${product.reviewsCount})</span>
            <span class="mx-1">•</span>
            <span class="uppercase tracking-wider font-medium">${product.category}</span>
          </div>

          <h3 class="font-display font-medium text-base text-text group-hover:text-accent transition-colors">
            <a href="${detailHref}" class="after:absolute after:inset-0 after:z-0">
              ${product.name}
            </a>
          </h3>
          <p class="text-xs text-muted mt-1 mb-4 line-clamp-1">${product.subtitle}</p>
        </div>

        <div class="relative z-10 flex items-center justify-between pt-3 border-t border-border mt-auto">
          <span class="font-display font-bold text-lg text-accent">$${product.price}</span>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-2 hover:bg-accent hover:text-on-accent text-text border border-border hover:border-accent transition-colors cursor-pointer"
            data-cart-add="true"
            aria-label="Add ${product.name} to cart"
          >
            <i class="fa-solid fa-plus text-[10px]" aria-hidden="true"></i>
            Add
          </button>
        </div>
      `;

      return article;
    }

    function updateView() {
      renderActiveFilterPills();
      const filtered = getFilteredProducts();
      const sorted = sortProducts(filtered);

      if (countEl) {
        countEl.textContent = `${sorted.length} ${sorted.length === 1 ? "result" : "results"}`;
      }

      if (grid) {
        grid.innerHTML = "";
        if (sorted.length === 0) {
          if (emptyState) emptyState.classList.remove("hidden");
        } else {
          if (emptyState) emptyState.classList.add("hidden");
          sorted.forEach((prod) => {
            grid.appendChild(renderProductCard(prod));
          });
        }
      }
    }

    // Event listeners
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.search = e.target.value.trim();
        updateView();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        state.sort = e.target.value;
        updateView();
      });
    }

    document.querySelectorAll('input[name="category"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        if (e.target.checked) {
          state.category = e.target.value;
          updateView();
        }
      });
    });

    document.querySelectorAll('input[name="layout"]').forEach((input) => {
      input.addEventListener("change", () => {
        const checked = [
          ...document.querySelectorAll('input[name="layout"]:checked'),
        ].map((i) => i.value.toLowerCase());
        state.layouts = checked;
        updateView();
      });
    });

    if (priceRangeInput) {
      priceRangeInput.addEventListener("input", (e) => {
        state.maxPrice = Number(e.target.value);
        if (priceDisplay) priceDisplay.textContent = `$${state.maxPrice}`;
        updateView();
      });
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        resetFilters();
      });
    }

    const resetEmptyBtn = document.getElementById("empty-reset-btn");
    if (resetEmptyBtn) {
      resetEmptyBtn.addEventListener("click", () => {
        resetFilters();
      });
    }

    function resetFilters() {
      state.search = "";
      state.category = "all";
      state.layouts = [];
      state.maxPrice = 250;
      if (searchInput) searchInput.value = "";
      syncInputsFromState();
      updateView();
    }

    // Mobile filter drawer controls
    function openMobileFilter() {
      if (!mobileFilterDrawer) return;
      mobileFilterDrawer.classList.remove("translate-x-full");
      mobileFilterDrawer.classList.add("translate-x-0");
      if (mobileFilterBackdrop) {
        mobileFilterBackdrop.classList.remove(
          "opacity-0",
          "pointer-events-none",
        );
        mobileFilterBackdrop.classList.add(
          "opacity-100",
          "pointer-events-auto",
        );
      }
      document.body.classList.add("overflow-hidden");
    }

    function closeMobileFilter() {
      if (!mobileFilterDrawer) return;
      mobileFilterDrawer.classList.remove("translate-x-0");
      mobileFilterDrawer.classList.add("translate-x-full");
      if (mobileFilterBackdrop) {
        mobileFilterBackdrop.classList.remove(
          "opacity-100",
          "pointer-events-auto",
        );
        mobileFilterBackdrop.classList.add("opacity-0", "pointer-events-none");
      }
      document.body.classList.remove("overflow-hidden");
    }

    if (mobileFilterToggle)
      mobileFilterToggle.addEventListener("click", openMobileFilter);
    if (mobileFilterClose)
      mobileFilterClose.addEventListener("click", closeMobileFilter);
    if (mobileFilterBackdrop)
      mobileFilterBackdrop.addEventListener("click", closeMobileFilter);
    if (mobileFilterApply) {
      mobileFilterApply.addEventListener("click", () => {
        closeMobileFilter();
        updateView();
      });
    }

    // Initial render
    updateView();
  }
})();
