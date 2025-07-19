import React from 'react'
import "./Navbar.css"
import {Link} from "react-router-dom" 

const Navbar = () => {
  return (
    <div className='navbox'>
        <h1>Finance Tracker</h1>
        <div className="rightnav">
          <Link to='/login'>
            <button>Login</button>
            </Link>

            <Link to='/signup'>
            <button>Sign up</button>
            </Link>
        </div>

    </div>
  )
}

export default Navbar