import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
const API_URL = process.env.REACT_APP_API_URL;
const BudgetSection = ({ transactions }) => {
  const { token } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('eating');
  const [limitAmount, setLimitAmount] = useState('');
  const [msg, setMsg] = useState('');

  const categories = ['eating', 'stationery', 'travel', 'personal', 'work', 'shopping', 'gifts', 'entertainment', 'emi_rent', 'savings'];

const fetchBudgets = async () => {
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const res = await axios.get(
     `${API_URL}/api/budgets?month=${month}&year=${year}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // limits object ko array mein convert karo
    const limits = res.data.budget?.limits || {};
    const budgetArray = Object.entries(limits)
      .filter(([_, val]) => val > 0)
      .map(([category, limitAmount]) => ({ category, limitAmount }));
    setBudgets(budgetArray);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      await axios.post(
       `${API_URL}/api/budgets`,
        { category, limitAmount, month, year },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Budget set! ✅');
      setLimitAmount('');
      fetchBudgets();
    } catch (err) {
      setMsg('Error ❌');
    }
  };

  // Calculate spent per category from transactions
  const getSpent = (cat) => {
    return Math.round(transactions
      .filter(t => t.category === cat && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>📊 Budget Manager</h4>

      <form onSubmit={handleSubmit} style={styles.form}>
        <select style={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Set Limit (₹)"
          value={limitAmount}
          onChange={e => setLimitAmount(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.btn}>Set Budget</button>
        {msg && <p style={styles.msg}>{msg}</p>}
      </form>

      {budgets.map(b => {
        const spent = getSpent(b.category);
        const percent = Math.min(Math.round((spent / b.limitAmount) * 100), 100);
        const color = percent >= 100 ? '#ef5350' : percent >= 70 ? '#f9a825' : '#43b89c';
        return (
          <div key={b.category} style={styles.budgetItem}>
            <div style={styles.budgetHeader}>
              <span style={styles.catName}>{b.category}</span>
              <span style={{ color }}>₹{spent} / ₹{b.limitAmount}</span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${percent}%`, background: color }} />
            </div>
            {percent >= 100 && <p style={styles.alert}>⚠️ Budget exceeded!</p>}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: { background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  title: { color: '#333', marginBottom: '1rem' },
  form: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' },
  input: { padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  btn: { padding: '0.6rem 1.2rem', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  msg: { color: '#43b89c', margin: 0 },
  budgetItem: { marginBottom: '1rem' },
  budgetHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' },
  catName: { fontWeight: 'bold', color: '#555', textTransform: 'capitalize' },
  barBg: { background: '#f0f0f0', borderRadius: '8px', height: '10px' },
  barFill: { height: '10px', borderRadius: '8px', transition: 'width 0.4s ease' },
  alert: { color: '#ef5350', fontSize: '0.85rem', margin: '0.2rem 0 0' }
};

export default BudgetSection;