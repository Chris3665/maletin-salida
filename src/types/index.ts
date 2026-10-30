// 1. Catálogos base nombres y tipos 
export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
}

export interface DigitalResourceItem {
  code: string;
  title: string;
  format: "pdf" | "link";
}

// 2. Unión discriminada para los elementos del maletín (evita any y conserva origen)
export type KitItem =
  | { origin: "material"; key: string; displayName: string; raw: MaterialItem }
  | { origin: "digital"; key: string; displayName: string; raw: DigitalResourceItem };

// 3. Estado del maletín
export type KitStatus = "pending" | "reviewed";

export interface KitState {
  items: KitItem[];
  status: KitStatus;
  errorMessage: string | null;
}

// 4. Acciones discriminadas para useReducer
export type KitAction =
  | { type: "add"; payload: KitItem }
  | { type: "remove"; payload: { key: string } }
  | { type: "markReviewed" }
  | { type: "reset" };

// 5. Interfaz para la referencia imperativa tipada de SearchBox
export interface SearchBoxHandle {
  focusInput: () => void;
}