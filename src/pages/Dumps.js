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
