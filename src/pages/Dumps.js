import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";

function Dumps() {
    const [isChecked, setIsChecked] = useState(false);
    const buttonContainerRef = useRef(null);
    const [purchaseMessage, setPurchaseMessage] = useState(false); // Стан для повідомлення
    const { addToCart } = useContext(CartContext); // Підключення до контексту
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const [dumps, setDumps] = useState([]); // Состояние для хранения данных

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchDumps();
        }
    }, [navigate, token]);

    useEffect(() => {
      if (buttonContainerRef.current) {
        buttonContainerRef.current.style.display = isChecked ? 'block' : 'none';
      }
    }, [isChecked]);
  
    const handleCheckboxChange = (e) => {
      setIsChecked(e.target.checked);
    };

    function fetchDumps() {
        fetch(`http://192.168.0.219:8081/api/dumps/get_all_dumps`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(error.error || "Failed to fetch dumps");
                    });
                }
                return response.json();
            })
            .then((data) => {
                setDumps(data);
            })
            .catch((error) => {
                console.error("Error fetching user profile:", error);

            });
    }
  
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
                    <small>Bins (8 digit): Search by 8 digits is available for users with a rating of 5 crab and
                        above.</small>
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
                {dumps.map((dump) => (
                    <tr key={dump.id} className='Dumps-tbody-tr'>
                        <td>
                            <input
                                type="checkbox"
                                className="row-select"
                                onChange={handleCheckboxChange}
                            />
                        </td>
                        <td>{dump.bin}</td>
                        <td>{dump.type}</td>
                        <td>{dump.debitCredit}</td>
                        <td>{dump.subtype}</td>
                        <td>{dump.exp}</td>
                        <td>{dump.track1}</td>
                        <td>{dump.zip}</td>
                        <td>{dump.code}</td>
                        <td>{dump.country}</td>
                        <td>{dump.address}</td>
                        <td>{dump.bank}</td>
                        <td>{dump.base}</td>
                        <td>${dump.price.toFixed(2)}</td>
                        <td>
                            <button
                                className='shopping-cart'
                                onClick={() => handleAddToCart(dump)}
                            >
                                <HiShoppingCart/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    </main>

  );
}

export default Dumps;
