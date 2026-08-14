// ===== Clover// disc exchange — shared UI helpers =====

function formatPrice(n) {
  return n.toLocaleString("th-TH") + " บาท";
}

function genreTagsHTML(genres) {
  // soft tint background + colored text/border — minimal, not a solid fill
  return genres.map(g => {
    const c = GENRE_COLORS[g];
    return `<span style="background:${c}1A;color:${c};border:1px solid ${c}40">${g}</span>`;
  }).join("");
}

function spineStripHTML(genres) {
  // one colored sliver per genre the game belongs to (visual Set membership)
  return genres.map(g => `<i style="background:${GENRE_COLORS[g]}"></i>`).join("");
}

// If a game has a `cover` path, show the real image; otherwise fall back to
// the text-on-rings placeholder so cards still look fine without artwork yet.
function coverHTML(game) {
  if (game.cover) {
    return `<img src="${game.cover}" alt="ปกเกม ${game.title}" loading="lazy"
              onerror="this.closest('.case-cover').classList.add('disc-rings');
                       this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${game.title.replace(/'/g, "\\'")}'}))">`;
  }
  return game.title;
}

// Renders one product as a "case card". `onAdd` is optional — products/checkout
// pages pass a callback, the home page can omit it for a simpler read-only card.
function renderCaseCard(game, onAddId) {
  const inStock = game.stock > 0;
  return `
    <div class="case-card">
      <div class="case-spine">${spineStripHTML(game.genres)}</div>
      ${!inStock ? `<div class="case-oos">สินค้าหมด</div>` : ""}
      <div class="case-body">
        <div class="case-cover${game.cover ? "" : " disc-rings"}">${coverHTML(game)}</div>
        <div class="case-tags">${genreTagsHTML(game.genres)}</div>
        <div class="case-title">${game.title}</div>
        <div class="case-blurb">${game.blurb}</div>
        <div class="case-foot">
          <span class="case-price">${formatPrice(game.price)}</span>
          <span class="case-cond">${game.condition === "new" ? "แผ่นใหม่" : "มือสอง"}</span>
        </div>
        ${onAddId ? `<button class="add-btn" data-add="${game.id}" ${inStock ? "" : "disabled"}>
          ${inStock ? "+ ใส่ตะกร้า" : "สินค้าหมด"}
        </button>` : ""}
      </div>
    </div>`;
}

// ---------- cart (localStorage) ----------
const CART_KEY = "clover_cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartPill();
}
function setQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
  updateCartPill();
}
function cartCount() {
  return Object.values(getCart()).reduce((a, b) => a + b, 0);
}
function updateCartPill() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cartCount();
}

document.addEventListener("DOMContentLoaded", updateCartPill);
