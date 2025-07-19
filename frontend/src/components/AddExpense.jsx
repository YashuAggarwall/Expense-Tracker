import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AddExpense() {
  const [form, setForm] = useState({ category: '', price: '' });
  const username = sessionStorage.getItem('username');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
    
      await axios.post('http://localhost:5000/add-expense', { ...form, username });
      alert('Expense added');
      setForm({ category: '', price: '' })
    } catch (err) {
      alert('Failed to add expense');
    }
    
      
  };

  return (
    <>
    
    <div className='signupbox'>
      <Link to="/"><button className='olo'>Home</button>
     </Link>
      
    <form onSubmit={handleSubmit} className="signform" >
      <h1>Expenses</h1>
      <input name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 border" value={form.category}/>
      <input name="price" placeholder="Price" onChange={handleChange} className="w-full p-2 border" value={form.price} />
      <button type="submit" >Add Expense</button>
      <Link to="/expenses"><button>See Expenses</button></Link>

      

    </form>
    </div>
    </>
  );
}

export default AddExpense;
