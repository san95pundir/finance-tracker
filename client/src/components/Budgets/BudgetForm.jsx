import { useState } from 'react';
import { addBudget } from '../../services/budgetService';

function BudgetForm({ onBudgetAdded }) {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !limit) return;
    await addBudget({ category, limit: Number(limit) });
    setCategory('');
    setLimit('');
    onBudgetAdded(); // parent ko refetch ke liye batao
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="number"
        placeholder="Monthly Limit (₹)"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        required
      />
      <button type="submit">Set Budget</button>
    </form>
  );
}

export default BudgetForm;