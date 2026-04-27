# Master Mind Classes - Production Ready

Efficiently manage your institute's website, faculty, and student registrations through this integrated Node.js and React application.

## 🚀 Key URLs

Once the server is running, you can access the application at:

*   **Main Website**: [http://localhost:5000](http://localhost:5000)
*   **Admin Dashboard**: [http://localhost:5000/admin/login](http://localhost:5000/admin/login)

---

## 🔐 Administrative Access



> [!TIP]
> Always keep your `JWT_SECRET` secure in the `backend/.env` file. Do not share your administrative password.

---

## 🛠️ How to Run Locally

### 1. Start the Backend (Production/Integrated Mode)
Navigate to the `backend` folder and start the server:
```bash
cd backend
npm run dev
```
*This serves both the API and the optimized frontend bundle at port 5000.*

### 2. Start the Frontend (Development Mode)
If you need to make code changes to the UI with Hot Module Replacement (HMR):
```bash
cd frontend
npm run dev
```
*Access the dev server at http://localhost:5173*.

---

## 🏗️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express 5.
- **Database**: MySQL (using `mysql2` pool).
- **Security**: JWT Authentication, Bcrypt Password Hashing.
