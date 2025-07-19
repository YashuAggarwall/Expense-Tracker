import React, { useState } from 'react';
import axios from 'axios';
import "./Signup.css"
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', form);
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('username', res.data.username);
      sessionStorage.setItem('id', res.data.id);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className='signupbox'>
       <h1>LogIn</h1>
    <form onSubmit={handleSubmit} className="signform">
      <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 border" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" />
      <button type="submit" className="bg-green-500 text-white px-4 py-2">Login</button>
    </form>
    <h3 className='lllll'>Doesnot have a Account</h3>
<a className='signupa' href="/signup">Sign Up</a>
    </div>
  );
}

export default Login;
