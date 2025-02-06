import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Завантаження початкових даних із localStorage або використання початкових елементів
  const initialCartItems = [
    {
      id: 1,
      category: 'Fullz',
      person: 'John Doe',
      object: 'Passport',
      extra: 'Verified',
      base: 'USA',
      price: '$50.00',
    },
    {
      id: 2,
      category: 'Dumps',
      bin: '414720',
      type: 'Credit',
      debitCredit: 'Signature',
      subtype: 'Classic',
      expDate: 'XX/29',
      track1: '-',
      billingZip: '-',
      code: '201',
      country: 'USA',
      address: 'Chase Bank USA',
      bank: 'Non-refundable',
      base: 'Skimmer',
      price: '$25.20',
    },
    {
      id: 3,
      category: 'CVV2',
      bin: '515676',
      type: 'Credit',
      subtype: 'N/A',
      expiry: '01/29',
      name: 'MYRON',
      country: 'USA',
      state: 'FL',
      zip: '33***',
      extra: 'Phone Email IP',
      bank: 'HSBC - BestBuy',
      base: '0121_US_PHONE_EMAIL_ZIP_IP',
      price: '$21.35',
    },
  ];

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : initialCartItems;
  });

  // Збереження в localStorage при зміні стану кошика
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Додавання нового елемента до кошика
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  // Видалення елемента з кошика
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
