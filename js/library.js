
const FINE_PER_DAY = 20; 


const issuedBooks = [
  { title: "Database System Concepts", author: "Silberschatz", subject: "DBMS", issue: "2026-01-05", due: "2026-01-20" },
  { title: "Operating System Concepts", author: "Silberschatz", subject: "OS", issue: "2026-01-10", due: "2026-01-24" },
  { title: "Computer Networks", author: "Tanenbaum", subject: "CN", issue: "2026-01-12", due: "2026-01-18" },
  { title: "Computer Organization and Design", author: "Patterson", subject: "COA", issue: "2026-01-15", due: "2026-01-30" },
];


const catalog = [
  { title: "Database System Concepts", author: "Silberschatz", subject: "DBMS" },
  { title: "Operating System Concepts", author: "Silberschatz", subject: "OS" },
  { title: "Computer Networks", author: "Tanenbaum", subject: "CN" },
  { title: "Computer Organization and Design", author: "Patterson", subject: "COA" },
  { title: "Indian Polity", author: "M. Laxmikanth", subject: "IC" },
  { title: "Let Us C", author: "Yashavant Kanetkar", subject: "Programming" },
];

document.getElementById("finePerDayText").innerText = FINE_PER_DAY;

const today = new Date();
document.getElementById("todayText").innerText =
  `Today: ${today.toLocaleDateString()}`;

function daysLate(dueDateStr) {
  const due = new Date(dueDateStr + "T00:00:00");
  const diff = today - due;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

function daysUntil(dueDateStr) {
  const due = new Date(dueDateStr + "T00:00:00");
  const diff = due - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function statusFor(dueDateStr) {
  const late = daysLate(dueDateStr);
  if (late > 0) return { text: `Overdue (${late} day${late > 1 ? "s" : ""})`, cls: "over" };

  const left = daysUntil(dueDateStr);
  if (left <= 3) return { text: `Due Soon (${left} day${left !== 1 ? "s" : ""})`, cls: "soon" };

  return { text: "On Time", cls: "ok" };
}

function renderIssued() {
  const wrap = document.getElementById("issuedList");
  let totalFine = 0;

  wrap.innerHTML = issuedBooks.map(b => {
    const late = daysLate(b.due);
    const fine = late * FINE_PER_DAY;
    totalFine += fine;

    const st = statusFor(b.due);

    return `
      <div class="item">
        <div class="item-top">
          <div class="title">${b.title} <span class="muted small">(${b.subject})</span></div>
          <div class="badge ${st.cls}">${st.text}</div>
        </div>
        <div class="meta">
          <div>Author: <b>${b.author}</b></div>
          <div>Issued: <b>${formatDate(b.issue)}</b></div>
          <div>Due: <b>${formatDate(b.due)}</b></div>
          <div>Fine: <b>₹${fine}</b></div>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("totalFine").innerText = `₹${totalFine}`;
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString();
}

renderIssued();


function doSearch() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsWrap = document.getElementById("searchResults");

  if (!q) {
    resultsWrap.innerHTML = `<div class="muted small">Type something to search.</div>`;
    return;
  }

  const matches = catalog.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.subject.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    resultsWrap.innerHTML = `<div class="muted small">No results found.</div>`;
    return;
  }

  resultsWrap.innerHTML = matches.map(b => `
    <div class="item">
      <div class="item-top">
        <div class="title">${b.title}</div>
        <div class="badge ok">${b.subject}</div>
      </div>
      <div class="meta">
        <div>Author: <b>${b.author}</b></div>
        <div>Category: <b>${b.subject}</b></div>
      </div>
    </div>
  `).join("");
}

document.getElementById("searchBtn").addEventListener("click", doSearch);
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch();
});
