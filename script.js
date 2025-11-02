let data = {
  sources: [],
  toBePaid: [],
  paid: []
};

function saveData() {
  localStorage.setItem('budgetData', JSON.stringify(data));
  calculateTotals();
}

function loadData() {
  const saved = localStorage.getItem('budgetData');
  if (saved) data = JSON.parse(saved);
  renderAll();
  calculateTotals();
}

function addSource() {
  const name = document.getElementById('source-name').value;
  const amount = parseFloat(document.getElementById('source-amount').value);
  if (!name || !amount) return;
  data.sources.push({ name, amount, date: new Date().toLocaleDateString() });
  document.getElementById('source-name').value = '';
  document.getElementById('source-amount').value = '';
  renderList('source-list', data.sources);
  saveData();
}

function addToBePaid() {
  const name = document.getElementById('tobepaid-name').value;
  const amount = parseFloat(document.getElementById('tobepaid-amount').value);
  if (!name || !amount) return;
  data.toBePaid.push({ name, amount });
  document.getElementById('tobepaid-name').value = '';
  document.getElementById('tobepaid-amount').value = '';
  renderList('tobepaid-list', data.toBePaid);
  saveData();
}

function addPaid() {
  const name = document.getElementById('paid-name').value;
  const amount = parseFloat(document.getElementById('paid-amount').value);
  if (!name || !amount) return;
  data.paid.push({ name, amount });
  document.getElementById('paid-name').value = '';
  document.getElementById('paid-amount').value = '';
  renderList('paid-list', data.paid);
  saveData();
}

function renderList(id, items) {
  const list = document.getElementById(id);
  list.innerHTML = items.map(i => `<li>${i.name}: ₹${i.amount}</li>`).join('');
}

function renderAll() {
  renderList('source-list', data.sources);
  renderList('tobepaid-list', data.toBePaid);
  renderList('paid-list', data.paid);
}

function calculateTotals() {
  const sum = arr => arr.reduce((a, b) => a + b.amount, 0);
  const totalSource = sum(data.sources);
  const totalToBePaid = sum(data.toBePaid);
  const totalPaid = sum(data.paid);
  const remaining = totalSource - totalToBePaid + totalPaid;

  document.getElementById('total-source').innerText = totalSource;
  document.getElementById('total-tobepaid').innerText = totalToBePaid;
  document.getElementById('total-paid').innerText = totalPaid;
  document.getElementById('remaining').innerText = remaining;
}

window.onload = loadData;
