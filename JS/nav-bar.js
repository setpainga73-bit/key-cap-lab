// Keycap Lab - Navigation Bar, Mobile Drawer, and Global Search
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initSearch();
    initAuthNav();
  });

  function initMobileMenu() {
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const drawer = document.querySelector("[data-mobile-drawer]");
    const backdrop = document.querySelector("[data-drawer-backdrop]");
    const closeBtn = document.querySelector("[data-drawer-close]");

    if (!menuToggle || !drawer) return;

    function openDrawer() {
      drawer.classList.remove("translate-x-full");
      drawer.classList.add("translate-x-0");
      drawer.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
      if (backdrop) {
        backdrop.classList.remove("opacity-0", "pointer-events-none");
        backdrop.classList.add("opacity-100", "pointer-events-auto");
      }
      document.body.classList.add("overflow-hidden");
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      drawer.classList.remove("translate-x-0");
      drawer.classList.add("translate-x-full");
      drawer.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      if (backdrop) {
        backdrop.classList.remove("opacity-100", "pointer-events-auto");
        backdrop.classList.add("opacity-0", "pointer-events-none");
      }
      document.body.classList.remove("overflow-hidden");
      menuToggle.focus();
    }

    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        closeDrawer();
      }
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeDrawer();
      });
    });
  }

  function initSearch() {
    const searchInputs = document.querySelectorAll("[data-nav-search]");
    searchInputs.forEach((input) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const query = input.value.trim();
          if (query) {
            // Determine relative path based on current location
            const isInsideHtmlDir = window.location.pathname.includes("/HTML/");
            const targetUrl = isInsideHtmlDir
              ? `./shop.html?search=${encodeURIComponent(query)}`
              : `./HTML/shop.html?search=${encodeURIComponent(query)}`;
            window.location.href = targetUrl;
          }
        }
      });
    });
  }

  function initAuthNav() {
    const isAuth = localStorage.getItem("keycap-lab-authenticated") === "true";
    const authLoggedOutElements = document.querySelectorAll(
      "[data-auth-logged-out]",
    );
    const authLoggedInElements = document.querySelectorAll(
      "[data-auth-logged-in]",
    );

    authLoggedOutElements.forEach((el) => {
      el.classList.toggle("hidden", isAuth);
    });

    authLoggedInElements.forEach((el) => {
      el.classList.toggle("hidden", !isAuth);
    });

    document.querySelectorAll("[data-nav-logout]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("keycap-lab-authenticated");
        window.location.reload();
      });
    });
  }
})();
