// /js/auth.js

const STUDENTS = [
  { id: "S101", name: "Sohail Khan", email: "sohail@gmail.com", password: "1234", semester: 3 },
  { id: "S102", name: "Ali Ahmed",   email: "ali@gmail.com",    password: "1234", semester: 3 },
  { id: "S103", name: "Sana",        email: "sana@gmail.com",   password: "1234", semester: 4 },
];

const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  if (!emailEl || !passEl) {
    alert("Login inputs missing IDs. Add id='email' and id='password' in login.html");
    return;
  }

  const email = emailEl.value.trim().toLowerCase();
  const password = passEl.value.trim();

  const student = STUDENTS.find(s => s.email === email && s.password === password);

  if (!student) {
    alert("Invalid email or password.\nTry: sohail@gmail.com / 1234");
    return;
  }

  // Save logged in student object
  localStorage.setItem("loggedInStudent", JSON.stringify({
    id: student.id,
    name: student.name,
    semester: student.semester,
    email: student.email
  }));

 
  window.location.href = "dashboard.html"; 

});
