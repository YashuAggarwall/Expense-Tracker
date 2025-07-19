import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Expense.css"
import { Link } from 'react-router-dom';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const username = sessionStorage.getItem('username');
  const [total, setTotal] = useState(0);
  const [left, setLeft] = useState(0);
  const navigate = useNavigate();


  const fetchExpenses = async () => {
    const res = await axios.get(`http://localhost:5000/expenses/${username}`);
    console.log(res);
    setLeft(res.data.data.length)
    setExpenses(res.data.data);
    setTotal(res.data.total)
  };
  useEffect(() => {

    fetchExpenses();
  }, []);


  const deletebuttonfunction = async (id) => {
    try {
      let response = await axios.delete(`http://localhost:5000/delete/${id}`)
      setLeft((prev) =>
        prev - 1
      )
      if (left === 1) {
        navigate("/add-expense")
      }
      console.log({ left })
      await fetchExpenses()

    }
    catch (e) {
      console.error(e)
    }

  }


  const deleteall= async ()=>{
    const username= sessionStorage.getItem("username");
    console.log()
    await axios.delete(`http://localhost:5000/expense-delete/${username}`)
    navigate("/add-expense")
   
  }

  return (
    <>

      <div className='addbox' >
        <Link to='/add-expense'>
          <button className='olo1'>←</button></Link>


        <h2 className="addhead">Your Expenses</h2>
        <ul className='editul'>
          {expenses.map((exp) => (

            <li className='edit' key={exp._id} >{exp.category}: ₹{exp.price}
              
                <button className='deletebutton' onClick={() => deletebuttonfunction(exp._id)}>X</button>
              

            </li>
          ))}
        </ul>
        <h3 className='llo'>Total Expense:₹{total}</h3>
        <Link to='/add-expense'><button className='olo'>Add Expense</button></Link>
        <br></br>
        <button className='olo' onClick={deleteall}>Clear All Expenses</button>
      </div>
    </>
  );
}

export default ExpenseList;
