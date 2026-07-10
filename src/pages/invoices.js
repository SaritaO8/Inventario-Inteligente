/**
 * Invoices Page
 */

import { api } from '../api/client.js';
import { actions, store } from '../state/store.js';
import { createCard, createLoader, createAlert } from '../components/common.js';

export const invoicesPage = {
  render: async () => {
    actions.setCurrentPage('invoices');
    
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Facturas</h1>
          <p class="text-gray-600 mt-2">Consulta y descarga tus facturas</p>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex flex-col md:flex-row gap-4">
            <input type="text" id="searchInvoices" placeholder="Buscar por número de factura..." class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <input type="date" id="dateFrom" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Desde">
            <input type="date" id="dateTo" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Hasta">
          </div>
        </div>

        <!-- Lista de Facturas -->
        <div id="invoices-container">
          ${createLoader()}
        </div>
      </div>
    `;
  },

  init: async () => {
    try {
      const invoices = await api.getInvoices();
      actions.setInvoices(invoices);
      invoicesPage.renderInvoices(invoices);
      invoicesPage.setupEventListeners();
    } catch (error) {
      const container = document.getElementById('invoices-container');
      if (container) {
        container.innerHTML = createAlert('Error al cargar facturas', 'error');
      }
    }
  },

  renderInvoices: (invoices) => {
    const container = document.getElementById('invoices-container');
    if (!container) return;

    if (invoices.length === 0) {
      container.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg">📭 No hay facturas disponibles</p></div>';
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 gap-4">
        ${invoices.map(invoice => `
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900"># ${invoice.number}</h3>
                <p class="text-gray-600 text-sm mt-1">${new Date(invoice.date).toLocaleDateString()} - ${invoice.customer}</p>
                <p class="text-gray-600 text-sm">Referencia de venta: <span class="font-medium">${invoice.saleReference}</span></p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <p class="text-2xl font-bold text-primary">$${invoice.total.toFixed(2)}</p>
                <div class="flex gap-2">
                  <button class="px-3 py-2 bg-blue-100 text-primary rounded hover:bg-blue-200 transition text-sm font-medium view-invoice-btn" data-id="${invoice.id}">
                    👁️ Ver
                  </button>
                  <button class="px-3 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition text-sm font-medium download-invoice-btn" data-id="${invoice.id}">
                    ⬇️ Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  setupEventListeners: () => {
    // Filtros
    document.getElementById('searchInvoices')?.addEventListener('input', invoicesPage.filterInvoices);
    document.getElementById('dateFrom')?.addEventListener('change', invoicesPage.filterInvoices);
    document.getElementById('dateTo')?.addEventListener('change', invoicesPage.filterInvoices);

    // Ver detalle
    document.querySelectorAll('.view-invoice-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const invoiceId = e.target.dataset.id;
        try {
          const detail = await api.getInvoiceDetail(invoiceId);
          invoicesPage.showInvoiceDetail(detail);
        } catch (error) {
          alert('Error al cargar detalle: ' + error.message);
        }
      });
    });

    // Descargar
    document.querySelectorAll('.download-invoice-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const invoiceId = e.target.dataset.id;
        try {
          e.target.disabled = true;
          e.target.textContent = '⏳ Descargando...';
          const blob = await api.downloadInvoice(invoiceId);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `factura-${invoiceId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          e.target.disabled = false;
          e.target.textContent = '⬇️ Descargar';
        } catch (error) {
          alert('Error al descargar factura: ' + error.message);
          e.target.disabled = false;
          e.target.textContent = '⬇️ Descargar';
        }
      });
    });
  },

  filterInvoices: () => {
    const invoices = store.getState().invoices;
    const searchTerm = document.getElementById('searchInvoices')?.value.toLowerCase() || '';
    const dateFrom = document.getElementById('dateFrom')?.value;
    const dateTo = document.getElementById('dateTo')?.value;

    const filtered = invoices.filter(invoice => {
      const matchesSearch = invoice.number.toLowerCase().includes(searchTerm) || invoice.customer.toLowerCase().includes(searchTerm);
      
      let matchesDate = true;
      if (dateFrom || dateTo) {
        const invoiceDate = new Date(invoice.date);
        if (dateFrom && invoiceDate < new Date(dateFrom)) matchesDate = false;
        if (dateTo && invoiceDate > new Date(dateTo)) matchesDate = false;
      }

      return matchesSearch && matchesDate;
    });

    invoicesPage.renderInvoices(filtered);
    invoicesPage.setupEventListeners();
  },

  showInvoiceDetail: (invoice) => {
    const detailHtml = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-96 overflow-y-auto">
          <div class="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
            <h2 class="text-xl font-semibold text-gray-800">Factura #${invoice.number}</h2>
            <button class="close-invoice text-2xl">✕</button>
          </div>
          <div class="px-6 py-4">
            <!-- Encabezado Factura -->
            <div class="mb-6 pb-6 border-b">
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p class="text-gray-600 text-sm font-semibold">EMPRESA</p>
                  <p class="text-gray-900">Inventario Inteligente S.A.</p>
                </div>
                <div>
                  <p class="text-gray-600 text-sm font-semibold">CLIENTE</p>
                  <p class="text-gray-900">${invoice.customer}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-600 text-sm font-semibold">FACTURA</p>
                  <p class="text-2xl font-bold text-primary"># ${invoice.number}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-600 text-sm">Fecha de Emisión</p>
                  <p class="font-medium">${new Date(invoice.date).toLocaleDateString()}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-600 text-sm">Fecha de Vencimiento</p>
                  <p class="font-medium">${new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <!-- Tabla de Productos -->
            <table class="w-full mb-6 text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-3 py-2 text-left">Descripción</th>
                  <th class="px-3 py-2 text-center">Cantidad</th>
                  <th class="px-3 py-2 text-right">Precio Unit.</th>
                  <th class="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr class="border-b">
                    <td class="px-3 py-2">${item.description}</td>
                    <td class="px-3 py-2 text-center">${item.quantity}</td>
                    <td class="px-3 py-2 text-right">$${item.unitPrice.toFixed(2)}</td>
                    <td class="px-3 py-2 text-right font-medium">$${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Resumen -->
            <div class="flex justify-end mb-6">
              <div class="w-full md:w-64 space-y-2">
                <div class="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>$${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>IVA (${invoice.taxRate}%):</span>
                  <span>$${invoice.tax.toFixed(2)}</span>
                </div>
                <div class="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span class="text-primary">$${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- Notas -->
            ${invoice.notes ? `
              <div class="bg-gray-50 p-4 rounded">
                <p class="text-sm font-semibold text-gray-700">Notas:</p>
                <p class="text-gray-600 text-sm mt-1">${invoice.notes}</p>
              </div>
            ` : ''}
          </div>
          <div class="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
            <button class="close-invoice px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Cerrar</button>
            <button class="print-invoice px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">🖨️ Imprimir</button>
          </div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = detailHtml;
    document.body.appendChild(modal);

    modal.querySelectorAll('.close-invoice').forEach(btn => {
      btn.addEventListener('click', () => modal.remove());
    });

    modal.querySelector('.print-invoice')?.addEventListener('click', () => {
      window.print();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal.firstElementChild?.parentElement) {
        modal.remove();
      }
    });
  }
};
