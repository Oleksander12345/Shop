import React, { useState } from "react";
import TableOne from "./TableDump";
import TableCvv from "./TableCvv";
import TableFull from "./TableFull";

function Orders() {
  const [activeTab, setActiveTab] = useState(0); // Стан для активної вкладки

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="Orders-container">
      <div className="OrdersPage">
          <h1>Orders</h1>
          {/* Вкладки для перемикання */}
          <div className="tabs">
            <button
              className={activeTab === 0 ? "active" : ""}
              onClick={() => handleTabChange(0)}
            >
              Dumps
            </button>
            <button
              className={activeTab === 1 ? "active" : ""}
              onClick={() => handleTabChange(1)}
            >
              CVV2
            </button>
            <button
              className={activeTab === 2 ? "active" : ""}
              onClick={() => handleTabChange(2)}
            >
              Fullz
            </button>
          </div>

          {/* Контент таблиць */}
          <div className="table-container">
            {activeTab === 0 && <TableOne />}
            {activeTab === 1 && <TableCvv />}
            {activeTab === 2 && <TableFull />}
          </div>
      </div>
    </div>
    
  );
}

export default Orders;