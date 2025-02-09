import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";

function CVV2() {
  // Стан для відображення/приховування кнопок
  const [isChecked, setIsChecked] = useState(false);
  const buttonContainerRef = useRef(null);
  const [purchaseMessage, setPurchaseMessage] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Стан для даних та відфільтрованих даних
  const [cvv2s, setCvv2s] = useState([]);
  const [filteredCvv2s, setFilteredCvv2s] = useState([]);

  const { addToCart, cartItems } = useContext(CartContext);
  const isItemInCart = (id) => cartItems.some(item => item.id === id);

  // Стан для фільтрів
  const [filters, setFilters] = useState({
    bins: "",
    zips: "",
    bank: "all",
    country: "all",
    state: "all",
    type: "all",
    debitCredit: "all",
    subtype: "all",
    expDate: "",
    discounted: false,
    onlyRefundable: false,
    base: "all",
    dob: false,
    ssn: false,
    mmn: false,
    ipAddress: false,
    driverLicNum: false,
    driverLicScan: false,
    atmPin: false,
    attPin: false,
    otp: false,
  });

  // Оновлення стану фільтрів при зміні елементів форми
  const handleFilterChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: type === 'checkbox' ? checked : value,  // Обробка для чекбоксів
    }));
  };

  // Відображення/приховування додаткових кнопок
  useEffect(() => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.style.display = isChecked ? 'block' : 'none';
    }
  }, [isChecked]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  // Функція для обфускації дати закінчення терміну (MM/YY → XX/YY)
  const obfuscateExpDate = (expDate) => {
    const [month, year] = expDate.split('/');
    return `XX/${year}`;
  };

  // Завантаження даних після монтування компонента
  useEffect(() => {
    if (!token) {
      navigate("/");
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
            throw new Error(error.error || "Failed to fetch cvv2 data");
          });
        }
        return response.json();
      })
      .then((data) => {
        setCvv2s(data);
        setFilteredCvv2s(data); // Відображаємо всі дані спочатку
      })
      .catch((error) => {
        console.error("Error fetching CVV2 data:", error);
      });
  }

  // Додавання товару в корзину
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
      price: `$${cvv2.price.toFixed(2)}`,
      category: 'CVV2',
    };

    addToCart(rowData);
    setPurchaseMessage(true);

    setTimeout(() => {
      setPurchaseMessage(false);
    }, 3000);
  };

  // Фільтрація даних на основі значень фільтрів
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Filters before search:", filters);
    
    const filtered = cvv2s.filter((item) => {
        // Фільтрація по BINs
        if (filters.bins && !item.bin?.includes(filters.bins)) {
            return false;
        }
        // Фільтрація по ZIPs
        if (filters.zips && !item.zip?.includes(filters.zips)) {
            return false;
        }
        // Фільтрація по банку
        if (filters.bank !== 'all' && item.bank !== filters.bank) {
            return false;
        }
        // Фільтрація по країні
        if (filters.country !== 'all' && item.country !== filters.country) {
            return false;
        }
        // Фільтрація по штату
        if (filters.state !== 'all' && item.state !== filters.state) {
            return false;
        }
        // Фільтрація по типу картки
        if (filters.type !== 'all' && item.type !== filters.type) {
            return false;
        }
        // Фільтрація по Credit/Debit
        if (filters.debitCredit !== 'all' && item.debitCredit !== filters.debitCredit) {
            return false;
        }
        // Фільтрація по підтипу
        if (filters.subtype !== 'all' && item.subtype !== filters.subtype) {
            return false;
        }
        // Фільтрація по даті закінчення терміну дії (Exp Date)
        if (filters.expDate && item.expDate !== filters.expDate) {
            return false;
        }
        // Фільтрація по знижках
        if (filters.discounted && !item.discounted) {
            return false;
        }
        // Фільтрація тільки по refundable (повернення коштів)
        if (filters.onlyRefundable && !item.refundable) {
            return false;
        }
        // Фільтрація по базі даних
        if (filters.base !== 'all' && item.base !== filters.base) {
            return false;
        }
        // Фільтрація по наявності DOB (дата народження)
        if (filters.dob && !item.dob) {
            return false;
        }
        // Фільтрація по наявності SSN
        if (filters.ssn && !item.ssn) {
            return false;
        }
        // Фільтрація по наявності MMN (мати)
        if (filters.mmn && !item.mmn) {
            return false;
        }
        // Фільтрація по IP-адресі
        if (filters.ipAddress && !item.ipAddress) {
            return false;
        }
        // Фільтрація по номеру водійського посвідчення
        if (filters.driverLicNum && !item.driverLicNum) {
            return false;
        }
        // Фільтрація по наявності скану водійського посвідчення
        if (filters.driverLicScan && !item.driverLicScan) {
            return false;
        }
        // Фільтрація по ATM PIN
        if (filters.atmPin && !item.atmPin) {
            return false;
        }
        // Фільтрація по AT&T PIN
        if (filters.attPin && !item.attPin) {
            return false;
        }
        // Фільтрація по OTP
        if (filters.otp && !item.otp) {
            return false;
        }
    
        return true;
    });
    

    console.log("Filtered results:", filtered);
    setFilteredCvv2s(filtered);
};




  // Очищення фільтрів і повернення відображення всіх даних
  const handleClear = (e) => {
    e.preventDefault();
    const defaultFilters = {
      bins: "",
      zips: "",
      bank: "all",
      country: "all",
      state: "all",
      type: "all",
      debitCredit: "all",
      subtype: "all",
      expDate: "",
      discounted: false,
      onlyRefundable: false,
      base: "all",
      dob: false,
      ssn: false,
      mmn: false,
      ipAddress: false,
      driverLicNum: false,
      driverLicScan: false,
      atmPin: false,
      attPin: false,
      otp: false,
    };
    setFilters(defaultFilters);
    setFilteredCvv2s(cvv2s);
  };
  const maskName = (fullName) => {
    if (!fullName) return ""; // Якщо значення порожнє
    
    const parts = fullName.split(" ");
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1][0]}.*****`; // Наприклад: "John D.*****"
    }
    return fullName; // Якщо лише ім'я, повертаємо без змін
  };
  const maskZip = (zip) => {
    if (!zip || zip.length < 2) return zip; // Якщо ZIP занадто короткий, не змінюємо
    return `${zip.slice(0, 2)}****`; // Приклад: "12345" → "12****"
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
            {/* Перший стовпець */}
            <div className="CVV2-filter-column">
              <div className="CVV2-filter-group">
                <label htmlFor="bins">Bins:</label>
                <textarea
                  id="bins"
                  name="bins"
                  value={filters.bins}
                  onChange={handleFilterChange}
                ></textarea>
              </div>
              <div className="CVV2-filter-group">
                <label htmlFor="zips">Zips:</label>
                <textarea
                  id="zips"
                  name="zips"
                  value={filters.zips}
                  onChange={handleFilterChange}
                ></textarea>
              </div>
              <div className="CVV2-filter-group">
                <label htmlFor="bank">Bank:</label>
                <select
                  id="bank"
                  name="bank"
                  value={filters.bank}
                  onChange={handleFilterChange}
                >
                  <option value="all">- all -</option>
                  <option value="CITI BANK">CITI BANK</option>
                  <option value="CHASE BANK">CHASE BANK</option>
                  <option value="HSBC">HSBC</option>
                  <option value="WELLS FARGO">WELLS FARGO	</option>
                </select>
              </div>
            </div>

            {/* Другий стовпець */}
            <div className="CVV2-filter-column">
              <div className="CVV2-filter-group">
                <label htmlFor="country">Country:</label>
                <select
                  id="country"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                >
                    <option value="all">- all -</option>
                    <option value="USA">UK</option>
                    <option value="USA">USA</option>
                    <option value="AU">AU</option>
                    <option value="CAN">CAN</option>
                </select>
              </div>
              <div className="CVV2-filter-group">
                <label htmlFor="state">State:</label>
                <select
                  id="state"
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                >
                    <option value="all">- all -</option>
                    <option value="AK ()">AK ()</option>
                    <option value="AL ()">AL ()</option>
                    <option value="AR ()">AR ()</option>
                    <option value="AZ ()">AZ ()</option>
                    <option value="CA ()">CA ()</option>
                    <option value="CO ()">CO ()</option>
                    <option value="CT ()">CT ()</option>
                    <option value="DC ()">DC ()</option>
                    <option value="DE ()">DE ()</option>
                    <option value="FL ()">FL ()</option>
                    <option value="GA ()">GA ()</option>
                    <option value="HI ()">HI ()</option>
                    <option value="IA ()">IA ()</option>
                    <option value="ID ()">ID ()</option>
                    <option value="IL ()">IL ()</option>
                    <option value="IN ()">IN ()</option>
                    <option value="KS ()">KS ()</option>
                    <option value="KY ()">KY ()</option>
                </select>
              </div>
              {/* Можна додати інші чекбокси, якщо потрібно */}
            </div>

            {/* Третій стовпець */}
            <div className="CVV2-filter-column">
              <div className="CVV2-filter-group">
                <label htmlFor="type">Type:</label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="all">- all -</option>
                  <option value="VISA">Visa</option>
                  <option value="MASTERCARD">MasterCard</option>
                  {/* Додаткові варіанти */}
                </select>
              </div>
                <div className="CVV2-filter-group">
                    <label htmlFor="debitCredit">Credit/Debit:</label>
                    <select
                        id="debitCredit"
                        name="debitCredit"
                        value={filters.debitCredit}
                        onChange={handleFilterChange}
                    >
                    <option value="all">- all -</option>
                    <option value="DEBIT">DEBIT</option>
                    <option value="CREDIT">CREDIT</option>
                    </select>
                </div>
              <div className="CVV2-filter-group">
                <label htmlFor="subtype">Subtype:</label>
                <select
                  id="subtype"
                  name="subtype"
                  value={filters.subtype}
                  onChange={handleFilterChange}
                >
                  <option value="all">- all -</option>
                  <option value={'GOLD'}>GOLD</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="PLATINUM">PLATINUM</option>
                </select>
              </div>
              <div className="CVV2-filter-group">
                <label htmlFor="expDate">Exp Date:</label>
                <input
                  type="text"
                  id="expDate"
                  name="expDate"
                  placeholder="MM/YY"
                  value={filters.expDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="discounted">Discounted:</label>
                <input
                  type="checkbox"
                  id="discounted"
                  name="discounted"
                  checked={filters.discounted}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="onlyRefundable">Only Refundable:</label>
                <input
                  type="checkbox"
                  id="onlyRefundable"
                  name="onlyRefundable"
                  checked={filters.onlyRefundable}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Четвертий стовпець */}
            <div className="CVV2-filter-column">
              <div className="CVV2-filter-group">
                <label htmlFor="base">Base:</label>
                <select
                  id="base"
                  name="base"
                  value={filters.base}
                  onChange={handleFilterChange}
                >
                  <option value="all">- all -</option>
                  <option value="Alice">Alice</option>
                  <option value="Mark">Mark</option>
                  <option value="Sarah">Sarah</option>
                  <option value="Tom">Tom	</option>
                  
                  {/* Додаткові варіанти */}
                </select>
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="dob">DOB:</label>
                <input
                  type="checkbox"
                  id="dob"
                  name="dob"
                  checked={filters.dob}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="ssn">SSN:</label>
                <input
                  type="checkbox"
                  id="ssn"
                  name="ssn"
                  checked={filters.ssn}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="mmn">MMN:</label>
                <input
                  type="checkbox"
                  id="mmn"
                  name="mmn"
                  checked={filters.mmn}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="ipAddress">IP Address:</label>
                <input
                  type="checkbox"
                  id="ipAddress"
                  name="ipAddress"
                  checked={filters.ipAddress}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="driverLicNum">Driver Lic Num:</label>
                <input
                  type="checkbox"
                  id="driverLicNum"
                  name="driverLicNum"
                  checked={filters.driverLicNum}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="driverLicScan">Driver Lic Scan:</label>
                <input
                  type="checkbox"
                  id="driverLicScan"
                  name="driverLicScan"
                  checked={filters.driverLicScan}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="atmPin">ATM PIN:</label>
                <input
                  type="checkbox"
                  id="atmPin"
                  name="atmPin"
                  checked={filters.atmPin}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="attPin">AT&T PIN:</label>
                <input
                  type="checkbox"
                  id="attPin"
                  name="attPin"
                  checked={filters.attPin}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="CVV2-filter-group CVV2-checkbox-group">
                <label htmlFor="otp">OTP:</label>
                <input
                  type="checkbox"
                  id="otp"
                  name="otp"
                  checked={filters.otp}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          <div className="Fullz-buttons">
            <button id="clear" onClick={handleClear}>Clear</button>
            <button id="search" onClick={handleSearch}>Search</button>
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
            {filteredCvv2s.map((cvv2) => (
              <tr key={cvv2.cardId} className='Dumps-tbody-tr'>
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
                <td>{maskName(cvv2.name)}</td>
                <td>{cvv2.country}</td>
                <td>{cvv2.state}</td>
                <td>{maskZip(cvv2.zip)}</td>
                <td>{cvv2.extra}</td>
                <td>{cvv2.bank}</td>
                <td>{cvv2.base}</td>
                <td>${cvv2.price.toFixed(2)}</td>
                <td>
                  {isItemInCart(cvv2.cardId) ? (
                    <HiCheckCircle color="green" size={24}/>
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

