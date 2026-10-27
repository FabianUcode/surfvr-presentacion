/**
 * ============================================================================
 * CONFIGURACIÓN DE URLS DE DESCARGA (FÁCILMENTE MODIFICABLE)
 * Edita las propiedades `url` aquí abajo para conectar tus archivos o tiendas:
 * - windows: Ruta o URL directa a tu instalador/ejecutable .exe
 * - macos:   URL oficial de tu juego en Mac App Store
 * - iphone:  URL oficial de tu juego en App Store (iOS / VR)
 * - android: Ruta o URL directa a tu archivo instalador .apk
 * ============================================================================
 */
window.SURFVR_DOWNLOADS = {
  windows: {
    url: "./downloads/SurfVR-Windows-x64.exe",
    filename: "SurfVR-Windows-x64.exe",
    platformName: "PC / Windows (.EXE)",
    badge: "Instalador Windows 10/11 (64-bit)"
  },
  macos: {
    url: "https://apps.apple.com/app/surfvr-macos",
    external: true,
    platformName: "macOS (Mac App Store)",
    badge: "Apple Silicon & Intel Universal"
  },
  iphone: {
    url: "https://apps.apple.com/app/surfvr-ios",
    external: true,
    platformName: "iPhone (App Store · VR)",
    badge: "iOS + Modo Visor VR 60Hz"
  },
  android: {
    url: "./downloads/SurfVR-Android.apk",
    filename: "SurfVR-Android.apk",
    platformName: "Android (.APK Directo)",
    badge: "Available on Android · Paquete .APK"
  }
};

/**
 * ============================================================================
 * SURFVR REACTIVE STATE ENGINE (Proxy Store + Two-Way DOM Bindings)
 * ============================================================================
 */
(function () {
  "use strict";

  const CONDITIONS = {
    VeryPoor: { label: "VERY POOR", color: "var(--coral)", hex: "#FF6B5B", pips: 1, chip: "chip-coral" },
    Poor:     { label: "POOR",      color: "var(--sun-deep)", hex: "#FF9E3D", pips: 2, chip: "chip-sun" },
    Good:     { label: "GOOD",      color: "var(--mint)", hex: "#6AF0B0", pips: 3, chip: "chip-mint" },
    VeryGood: { label: "VERY GOOD", color: "var(--aqua)", hex: "#5CE6E0", pips: 4, chip: "chip-aqua" },
    Epic:     { label: "EPIC",      color: "var(--violet)", hex: "#B38CFF", pips: 5, chip: "chip-violet" }
  };

  const BEACHES = [
    {
      name: "Teahupo'o",
      loc: "TAHITI, FRENCH POLYNESIA",
      photo: "assets/beaches/teahupoo.png",
      size: "3.5-13 ft",
      dir: "← Left",
      iconic: true,
      realCond: "VeryGood",
      last: "7.85",
      best: "9.40"
    },
    {
      name: "Pipeline",
      loc: "NORTH SHORE, OAHU, HAWAII",
      photo: "assets/beaches/pipeline.png",
      size: "9-11 ft",
      dir: "← Left",
      iconic: true,
      realCond: "VeryGood",
      last: "8.10",
      best: "9.65"
    },
    {
      name: "Nazaré",
      loc: "PRAIA DO NORTE, PORTUGAL",
      photo: "assets/beaches/nazare.png",
      size: "6-12 m",
      dir: "↔ Both ways",
      iconic: true,
      realCond: "Good",
      last: "7.20",
      best: "9.10"
    },
    {
      name: "Chicama",
      loc: "PUERTO MALABRIGO, PERU",
      photo: "assets/beaches/chicama.png",
      size: "5-7 ft",
      dir: "← Left",
      iconic: false,
      realCond: "VeryGood",
      last: "8.40",
      best: "8.95"
    },
    {
      name: "Jeffreys Bay",
      loc: "SUPERTUBES, SOUTH AFRICA",
      photo: "assets/beaches/jbay.png",
      size: "4-8 ft",
      dir: "→ Right",
      iconic: false,
      realCond: "Good",
      last: "7.60",
      best: "9.25"
    }
  ];

  const BOARDS = [
    {
      name: "FUNBOARD",
      dims: "7'10\" × 22\" × 2.76\" · 45 L",
      price: 0,
      priceText: "GRATIS · TABLA INICIAL",
      desc: "Media eslora noble y estable: rema con facilidad, atrapa la ola temprano y ofrece transiciones suaves de canto a canto.",
      tags: ["MELLOW", "PERFORMANCE", "ALL-ROUND"],
      stats: { turning: 3, stability: 4, paddle: 4, bigWaves: 3, smallWaves: 4 },
      shops: "Incluida gratis en tu inventario desde el inicio.",
      fill: "#FFF9D2", rail: "#5CE6E0"
    },
    {
      name: "SOFTBOARD",
      dims: "8'0\" × 22.4\" × 3.15\" · 75 L",
      price: 150,
      priceText: "$150",
      desc: "Tabla de espuma de 75 litros de alto volumen. Máxima flotación y estabilidad para remar sin esfuerzo y aprender a leer la pared.",
      tags: ["FOAMIE", "MAX STABILITY", "BEGINNER"],
      stats: { turning: 2, stability: 5, paddle: 5, bigWaves: 1, smallWaves: 5 },
      shops: "Tiendas: North Shore Surf Shack (Pipeline) · Malabrigo Surf Club (Chicama)",
      fill: "#FFE07D", rail: "#FF9E3D"
    },
    {
      name: "FISH",
      dims: "5'7\" × 21.3\" × 2.48\" · 33 L",
      price: 300,
      priceText: "$300",
      desc: "Corta, ancha y con cola de golondrina (swallow tail). Genera velocidad instantánea en secciones planas y fluye con soltura.",
      tags: ["SWALLOW TAIL", "FAST", "SMALL-MED"],
      stats: { turning: 4, stability: 3, paddle: 4, bigWaves: 2, smallWaves: 5 },
      shops: "Tiendas: Malabrigo Surf Club (Chicama) · Supertubes Board Room (J-Bay)",
      fill: "#7CE8A2", rail: "#1FB5C1"
    },
    {
      name: "TWIN",
      dims: "6'4\" × 19.7\" × 2.28\" · 27 L",
      price: 350,
      priceText: "$350",
      desc: "Configuración de dos quillas sin estabilizador central. Pivota con libertad total en el labio con una sensación suelta y skatey.",
      tags: ["TWIN FIN", "SKATEY", "CARVING"],
      stats: { turning: 5, stability: 2, paddle: 3, bigWaves: 2, smallWaves: 4 },
      shops: "Tiendas: North Shore Surf Shack (Pipeline) · Supertubes Board Room (J-Bay)",
      fill: "#FF9CEE", rail: "#C59BFF"
    },
    {
      name: "SHORTBOARD",
      dims: "6'11\" × 20.5\" × 2.56\" · 28 L",
      price: 400,
      priceText: "$400",
      desc: "Thruster de alto rendimiento. Rápida, vertical y precisa en el bolsillo crítica del tubo; ideal para despegar en aéreos 360°.",
      tags: ["THRUSTER", "PRO PERFORMANCE", "AIRS & BARRELS"],
      stats: { turning: 5, stability: 2, paddle: 2, bigWaves: 4, smallWaves: 2 },
      shops: "Tiendas: Pipeline · Nazaré · Jeffreys Bay",
      fill: "#FFFFFF", rail: "#FF6B5B"
    },
    {
      name: "LONGBOARD",
      dims: "9'0\" × 23.0\" × 3.00\" · 65 L",
      price: 500,
      priceText: "$500",
      desc: "Clásico de 9 pies con quilla única (Single Fin). Planeo infinito desde el pico exterior y giros amplios con estilo clásico.",
      tags: ["SINGLE FIN", "CRUISER", "POINT BREAKS"],
      stats: { turning: 2, stability: 5, paddle: 5, bigWaves: 2, smallWaves: 5 },
      shops: "Tienda exclusiva: Malabrigo Surf Club (Chicama)",
      fill: "#F5E9D3", rail: "#6478C8"
    },
    {
      name: "GUN",
      dims: "9'6\" × 20.1\" × 3.15\" · 50 L",
      price: 900,
      priceText: "$900",
      desc: "Cañón diseñado para olas gigantes en Nazaré. Pesada, larga y afilada para mantener la línea a más de 60 km/h en paredes de 40 pies.",
      tags: ["BIG WAVE", "NAZARÉ SPEC", "MAX HOLD"],
      stats: { turning: 2, stability: 4, paddle: 4, bigWaves: 5, smallWaves: 1 },
      shops: "Tienda exclusiva: Praia do Norte Big Wave Shop (Nazaré)",
      fill: "#26303D", rail: "#FFC65A"
    }
  ];

  const WAVE_PHASES = {
    Swell: {
      title: "1. Swell (Mar de Fondo)",
      desc: "Líneas de energía viajando en aguas profundas. El jugador espera sentado en el Lineup observando el horizonte para anticipar la serie.",
      metric: "Período: 12–18 s"
    },
    Shoaling: {
      title: "2. Shoaling (Peraltamiento)",
      desc: "Al tocar la batimetría del arrecife o banco de arena, la ola frena su base, comprime su longitud y gana altura rápidamente.",
      metric: "Empuje hidrodinámico creciente"
    },
    Peak: {
      title: "3. Peak (El Pico)",
      desc: "Punto crítico de captura. Remas con W para igualar la velocidad de la masa de agua y llenas el Catch Meter antes del Pop Up.",
      metric: "Zona óptima de Drop-in"
    },
    Lip: {
      title: "4. Lip (El Labio)",
      desc: "La cresta alcanza su máxima pendiente vertical. Puedes proyectarte contra el labio para lanzar Snaps, Cutbacks o despegar en un 360 Air.",
      metric: "Rampa de proyección aérea"
    },
    Barrel: {
      title: "5. Barrel (Cavidad Tubular)",
      desc: "El labio lanza hacia adelante formando el tubo. Presiona S (Pull in) para encajarte dentro de la cortina de agua y W para bombear hacia la salida.",
      metric: "Velocidad de bolsillo: 28–45 km/h"
    },
    Peel: {
      title: "6. Peel (La Pared Limpia)",
      desc: "La ola abre lateralmente a izquierda o derecha. Encadena subidas y bajadas (rail-to-rail pumping) para multiplicar tu puntuación WSL.",
      metric: "Generación de velocidad activa"
    },
    Whitewater: {
      title: "7. Whitewater (Espuma Blanca)",
      desc: "La ola colapsa en turbulencia. Si estás remando hacia afuera, sumérgete haciendo el pato (Duck Dive con Space) para pasar por debajo sin ser arrastrado.",
      metric: "Acción: Space Duck Dive"
    }
  };

  const MISSIONS = {
    easy: {
      reward: 100,
      items: [
        "Haz 2 giros limpios en la pared (2/2)",
        "Consigue 3.0+ puntos en una ola",
        "Completa una ola hasta el final sin caerte"
      ]
    },
    medium: {
      reward: 250,
      items: [
        "Alcanza 30 km/h en una pared limpia",
        "Consigue 5.5+ puntos en una sola ola",
        "Completa 2 olas seguidas sin Wipeout"
      ]
    },
    hard: {
      reward: 500,
      items: [
        " Aguanta 1.5 s dentro del tubo (Barrel)",
        "Aterriza un aéreo limpio sobre el labio",
        "Consigue una ola Excellent (8.0+ pts)"
      ]
    },
    pro: {
      reward: 1000,
      items: [
        "Completa un 360 Air y sigue surfeando",
        "Aguanta 3.0 s profundos en el tubo de Pipeline",
        "Consigue una ola de 9.50+ puntos (WSL Perfect)"
      ]
    }
  };

  const SWATCHES = [
    "#FFFFFF", "#F5E9D3", "#FFE07D", "#FFAA4C", "#FF6B5B", "#FF9CEE", "#C59BFF",
    "#6478C8", "#6CB4FF", "#BCE6FF", "#5CE6E0", "#7CE8A2", "#A8B2BD", "#26303D"
  ];

  const SKIN_TONES = [
    { name: "Porcelain", hex: "#F7E2D4" },
    { name: "Fair",      hex: "#F1C9B0" },
    { name: "Sun-Kissed",hex: "#E2AE88" },
    { name: "Olive",     hex: "#CE976B" },
    { name: "Tan",       hex: "#B87E52" },
    { name: "Bronze",    hex: "#9E643C" },
    { name: "Brown",     hex: "#78492A" },
    { name: "Deep",      hex: "#4E2E1A" }
  ];

  const HAIRSTYLES = ["Classic", "Parted", "Long", "Buns", "Buzzed", "Crop", "Bald"];
  const OUTFITS = ["Wetsuit (Neopreno)", "Rashguard + Boardshorts", "Boardshorts / Bikini"];

  // --- REACTIVE PROXY STORE ---
  const subscribers = new Set();
  const rawState = {
    money: 500,
    selectedBeach: 1,
    forecastMode: "real",
    customCondition: "VeryGood",
    startMode: "Lineup",
    selectedBoard: 0,
    ownedBoards: [0],
    ridingBoard: 0,
    wavePhase: "Barrel",
    handlingMode: "arcade",
    modeTab: "freesurf",
    missionTier: "easy",
    missionChecks: { easy: [false, false, false], medium: [false, false, false], hard: [false, false, false], pro: [false, false, false] },
    missionPaid: { easy: false, medium: false, hard: false, pro: false },
    paintPart: "fill",
    boardPaint: { fill: "#FFF9D2", rail: "#5CE6E0", fins: "#1FB5C1" },
    surferTab: "body",
    surfer: {
      body: "Male",
      stance: "Regular",
      skinIdx: 3,
      hair: "Classic",
      beard: true,
      outfit: "Wetsuit (Neopreno)",
      outfitColor: "#5CE6E0"
    }
  };

  const state = new Proxy(rawState, {
    set(target, prop, value) {
      target[prop] = value;
      subscribers.forEach((fn) => fn(prop, value));
      return true;
    }
  });

  function subscribe(fn) {
    subscribers.add(fn);
  }

  function showToast(msg) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "sea-toast";
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 260);
    }, 3000);
  }

  function updateWalletUI(delta) {
    const amountEl = document.getElementById("wallet-amount");
    const deltaEl = document.getElementById("wallet-delta");
    if (amountEl) amountEl.textContent = "$" + state.money.toLocaleString();
    if (delta && deltaEl) {
      deltaEl.textContent = (delta > 0 ? "+$" : "-$") + Math.abs(delta);
      deltaEl.className = "money-delta show " + (delta > 0 ? "positive" : "negative");
      setTimeout(() => deltaEl.classList.remove("show"), 1100);
    }
  }

  function renderSessionStrip() {
    const beach = BEACHES[state.selectedBeach];
    const condKey = state.forecastMode === "real" ? beach.realCond : state.customCondition;
    const cond = CONDITIONS[condKey];
    const board = BOARDS[state.ridingBoard];

    const beachChip = document.getElementById("session-beach-chip");
    const condChip = document.getElementById("session-cond-chip");
    const condText = document.getElementById("session-cond-text");
    const sizeChip = document.getElementById("session-size-chip");
    const boardChip = document.getElementById("session-board-chip");
    const startChip = document.getElementById("session-start-chip");

    if (beachChip) beachChip.textContent = beach.name;
    if (condChip) condChip.className = "chip " + cond.chip;
    if (condText) condText.textContent = cond.label;
    if (sizeChip) sizeChip.textContent = beach.size + " · " + beach.dir;
    if (boardChip) boardChip.textContent = board.name;
    if (startChip) startChip.textContent = "Start: " + state.startMode;
  }

  function renderPips(count, colorCss) {
    let html = "";
    for (let i = 0; i < 5; i++) {
      html += `<span class="seg-pip ${i < count ? "filled" : ""}" style="--pip-color:${colorCss}"></span>`;
    }
    return html;
  }

  function renderBeaches() {
    const grid = document.getElementById("beaches-grid");
    if (!grid) return;
    grid.innerHTML = BEACHES.map((b, idx) => {
      const condKey = state.forecastMode === "real" ? b.realCond : state.customCondition;
      const cond = CONDITIONS[condKey];
      const isSelected = state.selectedBeach === idx;
      return `
        <div class="beach-card ${isSelected ? "selected" : ""}" data-beach-idx="${idx}">
          <div class="beach-photo-wrap">
            <img src="${b.photo}" alt="${b.name}">
            <div class="beach-photo-scrim"></div>
            ${b.iconic ? `<span class="iconic-chip">★ Iconic</span>` : ""}
          </div>
          <div class="beach-body">
            <div>
              <div class="beach-name">${b.name}</div>
              <div class="beach-loc">${b.loc}</div>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="chip">${b.size}</span>
              <span class="chip">${b.dir}</span>
            </div>
            <div style="margin-top:4px;">
              <div style="font-size:0.72rem; font-weight:800; color:${cond.color}; margin-bottom:5px;">${cond.label}</div>
              <div class="segments-bar">${renderPips(cond.pips, cond.color)}</div>
            </div>
            <div class="beach-scores">
              <div>
                <div class="stat-block-label">LAST</div>
                <div class="stat-block-val">${b.last}</div>
              </div>
              <div>
                <div class="stat-block-label">BEST</div>
                <div class="stat-block-val" style="color:var(--sun);">${b.best}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    grid.querySelectorAll("[data-beach-idx]").forEach((card) => {
      card.addEventListener("click", () => {
        state.selectedBeach = parseInt(card.getAttribute("data-beach-idx"), 10);
        showToast("Playa seleccionada: " + BEACHES[state.selectedBeach].name);
      });
    });
  }

  function renderBoards() {
    const carousel = document.getElementById("boards-carousel");
    const dotsWrap = document.getElementById("board-pager-dots");
    if (!carousel || !dotsWrap) return;

    carousel.innerHTML = BOARDS.map((b, idx) => {
      const owned = state.ownedBoards.includes(idx);
      const isSel = state.selectedBoard === idx;
      return `
        <div class="pedestal-item ${isSel ? "active" : ""}" data-board-idx="${idx}">
          <svg viewBox="0 0 50 140" width="38" height="106">
            <path d="M25 4 C42 26, 44 102, 25 136 C6 102, 8 26, 25 4 Z" fill="${b.fill}" stroke="${b.rail}" stroke-width="4"/>
            <line x1="25" y1="6" x2="25" y2="134" stroke="rgba(7,19,29,0.28)" stroke-width="1.5"/>
          </svg>
          <div class="pedestal-disc"></div>
          <strong style="font-size:0.74rem;">${b.name}</strong>
          <span class="chip ${owned ? "chip-mint" : "chip-sun"}" style="padding:2px 8px; font-size:0.66rem;">
            ${owned ? (state.ridingBoard === idx ? "✓ Riding" : "Owned") : "$" + b.price}
          </span>
        </div>
      `;
    }).join("");

    dotsWrap.innerHTML = BOARDS.map((_, idx) =>
      `<button class="pager-dot ${state.selectedBoard === idx ? "active" : ""}" data-dot-idx="${idx}" aria-label="Tabla ${idx + 1}"></button>`
    ).join("");

    carousel.querySelectorAll("[data-board-idx]").forEach((el) => {
      el.addEventListener("click", () => {
        state.selectedBoard = parseInt(el.getAttribute("data-board-idx"), 10);
      });
    });

    dotsWrap.querySelectorAll("[data-dot-idx]").forEach((el) => {
      el.addEventListener("click", () => {
        state.selectedBoard = parseInt(el.getAttribute("data-dot-idx"), 10);
      });
    });

    // Update Inspector Sheet
    const b = BOARDS[state.selectedBoard];
    const owned = state.ownedBoards.includes(state.selectedBoard);
    document.getElementById("inspector-counter").textContent = `BOARD ${state.selectedBoard + 1} OF ${BOARDS.length}`;
    document.getElementById("inspector-name").textContent = b.name;
    document.getElementById("inspector-dims").textContent = b.dims;
    document.getElementById("inspector-desc").textContent = b.desc;
    document.getElementById("inspector-shops").textContent = b.shops;

    const badge = document.getElementById("inspector-price-badge");
    if (owned) {
      badge.className = "chip chip-mint";
      badge.textContent = state.ridingBoard === state.selectedBoard ? "✓ RIDING THIS ONE" : "✓ EN TU INVENTARIO";
    } else {
      badge.className = "chip chip-sun";
      badge.textContent = "PRECIO: $" + b.price;
    }

    document.getElementById("inspector-tags").innerHTML = b.tags.map((t) => `<span class="chip">${t}</span>`).join("");
    document.getElementById("stat-turning").innerHTML = renderPips(b.stats.turning, "var(--aqua)");
    document.getElementById("stat-stability").innerHTML = renderPips(b.stats.stability, "var(--aqua)");
    document.getElementById("stat-paddle").innerHTML = renderPips(b.stats.paddle, "var(--aqua)");
    document.getElementById("stat-bigwaves").innerHTML = renderPips(b.stats.bigWaves, "var(--aqua)");
    document.getElementById("stat-smallwaves").innerHTML = renderPips(b.stats.smallWaves, "var(--aqua)");

    const actionBtn = document.getElementById("inspector-action-btn");
    if (owned) {
      actionBtn.textContent = state.ridingBoard === state.selectedBoard ? "✓ Tabla Equipada en tu Sesión" : "Ride this board →";
    } else if (state.money >= b.price) {
      actionBtn.textContent = `Comprar ${b.name} por $${b.price} →`;
    } else {
      actionBtn.textContent = `Faltan $${b.price - state.money} (Haz clic para ganar +$${b.price - state.money} en misiones)`;
    }
  }

  function renderMissions() {
    const list = document.getElementById("missions-list");
    if (!list) return;
    const tierData = MISSIONS[state.missionTier];
    const checks = state.missionChecks[state.missionTier];

    list.innerHTML = tierData.items.map((text, idx) => `
      <div class="mission-row ${checks[idx] ? "done" : ""}" data-mission-idx="${idx}">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="mission-check">${checks[idx] ? "✓" : ""}</span>
          <span style="font-size:0.88rem; font-weight:600;">${text}</span>
        </div>
        <span class="chip ${checks[idx] ? "chip-mint" : ""}">${checks[idx] ? "Done" : "0/1"}</span>
      </div>
    `).join("");

    list.querySelectorAll("[data-mission-idx]").forEach((row) => {
      row.addEventListener("click", () => {
        const i = parseInt(row.getAttribute("data-mission-idx"), 10);
        checks[i] = !checks[i];
        if (checks.every(Boolean) && !state.missionPaid[state.missionTier]) {
          state.missionPaid[state.missionTier] = true;
          state.money = state.money + tierData.reward;
          updateWalletUI(tierData.reward);
          showToast(`¡Misiones completadas! Makoa te ha pagado +$${tierData.reward}`);
        }
        renderMissions();
        renderBoards();
      });
    });
  }

  function renderPaintStudio() {
    const fillEl = document.getElementById("svg-board-fill");
    const railEl = document.getElementById("svg-board-rail");
    const finsEl = document.getElementById("svg-board-fins");
    if (fillEl) fillEl.setAttribute("fill", state.boardPaint.fill);
    if (railEl) railEl.setAttribute("fill", state.boardPaint.rail);
    if (finsEl) finsEl.setAttribute("fill", state.boardPaint.fins);

    const dotFill = document.getElementById("dot-fill");
    const dotRail = document.getElementById("dot-rail");
    const dotFins = document.getElementById("dot-fins");
    if (dotFill) dotFill.style.background = state.boardPaint.fill;
    if (dotRail) dotRail.style.background = state.boardPaint.rail;
    if (dotFins) dotFins.style.background = state.boardPaint.fins;

    const swatchesEl = document.getElementById("paint-swatches");
    if (swatchesEl) {
      const currentHex = state.boardPaint[state.paintPart];
      swatchesEl.innerHTML = SWATCHES.map((hex) => `
        <button class="color-swatch ${currentHex.toLowerCase() === hex.toLowerCase() ? "active" : ""}"
                style="background:${hex}" data-swatch-hex="${hex}" aria-label="Color ${hex}"></button>
      `).join("");

      swatchesEl.querySelectorAll("[data-swatch-hex]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const hex = btn.getAttribute("data-swatch-hex");
          state.boardPaint = { ...state.boardPaint, [state.paintPart]: hex };
        });
      });
    }
  }

  function renderSurferEditor() {
    const area = document.getElementById("surfer-controls-area");
    const summary = document.getElementById("surfer-live-summary");
    if (!area || !summary) return;

    const s = state.surfer;
    if (state.surferTab === "body") {
      area.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:14px; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:0.72rem; font-weight:800; color:var(--text-tertiary); margin-bottom:6px;">BODY MODEL</div>
            <div class="segmented-control">
              <button class="seg-btn ${s.body === "Male" ? "active" : ""}" data-set-body="Male">Male</button>
              <button class="seg-btn ${s.body === "Female" ? "active" : ""}" data-set-body="Female">Female</button>
            </div>
          </div>
          <div>
            <div style="font-size:0.72rem; font-weight:800; color:var(--text-tertiary); margin-bottom:6px;">STANCE (PIE ADELANTE)</div>
            <div class="segmented-control">
              <button class="seg-btn ${s.stance === "Regular" ? "active" : ""}" data-set-stance="Regular">Regular (Izq)</button>
              <button class="seg-btn ${s.stance === "Goofy" ? "active" : ""}" data-set-stance="Goofy">Goofy (Der)</button>
            </div>
          </div>
        </div>
      `;
    } else if (state.surferTab === "skin") {
      area.innerHTML = `
        <div style="font-size:0.75rem; font-weight:800; color:var(--text-tertiary); margin-bottom:8px;">TONO DE PIEL: ${SKIN_TONES[s.skinIdx].name.toUpperCase()}</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          ${SKIN_TONES.map((t, i) => `
            <button class="color-swatch ${s.skinIdx === i ? "active" : ""}" style="background:${t.hex}; margin:0;" data-set-skin="${i}" title="${t.name}"></button>
          `).join("")}
        </div>
      `;
    } else if (state.surferTab === "hair") {
      area.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
          ${HAIRSTYLES.map((h) => `
            <button class="btn-secondary ${s.hair === h ? "active" : ""}" style="padding:6px 12px; font-size:0.8rem;" data-set-hair="${h}">${h}</button>
          `).join("")}
          <button class="btn-secondary ${s.beard ? "active" : ""}" style="padding:6px 12px; font-size:0.8rem;" data-toggle-beard="1">Barba: ${s.beard ? "ON" : "OFF"}</button>
        </div>
      `;
    } else {
      area.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${OUTFITS.map((o) => `
            <button class="btn-secondary ${s.outfit === o ? "active" : ""}" style="padding:6px 12px; font-size:0.8rem;" data-set-outfit="${o}">${o}</button>
          `).join("")}
        </div>
      `;
    }

    area.querySelectorAll("[data-set-body]").forEach((b) => b.addEventListener("click", () => { s.body = b.getAttribute("data-set-body"); renderSurferEditor(); }));
    area.querySelectorAll("[data-set-stance]").forEach((b) => b.addEventListener("click", () => { s.stance = b.getAttribute("data-set-stance"); renderSurferEditor(); }));
    area.querySelectorAll("[data-set-skin]").forEach((b) => b.addEventListener("click", () => { s.skinIdx = parseInt(b.getAttribute("data-set-skin"), 10); renderSurferEditor(); }));
    area.querySelectorAll("[data-set-hair]").forEach((b) => b.addEventListener("click", () => { s.hair = b.getAttribute("data-set-hair"); renderSurferEditor(); }));
    area.querySelectorAll("[data-toggle-beard]").forEach((b) => b.addEventListener("click", () => { s.beard = !s.beard; renderSurferEditor(); }));
    area.querySelectorAll("[data-set-outfit]").forEach((b) => b.addEventListener("click", () => { s.outfit = b.getAttribute("data-set-outfit"); renderSurferEditor(); }));

    summary.innerHTML = `
      <span class="chip chip-aqua">Body: ${s.body}</span>
      <span class="chip">Stance: ${s.stance}</span>
      <span class="chip"><span class="dot" style="background:${SKIN_TONES[s.skinIdx].hex}"></span>Skin: ${SKIN_TONES[s.skinIdx].name}</span>
      <span class="chip">Hair: ${s.hair}${s.beard ? " + Beard" : ""}</span>
      <span class="chip chip-mint">${s.outfit}</span>
    `;
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x) => Math.round(255 * x).toString(16).padStart(2, "0");
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    // 1. Bind Download URLs from window.SURFVR_DOWNLOADS
    document.querySelectorAll("[data-download-platform]").forEach((btn) => {
      const key = btn.getAttribute("data-download-platform");
      const cfg = window.SURFVR_DOWNLOADS && window.SURFVR_DOWNLOADS[key];
      if (!cfg) return;
      if (btn.tagName === "A") {
        btn.setAttribute("href", cfg.url);
        if (cfg.external) {
          btn.setAttribute("target", "_blank");
          btn.setAttribute("rel", "noopener noreferrer");
        } else if (cfg.filename) {
          btn.setAttribute("download", cfg.filename);
        }
      }
      btn.addEventListener("click", () => {
        showToast(`Iniciando descarga para ${cfg.platformName}: ${cfg.url}`);
      });
    });

    // 2. Mobile Navbar Toggle
    const mobBtn = document.getElementById("mobile-menu-toggle");
    const navLinks = document.getElementById("nav-links");
    if (mobBtn && navLinks) {
      mobBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
    }

    // 3. Wallet Quick Top-up on Click
    const walletBtn = document.getElementById("wallet-chip");
    if (walletBtn) {
      walletBtn.addEventListener("click", () => {
        state.money = state.money + 250;
        updateWalletUI(250);
        renderBoards();
        showToast("+$250 añadidos a tu billetera de prueba");
      });
    }

    // 4. Hero Thumbnails Switcher
    document.querySelectorAll("[data-hero-shot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-hero-shot]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const mainImg = document.getElementById("hero-main-img");
        if (mainImg) mainImg.src = btn.getAttribute("data-hero-shot");
        const topHud = document.getElementById("hero-hud-top");
        const botHud = document.getElementById("hero-hud-bottom");
        if (topHud) topHud.textContent = btn.getAttribute("data-hud-top");
        if (botHud) botHud.textContent = btn.getAttribute("data-hud-bottom");
      });
    });

    // 5. Wave Evolution Phases
    document.querySelectorAll("[data-wave-phase]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-wave-phase]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const phase = WAVE_PHASES[btn.getAttribute("data-wave-phase")];
        if (phase) {
          document.getElementById("wave-phase-title").textContent = phase.title;
          document.getElementById("wave-phase-desc").textContent = phase.desc;
          document.getElementById("wave-phase-metric").textContent = phase.metric;
        }
      });
    });

    // 6. Real vs Arcade Handling Toggle
    document.querySelectorAll("[data-handling-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-handling-mode]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.getAttribute("data-handling-mode");
        document.getElementById("handling-col-real").classList.toggle("active", mode === "real");
        document.getElementById("handling-col-arcade").classList.toggle("active", mode === "arcade");
      });
    });

    // 7. Game Modes Tabs & Start Modes
    document.querySelectorAll("[data-mode-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-mode-tab");
        document.querySelectorAll("[data-mode-tab]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll("[data-mode-panel]").forEach((p) => {
          p.classList.toggle("active", p.getAttribute("data-mode-panel") === tab);
        });
      });
    });

    document.querySelectorAll("[data-start-mode]").forEach((tile) => {
      tile.addEventListener("click", () => {
        document.querySelectorAll("[data-start-mode]").forEach((t) => t.classList.remove("active"));
        tile.classList.add("active");
        state.startMode = tile.getAttribute("data-start-mode");
        showToast("Modo de entrada actualizado: " + state.startMode);
      });
    });

    document.querySelectorAll("[data-mission-tier]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-mission-tier]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.missionTier = btn.getAttribute("data-mission-tier");
        renderMissions();
      });
    });

    // 8. Beaches Forecast Controls
    document.querySelectorAll("[data-forecast-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-forecast-mode]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.forecastMode = btn.getAttribute("data-forecast-mode");
        const customBar = document.getElementById("custom-condition-bar");
        if (customBar) customBar.style.display = state.forecastMode === "custom" ? "inline-flex" : "none";
      });
    });

    document.querySelectorAll("[data-cond-set]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-cond-set]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.customCondition = btn.getAttribute("data-cond-set");
      });
    });

    // 9. Quiver Prev/Next & Buy/Ride Action
    document.getElementById("board-prev")?.addEventListener("click", () => {
      state.selectedBoard = (state.selectedBoard - 1 + BOARDS.length) % BOARDS.length;
    });
    document.getElementById("board-next")?.addEventListener("click", () => {
      state.selectedBoard = (state.selectedBoard + 1) % BOARDS.length;
    });
    document.getElementById("inspector-action-btn")?.addEventListener("click", () => {
      const idx = state.selectedBoard;
      const b = BOARDS[idx];
      if (state.ownedBoards.includes(idx)) {
        state.ridingBoard = idx;
        showToast(`¡Ahora estás surfeando con ${b.name}!`);
      } else if (state.money >= b.price) {
        state.money = state.money - b.price;
        state.ownedBoards = [...state.ownedBoards, idx];
        state.ridingBoard = idx;
        updateWalletUI(-b.price);
        showToast(`¡Compraste ${b.name} por $${b.price}!`);
      } else {
        const needed = b.price - state.money;
        state.money = state.money + needed;
        updateWalletUI(needed);
        showToast(`Recompensa de salvavidas recibida: +$${needed}. ¡Ya puedes comprar ${b.name}!`);
      }
      renderBoards();
      renderSessionStrip();
    });

    // 10. Paint Studio Controls
    document.querySelectorAll("[data-paint-part]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-paint-part]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.paintPart = btn.getAttribute("data-paint-part");
      });
    });

    const hueInput = document.getElementById("hue-slider");
    const satInput = document.getElementById("sat-slider");
    const briInput = document.getElementById("bri-slider");
    function updateFromSliders() {
      const hex = hslToHex(Number(hueInput.value), Number(satInput.value), Number(briInput.value) * 0.65);
      state.boardPaint = { ...state.boardPaint, [state.paintPart]: hex };
    }
    hueInput?.addEventListener("input", updateFromSliders);
    satInput?.addEventListener("input", updateFromSliders);
    briInput?.addEventListener("input", updateFromSliders);

    document.getElementById("paint-reset")?.addEventListener("click", () => {
      state.boardPaint = { fill: "#FFF9D2", rail: "#5CE6E0", fins: "#1FB5C1" };
      showToast("Colores originales restaurados");
    });

    // 11. Surfer Character Editor Tabs
    document.querySelectorAll("[data-surfer-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-surfer-tab]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.surferTab = btn.getAttribute("data-surfer-tab");
        renderSurferEditor();
      });
    });

    // 12. Lightbox Modal
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const modalCap = document.getElementById("lightbox-caption");
    function openLightbox(src, caption) {
      if (!modal || !modalImg) return;
      modalImg.src = src;
      if (modalCap) modalCap.textContent = caption || "SurfVR Sea Glass UI";
      modal.classList.add("open");
    }
    document.querySelectorAll("[data-lightbox]").forEach((el) => {
      el.addEventListener("click", () => {
        const img = el.tagName === "IMG" ? el : el.querySelector("img");
        if (img) openLightbox(img.src, el.getAttribute("data-lightbox"));
      });
    });
    document.getElementById("hero-frame-lightbox")?.addEventListener("click", () => {
      const img = document.getElementById("hero-main-img");
      if (img) openLightbox(img.src, "SurfVR Gameplay");
    });
    document.getElementById("lightbox-close")?.addEventListener("click", () => modal?.classList.remove("open"));
    modal?.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") modal?.classList.remove("open"); });

    // Subscribe to reactive store changes
    subscribe(() => {
      renderSessionStrip();
      renderBeaches();
      renderBoards();
      renderPaintStudio();
    });

    // Initial render
    renderSessionStrip();
    renderBeaches();
    renderBoards();
    renderMissions();
    renderPaintStudio();
    renderSurferEditor();
  });
})();
