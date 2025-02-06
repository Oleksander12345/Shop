import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';

function Dumps() {
    const [isChecked, setIsChecked] = useState(false);
    const buttonContainerRef = useRef(null);
    const [purchaseMessage, setPurchaseMessage] = useState(false); // Стан для повідомлення
    const { addToCart } = useContext(CartContext); // Підключення до контексту
  
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
        category: 'Dumps',
        className: row.className, // Додаємо класи рядка
      };
      addToCart(rowData);
      setPurchaseMessage(true);

    // Приховуємо повідомлення через 3 секунди
        setTimeout(() => {
            setPurchaseMessage(false);
        }, 3000);
    };
  return (
    <main className='Dumps-main'>
        <div className='Dumps-container'>
        <h1 className='page-title'>Dumps</h1>
        {purchaseMessage && (
          <div className="purchase-message">
            Purchase completed successfully!
          </div>
        )}

            <div className="filter-form">

                <div>
                    <label for="bins">Bins:</label>
                    <input type="text" id="bins" placeholder="Enter bins"/>
                    <small>Bins (8 digit): Search by 8 digits is available for users with a rating of 5 crab and above.</small>
                </div>
                <div>
                    <label for="bank">Bank:</label>
                    <select id="bank">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="bank-country">Bank Country:</label>
                    <select id="bank-country">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="card-number">Card Number:</label>
                    <input type="text" id="card-number" placeholder="Enter last 4 digits"/>
                    <small>Search by last 4 digits is available for users with a rating of 2 crab and above.</small>
                </div>


                <div>
                    <label for="country">Country:</label>
                    <select id="country">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="state">State:</label>
                    <select id="state">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="city">City:</label>
                    <select id="city">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="zips">ZIPs:</label>
                    <textarea id="zips" rows="1" placeholder="Enter ZIPs"></textarea>
                </div>

                <div>
                    <label for="type">Type:</label>
                    <select id="type">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="credit-debit">Credit/Debit:</label>
                    <select id="credit-debit">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="subtype">Subtype:</label>
                    <select id="subtype">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="code">Code:</label>
                    <select id="code">
                        <option value="all">- all -</option>
                    </select>
                </div>

                <div>
                    <label for="base">Base:</label>
                    <select id="base">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <label for="exp-date">Exp Date:</label>
                    <input type="text" id="exp-date" placeholder="MM/YY"/>
                </div>
                <div>
                    <label for="price-range">Price Range:</label>
                    <select id="price-range">
                        <option value="all">- all -</option>
                    </select>
                </div>
                <div>
                    <h3 className='Dumps-label'>Options:</h3>
                    <div>
                        <div className="Dumps-checkbox-group">
                            <label for="track1">Track1</label>
                            <input type="checkbox" id="track1"/>
                        </div>
                        <div className="Dumps-checkbox-group">
                            <label for="track1">PIN</label>
                            <input type="checkbox" id="pin"/>
                        </div>
                        <div className="Dumps-checkbox-group">
                            <label for="track1">Refundable Only</label>
                            <input type="checkbox" id="refundable"/>
                        </div>
                        <div className="Dumps-checkbox-group">
                            <label for="track1">Billing ZIP</label>
                            <input type="checkbox" id="billing-zip"/>
                        </div>
                        <div className="Dumps-checkbox-group">
                            <label for="track1">EDD+pin</label>
                            <input type="checkbox" id="edd-pin"/>
                        </div>
                    </div>
                </div>


                <div className="Dumps-buttons-filter">
                    <button id="clear">Clear</button>
                    <button id="search">Search</button>
                </div>
            </div>
            {isChecked && (
                <div ref={buttonContainerRef} className="Dumps-button-container">
                <button id="action1">Cart</button>
                <button id="action2">Fast order</button>
                </div>
            )}

        <table className='Dumps-table'>
          <thead className='Dumps-thead'>
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
          <tbody className='Dumps-tbody'>
            <tr className='Dumps-tbody-tr'>
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

export default Dumps;
