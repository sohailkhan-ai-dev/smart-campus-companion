const chatbotBox = document.getElementById("chatbotBox");
const toggleBtn = document.getElementById("chatbotToggle");
const askBtn = document.getElementById("chatAskBtn");

function toggleChat() {
 
  if (chatbotBox.style.display === "block") {
    chatbotBox.style.display = "none";
  } else {
    chatbotBox.style.display = "block";
  }
}

function chat() {
  const q = document.getElementById("chatInput").value.toLowerCase();
  const reply = document.getElementById("chatReply");

  if (q.includes("class")) {
    reply.innerText = "Your next class is AI Lab at 10 AM.";
  } else if (q.includes("exam")) {
    reply.innerText = "Mid-sem exams start from 20th March.";
  } else if (q.includes("library")) {
    reply.innerText = "Library is open from 9 AM to 8 PM.";
  } else {
    reply.innerText = "Sorry, I don't understand yet 🙂";
  }
}


toggleBtn.addEventListener("click", toggleChat);
askBtn.addEventListener("click", chat);


document.getElementById("chatInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") chat();
});