import type { KitState, KitAction } from "../types";

export const initialKitState: KitState = {
  items: [],
  status: "pending",
  errorMessage: null,
};

export function kitReducer(state: KitState, action: KitAction): KitState {
  switch (action.type) {
    case "add": {
      const alreadyExists = state.items.some((item) => item.key === action.payload.key);
      if (alreadyExists) {
        return state; // No duplica ni altera orden
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        errorMessage: null,
      };
    }

    case "remove": {
      const filtered = state.items.filter((item) => item.key !== action.payload.key);
      return {
        ...state,
        items: filtered,
        // Si se vacía el maletín, regresa a 'pending'
        status: filtered.length === 0 ? "pending" : state.status,
        errorMessage: null,
      };
    }

    case "markReviewed": {
      if (state.items.length === 0) {
        return {
          ...state,
          status: "pending",
          errorMessage: "Agregue al menos un elemento antes de revisar.",
        };
      }
      return {
        ...state,
        status: "reviewed",
        errorMessage: null,
      };
    }

    case "reset":
      return initialKitState;

    default:
      return state;
  }
}