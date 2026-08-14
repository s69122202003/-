// ===== Clover// disc exchange — home page logic =====
// Demonstrates: Set (unique genre list, size), if-else chains, filter/includes

// ---------- 1. build the hero carousel ----------
// Each game becomes one cover-art card. Cards fade/rise in with a staggered
// delay on load, then the row scrolls natively (drag, trackpad, or the
// prev/next buttons) with CSS scroll-snap doing the alignment.
const carousel = document.getElementById("heroCarousel");
const carPrev = document.getElementById("carPrev");
const carNext = document.getElementById("carNext");

CATALOG.forEach((game, i) => {
  const card = document.createElement("div");
  card.innerHTML = renderCaseCard(game); // read-only card, no add-to-cart button
  const el = card.firstElementChild;
  el.style.setProperty("--delay", `${i * 45}ms`);
  el.setAttribute("role", "button");
  el.tabIndex = 0;
  el.setAttribute("aria-label", `${game.title} — ${game.genres.join(", ")} — ${formatPrice(game.price)}`);
  el.addEventListener("click", () => {
    window.location.href = `products.html?genre=${encodeURIComponent(game.genres[0])}`;
  });
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
  });
  carousel.appendChild(el);
});

function updateCarButtons() {
  const max = carousel.scrollWidth - carousel.clientWidth - 4;
  carPrev.disabled = carousel.scrollLeft <= 4;
  carNext.disabled = carousel.scrollLeft >= max;
}
carPrev.addEventListener("click", () => carousel.scrollBy({ left: -380, behavior: "smooth" }));
carNext.addEventListener("click", () => carousel.scrollBy({ left: 380, behavior: "smooth" }));
carousel.addEventListener("scroll", updateCarButtons);
window.addEventListener("resize", updateCarButtons);
updateCarButtons();

// ---------- 2. genre pills, built from a Set ----------
// ALL_GENRES (defined in data.js) is already deduplicated via `new Set(...)`.
// We show that Set's size in a data attribute purely as a discrete-math nod.
const genreRow = document.getElementById("genreRow");
genreRow.dataset.setSize = ALL_GENRES.size ?? ALL_GENRES.length;

let selectedGenre = null; // null = no filter selected yet

ALL_GENRES.forEach(genre => {
  const pill = document.createElement("button");
  pill.className = "genre-pill";
  pill.innerHTML = `<span class="dot" style="background:${GENRE_COLORS[genre]}"></span>${genre}`;
  pill.addEventListener("click", () => {
    // toggle: clicking the active pill again clears the filter
    selectedGenre = (selectedGenre === genre) ? null : genre;
    renderGenreState();
  });
  genreRow.appendChild(pill);
});

// applies the "soft tint" look (light bg, colored text/border) used for
// every colored chip across the site — keeps the palette restrained
function tintStyle(hex) {
  return `background:${hex}1A;color:${hex};border-color:${hex}66`;
}

function renderGenreState() {
  // refresh active styling
  [...genreRow.children].forEach(pill => {
    const g = pill.textContent.trim();
    const active = g === selectedGenre;
    pill.classList.toggle("active", active);
    pill.style.cssText = active ? tintStyle(GENRE_COLORS[g]) : "";
  });

  // results = games whose genre-Set includes the selected genre AND has stock
  const results = selectedGenre
    ? CATALOG.filter(g => g.genres.includes(selectedGenre) && g.stock > 0)
    : CATALOG.filter(g => g.stock > 0);

  const recTag = document.getElementById("recTag");
  const recText = document.getElementById("recText");

  // ---- if-else chain drives the recommendation copy ----
  if (!selectedGenre) {
    recTag.textContent = "ALL";
    recTag.style.cssText = ""; // fall back to the default accent-tint styling
    recText.innerHTML = `ยังไม่ได้เลือกแนวเกม — กำลังแสดงแผ่นที่มีของทั้งหมด <b>${results.length}</b> รายการ`;
  } else if (results.length === 0) {
    recTag.textContent = selectedGenre;
    recTag.style.cssText = tintStyle(GENRE_COLORS[selectedGenre]);
    recText.innerHTML = `แนว <b>${selectedGenre}</b> ตอนนี้แผ่นหมดสต็อกทุกรายการ ลองดูแนวอื่นก่อนนะ`;
  } else if (results.length <= 2) {
    recTag.textContent = selectedGenre;
    recTag.style.cssText = tintStyle(GENRE_COLORS[selectedGenre]);
    recText.innerHTML = `แนว <b>${selectedGenre}</b> เหลือของไม่เยอะ — มี <b>${results.length}</b> รายการ รีบเลยก่อนหมด`;
  } else {
    recTag.textContent = selectedGenre;
    recTag.style.cssText = tintStyle(GENRE_COLORS[selectedGenre]);
    recText.innerHTML = `แนว <b>${selectedGenre}</b> มีของพร้อมส่ง <b>${results.length}</b> รายการ`;
  }

  // update picks heading + grid
  document.getElementById("pickHeading").textContent = selectedGenre
    ? `แนะนำแนว ${selectedGenre}`
    : "แผ่นแนะนำ";
  document.getElementById("pickEyebrow").textContent = selectedGenre
    ? "กรองจากแนวที่เลือก"
    : "มาใหม่ทุกสัปดาห์";

  const pickGrid = document.getElementById("pickGrid");
  pickGrid.innerHTML = results.slice(0, 4).map(g => renderCaseCard(g)).join("");
}

renderGenreState(); // initial paint
