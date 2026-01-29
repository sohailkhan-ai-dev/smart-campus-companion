
const ZONES = [
  { id: "library",   name: "Library",    capacity: 120 },
  { id: "canteen",   name: "Canteen",    capacity: 80  },
  { id: "auditorium",name: "Auditorium", capacity: 300 },
  { id: "gym",       name: "Gym",        capacity: 60  },
  { id: "lab",       name: "Computer Lab", capacity: 50 },
  { id: "admin",     name: "Admin Block", capacity: 40 },
];

// Storage key
const KEY = "campusCrowdData_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getPct(count, cap) {
  if (!cap) return 0;
  return Math.round((count / cap) * 100);
}

function crowdLabel(pct) {
  if (pct < 40) return { text: "Low ✅", cls: "low" };
  if (pct < 75) return { text: "Medium ⚠", cls: "med" };
  return { text: "High 🔴", cls: "high" };
}

function render(filterText = "") {
  const state = loadState();
  const grid = document.getElementById("zoneGrid");
  const q = String(filterText || "").toLowerCase().trim();

  const zones = ZONES.filter(z =>
    !q || z.name.toLowerCase().includes(q) || z.id.toLowerCase().includes(q)
  );

  grid.innerHTML = zones.map(z => {
    const count = Number(state[z.id] || 0);
    const pct = clamp(getPct(count, z.capacity), 0, 100);
    const label = crowdLabel(pct);

    return `
      <div class="card" data-zone="${z.id}">
        <div class="card-top">
          <div>
            <div class="zone-title">${z.name}</div>
            <div class="zone-meta">Capacity: ${z.capacity} • Seats free: ${Math.max(0, z.capacity - count)}</div>
          </div>
          <div class="pill ${label.cls}">${label.text}</div>
        </div>

        <div class="big">
          <div class="count">${count}</div>
          <div class="cap">/ ${z.capacity}</div>
        </div>

        <div class="bar"><div class="fill" style="width:${pct}%"></div></div>

        <div class="actions">
          <button class="btn" data-action="in">+ Enter</button>
          <button class="btn danger" data-action="out">- Exit</button>
          <button class="btn ghost" data-action="reset">Reset</button>
        </div>
      </div>
    `;
  }).join("");

  // attach events
  grid.querySelectorAll(".card").forEach(card => {
    const zoneId = card.getAttribute("data-zone");

    card.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        const st = loadState();
        const current = Number(st[zoneId] || 0);

        const zone = ZONES.find(x => x.id === zoneId);
        if (!zone) return;

        if (action === "in") st[zoneId] = clamp(current + 1, 0, zone.capacity);
        if (action === "out") st[zoneId] = clamp(current - 1, 0, zone.capacity);
        if (action === "reset") st[zoneId] = 0;

        saveState(st);
        render(document.getElementById("search").value);
      });
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search");
  const resetAll = document.getElementById("resetAll");

  render("");

  search.addEventListener("input", () => render(search.value));

  resetAll.addEventListener("click", () => {
    const ok = confirm("Reset ALL zones to 0?");
    if (!ok) return;
    const empty = {};
    ZONES.forEach(z => empty[z.id] = 0);
    saveState(empty);
    render(search.value);
  });

  // update across tabs on same laptop
  window.addEventListener("storage", () => render(search.value));
});
