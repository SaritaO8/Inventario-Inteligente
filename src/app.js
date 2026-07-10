/**
 * Main Application Entry Point
 */

import { router } from './utils/router.js';
import { store, actions } from './state/store.js';
import { createHeader, createSidebar, setupComponentListeners } from './components/common.js';

class App {
  constructor() {
    this.init();
  }

  async init() {
    try {
      this.renderLayout();
      this.setupEventListeners();
      this.setupStoreSubscription();
      router.init();
    } catch (error) {
      console.error('Error inicializando aplicación:', error);
    }
  }

  renderLayout() {
    const root = document.getElementById('app');
    if (!root) return;

    root.innerHTML = `
      ${createHeader()}
      ${createSidebar()}
      <main class="ml-64 mt-20 p-6 min-h-screen bg-gray-50">
        <div id="main-content" class="max-w-7xl mx-auto">
          <!-- El contenido se cargará aquí -->
        </div>
      </main>
    `;
  }

  setupEventListeners() {
    setupComponentListeners();

    // Botón de modo oscuro
    document.getElementById('darkModeBtn')?.addEventListener('click', () => {
      actions.toggleDarkMode();
      this.applyTheme();
    });

    // Aplicar tema inicial
    this.applyTheme();
  }

  applyTheme() {
    const isDarkMode = store.getState().darkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900', 'dark:text-white');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900', 'dark:text-white');
    }
  }

  setupStoreSubscription() {
    store.subscribe((state) => {
      // Aquí puedes reaccionar a cambios globales de estado
      console.log('Estado actualizado:', state);
    });
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
