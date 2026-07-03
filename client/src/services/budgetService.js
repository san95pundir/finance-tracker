import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/budget`;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getBudgets = () => axios.get(API_URL, getAuthHeader());
export const addBudget = (data) => axios.post(API_URL, data, getAuthHeader());
export const updateBudget = (id, data) => axios.put(`${API_URL}/${id}`, data, getAuthHeader());
export const deleteBudget = (id) => axios.delete(`${API_URL}/${id}`, getAuthHeader());