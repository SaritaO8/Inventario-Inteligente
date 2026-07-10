/**
 * Inventario Page
 */

import { api } from '../api/client.js';
import { actions, store } from '../state/store.js';
import { createCard, createLoader, createAlert, createModal } from '../components/common.js';

export const inventoryPage = {
  render: async () => {
    actions.setCurrentPage('inventory');
    
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Inventario</h1>
            <p class="text-gray-600 mt-2">Gestiona el stock y los movimientos</p>
          </div>
          <button id="adjustStockBtn" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium">
            ⚙️ Ajustar Stock
          </button>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="flex border-b">
            <button class="tab-btn flex-1 px-4 py-3 border-b-2 border-primary text-primary font-medium" data-tab="stock">Stock Actual</button>
            <button class="tab-btn flex-1 px-4 py-3 border-b-2 border-gray-200 text-gray-600 hover:text-gray-900 font-medium" data-tab="low-stock">Bajo Stock</button>
            <button class="tab-btn flex-1 px-4 py-3 border-b-2 border-gray-200 text-gray-600 hover:text-gray-900 font-medium" data-tab="movements">Movimientos</button>
          </div>
        </div>

        <!-- Contenido de Tabs -->
        <div id="tab-content">
          ${createLoader()}
        </div>
      </div>

      <!-- Modal para ajustar stock -->
      ${createModal('adjust-stock-modal', 'Ajustar Stock', `
        <form id="adjustStockForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select id="productSelect" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecciona un producto</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input type="number" id="stockQuantity" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de movimiento</label>
            <select id="movementType" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="add">Agregar</option>
              <option value="remove">Restar</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <input type="text" id="movementReason" placeholder="Compra, ajuste, etc." class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div class="flex gap-2">
            <button type="submit" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium">Guardar</button>
            <button type="button" class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium modal-close" data-modal-id="adjust-stock-modal">Cancelar</button>
          </div>
        </form>
      `)}
    `;
  },

  init: async () => {
    try {
      const inventory = await api.getInventory();
      actions.setInventory(inventory);
      inventoryPage.renderStockTab(inventory);
      inventoryPage.setupEventListeners();
      
      // Llenar selector de productos
      const products = store.getState().products || await api.getProducts();
      inventoryPage.populateProductSelect(products);
    } catch (error) {
      const container = document.getElementById('tab-content');
      if (container) {
        container.innerHTML = createAlert('Error al cargar inventario', 'error');
      }
    }
  },

  renderStockTab: (inventory) => {
    const content = document.getElementById('tab-content');
    if (!content) return;

    if (inventory.length === 0) {
      content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg">📭 No hay productos en inventario</p></div>';
      return;
    }

    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Producto</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Stock Actual</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Stock Mínimo</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Última Actualización</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(item => `
              <tr class="border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium">${item.productName}</td>
                <td class="px-6 py-4">${item.quantity}</td>
                <td class="px-6 py-4">${item.minimumStock}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium ${
                    item.quantity > item.minimumStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }">
                    ${item.quantity > item.minimumStock ? 'Normal' : 'Bajo'}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">${new Date(item.lastUpdate).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  populateProductSelect: (products) => {
    const select = document.getElementById('productSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona un producto</option>' + 
      products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  },

  setupEventListeners: () => {
    // Botón de ajustar stock
    document.getElementById('adjustStockBtn')?.addEventListener('click', () => {
      document.getElementById('adjust-stock-modal').classList.remove('hidden');
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const tab = e.target.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('border-primary', 'text-primary');
          b.classList.add('border-gray-200', 'text-gray-600');
        });
        e.target.classList.add('border-primary', 'text-primary');
        e.target.classList.remove('border-gray-200', 'text-gray-600');

        try {
          const content = document.getElementById('tab-content');
          content.innerHTML = createLoader();

          if (tab === 'stock') {
            const inventory = await api.getInventory();
            inventoryPage.renderStockTab(inventory);
          } else if (tab === 'low-stock') {
            const lowStock = await api.getLowStockProducts();
            inventoryPage.renderLowStockTab(lowStock);
          } else if (tab === 'movements') {
            inventoryPage.renderMovementsTab();
          }
        } catch (error) {
          const content = document.getElementById('tab-content');
          content.innerHTML = createAlert('Error al cargar datos', 'error');
        }
      });
    });

    // Formulario de ajuste de stock
    document.getElementById('adjustStockForm')?.addEventListener('submit', inventoryPage.handleAdjustStock);
  },

  renderLowStockTab: (products) => {
    const content = document.getElementById('tab-content');
    if (!content) return;

    if (products.length === 0) {
      content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg">✅ No hay productos con bajo stock</p></div>';
      return;
    }

    content.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${products.map(product => `
          <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-warning">
            <h3 class="font-semibold text-gray-900">${product.name}</h3>
            <p class="text-gray-600 text-sm mt-1">Stock: ${product.stock} unidades</p>
            <p class="text-warning font-bold mt-2">⚠️ Bajo stock</p>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderMovementsTab: () => {
    const content = document.getElementById('tab-content');
    if (!content) return;

    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-600 text-center">Los movimientos de inventario se mostrarán aquí</p>
      </div>
    `;
  },

  handleAdjustStock: async (e) => {
    e.preventDefault();
    const productId = document.getElementById('productSelect').value;
    const quantity = parseInt(document.getElementById('stockQuantity').value);
    const movementType = document.getElementById('movementType').value;

    try {
      actions.setLoading(true);
      const finalQuantity = movementType === 'add' ? quantity : -quantity;
      await api.updateStock(productId, finalQuantity);
      
      const inventory = await api.getInventory();
      actions.setInventory(inventory);
      inventoryPage.renderStockTab(inventory);
      document.getElementById('adjust-stock-modal').classList.add('hidden');
      alert('Stock actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar stock: ' + error.message);
    } finally {
      actions.setLoading(false);
    }
  }
};
