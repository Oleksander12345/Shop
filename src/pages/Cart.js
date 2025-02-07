import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import '../main-page.css';

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Фильтруем элементы по категориям
  const fullzItems = cartItems.filter((item) => item.category === 'Fullz');
  const dumpsItems = cartItems.filter((item) => item.category === 'Dumps');
  const cvv2Items = cartItems.filter((item) => item.category === 'CVV2');

  // Удаление элемента из корзины
  const handleRemove = (id) => {
    removeFromCart(id);
  };

  // Расчёт итоговой суммы
  const calculateTotal = () => {
    return cartItems
        .reduce((total, item) => total + parseFloat(item.price.slice(1)), 0)
        .toFixed(2);
  };

  return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>

        {/* Fullz Section */}
        {fullzItems.length > 0 && (
            <div className='cart-section'>
              <h2 className='cart-section-title'>Fullz</h2>
              <table className="cart-table">
                <thead>
                <tr>
                  <th>Id</th>
                  <th>Person</th>
                  <th>Object</th>
                  <th>Extra</th>
                  <th>Base</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {fullzItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.person}</td>
                      <td>{item.object}</td>
                      <td>{item.extra}</td>
                      <td>{item.base}</td>
                      <td>{item.price}</td>
                      <td>
                        <button className="remove-button" onClick={() => handleRemove(item.id)}>
                          <MdDeleteForever/>
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
            <div className='cart-section'>
              <h2 className='cart-section-title'>Dumps</h2>
              <table className="cart-table">
                <thead>
                <tr>
                  <th>Id</th>
                  <th>Bin</th>
                  <th>Type</th>
                  <th>Debit/Credit</th>
                  <th>Subtype</th>
                  <th>Exp Date</th>
                  <th>Track1</th>
                  <th>Billing Zip</th>
                  <th>Code</th>
                  <th>Country</th>
                  <th>Address</th>
                  <th>Bank</th>
                  <th>Base</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {dumpsItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
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
                          <MdDeleteForever/>
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
            <div className='cart-section'>
              <h2 className='cart-section-title'>CVV2</h2>
              <table className="cart-table">
                <thead>
                <tr>
                  <th>Id</th>
                  <th>Bin</th>
                  <th>Type</th>
                  <th>Subtype</th>
                  <th>Expiry</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>Zip</th>
                  <th>Extra</th>
                  <th>Bank</th>
                  <th>Base</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {cvv2Items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.cardId}</td>
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
                          <MdDeleteForever/>
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
          <p className="cart-total">Total: ${calculateTotal()}</p>
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
