"use client"

import type { CartItem } from "@/lib/types";
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'SET_STATE'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && item.variantId === action.payload.variantId
      );
      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.payload.productId && item.variantId === action.payload.variantId)
        ),
      };
    }
    case 'UPDATE_QUANTITY': {
        if(action.payload.quantity <= 0) {
            return {
                ...state,
                items: state.items.filter(
                  item => !(item.productId === action.payload.productId && item.variantId === action.payload.variantId)
                ),
              };
        }
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId && item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'SET_STATE':
        return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  useEffect(() => {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            dispatch({ type: 'SET_STATE', payload: JSON.parse(storedCart) });
        }
    } catch (error) {
        console.error("Could not load cart from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
        console.error("Could not save cart to local storage", error);
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
