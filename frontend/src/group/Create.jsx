import React from 'react'
import "./Create.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Create = () => {
const [name, setName]= useState("");
const [inviteCode, SetInvitecode]= useState("");
const navigate= useNavigate();



const handleSubmit =async (e) => {
    e.preventDefault();
     let id= sessionStorage.getItem("id");
      console.log("Group name:", name);
  console.log("Created by:", id);
  

  if (!name || !id) {
    alert("Please enter group name or login again");
    return;
  }
    try {   
  let response=await axios.post("http://localhost:5000/group",{name,createdBy:id})
  console.log(response)
  if(response.status===200){
    sessionStorage.setItem("inviteCode", response.data.inviteCode)
    SetInvitecode( response.data.inviteCode)
    navigate('/groupchat')
    
  }
}catch (err) {
      alert('Group Not Made');
    }
}


  return (
    <>
    <div className='createbox'>
    <h1>Create your group</h1>
    <form onSubmit={handleSubmit}>
      <input id='ll' type="text" placeholder='Enter group name' onChange={(e)=>{
        setName(e.target.value)
      }} />
      
     
      <button>Submit</button>
      <h3>The invited Code is: {inviteCode}</h3>
    </form>
    </div>
    </>
  )
}

export default Create