# 🏪 Frontend Inventario Inteligente

Sistema de gestión de inventario frontend con interfaz de administración y chatbot integrado.

## 📋 Características

### 📊 Dashboard
- Métricas del sistema en tiempo real
- Total de productos
- Ventas del día
- Productos con bajo stock
- Ventas realizadas por chatbot
- Últimas facturas generadas

### 📦 Productos
- Crear, editar y eliminar productos
- Activar/desactivar productos
- Buscar y filtrar por categoría
- Visualizar precio y estado

### 📋 Inventario
- Consultar stock actual
- Ver productos con bajo stock
- Registrar ajustes manuales de stock
- Consultar movimientos de inventario

### 💰 Ventas
- Ver listado de ventas
- Filtrar por origen (manual o chatbot)
- Consultar detalle de cada venta
- Ver estado de la venta

### 📄 Facturas
- Ver listado de facturas
- Consultar detalle
- Buscar por número
- Descargar factura (PDF)
- Vista de impresión

### 💬 Chatbot
- Interfaz conversacional intuitiva
- Enviar y recibir mensajes
- Recomendaciones de productos
- Confirmar compras
- Sugerencias rápidas
- Consumo de API .NET

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Estilos**: Tailwind CSS 3
- **Estado**: Store Management custom (Observable pattern)
- **HTTP Client**: Fetch API
- **Arquitectura**: Modular, SPA (Single Page Application)

## 📁 Estructura del Proyecto

```
frontend-inventario/
├── src/
│   ├── app.js                 # Entrada principal
│   ├── pages/                 # Páginas/vistas
│   │   ├── dashboard.js
│   │   ├── products.js
│   │   ├── inventory.js
│   │   ├── sales.js
│   │   ├── invoices.js
│   │   └── chatbot.js
│   ├── components/
│   │   └── common.js          # Componentes reutilizables
│   ├── state/
│   │   └── store.js           # State management global
│   ├── api/
│   │   └── client.js          # Cliente API REST
│   ├── utils/
│   │   └── router.js          # Router SPA
│   └── css/
│       └── input.css          # Estilos globales
├── dist/                      # CSS compilado (generado)
├── index.html                 # Punto de entrada HTML
├── package.json
├── tailwind.config.js
└── README.md
```

## 🚀 Instalación y Uso

### Requisitos
- Node.js 14+ (para compilar Tailwind)
- Un navegador moderno
- API .NET ejecutándose en `http://localhost:5000`

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
cd frontend-inventario
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Compilar Tailwind CSS**
```bash
npm run build
```

O en modo watch (desarrollo):
```bash
npm run dev
```

4. **Servir la aplicación**
```bash
# Opción 1: Con Python
python -m http.server 8000

# Opción 2: Con Node.js
npx http-server

# Opción 3: Con live-server
npm install -g live-server
live-server
```

5. **Acceder a la aplicación**
```
http://localhost:8000
```

## 🔧 Configuración

### Variables de Entorno

Editar `src/api/client.js` para cambiar la URL de la API:

```javascript
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
```

### Endpoints Requeridos de la API

El frontend espera los siguientes endpoints en la API .NET:

#### Productos
- `GET /api/products` - Obtener todos
- `POST /api/products` - Crear
- `PUT /api/products/{id}` - Actualizar
- `DELETE /api/products/{id}` - Eliminar

#### Inventario
- `GET /api/inventory` - Obtener stock
- `PUT /api/inventory/{productId}` - Actualizar stock
- `GET /api/inventory/low-stock` - Bajo stock
- `GET /api/inventory/movements/{productId}` - Movimientos

#### Ventas
- `GET /api/sales` - Obtener todas
- `GET /api/sales/{id}` - Detalle
- `GET /api/sales?origin={origin}` - Filtrar por origen

#### Facturas
- `GET /api/invoices` - Obtener todas
- `GET /api/invoices/{id}` - Detalle
- `GET /api/invoices/{id}/download` - Descargar PDF

#### Dashboard
- `GET /api/dashboard/metrics` - Métricas

#### Chatbot
- `POST /api/chatbot/message` - Enviar mensaje

## 📝 Uso de Componentes

### Navegación
Los botones en el sidebar de la izquierda permiten cambiar entre páginas. La navegación es manejada por el router.

### Agregar nuevos componentes
1. Crear función en `src/components/common.js`
2. Importar en el archivo donde se use
3. Usar con `createCard()`, `createButton()`, etc.

### Crear nuevas páginas
1. Crear archivo en `src/pages/nombrePagina.js`
2. Exportar objeto con propiedades `render()` e `init()`
3. Agregar en `router.js`

## 🔌 Integración con API

```javascript
import { api } from './src/api/client.js';

// Obtener productos
const products = await api.getProducts();

// Crear producto
const newProduct = await api.createProduct({
  name: 'Producto',
  price: 99.99,
  category: 'electronics'
});

// Enviar mensaje al chatbot
const response = await api.sendChatMessage('Hola');
```

## 🎨 Personalización de Estilos

Editar `tailwind.config.js` para cambiar colores, fuentes, etc.:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      danger: '#EF4444',
      warning: '#F59E0B',
    }
  }
}
```

## 📱 Responsividad

El diseño es completamente responsivo usando Tailwind CSS:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## 🐛 Debugging

Activar logs en la consola del navegador. El estado global es accesible desde la consola:

```javascript
// En la consola del navegador
import { store } from './src/state/store.js';
console.log(store.getState());
```

## 📚 Documentación Adicional

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, seguir el estilo de código existente.

## 📄 Licencia

Este proyecto es de uso privado.

## 📞 Soporte

Para problemas o sugerencias, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0
**Última actualización**: 2024
