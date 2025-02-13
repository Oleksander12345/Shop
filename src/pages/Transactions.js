import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchTransactions();
    }
  }, [navigate, token]);

  const fetchTransactions = () => {
    fetch("http://localhost:8081/api/admin/get-all-transactions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.error || "Failed to fetch transactions");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched transactions:", data);
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setMessage("Failed to load transactions. Please try again.");
      });
  };

  return (
    <main className="transaction-panel">
      <div className="transaction-container">
        <h1 className="transaction-title">Transactions</h1>

        {message && <p className="error-message">{message}</p>}

        <div className="transaction-list">
          <h2>Transaction History</h2>
          {transactions.length > 0 ? (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Transaction</th>
                  <th>Crypto Currency</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td>{transaction.transactionId}</td>
                    <td>{transaction.username}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.cryptocurrency}</td>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>

        {/* Додано кнопку повернення до адмін-панелі */}
        <div className="transaction-actions">
          <button className="btn btn-back" onClick={() => navigate("/admin")}>
            Back to Admin Panel
          </button>
        </div>
      </div>
    </main>
  );
}

export default Transactions;
