
import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { Product, CartItem, CustomizationDetails } from '../seagull-watch-types';

interface CartState {
  cart: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'ADD_CUSTOMIZED_ITEM'; payload: { product: Product; customization: CustomizationDetails } }
  | { type: 'REMOVE_ITEM'; payload: string } // productId
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  cart: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (product: Product) => void;
  addCustomizedItem: (product: Product, customization: CustomizationDetails) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cart: CartItem[]; // Convenience accessor
  totalItems: number;
  totalPrice: number;
}>({
  state: initialState,
  dispatch: () => null,
  addItem: () => {},
  addCustomizedItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cart: [],
  totalItems: 0,
  totalPrice: 0,
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, cart: action.payload };
    case 'ADD_ITEM':
      const existingItem = state.cart.find(item => item.id === action.payload.id && !item.isCustomized);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id && !item.isCustomized ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1, isCustomized: false }],
      };
    case 'ADD_CUSTOMIZED_ITEM':
      // 定制产品总是作为新项目添加，即使是同一个产品的不同定制配置
      const customizedItem: CartItem = {
        ...action.payload.product,
        quantity: 1,
        isCustomized: true,
        customization: action.payload.customization,
        price: action.payload.customization.finalPrice, // 使用定制后的最终价格
        id: `${action.payload.product.id}_custom_${Date.now()}` // 生成唯一ID
      };
      return {
        ...state,
        cart: [...state.cart, customizedItem],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
         return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const storedCart = localStorage.getItem('chronoCraftCart');
    if (storedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(storedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chronoCraftCart', JSON.stringify(state.cart));
  }, [state.cart]);

  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const addCustomizedItem = (product: Product, customization: CustomizationDetails) => 
    dispatch({ type: 'ADD_CUSTOMIZED_ITEM', payload: { product, customization } });
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const updateQuantity = (productId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      state, 
      dispatch, 
      addItem, 
      addCustomizedItem,
      removeItem, 
      updateQuantity, 
      clearCart, 
      cart: state.cart, 
      totalItems, 
      totalPrice 
    }}>
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
