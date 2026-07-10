/**
 * Productos Page
 */

import { api } from '../api/client.js';
import { actions, store } from '../state/store.js';
import { createCard, createButton, createModal, createLoader, createAlert } from '../components/common.js';

export const productsPage = {
  render: async () => {
    actions.setCurrentPage('products');
    
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Productos</h1>
            <p class="text-gray-600 mt-2">Gestiona tu catálogo de productos</p>
          </div>
          <button id="addProductBtn" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium">
            ➕ Nuevo Producto
          </button>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex flex-col md:flex-row gap-4">
            <input type="text" id="searchInput" placeholder="Buscar productos..." class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <select id="statusFilter" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <select id="categoryFilter" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todas las categorías</option>
              <option value="electronics">Electrónica</option>
              <option value="clothing">Ropa</option>
              <option value="food">Alimentos</option>
            </select>
          </div>
        </div>

        <!-- Lista de Productos -->
        <div id="products-container">
          ${createLoader()}
        </div>
      </div>

      <!-- Modal para crear/editar producto -->
      ${createModal('product-modal', 'Nuevo Producto', `
        <form id="productForm" class="space-y-4">
          <input type="hidden" id="productId">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" id="productName" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea id="productDescription" rows="3" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input type="number" id="productPrice" step="0.01" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select id="productCategory" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="electronics">Electrónica</option>
                <option value="clothing">Ropa</option>
                <option value="food">Alimentos</option>
              </select>
            </div>
          </div>
          <div class="flex gap-2">
            <button type="submit" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium">Guardar</button>
            <button type="button" class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium modal-close" data-modal-id="product-modal">Cancelar</button>
          </div>
        </form>
      `)}
    `;
  },

  init: async () => {
    try {
      const products = await api.getProducts();
      actions.setProducts(products);
      productsPage.renderProducts(products);
      productsPage.setupEventListeners();
    } catch (error) {
      const container = document.getElementById('products-container');
      if (container) {
        container.innerHTML = createAlert('Error al cargar productos', 'error');
      }
    }
  },

  renderProducts: (products) => {
    const container = document.getElementById('products-container');
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg">📭 No hay productos disponibles</p></div>';
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${products.map(product => `
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div class="aspect-video bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center text-4xl">
              📦
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-lg text-gray-900">${product.name}</h3>
              <p class="text-gray-600 text-sm mt-1">${product.category}</p>
              <p class="text-primary font-bold text-lg mt-2">$${product.price.toFixed(2)}</p>
              <div class="flex justify-between items-center mt-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                  ${product.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div class="flex gap-2 mt-4">
                <button class="flex-1 px-3 py-2 bg-blue-100 text-primary rounded hover:bg-blue-200 transition text-sm font-medium edit-product" data-id="${product.id}">Editar</button>
                <button class="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm font-medium delete-product" data-id="${product.id}">Eliminar</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  setupEventListeners: () => {
    // Botón agregar producto
    document.getElementById('addProductBtn')?.addEventListener('click', () => {
      document.getElementById('productId').value = '';
      document.getElementById('productForm').reset();
      document.getElementById('product-modal').classList.remove('hidden');
    });

    // Formulario de producto
    document.getElementById('productForm')?.addEventListener('submit', productsPage.handleSaveProduct);

    // Botones de editar y eliminar
    document.querySelectorAll('.edit-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const product = actions.store.getState().products.find(p => p.id === parseInt(e.target.dataset.id));
        if (product) {
          document.getElementById('productId').value = product.id;
          document.getElementById('productName').value = product.name;
          document.getElementById('productDescription').value = product.description;
          document.getElementById('productPrice').value = product.price;
          document.getElementById('productCategory').value = product.category;
          document.getElementById('product-modal').classList.remove('hidden');
        }
      });
    });

    document.querySelectorAll('.delete-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('¿Deseas eliminar este producto?')) {
          productsPage.handleDeleteProduct(id);
        }
      });
    });

    // Filtros
    document.getElementById('searchInput')?.addEventListener('input', productsPage.filterProducts);
    document.getElementById('statusFilter')?.addEventListener('change', productsPage.filterProducts);
    document.getElementById('categoryFilter')?.addEventListener('change', productsPage.filterProducts);
  },

  handleSaveProduct: async (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const product = {
      name: document.getElementById('productName').value,
      description: document.getElementById('productDescription').value,
      price: parseFloat(document.getElementById('productPrice').value),
      category: document.getElementById('productCategory').value
    };

    try {
      actions.setLoading(true);
      if (id) {
        await api.updateProduct(id, product);
      } else {
        await api.createProduct(product);
      }
      
      const products = await api.getProducts();
      actions.setProducts(products);
      productsPage.renderProducts(products);
      document.getElementById('product-modal').classList.add('hidden');
    } catch (error) {
      alert('Error al guardar producto: ' + error.message);
    } finally {
      actions.setLoading(false);
    }
  },

  handleDeleteProduct: async (id) => {
    try {
      await api.deleteProduct(id);
      const products = await api.getProducts();
      actions.setProducts(products);
      productsPage.renderProducts(products);
    } catch (error) {
      alert('Error al eliminar producto: ' + error.message);
    }
  },

  filterProducts: () => {
    const products = store.getState().products;
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const status = document.getElementById('statusFilter')?.value || 'all';
    const category = document.getElementById('categoryFilter')?.value || 'all';

    const filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
      const matchesStatus = status === 'all' || (status === 'active' ? p.active : !p.active);
      const matchesCategory = category === 'all' || p.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    productsPage.renderProducts(filtered);
    productsPage.setupEventListeners();
  }
};
