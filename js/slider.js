let index = 0;

const slides = document.getElementById("slides");
const dotsWrap = document.getElementById("dots");
const total = slides.children.length;


for (let i = 0; i < total; i++) {
  const dot = document.createElement("div");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
}

function update() {
  slides.style.transform = `translateX(-${index * 100}%)`;
  [...dotsWrap.children].forEach((d, i) =>
    d.classList.toggle("active", i === index)
  );
}

function goTo(i) {
  index = (i + total) % total;
  update();
}


setInterval(() => {
  index = (index + 1) % total;
  update();
}, 5000);
