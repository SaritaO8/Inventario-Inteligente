# 🏪 Inventario Inteligente

Sistema de gestión de inventario con frontend SPA en JavaScript Vanilla y backend en .NET, que incluye un panel administrativo y un chatbot integrado para asistencia en ventas.

## ✨ Características

- Dashboard con métricas y estadísticas en tiempo real.
- Gestión de productos e inventario.
- Consulta de ventas y facturas.
- Chatbot para atención y recomendaciones de productos.
- Arquitectura modular y desacoplada entre frontend y backend.

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3 y JavaScript (Vanilla).
- **Estilos:** Tailwind CSS.
- **Backend:** ASP.NET Core.
- **Comunicación:** Fetch API y API REST.
- **Arquitectura:** SPA modular con manejo de estado personalizado.

## 📁 Estructura del Proyecto

```text
inventario-inteligente/
├── Inventory.Api/          # API REST en .NET
├── Inventory.Web/          # Aplicación web ASP.NET Core
├── src/                    # Frontend SPA
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── css/
│   ├── pages/
│   ├── state/
│   ├── utils/
│   ├── app.js
│   └── app.bundle.js
├── dist/                   # CSS compilado
├── index.html
└── InventarioInteligente.slnx
```

## 🚀 Ejecución del Frontend

```bash
npm install
npm run dev
```

Abre `index.html` con tu servidor local preferido o configura el frontend para ser servido desde `Inventory.Web`.

## 🔌 API

El frontend consume la API REST expuesta por `Inventory.Api`, que provee endpoints para:

- Productos
- Inventario
- Ventas
- Facturas
- Métricas del dashboard
- Chatbot

## 📱 Responsividad

La interfaz está diseñada para funcionar correctamente en dispositivos móviles, tabletas y escritorio.

---

Desarrollado como proyecto académico para la gestión inteligente de inventarios y ventas.

