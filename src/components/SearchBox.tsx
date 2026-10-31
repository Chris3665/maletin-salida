import React, { useImperativeHandle, useRef, type Ref } from "react";
import type { SearchBoxHandle } from "../types";

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
  ref?: Ref<SearchBoxHandle>;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, ref }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    },
  }));

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar material o recurso..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "8px", width: "260px" }}
      />
    </div>
  );
};