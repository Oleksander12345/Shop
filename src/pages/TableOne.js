import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';

function TableOne() {
    const [isChecked, setIsChecked] = useState(false);
    const buttonContainerRef = useRef(null);
    const [purchaseMessage, setPurchaseMessage] = useState(false);
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
        debitCredit: row.querySelector('td:nth-child(4)').innerText,
        subtype: row.querySelector('td:nth-child(5)').innerText,
        expDate: row.querySelector('td:nth-child(6)').innerText,
        track1: row.querySelector('td:nth-child(7)').innerText,
        billingZip: row.querySelector('td:nth-child(8)').innerText,
        code: row.querySelector('td:nth-child(9)').innerText,
        country: row.querySelector('td:nth-child(10)').innerText,
        address: row.querySelector('td:nth-child(11)').innerText,
        bank: row.querySelector('td:nth-child(12)').innerText,
        base: row.querySelector('td:nth-child(13)').innerText,
        price: row.querySelector('td:nth-child(14)').innerText,
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
          <h1 className='page-title'>Dumps</h1>
          {purchaseMessage && (
            <div className="purchase-message">
              Purchase completed successfully!
            </div>
          )}
  
          <table className='Orders-table'>
            <thead className='Orders-thead'>
              <tr>
                <th>Select</th>
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
                <th>Cart</th>
              </tr>
            </thead>
            <tbody className='Orders-tbody'>
              <tr className='Orders-tbody-tr'>
                <td>
                  <input
                    type="checkbox"
                    className="row-select"
                    onChange={handleCheckboxChange}
                  />
                </td>
                <td>414720</td>
                <td>Credit</td>
                <td>Signature</td>
                <td>Classic</td>
                <td>XX/29</td>
                <td>-</td>
                <td>-</td>
                <td>201</td>
                <td>USA</td>
                <td>Chase Bank USA</td>
                <td>Non-refundable</td>
                <td>Skimmer</td>
                <td>$25.20</td>
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

export default TableOne;
