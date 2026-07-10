# 📚 Documentación de Componentes

## Componentes Globales (common.js)

### `createHeader()`
Crea el header superior con logo, tema y notificaciones.

```javascript
const headerHtml = createHeader();
```

**Elementos:**
- Logo y nombre de la aplicación
- Botón de modo oscuro
- Botón de notificaciones
- Perfil de usuario

---

### `createSidebar()`
Crea la barra lateral de navegación.

```javascript
const sidebarHtml = createSidebar();
```

**Navegación:**
- Dashboard
- Productos
- Inventario
- Ventas
- Facturas
- Chatbot

---

### `createCard(title, content, className)`
Crea una tarjeta reutilizable.

```javascript
const card = createCard('Mi Título', '<p>Contenido HTML</p>', 'md:col-span-2');
```

**Parámetros:**
- `title` (string): Título de la tarjeta
- `content` (string): Contenido HTML
- `className` (string): Clases Tailwind adicionales

---

### `createButton(text, className, id)`
Crea un botón estilizado.

```javascript
const btn = createButton('Guardar', 'w-full', 'saveBtn');
```

**Parámetros:**
- `text` (string): Texto del botón
- `className` (string): Clases adicionales
- `id` (string): ID del elemento

---

### `createModal(id, title, content)`
Crea un modal/diálogo.

```javascript
const modal = createModal('myModal', 'Confirmar', 'Contenido HTML');
```

**Parámetros:**
- `id` (string): ID único del modal
- `title` (string): Título
- `content` (string): Contenido HTML

**Funciones de utilidad:**
```javascript
openModal('myModal');    // Abrir
closeModal('myModal');   // Cerrar
```

---

### `createAlert(message, type)`
Crea una alerta.

```javascript
createAlert('Operación exitosa', 'success');
createAlert('Error al procesar', 'error');
createAlert('Advertencia', 'warning');
createAlert('Información', 'info');
```

**Tipos:**
- `success` (verde)
- `error` (rojo)
- `warning` (amarillo)
- `info` (azul)

---

### `createLoader()`
Crea un indicador de carga.

```javascript
const loader = createLoader();
```

---

### `createEmptyState(message)`
Crea un estado vacío.

```javascript
const empty = createEmptyState('No hay datos disponibles');
```

---

### `setupComponentListeners()`
Configura event listeners para componentes globales.

```javascript
setupComponentListeners();
```

Configura automáticamente:
- Cierre de modales
- Click fuera del modal para cerrar

---

## State Management (store.js)

### Store Global
```javascript
import { store, actions } from './src/state/store.js';
```

**Acceder al estado:**
```javascript
const state = store.getState();
console.log(state.products);
```

**Suscribirse a cambios:**
```javascript
const unsubscribe = store.subscribe((state) => {
  console.log('Estado cambió:', state);
});

// Desuscribirse
unsubscribe();
```

**Actualizar estado:**
```javascript
store.setState({ loading: true });
```

### Acciones Predefinidas

```javascript
// Navegación
actions.setCurrentPage('dashboard');

// Usuario
actions.setUser(userData);

// Datos
actions.setProducts(productsArray);
actions.setInventory(inventoryArray);
actions.setSales(salesArray);
actions.setInvoices(invoicesArray);
actions.setMessages(messagesArray);

// UI
actions.setLoading(true);
actions.setError('Mensaje de error');
actions.clearError();

// Filtros
actions.setFilters({ searchTerm: 'busqueda', status: 'active' });

// Tema
actions.toggleDarkMode();

// Mensajes del chat
actions.addMessage({ sender: 'user', message: 'Hola' });
```

---

## API Client (client.js)

### Uso Básico

```javascript
import { api, handleApiError } from './src/api/client.js';

try {
  const products = await api.getProducts();
} catch (error) {
  const message = handleApiError(error);
  console.error(message);
}
```

### Métodos Disponibles

#### Productos
```javascript
api.getProducts()                    // GET todos
api.createProduct(data)             // POST crear
api.updateProduct(id, data)         // PUT actualizar
api.deleteProduct(id)               // DELETE eliminar
```

#### Inventario
```javascript
api.getInventory()                  // GET stock actual
api.updateStock(productId, qty)     // PUT actualizar cantidad
api.getLowStockProducts()           // GET bajo stock
api.getInventoryMovements(productId) // GET historial
```

#### Ventas
```javascript
api.getSales()                      // GET todas
api.getSaleDetail(saleId)           // GET detalle
api.getSalesByOrigin(origin)        // GET filtradas
```

#### Facturas
```javascript
api.getInvoices()                   // GET todas
api.getInvoiceDetail(invoiceId)     // GET detalle
api.downloadInvoice(invoiceId)      // GET blob PDF
```

#### Dashboard
```javascript
api.getDashboardMetrics()           // GET métricas
```

#### Chatbot
```javascript
api.sendChatMessage(message)        // POST mensaje
```

---

## Router (router.js)

```javascript
import { router } from './src/utils/router.js';

// Inicializar
router.init();

// Navegar
router.navigate('dashboard');
router.navigate('products');
router.navigate('chatbot');
```

---

## Ejemplos de Uso

### Crear una tarjeta con botón

```javascript
const cardHtml = createCard(
  'Productos',
  `
    <p>Total: 150 productos</p>
    ${createButton('Ver más', 'mt-4', 'viewMoreBtn')}
  `,
  'md:col-span-2'
);
```

### Modal con formulario

```javascript
const modal = createModal(
  'product-form',
  'Nuevo Producto',
  `
    <form id="productForm">
      <input type="text" placeholder="Nombre" required>
      <input type="number" placeholder="Precio" required>
      ${createButton('Guardar', 'w-full mt-4')}
    </form>
  `
);
```

### Reaccionar a cambios de estado

```javascript
import { store, actions } from './src/state/store.js';

store.subscribe((state) => {
  if (state.error) {
    console.error('Error:', state.error);
    actions.clearError();
  }
});
```

### Cargar datos desde API

```javascript
import { api } from './src/api/client.js';
import { actions } from './src/state/store.js';

async function loadProducts() {
  try {
    actions.setLoading(true);
    const products = await api.getProducts();
    actions.setProducts(products);
  } catch (error) {
    actions.setError(error.message);
  } finally {
    actions.setLoading(false);
  }
}
```

---

## Tips y Buenas Prácticas

1. **Siempre usar `actions`** para actualizar estado global
2. **Importar solo lo necesario** de cada módulo
3. **Usar `try/catch`** al consumir APIs
4. **Mantener componentes simples** y reutilizables
5. **Evitar duplicación** de código HTML
6. **Usar clases Tailwind** en lugar de CSS personalizado
7. **Documentar funciones** complejas

---

**Última actualización**: 2024
