# 🧠 Learning Management System (LMS)

A modern Learning Management System (LMS) built with **React** (Vite) for the frontend and **Django REST Framework** for the backend. The platform supports student and teacher roles, user authentication, course management, and enrollment.

---

## 🚀 Features

- 🔐 JWT-based user authentication (Login & Register)
- 👨‍🏫 Role-based dashboards (Student & Teacher)
- 📚 Course creation (teacher only)
- ✅ Course enrollment (student only)
- 📖 Lesson and material upload per course
- 📈 Track lesson completion and course progress
- 🎨 Clean UI using Tailwind CSS + ShadCN components

---

## 🛠️ Tech Stack

| Frontend              | Backend                |
|-----------------------|------------------------|
| React (Vite)          | Django + DRF           |
| React Router          | Django REST Framework  |
| Zustand (state)       | JWT Authentication     |
| Tailwind CSS          | PostgreSQL / SQLite    |
| ShadCN UI             | Swagger API Docs       |

---

## ⚙️ Installation

### 1. Backend (Django)

```bash
cd lms-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend (React + Vite)

```bash
cd lms-frontend
npm install
npm run dev
```

> 🔑 Ensure the `BASE_URL` in your frontend project points to your Django backend (e.g. `http://127.0.0.1:8000`)

---

## ✅ Authentication Flow

- Users can **sign up** as either `student` or `teacher`
- Upon login, users are redirected to their respective dashboards:
  - `/student/dashboard`
  - `/teacher/dashboard`

---

## 🧪 API Documentation

Available at: `http://127.0.0.1:8000/swagger/` (powered by drf-yasg)

---

## 🤝 Contributing

Pull requests are welcome! Feel free to submit bug reports or feature requests.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Author

Built with 💻 by [cryptic0053](https://github.com/cryptic0053)
