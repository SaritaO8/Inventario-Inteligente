# 📂 Estructura y Organización del Proyecto

## 🎯 Descripción General

Este es un frontend modular y escalable construido con **JavaScript vanilla**, **Tailwind CSS** y **estado centralizado**.

La aplicación está organizada por **capas**:
- **Presentación** (Pages)
- **Componentes** (Components)
- **Lógica de negocio** (State)
- **Comunicación** (API)
- **Utilidades** (Utils)

---

## 📁 Árbol de Archivos Completo

```
frontend-inventario/
│
├── 📄 index.html                    # Punto de entrada HTML
├── 📄 package.json                  # Dependencias del proyecto
├── 📄 tailwind.config.js            # Configuración de Tailwind
├── 📄 .gitignore                    # Archivos ignorados por git
├── 📄 .env.example                  # Variables de ejemplo
│
├── 📋 Documentación
├── 📄 README.md                     # Documentación principal
├── 📄 GUIA_RAPIDA.md                # Guía rápida de inicio
├── 📄 COMPONENTS.md                 # Referencia de componentes
├── 📄 ESTRUCTURA.md                 # Este archivo
│
├── 📁 dist/                         # Carpeta de compilación (generada)
│   └── 📄 output.css                # CSS compilado por Tailwind
│
└── 📁 src/                          # **CARPETA PRINCIPAL**
    │
    ├── 📄 app.js                    # 🚀 ENTRADA - Inicializa la app
    │
    ├── 📁 pages/                    # 📺 PANTALLAS - Cada página es un módulo
    │   ├── 📄 dashboard.js          # Dashboard - métricas
    │   ├── 📄 products.js           # Productos - CRUD
    │   ├── 📄 inventory.js          # Inventario - stock
    │   ├── 📄 sales.js              # Ventas - transacciones
    │   ├── 📄 invoices.js           # Facturas - documentos
    │   └── 📄 chatbot.js            # Chatbot - IA asistente
    │
    ├── 📁 components/               # 🧩 COMPONENTES - Reutilizables
    │   ├── 📄 common.js             # Componentes globales
    │   └── 📄 PLANTILLA.js          # Ejemplos de componentes
    │
    ├── 📁 state/                    # 🔄 ESTADO GLOBAL
    │   └── 📄 store.js              # Gestor de estado centralizado
    │
    ├── 📁 api/                      # 🌐 COMUNICACIÓN CON API
    │   └── 📄 client.js             # Cliente HTTP - métodos API
    │
    ├── 📁 utils/                    # 🛠️ FUNCIONES AUXILIARES
    │   └── 📄 router.js             # Router - navegación SPA
    │
    └── 📁 css/                      # 🎨 ESTILOS
        └── 📄 input.css             # Estilos globales Tailwind
```

---

## 📚 Descripción de Cada Archivo

### Raíz del Proyecto

| Archivo | Propósito |
|---------|-----------|
| `index.html` | HTML principal, carga app.js |
| `package.json` | Dependencias Node.js |
| `tailwind.config.js` | Configuración de Tailwind CSS |
| `.gitignore` | Archivos ignorados por Git |
| `.env.example` | Variables de entorno de ejemplo |

### Documentación

| Archivo | Contenido |
|---------|----------|
| `README.md` | Documentación completa del proyecto |
| `GUIA_RAPIDA.md` | Cómo empezar en 5 minutos |
| `COMPONENTS.md` | Referencia de componentes disponibles |
| `ESTRUCTURA.md` | Este archivo |

### src/app.js

```javascript
// PUNTO DE ENTRADA DE LA APLICACIÓN
// Responsabilidades:
// ✓ Crear layout principal
// ✓ Inicializar router
// ✓ Configurar listeners globales
// ✓ Manejar tema (dark/light)

import { router } from './utils/router.js';
// ... etc
```

**Qué hace:**
1. Renderiza el header y sidebar
2. Inicializa el router
3. Navega a dashboard por defecto

---

### src/pages/

**PÁGINAS O "VISTAS"**

Cada página es un módulo independiente con:

```javascript
export const miPagina = {
  render: async () => {
    // Devuelve HTML
  },
  init: async () => {
    // Carga datos y configura listeners
  }
};
```

| Página | Funcionalidad |
|--------|--------------|
| `dashboard.js` | Métricas del sistema |
| `products.js` | Gestión de productos |
| `inventory.js` | Control de inventario |
| `sales.js` | Registro de ventas |
| `invoices.js` | Consulta de facturas |
| `chatbot.js` | Chat con IA |

**Patrón:**
1. Usuario hace click en navegación
2. Router llama a `navigate(pageName)`
3. Se ejecuta `render()` → genera HTML
4. Se ejecuta `init()` → carga datos y listeners

---

### src/components/common.js

**COMPONENTES REUTILIZABLES**

Funciones que generan HTML para elementos comunes:

```javascript
createHeader()           // Barra superior
createSidebar()          // Menú lateral
createCard()             // Tarjeta con contenido
createButton()           // Botón estilizado
createModal()            // Diálogo modal
createAlert()            // Alertas (success/error/warning/info)
createLoader()           // Indicador de carga
createEmptyState()       // Estado vacío
```

**Características:**
- Reutilizable en múltiples lugares
- Estilizado con Tailwind
- Fácil de customizar

---

### src/state/store.js

**GESTOR DE ESTADO GLOBAL**

Implementa patrón Observable para reactivity:

```javascript
store              // Objeto con estado global
store.getState()   // Obtener estado actual
store.setState()   // Actualizar estado
store.subscribe()  // Reaccionar a cambios

actions            // Funciones para actualizar estado
actions.setProducts()
actions.setLoading()
// ... etc
```

**Estado global incluye:**
- `currentPage` - Página actual
- `user` - Usuario logueado
- `products` - Lista de productos
- `inventory` - Stock de productos
- `sales` - Transacciones
- `invoices` - Facturas
- `messages` - Chat messages
- `loading` - Estado de carga
- `error` - Mensaje de error
- `filters` - Filtros aplicados
- `darkMode` - Tema oscuro

---

### src/api/client.js

**CLIENTE HTTP - COMUNICACIÓN CON API .NET**

Métodos para consumir endpoints:

```javascript
// Productos
api.getProducts()
api.createProduct(data)
api.updateProduct(id, data)
api.deleteProduct(id)

// Inventario
api.getInventory()
api.updateStock(productId, qty)
api.getLowStockProducts()

// Ventas
api.getSales()
api.getSaleDetail(id)

// Facturas
api.getInvoices()
api.getInvoiceDetail(id)
api.downloadInvoice(id)

// Dashboard
api.getDashboardMetrics()

// Chatbot
api.sendChatMessage(message)
```

**Características:**
- Manejo de errores centralizado
- Headers HTTP configurables
- Base URL configurable
- Función `handleApiError()` para errores

---

### src/utils/router.js

**ENRUTADOR - NAVEGACIÓN SPA**

Gestiona la navegación entre páginas:

```javascript
router.navigate('dashboard')   // Navegar
router.init()                  // Inicializar listeners
```

**Flujo:**
1. Usuario hace click en botón de navegación
2. Se ejecuta `router.navigate(pageKey)`
3. Se renderiza la página
4. Se inicializa la página

---

### src/css/input.css

**ESTILOS GLOBALES**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos personalizados */
/* Scrollbar */
/* Animaciones */
/* ... etc */
```

Se compila a `dist/output.css` (⚠️ No editar directamente)

---

## 🔄 Flujo de la Aplicación

```
1. index.html carga
   ↓
2. app.js se ejecuta
   ├─ Renderiza layout (header + sidebar)
   ├─ Inicializa router
   └─ Configura listeners globales
   ↓
3. Router navega a dashboard por defecto
   ├─ Renderiza HTML de dashboard
   └─ Inicializa dashboard (carga datos)
   ↓
4. Usuario interactúa
   ├─ Click en botón → evento
   ├─ Router.navigate(page) → nueva página
   ├─ Renderizar + Inicializar
   └─ Volver al paso 3
```

---

## 📝 Convenciones de Código

### Nombres de Archivos
- `kebab-case` para carpetas
- `camelCase` para variables/funciones
- `PascalCase` para clases (no aplicable aquí)

### Estructura de Módulos
```javascript
// Importar dependencias
import { api } from '../api/client.js';

// Exportar objeto principal
export const miModulo = {
  render: async () => { ... },
  init: async () => { ... },
  metodos: () => { ... }
};
```

### Comentarios
```javascript
// Comentario simple para lógica

/**
 * Comentario JSDoc para funciones públicas
 * @param {type} name - Descripción
 * @returns {type} Descripción
 */
```

---

## 🎯 Patrones Comunes

### Cargación de Datos
```javascript
try {
  actions.setLoading(true);
  const data = await api.getData();
  actions.setData(data);
} catch (error) {
  actions.setError(error.message);
} finally {
  actions.setLoading(false);
}
```

### Reacción a Cambios de Estado
```javascript
store.subscribe((state) => {
  if (state.error) {
    console.error(state.error);
  }
});
```

### Event Listeners
```javascript
document.getElementById('myBtn')?.addEventListener('click', () => {
  // Acción
});
```

### Condicionales HTML
```javascript
${condition ? '<div>Verdadero</div>' : '<div>Falso</div>'}
```

### Loop de Arrays
```javascript
${array.map(item => `<div>${item.name}</div>`).join('')}
```

---

## 🚀 Cómo Agregar Nuevas Funcionalidades

### 1. Nueva Página
1. Crear `src/pages/nueva.js`
2. Importar en `src/utils/router.js`
3. Agregar botón en `src/components/common.js`

### 2. Nuevo Componente
1. Crear función en `src/components/common.js`
2. Importar en páginas
3. Usar junto a otros componentes

### 3. Nuevo Endpoint API
1. Agregar método en `src/api/client.js`
2. Usar en páginas con `api.miMetodo()`

### 4. Nuevo Estado Global
1. Agregar propiedad en `src/state/store.js`
2. Crear acción correspondiente
3. Usar en páginas con `actions.miAccion()`

---

## 🧪 Testing Manual

### Verificar cada página
- Dashboard carga métricas ✓
- Productos muestra lista ✓
- Inventario carga stock ✓
- Ventas muestra transacciones ✓
- Facturas lista documentos ✓
- Chatbot acepta mensajes ✓

### Verificar funcionalidades
- Navegación entre páginas ✓
- Carga de datos desde API ✓
- Filtros funcionan ✓
- Modales abren/cierran ✓
- Formularios se envían ✓
- Tema oscuro cambia ✓

---

## 📊 Dependencias

| Dependencia | Versión | Uso |
|------------|---------|-----|
| tailwindcss | 3.3.0 | Estilos CSS |

**Nota:** El proyecto usa JavaScript vanilla, sin frameworks como React o Vue.

---

## 💾 Variables Persistentes

- **localStorage**: Tema oscuro (`darkMode`)

---

## 🔐 Consideraciones de Seguridad

- ⚠️ No guardar tokens en localStorage (usar sessionStorage o cookies secure)
- ⚠️ Validar entrada de usuario en formularios
- ⚠️ Usar HTTPS en producción
- ⚠️ Configurar CORS en API backend

---

## 📈 Performance

- Carga inicial rápida (HTML + JS vanilla)
- CSS compilado minimizado
- Lazy loading podría agregarse en futuro
- State management centralizado evita prop drilling

---

## 🔗 Referencias de Archivos

- Tailwind CSS: https://tailwindcss.com/
- MDN JavaScript: https://developer.mozilla.org/
- Observable Pattern: https://en.wikipedia.org/wiki/Observer_pattern

---

**Última actualización:** 2024
**Versión:** 1.0.0
