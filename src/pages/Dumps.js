import React, { useState, useEffect, useContext } from 'react';
import { HiShoppingCart, HiCheckCircle } from "react-icons/hi"; // Импорт зеленой галочки
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";

function Dumps() {
    const [dumps, setDumps] = useState([]);
    const [filteredDumps, setFilteredDumps] = useState([]);
    const [purchaseMessage, setPurchaseMessage] = useState(false);
    const { addToCart, cartItems } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // **Стан для фільтрів**
    const [filters, setFilters] = useState({
        bins: "",
        cardNumber: "",
        bank: "all",
        bankCountry: "all",
        country: "all",
        state: "all",
        city: "all",
        zips: "",
        type: "all",
        debitCredit: "all",
        subtype: "all",
        code: "all",
        base: "all",
        expDate: "",
        track1: false,
        pin: false,
        refundable: false,
        billingZip: false,
        eddPin: false
    });

    useEffect(() => {
        if (!token) {
            navigate("/");
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
        .then(response => response.json())
        .then(data => {
            setDumps(data);
            setFilteredDumps(data);
        })
        .catch(error => console.error("Error fetching dumps data:", error));
    };

    const obfuscateExpDate = (expDate) => {
        const [month, year] = expDate.split('/');
        return `XX/${year}`;
    };

    const isItemInCart = (id) => cartItems.some(item => item.id === id);

    const handleAddToCart = (dump) => {
        if (isItemInCart(dump.dumpId)) return;

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
        setTimeout(() => setPurchaseMessage(false), 3000);
    };

    // **Обробка змін фільтрів**
    const handleFilterChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    // **Фільтрація даних**
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Filters before search:", filters);

        const filtered = dumps.filter((item) => {
            if (filters.bins && !item.bin?.includes(filters.bins)) return false;
            if (filters.cardNumber && !item.cardNumber?.includes(filters.cardNumber)) return false;
            if (filters.bank !== "all" && item.bank !== filters.bank) return false;
            if (filters.bankCountry !== "all" && item.bankCountry !== filters.bankCountry) return false;
            if (filters.country !== "all" && item.country !== filters.country) return false;
            if (filters.state !== "all" && item.state !== filters.state) return false;
            if (filters.city !== "all" && item.city !== filters.city) return false;
            if (filters.zips && !item.zip?.includes(filters.zips)) return false;
            if (filters.type !== "all" && item.type !== filters.type) return false;
            if (filters.debitCredit !== "all" && item.debitCredit !== filters.debitCredit) return false;
            if (filters.subtype !== "all" && item.subtype !== filters.subtype) return false;
            if (filters.code !== "all" && item.code !== filters.code) return false;
            if (filters.base !== "all" && item.base !== filters.base) return false;
            if (filters.expDate && item.exp !== filters.expDate) return false;
            if (filters.track1 && !item.track1) return false;
            if (filters.pin && !item.pin) return false;
            if (filters.refundable && !item.refundable) return false;
            if (filters.billingZip && !item.billingZip) return false;
            if (filters.eddPin && !item.eddPin) return false;
            return true;
        });

        console.log("Filtered results:", filtered);
        setFilteredDumps(filtered);
    };

    // **Очищення фільтрів**
    const handleClear = () => {
        setFilters({
            bins: "",
            cardNumber: "",
            bank: "all",
            bankCountry: "all",
            country: "all",
            state: "all",
            city: "all",
            zips: "",
            type: "all",
            debitCredit: "all",
            subtype: "all",
            code: "all",
            base: "all",
            expDate: "",
            track1: false,
            pin: false,
            refundable: false,
            billingZip: false,
            eddPin: false
        });
        setFilteredDumps(dumps);
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
                        <input type="text" id="bins" placeholder="Enter bins" value={filters.bins} onChange={handleFilterChange}  />
                        <small>Bins (8 digit): Search by 8 digits is available for users with a rating of 5 crab and above.</small>
                    </div>
                    <div>
                        <label for="bank">Bank:</label>
                        <select id="bank" value={filters.bank} onChange={handleFilterChange}>
                            <option value="all">- all -</option>
                            <option value="Woodforest National Bank">Woodforest National Bank</option>
                            <option value="Citizens Bank">Citizens Bank</option>
                            <option value="Capital One">Capital One</option>
                            <option value="Santander Bank">Santander Bank</option>
                            <option value="Barclays Bank">Barclays Bank</option>
                        </select>
                    </div>
                    <div>
                        <label for="bankCountry">Bank Country:</label>
                        <select id="bankCountry" value={filters.bankCountry} onChange={handleFilterChange}>
                            <option value="all">- all -</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Germany">Germany</option>
                            <option value="Japan">Japan</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="China">China</option>
                            <option value="France">France</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="South Korea">South Korea</option>
                            <option value="Norway">Norway</option>
                            <option value="Denmark">Denmark</option>
                            <option value="India">India</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Italy">Italy</option>
                        </select>
                    </div>
                    <div>
                        <label for="card-number">Card Number:</label>
                        <input type="text" id="cardNumber" placeholder="Enter last 4 digits" value={filters.cardNumber} onChange={handleFilterChange} />
                        <small>Search by last 4 digits is available for users with a rating of 2 crab and above.</small>
                    </div>


                    <div>
                        <label for="country">Country:</label>
                        <select id="country"value={filters.country} onChange={handleFilterChange} >
                            <option value="all">- all -</option>
                            <option value="UK">UK</option>
                            <option value="USA">USA</option>
                            <option value="AU">AU</option>
                            <option value="CAN">CAN</option>
                        </select>
                    </div>
                    <div>
                        <label for="state">State:</label>
                        <select id="state" value={filters.state} onChange={handleFilterChange} >
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
                    <div>
                        <label for="city">City:</label>
                        <select id="city" value={filters.city} onChange={handleFilterChange}>
                            <option value="all">- all -</option>
                            <option value="New York">New York</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="London">London</option>
                            <option value="Paris">Paris</option>
                            <option value="Tokyo">Tokyo</option>
                            <option value="Berlin">Berlin</option>
                            <option value="Rome">Rome</option>
                            <option value="Sydney">Sydney</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Barcelona">Barcelona</option>
                            <option value="Seoul">Seoul</option>
                            <option value="Shanghai">Shanghai</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="Madrid">Madrid</option>
                            <option value="Beijing">Beijing</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Istanbul">Istanbul</option>
                        </select>
                    </div>
                    <div>
                        <label for="zips">ZIPs:</label>
                        <textarea id="zips" rows="1" placeholder="Enter ZIPs" value={filters.zips} onChange={handleFilterChange}></textarea>
                    </div>

                    <div>
                        <label for="type">Type:</label>
                        <select id="type" value={filters.type} onChange={handleFilterChange} >
                            <option value="all">- all -</option>
                            <option value="Visa">Visa</option>
                            <option value="MasterCard">MasterCard</option>
                        </select>
                    </div>
                    <div>
                        <label for="debitCredit">Credit/Debit:</label>
                        <select id="debitCredit" value={filters.debitCredit} onChange={handleFilterChange} >
                            <option value="all">- all -</option>
                            <option value="DEBIT">DEBIT</option>
                            <option value="CREDIT">CREDIT</option>
                        </select>
                    </div>
                    <div>
                        <label for="subtype">Subtype:</label>
                        <select id="subtype" value={filters.subtype} onChange={handleFilterChange} >
                        <option value="all">- all -</option>
                        <option value={'GOLD'}>GOLD</option>
                        <option value="STANDARD">STANDARD</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="PLATINUM">PLATINUM</option>
                        <option value="PREPAID">PREPAID</option>
                        </select>
                    </div>
                    <div>
                        <label for="code">Code:</label>
                        <select id="code" value={filters.code} onChange={handleFilterChange}>
                            <option value="all">- all -</option>
                            <option value="202">202</option>
                            <option value="202">305</option>
                            <option value="202">404</option>
                            <option value="202">507</option>
                            <option value="202">600</option>
                        </select>
                    </div>

                    <div>
                        <label for="base">Base:</label>
                        <select id="base" value={filters.base} onChange={handleFilterChange} >
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div>
                        <label for="exp-date">Exp Date:</label>
                        <input type="text" id="expDate" placeholder="MM/YY" value={filters.expDate} onChange={handleFilterChange} />
                    </div>
                    
                    <div>
                        <h3 className='Dumps-label'>Options:</h3>
                        <div>
                            <div className="Dumps-checkbox-group">
                                <label for="track1">Track1</label>
                                <input type="checkbox" id="track1"value={filters.track1} onChange={handleFilterChange} />
                            </div>
                            <div className="Dumps-checkbox-group">
                                <label for="track1">PIN</label>
                                <input type="checkbox" id="pin"value={filters.pin} onChange={handleFilterChange} />
                            </div>
                            <div className="Dumps-checkbox-group">
                                <label for="track1">Refundable Only</label>
                                <input type="checkbox" id="refundable"value={filters.refundable} onChange={handleFilterChange} />
                            </div>
                            <div className="Dumps-checkbox-group">
                                <label for="track1">Billing ZIP</label>
                                <input type="checkbox" id="billingZip"value={filters.billingZip} onChange={handleFilterChange} />
                            </div>
                            <div className="Dumps-checkbox-group">
                                <label for="track1">EDD+pin</label>
                                <input type="checkbox" id="eddPin"value={filters.eddPin} onChange={handleFilterChange} />
                            </div>
                        </div>
                    </div>


                    <div className="Dumps-buttons-filter">
                        <button id="clear" onClick={handleClear}>Clear</button>
                        <button id="search" onClick={handleSearch}>Search</button>
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
                    {filteredDumps.map(dump => (
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



