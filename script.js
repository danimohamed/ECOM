/* ============ PRODUCT DATA ============ */
const products = [
  { id:1, name:"Volt Jacket",      price:220, badge:"NEW",       grad:"linear-gradient(135deg,#1a1a1a,#3d3d3d)" },
  { id:2, name:"Volt Pant",        price:170, badge:null,        grad:"linear-gradient(135deg,#0f0f0f,#2a2a2a)" },
  { id:3, name:"Volt Skull Cap",   price:40,  badge:"BEST",      grad:"linear-gradient(135deg,#222,#444)" },
  { id:4, name:"Newtype Tee",      price:65,  badge:null,        grad:"linear-gradient(135deg,#2c2c2c,#0a0a0a)" },
  { id:5, name:"Cargo Pant",       price:140, badge:null,        grad:"linear-gradient(135deg,#1c1c1c,#3a3a3a)" },
  { id:6, name:"Oversize Hoodie",  price:120, badge:"NEW",       grad:"linear-gradient(135deg,#0a0a0a,#2c2c2c)" },
  { id:7, name:"Tech Bermuda",     price:90,  badge:null,        grad:"linear-gradient(135deg,#262626,#0f0f0f)" },
  { id:8, name:"Heritage Jersey",  price:85,  badge:"PRE-ORDER", grad:"linear-gradient(135deg,#1a1a1a,#3d3d3d)" },
];

const fmt = (n) => n.toFixed(2).replace(".",",") + " €";

/* ============ RENDER PRODUCTS ============ */
const grid = document.getElementById("productGrid");
products.forEach(p => {
  const el = document.createElement("div");
  el.className = "product";
  el.innerHTML = `
    <div class="product-img">
      <div class="product-img-inner" style="background:${p.grad}"></div>
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
      <button class="product-add" data-id="${p.id}">+ AJOUTER AU PANIER</button>
    </div>
    <div class="product-name">${p.name}</div>
    <div class="product-price">${fmt(p.price)}</div>
  `;
  grid.appendChild(el);
});

/* ============ CART ============ */
const cart = [];
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function openCart(){ cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCart(){ cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function renderCart(){
  if(cart.length === 0){
    cartItems.innerHTML = `<p class="cart-empty">Ton panier est vide.</p>`;
  } else {
    cartItems.innerHTML = cart.map((it,i) => `
      <div class="cart-line">
        <div class="cart-line-img" style="background:${it.grad}"></div>
        <div class="cart-line-info">
          <h5>${it.name}</h5>
          <span>${fmt(it.price)} × ${it.qty}</span>
        </div>
        <button class="cart-line-remove" data-i="${i}">Retirer</button>
      </div>
    `).join("");
  }
  const total = cart.reduce((s,it) => s + it.price * it.qty, 0);
  const count = cart.reduce((s,it) => s + it.qty, 0);
  cartTotal.textContent = fmt(total);
  cartCount.textContent = count;
}

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".product-add");
  if(addBtn){
    const id = parseInt(addBtn.dataset.id, 10);
    const product = products.find(p => p.id === id);
    const existing = cart.find(it => it.id === id);
    if(existing){ existing.qty++; }
    else { cart.push({...product, qty:1}); }
    renderCart();
    openCart();
    return;
  }
  const rmBtn = e.target.closest(".cart-line-remove");
  if(rmBtn){
    const i = parseInt(rmBtn.dataset.i, 10);
    cart.splice(i,1);
    renderCart();
  }
});

renderCart();

/* ============ MOBILE NAV ============ */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mainNav.classList.remove("open")));
