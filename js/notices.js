
const NEW_DAYS = 3;


const notices = [
  {
    id: 1,
    title: "Mid-Sem Exam Schedule Released (Sem 3)",
    category: "Exam",
    date: "2026-01-22",
    important: true,
    pinned: true,
    body: "Mid-Sem examination schedule for Semester 3 has been released. Please check the exam dates, timings, and venue details carefully.",
    attachment: "" 
  },
  {
    id: 2,
    title: "DBMS Assignment Submission Deadline",
    category: "Academic",
    date: "2026-01-23",
    important: false,
    pinned: false,
    body: "DBMS assignment (Unit 2) must be submitted by Friday. Late submissions will be accepted with a penalty as per department rules.",
    attachment: ""
  },
  {
    id: 3,
    title: "Placement Talk by Industry Expert",
    category: "Placement",
    date: "2026-01-21",
    important: true,
    pinned: false,
    body: "A placement guidance session will be conducted in Seminar Hall at 3 PM. Final-year and interested students are encouraged to attend.",
    attachment: ""
  },
  {
    id: 4,
    title: "Library Timing Update",
    category: "Library",
    date: "2026-01-20",
    important: false,
    pinned: false,
    body: "Library will remain open from 9:00 AM to 6:00 PM from Monday onwards. Please maintain silence and carry your ID card.",
    attachment: ""
  },
  {
    id: 5,
    title: "Holiday Notice: College Closed",
    category: "General",
    date: "2026-01-19",
    important: true,
    pinned: true,
    body: "College will remain closed tomorrow due to administrative work. Regular classes will resume from the next working day.",
    attachment: ""
  }
];

const pinnedList = document.getElementById("pinnedList");
const noticeList = document.getElementById("noticeList");
const countText = document.getElementById("countText");

const modalOverlay = document.getElementById("modalOverlay");
const noticeModal = document.getElementById("noticeModal");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalBody = document.getElementById("modalBody");
const modalActions = document.getElementById("modalActions");
const modalClose = document.getElementById("modalClose");

function isNew(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= NEW_DAYS;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString();
}

function noticeCard(n) {
  const preview = n.body.length > 90 ? n.body.slice(0, 90) + "..." : n.body;

  return `
    <div class="notice" data-id="${n.id}">
      <div class="notice-top">
        <div class="notice-title">${n.title}</div>

        <div class="badges">
          <span class="badge cat">${n.category}</span>
          ${n.important ? `<span class="badge important">IMPORTANT</span>` : ``}
          ${isNew(n.date) ? `<span class="badge new">NEW</span>` : ``}
        </div>
      </div>

      <div class="notice-meta">
        <div>Date: <b>${formatDate(n.date)}</b></div>
        <div>ID: <b>#${n.id}</b></div>
      </div>

      <div class="notice-preview">${preview}</div>
    </div>
  `;
}

function render(category = "ALL") {
  
  const pinned = notices.filter(n => n.pinned);
  pinnedList.innerHTML = pinned.length
    ? pinned.map(noticeCard).join("")
    : `<div class="muted small">No pinned notices.</div>`;

  
  const normal = notices.filter(n => !n.pinned);
  const filtered = category === "ALL" ? normal : normal.filter(n => n.category === category);

  countText.innerText = `${filtered.length} notice(s)`;

  noticeList.innerHTML = filtered.length
    ? filtered.map(noticeCard).join("")
    : `<div class="muted small">No notices in this category.</div>`;
}

function openModal(id) {
  const n = notices.find(x => x.id === Number(id));
  if (!n) return;

  modalTitle.innerText = n.title;
  modalMeta.innerText = `${n.category} • ${formatDate(n.date)} ${n.important ? "• IMPORTANT" : ""}`;
  modalBody.innerText = n.body;

  modalActions.innerHTML = "";
  if (n.attachment) {
    modalActions.innerHTML = `<a href="${n.attachment}" download>⬇ Download Attachment</a>`;
  }

  modalOverlay.classList.add("open");
  noticeModal.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
  noticeModal.classList.remove("open");
}

document.addEventListener("click", (e) => {
  const card = e.target.closest(".notice");
  if (card) openModal(card.dataset.id);
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.cat);
  });
});


render("ALL");



const headlineTrack = document.getElementById("headlineTrack");


const headlines = notices.filter(n => n.important);

function renderHeadlines() {
  if (!headlines.length) {
    document.querySelector(".headline-wrap").style.display = "none";
    return;
  }

  
  const items = [...headlines, ...headlines];

  headlineTrack.innerHTML = items.map(n => `
    <div class="headline-item" onclick="openModal(${n.id})">
      <span>📢 IMPORTANT:</span>
      <div>${n.title}</div>
    </div>
  `).join("");
}

renderHeadlines();
