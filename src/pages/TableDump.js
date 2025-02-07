import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";

function TableOne() {
    const [isChecked, setIsChecked] = useState(false);
    const buttonContainerRef = useRef(null);
    const [purchaseMessage, setPurchaseMessage] = useState(false);
    const { addToCart } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const [userDumps, setDumps] = useState([]); // Состояние для хранения данных

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchDumps();
    }
  }, [navigate, token]);

  function fetchDumps() {
    fetch(`http://192.168.0.219:8081/api/dumps/${username}/full`, {
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
            {userDumps.map((dump) => (
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

export default TableOne;
