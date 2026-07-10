/**
 * API Service
 * Funciones para consumir la API de .NET
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

export const api = {
  // Productos
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching products');
    return response.json();
  },

  createProduct: async (product) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Error creating product');
    return response.json();
  },

  updateProduct: async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Error updating product');
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error deleting product');
    return response.json();
  },

  // Inventario
  getInventory: async () => {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching inventory');
    return response.json();
  },

  updateStock: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/inventory/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Error updating stock');
    return response.json();
  },

  getLowStockProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching low stock products');
    return response.json();
  },

  getInventoryMovements: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/inventory/movements/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching inventory movements');
    return response.json();
  },

  // Ventas
  getSales: async () => {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching sales');
    return response.json();
  },

  getSaleDetail: async (saleId) => {
    const response = await fetch(`${API_BASE_URL}/sales/${saleId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching sale detail');
    return response.json();
  },

  getSalesByOrigin: async (origin) => {
    const response = await fetch(`${API_BASE_URL}/sales?origin=${origin}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching sales');
    return response.json();
  },

  // Facturas
  getInvoices: async () => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching invoices');
    return response.json();
  },

  getInvoiceDetail: async (invoiceId) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching invoice detail');
    return response.json();
  },

  downloadInvoice: async (invoiceId) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/download`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Error downloading invoice');
    return response.blob();
  },

  // Dashboard
  getDashboardMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error fetching metrics');
    return response.json();
  },

  // Chatbot
  sendChatMessage: async (message) => {
    const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Error sending message');
    return response.json();
  }
};

/**
 * Helper para manejar errores
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error instanceof TypeError) {
    return 'Error de conexión con el servidor';
  }
  return error.message || 'Error desconocido';
};
