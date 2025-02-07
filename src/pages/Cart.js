import React, {useContext, useState} from 'react';
import { CartContext } from '../CartContext';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import '../main-page.css';

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Фильтруем элементы по категориям
  const fullzItems = cartItems.filter((item) => item.category === 'Fullz');
  const dumpsItems = cartItems.filter((item) => item.category === 'Dumps');
  const cvv2Items = cartItems.filter((item) => item.category === 'CVV2');
  const username = localStorage.getItem("username"); // предположим, что у вас есть username в localStorage
  const [serverMessage, setServerMessage] = useState('');
  const token = localStorage.getItem("token");
  // Удаление элемента из корзины
  const handleRemove = (id) => {
    removeFromCart(id);
  };





  const handleCheckout = async () => {
    try {
      const sendPostRequest = async (url, idKey, idValue) => {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [idKey]: idValue })
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        return await response.text(); // Возвращаем текст ответа
      };

      const requests = [
        ...fullzItems.map(item =>
            sendPostRequest(`http://192.168.0.219:8081/api/purchase/full/${username}`, "fullId", item.id)
                .then(responseText => {
                  setServerMessage(prev => prev + `Fullz ${item.id}: ${responseText}\n`);
                  handleRemove(item.id); // Удаляем из корзины
                })
        ),
        ...dumpsItems.map(item =>
            sendPostRequest(`http://192.168.0.219:8081/api/purchase/dump/${username}`, "dumpId", item.id)
                .then(responseText => {
                  setServerMessage(prev => prev + `Dump ${item.id}: ${responseText}\n`);
                  handleRemove(item.id); // Удаляем из корзины
                })
        ),
        ...cvv2Items.map(item =>
            sendPostRequest(`http://192.168.0.219:8081/api/purchase/cvv2/${username}`, "cardId", item.id)
                .then(responseText => {
                  setServerMessage(prev => prev + `CVV2 ${item.id}: ${responseText}\n`);
                  handleRemove(item.id); // Удаляем из корзины
                })
        )
      ];

      await Promise.all(requests);
      setServerMessage(prev => prev + "\nAll purchases completed successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      setServerMessage(`An error occurred during checkout: ${error.message}`);
    }
  };




  function getStatusLabel(text) {
    if (!text) return <span style={{ color: "red" }}>No</span>; // Якщо text порожній або undefined, повертаємо "Yes"

    const containsNo = text.toLowerCase().includes("no");
    return <span style={{ color: containsNo ? "red" : "green" }}>{containsNo ? "No" : "Yes"}</span>;
  }

  // Расчёт итоговой суммы
  const calculateTotal = () => {
    return cartItems
        .reduce((total, item) => total + parseFloat(item.price.slice(1)), 0)
        .toFixed(2);
  };

  return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        {serverMessage && (
            <div className="server-message">
              <pre>{serverMessage}</pre>
            </div>
        )}


        {/* Fullz Section */}
        {fullzItems.length > 0 && (
            <div className='cart-section'>
              <h2 className='cart-section-title'>Fullz</h2>
              <table className='Dumps-table'>
                <thead className='Dumps-thead'>
                <tr>
                  <th>Person</th>
                  <th>Object</th>
                  <th>Extra</th>
                  <th>Base</th>
                  <th>Price</th>
                  <th>Remove</th>
                  {/* Новый столбец для кнопки удаления */}
                </tr>
                </thead>
                <tbody className='Fullz-tbody'>
                {fullzItems.map((fullz) => (
                    <tr key={fullz.id} className='Fullz-tbody-tr'>
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
                      {/* Second column */}
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
                              <span className='row-yearsAtResidence'>{getStatusLabel(fullz.yearsAtResidence)}</span>
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
                              <span className='row-netMonthlyIncome'>{getStatusLabel(fullz.netMonthlyIncome)}</span>
                            </div>
                          </li>
                        </ul>
                      </td>
                      {/* Third column */}
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
                              <span className='row-checkingAccount'>{getStatusLabel(fullz.checkingAccount)}</span>
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
                              <span className='row-creditReportPdf'>{getStatusLabel(fullz.creditReportPdf)}</span>
                            </div>
                          </li>
                          <li>
                            <div>
                              <span>Person Report (Pdf):</span>
                              <span className='row-personReportPdf'>{getStatusLabel(fullz.personReportPdf)}</span>
                            </div>
                          </li>
                        </ul>
                      </td>
                      <td><span style={{margin: "0 10px"}}>{fullz.base}</span></td>
                      <td><span
                          className='Fullz-prise'>${parseFloat(fullz.price.replace(/[^0-9.-]+/g, "")).toFixed(2)}</span>
                      </td>
                      <td>
                        <div className="remove-button-container">
                          <button className="remove-button" onClick={() => handleRemove(fullz.id)}>
                            <MdDeleteForever/>
                          </button>
                        </div>
                      </td>
                      {/* Кнопка удаления */}
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}


        {/* Dumps Section */}
        {dumpsItems.length > 0 && (
            <div className='cart-section'>
              <h2 className='cart-section-title'>Dumps</h2>
              <table className="cart-table">
                <thead>
                <tr>
                  <th>Id</th>
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
                  <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {dumpsItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.bin}</td>
                      <td>{item.type}</td>
                      <td>{item.debitCredit}</td>
                      <td>{item.subtype}</td>
                      <td>{item.expDate}</td>
                      <td>{item.track1}</td>
                      <td>{item.billingZip}</td>
                      <td>{item.code}</td>
                      <td>{item.country}</td>
                      <td>{item.address}</td>
                      <td>{item.bank}</td>
                      <td>{item.base}</td>
                      <td>{item.price}</td>
                      <td>
                        <button className="remove-button" onClick={() => handleRemove(item.id)}>
                          <MdDeleteForever/>
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>

            </div>
        )}

        {/* CVV2 Section */}
        {cvv2Items.length > 0 && (
            <div className='cart-section'>
              <h2 className='cart-section-title'>CVV2</h2>
              <table className="cart-table">
                <thead>
                <tr>
                  <th>Id</th>
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
                  <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {cvv2Items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.bin}</td>
                      <td>{item.type}</td>
                      <td>{item.subtype}</td>
                      <td>{item.exp}</td>
                      <td>{item.name}</td>
                      <td>{item.country}</td>
                      <td>{item.state}</td>
                      <td>{item.zip}</td>
                      <td>{item.extra}</td>
                      <td>{item.bank}</td>
                      <td>{item.base}</td>
                      <td>{item.price}</td>
                      <td>
                        <div className="remove-button-container">
                          <button className="remove-button" onClick={() => handleRemove(item.id)}>
                            <MdDeleteForever />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* Cart Summary */}
        <div>
          <p className="cart-total">Total: ${calculateTotal()}</p>
          <div className="cart-actions">
            <button className="cart-link1">
              <Link to="/dumps">Continue Shopping</Link>
            </button>
            <button className="cart-link2" onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      </div>
  );
}

export default Cart;
