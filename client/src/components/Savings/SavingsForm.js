import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const SavingsForm = ({ onSaved }) => {
  const { token } = useAuth();
  const [targetAmount, setTargetAmount] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/savings`,
        { targetAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Goal saved! ✅');
      setTargetAmount('');
      onSaved();
    } catch (err) {
      setMsg('Error saving goal ❌');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="number"
        placeholder="Set Savings Target (₹)"
        value={targetAmount}
        onChange={e => setTargetAmount(e.target.value)}
        style={styles.input}
        required
      />
      <button type="submit" style={styles.btn}>Set Goal</button>
      {msg && <p style={styles.msg}>{msg}</p>}
    </form>
  );
};

const styles = {
  form: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' },
  input: { padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', flex: 1 },
  btn: { padding: '0.6rem 1.2rem', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  msg: { color: '#43b89c', margin: 0 }
};

export default SavingsForm;