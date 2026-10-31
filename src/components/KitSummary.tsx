import React from "react";
import type { KitState } from "../types";

interface KitSummaryProps {
  state: KitState;
  onRemove: (key: string) => void;
  onMarkReviewed: () => void;
  onReset: () => void;
}

export const KitSummary: React.FC<KitSummaryProps> = ({
  state,
  onRemove,
  onMarkReviewed,
  onReset,
}) => {
  const visibleStatus =
    state.status === "reviewed" ? "Revisado" : "Pendiente de revisión";

  return (
    <div style={{ border: "2px solid #333", borderRadius: "8px", padding: "16px", marginTop: "24px" }}>
      <h2>Resumen del maletín</h2>
      <p>
        <strong>Estado:</strong> {visibleStatus}
      </p>
      <p>
        <strong>Total elementos:</strong> {state.items.length}
      </p>

      {state.errorMessage && (
        <div style={{ color: "red", fontWeight: "bold", margin: "8px 0" }}>
          {state.errorMessage}
        </div>
      )}

      {state.items.length === 0 ? (
        <p>Maletín vacío</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {state.items.map((item) => (
            <li
              key={item.key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px dashed #ccc",
              }}
            >
              <span>
                {item.displayName}{" "}
                <small style={{ color: "#777" }}>
                  ({item.origin === "material" ? "Material Físico" : "Recurso Digital"})
                </small>
              </span>
              <button type="button" onClick={() => onRemove(item.key)}>
                Retirar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button type="button" onClick={onMarkReviewed}>
          Marcar como revisado
        </button>
        <button type="button" onClick={onReset}>
          Reiniciar maletín
        </button>
      </div>
    </div>
  );
};