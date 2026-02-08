const API_URL = "https://script.google.com/macros/s/AKfycbyjvsULkiZOOJIUuqy4xENFRutNL8yt_Th9B_YA6ec5c89xxbxjiuVTbYH5tQIP4YbzmQ/exec";

async function loadProducts(){

  const res = await fetch(API_URL);
  const data = await res.json();

  const products = data.products;

  const grid = document.getElementById("productGrid");
  const select = document.getElementById("productSelect");

  grid.innerHTML = products.map(p => `
    <div class="card">
      <div class="product__img">
        ${p.image_url ? `<img src="${p.image_url}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">` : `Plug2Plug`}
      </div>

      <div class="muted small">${p.tag || ""}</div>
      <h3>${p.name}</h3>

      <div class="price">
        ${p.old_price_thb ? `<del>฿${Number(p.old_price_thb).toLocaleString()}</del>`:""}
        <b>฿${Number(p.price_thb).toLocaleString()}</b>
      </div>

      <button class="btn btn--primary" onclick="pickProduct('${p.sku}')">
        สนใจรุ่นนี้
      </button>
    </div>
  `).join("");

  select.innerHTML = products.map(p =>
    `<option value="${p.sku}">${p.name}</option>`
  ).join("");
}

loadProducts();

function thb(n){
  if(!n) return "สอบถาม";
  return "฿" + n.toLocaleString("th-TH");
}

function renderProducts(){
  const grid = document.getElementById("productGrid");
  const select = document.getElementById("productSelect");

  grid.innerHTML = products.map(p => `
    <div class="card">
      <div class="product__img">ใส่รูป ${p.sku}</div>
      <div class="muted small">${p.tag}</div>
      <h3 style="margin:6px 0 6px;">${p.name}</h3>
      <div class="price">
        ${p.oldPrice ? `<del>${thb(p.oldPrice)}</del>` : ``}
        <b>${thb(p.price)}</b>
      </div>
      <button class="btn btn--primary" onclick="pickProduct('${p.sku}')">สนใจรุ่นนี้</button>
    </div>
  `).join("");

  select.innerHTML = `<option value="">--- กรุณาเลือกสินค้า ---</option>` + products.map(p =>
    `<option value="${p.sku}">${p.name} (${thb(p.price)})</option>`
  ).join("");
}

window.pickProduct = function(sku){
  const select = document.getElementById("productSelect");
  select.value = sku;
  location.hash = "#booking";
};

function setupBooking(){
  const form = document.getElementById("bookingForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    const product = products.find(p => p.sku === data.product);
    const msg =
`📌 ขอจองคิวติดตั้ง
ชื่อ: ${data.fullname}
โทร: ${data.phone}
Line: ${data.lineid || "-"}
รุ่น: ${product ? product.name : data.product}
ราคา: ${product ? thb(product.price) : "-"}
วันเวลา: ${data.datetime}

(ส่งจากหน้าเว็บ Plug2Plug)`;

    // เปลี่ยน @plug2plug เป็น LINE OA ของคุณ
    const lineUrl = "https://line.me/R/oaMessage/@plug2plug/?" + encodeURIComponent(msg);
    window.open(lineUrl, "_blank");
  });
}

function setupMenu(){
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  burger.addEventListener("click", () => nav.classList.toggle("is-open"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));
}

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
setupBooking();
setupMenu();