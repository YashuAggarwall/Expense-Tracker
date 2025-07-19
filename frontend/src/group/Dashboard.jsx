import { useEffect, useState } from 'react';
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../HomePage/Navbar";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [group, setGroup] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [total, setTotal] = useState(0);
  const [share, setShare] = useState();
  const navigate = useNavigate()

  const inviteCode = sessionStorage.getItem("inviteCode"); // ✅ FIXED — call the function



  const fetchData = async () => {
  
    try {
      const response = await axios.get(`http://localhost:5000/groupchat/${inviteCode}`);

      const group = response.data.group;
      const expenses = response.data.expenses;

      setGroup(group);
      setExpenseList(expenses);

      const totalAmount = expenses.reduce((total, item) => total + item.expense, 0);
      setTotal(totalAmount);

      const numMembers = group.members.length;
      const perPersonShare = totalAmount / numMembers;

      setShare(perPersonShare);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    fetchData();

    const interval = setInterval(fetchData, 1000); // every 5 seconds
    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  const deletebuttonfunction = async (id) => {

    try {
      await axios.delete(`http://localhost:5000/group-delete/${id}`)

      await fetchData()

    }
    catch (e) {
      console.error(e)
    }

  }

  const leavegroup = async () => {
    const ivite = "";
    sessionStorage.setItem("inviteCode", "");
    fetchData();
    navigate('/')

  }







  return (
      <>
        <Navbar />
        <h1 className='kkk'>We Are Here To Manage Your Expenditure</h1>
        <div className="outerboxdash">

          <div className="leftsidedash">
            <div className="upperbutton">
              <Link to='/'>
                <button className='cdc'>Home</button></Link>
              <button className='cdc' onClick={leavegroup}>Leave</button>
            </div>
            <div className="mid">
              <h1>{group.name}</h1>
              <h2>Invite Code: {inviteCode}</h2>
              <h2>Members</h2>
              <ul>
                {group.members && group.members.map((member) => (
                  <li key={member._id}>
                    {member.name || member.email}
                  </li>
                ))}
              </ul>
            </div>
          


          </div>

          <div className="rightsidedash">
            <Link to='/group-expenses'><button className='cdc'>Add Expenses</button></Link>

            <h3>Total Expenses: ₹
              {total}
            </h3>
            <h3>Each share: {share}</h3>



            <h3>Expense Breakdown:</h3>
            <ul className='editul'>
              {expenseList.map((expense) => (
                <li className='edit' key={expense._id}>
                  {expense.paidBy} paid ₹{expense.expense} for {expense.category}
                  <button className='deletebutton' onClick={() => deletebuttonfunction(expense._id)}>X</button>
                </li>

              ))}
            </ul>

          </div>
        </div>
      </>
    );
  };

  export default Dashboard;
