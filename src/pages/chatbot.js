/**
 * Chatbot Page
 */

import { api } from '../api/client.js';
import { actions, store } from '../state/store.js';
import { createCard, createLoader } from '../components/common.js';

export const chatbotPage = {
  render: async () => {
    actions.setCurrentPage('chatbot');
    actions.setMessages([]);
    
    return `
      <div class="space-y-6 h-full flex flex-col">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Chatbot Asistente</h1>
          <p class="text-gray-600 mt-2">Interactúa con nuestro asistente inteligente</p>
        </div>

        <!-- Chat Container -->
        <div class="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          <!-- Mensajes -->
          <div id="messages-container" class="flex-1 overflow-y-auto p-6 space-y-4">
            <div class="flex justify-center">
              <div class="text-center">
                <div class="text-5xl mb-2">💬</div>
                <p class="text-gray-600">¡Hola! ¿Cómo puedo ayudarte hoy?</p>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="border-t p-4 bg-gray-50">
            <div class="flex gap-3">
              <textarea 
                id="messageInput" 
                placeholder="Escribe tu mensaje aquí..." 
                rows="2"
                class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
              <button 
                id="sendBtn" 
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                📤
              </button>
            </div>
            <div class="mt-3 flex flex-wrap gap-2" id="suggestionsContainer">
              <!-- Sugerencias se cargarán aquí -->
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button class="quick-action-btn bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition" data-action="products">
            <div class="text-3xl mb-2">📦</div>
            <p class="font-medium text-gray-900">Ver Productos</p>
            <p class="text-xs text-gray-600 mt-1">Catálogo disponible</p>
          </button>
          <button class="quick-action-btn bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition" data-action="orders">
            <div class="text-3xl mb-2">🛒</div>
            <p class="font-medium text-gray-900">Mis Órdenes</p>
            <p class="text-xs text-gray-600 mt-1">Historial de compras</p>
          </button>
          <button class="quick-action-btn bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition" data-action="stock">
            <div class="text-3xl mb-2">📋</div>
            <p class="font-medium text-gray-900">Verificar Stock</p>
            <p class="text-xs text-gray-600 mt-1">Disponibilidad</p>
          </button>
          <button class="quick-action-btn bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition" data-action="help">
            <div class="text-3xl mb-2">❓</div>
            <p class="font-medium text-gray-900">Ayuda</p>
            <p class="text-xs text-gray-600 mt-1">Preguntas frecuentes</p>
          </button>
        </div>
      </div>
    `;
  },

  init: async () => {
    chatbotPage.setupEventListeners();
    chatbotPage.loadSuggestions();
  },

  setupEventListeners: () => {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    // Enviar mensaje con botón
    sendBtn?.addEventListener('click', () => chatbotPage.handleSendMessage());

    // Enviar con Enter (Shift+Enter para nueva línea)
    messageInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatbotPage.handleSendMessage();
      }
    });

    // Acciones rápidas
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        chatbotPage.handleQuickAction(action);
      });
    });
  },

  handleSendMessage: async () => {
    const input = document.getElementById('messageInput');
    const message = input?.value.trim();

    if (!message) return;

    // Agregar mensaje del usuario
    chatbotPage.addMessageToChat('user', message);
    input.value = '';

    try {
      actions.setLoading(true);
      const response = await api.sendChatMessage(message);
      chatbotPage.addMessageToChat('bot', response.message);

      // Si hay sugerencias de productos
      if (response.suggestions && response.suggestions.length > 0) {
        chatbotPage.showProductSuggestions(response.suggestions);
      }

      // Si se confirma una compra
      if (response.type === 'purchase_confirmation') {
        chatbotPage.showPurchaseConfirmation(response.purchase);
      }
    } catch (error) {
      chatbotPage.addMessageToChat('bot', '❌ Error al procesar tu mensaje. Intenta de nuevo.');
    } finally {
      actions.setLoading(false);
    }
  },

  addMessageToChat: (sender, message) => {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} fade-in`;
    
    const content = document.createElement('div');
    content.className = `max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
      sender === 'user' 
        ? 'bg-primary text-white rounded-br-none' 
        : 'bg-gray-100 text-gray-900 rounded-bl-none'
    }`;
    content.textContent = message;

    messageEl.appendChild(content);
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;

    // Guardar en estado
    actions.addMessage({ sender, message, timestamp: new Date() });
  },

  showProductSuggestions: (products) => {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const suggestionEl = document.createElement('div');
    suggestionEl.className = 'flex justify-start fade-in';
    
    suggestionEl.innerHTML = `
      <div class="w-full">
        <p class="text-sm text-gray-600 mb-3 font-medium">💡 Productos recomendados:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${products.map(product => `
            <div class="bg-white border border-primary rounded-lg p-3 hover:shadow-md transition cursor-pointer product-card" data-product-id="${product.id}">
              <p class="font-medium text-gray-900">${product.name}</p>
              <p class="text-primary font-bold">$${product.price.toFixed(2)}</p>
              <p class="text-xs text-gray-600 mt-1">${product.description}</p>
              <button class="add-to-cart-btn mt-2 w-full px-2 py-1 bg-primary text-white rounded text-sm hover:bg-blue-600" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
                🛒 Agregar
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(suggestionEl);
    container.scrollTop = container.scrollHeight;

    // Event listeners para agregar al carrito
    suggestionEl.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productName = e.target.dataset.productName;
        const price = e.target.dataset.productPrice;
        chatbotPage.addMessageToChat('user', `Agregar ${productName} al carrito`);
        setTimeout(() => {
          chatbotPage.addMessageToChat('bot', `✓ He agregado ${productName} ($${price}) a tu carrito. ¿Deseas agregar algo más o proceder al pago?`);
        }, 500);
      });
    });
  },

  showPurchaseConfirmation: (purchase) => {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const confirmEl = document.createElement('div');
    confirmEl.className = 'flex justify-start fade-in';
    
    confirmEl.innerHTML = `
      <div class="w-full bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 class="font-bold text-green-900 mb-2">✓ Compra Confirmada</h3>
        <div class="text-sm text-green-800 space-y-1">
          <p><strong>Número de Orden:</strong> #${purchase.orderNumber}</p>
          <p><strong>Total:</strong> $${purchase.total.toFixed(2)}</p>
          <p><strong>Estado:</strong> Pendiente de envío</p>
          <p class="text-xs mt-2">Se ha enviado una confirmación a tu correo electrónico</p>
        </div>
      </div>
    `;

    container.appendChild(confirmEl);
    container.scrollTop = container.scrollHeight;
  },

  handleQuickAction: (action) => {
    const messages = {
      products: '¿Qué productos tienes disponibles?',
      orders: 'Quiero ver mis órdenes anteriores',
      stock: '¿Hay disponibilidad de productos?',
      help: 'Necesito ayuda'
    };

    const message = messages[action] || 'Hola';
    document.getElementById('messageInput').value = message;
    chatbotPage.handleSendMessage();
  },

  loadSuggestions: () => {
    const container = document.getElementById('suggestionsContainer');
    if (!container) return;

    const suggestions = ['Ver catálogo', 'Últimas compras', 'Promociones', 'Soporte'];
    container.innerHTML = suggestions.map(suggestion => `
      <button class="text-xs px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition suggestion-btn">
        ${suggestion}
      </button>
    `).join('');

    container.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('messageInput').value = btn.textContent;
        chatbotPage.handleSendMessage();
      });
    });
  }
};
