const API_BASE = 'http://localhost:5016';

async function loadAllData() {
  await Promise.all([loadDashboard(), loadProducts(), loadSales(), loadInvoices()]);
}

async function loadDashboard() {
  const response = await fetch(`${API_BASE}/api/dashboard`);
  const data = await response.json();
  document.getElementById('dashboard').innerHTML = `
    <div class="stat"><strong>${data.productCount}</strong><span>Productos</span></div>
    <div class="stat"><strong>${data.saleCount}</strong><span>Ventas</span></div>
    <div class="stat"><strong>${data.chatbotSales}</strong><span>Por chatbot</span></div>
    <div class="stat"><strong>${data.lowStockCount}</strong><span>Bajo stock</span></div>
  `;
}

async function loadProducts() {
  const response = await fetch(`${API_BASE}/api/products`);
  const data = await response.json();
  document.getElementById('products').innerHTML = renderTable(data, ['Nombre', 'Categoría', 'Precio', 'Stock', 'Estado'], item => [
    item.name,
    item.category,
    `$${item.price}`,
    item.stock,
    item.isActive ? 'Activo' : 'Inactivo'
  ]);
}

async function loadSales() {
  const response = await fetch(`${API_BASE}/api/sales`);
  const data = await response.json();
  document.getElementById('sales').innerHTML = renderTable(data, ['Producto', 'Cantidad', 'Total', 'Origen', 'Fecha'], item => [
    item.productName,
    item.quantity,
    `$${item.total}`,
    item.origin,
    new Date(item.createdAt).toLocaleString()
  ]);
}

async function loadInvoices() {
  const response = await fetch(`${API_BASE}/api/invoices`);
  const data = await response.json();
  document.getElementById('invoices').innerHTML = renderTable(data, ['Número', 'Total', 'Fecha'], item => [
    item.number,
    `$${item.total}`,
    new Date(item.createdAt).toLocaleString()
  ]);
}

function renderTable(data, headers, mapRow) {
  if (!data || data.length === 0) {
    return '<p>No hay datos disponibles.</p>';
  }

  const rows = data.map(item => `<tr>${mapRow(item).map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
  return `
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function handleCreateProduct(event) {
  event.preventDefault();
  const body = {
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: Number(document.getElementById('productPrice').value),
    stock: Number(document.getElementById('productStock').value),
    isActive: document.getElementById('productActive').checked
  };

  await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  event.target.reset();
  await loadAllData();
}

async function handleAdjustInventory(event) {
  event.preventDefault();
  const body = {
    productId: document.getElementById('inventoryProductId').value,
    quantityDelta: Number(document.getElementById('inventoryDelta').value)
  };

  await fetch(`${API_BASE}/api/inventory/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  event.target.reset();
  await loadAllData();
}

async function handleCreateSale(event) {
  event.preventDefault();
  const body = {
    productId: document.getElementById('saleProductId').value,
    quantity: Number(document.getElementById('saleQuantity').value),
    origin: document.getElementById('saleOrigin').value
  };

  await fetch(`${API_BASE}/api/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  event.target.reset();
  await loadAllData();
}

async function sendMessage(event) {
  if (event) event.preventDefault();
  const message = document.getElementById('chatMessage').value;
  const responseBox = document.getElementById('chatResponse');
  responseBox.innerHTML = '<p>Procesando...</p>';

  const response = await fetch(`${API_BASE}/api/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: 'demo-session', message })
  });

  const data = await response.json();
  responseBox.innerHTML = `<p>${data.response}</p><p><strong>Estado:</strong> ${data.state}</p>`;
  document.getElementById('chatMessage').value = '';
}

window.addEventListener('DOMContentLoaded', loadAllData);
