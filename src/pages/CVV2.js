import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";
import {HiCheckCircle } from "react-icons/hi";

function CVV2() {
    const [isChecked, setIsChecked] = useState(false);
    const buttonContainerRef = useRef(null);
    const [purchaseMessage, setPurchaseMessage] = useState(false); // Стан для повідомлення
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const [cvv2s, setCvv2] = useState([]); // Состояние для хранения данных
    const { addToCart, cartItems } = useContext(CartContext); // Получаем текущие элементы в корзине

    const isItemInCart = (id) => cartItems.some(item => item.id === id);


    // Використовуємо useEffect для оновлення стилю, коли змінюється isChecked
  useEffect(() => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.style.display = isChecked ? 'block' : 'none';
    }
  }, [isChecked]);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

    const obfuscateExpDate = (expDate) => {
        const [month, year] = expDate.split('/');
        return `XX/${year}`;
    };

  useEffect(() => {
          if (!token) {
              navigate("/login");
          } else {
              fetchCVV2();
          }
      }, [navigate, token]);

    function fetchCVV2() {
        fetch(`http://192.168.0.219:8081/api/cvv2/get_all_cvv2`, {
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
                setCvv2(data);
            })
            .catch((error) => {
                console.error("Error fetching user profile:", error);

            });
    }

    const handleAddToCart = (cvv2) => {
        const rowData = {
            id: cvv2.cardId,
            bin: cvv2.bin,
            type: cvv2.type,
            subtype: cvv2.subtype,
            exp: obfuscateExpDate(cvv2.expDate),
            name: cvv2.name,
            country: cvv2.country,
            state: cvv2.state,
            zip: cvv2.zip,
            extra: cvv2.extra,
            bank: cvv2.bank,
            base: cvv2.base,
            price: `$${cvv2.price.toFixed(2)}`, // Форматируем цену
            category: 'CVV2',
        };

        addToCart(rowData); // Добавляем в корзину
        setPurchaseMessage(true);

        // Убираем сообщение через 3 секунды
        setTimeout(() => {
            setPurchaseMessage(false);
        }, 3000);
    };

    return (
    <main className='CVV2-main'>
        <div className="CVV2-container">
        <h1 className='page-title'>CVV2</h1>
        {purchaseMessage && (
          <div className="purchase-message">
            Purchase completed successfully!
          </div>
        )}
        <form className="CVV2-filter-form">

            <div className="CVV2-filter-form-container">
                <div className="CVV2-filter-column">
                    <div className="CVV2-filter-group">
                        <label for="bins">Bins:</label>
                        <textarea id="bins" name="bins"></textarea>
                    </div>
                    <div className="CVV2-filter-group">
                        <label for="zips">Zips:</label>
                        <textarea id="zips" name="zips"></textarea>
                    </div>
                    <div className="CVV2-filter-group">
                        <label for="bank">Bank:</label>
                        <select id="bank" name="bank">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                </div>

                <div className="CVV2-filter-column">
                    <div className="CVV2-filter-group">
                        <label for="country">Country:</label>
                        <select id="country" name="country">
                            <option value="all">- all -</option>
                            <option value="usa">USA</option>
                        </select>
                    </div>
                    <div className="CVV2-filter-group">
                        <label for="state">State:</label>
                        <select id="state" name="state">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="zip">ZIP:</label>
                        <input type="checkbox" id="zip" name="zip"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="full-address">Full Address:</label>
                        <input type="checkbox" id="full-address" name="full-address"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="user-agent">User-Agent:</label>
                        <input type="checkbox" id="user-agent" name="user-agent"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="phone">Phone:</label>
                        <input type="checkbox" id="phone" name="phone"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="email">Email:</label>
                        <input type="checkbox" id="email" name="email"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="email-password">Email Password:</label>
                        <input type="checkbox" id="email-password" name="email-password"/>
                    </div>
                </div>

                <div className="CVV2-filter-column">
                    <div className="CVV2-filter-group">
                        <label for="type">Type:</label>
                        <select id="type" name="type">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div className="CVV2-filter-group">
                        <label for="credit-debit">Credit/Debit:</label>
                        <select id="credit-debit" name="credit-debit">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div className="CVV2-filter-group">
                        <label for="subtype">Subtype:</label>
                        <select id="subtype" name="subtype">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div className="CVV2-filter-group">
                        <label for="exp-date">Exp Date:</label>
                        <input type="text" id="exp-date" name="exp-date" placeholder="MM/YY"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="discounted">Discounted:</label>
                        <input type="checkbox" id="discounted" name="discounted"/>
                    </div>
                    <div class="CVV2-filter-group CVV2-checkbox-group">
                        <label for="only-refundable">Only refundable:</label>
                        <input type="checkbox" id="only-refundable" name="only-refundable"/>
                    </div>
                    <div className="CVV2-filter-group">
                        <label>Price Range:</label>
                        {/* <span>${priceRange}</span> */}
                        {/* <input type="range" min="1" max="150" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}/> */}
                        <span>$150</span>
                    </div>
                </div>

                <div className="CVV2-filter-column">
                    <div className="CVV2-filter-group">
                        <label for="base">Base:</label>
                        <select id="base" name="base">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="dob">DOB:</label>
                        <input type="checkbox" id="dob" name="dob"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="ssn">SSN:</label>
                        <input type="checkbox" id="ssn" name="ssn"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="mmn">MMN:</label>
                        <input type="checkbox" id="mmn" name="mmn"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="ip-address">IP Address:</label>
                        <input type="checkbox" id="ip-address" name="ip-address"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="driver-lic-num">Driver Lic Num:</label>
                        <input type="checkbox" id="driver-lic-num" name="driver-lic-num"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="driver-lic-scan">Driver Lic Scan:</label>
                        <input type="checkbox" id="driver-lic-scan" name="driver-lic-scan"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="atm-pin">ATM PIN:</label>
                        <input type="checkbox" id="atm-pin" name="atm-pin"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="att-pin">AT&T PIN:</label>
                        <input type="checkbox" id="att-pin" name="att-pin"/>
                    </div>
                    <div className="CVV2-filter-group CVV2-checkbox-group">
                        <label for="otp">OTP:</label>
                        <input type="checkbox" id="otp" name="otp"/>
                    </div>
                </div>
            </div>



            <div className="Fullz-buttons">
                    <button id="clear">Clear</button>
                    <button id="search">Search</button>
            </div>
        </form>
        {isChecked && (
                <div ref={buttonContainerRef} className="Dumps-button-container">
                    <button id="action1">Cart</button>
                    <button id="action2">Fast order</button>
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

            <tbody className='CVV2-tbody'>
                {cvv2s.map((cvv2) => (
                    <tr key={cvv2.id} className='Dumps-tbody-tr'>
                        <td>
                            <input
                                type="checkbox"
                                className="row-select"
                                onChange={handleCheckboxChange}
                            />
                        </td>
                        <td>{cvv2.bin}</td>
                        <td>{cvv2.type}</td>
                        <td>{cvv2.subtype}</td>
                        <td>{obfuscateExpDate(cvv2.expDate)}</td>
                        <td>{cvv2.name}</td>
                        <td>{cvv2.country}</td>
                        <td>{cvv2.state}</td>
                        <td>{cvv2.zip}</td>
                        <td>{cvv2.extra}</td>
                        <td>{cvv2.bank}</td>
                        <td>{cvv2.base}</td>
                        <td>${cvv2.price.toFixed(2)}</td>
                        <td>
                            {isItemInCart(cvv2.cardId) ? (
                                <HiCheckCircle color="green" size={24}/> // Зеленая галочка, если элемент добавлен
                            ) : (
                                <button
                                    className='shopping-cart'
                                    onClick={() => handleAddToCart(cvv2)}
                                >
                                    <HiShoppingCart size={24}/>
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    </main>

    );
}

export default CVV2;
