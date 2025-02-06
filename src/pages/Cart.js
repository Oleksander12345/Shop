import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";

function Cart() {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);

  // Фільтруємо елементи за категоріями
  const fullzItems = cartItems.filter((item) => item.category === 'Fullz');
  const dumpsItems = cartItems.filter((item) => item.category === 'Dumps');
  const cvv2Items = cartItems.filter((item) => item.category === 'CVV2');

  // Використання функції видалення
  const handleRemove = (id) => {
    removeFromCart(id); // Передаємо id в контекст
  };

  // Використання функції додавання (за потреби)
  // const handleAdd = (item) => {
  //   addToCart(item); // Додаємо новий елемент у контекст
  // };
  const clearCart = () => {
    localStorage.removeItem('cart'); // Очищення локального сховища
    setCartItems([]); // Очищення стану корзини в React
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      {/* Fullz Section */}
      {fullzItems.length > 0 && (
        <div className='Fullz-cart'>
          <h2 className='cart-title2'>Fullz</h2>
          <table className="cart-table">
            <thead>
              <tr>
                <th className='cart-th'>Person</th>
                <th className='cart-th'>Object</th>
                <th className='cart-th'>Extra</th>
                <th className='cart-th'>Base</th>
                <th className='cart-th'>Price</th>
              </tr>
            </thead>
            <tbody>
              {fullzItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.person}</td>
                  <td>{item.object}</td>
                  <td>{item.extra}</td>
                  <td>{item.base}</td>
                  <td>{item.price}</td>
                  <td style={{width: "2%"}}>
                  <button className="remove-button" onClick={() => handleRemove(item.id)}>
              <     MdDeleteForever />
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dumps Section */}
      {dumpsItems.length > 0 && (
        <div className='Dumps-cart'>
          <h2 className='cart-title2'>Dumps</h2>
          <table className="cart-table">
            <thead>
              <tr>
                <th className='cart-th'>Bin</th>
                <th className='cart-th'>Type</th>
                <th className='cart-th'>Debit/Credit</th>
                <th className='cart-th'>Subtype</th>
                <th className='cart-th'>Exp Date</th>
                <th className='cart-th'>Track1</th>
                <th className='cart-th'>Billing Zip</th>
                <th className='cart-th'>Code</th>
                <th className='cart-th'>Country</th>
                <th className='cart-th'>Address</th>
                <th className='cart-th'>Bank</th>
                <th className='cart-th'>Base</th>
                <th className='cart-th'>Price</th>
              </tr>
            </thead>
            <tbody>
              {dumpsItems.map((item, index) => (
                <tr key={index} className='cart-tr'>
                  <td>{item.bin}</td>
                  <td>{item.type}</td>
                  <td>{item.debitCredit}</td>
                  <td>{item.subtype}</td>
                  <td>{item.expDate}</td>
                  <td>{item.track1}</td>
                  <td>{item.billingZip}</td>
                  <td>{item.code}</td>
                  <td>{item.country}</td>
                  <td>{item.address}</td>
                  <td>{item.bank}</td>
                  <td>{item.base}</td>
                  <td>{item.price}</td>
                  <td>
                  <button className="remove-button" onClick={() => handleRemove(item.id)}>
                    <MdDeleteForever />
                  </button>                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}
      {/* CVV2 Section */}
      {cvv2Items.length > 0 && (
        <div className='Dumps-cart'>
          <h2 className='cart-title2'>CVV2</h2>
          <table className="cart-table">
            <thead>
              <tr>
                <th className='cart-th'>Bin</th>
                <th className='cart-th'>Type</th>
                <th className='cart-th'>Subtype</th>
                <th className='cart-th'>Expiry</th>
                <th className='cart-th'>Name</th>
                <th className='cart-th'>Country</th>
                <th className='cart-th'>State</th>
                <th className='cart-th'>Zip</th>
                <th className='cart-th'>Extra</th>
                <th className='cart-th'>Bank</th>
                <th className='cart-th'>Base</th>
                <th className='cart-th'>Price</th>
              </tr>
            </thead>
            <tbody>
              {cvv2Items.map((item, index) => (
                <tr key={index} className='cart-tr'>
                  <td>{item.bin}</td>
                  <td>{item.type}</td>
                  <td>{item.subtype}</td>
                  <td>{item.expiry}</td>
                  <td>{item.name}</td>
                  <td>{item.country}</td>
                  <td>{item.state}</td>
                  <td>{item.zip}</td>
                  <td>{item.extra}</td>
                  <td>{item.bank}</td>
                  <td>{item.base}</td>
                  <td>{item.price}</td>
                  <td>
                  <button className="remove-button" onClick={() => handleRemove(item.id)}>
                    <MdDeleteForever />
                  </button>                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cart Summary */}
      <div>
        <p className="cart-total">
          Total: $
          {cartItems
            .reduce((total, item) => total + parseFloat(item.price.slice(1)), 0)
            .toFixed(2)}
        </p>
        <button onClick={clearCart} className="clear-cart-button" style={{display: "none"}}>
      Clear Cart
    </button>
        <div className="cart-actions">
          <button className="cart-link1">
            <Link to="/dumps">Continue Shopping</Link>
          </button>
          <button className="cart-link2">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
