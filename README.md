# 💸 Expense Tracker API

A backend API built with **Node.js**, **Express**, and **MongoDB** for managing personal and group expenses. Supports user authentication, individual expense tracking, group expense sharing, and a bill-splitting calculator.

---

## 🚀 Features

- 🔐 User Signup & Login with JWT Authentication
- 📊 Add / Edit / Delete / View Personal Expenses
- 👥 Create & Join Groups with Invite Codes
- 💰 Add Group Expenses with Automatic Member Split
- 🧮 Bill Splitter Calculator
- 🧪 Tested with Supertest

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- bcrypt
- dotenv
- nanoid
- CORS
- Supertest (for testing)

---

🔐 Environment Variables
Create a .env file in the root directory and add:
MongooseUri=your_mongodb_connection_string
secret=your_jwt_secret

---

🚀 Running the Server 
npm start
Server runs on http://localhost:5000

---

🧪 Running Tests
npm test

---  

📬 API Endpoints
Auth
POST /signup
POST /login

Individual Expenses
POST /add-expense
GET /expenses/:username
PUT /expense-edit/:id
DELETE /delete/:id
DELETE /expense-delete/:username

Groups
POST /group — create a group
POST /join-group/:inviteCode — join with code
POST /group-expenses/:invitelink — add group expense
GET /groupchat/:inviteCode — get group details
DELETE /group-delete/:id — delete group expense

Calculator
POST /divider — split amount & tip among members

---

## 📦 Installation

```bash
git clone https://github.com/YashuAggarwall/Expense-Tracker.git
cd Expense-Tracker
npm install
