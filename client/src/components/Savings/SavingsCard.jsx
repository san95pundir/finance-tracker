const SavingsCard = ({ goal, balance }) => {
  if (!goal) return null;

  const saved = Math.max(balance, 0);
  const percent = Math.min((saved / goal.targetAmount) * 100, 100);
  const isAchieved = saved >= goal.targetAmount;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.label}>Monthly Savings Goal</span>
        <span style={{ color: isAchieved ? '#43b89c' : '#333' }}>
          ₹{saved} / ₹{goal.targetAmount}
        </span>
      </div>
      <div style={styles.barBg}>
        <div style={{
          ...styles.barFill,
          width: `${percent}%`,
          background: isAchieved ? '#43b89c' : percent >= 70 ? '#f9a825' : '#6c63ff'
        }} />
      </div>
      <p style={styles.status}>
        {isAchieved ? '🎉 Goal achieved!' : `${Math.round(percent)}% complete`}
      </p>
    </div>
  );
};

const styles = {
  card: { background: '#f9f9f9', padding: '1rem', borderRadius: '8px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  label: { fontWeight: '500', color: '#555' },
  barBg: { background: '#eee', borderRadius: '4px', height: '8px', marginBottom: '0.5rem' },
  barFill: { height: '8px', borderRadius: '4px', transition: 'width 0.3s' },
  status: { fontSize: '0.85rem', color: '#666', margin: 0 }
};

export default SavingsCard;