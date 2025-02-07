import React, { useState, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";

function Dumps() {
    const [dumps, setDumps] = useState([]); // Храним данные с бэкенда
    const [purchaseMessage, setPurchaseMessage] = useState(false); // Сообщение о добавлении в корзину
    const { addToCart } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchDumps();
        }
    }, [navigate, token]);

    // Функция для получения данных с бэкенда
    const fetchDumps = () => {
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
                console.error("Error fetching dumps data:", error);
            });
    };

    // Функция для обфусцирования даты
    const obfuscateExpDate = (expDate) => {
        const [month, year] = expDate.split('/');
        return `XX/${year}`; // Скрываем месяц
    };

    // Добавление товара в корзину
    const handleAddToCart = (dump) => {
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
        setPurchaseMessage(true);

        // Убираем сообщение через 3 секунды
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
                    {dumps.map((dump) => (
                        <tr key={dump.id} className='Dumps-tbody-tr'>
                            <td>
                                <input type="checkbox" className="row-select"/>
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
