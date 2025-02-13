import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";

function Fullz() {

    const [isChecked, setIsChecked] = useState(false);
    const buttonContainerRef = useRef(null);
    const [purchaseMessage, setPurchaseMessage] = useState(false);
    const { addToCart } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [fullz, setFullz] = useState([]);
    const [filteredFullz, setFilteredFullz] = useState([]);
    const { cartItems } = useContext(CartContext);
    
      // Стан для фільтрів
      const [filters, setFilters] = useState({
        firstName: '',
        lastName: '',
        state: 'all',
        ownRent: 'all',
        phone: false,
        email: false,
        ssn: false,
        dob: false,
        mmn: false,
        driversNumber: false,
        accountNumber: '',
        base: 'all',
        dlState: 'all',
        country: 'United States',
        discounted: false,
        creditReport: false,
        creditReportPdf: false,
        personReportPdf: false,
      });
    
      useEffect(() => {
        if (!token) {
          navigate("/");
        } else {
          fetchFullz();
        }
      }, [navigate, token]);
    
      const isItemInCart = (id) => {
        return cartItems.some(item => item.id === id);
      };
    
      function fetchFullz() {
        fetch(`http://localhost:8081/api/full/all_fulls`, {
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
            setFullz(data);
            setFilteredFullz(data); // Спочатку відображаємо всі дані
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
          });
      }
    
      function getStatusLabel(text) {
        if (!text) return <span style={{ color: "red" }}>No</span>;
    
        const containsNo = text.toLowerCase().includes("no");
        return <span style={{ color: containsNo ? "red" : "green" }}>{containsNo ? "No" : "Yes"}</span>;
      }
    
      const handleAddToCart = (fullzItem) => {
        if (isItemInCart(fullzItem.id)) return;
        const rowData = {
          ...fullzItem,
          price: `$${fullzItem.price.toFixed(2)}`,
          category: 'Fullz',
        };
    
        addToCart(rowData);
        setPurchaseMessage(true);
    
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
    
      const handleFilterChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        setFilters((prevFilters) => ({
          ...prevFilters,
          [id]: type === 'checkbox' ? checked : value,  // Обробка для чекбоксів
        }));
      };
      
    
      const handleSearch = () => {
        // console.log("Item being checked:", item); // Лог кожного елемента
        
        console.log("Filters:", filters); // Лог поточних фільтрів
        const filtered = fullz.filter((item) => {
          // Логіка фільтрації
          if (filters.firstName && !item.name?.toLowerCase().includes(filters.firstName.toLowerCase())) {
            return false;
          }
          if (filters.lastName && !item.name?.toLowerCase().includes(filters.lastName.toLowerCase())) {
            return false;
          }
          if (filters.state !== 'all' && item.state !== filters.state) {
            return false;
          }
          if (filters.ownRent !== 'all' && item.ownOrRent !== filters.ownRent) {
            return false;
          }
          if (filters.phone && !item.phone) {
            return false;
          }
          if (filters.email && !item.email) {
            return false;
          }
          if (filters.ssn && !item.ssn) {
            return false;
          }
          if (filters.dob && !item.dob) {
            return false;
          }
          if (filters.mmn && !item.mmn) {
            return false;
          }
          if (filters.driversNumber && !item.driverLicense) {
            return false;
          }
          if (filters.accountNumber && !item.account?.includes(filters.accountNumber)) {
            return false;
          }
          if (filters.base !== 'all' && item.base !== filters.base) {
            return false;
          }
          if (filters.discounted && !item.discounted) {
            return false;
          }
          if (filters.creditReport && !item.creditReport) {
            return false;
          }
          if (filters.creditReportPdf && !item.creditReportPdf) {
            return false;
          }
          if (filters.personReportPdf && !item.personReportPdf) {
            return false;
          }
    
          return true;
        });
    
        setFilteredFullz(filtered);
      };
      const handleClear = () => {
        setFilters({
          firstName: '',
          lastName: '',
          state: 'all',
          ownRent: 'all',
          phone: false,
          email: false,
          ssn: false,
          dob: false,
          mmn: false,
          driversNumber: false,
          accountNumber: '',
          base: 'all',
          dlState: 'all',
          country: 'United States',
          discounted: false,
          creditReport: false,
          creditReportPdf: false,
          personReportPdf: false,
        });
        setFilteredFullz(fullz); // Повертаємо всі дані
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
                          <label htmlFor="first-name">First Name:</label>
                          <input
                            type="text"
                            id="firstName"
                            placeholder="Enter first name"
                            value={filters.firstName}
                            onChange={handleFilterChange}
                          />
                      </div>
                      <div>
                          <label htmlFor="last-name">Last Name:</label>
                          <input
                            type="text"
                            id="lastName"
                            placeholder="Enter last name"
                            value={filters.lastName}
                            onChange={handleFilterChange}
                          />
                      </div>
                      <div>
                          <label htmlFor="state">State:</label>
                          <select id="state"  onChange={handleFilterChange}>
                                <option value="all">- all -</option>
                                <option value="07 (1)">07 (1)</option>
                                <option value="10 (1)">10 (1)</option>
                                <option value="18 (1)">18 (1)</option>
                                <option value="20 (1)">20 (1)</option>
                                <option value="23 (1)">23 (1)</option>
                                <option value="27 (17)">27 (17)</option>
                                <option value="28 (14)">28 (14)</option>
                                <option value="29 (4)">29 (4)</option>
                                <option value="32 (3)">32 (3)</option>
                                <option value="33 (12)">33 (12)</option>
                                <option value="34 (2)">34 (2)</option>
                                <option value="37 (1)">37 (1)</option>
                                <option value="38 (1)">38 (1)</option>
                                <option value="42 (1)">42 (1)</option>
                                <option value="48 (11)">48 (11)</option>
                                <option value="49 (2)">49 (2)</option>
                                <option value="50 (3)">50 (3)</option>
                                <option value="60 (2)">60 (2)</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="own-rent">Own / Rent:</label>
                          <select id="own-rent"  onChange={handleFilterChange}>
                              <option value="all">- all -</option>
                              <option value="Own">Own</option>
                              <option value="Rent">Rent</option>
                          </select>
                      </div>

                      <div className="Fullz-checkbox-group">
                          <label htmlFor="phone">Phone</label>
                          <input type="checkbox" checked={filters.phone} id="phone"  onChange={handleFilterChange}/>
                      </div>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="email">Email</label>
                          <input type="checkbox" checked={filters.email} id="email"  onChange={handleFilterChange}/>
                      </div>
                  </div>

                  {/* Second colum */}
                  <div className='Fullz-second-colum Fullz-colum'>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="ssn">SSN</label>
                          <input type="checkbox" checked={filters.ssn} id="ssn"  onChange={handleFilterChange}/>
                      </div>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="dob">DOB</label>
                          <input type="checkbox" checked={filters.dob} id="dob"  onChange={handleFilterChange}/>
                      </div>


                      <div className="Fullz-checkbox-group">
                          <label htmlFor="mmn">MMN</label>
                          <input type="checkbox" checked={filters.mmn} id="mmn"  onChange={handleFilterChange}/>
                      </div>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="driversNumber">Drivers Number</label>
                          <input type="checkbox" checked={filters.driversNumber} id="driversNumber"  onChange={handleFilterChange}/>
                      </div>
                      <div>
                          <label htmlFor="dl-state">DL State:</label>
                          <select id="dl-state"  onChange={handleFilterChange}>
                                <option value="all">- all -</option>
                                <option value="(2)">(2)</option>
                                <option value="0 (>1000)">{"0 (>1000)"}</option>
                                <option value="01 (>1000)">{'01 (>1000)'}</option>
                                <option value="02 (326)">{'02 (326)'}</option>
                                <option value="03 (>1000)">{'03 (>1000)'}</option>
                                <option value="04 (599)">04 (599)</option>
                                <option value="05 (464)">05 (464)</option>
                                <option value="06 (472)">06 (472)</option>
                                <option value="07 (>1000)">{'07 (>1000)'}</option>
                                <option value="08 (>1000)">{'08 (>1000)'}</option>
                                <option value="09 (>1000)">{'09 (>1000)'}</option>
                                <option value="1 (>1000)">{"1 (>1000)"}</option>
                                <option value="1. (33)">1. (33)</option>
                                <option value="10 (>1000)">{'10 (>1000)'}</option>
                                <option value="11 (>1000)">{'11 (>1000)'}</option>
                                <option value="12 (762)">12 (762)</option>
                                <option value="14 (400)">14 (400)</option>
                                <option value="15 (23)">15 (23)</option>
                                <option value="16 (1)">16 (1)</option>
                               
                          </select>
                      </div>
                      <div>
                          <label htmlFor="account-number">Account Number:</label>
                          <input type="text" id="account-number" placeholder="Enter account number"  onChange={handleFilterChange}/>
                      </div>

                      <div className="Fullz-checkbox-group">
                          <label htmlFor="routingNumber">Routing Number</label>
                          <input type="checkbox" checked={filters.routingNumber} id="routingNumber" onChange={handleFilterChange}/>
                      </div>
                  </div>

                  {/* third colum */}
                  <div className='Fullz-third-colum Fullz-colum'>
                      <div>
                          <label htmlFor="base">Base:</label>
                          <select id="base"  onChange={handleFilterChange}>
                              <option value="all">- all -</option>
                              <option value="0515_FULLZ_DLN">0515_FULLZ_DLN</option>
                              <option value="0515_FULLZ_SSN">0515_FULLZ_SSN</option>
                              <option value="0516_FULLZ_SSN">0516_FULLZ_SSN</option>
                              <option value="0517_FULLZ_SSN">0517_FULLZ_SSN</option>
                              <option value="0518_FULLZ_SSN">0518_FULLZ_SSN</option>
                              <option value="0519_FULLZ_DLN">0519_FULLZ_DLN</option>

                          </select>
                      </div>
                      <div>
                          <label htmlFor="country">Country:</label>
                          <select id="country"  onChange={handleFilterChange}>
                              <option value="all">United States</option>
                          </select>
                      </div>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="discounted">Discounted</label>
                          <input type="checkbox" checked={filters.discounted} id="discounted"  onChange={handleFilterChange}/>
                      </div>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="creditReport">Credit Report <span title="Info about credit report">&#9432;</span></label>
                          <input type="checkbox" checked={filters.creditReport} id="creditReport"  onChange={handleFilterChange}/>
                      </div>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="creditReportPdf">Credit Report (PDF) <span title="Info about credit report PDF">&#9432;</span></label>
                          <input type="checkbox" checked={filters.creditReportPdf} id="creditReportPdf"  onChange={handleFilterChange}/>
                      </div>
                      <div className="Fullz-checkbox-group">
                          <label htmlFor="personReportPdf">Person Report (PDF) <span title="Info about person report">&#9432;</span></label>
                          <input type="checkbox" checked={filters.personReportPdf} id="personReportPdf"  onChange={handleFilterChange}/>
                      </div>
                  </div>
              </div>

              <div className="Fullz-buttons">
                  <button id="clear"onClick={handleClear}>Clear</button>
                  <button id="search" onClick={handleSearch}>Search</button>
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
          <tbody className='Fullz-tbody'>
                {filteredFullz.map((fullz) => (
                    <tr key={fullz.id} className='Fullz-tbody-tr'>
                        <td>
                            <input
                                type="checkbox"
                                className="row-select"
                                onChange={handleCheckboxChange}
                            />
                        </td>
                        <td>
                            <ul>
                                <li>
                                    <div>
                                        <span>Name:</span>
                                        <span className='row-name'>{fullz.name}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>City/Zip:</span>
                                        <span className='row-city-zip'>{fullz.city}, {fullz.zip}, {fullz.country}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Full address:</span>
                                        <span className='row-fullAdress'>{getStatusLabel(fullz.fullAdress)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Phone:</span>
                                        <span className='row-phone'>{getStatusLabel(fullz.phone)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Email:</span>
                                        <span className='row-email'>{getStatusLabel(fullz.email)}</span>
                                    </div>
                                </li>
                            </ul>
                        </td>
                        {/* Second colum */}
                        <td>
                            <ul>
                                <li>
                                    <div>
                                        <span>Own/Rent:</span>
                                        <span className='row-ownOrRent'>{getStatusLabel(fullz.ownOrRent)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Years At Residence:</span>
                                        <span
                                            className='row-yearsAtResidence'>{getStatusLabel(fullz.yearsAtResidence)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Income Type:</span>
                                        <span className='row-incomeType'>{getStatusLabel(fullz.incomeType)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Employer:</span>
                                        <span className='row-employer'>{getStatusLabel(fullz.employer)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Occupation:</span>
                                        <span className='row-occupation'>{getStatusLabel(fullz.occupation)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Years Employed:</span>
                                        <span className='row-yearsEmployed'>{getStatusLabel(fullz.yearsEmployed)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Work Phone:</span>
                                        <span className='row-workPhone'>{getStatusLabel(fullz.workPhone)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Net Monthly Income:</span>
                                        <span
                                            className='row-netMonthlyIncome'>{getStatusLabel(fullz.netMonthlyIncome)}</span>
                                    </div>
                                </li>
                            </ul>
                        </td>
                        {/* Third Column */}
                        <td>
                            <ul>
                                <li>
                                    <div>
                                        <span>Credit Report:</span>
                                        <span className='row-creditReport'>{getStatusLabel(fullz.creditReport)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Credit Card:</span>
                                        <span className='row-creditCard'>{getStatusLabel(fullz.creditCard)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Checking Account:</span>
                                        <span
                                            className='row-checkingAccount'>{getStatusLabel(fullz.checkingAccount)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>SSN:</span>
                                        <span className='row-ssn'>{getStatusLabel(fullz.ssn)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>DOB:</span>
                                        <span className='row-dob'>{getStatusLabel(fullz.dob)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>MMN:</span>
                                        <span className='row-mmn'>{getStatusLabel(fullz.mmn)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Driver License (NV):</span>
                                        <span className='row-driverLicense'>{getStatusLabel(fullz.driverLicense)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Account:</span>
                                        <span className='row-account'>{getStatusLabel(fullz.account)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Routing:</span>
                                        <span className='row-routing'>{getStatusLabel(fullz.routing)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Extra Info:</span>
                                        <span className='row-extraInfo'>{getStatusLabel(fullz.extraInfo)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Credit Report (Pdf):</span>
                                        <span
                                            className='row-creditReportPdf'>{getStatusLabel(fullz.creditReportPdf)}</span>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span>Person Report (Pdf):</span>
                                        <span
                                            className='row-personReportPdf'>{getStatusLabel(fullz.personReportPdf)}</span>
                                    </div>
                                </li>
                            </ul>
                        </td>
                        <td><span style={{margin: "0 10px"}}>{fullz.base}</span></td>
                        <td><span className='Fullz-prise'>${fullz.price.toFixed(2)}</span></td>

                        <td className="cart-icon-cell">
                            {isItemInCart(fullz.id) ? (
                                <HiCheckCircle className="check-icon" color="green" size={24}/>
                            ) : (
                                <button
                                    className='shopping-cart'
                                    onClick={() => handleAddToCart(fullz)}
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

export default Fullz;
