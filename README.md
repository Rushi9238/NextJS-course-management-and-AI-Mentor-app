# 📚 Course Management System with AI Mentor

A **full-stack Course Management System** built with **Next.js 15, TypeScript, Tailwind CSS, Radix UI, and MongoDB**, featuring role-based access control, secure authentication, and AI-powered mentorship.  

This project is developed as part of **Fullstack Developer Fulltime Assignment 1** to showcase proficiency in **Next.js, scalable backend, database integration, secure authentication, and AI integration**.  

---

## 🚀 Features

### 🔐 Authentication & Role Management
- Secure authentication using **JWT tokens** (with refresh support).  
- Passwords hashed using **bcryptjs**.  
- Role-based access control:
  - **Admin** → Manage users, assign roles, manage all courses.  
  - **Instructor** → Create/manage only their own courses.  
  - **Student** → Explore courses, enroll/unenroll, interact with AI mentor.  

### 📚 Course Management (CRUD)
- **Admin**
  - Add / Update / Delete courses.  
  - Assign instructors to courses.  
- **Instructor**
  - Create and manage only their own courses.  
- **Student**
  - Browse and filter courses by category/difficulty.  
  - Enroll / Unenroll in courses.  

### 👥 User Management (CRUD)
- **Admin** → Add, Edit, and Remove users; assign roles.  
- **Students** → Update only their own profile.  

### 🎓 Enrollment Tracking
- **Student Dashboard** → View enrolled courses.  
- **Instructor Dashboard** → See enrolled students for their courses.  

### 🤖 AI Mentor (Gemini Integration)
- Real-time **AI chatbot** for course-related Q&A.  
- AI suggests **next course recommendations** based on student enrollments.  
- Chat history stored in database **timeline-wise** for reference.  

---

## 🛠 Tech Stack

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/) (with API routes, SSR, SSG)  
- **UI**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)  
- **Database**: [MongoDB](https://www.mongodb.com/) with Prisma/ODM  
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs (password hashing)  
- **AI**: [Gemini AI API](https://ai.google.dev/gemini-api)  
- **Hosting**: [Vercel](https://vercel.com/)  
- **Version Control**: Git + GitHub  

---
## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd course-management-system
```
## Install Dependencies
npm install
# or
yarn install

### Run the Development Server
npm run dev
Open http://localhost:3000
 in your browser.

### 5️⃣ Build & Deploy
npm run build
npm start
Deployed on Vercel → Live [Demo Link](https://next-js-course-management-and-ai-me.vercel.app/)

### 🔐 Security Highlights
JWT-based authentication with refresh strategy.
Passwords hashed using bcryptjs.
Protected API routes via Next.js middleware.
Input validation & sanitization using Zod.










