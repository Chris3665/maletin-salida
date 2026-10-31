import React from "react";

interface GenericCatalogProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
}

export function GenericCatalog<T>({
  items,
  getKey,
  renderItem,
  onSelect,
}: GenericCatalogProps<T>): React.ReactElement {
  if (items.length === 0) {
    return <p style={{ fontStyle: "italic", color: "#666" }}>No hay elementos disponibles.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li
          key={getKey(item)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <span>{renderItem(item)}</span>
          <button type="button" onClick={() => onSelect(item)}>
            Agregar
          </button>
        </li>
      ))}
    </ul>
  );
}