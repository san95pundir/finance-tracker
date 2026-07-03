import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const SavingsForm = ({ onSaved }) => {
  const { token } = useAuth();
  const [targetAmount, setTargetAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
`http://localhost:5000/api/savings`,
        { month, year, targetAmount: Number(targetAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTargetAmount('');
      onSaved();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        style={styles.input}
        type="number"
        placeholder="Savings target this month (₹)"
        value={targetAmount}
        onChange={e => setTargetAmount(e.target.value)}
        required
      />
      <button style={styles.btn} type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Set Goal'}
      </button>
    </form>
  );
};

const styles = {
  form: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  input: { padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', flex: 1 },
  btn: { padding: '0.6rem 1rem', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default SavingsForm;