import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const username = localStorage.getItem("username"); // Получаем текущего пользователя
  const storageKey = `cart_${username || "guest"}`; // Генерируем уникальный ключ

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem(storageKey);
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      return [...prevItems, item]; // Добавляем новый элемент без перезаписи
    });
  };

  const removeFromCart = (id, category) => {
    if (!category) {
      return;
    }

    setCartItems((prevItems) =>
        prevItems.filter((item) => !(item.id === id && item.category === category))
    );
  };





  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(storageKey);
  };

  return (
      <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
        {children}
      </CartContext.Provider>
  );
};
