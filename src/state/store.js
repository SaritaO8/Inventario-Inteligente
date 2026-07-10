/**
 * Simple State Management Store
 * Implementa un patrón de Observables para reactivity
 */

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  getState() {
    return this.state;
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Estado global de la aplicación
export const store = new Store({
  currentPage: 'dashboard',
  user: null,
  products: [],
  inventory: [],
  sales: [],
  invoices: [],
  messages: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    status: 'all',
    category: 'all'
  },
  darkMode: localStorage.getItem('darkMode') === 'true'
});

// Acciones globales
export const actions = {
  setCurrentPage: (page) => store.setState({ currentPage: page }),
  setUser: (user) => store.setState({ user }),
  setProducts: (products) => store.setState({ products }),
  setInventory: (inventory) => store.setState({ inventory }),
  setSales: (sales) => store.setState({ sales }),
  setInvoices: (invoices) => store.setState({ invoices }),
  setMessages: (messages) => store.setState({ messages }),
  setLoading: (loading) => store.setState({ loading }),
  setError: (error) => store.setState({ error }),
  setFilters: (filters) => store.setState({ filters: { ...store.getState().filters, ...filters } }),
  toggleDarkMode: () => {
    const newDarkMode = !store.getState().darkMode;
    localStorage.setItem('darkMode', newDarkMode);
    store.setState({ darkMode: newDarkMode });
  },
  addMessage: (message) => {
    const messages = store.getState().messages;
    store.setState({ messages: [...messages, message] });
  },
  clearError: () => store.setState({ error: null })
};
