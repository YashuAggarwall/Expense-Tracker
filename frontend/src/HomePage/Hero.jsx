import React from 'react'
import "./Hero.css"
import { Link } from 'react-router-dom'
const Hero = () => {


  const logoufunc=(e)=>{
    sessionStorage.removeItem("token")
    alert("User Logged out")
  }



  return (
    <div className='trackflex'>
        <div className="leftside">
            <h1>Track Every Rupee,Together.</h1>
            <h2>Every rupee matters — watch it closely.</h2>
            <Link to='/add-expense'>
            <button>Add Expenses</button>
            </Link>

        </div>
        <div className="rightside">
          <h1>Group Spending, Made Clear</h1>
          <h2>You spend, We Track</h2>
          <div className='herobutton'> 
          <Link to='/group'>
            <button>Create Group</button>
            </Link>
            <Link to='join-group'>
          <button>Join a group</button>
          </Link>
          </div>
          </div>
          <div className="thirdbox">
          <h1>Bill Divider</h1>
          
          <Link to='/divider'>
          <button>Calculate</button>
          </Link>
          </div>
          
        
        <div className='logbox'>
          <button className='logout' onClick={logoufunc}>Log Out</button>
        </div>
        
           </div>
  )
}

export default Hero