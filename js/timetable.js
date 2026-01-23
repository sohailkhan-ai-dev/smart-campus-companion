const timetable = [
  { time: "9:00 - 10:00", Mon: "DBMS", Tue: "OS", Wed: "CN", Thu: "COA", Fri: "DBMS" },
  { time: "10:00 - 11:00", Mon: "OS", Tue: "CN", Wed: "DBMS", Thu: "OS", Fri: "COA" },
  { time: "11:00 - 12:00", Mon: "CN", Tue: "DBMS", Wed: "OS", Thu: "CN", Fri: "IC" },

  { time: "12:00 - 1:00", Mon: "LUNCH", Tue: "LUNCH", Wed: "LUNCH", Thu: "LUNCH", Fri: "LUNCH" },

  { time: "1:00 - 2:00", Mon: "COA", Tue: "OS", Wed: "LAB", Thu: "DBMS", Fri: "CN" },
  { time: "2:00 - 3:00", Mon: "LAB", Tue: "COA", Wed: "LAB", Thu: "OS", Fri: "COA" },
  { time: "3:00 - 4:00", Mon: "IC", Tue: "CN", Wed: "COA", Thu: "LAB", Fri: "OS" },
  { time: "4:00 - 5:00", Mon: "DBMS", Tue: "IC", Wed: "CN", Thu: "IC", Fri: "LAB" }
];

const tbody = document.getElementById("timetableBody");

timetable.forEach(row => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${row.time}</td>
    <td>${format(row.Mon)}</td>
    <td>${format(row.Tue)}</td>
    <td>${format(row.Wed)}</td>
    <td>${format(row.Thu)}</td>
    <td>${format(row.Fri)}</td>
  `;

  tbody.appendChild(tr);
});

function format(subject) {
  if (subject === "LUNCH") {
    return `<span class="lunch">LUNCH</span>`;
  }
  return `<span class="subject">${subject}</span>`;
}
