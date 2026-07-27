/* Tyleigh Capital — theme interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var doc = document;

  /* ---- Generic open/close toggles (mobile nav, search overlay) ---- */
  function bindToggle(triggerSelector, targetId) {
    var target = doc.getElementById(targetId);
    if (!target) return;

    function open() {
      target.setAttribute("aria-hidden", "false");
      doc.body.style.overflow = "hidden";
      var focusable = target.querySelector("input, button, a");
      if (focusable) setTimeout(function () { focusable.focus(); }, 60);
    }
    function close() {
      target.setAttribute("aria-hidden", "true");
      doc.body.style.overflow = "";
    }

    doc.querySelectorAll(triggerSelector).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        open();
      });
    });

    target.querySelectorAll("[data-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });

    // Click on backdrop closes
    target.addEventListener("click", function (e) {
      if (e.target === target) close();
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && target.getAttribute("aria-hidden") === "false") close();
    });
  }

  bindToggle("[data-open-menu]", "MobileNav");
  bindToggle("[data-open-search]", "SearchOverlay");

  /* ---- Facets: mobile filter drawer ---- */
  var facets = doc.querySelector("[data-facets]");
  if (facets) {
    doc.querySelectorAll("[data-toggle-facets]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = facets.getAttribute("aria-expanded") === "true";
        facets.setAttribute("aria-expanded", expanded ? "false" : "true");
        doc.body.style.overflow = expanded ? "" : "hidden";
      });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && facets.getAttribute("aria-expanded") === "true") {
        facets.setAttribute("aria-expanded", "false");
        doc.body.style.overflow = "";
      }
    });
  }

  /* ---- Auto-submit sort + filter forms on change ---- */
  doc.querySelectorAll("[data-auto-submit]").forEach(function (form) {
    form.querySelectorAll("select, input[type=checkbox], input[type=radio]").forEach(function (field) {
      field.addEventListener("change", function () {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.submit();
        }
      });
    });
  });

  /* ---- Product gallery handled inline in sections/main-product.liquid ---- */

  /* ---- Live cart count refresh (after Shopify AJAX or on load) ---- */
  function refreshCartCount() {
    fetch("/cart.js", { headers: { "Accept": "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (cart) {
        if (!cart) return;
        doc.querySelectorAll("[data-cart-count]").forEach(function (el) {
          el.textContent = cart.item_count;
          el.hidden = cart.item_count === 0;
        });
      })
      .catch(function () {});
  }
  if (doc.querySelector("[data-cart-count]")) refreshCartCount();

  /* ---- Sticky header shadow on scroll ---- */
  var header = doc.querySelector(".site-header");
  if (header) {
    var lastScroll = 0;
    window.addEventListener("scroll", function () {
      var y = window.pageYOffset;
      header.style.boxShadow = y > 8 ? "var(--shadow-md)" : "none";
      lastScroll = y;
    }, { passive: true });
  }
})();
