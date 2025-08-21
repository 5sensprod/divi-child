/**
 * Particle Blobs - Blobs organiques avec gestion Divi avancée
 * @author AXE MUSIQUE
 * @version 2.0.0
 */

(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  ready(function () {
    const cards = document.querySelectorAll(".particle-card");
    if (!cards.length) return;

    // Configuration optimisée
    const OPTS = {
      blobCount: 4,
      minRadius: 40,
      maxRadius: 80,
      colors: [
        "rgba(212, 181, 122, 0.3)", // #d4b57a doré
        "rgba(184, 146, 76, 0.25)", // #b8924c bronze
        "rgba(214, 201, 177, 0.2)", // #d6c9b1 beige
        "rgba(255, 255, 255, 0.15)", // blanc subtil
      ],
    };

    const states = new WeakMap();

    class StaticBlob {
      constructor(W, H, opts) {
        this.W = W;
        this.H = H;

        // Position évitant les bords
        this.x = 60 + Math.random() * (W - 120);
        this.y = 60 + Math.random() * (H - 120);

        // Taille et couleur aléatoires
        this.radius =
          opts.minRadius + Math.random() * (opts.maxRadius - opts.minRadius);
        this.color =
          opts.colors[Math.floor(Math.random() * opts.colors.length)];

        // Forme organique avec 8 points
        this.points = this.generateOrganicPoints();
      }

      generateOrganicPoints() {
        const pointCount = 8;
        const points = [];

        for (let i = 0; i < pointCount; i++) {
          const angle = (i / pointCount) * Math.PI * 2;
          const radiusVariation = 0.7 + Math.random() * 0.6; // 0.7-1.3
          const angleVariation = (Math.random() - 0.5) * 0.3;

          points.push({
            angle: angle + angleVariation,
            radiusMultiplier: radiusVariation,
          });
        }
        return points;
      }

      draw(ctx) {
        ctx.save();
        ctx.filter = "blur(20px)";
        ctx.beginPath();

        for (let i = 0; i < this.points.length; i++) {
          const point = this.points[i];
          const currentRadius = this.radius * point.radiusMultiplier;
          const x = this.x + Math.cos(point.angle) * currentRadius;
          const y = this.y + Math.sin(point.angle) * currentRadius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            // Courbes Bézier pour formes organiques
            const prevPoint = this.points[i - 1];
            const prevRadius = this.radius * prevPoint.radiusMultiplier;
            const prevX = this.x + Math.cos(prevPoint.angle) * prevRadius;
            const prevY = this.y + Math.sin(prevPoint.angle) * prevRadius;

            const cp1X =
              prevX +
              Math.cos(prevPoint.angle + Math.PI / 2) * prevRadius * 0.2;
            const cp1Y =
              prevY +
              Math.sin(prevPoint.angle + Math.PI / 2) * prevRadius * 0.2;
            const cp2X =
              x + Math.cos(point.angle + Math.PI / 2) * currentRadius * 0.2;
            const cp2Y =
              y + Math.sin(point.angle + Math.PI / 2) * currentRadius * 0.2;

            ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function initCard(card) {
      if (states.has(card)) return; // Déjà initialisée

      // Créer ou récupérer le canvas
      const canvas =
        card.querySelector(".bg-blobs") ||
        (function () {
          const c = document.createElement("canvas");
          c.className = "bg-blobs";
          c.style.cssText =
            "position:absolute;inset:0;z-index:1;pointer-events:none;";
          card.prepend(c);
          return c;
        })();

      const ctx = canvas.getContext("2d", { alpha: true });
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      let W = 0,
        H = 0,
        blobs = [];

      function resize() {
        const rect = card.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        W = Math.max(1, Math.floor(rect.width));
        H = Math.max(1, Math.floor(rect.height));
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function initBlobs() {
        blobs = Array.from(
          { length: OPTS.blobCount },
          () => new StaticBlob(W, H, OPTS)
        );
      }

      function render() {
        ctx.clearRect(0, 0, W, H);
        blobs.forEach((blob) => blob.draw(ctx));
      }

      // ResizeObserver pour changements de taille (Divi)
      const ro = new ResizeObserver(() => {
        const oldW = W,
          oldH = H;
        resize();
        if (W !== oldW || H !== oldH) {
          initBlobs();
          render();
        }
      });

      // IntersectionObserver pour performance (rendu seulement si visible)
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              resize();
              initBlobs();
              render();
            }
          });
        },
        { threshold: 0 }
      );

      ro.observe(card);
      io.observe(card);

      // Stocker l'état pour cleanup
      states.set(card, {
        canvas,
        ctx,
        ro,
        io,
        stop() {
          ro.disconnect();
          io.disconnect();
        },
      });
    }

    // Initialiser toutes les cartes existantes
    cards.forEach(initCard);

    // MutationObserver pour nouvelles cartes (Divi dynamique)
    const mo = new MutationObserver(() => {
      document.querySelectorAll(".particle-card").forEach(initCard);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Cleanup global
    window.addEventListener("unload", () => {
      states.forEach((state) => state.stop());
      mo.disconnect();
    });
  });
})();
