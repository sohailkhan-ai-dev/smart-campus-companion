document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburgerBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  const darkToggle = document.getElementById("darkModeToggle");

  if (!btn || !sidebar || !overlay) {
    console.error("Hamburger elements not found");
    return;
  }

  
  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  }

  btn.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      
      if (e.currentTarget.id !== "darkModeToggle") closeSidebar();
    });
  });

  
  function setDarkMode(isDark) {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", isDark ? "on" : "off");

    if (darkToggle) {
      darkToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  }

  
  const saved = localStorage.getItem("darkMode"); 
  setDarkMode(saved === "on");

  
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const isDarkNow = document.body.classList.contains("dark");
      setDarkMode(!isDarkNow);
    });
  }
});
