import React, { useState, useRef, useEffect, useContext } from 'react';
import { HiShoppingCart } from "react-icons/hi";
import { CartContext } from '../CartContext';
import { useNavigate } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";

function TableFull() {
  const [isChecked, setIsChecked] = useState(false);
  const buttonContainerRef = useRef(null);
  const [purchaseMessage, setPurchaseMessage] = useState(false);
  // const [setPurchaseMessage] = useState(false);
  // const [priceRange, setPriceRange] = useState(1);
  const { addToCart } = useContext(CartContext);
  const token = localStorage.getItem("token")
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [fullz, setFullz] = useState([]); // Состояние для хранения данных
  const { cartItems } = useContext(CartContext);

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
  function getStatusLabel(text) {
    if (!text) return <span style={{ color: "red" }}>No</span>; // Якщо text порожній або undefined, повертаємо "Yes"

    const containsNo = text.toLowerCase().includes("no");
    return <span style={{ color: containsNo ? "red" : "green" }}>{containsNo ? "No" : "Yes"}</span>;
  }
  
  function fetchFullz() {
    fetch(`http://localhost:8081/api/dumps/${username}/full`, {
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

  const handleAddToCart = (fullzItem) => {
    if (isItemInCart(fullzItem.id)) return;
    const rowData = {
        ...fullzItem,
        price: `$${fullzItem.price.toFixed(2)}`,
        category: 'Fullz'
    };

    addToCart(rowData);
    setPurchaseMessage(true);

    setTimeout(() => {
        setPurchaseMessage(false);
    }, 3000);
  };

  return (
    <main className='Orders-main'>
       <h1 className='page-title'>Fullz</h1>
               {purchaseMessage && (
                 <div className="purchase-message">
                   Purchase completed successfully!
                 </div>
               )}
       
               {/* <div className="Fullz-form-container">
               </div> */}
       
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
                   
      </main>
  );
}

export default TableFull;
