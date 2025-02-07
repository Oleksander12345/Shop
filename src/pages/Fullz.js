import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";

function Fullz() {
  const [isChecked, setIsChecked] = useState(false);
  const buttonContainerRef = useRef(null);
  const [purchaseMessage, setPurchaseMessage] = useState(false); // Стан для повідомлення
  const { addToCart } = useContext(CartContext); // Підключення до контексту
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  const [fullz, setFullz] = useState([]);



  useEffect(() => {
          if (!token) {
              navigate("/login");
          } else {
              fetchFullz();
          }
      }, [navigate, token]);
  function fetchFullz() {
        fetch(`http://192.168.0.219:8081/api/full/all_fulls`, {
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
            })
            .catch((error) => {
                console.error("Error fetching user profile:", error);

            });
  }

  const handleAddToCart = (row) => {
    const rowData = {
      id: Date.now(),
      name: row.querySelector('row-name').innerText,
      city: row.querySelector('row-city-zip').innerText,
      state: row.querySelector('row-city-zip').innerText,
      country: row.querySelector('row-city-zip').innerText,
      zip: row.dateset.zip,
      fullAddress: row.dataset.fullAddress,
      phone: row.dateset.phone,
      email: row.dataset.email,
      ownOrRent: row.dateset.ownOrRent,
      yearsAtResidence: row.dataset.yearsAtResidence,
      incomeType: row.dateset.incomeType,
      employer: row.dataset.employer,
      occupation: row.dateset.occupation,
      yearsEmployed: row.dataset.yearsEmployed,
      workPhone: row.dateset.workPhone,
      netMonthlyIncome: row.dataset.netMonthlyIncome,
      creditReport: row.dateset.creditReport,
      creditCard: row.dataset.creditCard,
      checkingAccount: row.dateset.checkingAccount,
      ssn: row.dataset.ssn,
      dob: row.dateset.dob,
      mmn: row.dateset.mmn,
      driverLicense: row.dataset.driverLicense,
      account: row.dateset.account,
      routing: row.dataset.routing,
      creditReportPdf: row.dateset.creditReportPdf,
      personReportPdf: row.dataset.personReportPdf,

      object: row.querySelector('td:nth-child(3)').innerText,
      extraInfo: row.querySelector('td:nth-child(4)').innerText,
      base: row.querySelector('td:nth-child(5)').innerText,
      price: row.querySelector('td:nth-child(6)').innerText,
      category: 'Fullz',
      className: row.className
    };
    addToCart(rowData);

    // Показуємо повідомлення
    setPurchaseMessage(true);

    // Приховуємо повідомлення через 3 секунди
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
                        <label for="first-name">First Name:</label>
                        <input type="text" id="first-name" placeholder="Enter first name"/>
                    </div>
                    <div>
                        <label for="last-name">Last Name:</label>
                        <input type="text" id="last-name" placeholder="Enter last name"/>
                    </div>
                    <div>
                        <label for="state">State:</label>
                        <select id="state">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div>
                        <label for="own-rent">Own / Rent:</label>
                        <select id="own-rent">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    
                    <div className="Fullz-checkbox-group">
                        <label for="phone">Phone</label>
                        <input type="checkbox" id="phone"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="email">Email</label>
                        <input type="checkbox" id="email"/>
                    </div>
                </div>
                
                {/* Second colum */}
                <div className='Fullz-second-colum Fullz-colum'>
                    <div className="Fullz-checkbox-group">
                        <label for="ssn">SSN</label>
                        <input type="checkbox" id="ssn"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="dob">DOB</label>
                        <input type="checkbox" id="dob"/>
                    </div>

                    <div className="Fullz-checkbox-group">
                        <label for="mmn">MMN</label>
                        <input type="checkbox" id="mmn"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="drivers-number">Drivers Number</label>
                        <input type="checkbox" id="drivers-number"/>
                    </div>
                    <div>
                        <label for="dl-state">DL State:</label>
                        <select id="dl-state">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div>
                        <label for="account-number">Account Number:</label>
                        <input type="text" id="account-number" placeholder="Enter account number"/>
                    </div>
                    
                    <div className="Fullz-checkbox-group">
                        <label for="routing-number">Routing Number</label>
                        <input type="checkbox" id="routing-number"/>
                    </div>
                </div>
                
                {/* third colum */}
                <div className='Fullz-third-colum Fullz-colum'>
                    <div>
                        <label for="base">Base:</label>
                        <select id="base">
                            <option value="all">- all -</option>
                        </select>
                    </div>
                    <div>
                        <label for="country">Country:</label>
                        <select id="country">
                            <option value="all">United States</option>
                        </select>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="discounted">Discounted</label>
                        <input type="checkbox" id="discounted"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="credit-report">Credit Report <span title="Info about credit report">&#9432;</span></label>
                        <input type="checkbox" id="credit-report"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                        <label for="credit-report-pdf">Credit Report (PDF) <span title="Info about credit report PDF">&#9432;</span></label>
                        <input type="checkbox" id="credit-report-pdf"/>
                    </div>
                    <div className="Fullz-checkbox-group">
                    <label for="person-report-pdf">Person Report (PDF) <span title="Info about person report">&#9432;</span></label>
                        <input type="checkbox" id="person-report-pdf"/>
                    </div>
                </div>
            </div>
            
            <div className="Fullz-buttons">
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
                {fullz.map((fullz) => (
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
                                    <span className='row-fullAdress'>yes</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Phone:</span>
                                    <span className='row-phone'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Email:</span>
                                    <span className='row-email'>yes</span>
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
                                    <span className='row-ownOrRent'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Years At Residence:</span>
                                    <span className='row-yearsAtResidence'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Income Type:</span>
                                    <span className='row-incomeType'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Employer:</span>
                                    <span className='row-employer'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Occupation:</span>
                                    <span className='row-occupation'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Years Employed:</span>
                                    <span className='row-yearsEmployed'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Work Phone:</span>
                                    <span className='row-workPhone'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Net Monthly Income:</span>
                                    <span className='row-netMonthlyIncome'>no</span>
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
                                    <span className='row-creditReport'>yes</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Credit Card:</span>
                                    <span className='row-creditCard'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Checking Account:</span>
                                    <span className='row-checkingAccount'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>SSN:</span>
                                    <span className='row-ssn'>yes</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>DOB:</span>
                                    <span className='row-dob'>yes</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>MMN:</span>
                                    <span className='row-mmn'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Driver License (NV):</span>
                                    <span className='row-driverLicense'>yes</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Account:</span>
                                    <span className='row-account'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Routing:</span>
                                    <span className='row-routing'>yes</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Extra Info:</span>
                                    <span className='row-extraInfo'>no</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Credit Report (Pdf):</span>
                                    <span className='row-creditReportPdf'>yes</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>Person Report (Pdf):</span>
                                    <span className='row-personReportPdf'>yes</span>
                                </div>
                            </li>
                        </ul>
                        </td>
                        <td>{fullz.base}</td>
                        <td>${fullz.price.toFixed(2)}</td>
                        <td>
                            <button
                                className='shopping-cart'
                                onClick={() => handleAddToCart(fullz)}
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

export default Fullz;
