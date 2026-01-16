function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }

  // Fake login (hackathon demo)
  if (email.includes("@") && password.length >= 4) {
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}