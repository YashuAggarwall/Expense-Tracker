import React, { useEffect, useState } from 'react'
import "./Divider.css"
import axios from "axios"
import { Link } from 'react-router-dom';

const Divider = () => {
    const [amount, setAmount]= useState(0);
    const [tip,setTip]=useState(0);
    const[tipshare,setTipshare]=useState(0);
    const[amountshare, setAmountshare]=useState(0);
    const [member, setMember]= useState(0);


    const handleSubmit=async (e)=>{
        e.preventDefault();

       let response= await axios.post("http://localhost:5000/divider",{amount,tip, member})
       console.log(response);
        if(response.status===200){
            setAmountshare(response.data.amountShare);
            setTipshare(response.data.tipShare)
           
        }
    }


    const handleadd= async()=>{
        const category="Divide Calculator"
        let totalshare=amountshare+tipshare;
        const username=sessionStorage.getItem("username")
        try{
            let response= await axios.post("http://localhost:5000/add-expense",{category: category,price:totalshare,username:username })
            alert('Expense added');
        }catch(e){
            console.error(e)
            alert("Not Added")
        }
    }

  

    return (
        <>
            <div className="calbox">
                <div className="calchead">
                    <h1>Bill Divider</h1>
                    <h2>We are here to split equally</h2>

                </div>
                <div className="inputbox">
                    <input type="number" 
                    placeholder='Enter Amount'
                    name='amoun'
                    // value={amount} 
                    onChange={(e)=>{
                        setAmount(e.target.value)
                    }} />


                <input type='number' 
                placeholder='Enter Tip'
                // value={tip} 
                name='ti'
                onChange={(e)=>{
                        setTip(e.target.value)
                    }}/>


                <input type="number" 
                placeholder='Enter number of members' 
                // value={member}
                name='membe'
                onChange={(e)=>{
                    setMember(e.target.value)
                }}/>
                <button className='calbutton' 
                onClick={handleSubmit}>
                    Calculate
                    </button>
                </div>  
                <div className="lowbox">
                    <h2>Total Amount: ₹{amount}</h2>
                    <h2>Bill per person: ₹{amountshare}</h2>
                    <h3>Total Tip: ₹{tip}</h3>
                    <h3>Tip Per Person: ₹{tipshare}</h3>
                    
                </div>
                <div className="expaddbox">
                    <Link onClick={handleadd}>
                    <button>
                        Add to Expense
                    </button>
                    </Link>
                </div>
                
            </div>
        </>
    )
}

export default Divider