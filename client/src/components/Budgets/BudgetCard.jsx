function BudgetCard({ category, limit, spent }) {
  const percent = Math.min((spent / limit) * 100, 100);
  const isOverBudget = spent > limit;
  const isWarning = percent >= 80 && !isOverBudget;

  return (
    <div className="budget-card">
      <div className="budget-card-header">
        <span>{category}</span>
        <span>₹{spent} / ₹{limit}</span>
      </div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: isOverBudget ? '#e74c3c' : isWarning ? '#f39c12' : '#2ecc71'
          }}
        />
      </div>
      {isOverBudget && <p className="warning-text">⚠️ Budget exceeded!</p>}
    </div>
  );
}

export default BudgetCard;