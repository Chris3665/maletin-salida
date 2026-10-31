import { useState, useReducer, useRef } from "react";
import { initialMaterials, initialDigitalResources } from "./data/initialData";
import { kitReducer, initialKitState } from "./reducers/kitReducer";
import type { MaterialItem, DigitalResourceItem, KitItem, SearchBoxHandle } from "./types";
import { SearchBox } from "./components/SearchBox";
import { GenericCatalog } from "./components/GenericCatalog";
import { CompositionPanel } from "./components/CompositionPanel";
import { KitSummary } from "./components/KitSummary";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [kitState, dispatch] = useReducer(kitReducer, initialKitState);
  const searchBoxRef = useRef<SearchBoxHandle>(null);

  // Filtrado no sensible a mayúsculas
  const query = searchQuery.trim().toLowerCase();

  const filteredMaterials = initialMaterials.filter((m) =>
    m.name.toLowerCase().includes(query)
  );

  const filteredDigitalResources = initialDigitalResources.filter((r) =>
    r.title.toLowerCase().includes(query)
  );

  // Adaptadores hacia KitItem
  const handleSelectMaterial = (mat: MaterialItem) => {
    const item: KitItem = {
      origin: "material",
      key: mat.id,
      displayName: mat.name,
      raw: mat,
    };
    dispatch({ type: "add", payload: item });
  };

  const handleSelectDigital = (res: DigitalResourceItem) => {
    const item: KitItem = {
      origin: "digital",
      key: res.code,
      displayName: res.title,
      raw: res,
    };
    dispatch({ type: "add", payload: item });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "24px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1>Maletín de salida</h1>

      {/* Panel de instrucciones obligatorio */}
      <section style={{ background: "#eef2ff", padding: "12px", borderRadius: "6px", marginBottom: "16px" }}>
        <h3>Instrucciones de preparación</h3>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Busque los elementos necesarios, agréguelos a su maletín y márquelo como revisado antes de salir a campo.
        </p>
      </section>

      {/* Buscador y control de enfoque externo */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
        <SearchBox
          ref={searchBoxRef}
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <button type="button" onClick={() => searchBoxRef.current?.focusInput()}>
          Enfocar buscador
        </button>
      </div>

      {/* Panel 1: Materiales Físicos */}
      <CompositionPanel
        header={<h2>Catálogo de Materiales Físicos</h2>}
        footer={<small>Elementos físicos inventariados listos para empaque.</small>}
      >
        <p style={{ fontSize: "13px", color: "#555" }}>
          Muestra el nombre del material y las unidades disponibles.
        </p>
        <GenericCatalog<MaterialItem>
          items={filteredMaterials}
          getKey={(item) => item.id}
          renderItem={(item) => `${item.name} (Disponibles: ${item.quantity})`}
          onSelect={handleSelectMaterial}
        />
      </CompositionPanel>

      {/* Panel 2: Recursos Digitales (con acción de Limpiar búsqueda en footer) */}
      <CompositionPanel
        header={<h2>Catálogo de Recursos Digitales</h2>}
        footer={
          <button type="button" onClick={() => setSearchQuery("")}>
            Limpiar búsqueda
          </button>
        }
      >
        <GenericCatalog<DigitalResourceItem>
          items={filteredDigitalResources}
          getKey={(item) => item.code}
          renderItem={(item) => `${item.title} [Formato: ${item.format.toUpperCase()}]`}
          onSelect={handleSelectDigital}
        />
      </CompositionPanel>

      {/* Resumen del maletín */}
      <KitSummary
        state={kitState}
        onRemove={(key) => dispatch({ type: "remove", payload: { key } })}
        onMarkReviewed={() => dispatch({ type: "markReviewed" })}
        onReset={() => dispatch({ type: "reset" })}
      />
    </div>
  );
}