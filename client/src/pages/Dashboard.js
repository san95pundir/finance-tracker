import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import SavingsSection from '../components/Savings/SavingsSection';
import BudgetSection from '../components/Budgets/BudgetSection';

const COLORS = ['#6c63ff', '#ff6584', '#43b89c', '#f9a825', '#ef5350', '#42a5f5', '#ab47bc', '#26a69a'];

const categories = ['eating', 'stationery', 'travel', 'personal', 'work', 'shopping', 'gifts', 'entertainment', 'emi_rent', 'savings'];

const Dashboard = ({ onLogout }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [categorySummary, setCategorySummary] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'eating', note: '' });

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data.transactions);
      setSummary(res.data.summary);

      const catRes = await axios.get('http://localhost:5000/api/transactions/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorySummary(catRes.data.summary);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ type: 'expense', amount: '', category: 'eating', note: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>💰 Finance Tracker</h2>
        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardRow}>
        <div style={{...styles.card, borderLeft: '4px solid #43b89c'}}>
          <p style={styles.cardLabel}>Total Income</p>
          <h3 style={{color:'#43b89c'}}>₹{summary.totalIncome}</h3>
        </div>
        <div style={{...styles.card, borderLeft: '4px solid #ef5350'}}>
          <p style={styles.cardLabel}>Total Expense</p>
          <h3 style={{color:'#ef5350'}}>₹{summary.totalExpense}</h3>
        </div>
        <div style={{...styles.card, borderLeft: '4px solid #6c63ff'}}>
          <p style={styles.cardLabel}>Balance</p>
          <h3 style={{color:'#6c63ff'}}>₹{summary.balance}</h3>
        </div>
      </div>

      {/* Add Transaction Button */}
      <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
        {showForm ? 'Cancel' : '+ Add Transaction'}
      </button>

      {/* Add Transaction Form */}
      {showForm && (
        <div style={styles.form}>
          <form onSubmit={handleAdd}>
            <select style={styles.input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input style={styles.input} type="number" placeholder="Amount (₹)" value={form.amount}
              onChange={e => setForm({...form, amount: e.target.value})} required />
            <select style={styles.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <input style={styles.input} type="text" placeholder="Note (optional)" value={form.note}
              onChange={e => setForm({...form, note: e.target.value})} />
            <button style={styles.submitBtn} type="submit">Add</button>
          </form>
        </div>
      )}

      {/* Charts */}
      {categorySummary.length > 0 && (
        <div style={styles.chartRow}>
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Spending by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categorySummary} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={80}>
                  {categorySummary.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Category Wise Bar Chart</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categorySummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="total" fill="#6c63ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div style={styles.listBox}>
        <h4 style={styles.chartTitle}>This Month's Transactions</h4>
        {transactions.length === 0 ? (
          <p style={{color:'#999', textAlign:'center'}}>No transactions yet — add one!</p>
        ) : (
          transactions.map(t => (
            <div key={t._id} style={styles.transactionItem}>
              <div>
                <span style={{fontWeight:'bold', color: t.type === 'income' ? '#43b89c' : '#ef5350'}}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount}
                </span>
                <span style={styles.category}> {t.category}</span>
                {t.note && <span style={styles.note}> — {t.note}</span>}
              </div>
              <button onClick={() => handleDelete(t._id)} style={styles.deleteBtn}>🗑</button>
            </div>
          ))
        )}
      </div>

      {/* Budget Section */}
      <BudgetSection transactions={transactions} />
     <SavingsSection balance={summary.balance} />
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  headerTitle: { color: '#6c63ff' },
  logoutBtn: { padding: '0.5rem 1rem', background: '#ef5350', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  cardRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  card: { flex: 1, background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', minWidth: '150px' },
  cardLabel: { color: '#999', fontSize: '0.85rem', marginBottom: '0.3rem' },
  addBtn: { padding: '0.7rem 1.5rem', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem', fontSize: '1rem' },
  form: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  input: { width: '100%', padding: '0.7rem', marginBottom: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '0.7rem', background: '#43b89c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  chartRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  chartBox: { flex: 1, background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', minWidth: '300px' },
  chartTitle: { color: '#333', marginBottom: '1rem' },
  listBox: { background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  transactionItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: '1px solid #f0f0f0' },
  category: { color: '#6c63ff', fontSize: '0.9rem' },
  note: { color: '#999', fontSize: '0.85rem' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }
};

export default Dashboard;