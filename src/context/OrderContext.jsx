"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  const [cart, setCart] = useState(
    JSON?.parse(ls?.getItem("cart")) || {
      info: {
        id: "",
        name: "",
        phone: "",
        address: "",
        city: "",
        additionalDetail: "",
      },
      products: [],
      deliveryMethod: {
        method: "Restaurante",
      },
      paymentMethod: null,
      productCost: 0,
      discount: null,
      costOfShipping: 3500,
      tip: 0,
      total: 0,
    }
  );

  useEffect(() => {
    if (ls && ls?.getItem("cart")) {
      setCart(JSON.parse(ls?.getItem("cart")));
    }
  }, [ls]);

  function saveCartProductsToLocalStorage(order) {
    if (ls) {
      ls?.setItem("cart", JSON.stringify(order));
      setCart(order);
    }
  }

  function removeCartProductsToLocalStorage(order) {
    if (ls) {
      const updatedProducts = cart.products.filter(
        (product) => product.id !== order.id
      );

      const updatedOrder = {
        ...cart,
        products: updatedProducts,
      };

      ls.setItem("cart", JSON.stringify(updatedOrder));

      setCart(updatedOrder);

      toast.success("Producto eliminado del carrito");
    }
  }

  return (
    <OrderContext.Provider
      value={{
        cart,
        setCart,
        saveCartProductsToLocalStorage,
        removeCartProductsToLocalStorage,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
