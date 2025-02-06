import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';

function Fullz() {
  const [isChecked, setIsChecked] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState(false); // Стан для повідомлення
  const buttonContainerRef = useRef(null);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (row) => {
    const rowData = {
      id: Date.now(),
      person: row.querySelector('td:nth-child(2)').innerText,
      object: row.querySelector('td:nth-child(3)').innerText,
      extra: row.querySelector('td:nth-child(4)').innerText,
      base: row.querySelector('td:nth-child(5)').innerText,
      price: row.querySelector('td:nth-child(6)').innerText,
      category: 'Fullz',
      className: row.className
    };
    addToCart(rowData);

    // Показуємо повідомлення
    setPurchaseMessage(true);

    // Приховуємо повідомлення через 3 секунди
    setTimeout(() => {
      setPurchaseMessage(false);
    }, 3000);
  };

  useEffect(() => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.style.display = isChecked ? 'block' : 'none';
    }
  }, [isChecked]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  return (
    <main className='Dumps-main'>
      <div className='Dumps-container'>
        <h1 className='page-title'>Fullz</h1>
        {purchaseMessage && (
          <div className="purchase-message">
            Purchase completed successfully!
          </div>
        )}

        <div className="Fullz-form-container">
            <div className='Fullz-colums-container'>
                <div className='Fullz-first-colum Fullz-colum'>
                    <div>
                        <label for="first-name">First Name:</label>
                        <input type="text" id="first-name" placeholder="Enter first name"/>
                    </div>
                    <div>
                        <label for="last-name">Last Name:</label>
                        <input type="text" id="last-name" placeholder="Enter last name"/>
                    </div>
                    <div>
                        <label for="state">State:</label>
                        <select id="state">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div>
                        <label for="own-rent">Own / Rent:</label>
                        <select id="own-rent">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    
                    <div className="Fullz-checkbox-group">
                        <label for="phone">Phone</label>
                        <input type="checkbox" id="phone"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="email">Email</label>
                        <input type="checkbox" id="email"/>
                    </div>
                </div>
                
                {/* Second colum */}
                <div className='Fullz-second-colum Fullz-colum'>
                    <div className="Fullz-checkbox-group">
                        <label for="ssn">SSN</label>
                        <input type="checkbox" id="ssn"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="dob">DOB</label>
                        <input type="checkbox" id="dob"/>
                    </div>

                    <div className="Fullz-checkbox-group">
                        <label for="mmn">MMN</label>
                        <input type="checkbox" id="mmn"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="drivers-number">Drivers Number</label>
                        <input type="checkbox" id="drivers-number"/>
                    </div>
                    <div>
                        <label for="dl-state">DL State:</label>
                        <select id="dl-state">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div>
                        <label for="account-number">Account Number:</label>
                        <input type="text" id="account-number" placeholder="Enter account number"/>
                    </div>
                    
                    <div className="Fullz-checkbox-group">
                        <label for="routing-number">Routing Number</label>
                        <input type="checkbox" id="routing-number"/>
                    </div>
                </div>
                
                {/* third colum */}
                <div className='Fullz-third-colum Fullz-colum'>
                    <div>
                        <label for="base">Base:</label>
                        <select id="base">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div>
                        <label for="country">Country:</label>
                        <select id="country">
                            <option value="all">United States</option>
                        </select>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="discounted">Discounted</label>
                        <input type="checkbox" id="discounted"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="credit-report">Credit Report <span title="Info about credit report">&#9432;</span></label>
                        <input type="checkbox" id="credit-report"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="credit-report-pdf">Credit Report (PDF) <span title="Info about credit report PDF">&#9432;</span></label>
                        <input type="checkbox" id="credit-report-pdf"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                    <label for="person-report-pdf">Person Report (PDF) <span title="Info about person report">&#9432;</span></label>
                        <input type="checkbox" id="person-report-pdf"/>
                    </div>
                </div>
            </div>
            
            <div className="Fullz-buttons">
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
              <th>Sel</th>
              <th>Person</th>
              <th>Object</th>
              <th>Extra</th>
              <th>Base</th>
              <th>Price</th>
              <th>Cart</th>
            </tr>
          </thead>
          <tbody className='Dumps-tbody'>
            <tr className='Dumps-tbody-tr'>
              <td>
                <input type="checkbox" className="row-select" onChange={handleCheckboxChange} />
              </td>
              <td>414720</td>
              <td>201</td>
              <td>Chase Bank USA</td>
              <td>1211_FULLZ_CREDIT_REPORT_DLN</td>
              <td>$25.20</td>
              <td>
                <button
                  className='shopping-cart'
                  onClick={(e) => handleAddToCart(e.target.closest('tr'))}
                >
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

export default Fullz;
