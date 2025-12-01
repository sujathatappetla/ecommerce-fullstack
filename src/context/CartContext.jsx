
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const LOCAL_CART_KEY = "guest_cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // normalize backend format
  const normalizeItems = (data) => {
    if (!data || !data.items) return [];

    return data.items.map(item => ({
      productId: item.product?._id ?? item.product,
      name: item.product?.name ?? item.name,
      price: item.product?.price ?? item.price,
      image: item.product?.image ?? item.image,
      size: item.size,
      qty: item.qty ?? 1
    }));
  };

  // Load Cart 
  useEffect(() => {
    if (!user) {
      const stored = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
      setItems(stored);
      return;
    }

    api.get("/api/cart", { withCredentials: true })
      .then((res) => setItems(normalizeItems(res.data)))
      .catch(() => console.log("⌛ waiting auth..."));
  }, [user]);

  // Sync Guest Cart After Login 
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    if (!user || !stored) return;

    const guestItems = JSON.parse(stored);

    (async () => {
      for (const item of guestItems) {
        await api.post("/api/cart/add",
          { product: item.productId, size: item.size, qty: item.qty },
          { withCredentials: true }
        );
      }

      localStorage.removeItem(LOCAL_CART_KEY);

      const res = await api.get("/api/cart", { withCredentials: true });
      setItems(normalizeItems(res.data));

      console.log("✔ Guest Cart Synced");
    })();
  }, [user]);

  // Add Item 
  const addToCart = async (product, size, qty = 1) => {
    if (!size) return alert("Please select size");

    if (user) {
      const res = await api.post(
        "/api/cart/add",
        { product: product._id, size, qty },
        { withCredentials: true }
      );
      setItems(normalizeItems(res.data));
    } else {
      setItems(prev => {
        const exists = prev.find(i => i.productId === product._id && i.size === size);

        const updated = exists
          ? prev.map(i =>
              i.productId === product._id && i.size === size
                ? { ...i, qty: i.qty + qty }
                : i
            )
          : [...prev, {
              productId: product._id,
              name: product.name,
              image: product.image,
              price: product.price,
              size,
              qty
            }];

        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Update Item 
  const updateItem = async (id, size, qty) => {
    if (qty < 1) return;

    if (user) {
      const res = await api.put(
        "/api/cart/update",
        { product: id, size, qty },
        { withCredentials: true }
      );
      setItems(normalizeItems(res.data));
    } else {
      const updated = items.map(i =>
        i.productId === id && i.size === size ? { ...i, qty } : i
      );
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updated));
      setItems(updated);
    }
  };

  // Remove Item 
  const removeItem = async (id, size) => {
    if (user) {
      const res = await api.delete(`/api/cart/remove/${id}/${size}`, { withCredentials: true });
      setItems(normalizeItems(res.data));
    } else {
      const updated = items.filter(i => !(i.productId === id && i.size === size));
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updated));
      setItems(updated);
    }
  };

  // Clear Cart 
  const clearCart = async () => {
    if (user) {
      await api.delete("/api/cart/remove/all", { withCredentials: true });
      setItems([]);
    } else {
      localStorage.removeItem(LOCAL_CART_KEY);
      setItems([]);
    }
  };

  //Total Calculations 
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
