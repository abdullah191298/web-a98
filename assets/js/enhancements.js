(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduce) {
    /* 1) Marquee strip under the nav */
    var nav = document.querySelector(".tabbar");
    if (nav) {
      var words = ["PYTHON", "C#", "WEB", "CAD/CAM", "SOLIDWORKS", "POWERMILL", "PVC MOLDS", "CNC"];
      var row = words.map(function (w) {
        return "<span>" + w + '</span><span class="sep">✶</span>';
      }).join("");
      var bar = document.createElement("div");
      bar.className = "marquee";
      bar.setAttribute("aria-hidden", "true");
      bar.innerHTML = '<div class="marquee-track">' + row + row + "</div>";
      nav.insertAdjacentElement("afterend", bar);
    }

    /* 2) Drafting drawing in the hero (index page only) */
    var hero = document.querySelector(".hero-block");
    if (hero) {
      hero.insertAdjacentHTML("beforeend",
        '<svg class="hero-draw" viewBox="0 0 300 300" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path pathLength="1" d="M40 40H260V260H40Z"/>' +
        '<circle pathLength="1" cx="150" cy="150" r="82"/>' +
        '<circle pathLength="1" cx="150" cy="150" r="32"/>' +
        '<path pathLength="1" d="M40 292H260M40 284V300M260 284V300"/>' +
        '<path class="accent" pathLength="1" d="M150 20V280M20 150H280"/>' +
        "</svg>");
    }

    /* 3) Scroll reveal */
    var targets = document.querySelectorAll(
      ".fact,.dir-item,.card,.empty-state,.contact-card,.social-link,.prose,.page-lead"
    );
    var io = "IntersectionObserver" in window
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var el = e.target;
            el.classList.add("in");
            setTimeout(function () { el.style.transitionDelay = ""; }, 1200);
            io.unobserve(el);
          });
        }, { threshold: 0.12 })
      : null;

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      if (io) io.observe(el);
      else el.classList.add("in");
    });

    /* 4) Pointer dot (desktop only) */
    if (window.matchMedia("(pointer: fine)").matches) {
      var dot = document.createElement("div");
      dot.className = "ptr-dot";
      document.body.appendChild(dot);
      var x = 0, y = 0, tx = 0, ty = 0;
      window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; });
      (function loop() {
        x += (tx - x) * 0.2;
        y += (ty - y) * 0.2;
        dot.style.transform = "translate(" + x + "px," + y + "px)";
        requestAnimationFrame(loop);
      })();
      document.addEventListener("pointerover", function (e) {
        if (e.target.closest && e.target.closest("a,button,.dir-item,.card")) dot.classList.add("big");
      });
      document.addEventListener("pointerout", function (e) {
        if (e.target.closest && e.target.closest("a,button,.dir-item,.card")) dot.classList.remove("big");
      });
    }
  }
})();
