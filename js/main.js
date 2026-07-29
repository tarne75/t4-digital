/* t4-digital — shared behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* Enable animation styles only when JS is running (no-JS users see everything) */
  document.documentElement.classList.add("js");

  /* Mobile navigation toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* Scroll reveal (respects prefers-reduced-motion via CSS) */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Contact form — AJAX submit to Formspree so the user stays on-page */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Sending…";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.className = "form-status ok";
            status.textContent = "Thanks — your message has been sent. We'll reply within one working day.";
          } else {
            throw new Error("Formspree error");
          }
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "Sorry, something went wrong. Please email us directly at hello@t4-digital.uk.";
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = "Send Message";
        });
    });
  }
})();
