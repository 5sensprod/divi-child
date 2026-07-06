// frontend-wp/src/components/UI/SplitFlapBoard.jsx
import { useEffect, useRef } from "react";

const DEFAULT_MESSAGES = [
  ["", "SOLDE ETE", "2026"],
  ["24", "JUIN", "2026"],
  ["28", "JUILLET", "2026"],
];

const SplitFlapBoard = ({
  messages = DEFAULT_MESSAGES,
  dureeMessage = 3500,
  className = "",
}) => {
  const boardRef = useRef(null);
  const engineRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // --- Moteur split-flap (logique d'origine, encapsulée) ---
    class Engine {
      constructor(root, blocks) {
        this.root = root;
        this.tiles = [];
        this.timers = [];
        this.animationId = 0;
        this.render();
        this.write(blocks, { randomize: false });
      }

      render() {
        this.root.innerHTML = "";
        this.tiles = [];
        const groups = [
          { size: 2, tone: "number", charset: "0123456789" },
          { size: 9, tone: "letter", charset: " ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
          { size: 4, tone: "number", charset: "0123456789" },
        ];

        groups.forEach((group) => {
          const groupEl = document.createElement("div");
          groupEl.className = `split-group split-group--${group.tone}`;
          for (let i = 0; i < group.size; i++) {
            const tile = document.createElement("div");
            tile.className = "split-tile";
            tile.dataset.char = " ";
            tile.dataset.charset = group.charset;
            tile.innerHTML = `
              <span class="split-panel split-panel--top"><span class="split-char split-char--top"> </span></span>
              <span class="split-panel split-panel--bottom"><span class="split-char split-char--bottom"> </span></span>
              <span class="split-flip split-flip--top"><span class="split-char split-char--top"> </span></span>
              <span class="split-flip split-flip--bottom"><span class="split-char split-char--bottom"> </span></span>
              <span class="split-hinge split-hinge--left"></span>
              <span class="split-hinge split-hinge--right"></span>`;
            groupEl.appendChild(tile);
            this.tiles.push(tile);
          }
          this.root.appendChild(groupEl);
        });
      }

      clearTimers() {
        this.timers.forEach((t) => clearTimeout(t));
        this.timers = [];
        this.tiles.forEach((tile) => tile.classList.remove("is-flipping"));
      }

      timeout(fn, delay) {
        const t = window.setTimeout(fn, delay);
        this.timers.push(t);
        return t;
      }

      normalizeBlocks(blocks) {
        const day = String(blocks[0] ?? "")
          .replace(/\D/g, "")
          .slice(-2)
          .padStart(2, " ");
        let msg = String(blocks[1] ?? "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z ]/g, "")
          .toUpperCase()
          .trim()
          .slice(0, 9);
        const totalPad = 9 - msg.length;
        const left = Math.floor(totalPad / 2);
        const right = totalPad - left;
        const message = " ".repeat(left) + msg + " ".repeat(right);
        const yearRaw = String(blocks[2] ?? "").replace(/\D/g, "");
        const year = yearRaw ? yearRaw.slice(-4).padStart(4, " ") : "    ";
        return `${day}${message}${year}`;
      }

      setStatic(tile, char) {
        tile.dataset.char = char;
        tile
          .querySelectorAll(".split-panel .split-char")
          .forEach((el) => (el.textContent = char));
      }

      randomChar(tile) {
        const charset = tile.dataset.charset || " ";
        return charset[Math.floor(Math.random() * charset.length)] || " ";
      }

      static get FLIP_MS() {
        return 340;
      }

      doFlip(tile, from, to) {
        const topFlip = tile.querySelector(".split-flip--top .split-char");
        const bottomFlip = tile.querySelector(
          ".split-flip--bottom .split-char",
        );
        topFlip.textContent = from;
        bottomFlip.textContent = to;
        tile.classList.remove("is-flipping");
        void tile.offsetWidth;
        tile.classList.add("is-flipping");
        this.setStatic(tile, to);
      }

      animateTile(tile, queue, startDelay, animationId) {
        let step = 0;
        let current = tile.dataset.char || " ";
        const run = () => {
          if (animationId !== this.animationId) return;
          const next = queue[step];
          this.doFlip(tile, current, next);
          current = next;
          step++;
          if (step < queue.length) {
            this.timeout(run, Engine.FLIP_MS);
          } else {
            this.timeout(() => {
              if (animationId !== this.animationId) return;
              this.setStatic(tile, queue[queue.length - 1]);
              tile.classList.remove("is-flipping");
            }, Engine.FLIP_MS);
          }
        };
        this.timeout(run, startDelay);
      }

      write(blocks, options = {}) {
        this.clearTimers();
        const animationId = ++this.animationId;
        const text = this.normalizeBlocks(blocks);
        const randomize = options.randomize ?? true;
        [...text].forEach((char, index) => {
          const tile = this.tiles[index];
          if (!tile) return;
          if (!randomize) {
            this.setStatic(tile, char);
            return;
          }
          const spins = 2 + (index % 4);
          const queue = [];
          for (let i = 0; i < spins; i++) queue.push(this.randomChar(tile));
          queue.push(char);
          this.animateTile(tile, queue, index * 55, animationId);
        });
      }

      destroy() {
        this.clearTimers();
        this.animationId++;
      }
    }

    const engine = new Engine(boardRef.current, messages[0]);
    engineRef.current = engine;

    let msgIndex = 0;
    if (messages.length > 1) {
      intervalRef.current = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        engine.write(messages[msgIndex]);
      }, dureeMessage);
    }

    return () => {
      clearInterval(intervalRef.current);
      engine.destroy();
    };
  }, [messages, dureeMessage]);

  return (
    <div className={`split-flap-scope ${className}`}>
      <div className="board-wrap">
        <div
          className="split-board"
          ref={boardRef}
          aria-label="Panneau animé"
        />
      </div>
    </div>
  );
};

export default SplitFlapBoard;
