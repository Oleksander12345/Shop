import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';

function TableTwo() {
  const [isChecked, setIsChecked] = useState(false);
  const buttonContainerRef = useRef(null);
  const [purchaseMessage, setPurchaseMessage] = useState(false);
  // const [setPurchaseMessage] = useState(false);
  // const [priceRange, setPriceRange] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.style.display = isChecked ? 'block' : 'none';
    }
  }, [isChecked]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleAddToCart = (row) => {
    const rowData = {
      id: Date.now(),
      bin: row.querySelector('td:nth-child(2)').innerText,
      type: row.querySelector('td:nth-child(3)').innerText,
      subtype: row.querySelector('td:nth-child(4)').innerText,
      expiry: row.querySelector('td:nth-child(5)').innerText,
      name: row.querySelector('td:nth-child(6)').innerText,
      country: row.querySelector('td:nth-child(7)').innerText,
      state: row.querySelector('td:nth-child(8)').innerText,
      zip: row.querySelector('td:nth-child(9)').innerText,
      extra: row.querySelector('td:nth-child(10)').innerText,
      bank: row.querySelector('td:nth-child(11)').innerText,
      base: row.querySelector('td:nth-child(12)').innerText,
      price: row.querySelector('td:nth-child(13)').innerText,
      category: 'Orders',
      className: row.className,
    };
    addToCart(rowData);
    setPurchaseMessage(true);
    setTimeout(() => {
      setPurchaseMessage(false);
    }, 3000);
  };

  return (
    <main className='Orders-main'>
            <div className='Orders-container'>
              <h1 className='page-title'>CVV2</h1>
              {purchaseMessage && (
                <div className="purchase-message">
                  Purchase completed successfully!
                </div>
              )}
      
      <table className="CVV2-table">
      <thead>
        <tr>
          <th>Select</th>
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
          <th>Cart</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input
              type="checkbox"
              className="row-select"
              onChange={handleCheckboxChange}
            />
          </td>
          <td>515676</td>
          <td>Visa</td>
          <td>Debbit Classic</td>
          <td>09/26</td>
          <td>MYRON</td>
          <td>USA</td>
          <td>FL</td>
          <td>33***</td>
          <td>Phone Email IP</td>
          <td>HSBC - BestBuy</td>
          <td>0121_US_PHONE_EMAIL_ZIP_IP</td>
          <td>$21.35</td>
          <td>
            <button className='shopping-cart' onClick={(e) => handleAddToCart(e.target.closest('tr'))}>
              <HiShoppingCart />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
            </div>
          </main>
  );
}

export default TableTwo;
