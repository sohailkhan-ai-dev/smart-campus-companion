function markAttendance(rollNo, status) {
  let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

  attendance[rollNo] = status;
  localStorage.setItem("attendance", JSON.stringify(attendance));

  document.getElementById("message").innerText =
    `Roll No ${rollNo} marked as ${status}`;
}
