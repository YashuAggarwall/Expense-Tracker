import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [invite, setInvite] = useState("");
  const navigate= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
      const id = sessionStorage.getItem("id");
      const inviteCode = invite.trim();
    try {
        const groupRes = await axios.get(`http://localhost:5000/groupchat/${inviteCode}`);
    const group = groupRes.data.group;

    const alreadyMember = group.members.includes(id);
    
    if (alreadyMember) {
      sessionStorage.setItem("inviteCode", inviteCode);
      navigate("/groupchat");
      return;
    }
      
      const response = await axios.post(
        `http://localhost:5000/join-group/${invite}`,
        { memberID: id }
      );
      console.log(response)
     
     
      if (response.status === 200) {
        sessionStorage.setItem("inviteCode", invite);
        navigate('/groupchat')
      }
    } catch (err) {
      console.error(err);
  
      alert("Something went wrong");
      

    }
  };

  return (
    <div className="createbox">
      <h1>Enter Group</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="ll"
          type="text"
          placeholder="Enter group invite code"
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
        />
        <button type="submit" disabled={!invite}>Submit</button>
      </form>
    </div>
  );
};

export default Join;
