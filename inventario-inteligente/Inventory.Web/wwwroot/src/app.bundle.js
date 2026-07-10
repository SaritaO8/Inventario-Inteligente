// ============================================================
// APP BUNDLE - Todo en un archivo con datos de prueba
// ============================================================

// ============================================================
// 1. STATE MANAGEMENT
// ============================================================

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  getState() {
    return this.state;
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

const store = new Store({
  currentPage: 'dashboard',
  user: null,
  products: [],
  darkMode: localStorage.getItem('darkMode') === 'true'
});

const actions = {
  setCurrentPage: (page) => store.setState({ currentPage: page }),
  toggleDarkMode: () => {
    const newDarkMode = !store.getState().darkMode;
    localStorage.setItem('darkMode', newDarkMode);
    store.setState({ darkMode: newDarkMode });
  }
};

// ============================================================
// 2. DATOS DE PRUEBA (MOCK DATA)
// ============================================================

const mockProducts = [
  { id: 1, name: 'Laptop Dell XPS', price: 1299.99, category: 'Electrónica', active: true, description: 'Laptop de última generación' },
  { id: 2, name: 'Mouse Logitech', price: 49.99, category: 'Accesorios', active: true, description: 'Mouse inalámbrico' },
  { id: 3, name: 'Teclado Mecánico', price: 199.99, category: 'Accesorios', active: true, description: 'RGB Mecánico' },
  { id: 4, name: 'Monitor LG 27"', price: 399.99, category: 'Monitores', active: true, description: '4K 60Hz' }
];

const mockSales = [
  { id: 1, number: '001', date: new Date('2026-07-03'), origin: 'chatbot', status: 'completed', total: 250 },
  { id: 2, number: '002', date: new Date('2026-07-02'), origin: 'manual', status: 'completed', total: 450 },
  { id: 3, number: '003', date: new Date('2026-07-01'), origin: 'chatbot', status: 'pending', total: 120 },
  { id: 4, number: '004', date: new Date('2026-06-30'), origin: 'manual', status: 'completed', total: 890 }
];

const mockInvoices = [
  { id: 1, number: 'FAC-001', date: new Date('2026-07-03'), customer: 'Cliente A', total: 250 },
  { id: 2, number: 'FAC-002', date: new Date('2026-07-02'), customer: 'Cliente B', total: 450 },
  { id: 3, number: 'FAC-003', date: new Date('2026-07-01'), customer: 'Cliente C', total: 120 }
];

// ============================================================
// 3. COMPONENTES
// ============================================================

const createHeader = () => `
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">I</div>
        <h1 class="text-2xl font-bold text-gray-800">Inventario Inteligente</h1>
      </div>
      <div class="flex items-center gap-4">
        <button id="darkModeBtn" class="p-2 hover:bg-gray-100 rounded-lg">🌙</button>
        <button class="p-2 hover:bg-gray-100 rounded-lg">🔔</button>
        <div class="flex items-center gap-2 pl-4 border-l"><span class="text-gray-700">Admin</span></div>
      </div>
    </div>
  </header>
`;

const createSidebar = () => `
  <aside class="w-64 bg-gray-900 text-white fixed left-0 top-0 h-screen overflow-y-auto pt-20">
    <nav class="px-4 py-8 space-y-2">
      <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="dashboard">📊 Dashboard</button>
      <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="products">📦 Productos</button>
      <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="inventory">📋 Inventario</button>
      <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="sales">💰 Ventas</button>
      <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="invoices">📄 Facturas</button>
      <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="chatbot">💬 Chatbot</button>
    </nav>
  </aside>
`;

const createCard = (title, content) => `
  <div class="bg-white rounded-lg shadow-md p-6">
    ${title ? `<h3 class="text-lg font-semibold text-gray-800 mb-4">${title}</h3>` : ''}
    ${content}
  </div>
`;

// ============================================================
// 4. PÁGINAS
// ============================================================

const pages = {
  dashboard: {
    render: async () => `
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Total de Productos</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">156</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Ventas del Día</p>
            <p class="text-3xl font-bold text-blue-500 mt-2">$2,450</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Bajo Stock</p>
            <p class="text-3xl font-bold text-red-500 mt-2">12</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Ventas por Chatbot</p>
            <p class="text-3xl font-bold text-purple-500 mt-2">8</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${createCard('Últimas Facturas', '<p>FAC-001: $250</p><p>FAC-002: $450</p><p>FAC-003: $120</p>')}
          ${createCard('Ventas Hoy', '<p class="text-3xl font-bold text-blue-500">$2,450</p><p class="text-gray-600">4 transacciones</p>')}
        </div>
      </div>
    `,
    init: async () => {}
  },

  products: {
    render: async () => `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Productos</h1>
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">➕ Nuevo</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${mockProducts.map(p => `
            <div class="bg-white rounded-lg shadow-md p-4">
              <div class="w-full h-32 bg-gradient-to-br from-blue-200 to-blue-100 rounded mb-3 flex items-center justify-center text-3xl">📦</div>
              <h3 class="font-semibold text-lg">${p.name}</h3>
              <p class="text-blue-500 font-bold mt-2">$${p.price}</p>
              <p class="text-gray-600 text-sm mt-1">${p.category}</p>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs mt-3 inline-block">Activo</span>
            </div>
          `).join('')}
        </div>
      </div>
    `,
    init: async () => {}
  },

  inventory: {
    render: async () => `
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">Inventario</h1>
        ${createCard('Stock Actual', `
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr><th class="px-4 py-2 text-left">Producto</th><th class="px-4 py-2 text-left">Stock</th><th class="px-4 py-2 text-left">Mínimo</th><th class="px-4 py-2 text-left">Estado</th></tr>
            </thead>
            <tbody>
              <tr class="border-b"><td class="px-4 py-2">Laptop Dell XPS</td><td class="px-4 py-2">25</td><td class="px-4 py-2">10</td><td class="px-4 py-2"><span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Normal</span></td></tr>
              <tr class="border-b"><td class="px-4 py-2">Mouse Logitech</td><td class="px-4 py-2">5</td><td class="px-4 py-2">15</td><td class="px-4 py-2"><span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Bajo</span></td></tr>
            </tbody>
          </table>
        `)}
      </div>
    `,
    init: async () => {}
  },

  sales: {
    render: async () => `
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">Ventas</h1>
        ${createCard('', `
          <table class="w-full">
            <thead class="bg-gray-100"><tr><th class="px-4 py-2 text-left">Número</th><th class="px-4 py-2 text-left">Fecha</th><th class="px-4 py-2 text-left">Total</th><th class="px-4 py-2 text-left">Origen</th><th class="px-4 py-2 text-left">Estado</th></tr></thead>
            <tbody>
              ${mockSales.map(s => `
                <tr class="border-b hover:bg-gray-50">
                  <td class="px-4 py-2">#${s.number}</td>
                  <td class="px-4 py-2">${s.date.toLocaleDateString()}</td>
                  <td class="px-4 py-2 font-bold">$${s.total}</td>
                  <td class="px-4 py-2"><span class="px-2 py-1 rounded text-xs ${s.origin === 'chatbot' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">${s.origin === 'chatbot' ? '💬 Chatbot' : '👤 Manual'}</span></td>
                  <td class="px-4 py-2"><span class="px-2 py-1 rounded text-xs ${s.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${s.status === 'completed' ? '✓ Completada' : '⏳ Pendiente'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `)}
      </div>
    `,
    init: async () => {}
  },

  invoices: {
    render: async () => `
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">Facturas</h1>
        <div class="space-y-4">
          ${mockInvoices.map(i => `
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-semibold">Factura ${i.number}</h3>
                  <p class="text-gray-600 text-sm">${i.customer} - ${i.date.toLocaleDateString()}</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-blue-500">$${i.total}</p>
                  <button class="text-blue-500 hover:underline text-sm">Ver Detalle</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `,
    init: async () => {}
  },

  chatbot: {
    render: async () => `
      <div class="space-y-6 h-full flex flex-col">
        <h1 class="text-3xl font-bold text-gray-900">Chatbot Asistente</h1>
        <div class="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          <div id="messages-container" class="flex-1 overflow-y-auto p-6 space-y-4">
            <div class="flex justify-center">
              <div class="text-center">
                <div class="text-5xl mb-2">💬</div>
                <p class="text-gray-600">¡Hola! ¿Cómo puedo ayudarte?</p>
              </div>
            </div>
          </div>
          <div class="border-t p-4 bg-gray-50">
            <div class="flex gap-3">
              <textarea id="messageInput" placeholder="Escribe tu mensaje..." rows="2" class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
              <button id="sendBtn" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">📤</button>
            </div>
          </div>
        </div>
      </div>
    `,
    init: async () => {
      const sendBtn = document.getElementById('sendBtn');
      const messageInput = document.getElementById('messageInput');
      if (!sendBtn) return;
      
      const handleSend = () => {
        const msg = messageInput?.value.trim();
        if (!msg) return;
        const container = document.getElementById('messages-container');
        if (!container) return;
        
        const userMsg = document.createElement('div');
        userMsg.className = 'flex justify-end fade-in';
        userMsg.innerHTML = `<div class="max-w-xs bg-blue-500 text-white px-4 py-3 rounded-lg">${msg}</div>`;
        container.appendChild(userMsg);
        container.scrollTop = container.scrollHeight;
        
        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.className = 'flex justify-start fade-in';
          botMsg.innerHTML = `<div class="max-w-xs bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">✓ Recibido: "${msg}"</div>`;
          container.appendChild(botMsg);
          container.scrollTop = container.scrollHeight;
        }, 500);
        
        if (messageInput) messageInput.value = '';
      };
      
      sendBtn.addEventListener('click', handleSend);
      messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }
  }
};

// ============================================================
// 5. ROUTER
// ============================================================

const router = {
  navigate: async (pageKey) => {
    const page = pages[pageKey];
    if (!page) return;
    const html = await page.render();
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.innerHTML = html;
    if (page.init) await page.init();
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('bg-gray-700', btn.dataset.page === pageKey);
    });
  },
  init: () => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        router.navigate(e.target.dataset.page);
      });
    });
    router.navigate('dashboard');
  }
};

// ============================================================
// 6. APP
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = `
      ${createHeader()}
      ${createSidebar()}
      <main class="ml-64 mt-20 p-6 min-h-screen bg-gray-50">
        <div id="main-content" class="max-w-7xl mx-auto"></div>
      </main>
    `;
    document.getElementById('darkModeBtn')?.addEventListener('click', () => {
      actions.toggleDarkMode();
    });
    router.init();
  }
});
