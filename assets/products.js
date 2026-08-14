// ===== Clover// disc exchange — products page logic =====
// Demonstrates: Set (selectedGenres), Union, Intersection, Difference,
// Array.some() / .every() / .includes() / .filter()

const selectedGenres = new Set();
let matchMode = "union";     // "union" (∪) or "intersection" (∩)
let condition = "all";       // "all" | "new" | "used"
let maxPrice = 1800;
let hideOOS = true;

// preselect a genre if arriving from the home page shelf (?genre=Racing)
const urlGenre = new URLSearchParams(window.location.search).get("genre");
if (urlGenre && ALL_GENRES.includes(urlGenre)) selectedGenres.add(urlGenre);

// ---------- build genre checkboxes ----------
const genreChecks = document.getElementById("genreChecks");
ALL_GENRES.forEach(genre => {
  const id = "chk_" + genre;
  const label = document.createElement("label");
  label.className = "check";
  label.innerHTML = `
    <input type="checkbox" id="${id}" ${selectedGenres.has(genre) ? "checked" : ""}>
    <span class="sw" style="background:${GENRE_COLORS[genre]}"></span>${genre}`;
  label.querySelector("input").addEventListener("change", e => {
    if (e.target.checked) selectedGenres.add(genre);
    else selectedGenres.delete(genre);
    render();
  });
  genreChecks.appendChild(label);
});

// ---------- mode toggle ----------
const modeUnion = document.getElementById("modeUnion");
const modeInter = document.getElementById("modeInter");
modeUnion.addEventListener("click", () => { matchMode = "union"; modeUnion.classList.add("active"); modeInter.classList.remove("active"); render(); });
modeInter.addEventListener("click", () => { matchMode = "intersection"; modeInter.classList.add("active"); modeUnion.classList.remove("active"); render(); });

// ---------- condition + price + stock ----------
document.getElementById("conditionSelect").addEventListener("change", e => { condition = e.target.value; render(); });
document.getElementById("priceRange").addEventListener("input", e => {
  maxPrice = Number(e.target.value);
  document.getElementById("priceVal").textContent = maxPrice;
  render();
});
document.getElementById("hideOOS").addEventListener("change", e => { hideOOS = e.target.checked; render(); });

document.getElementById("clearFilters").addEventListener("click", () => {
  selectedGenres.clear();
  matchMode = "union"; modeUnion.classList.add("active"); modeInter.classList.remove("active");
  condition = "all"; document.getElementById("conditionSelect").value = "all";
  maxPrice = 1800; document.getElementById("priceRange").value = 1800; document.getElementById("priceVal").textContent = 1800;
  hideOOS = true; document.getElementById("hideOOS").checked = true;
  genreChecks.querySelectorAll("input").forEach(i => i.checked = false);
  render();
});

// ---------- product grid click delegation ----------
document.getElementById("productGrid").addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(btn.dataset.add);
});

// ---------- core filter + render ----------
function render() {
  let result = CATALOG;

  // Genre step: Union (some) vs Intersection (every) over the selected Set
  if (selectedGenres.size > 0) {
    if (matchMode === "union") {
      result = result.filter(g => g.genres.some(x => selectedGenres.has(x)));
    } else {
      result = result.filter(g => [...selectedGenres].every(x => g.genres.includes(x)));
    }
  }

  // Condition (simple equality, an if-else in disguise via ternary logic)
  if (condition !== "all") result = result.filter(g => g.condition === condition);

  // Price ceiling
  result = result.filter(g => g.price <= maxPrice);

  // Difference: remove the "out of stock" subset from the result set
  if (hideOOS) result = result.filter(g => g.stock > 0);

  // ---------- set-notation readout ----------
  const readout = document.getElementById("setReadout");
  if (selectedGenres.size === 0) {
    readout.innerHTML = `ยังไม่ได้เลือกแนวเกม → กำลังแสดงสินค้าทั้งหมด${hideOOS ? " − OutOfStock" : ""}`;
  } else {
    const list = [...selectedGenres];
    const opSymbol = matchMode === "union" ? " ∪ " : " ∩ ";
    const setNames = list.map(g => `Set(${g})`).join(opSymbol);
    readout.innerHTML = `<b>${setNames}</b>${hideOOS ? " − Set(OutOfStock)" : ""} = <b>${result.length}</b> รายการ`;
  }

  document.getElementById("resultCount").textContent = `${result.length} รายการ`;

  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  if (result.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    grid.innerHTML = result.map(g => renderCaseCard(g, true)).join("");
  }
}

render();
