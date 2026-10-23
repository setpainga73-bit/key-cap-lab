// Keycap Lab - Keyboard Custom Builder
(() => {
  const steps = [
    {
      id: "layout",
      title: "Choose your layout",
      subtitle:
        "Select the footprint and form factor for your custom keyboard.",
    },
    {
      id: "case",
      title: "Choose your case",
      subtitle: "Pick the material and aesthetic that encloses your keyboard.",
    },
    {
      id: "pcb",
      title: "Choose your PCB",
      subtitle: "Select your printed circuit board (hotswap or solder).",
    },
    {
      id: "switches",
      title: "Choose your switches",
      subtitle: "Determine the acoustic signature and actuation feel.",
    },
    {
      id: "keycaps",
      title: "Choose your keycaps",
      subtitle: "Select the profile, material, and visual theme.",
    },
    {
      id: "review",
      title: "Review your build",
      subtitle: "Inspect every selected part before adding to your cart.",
    },
  ];

  const selections = {
    layout: { name: "65%", price: 0, tag: "65" },
    case: null,
    pcb: null,
    switches: null,
    keycaps: null,
  };

  let currentStepIndex = 0;

  document.addEventListener("DOMContentLoaded", () => {
    initBuilder();
  });

  function initBuilder() {
    const stepTitleEl = document.getElementById("builder-step-title");
    const stepKickerEl = document.getElementById("builder-step-kicker");
    const stepDescEl = document.getElementById("builder-step-desc");
    const prevBtn = document.getElementById("builder-prev-btn");
    const nextBtn = document.getElementById("builder-next-btn");
    const errorEl = document.getElementById("builder-step-error");
    const layoutBadge = document.getElementById("builder-layout-badge");
    const summaryTotalEl = document.getElementById("builder-summary-total");
    const saveBuildBtn = document.getElementById("builder-save-btn");

    // Pre-populate selections from active markup if present
    document
      .querySelectorAll("[data-builder-option].is-selected")
      .forEach((opt) => {
        const cat = opt.dataset.category;
        selections[cat] = {
          name: opt.dataset.name,
          price: Number(opt.dataset.price) || 0,
          layout: opt.dataset.layout || null,
          desc: opt.dataset.desc || "",
        };
      });

    function calculateTotal() {
      return (
        (selections.case?.price || 0) +
        (selections.pcb?.price || 0) +
        (selections.switches?.price || 0) +
        (selections.keycaps?.price || 0)
      );
    }

    function updateSummaryView() {
      const total = calculateTotal();
      if (summaryTotalEl) summaryTotalEl.textContent = `$${total}`;

      if (layoutBadge) {
        layoutBadge.textContent = selections.layout
          ? `${selections.layout.name} Layout`
          : "Select Layout";
      }

      ["layout", "case", "pcb", "switches", "keycaps"].forEach((cat) => {
        const itemEl = document.getElementById(`summary-item-${cat}`);
        const priceEl = document.getElementById(`summary-price-${cat}`);
        const sel = selections[cat];

        if (itemEl) {
          itemEl.textContent = sel ? sel.name : "Not selected";
          itemEl.className = sel
            ? "text-sm font-medium text-text"
            : "text-sm text-muted italic";
        }
        if (priceEl) {
          priceEl.textContent = sel
            ? sel.price > 0
              ? `$${sel.price}`
              : "Included"
            : "—";
        }
      });

      // Review step breakdown table
      const reviewContainer = document.getElementById("builder-review-content");
      if (reviewContainer) {
        reviewContainer.innerHTML = `
          <div class="bg-surface rounded-xl border border-border p-6 flex flex-col gap-4">
            <h3 class="font-display font-bold text-lg text-text border-b border-border pb-3">Build Specification Breakdown</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
                  <div>
                    <span class="text-xs uppercase tracking-wider text-muted font-semibold">01 Layout</span>
                    <p class="text-sm font-medium text-text">${selections.layout?.name || "None"}</p>
                  </div>
                  <span class="text-sm font-semibold text-accent">$0</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
                  <div>
                    <span class="text-xs uppercase tracking-wider text-muted font-semibold">02 Case</span>
                    <p class="text-sm font-medium text-text">${selections.case?.name || "None"}</p>
                    <p class="text-xs text-muted">${selections.case?.desc || ""}</p>
                  </div>
                  <span class="text-sm font-semibold text-accent">$${selections.case?.price || 0}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
                  <div>
                    <span class="text-xs uppercase tracking-wider text-muted font-semibold">03 PCB</span>
                    <p class="text-sm font-medium text-text">${selections.pcb?.name || "None"}</p>
                    <p class="text-xs text-muted">${selections.pcb?.desc || ""}</p>
                  </div>
                  <span class="text-sm font-semibold text-accent">$${selections.pcb?.price || 0}</span>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
                  <div>
                    <span class="text-xs uppercase tracking-wider text-muted font-semibold">04 Switches</span>
                    <p class="text-sm font-medium text-text">${selections.switches?.name || "None"}</p>
                    <p class="text-xs text-muted">${selections.switches?.desc || ""}</p>
                  </div>
                  <span class="text-sm font-semibold text-accent">$${selections.switches?.price || 0}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
                  <div>
                    <span class="text-xs uppercase tracking-wider text-muted font-semibold">05 Keycaps</span>
                    <p class="text-sm font-medium text-text">${selections.keycaps?.name || "None"}</p>
                    <p class="text-xs text-muted">${selections.keycaps?.desc || ""}</p>
                  </div>
                  <span class="text-sm font-semibold text-accent">$${selections.keycaps?.price || 0}</span>
                </div>
                <div class="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/30 mt-auto">
                  <span class="font-display font-bold text-base text-text">Total Build Price</span>
                  <span class="font-display font-bold text-xl text-accent">$${total}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    }

    function filterCompatibility() {
      const selectedLayoutTag = selections.layout
        ? selections.layout.tag
        : "65";

      // Filter cases and pcbs by layout tag
      ["case", "pcb"].forEach((cat) => {
        document
          .querySelectorAll(`[data-builder-option][data-category="${cat}"]`)
          .forEach((btn) => {
            const compatibleLayouts = (
              btn.dataset.layouts ||
              btn.dataset.layout ||
              ""
            ).split(",");
            const isCompatible =
              compatibleLayouts.includes(selectedLayoutTag) ||
              compatibleLayouts.includes("all");

            if (!isCompatible) {
              btn.classList.add("opacity-40", "pointer-events-none");
              btn.setAttribute("aria-disabled", "true");
              if (btn.classList.contains("is-selected")) {
                btn.classList.remove(
                  "is-selected",
                  "border-accent",
                  "bg-surface-2",
                );
                btn.classList.add("border-border", "bg-surface");
                selections[cat] = null;
              }
            } else {
              btn.classList.remove("opacity-40", "pointer-events-none");
              btn.removeAttribute("aria-disabled");
            }
          });
      });
    }

    function showStep(index) {
      currentStepIndex = index;
      const step = steps[index];

      if (stepTitleEl) stepTitleEl.textContent = step.title;
      if (stepKickerEl)
        stepKickerEl.textContent = `Step ${index + 1} of ${steps.length}`;
      if (stepDescEl) stepDescEl.textContent = step.subtitle;
      if (errorEl) errorEl.textContent = "";

      // Hide/Show option panels
      document
        .querySelectorAll("[data-builder-step-panel]")
        .forEach((panel) => {
          const stepId = panel.dataset.builderStepPanel;
          panel.classList.toggle("hidden", stepId !== step.id);
        });

      // Update step indicator tabs
      document
        .querySelectorAll("[data-builder-step-nav]")
        .forEach((btn, idx) => {
          const isCurrent = idx === index;
          const isCompleted = idx < index;

          if (isCurrent) {
            btn.className =
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-accent text-on-accent transition-colors";
            btn.setAttribute("aria-current", "step");
          } else if (isCompleted) {
            btn.className =
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-surface-2 text-accent border border-accent/30 transition-colors";
            btn.removeAttribute("aria-current");
          } else {
            btn.className =
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-surface text-muted border border-border hover:border-muted transition-colors";
            btn.removeAttribute("aria-current");
          }
        });

      // Buttons
      if (prevBtn) {
        prevBtn.disabled = index === 0;
        prevBtn.classList.toggle("opacity-50", index === 0);
        prevBtn.classList.toggle("pointer-events-none", index === 0);
      }

      if (nextBtn) {
        if (index === steps.length - 1) {
          nextBtn.innerHTML = `
            <i class="fa-solid fa-cart-plus text-xs" aria-hidden="true"></i>
            <span>Add Complete Build to Cart</span>
          `;
          nextBtn.className =
            "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-hover text-on-accent transition-colors cursor-pointer shadow-lg";
        } else {
          nextBtn.innerHTML = `
            <span>Next: ${steps[index + 1].id.charAt(0).toUpperCase() + steps[index + 1].id.slice(1)}</span>
            <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
          `;
          nextBtn.className =
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-hover text-on-accent transition-colors cursor-pointer";
        }
      }

      updateSummaryView();
    }

    function canAdvanceFrom(stepIdx) {
      if (stepIdx === 0 && !selections.layout) return false;
      if (stepIdx === 1 && !selections.case) return false;
      if (stepIdx === 2 && !selections.pcb) return false;
      if (stepIdx === 3 && !selections.switches) return false;
      if (stepIdx === 4 && !selections.keycaps) return false;
      return true;
    }

    // Option selection listener
    document.querySelectorAll("[data-builder-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.category;
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price) || 0;
        const layoutTag = btn.dataset.layoutTag || btn.dataset.layout || null;
        const desc = btn.dataset.desc || "";

        // Unselect siblings in category
        document
          .querySelectorAll(`[data-builder-option][data-category="${cat}"]`)
          .forEach((b) => {
            b.classList.remove("is-selected", "border-accent", "bg-surface-2");
            b.classList.add("border-border", "bg-surface");
            b.setAttribute("aria-pressed", "false");
            const checkIcon = b.querySelector(".selection-check");
            if (checkIcon) checkIcon.classList.add("hidden");
          });

        // Select clicked option
        btn.classList.add("is-selected", "border-accent", "bg-surface-2");
        btn.classList.remove("border-border", "bg-surface");
        btn.setAttribute("aria-pressed", "true");
        const checkIcon = btn.querySelector(".selection-check");
        if (checkIcon) checkIcon.classList.remove("hidden");

        selections[cat] = { name, price, tag: layoutTag, desc };

        if (cat === "layout") {
          filterCompatibility();
        }

        if (errorEl) errorEl.textContent = "";
        updateSummaryView();
      });
    });

    // Step Nav buttons
    document.querySelectorAll("[data-builder-step-nav]").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        if (idx <= currentStepIndex || canAdvanceFrom(currentStepIndex)) {
          showStep(idx);
        } else {
          if (errorEl) {
            errorEl.textContent = `Please choose a ${steps[currentStepIndex].id} before continuing.`;
          }
        }
      });
    });

    // Prev Button
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentStepIndex > 0) {
          showStep(currentStepIndex - 1);
        }
      });
    }

    // Next Button
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentStepIndex < steps.length - 1) {
          if (!canAdvanceFrom(currentStepIndex)) {
            if (errorEl) {
              errorEl.textContent = `Please select a ${steps[currentStepIndex].id} to continue.`;
            }
            return;
          }
          showStep(currentStepIndex + 1);
        } else {
          // Add custom build to cart
          const parts = [
            { category: "Layout", name: selections.layout.name, price: 0 },
            {
              category: "Case",
              name: selections.case.name,
              price: selections.case.price,
            },
            {
              category: "PCB",
              name: selections.pcb.name,
              price: selections.pcb.price,
            },
            {
              category: "Switches",
              name: selections.switches.name,
              price: selections.switches.price,
            },
            {
              category: "Keycaps",
              name: selections.keycaps.name,
              price: selections.keycaps.price,
            },
          ];

          const total = calculateTotal();
          const buildItem = {
            id: `custom-build-${Date.now()}`,
            name: `Custom ${selections.layout.name} Build`,
            desc: `${selections.case.name} / ${selections.switches.name} / ${selections.keycaps.name}`,
            price: total,
            qty: 1,
            image: "./IMG/hero-keyboard.webp",
            parts: parts.map((p) => `${p.category}: ${p.name} ($${p.price})`),
          };

          window.KeycapCart.addItem(buildItem);
          window.location.href = "./Cart.html";
        }
      });
    }

    // Save build to localStorage
    if (saveBuildBtn) {
      saveBuildBtn.addEventListener("click", () => {
        try {
          const savedBuilds = JSON.parse(
            localStorage.getItem("keycap-lab-saved-builds") || "[]",
          );
          const buildRecord = {
            id: `build-${Date.now()}`,
            date: new Date().toISOString(),
            name: `Custom ${selections.layout?.name || "65%"} Setup`,
            total: calculateTotal(),
            selections: { ...selections },
          };
          savedBuilds.unshift(buildRecord);
          localStorage.setItem(
            "keycap-lab-saved-builds",
            JSON.stringify(savedBuilds),
          );
          window.showToast(
            "Your custom build has been saved to your account!",
            "success",
          );
        } catch {
          window.showToast(
            "Unable to save build in this browser session.",
            "info",
          );
        }
      });
    }

    // Initialize
    filterCompatibility();
    showStep(0);
  }
})();
