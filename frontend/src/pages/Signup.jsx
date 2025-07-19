import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Signup.css"

function Signup() {
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', form);
      navigate('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (<>
  <div class="background-bubbles">
  <span></span><span></span><span></span><span></span><span></span>
</div>

    <div className='signupbox'>
       <h1>Sign Up</h1>
    <form onSubmit={handleSubmit} className="signform">
     
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange}  />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" />
      <button type="submit" >Sign Up</button>
    </form>
<h3>Already have a Account</h3>
<a className='signupa' href="/login">Login</a>
    </div>
    </>
  );
}

export default Signup;
