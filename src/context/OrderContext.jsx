"use client";

import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

// Crear un hook personalizado para acceder al contexto
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder debe ser usado dentro de un OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      setCart(JSON.parse(ls.getItem("cart")));
    }
  }, [ls]);

  function saveCartProductsToLocalStorage(cart) {
    if (ls) {
      ls.setItem("cart".JSON.stringify(cart));
    }
  }

  function handleChangeCart() {}

  return (
    <OrderContext.Provider value={{ cart, handleChangeCart }}>
      {children}
    </OrderContext.Provider>
  );
};
