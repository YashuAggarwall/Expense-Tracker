import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Add.css';

const Add = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expense, setExpense] = useState('');
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invite = sessionStorage.getItem("inviteCode");
      const paidBy = sessionStorage.getItem("id");

      const response = await axios.post(
        `http://localhost:5000/group-expenses/${invite}`,
        { paidBy, expense, category, description }
      );

      if (response.data.success) {
        navigate("/groupchat")
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    }
  };

  return (
    <div className='addouter'>
      <h2>Enter Expenses</h2>
      <form onSubmit={handleSubmit} className='addform'>
        <input
          type="text"
          placeholder='Enter category'
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder='Enter Description'
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder='Enter Expense'
          value={expense}
          onChange={e => setExpense(e.target.value)}
        />
        
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default Add;
