/**
 * Router - Controlador de navegación entre páginas
 */

import { dashboardPage } from '../pages/dashboard.js';
import { productsPage } from '../pages/products.js';
import { inventoryPage } from '../pages/inventory.js';
import { salesPage } from '../pages/sales.js';
import { invoicesPage } from '../pages/invoices.js';
import { chatbotPage } from '../pages/chatbot.js';
import { store, actions } from '../state/store.js';

const pages = {
  dashboard: dashboardPage,
  products: productsPage,
  inventory: inventoryPage,
  sales: salesPage,
  invoices: invoicesPage,
  chatbot: chatbotPage
};

export const router = {
  /**
   * Navega a una página específica
   */
  navigate: async (pageKey) => {
    const page = pages[pageKey];
    if (!page) {
      console.error(`Página no encontrada: ${pageKey}`);
      return;
    }

    try {
      // Renderizar página
      const html = await page.render();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = html;
      }

      // Inicializar página
      if (page.init) {
        await page.init();
      }

      // Actualizar botones de navegación
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-gray-700');
        if (btn.dataset.page === pageKey) {
          btn.classList.add('bg-gray-700');
        }
      });

    } catch (error) {
      console.error('Error navegando a página:', error);
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = `
          <div class="text-center py-12">
            <p class="text-red-600 font-semibold">Error al cargar la página</p>
            <p class="text-gray-600 text-sm mt-2">${error.message}</p>
          </div>
        `;
      }
    }
  },

  /**
   * Inicializa el router con event listeners
   */
  init: () => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.target.dataset.page;
        router.navigate(page);
      });
    });

    // Navegar a dashboard por defecto
    router.navigate('dashboard');
  }
};
