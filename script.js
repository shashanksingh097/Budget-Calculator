let data = { sources: [], toBePaid: [], paid: [] };
let currentType = "";

// Load data from localStorage
window.onload = function () {
  const saved = localStorage.getItem("budgetData");
  if (saved) data = JSON.parse(saved);
  renderAll();
  calculateTotals();
};

// Save to localStorage
function saveData() {
  localStorage.setItem("budgetData", JSON.stringify(data));
  renderAll();
  calculateTotals();
}

// Open modal
function openForm(type) {
  currentType = type;
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-title").innerText =
    "Add " + type.charAt(0).toUpperCase() + type.slice(1);
}

// Close modal
function closeForm() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("entry-name").value = "";
  document.getElementById("entry-amount").value = "";
}

// Save entry
function saveEntry() {
  const name = document.getElementById("entry-name").value.trim();
  const amount = parseFloat(document.getElementById("entry-amount").value);
  if (!name || !amount) return alert("Please enter valid name and amount");

  const item = { name, amount, date: new Date().toLocaleDateString() };

  if (currentType === "source") data.sources.push(item);
  else if (currentType === "tobepaid") data.toBePaid.push(item);
  else if (currentType === "paid") data.paid.push(item);

  closeForm();
  saveData();
}

// Render all lists
function renderAll() {
  renderList("source-list", data.sources);
  renderList("tobepaid-list", data.toBePaid);
  renderList("paid-list", data.paid, true);
}

function renderList(id, items, editable = false) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} — ₹${item.amount}</span>
      ${
        editable
          ? `<input type='number' value='${item.amount}' onchange='editPaid(${index}, this.value)' />`
          : ""
      }
      <button onclick="deleteItem('${id}', ${index})">🗑️</button>
    `;
    list.appendChild(li);
  });
}

// Delete item
function deleteItem(listId, index) {
  if (listId === "source-list") data.sources.splice(index, 1);
  else if (listId === "tobepaid-list") data.toBePaid.splice(index, 1);
  else if (listId === "paid-list") data.paid.splice(index, 1);
  saveData();
}

// Edit paid amount
function editPaid(index, value) {
  data.paid[index].amount = parseFloat(value) || 0;
  saveData();
}

// Totals and remaining balance
function calculateTotals() {
  const sum = (arr) => arr.reduce((a, b) => a + b.amount, 0);
  const totalSource = sum(data.sources);
  const totalToBePaid = sum(data.toBePaid);
  const totalPaid = sum(data.paid);
  const remaining = totalSource - totalToBePaid + totalPaid;

  document.getElementById("total-source").innerText = totalSource.toFixed(2);
  document.getElementById("total-tobepaid").innerText = totalToBePaid.toFixed(2);
  document.getElementById("total-paid").innerText = totalPaid.toFixed(2);
  document.getElementById("remaining").innerText = remaining.toFixed(2);
}

// Export JSON
function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "budget_backup.json";
  link.click();
}
// Import JSON
function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        // Validate structure
        if (
          imported &&
          imported.sources &&
          imported.toBePaid &&
          imported.paid
        ) {
          data = imported;
          localStorage.setItem("budgetData", JSON.stringify(data));
          renderAll();
          calculateTotals();
          alert("✅ Data imported successfully!");
        } else {
          alert("❌ Invalid JSON format!");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Error reading file!");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
