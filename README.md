# 💸 Expense Tracker – Full Stack App (MERN + Vite)

A complete full-stack application for tracking individual and group expenses. Built using the **MERN stack** with a **Vite-powered React frontend** and an **Express/MongoDB backend**. Users can add, edit, and delete expenses, create or join groups via invite codes, and split bills using the built-in calculator.

---

## 🚀 Features

### 👤 User
- Signup/Login with JWT authentication
- Add/Edit/Delete personal expenses
- View total spending per user

### 👥 Group
- Create groups with unique invite codes
- Join existing groups via invite link
- Add group expenses
- View members and shared expense logs

### 🧮 Utility
- Bill divider calculator (split amount & tip equally)

---

## 🛠 Tech Stack

| Layer     | Tech                     |
|-----------|--------------------------|
| Frontend  | React (Vite), Tailwind CSS |
| Backend   | Node.js, Express         |
| Database  | MongoDB, Mongoose        |
| Auth      | JWT, bcrypt              |
| Tools     | nanoid, dotenv, CORS     |
| Testing   | Jest, Supertest          |

---

## 📁 Project Structure

Expense-Tracker/
├── backend/
│ ├── _tests/
│ ├── models/
│ ├── server.js
│ ├── .env
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ ├── vite.config.js
│ ├── index.html
│ └── package.json



---

## ⚙️ Setup Instructions



```bash
git clone https://github.com/YashuAggarwall/Expense-Tracker.git
cd Expense-Tracker


2. Setup Backend
cd backend
npm install

Create a .env file inside backend/:
MongooseUri=your_mongodb_connection_string
secret=your_jwt_secret_key

Start the backend server:
npm start
Runs on http://localhost:5000

3. Setup Frontend
cd ../frontend
npm install
npm run dev
Runs on http://localhost:5173 (default Vite port)

🧪 Running Tests (Backend)
cd backend
npm test
Uses Supertest + Jest for API testing.

📬 API Endpoints (Backend)
🔐 Authentication
POST /signup – Register user
POST /login – Login user

📊 Personal Expenses
POST /add-expense
GET /expenses/:username
PUT /expense-edit/:id
DELETE /delete/:id
DELETE /expense-delete/:username

👥 Group Management
POST /group – Create group
POST /join-group/:inviteCode – Join group
POST /group-expenses/:invitelink – Add group expense
GET /groupchat/:inviteCode – View group
DELETE /group-delete/:id – Delete group expense

🧮 Calculator
POST /divider – Split bill among members

