const products = [
  { sku: "T5-2-64", name: "T5 RAM 2 ROM 64", oldPrice: 6000, price: 5000, tag: "ยอดนิยม" },
  { sku: "T6-3-64", name: "T6 RAM 3 ROM 64", oldPrice: 6900, price: 5900, tag: "คุ้มค่า" },
  { sku: "Q10-6-128", name: "Q10 RAM 6 ROM 128", oldPrice: 18000, price: 17000, tag: "Q-Series" },
  { sku: "Q11-8-256", name: "Q11 RAM 8 ROM 256", oldPrice: 20900, price: 19900, tag: "ตัวท็อป" },
  { sku: "Q12-12-256", name: "Q12 RAM 12 ROM 256", oldPrice: 25900, price: 24900, tag: "ตัวท็อป" },
  { sku: "CAM-360", name: "กล้อง 360° (แพ็คเกจ)", oldPrice: 0, price: 0, tag: "สอบถามราคา" },
];

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