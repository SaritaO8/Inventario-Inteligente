/**
 * Ventas Page
 */

import { api } from '../api/client.js';
import { actions, store } from '../state/store.js';
import { createCard, createLoader, createAlert } from '../components/common.js';

export const salesPage = {
  render: async () => {
    actions.setCurrentPage('sales');
    
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ventas</h1>
          <p class="text-gray-600 mt-2">Consulta todas las ventas realizadas</p>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex flex-col md:flex-row gap-4">
            <input type="text" id="searchSales" placeholder="Buscar por número de venta..." class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <select id="originFilter" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos los orígenes</option>
              <option value="manual">Manual</option>
              <option value="chatbot">Chatbot</option>
            </select>
            <select id="statusFilter" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos los estados</option>
              <option value="completed">Completada</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>

        <!-- Lista de Ventas -->
        <div id="sales-container">
          ${createLoader()}
        </div>
      </div>
    `;
  },

  init: async () => {
    try {
      const sales = await api.getSales();
      actions.setSales(sales);
      salesPage.renderSales(sales);
      salesPage.setupEventListeners();
    } catch (error) {
      const container = document.getElementById('sales-container');
      if (container) {
        container.innerHTML = createAlert('Error al cargar ventas', 'error');
      }
    }
  },

  renderSales: (sales) => {
    const container = document.getElementById('sales-container');
    if (!container) return;

    if (sales.length === 0) {
      container.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg">📭 No hay ventas disponibles</p></div>';
      return;
    }

    container.innerHTML = `
      <div class="bg-white rounded-lg shadow-md overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Número</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Fecha</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Origen</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map(sale => `
              <tr class="border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium">#${sale.number}</td>
                <td class="px-6 py-4">${new Date(sale.date).toLocaleDateString()}</td>
                <td class="px-6 py-4 font-semibold">$${sale.total.toFixed(2)}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium ${
                    sale.origin === 'chatbot' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }">
                    ${sale.origin === 'chatbot' ? '💬 Chatbot' : '👤 Manual'}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium ${
                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }">
                    ${sale.status === 'completed' ? '✓ Completada' :
                      sale.status === 'pending' ? '⏳ Pendiente' :
                      '✕ Cancelada'}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button class="text-primary hover:underline font-medium view-sale-btn" data-id="${sale.id}">Ver detalle</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  setupEventListeners: () => {
    // Filtros
    document.getElementById('searchSales')?.addEventListener('input', salesPage.filterSales);
    document.getElementById('originFilter')?.addEventListener('change', salesPage.filterSales);
    document.getElementById('statusFilter')?.addEventListener('change', salesPage.filterSales);

    // Ver detalle
    document.querySelectorAll('.view-sale-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const saleId = e.target.dataset.id;
        try {
          const detail = await api.getSaleDetail(saleId);
          salesPage.showSaleDetail(detail);
        } catch (error) {
          alert('Error al cargar detalle: ' + error.message);
        }
      });
    });
  },

  filterSales: () => {
    const sales = store.getState().sales;
    const searchTerm = document.getElementById('searchSales')?.value.toLowerCase() || '';
    const origin = document.getElementById('originFilter')?.value || 'all';
    const status = document.getElementById('statusFilter')?.value || 'all';

    const filtered = sales.filter(s => {
      const matchesSearch = s.number.toLowerCase().includes(searchTerm);
      const matchesOrigin = origin === 'all' || s.origin === origin;
      const matchesStatus = status === 'all' || s.status === status;
      return matchesSearch && matchesOrigin && matchesStatus;
    });

    salesPage.renderSales(filtered);
    salesPage.setupEventListeners();
  },

  showSaleDetail: (sale) => {
    const detailHtml = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
          <div class="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
            <h2 class="text-xl font-semibold text-gray-800">Detalle de Venta #${sale.number}</h2>
            <button class="close-detail text-2xl">✕</button>
          </div>
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-gray-600 text-sm">Fecha</p>
                <p class="font-semibold">${new Date(sale.date).toLocaleString()}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm">Origen</p>
                <p class="font-semibold">${sale.origin === 'chatbot' ? '💬 Chatbot' : '👤 Manual'}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm">Estado</p>
                <p class="font-semibold">${sale.status}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm">Total</p>
                <p class="font-semibold text-lg text-primary">$${sale.total.toFixed(2)}</p>
              </div>
            </div>

            <div class="border-t pt-4">
              <h3 class="font-semibold mb-3">Productos</h3>
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-2 py-2 text-left">Producto</th>
                    <th class="px-2 py-2 text-left">Cantidad</th>
                    <th class="px-2 py-2 text-left">Precio</th>
                    <th class="px-2 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${sale.items.map(item => `
                    <tr class="border-b">
                      <td class="px-2 py-2">${item.productName}</td>
                      <td class="px-2 py-2">${item.quantity}</td>
                      <td class="px-2 py-2">$${item.price.toFixed(2)}</td>
                      <td class="px-2 py-2 text-right">$${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="px-6 py-4 border-t bg-gray-50 flex justify-end">
            <button class="close-detail px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Cerrar</button>
          </div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = detailHtml;
    document.body.appendChild(modal);

    modal.querySelectorAll('.close-detail').forEach(btn => {
      btn.addEventListener('click', () => modal.remove());
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal.firstElementChild?.parentElement) {
        modal.remove();
      }
    });
  }
};
