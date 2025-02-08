import React, { useState, useEffect, useContext } from 'react';
import { HiShoppingCart, HiCheckCircle } from "react-icons/hi"; // Импорт зеленой галочки
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";

function Dumps() {
    const [dumps, setDumps] = useState([]);
    const [addedItems, setAddedItems] = useState([]); // Храним добавленные элементы
    const [purchaseMessage, setPurchaseMessage] = useState(false);
    const { addToCart, cartItems } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchDumps();
        }
    }, [navigate, token]);

    const fetchDumps = () => {
        fetch(`http://192.168.0.219:8081/api/dumps/get_all_dumps`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error || "Failed to fetch dumps");
                    });
                }
                return response.json();
            })
            .then(data => {
                setDumps(data);
            })
            .catch(error => {
                console.error("Error fetching dumps data:", error);
            });
    };

    const obfuscateExpDate = (expDate) => {
        const [month, year] = expDate.split('/');
        return `XX/${year}`;
    };

    // Проверка, добавлен ли элемент
    const isItemInCart = (id) => cartItems.some(item => item.id === id);

    const handleAddToCart = (dump) => {
        if (isItemInCart(dump.dumpId)) {
            return; // Если элемент уже добавлен, ничего не делаем
        }

        const rowData = {
            id: dump.dumpId,
            bin: dump.bin,
            type: dump.type,
            debitCredit: dump.debitCredit,
            subtype: dump.subtype,
            expDate: obfuscateExpDate(dump.exp),
            track1: dump.track1,
            billingZip: dump.zip,
            code: dump.code,
            country: dump.country,
            address: dump.address,
            bank: dump.bank,
            base: dump.base,
            price: `$${dump.price.toFixed(2)}`,
            category: 'Dumps'
        };

        addToCart(rowData);
        setAddedItems(prev => [...prev, dump.dumpId]); // Добавляем ID элемента в список
        setPurchaseMessage(true);

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
                        Item added to cart successfully!
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
                    {dumps.map(dump => (
                        <tr key={dump.dumpId} className='Dumps-tbody-tr'>
                            <td>
                                <input type="checkbox" className="row-select" />
                            </td>
                            <td>{dump.bin}</td>
                            <td>{dump.type}</td>
                            <td>{dump.debitCredit}</td>
                            <td>{dump.subtype}</td>
                            <td>{obfuscateExpDate(dump.exp)}</td>
                            <td>{dump.track1}</td>
                            <td>{dump.zip}</td>
                            <td>{dump.code}</td>
                            <td>{dump.country}</td>
                            <td>{dump.address}</td>
                            <td>{dump.bank}</td>
                            <td>{dump.base}</td>
                            <td>${dump.price.toFixed(2)}</td>
                            <td>
                                {isItemInCart(dump.dumpId) ? (
                                    <HiCheckCircle color="green" size={24} /> // Зеленая галочка
                                ) : (
                                    <button
                                        className='shopping-cart'
                                        onClick={() => handleAddToCart(dump)}
                                    >
                                        <HiShoppingCart size={24} />
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

export default Dumps;
