const nameInput = document.getElementById("name");
const imgInput = document.getElementById("imgUrl");
const priceInput = document.getElementById("price");
const qtyInput = document.getElementById("quantity");
const saleCheckbox = document.getElementById("isSale");
const discountInput = document.getElementById("discount");
const addBtn = document.getElementById("addBtn");
const productList = document.getElementById("productList");
const emptyRow = document.getElementById("emptyRow");
const cartBtn = document.getElementById("cartBtn");
const drawer = document.getElementById("drawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const closeDrawer = document.getElementById("closeDrawer");

let editId = null;
let productsCounter = 0;
let cart = [];

window.addEventListener("DOMContentLoaded", () => {
    loadCartFromStorage();
    loadTableFromStorage();
    updateCartUI();
    renderEmptyRow();
});

function renderEmptyRow() {
    const rows = Array.from(productList.querySelectorAll("tr"));
    if (rows.length === 0) {
        productList.appendChild(emptyRow);
    }
    if (rows.length === 1 && !productList.contains(emptyRow)) {
        productList.appendChild(emptyRow);
    }
}

function formatNumber(n) {
    if (isNaN(n)) return "0";
    return Math.floor(n).toLocaleString();
}

function getProductsFromTable() {
    const rows = Array.from(productList.querySelectorAll("tr"));
    const products = [];
    rows.forEach((row) => {
        if (row === emptyRow) return;
        products.push({
            id: row.dataset.id,
            name: row.dataset.name,
            img: row.dataset.img,
            price: row.dataset.price,
            qty: row.dataset.qty,
            sale: row.dataset.sale,
            discount: row.dataset.discount,
            bought: row.dataset.bought,
        });
    });
    return products;
}

function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    const tableProducts = getProductsFromTable();
    localStorage.setItem("productsTable", JSON.stringify(tableProducts));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem("cart");
    cart = stored ? JSON.parse(stored) : [];
}

function loadTableFromStorage() {
    const stored = localStorage.getItem("productsTable");
    if (!stored) return;
    const products = JSON.parse(stored);
    products.forEach((product) => {
        if (emptyRow.parentElement) emptyRow.remove();
        const tr = document.createElement("tr");
        tr.dataset.id = product.id;
        tr.dataset.name = product.name;
        tr.dataset.img = product.img;
        tr.dataset.price = product.price;
        tr.dataset.qty = product.qty;
        tr.dataset.sale = product.sale;
        tr.dataset.discount = product.discount;
        tr.dataset.bought = product.bought;

        tr.innerHTML = `
            <td class="cell-img"><img src="${product.img}" alt=""></td>
            <td class="cell-name">${product.name}</td>
            <td class="cell-price">${product.price} so'm</td>
            <td class="cell-qty">${product.qty} dona</td>
            <td class="cell-discount">${
                product.sale === "true" ? product.discount + "%" : "Yo'q"
            }</td>
            <td class="table-actions">
                <button class="btn buy"><i class="fa-solid fa-cart-shopping"></i></button>
                <button class="btn edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn delete"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        productList.appendChild(tr);
    });
}

function updateCartUI() {
    if (!cartItems || !cartTotal || !cartBtn) return;
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item) => {
        const qty = parseInt(item.qty) || 1;
        const price = parseFloat(item.price) || 0;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.img || "default.jpg"}" alt="">
            <div class="info">
                <div>${item.name}</div>
                <div>${formatNumber(price)} so'm × ${qty}</div>
            </div>
        `;
        cartItems.appendChild(div);
        total += price * qty;
    });
    cartTotal.textContent = `Umumiy: ${formatNumber(total)} so'm`;
    cartBtn.textContent = `Savatcha(${cart.length})`;
    saveToStorage();
}

cartBtn.addEventListener("click", () => {
    drawer.classList.toggle("open");
});

closeDrawer.addEventListener("click", () => {
    drawer.classList.remove("open");
});

addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const img = imgInput.value.trim();
    const price = priceInput.value.trim();
    const qty = qtyInput.value.trim();
    const sale = saleCheckbox.checked;
    const discount = discountInput.value.trim();

    if (!name || !img || !price || !qty) {
        alert("Barcha maydonlarni to'ldiring!");
        return;
    }

    if (editId !== null) {
        const row = productList.querySelector(`tr[data-id="${editId}"]`);
        if (row) {
            row.querySelector(
                ".cell-img"
            ).innerHTML = `<img src="${img}" alt="">`;
            row.querySelector(".cell-name").textContent = name;
            row.querySelector(".cell-price").textContent = `${price} so'm`;
            row.querySelector(".cell-qty").textContent = `${qty} dona`;
            row.querySelector(".cell-discount").textContent = sale
                ? `${discount || 0}%`
                : "Yo'q";
            row.dataset.name = name;
            row.dataset.img = img;
            row.dataset.price = price;
            row.dataset.qty = qty;
            row.dataset.sale = sale ? "true" : "false";
            row.dataset.discount = discount || "";
            editId = null;
            addBtn.textContent = "Mahsulot Qo'shish";
            saveToStorage();
            return;
        }
    }

    if (emptyRow.parentElement) emptyRow.remove();
    const id = `p${productsCounter++}`;
    const tr = document.createElement("tr");
    tr.dataset.id = id;
    tr.dataset.name = name;
    tr.dataset.img = img;
    tr.dataset.price = price;
    tr.dataset.qty = qty;
    tr.dataset.sale = sale ? "true" : "false";
    tr.dataset.discount = discount || "";
    tr.dataset.bought = "false";

    tr.innerHTML = `
        <td class="cell-img"><img src="${img}" alt=""></td>
        <td class="cell-name">${name}</td>
        <td class="cell-price">${price} so'm</td>
        <td class="cell-qty">${qty} dona</td>
        <td class="cell-discount">${sale ? `${discount || 0}%` : "Yo'q"}</td>
        <td class="table-actions">
            <button class="btn buy"><i class="fa-solid fa-cart-shopping"></i></button>
            <button class="btn edit"><i class="fa-solid fa-pen"></i></button>
            <button class="btn delete"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;
    productList.appendChild(tr);
    nameInput.value = "";
    imgInput.value = "";
    priceInput.value = "";
    qtyInput.value = "";
    saleCheckbox.checked = false;
    discountInput.value = "";
    saveToStorage();
});

productList.addEventListener("click", (e) => {
    const buyBtn = e.target.closest(".buy");
    const editBtn = e.target.closest(".edit");
    const deleteBtn = e.target.closest(".delete");

    if (buyBtn) {
        const row = buyBtn.closest("tr");
        const id = row.dataset.id;
        const product = {
            id,
            name: row.dataset.name,
            img: row.dataset.img,
            price: row.dataset.price,
            qty: row.dataset.qty,
        };
        cart.push(product);
        row.dataset.bought = "true";
        buyBtn.remove();
        updateCartUI();
        saveToStorage();
    }

    if (editBtn) {
        const row = editBtn.closest("tr");
        editId = row.dataset.id;
        nameInput.value = row.dataset.name || "";
        imgInput.value = row.dataset.img || "";
        priceInput.value = row.dataset.price || "";
        qtyInput.value = row.dataset.qty || "";
        saleCheckbox.checked = row.dataset.sale === "true";
        discountInput.value = row.dataset.discount || "";
        addBtn.textContent = "Yangilash";
    }

    if (deleteBtn) {
        const row = deleteBtn.closest("tr");
        const id = row.dataset.id;
        if (row.dataset.bought === "true") {
            cart = cart.filter((item) => item.id !== id);
            updateCartUI();
        }
        row.remove();
        const remaining = productList.querySelectorAll("tr");
        if (remaining.length === 0) productList.appendChild(emptyRow);
        renderEmptyRow();
        saveToStorage();
    }
});
