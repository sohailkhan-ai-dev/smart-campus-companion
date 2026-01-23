const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const editableFields = document.querySelectorAll(".detail p");

editBtn.addEventListener("click", () => {
  editableFields.forEach(p => p.contentEditable = "true");
});

saveBtn.addEventListener("click", () => {
  editableFields.forEach(p => p.contentEditable = "false");

  alert("Profile updated successfully!");

  // OPTIONAL: Save to localStorage
  const profileData = {};
  editableFields.forEach(p => {
    profileData[p.id] = p.innerText;
  });

  localStorage.setItem("studentProfile", JSON.stringify(profileData));
});

// Load saved data (if exists)
const saved = JSON.parse(localStorage.getItem("studentProfile"));
if (saved) {
  Object.keys(saved).forEach(id => {
    if (document.getElementById(id)) {
      document.getElementById(id).innerText = saved[id];
    }
  });
}
