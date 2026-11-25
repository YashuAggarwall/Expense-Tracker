import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import PrivateRoute from "./components/PrivateRoute";
import Create from "./group/Create";
import HomePage from "./HomePage/HomePage";
import Join from "./group/Join";
import Add from "./group/Add";
import Dashboard from "./group/Dashboard";
import Divider from "./Divider/Divider";
import Analytics from "./components/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/divider" element={<Divider />} />

        {/* Protected Routes */}
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
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
