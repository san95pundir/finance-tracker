import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import SavingsForm from './SavingsForm';
import SavingsCard from './SavingsCard';

const SavingsSection = ({ balance }) => {
  const { token } = useAuth();
  const [goal, setGoal] = useState(null);

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

const fetchGoal = async () => {
  try {
     const storedToken = localStorage.getItem('token');
    const res = await axios.get(
      `http://localhost:5000/api/savings?month=${month}&year=${year}`,
      { headers: { Authorization: `Bearer ${storedTcdoken}` } }
    );
    console.log('Savings response:', res.data); // YEH ADD KARO
    setGoal(res.data.goal);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchGoal();
  }, []);

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>🐷 Savings Goal</h4>
      <SavingsForm onSaved={fetchGoal} />
      <SavingsCard goal={goal} balance={balance} />
    </div>
  );
};

const styles = {
  container: { background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  title: { color: '#333', marginBottom: '1rem' }
};

export default SavingsSection;