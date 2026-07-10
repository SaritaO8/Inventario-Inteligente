/**
 * Componentes Globales
 */

export const createHeader = () => {
  return `
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            I
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Inventario Inteligente</h1>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-gray-100 rounded-lg" id="darkModeBtn" title="Alternar tema">
            🌙
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-lg" id="notificationBtn" title="Notificaciones">
            🔔
          </button>
          <div class="flex items-center gap-2 pl-4 border-l">
            <img src="https://via.placeholder.com/40" alt="Usuario" class="w-10 h-10 rounded-full">
            <span class="text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  `;
};

export const createSidebar = () => {
  return `
    <aside class="w-64 bg-gray-900 text-white fixed left-0 top-0 h-screen overflow-y-auto pt-20">
      <nav class="px-4 py-8 space-y-2">
        <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="dashboard">
          📊 Dashboard
        </button>
        <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="products">
          📦 Productos
        </button>
        <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="inventory">
          📋 Inventario
        </button>
        <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="sales">
          💰 Ventas
        </button>
        <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="invoices">
          📄 Facturas
        </button>
        <button class="nav-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition" data-page="chatbot">
          💬 Chatbot
        </button>
      </nav>
    </aside>
  `;
};

export const createCard = (title, content, className = '') => {
  return `
    <div class="bg-white rounded-lg shadow-md p-6 ${className}">
      ${title ? `<h3 class="text-lg font-semibold text-gray-800 mb-4">${title}</h3>` : ''}
      ${content}
    </div>
  `;
};

export const createButton = (text, className = '', id = '') => {
  return `
    <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium ${className}" ${id ? `id="${id}"` : ''}>
      ${text}
    </button>
  `;
};

export const createModal = (id, title, content) => {
  return `
    <div id="${id}" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">${title}</h2>
          <button class="modal-close" data-modal-id="${id}">✕</button>
        </div>
        <div class="px-6 py-4">
          ${content}
        </div>
      </div>
    </div>
  `;
};

export const createAlert = (message, type = 'info') => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  };
  
  return `
    <div class="border-l-4 p-4 mb-4 rounded ${colors[type]}">
      ${message}
    </div>
  `;
};

export const createLoader = () => {
  return `
    <div class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  `;
};

export const createEmptyState = (message = 'No hay datos disponibles') => {
  return `
    <div class="text-center py-12">
      <p class="text-gray-500 text-lg">📭 ${message}</p>
    </div>
  `;
};

export const setupComponentListeners = () => {
  // Cerrar modales
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalId = e.target.dataset.modalId;
      document.getElementById(modalId)?.classList.add('hidden');
    });
  });

  // Cerrar modales al hacer click fuera
  document.querySelectorAll('[id$="-modal"]').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
};

export const openModal = (modalId) => {
  document.getElementById(modalId)?.classList.remove('hidden');
};

export const closeModal = (modalId) => {
  document.getElementById(modalId)?.classList.add('hidden');
};
