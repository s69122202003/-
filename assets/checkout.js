// ===== Clover// disc exchange — checkout page logic =====
// Demonstrates: if-else, && (AND), || (OR), ! (NOT), Set, reduce()

const cartList = document.getElementById("cartList");
const alsoLikeSection = document.getElementById("alsoLikeSection");
const alsoLikeGrid = document.getElementById("alsoLikeGrid");
let isMember = false;

document.getElementById("isMember").addEventListener("change", e => {
  isMember = e.target.checked;
  render();
});

cartList.addEventListener("click", e => {
  const cart = getCart();
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rem = e.target.closest("[data-rem]");
  if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
  if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
  if (rem) setQty(rem.dataset.rem, 0);
  render();
});

alsoLikeGrid.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (btn) { addToCart(btn.dataset.add); render(); }
});

function render() {
  const cart = getCart();                       // { id: qty }
  const cartIds = Object.keys(cart);
  const items = cartIds
    .map(id => ({ game: CATALOG.find(g => g.id === id), qty: cart[id] }))
    .filter(row => row.game); // guard against stale ids

  // ---------- empty state ----------
  if (items.length === 0) {
    cartList.innerHTML = `<div class="empty-cart">ตะกร้าว่างเปล่า — <a href="products.html" style="color:var(--cyan)">ไปเลือกแผ่นเกมกันเถอะ</a></div>`;
  } else {
    cartList.innerHTML = items.map(({ game, qty }) => `
      <div class="cart-item">
        <div class="cart-thumb${game.cover ? "" : " no-cover"}">${game.cover ? coverHTML(game) : spineStripHTML(game.genres)}</div>
        <div>
          <div class="cart-title">${game.title}</div>
          <div class="cart-sub">${game.genres.join(" / ")} · ${game.condition === "new" ? "แผ่นใหม่" : "มือสอง"} · ${formatPrice(game.price)}</div>
        </div>
        <div class="qty-box">
          <button data-dec="${game.id}">−</button>
          <span>${qty}</span>
          <button data-inc="${game.id}" ${qty >= game.stock ? "disabled" : ""}>+</button>
        </div>
        <button class="remove-link" data-rem="${game.id}" title="นำออก">✕</button>
      </div>
    `).join("");
  }

  // ---------- totals ----------
  const subtotal = items.reduce((sum, { game, qty }) => sum + game.price * qty, 0);
  const totalQty = items.reduce((sum, { qty }) => sum + qty, 0);

  // distinct genres in the cart, as a Set — used for the "mix bonus"
  const cartGenreSet = new Set(items.flatMap(({ game }) => game.genres));

  // ---- rule 1: quantity discount (if-else) ----
  let qtyDiscount = 0;
  if (totalQty >= 3) qtyDiscount = Math.round(subtotal * 0.10);

  // ---- rule 2: genre-mix discount — reward mixing >=2 different genres ----
  let mixDiscount = 0;
  if (cartGenreSet.size >= 2 && totalQty >= 2) mixDiscount = 30;

  // ---- rule 3: member discount (AND) ----
  let memberDiscount = 0;
  if (isMember && subtotal >= 1000) memberDiscount = 50;

  // ---- rule 4: free shipping (OR), otherwise flat fee ----
  let shipping = 60;
  if (subtotal >= 1500 || totalQty >= 4) shipping = 0;

  const total = Math.max(0, subtotal - qtyDiscount - mixDiscount - memberDiscount) + shipping;

  document.getElementById("rSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("rQtyDisc").textContent = "− " + formatPrice(qtyDiscount);
  document.getElementById("rMixDisc").textContent = "− " + formatPrice(mixDiscount);
  document.getElementById("rMemberDisc").textContent = "− " + formatPrice(memberDiscount);
  document.getElementById("rShipping").textContent = shipping === 0 ? "ฟรี" : formatPrice(shipping);
  document.getElementById("rTotal").textContent = formatPrice(total);

  // ---- promo note: combines AND / OR / NOT to explain what's missing ----
  const note = document.getElementById("promoNote");
  const needForFreeShip = 1500 - subtotal;
  // NOT eligible for free shipping yet, and not enough items either
  if (!(subtotal >= 1500 || totalQty >= 4) && items.length > 0) {
    note.className = "promo-note no";
    note.innerHTML = `ซื้อเพิ่มอีก <b>${formatPrice(Math.max(0, needForFreeShip))}</b> หรือครบ 4 ชิ้น เพื่อรับส่งฟรี`;
  } else if (items.length > 0) {
    note.className = "promo-note ok";
    note.innerHTML = `🎉 คุณได้รับส่งฟรีแล้ว!`;
  } else {
    note.innerHTML = "";
  }

  const placeBtn = document.getElementById("placeOrderBtn");
  placeBtn.disabled = items.length === 0;

  // ---------- "also like": Set difference (catalog − cart), filtered by genre overlap ----------
  const inCartIds = new Set(cartIds);
  let candidates;
  if (cartGenreSet.size > 0) {
    candidates = CATALOG.filter(g =>
      !inCartIds.has(g.id) && g.stock > 0 && g.genres.some(x => cartGenreSet.has(x))
    );
  } else {
    candidates = CATALOG.filter(g => g.stock > 0);
  }
  alsoLikeSection.style.display = candidates.length ? "block" : "none";
  alsoLikeGrid.innerHTML = candidates.slice(0, 4).map(g => `
    <div class="mini-card">
      <div class="case-cover${g.cover ? "" : " disc-rings"}" style="height:64px;margin-bottom:8px;">${coverHTML(g)}</div>
      <div class="t">${g.title}</div>
      <div class="p">${formatPrice(g.price)}</div>
      <button class="add-btn" data-add="${g.id}">+ ใส่ตะกร้า</button>
    </div>
  `).join("");

  updateCartPill();
}

render();
