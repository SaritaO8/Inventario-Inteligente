# 🚀 Guía Rápida de Inicio

## ¿Qué es esto?

Un frontend completo para un **Sistema de Gestión de Inventario Inteligente** con 6 pantallas principales:

1. **Dashboard** - Métricas y resumen del sistema
2. **Productos** - Gestión de catálogo
3. **Inventario** - Control de stock
4. **Ventas** - Registro de transacciones
5. **Facturas** - Consulta y descarga
6. **Chatbot** - Asistente conversacional

## ⚡ Inicio Rápido (5 minutos)

### 1. Verificar Node.js
```bash
node --version  # Debe ser v14+
npm --version
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Compilar estilos
```bash
npm run build
```

### 4. Servir la aplicación
```bash
# Opción A: Python
python -m http.server 8000

# Opción B: Node.js
npx http-server

# Opción C: Live Server
npm install -g live-server && live-server
```

### 5. Abrir en navegador
```
http://localhost:8000
```

¡Listo! 🎉

---

## 📁 Estructura Clave

```
src/
├── app.js           ← Entrada de la aplicación
├── pages/           ← Las 6 pantallas
├── api/             ← Consumo de API
├── state/           ← Gestión de estado
├── components/      ← Componentes reutilizables
└── utils/           ← Funciones auxiliares
```

---

## 🔌 Conectar con tu API .NET

Editar `src/api/client.js`:

```javascript
const API_BASE_URL = 'http://tu-url-api:puerto/api';
```

---

## 🎨 Cambiar Colores

Editar `tailwind.config.js`:

```javascript
colors: {
  primary: '#TU-COLOR',      // Color principal
  secondary: '#OTRO-COLOR',  // Color secundario
  danger: '#ROJO',
  warning: '#AMARILLO'
}
```

---

## 📝 Estructura de Páginas

Todas las páginas siguen este patrón:

```javascript
export const miPagina = {
  // 1. Renderizar HTML
  render: async () => {
    return `<div>...</div>`;
  },
  
  // 2. Inicializar (cargar datos, listeners)
  init: async () => {
    const datos = await api.getDatos();
    // ... procesamiento
  }
};
```

---

## 💾 Agregar una Nueva Página

### Paso 1: Crear archivo `src/pages/nueva.js`
```javascript
export const nuevaPagina = {
  render: async () => `
    <div>
      <h1>Mi Nueva Página</h1>
    </div>
  `,
  init: async () => {
    console.log('Página inicializada');
  }
};
```

### Paso 2: Importar en `src/utils/router.js`
```javascript
import { nuevaPagina } from '../pages/nueva.js';

const pages = {
  // ... otras páginas
  nueva: nuevaPagina
};
```

### Paso 3: Agregar botón en sidebar
Editar `src/components/common.js`, función `createSidebar()`:
```javascript
<button ... data-page="nueva">
  🆕 Nueva Página
</button>
```

---

## 🔍 Depuración

### Ver estado global
```javascript
// En la consola del navegador
import { store } from './src/state/store.js';
console.log(store.getState());
```

### Ver errores de API
Los errores aparecen en la consola del navegador (F12).

### Modo desarrollo con logs
```javascript
// En src/app.js, descomentar:
store.subscribe((state) => {
  console.log('Estado:', state);
});
```

---

## 📊 Endpoints Esperados

Tu API .NET debe tener estos endpoints:

```
GET    /api/products              → lista de productos
POST   /api/products              → crear producto
PUT    /api/products/{id}         → actualizar
DELETE /api/products/{id}         → eliminar

GET    /api/inventory             → stock
PUT    /api/inventory/{id}        → actualizar stock
GET    /api/inventory/low-stock   → bajo stock

GET    /api/sales                 → ventas
GET    /api/sales/{id}            → detalle venta

GET    /api/invoices              → facturas
GET    /api/invoices/{id}         → detalle factura
GET    /api/invoices/{id}/download → PDF

GET    /api/dashboard/metrics     → métricas

POST   /api/chatbot/message       → chatbot
```

---

## 🎯 Tareas Comunes

### Cambiar color de botón
```html
<!-- De azul a verde -->
<button class="bg-green-500 hover:bg-green-600">Guardar</button>
```

### Agregar nuevo filtro
```javascript
// En la página
<select id="nuevoFiltro">
  <option value="opcion1">Opción 1</option>
</select>

// En el código
document.getElementById('nuevoFiltro')?.addEventListener('change', () => {
  filtrar();
});
```

### Mostrar mensaje de éxito
```javascript
import { createAlert } from './src/components/common.js';

container.innerHTML = createAlert('¡Operación exitosa!', 'success');
```

### Cargar datos desde API
```javascript
import { api, handleApiError } from './src/api/client.js';
import { actions } from './src/state/store.js';

try {
  actions.setLoading(true);
  const datos = await api.getDatos();
  actions.setDatos(datos);
} catch (error) {
  actions.setError(handleApiError(error));
} finally {
  actions.setLoading(false);
}
```

---

## ⚙️ Desarrollo Avanzado

### Agregar Tailwind Watch
```bash
npm run dev
```
Compila CSS automáticamente mientras trabajas.

### Construir para Producción
```bash
npm run build
```

### Deploy a Netlify
1. Compilar: `npm run build`
2. Subirficar con archivos estáticos
3. Configurar ambiente: `API_URL=https://tu-api.com`

---

## 🐛 Problemas Comunes

### ❌ "API no responde"
- Verificar que API .NET está ejecutándose
- Verificar URL en `src/api/client.js`
- Verificar CORS en API

### ❌ "Estilos no cargan"
- Ejecutar `npm run build`
- Refrescar navegador (Ctrl+Shift+R)

### ❌ "Modales no aparecen"
- Verificar que `setupComponentListeners()` se ejecutó
- Revisar consola del navegador (F12)

---

## 📚 Documentación Completa

Ver:
- **README.md** - Información general
- **COMPONENTS.md** - Referencia de componentes
- **Carpeta src/** - Código comentado

---

## 🎓 Próximos Pasos

1. ✅ Clonar proyecto
2. ✅ Instalar dependencias
3. ✅ Conectar con API .NET
4. ✅ Personalizarcolores y textos
5. ✅ Agregar nuevas características
6. ✅ Desplegar a producción

---

## 💡 Tips

- 📱 Diseño totalmente responsivo
- 🎨 Fácil de personalizar con Tailwind
- 🔄 Estado global centralizado
- 📡 Cliente HTTP limpio
- 🛣️ Router simple pero efectivo
- ♻️ Componentes reutilizables

---

**¡A programar! 💻**

Si tienes dudas, revisa la documentación o consulta el código comentado.
