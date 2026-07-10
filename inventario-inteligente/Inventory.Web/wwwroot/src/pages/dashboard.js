/**
 * Dashboard Page
 */

import { api } from '../api/client.js';
import { actions, store } from '../state/store.js';
import { createCard, createLoader, createAlert } from '../components/common.js';

export const dashboardPage = {
  render: async () => {
    actions.setCurrentPage('dashboard');
    
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-2">Resumen de métricas del sistema</p>
        </div>

        <!-- Métricas Principales -->
        <div id="metrics-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${createLoader()}
        </div>

        <!-- Gráficos y Tablas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Ventas del Día -->
          <div class="lg:col-span-2">
            ${createCard('Ventas del Día', '<div id="sales-chart" class="h-64"></div>')}
          </div>

          <!-- Últimas Facturas -->
          <div>
            ${createCard('Últimas Facturas', '<div id="recent-invoices" class="space-y-2"></div>')}
          </div>
        </div>

        <!-- Productos con Bajo Stock -->
        <div>
          ${createCard('Productos con Bajo Stock', '<div id="low-stock" class="overflow-x-auto"><table class="w-full"><thead><tr class="bg-gray-100"><th class="px-4 py-2 text-left">Producto</th><th class="px-4 py-2 text-left">Stock</th><th class="px-4 py-2 text-left">Estado</th></tr></thead><tbody id="low-stock-body"></tbody></table></div>')}
        </div>

        <!-- Ventas por Chatbot -->
        <div>
          ${createCard('Ventas Realizadas por Chatbot', '<div id="chatbot-stats" class="space-y-2"></div>')}
        </div>
      </div>
    `;
  },

  init: async () => {
    try {
      // Obtener métricas
      const metrics = await api.getDashboardMetrics();
      dashboardPage.renderMetrics(metrics);

      // Obtener últimas facturas
      const invoices = await api.getInvoices();
      dashboardPage.renderRecentInvoices(invoices.slice(0, 5));

      // Obtener productos con bajo stock
      const lowStock = await api.getLowStockProducts();
      dashboardPage.renderLowStockProducts(lowStock);

    } catch (error) {
      const container = document.getElementById('metrics-container');
      if (container) {
        container.innerHTML = createAlert('Error al cargar las métricas', 'error');
      }
    }
  },

  renderMetrics: (metrics) => {
    const container = document.getElementById('metrics-container');
    if (!container) return;

    const metricCards = [
      { label: 'Total de Productos', value: metrics.totalProducts || 0, icon: '📦' },
      { label: 'Ventas del Día', value: `$${metrics.salesToday || 0}`, icon: '💰' },
      { label: 'Bajo Stock', value: metrics.lowStockCount || 0, icon: '⚠️' },
      { label: 'Ventas por Chatbot', value: metrics.chatbotSales || 0, icon: '💬' }
    ];

    container.innerHTML = metricCards.map(card => `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm">${card.label}</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${card.value}</p>
          </div>
          <span class="text-4xl">${card.icon}</span>
        </div>
      </div>
    `).join('');
  },

  renderRecentInvoices: (invoices) => {
    const container = document.getElementById('recent-invoices');
    if (!container) return;

    if (invoices.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No hay facturas recientes</p>';
      return;
    }

    container.innerHTML = invoices.map(invoice => `
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <span class="text-sm font-medium">#${invoice.number}</span>
        <span class="text-xs text-gray-500">${new Date(invoice.date).toLocaleDateString()}</span>
      </div>
    `).join('');
  },

  renderLowStockProducts: (products) => {
    const tbody = document.getElementById('low-stock-body');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500 py-4">No hay productos con bajo stock</td></tr>';
      return;
    }

    tbody.innerHTML = products.map(product => `
      <tr class="border-b hover:bg-gray-50">
        <td class="px-4 py-2">${product.name}</td>
        <td class="px-4 py-2">${product.stock} unidades</td>
        <td class="px-4 py-2">
          <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Bajo</span>
        </td>
      </tr>
    `).join('');
  }
};
