document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("click",(e)=>{
    const link = card.closest("a");
    if(link) return; // ✅ allow anchor to work
  });
});
