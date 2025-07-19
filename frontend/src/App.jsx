import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import PrivateRoute from "./components/PrivateRout";
import Create from "./group/Create";
import HomePage from "./HomePage/HomePage";
import Join from "./group/Join";
import Add from "./group/Add";
import Dashboard from "./group/Dashboard";
import Divider from "./Divider/Divider";
function App() {
  return (
    <Router>
      
 <Routes>
  <Route path="/" element={<HomePage /> } /> 
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/divider" element={<Divider />} />

  <Route
    path="/add-expense"
    element={
      <PrivateRoute>
        <AddExpense />
      </PrivateRoute>
    }
  />

  <Route
    path="/expenses"
    element={
      <PrivateRoute>
        <ExpenseList />
      </PrivateRoute>
    }
  />

  

<Route
    path="/group"
    element={
      <PrivateRoute>
        <Create />
      </PrivateRoute>
    }
  />


<Route
    path="/join-group"
    element={
      <PrivateRoute>
        <Join />
       </PrivateRoute>
    }
  />

  <Route
    path="/groupchat"
    element={
      <PrivateRoute>
        <Dashboard />
       </PrivateRoute>
    }
  />

  <Route 
  path="/group-expenses"
  element={
  <PrivateRoute>
    <Add />
  </PrivateRoute>
  }
  />

  <Route 
  path="/group-expenses"
  element={
  <PrivateRoute>
    <Add />
  </PrivateRoute>
  }
  />




  



</Routes>





    </Router>
  );
}

export default App;