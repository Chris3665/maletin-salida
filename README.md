# Maletín de Salida

Aplicación web desarrollada con **React 19**, **TypeScript** y **Vite** para la preparación y consolidación de materiales y recursos de visitas de campo. La solución implementa estado local controlado, transiciones de estado mediante `useReducer`, componentes genéricos reutilizables (`GenericCatalog<T>`), composición con slots y referencias imperativas tipadas mediante `useImperativeHandle`.

---

## 1. Propósito y Contexto

La aplicación permite reunir en un maletín los elementos que llevará una persona responsable de una visita de campo. Cumple con las siguientes reglas de negocio:

* **Unicidad:** Cada elemento se agrega como máximo una sola vez.
* **Orden:** Se preserva el orden cronológico de incorporación.
* **Tolerancia a fallos:** Retirar un elemento inexistente no produce errores visibles.
* **Control de revisión:** La acción «Marcar como revisado» únicamente transiciona a «Revisado» cuando existe al menos un elemento en el maletín. Si el maletín está vacío, se conserva «Pendiente de revisión» y se presenta el mensaje de bloqueo: `"Agregue al menos un elemento antes de revisar."`.
* **Reinicio:** El control «Reiniciar maletín» vacía la lista por completo y restablece el estado a «Pendiente de revisión».

---

## 2. Requisitos Previos

* **Node.js**: Versión 18.0.0 o superior (recomendado v20 LTS o v22 LTS).
* **npm**: Versión 9.0.0 o superior.

---

## 3. Comandos de Instalación y Ejecución

```bash
# 1. Instalar dependencias del proyecto
npm install

# 2. Iniciar el servidor local de desarrollo
npm run dev

# 3. Comprobar tipos de TypeScript y generar compilación de producción
npm run build
```

---

## 4. Estructura del Proyecto y Ubicación de Componentes

```text
maletin-salida/
├── docs/                      # Evidencias visuales de ejecución
│   ├── captura-1-vista-inicial.png
│   ├── captura-2-busqueda-foco.png
│   └── captura-3-maletin-revisado.png
├── src/
│   ├── types/
│   │   └── index.ts           # Modelos de datos, uniones discriminadas y contratos tipados
│   ├── data/
│   │   └── initialData.ts     # Datos iniciales requeridos sin modificar
│   ├── reducers/
│   │   └── kitReducer.ts      # Reducer con transiciones deterministas del maletín
│   ├── components/
│   │   ├── SearchBox.tsx      # Campo de búsqueda controlado con handle de enfoque
│   │   ├── GenericCatalog.tsx # Componente genérico <T> reutilizable sin 'any'
│   │   ├── CompositionPanel.tsx # Panel de composición (header, children, footer)
│   │   └── KitSummary.tsx     # Resumen de elementos, conteo, estado y acciones
│   ├── App.tsx                # Integración del flujo y composición de vistas
│   ├── main.tsx               # Entrada de la aplicación React
│   └── index.css              # Estilos base con contraste claro
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Datos Iniciales

### Catálogo de Materiales Físicos
* **m-01**: Linterna (Cantidad: 2)
* **m-02**: Cinta métrica (Cantidad: 1)
* **m-03**: Botiquín (Cantidad: 1)

### Catálogo de Recursos Digitales
* **r-01**: Guía de seguridad (Formato: pdf)
* **r-02**: Mapa de ruta (Formato: link)

---

## 6. Respuestas a Preguntas Conceptuales

### 1. ¿Qué responsabilidad tiene `useState`?
Administra el estado local volátil de la interfaz: el texto ingresado en el buscador (`searchQuery`). Este estado reacciona a cada pulsación de tecla y sirve como filtro en tiempo real para ambos catálogos sin alterar los datos del maletín.

### 2. ¿Qué transiciones concentra `useReducer`?
Concentra las transiciones de estado del maletín mediante acciones discriminadas:
* `add`: Incorpora un elemento sólo si su clave no existe previamente, conservando el orden de inserción.
* `remove`: Retira un elemento por su clave sin generar fallos si no existe. Si la lista queda vacía, devuelve el estado a `"pending"`.
* `markReviewed`: Evalúa que la lista contenga al menos un elemento para transicionar a `"reviewed"`. En caso contrario, retiene el estado en `"pending"` y despliega el mensaje de bloqueo.
* `reset`: Devuelve el maletín a su estado inicial (lista vacía y estado `"pending"`).

### 3. ¿Qué operación expone la referencia?
Expone la operación imperativa `focusInput()`. Mediante `useImperativeHandle`, el componente `SearchBox` ofrece exclusivamente este método al componente superior para enfocar el elemento `<input>` interno desde el botón exterior «Enfocar buscador», evitando exponer el nodo DOM directamente.

### 4. ¿Cómo se conserva `T` en las dos instancias genéricas?
El componente `GenericCatalog<T>` tipa su colección de entrada `items: T[]` y garantiza que sus funciones auxiliares (`getKey: (item: T) => string`, `renderItem: (item: T) => ReactNode` y `onSelect: (item: T) => void`) operen sobre el mismo tipo `T`. Al instanciarse como `GenericCatalog<MaterialItem>` y `GenericCatalog<DigitalResourceItem>`, TypeScript infiere y valida estrictamente las propiedades originales de cada estructura sin recurrir a conversiones con `any`.

### 5. ¿Qué contenido cambia mediante composición?
El componente `CompositionPanel` mantiene una estructura homogénea con slots para `header`, `children` y `footer`. En la primera instancia aloja el catálogo de materiales junto con una descripción en su cuerpo y un texto informativo en el footer. En la segunda instancia aloja el catálogo digital y coloca en el footer una acción interactiva («Limpiar búsqueda»).

---

## 7. Registro de Casos de Prueba (P1 a P8)

| ID | Condición Inicial | Acción Exacta | Resultado Esperado y Obtenido | Estado | Evidencia Asociada |
|---|---|---|---|---|---|
| **P1** | Aplicación recién abierta | Escribir `"linterna"` | Solo se muestra "Linterna" en materiales; digitales no muestra coincidencias; buscador conserva el texto. | Aprobado | `captura-2-busqueda-foco.png` |
| **P2** | Búsqueda `"mapa"` | Pulsar «Limpiar búsqueda» | El campo se vacía y se muestran los 5 elementos originales. | Aprobado | `captura-2-busqueda-foco.png` |
| **P3** | Cursor fuera del buscador | Pulsar «Enfocar buscador» | El campo de búsqueda recibe el foco activo a través del handle. | Aprobado | `captura-2-busqueda-foco.png` |
| **P4** | Maletín vacío | Pulsar «Marcar como revisado» | Permanece en "Pendiente de revisión" y muestra `"Agregue al menos un elemento antes de revisar."`. | Aprobado | Verificación por interfaz |
| **P5** | Maletín vacío | Agregar `"Linterna"` dos veces | "Linterna" aparece una sola vez y el total se mantiene en 1. | Aprobado | `captura-3-maletin-revisado.png` |
| **P6** | Maletín con "Linterna" y "Mapa de ruta" | Retirar `"Linterna"` | Desaparece "Linterna", permanece "Mapa de ruta" y el total cambia a 1. | Aprobado | `captura-3-maletin-revisado.png` |
| **P7** | Maletín con un elemento | Pulsar «Reiniciar maletín» | La lista queda vacía, total 0 y estado vuelve a "Pendiente de revisión". | Aprobado | `captura-1-vista-inicial.png` |
| **P8** | Catálogos visibles | Seleccionar material y recurso digital | Ambos elementos se agregan al maletín conservando sus metadatos y etiquetas de origen. | Aprobado | `captura-3-maletin-revisado.png` |

---

## 8. Evidencia de Compilación Limpia

Ejecución del comando `npm run build` en el entorno local:

```text
Chris@LAPTOP-D7T8JD94 MINGW64 ~/OneDrive/Documentos/semestre4/React Avanzado/tarea-3/maletin-salida (main)
$ npm run build

> maletin-salida@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
✓ 22 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-DGNrK5qb.css    1.78 kB │ gzip:  0.81 kB
dist/assets/index-DjlOWcLu.js   225.50 kB │ gzip: 70.70 kB

✓ built in 493ms
```

---

## 9. Evidencia Visual

Las capturas están ubicadas en la carpeta `docs/`:

1. **`docs/captura-1-vista-inicial.png`**: Vista inicial con el maletín vacío, estado "Pendiente de revisión" y los 5 elementos cargados.
2. **`docs/captura-2-busqueda-foco.png`**: Búsqueda filtrada con el foco activo en el campo de texto mediante la referencia externa.
3. **`docs/captura-3-maletin-revisado.png`**: Maletín con elementos agregados en estado "Revisado".