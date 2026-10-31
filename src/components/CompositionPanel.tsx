import React from "react";

interface CompositionPanelProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const CompositionPanel: React.FC<CompositionPanelProps> = ({
  header,
  children,
  footer,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "12px 0",
        background: "#fafafa",
      }}
    >
      <header style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px", marginBottom: "12px" }}>
        {header}
      </header>
      <main>{children}</main>
      {footer && (
        <footer style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #eee" }}>
          {footer}
        </footer>
      )}
    </div>
  );
};