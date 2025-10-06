const nameInput = document.getElementById("name");
const imgInput = document.getElementById("imgUrl");
const priceInput = document.getElementById("price");
const qtyInput = document.getElementById("quantity");
const discountInput = document.getElementById("discount");
const addBtn = document.getElementById("addBtn");
const productList = document.getElementById("productList");
const emptyRow = document.getElementById("emptyRow");

let editIndex = null;

function renderEmptyRow() {
    if (productList.children.length === 0) {
        productList.appendChild(emptyRow);
    }
}

addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const img = imgInput.value.trim();
    const price = priceInput.value.trim();
    const qty = qtyInput.value.trim();
    const discount = discountInput.checked ? "Ha" : "Yo'q";

    if (!name || !img || !price || !qty) {
        alert("Barcha maydonlarni to'ldiring!");
        return;
    }

    if (editIndex !== null) {
        const row = productList.children[editIndex];
        row.children[0].innerHTML = `<img src="${img}" alt="">`;
        row.children[1].textContent = name;
        row.children[2].textContent = price + " so'm";
        row.children[3].textContent = qty + " dona";
        row.children[4].textContent = discount;
        editIndex = null;
        addBtn.textContent = "Mahsulot Qo'shish";
    } else {
        if (emptyRow.parentElement) {
            emptyRow.remove();
        }

        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${img}" alt=""></td>
          <td>${name}</td>
          <td>${price} so'm</td>
          <td>${qty} dona</td>
          <td>${discount}</td>
          <td>
            <button class="btn edit">Tahrirlash</button>
            <button class="btn delete">O'chirish</button>
          </td>
        `;

        row.querySelector(".edit").addEventListener("click", () => {
            nameInput.value = name;
            imgInput.value = img;
            priceInput.value = price;
            qtyInput.value = qty;
            discountInput.checked = discount === "Ha";
            editIndex = Array.from(productList.children).indexOf(row);
            addBtn.textContent = "Yangilash";
        });

        row.querySelector(".delete").addEventListener("click", () => {
            row.remove();
            if (productList.children.length === 0) {
                renderEmptyRow();
            }
        });

        productList.appendChild(row);
    }

    nameInput.value = "";
    imgInput.value = "";
    priceInput.value = "";
    qtyInput.value = "";
    discountInput.checked = false;
});
