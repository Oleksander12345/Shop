import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";

function TableCvv() {
  const [isChecked, setIsChecked] = useState(false);
  const buttonContainerRef = useRef(null);
  const [purchaseMessage, setPurchaseMessage] = useState(false);
  // const [setPurchaseMessage] = useState(false);
  // const [priceRange, setPriceRange] = useState(1);
  const { addToCart } = useContext(CartContext);
  const token = localStorage.getItem("token")
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [cvvs, setCvvs] = useState([]); // Состояние для хранения данных

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchCvvs();
    }
  }, [navigate, token]);

  useEffect(() => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.style.display = isChecked ? 'block' : 'none';
    }
  }, [isChecked]);

  function fetchCvvs() {
    fetch(`http://192.168.0.219:8081/api/cvv2/${username}/full`, {
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
          setCvvs(data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);

        });
  }

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

        <table className='CVV2-table'>
          <thead className='Cvv2-thead'>
          <tr>
            <th>Select</th>
            <th>Bin</th>
            <th>Type</th>
            <th>Debit/Credit</th>
            <th>Subtype</th>
            <th>Card Number</th>
            <th>Exp Date</th>
            <th>CVV2</th>
            <th>Name</th>
            <th>Address</th>
            <th>Extra</th>
            <th>Bank</th>
            <th>Base</th>
            <th>Price</th>
            <th>Cart</th>
          </tr>
          </thead>
          <tbody className='Cvv2-tbody'>
          {cvvs.map((dump) => (
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
                <td>{dump.debit_credit}</td>
                <td>{dump.subtype}</td>
                <td>{dump.cardNumber}</td>
                <td>{dump.expDate}</td>
                <td>{dump.cvv2}</td>
                <td>{dump.name}</td>
                <td>{dump.address}</td>
                <td>{dump.extra}</td>
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

export default TableCvv;
