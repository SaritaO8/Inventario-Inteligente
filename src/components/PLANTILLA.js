/**
 * Plantilla: Cómo crear un componente personalizado
 * 
 * Este archivo es un ejemplo de cómo crear tus propios componentes
 * reutilizables para el proyecto.
 */

// ============================================================
// EJEMPLO 1: Componente Simple
// ============================================================

export const createStatCard = (label, value, icon, color = 'blue') => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };

  return `
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-gray-600 text-sm font-medium">${label}</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">${value}</p>
        </div>
        <div class="w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-xl">
          ${icon}
        </div>
      </div>
    </div>
  `;
};

// Uso:
// const card = createStatCard('Total Ventas', '$1,250', '💰', 'green');

// ============================================================
// EJEMPLO 2: Componente con Listeners Internos
// ============================================================

export const createDataTable = (columns, data, onRowClick) => {
  const tableId = `table-${Date.now()}`;
  
  const html = `
    <div class="bg-white rounded-lg shadow-md overflow-x-auto">
      <table class="w-full" id="${tableId}">
        <thead class="bg-gray-100 border-b">
          <tr>
            ${columns.map(col => `
              <th class="px-6 py-3 text-left font-semibold text-gray-700">
                ${col.label}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map((row, index) => `
            <tr class="border-b hover:bg-gray-50 cursor-pointer row-data" data-row-index="${index}">
              ${columns.map(col => `
                <td class="px-6 py-4">
                  ${col.render ? col.render(row[col.key]) : row[col.key]}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Objeto para manejar listeners
  const handlers = {
    mount: () => {
      const table = document.getElementById(tableId);
      if (table) {
        table.querySelectorAll('.row-data').forEach(row => {
          row.addEventListener('click', () => {
            const index = parseInt(row.dataset.rowIndex);
            if (onRowClick) {
              onRowClick(data[index], index);
            }
          });
        });
      }
    }
  };

  return { html, handlers };
};

// Uso:
// const { html, handlers } = createDataTable(
//   [
//     { key: 'name', label: 'Nombre' },
//     { key: 'price', label: 'Precio', render: (p) => `$${p.toFixed(2)}` }
//   ],
//   products,
//   (row) => console.log('Fila clickeada:', row)
// );
// document.getElementById('table-container').innerHTML = html;
// handlers.mount();

// ============================================================
// EJEMPLO 3: Componente Complejo con State
// ============================================================

export const createPaginatedList = (items, itemsPerPage = 10) => {
  let currentPage = 1;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const render = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = items.slice(start, end);

    return `
      <div class="space-y-4">
        <!-- Items -->
        <div class="space-y-2">
          ${pageItems.map((item, idx) => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>${item.name}</span>
              <span class="text-sm text-gray-600">${item.value}</span>
            </div>
          `).join('')}
        </div>

        <!-- Paginación -->
        <div class="flex justify-between items-center pt-4">
          <button class="prev-page px-3 py-2 bg-gray-200 rounded disabled:opacity-50" ${currentPage === 1 ? 'disabled' : ''}>
            ← Anterior
          </button>
          <span class="text-sm text-gray-600">
            Página ${currentPage} de ${totalPages}
          </span>
          <button class="next-page px-3 py-2 bg-gray-200 rounded disabled:opacity-50" ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente →
          </button>
        </div>
      </div>
    `;
  };

  const handlers = {
    mount: (containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const update = () => {
        container.innerHTML = render();
        
        // Event listeners
        container.querySelector('.prev-page')?.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            update();
          }
        });

        container.querySelector('.next-page')?.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            update();
          }
        });
      };

      update();
    }
  };

  return { render, handlers };
};

// Uso:
// const list = createPaginatedList(myItems, 5);
// list.handlers.mount('my-list-container');

// ============================================================
// EJEMPLO 4: Componente con Formulario
// ============================================================

export const createEditForm = (fields, onSubmit) => {
  const formId = `form-${Date.now()}`;

  const html = `
    <form id="${formId}" class="space-y-4">
      ${fields.map(field => `
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${field.label}
            ${field.required ? '<span class="text-red-500">*</span>' : ''}
          </label>
          ${
            field.type === 'textarea'
              ? `<textarea id="${field.name}" name="${field.name}" rows="3" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>`
              : field.type === 'select'
              ? `
                <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecciona...</option>
                  ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
              `
              : `<input type="${field.type || 'text'}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">`
          }
        </div>
      `).join('')}
      <div class="flex gap-2 pt-4">
        <button type="submit" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium">
          Guardar
        </button>
        <button type="reset" class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium">
          Limpiar
        </button>
      </div>
    </form>
  `;

  const handlers = {
    mount: (onSubmitCallback) => {
      const form = document.getElementById(formId);
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
          if (onSubmitCallback) {
            onSubmitCallback(data);
          }
        });
      }
    }
  };

  return { html, handlers };
};

// Uso:
// const { html, handlers } = createEditForm(
//   [
//     { name: 'nombre', label: 'Nombre', type: 'text', required: true },
//     { name: 'email', label: 'Email', type: 'email', required: true },
//     { name: 'categoria', label: 'Categoría', type: 'select', options: [
//       { value: 'cat1', label: 'Categoría 1' }
//     ]},
//     { name: 'notas', label: 'Notas', type: 'textarea' }
//   ],
//   (data) => console.log('Formulario enviado:', data)
// );
// document.getElementById('form-container').innerHTML = html;
// handlers.mount();

// ============================================================
// EJEMPLO 5: Composición de Componentes
// ============================================================

export const createProductCard = (product) => {
  return `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <!-- Imagen -->
      <div class="aspect-video bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center text-5xl">
        📦
      </div>
      
      <!-- Contenido -->
      <div class="p-4">
        <!-- Nombre -->
        <h3 class="font-semibold text-lg text-gray-900">${product.name}</h3>
        
        <!-- Descripción -->
        <p class="text-gray-600 text-sm mt-1">${product.description}</p>
        
        <!-- Precio -->
        <p class="text-primary font-bold text-lg mt-3">$${product.price.toFixed(2)}</p>
        
        <!-- Badge -->
        <div class="mt-3">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${
            product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }">
            ${product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
          </span>
        </div>
        
        <!-- Botones -->
        <div class="flex gap-2 mt-4">
          <button class="flex-1 px-3 py-2 bg-blue-100 text-primary rounded hover:bg-blue-200 transition font-medium">
            ✏️ Editar
          </button>
          <button class="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition font-medium">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
};

// Uso:
// const html = createProductCard({ 
//   name: 'Laptop', 
//   description: 'Laptop de última generación',
//   price: 999.99,
//   stock: 5
// });

// ============================================================
// CONSEJOS PARA CREAR COMPONENTES
// ============================================================

/*
1. SIMPLICIDAD: Mantén los componentes simples y enfocados
2. REUTILIZABLE: Permite parámetros para diferentes casos
3. COMPOSICIÓN: Combina componentes simples en complejos
4. CALLBACKS: Usa funciones para eventos
5. IDs ÚNICOS: Usa timestamps para evitar conflictos
6. TAILWIND: Usa clases Tailwind en lugar de CSS personalizado
7. DOCUMENTACIÓN: Comenta el uso de cada componente
8. TESTING: Prueba con diferentes datos

ESTRUCTURA RECOMENDADA:
- Componentes simples: devuelven solo HTML
- Componentes medios: devuelven { html, handlers }
- Componentes complejos: devuelven objeto con mount() y update()
*/
