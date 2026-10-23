// Keycap Lab - Product Detail Page
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    initProductDetail();
  });

  function initProductDetail() {
    const products = window.KeycapProducts || [];
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || "starter-65-kit";

    const product = window.getProductById(productId) || products[0];
    if (!product) return;

    // Document title
    document.title = `${product.name} | Keycap Lab`;

    // Elements
    const breadcrumbCategory = document.getElementById(
      "detail-breadcrumb-category",
    );
    const breadcrumbName = document.getElementById("detail-breadcrumb-name");
    const titleEl = document.getElementById("detail-title");
    const subtitleEl = document.getElementById("detail-subtitle");
    const priceEl = document.getElementById("detail-price");
    const badgeEl = document.getElementById("detail-badge");
    const ratingEl = document.getElementById("detail-rating");
    const reviewsEl = document.getElementById("detail-reviews");
    const descriptionEl = document.getElementById("detail-description");
    const featuresList = document.getElementById("detail-features");
    const mainImg = document.getElementById("detail-main-img");
    const variantsContainer = document.getElementById("detail-variants");
    const qtyInput = document.getElementById("detail-qty-input");
    const qtyMinus = document.getElementById("detail-qty-minus");
    const qtyPlus = document.getElementById("detail-qty-plus");
    const addToCartBtn = document.getElementById("detail-add-cart");
    const buyNowBtn = document.getElementById("detail-buy-now");
    const wishlistBtn = document.getElementById("detail-wishlist-btn");
    const relatedGrid = document.getElementById("detail-related-grid");

    // Populate data
    if (breadcrumbCategory) {
      const catLabel =
        product.category === "kits"
          ? "Preset Kits"
          : product.category.toUpperCase();
      breadcrumbCategory.textContent = catLabel;
      breadcrumbCategory.href = `./shop.html?category=${encodeURIComponent(product.category)}`;
    }
    if (breadcrumbName) breadcrumbName.textContent = product.name;
    if (titleEl) titleEl.textContent = product.name;
    if (subtitleEl) subtitleEl.textContent = product.subtitle;
    if (priceEl) priceEl.textContent = `$${product.price}`;
    if (badgeEl) {
      if (product.badge) {
        badgeEl.textContent = product.badge;
        badgeEl.classList.remove("hidden");
      } else {
        badgeEl.classList.add("hidden");
      }
    }
    if (ratingEl) ratingEl.textContent = product.rating;
    if (reviewsEl)
      reviewsEl.textContent = `(${product.reviewsCount} customer reviews)`;
    if (descriptionEl) descriptionEl.textContent = product.description;

    if (featuresList && Array.isArray(product.features)) {
      featuresList.innerHTML = "";
      product.features.forEach((feat) => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-2 text-sm text-muted";
        li.innerHTML = `
          <i class="fa-solid fa-check text-accent text-xs mt-1 shrink-0" aria-hidden="true"></i>
          <span>${feat}</span>
        `;
        featuresList.appendChild(li);
      });
    }

    if (mainImg) {
      mainImg.src = product.image;
      mainImg.alt = product.name;
    }

    // Selected variants state
    const selectedVariants = {};
    if (variantsContainer && Array.isArray(product.variants)) {
      variantsContainer.innerHTML = "";
      product.variants.forEach((vGroup) => {
        selectedVariants[vGroup.name] = vGroup.options[0];

        const groupDiv = document.createElement("div");
        groupDiv.className = "flex flex-col gap-2";

        const label = document.createElement("label");
        label.className =
          "text-xs font-semibold tracking-wider uppercase text-muted";
        label.textContent = `${vGroup.name}: `;
        const valSpan = document.createElement("span");
        valSpan.className = "text-text font-normal";
        valSpan.textContent = vGroup.options[0];
        label.appendChild(valSpan);
        groupDiv.appendChild(label);

        const optionsDiv = document.createElement("div");
        optionsDiv.className = "flex flex-wrap gap-2";

        vGroup.options.forEach((opt, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
            idx === 0
              ? "border-accent bg-surface-2 text-accent"
              : "border-border bg-surface text-text hover:border-muted"
          }`;
          btn.textContent = opt;

          btn.addEventListener("click", () => {
            selectedVariants[vGroup.name] = opt;
            valSpan.textContent = opt;
            optionsDiv.querySelectorAll("button").forEach((b) => {
              b.className =
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer border-border bg-surface text-text hover:border-muted";
            });
            btn.className =
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer border-accent bg-surface-2 text-accent";
          });

          optionsDiv.appendChild(btn);
        });

        groupDiv.appendChild(optionsDiv);
        variantsContainer.appendChild(groupDiv);
      });
    }

    // Quantity selector
    let currentQty = 1;
    function updateQty(delta) {
      currentQty = Math.max(1, currentQty + delta);
      if (qtyInput) qtyInput.value = String(currentQty);
    }
    if (qtyMinus) qtyMinus.addEventListener("click", () => updateQty(-1));
    if (qtyPlus) qtyPlus.addEventListener("click", () => updateQty(1));
    if (qtyInput) {
      qtyInput.addEventListener("change", (e) => {
        currentQty = Math.max(1, parseInt(e.target.value, 10) || 1);
        qtyInput.value = String(currentQty);
      });
    }

    // Add to cart
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const variantDesc = Object.entries(selectedVariants)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" | ");

        window.KeycapCart.addItem({
          id: product.id,
          name: product.name,
          desc: variantDesc || product.subtitle,
          price: product.price,
          qty: currentQty,
          image: product.image,
        });
      });
    }

    // Buy now
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const variantDesc = Object.entries(selectedVariants)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" | ");

        window.KeycapCart.addItem({
          id: product.id,
          name: product.name,
          desc: variantDesc || product.subtitle,
          price: product.price,
          qty: currentQty,
          image: product.image,
        });
        window.location.href = "./checkout.html";
      });
    }

    // Wishlist button
    if (wishlistBtn) {
      function syncWishlistBtn() {
        const has = window.KeycapWishlist
          ? window.KeycapWishlist.has(product.id)
          : false;
        wishlistBtn.setAttribute("aria-pressed", String(has));
        const icon = wishlistBtn.querySelector("i");
        const text = wishlistBtn.querySelector("span");
        if (has) {
          if (icon) icon.className = "fa-solid fa-heart text-accent text-sm";
          if (text) text.textContent = "Saved to Wishlist";
        } else {
          if (icon) icon.className = "fa-regular fa-heart text-sm";
          if (text) text.textContent = "Save to Wishlist";
        }
      }

      syncWishlistBtn();
      wishlistBtn.addEventListener("click", () => {
        window.KeycapWishlist.toggle(product);
        syncWishlistBtn();
      });
    }

    // Related products
    if (relatedGrid) {
      const related = products.filter((p) => p.id !== product.id).slice(0, 3);
      relatedGrid.innerHTML = "";
      related.forEach((rel) => {
        const isFav = window.KeycapWishlist
          ? window.KeycapWishlist.has(rel.id)
          : false;
        const relCard = document.createElement("article");
        relCard.className =
          "group relative flex flex-col justify-between p-4 bg-surface rounded-xl border border-border hover:border-muted transition-colors";
        relCard.innerHTML = `
          <div class="relative w-full h-40 rounded-lg overflow-hidden bg-surface-2 mb-3">
            <img src="${rel.image}" alt="${rel.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <button
              type="button"
              class="absolute top-2 right-2 p-1.5 rounded-full bg-bg/80 border border-border text-muted hover:text-accent z-10 cursor-pointer"
              data-wishlist-toggle="true"
              data-product-id="${rel.id}"
              data-product-name="${rel.name}"
              data-product-price="${rel.price}"
              data-product-subtitle="${rel.subtitle}"
              data-product-image="${rel.image}"
              aria-label="Save ${rel.name} to wishlist"
            >
              <i class="${isFav ? "fa-solid text-accent" : "fa-regular"} fa-heart text-xs" aria-hidden="true"></i>
            </button>
          </div>
          <h4 class="font-display font-medium text-sm text-text group-hover:text-accent transition-colors">
            <a href="./Product_Detail.html?id=${rel.id}" class="after:absolute after:inset-0 after:z-0">${rel.name}</a>
          </h4>
          <p class="text-xs text-muted mb-2">${rel.subtitle}</p>
          <div class="flex items-center justify-between pt-2 border-t border-border mt-auto">
            <span class="font-display font-bold text-accent text-sm">$${rel.price}</span>
            <span class="text-xs text-muted">View &rarr;</span>
          </div>
        `;
        relatedGrid.appendChild(relCard);
      });
    }
  }
})();
