console.log("✅ settings.js loaded");

function setDarkMode(on) {
  document.body.classList.toggle("dark", !!on);
  localStorage.setItem("darkMode", on ? "true" : "false");
}

function setCompact(on) {
  localStorage.setItem("compactMode", on ? "true" : "false");

  document.body.classList.toggle("compact", !!on);
}

function setNotifications(on) {
  localStorage.setItem("notificationsEnabled", on ? "true" : "false");
}

function updateNotifStatus() {
  const el = document.getElementById("notifStatus");
  if (!el) return;

  if (!("Notification" in window)) {
    el.textContent = "Notifications not supported in this browser.";
    return;
  }

  el.textContent = `Browser permission: ${Notification.permission}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const darkSwitch = document.getElementById("darkModeSwitch");
  const compactSwitch = document.getElementById("compactSwitch");
  const notifSwitch = document.getElementById("notifSwitch");

  const requestPermBtn = document.getElementById("requestPermBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  
  const darkOn = localStorage.getItem("darkMode") === "true";
  const compactOn = localStorage.getItem("compactMode") === "true";
  const notifOn = localStorage.getItem("notificationsEnabled") === "true";

  setDarkMode(darkOn);
  setCompact(compactOn);

  if (darkSwitch) darkSwitch.checked = darkOn;
  if (compactSwitch) compactSwitch.checked = compactOn;
  if (notifSwitch) notifSwitch.checked = notifOn;

  updateNotifStatus();

  
  darkSwitch?.addEventListener("change", () => setDarkMode(darkSwitch.checked));
  compactSwitch?.addEventListener("change", () => setCompact(compactSwitch.checked));

  notifSwitch?.addEventListener("change", async () => {
    const on = notifSwitch.checked;
    setNotifications(on);

    if (on && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
      updateNotifStatus();
    }
  });

  requestPermBtn?.addEventListener("click", async () => {
    if (!("Notification" in window)) return alert("Notifications not supported.");
    await Notification.requestPermission();
    updateNotifStatus();
  });

  logoutBtn?.addEventListener("click", () => {
    
    localStorage.removeItem("loggedInStudent");
   

    window.location.href = "login.html";
  });
});
