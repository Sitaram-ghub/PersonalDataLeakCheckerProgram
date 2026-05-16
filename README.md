# 🛡️ Personal Data Leak Checker (Pro Edition)

**Live Demo:** [https://personaldataleakcheckerprogram.onrender.com](https://personaldataleakcheckerprogram.onrender.com)

A full-stack, privacy-centric security platform designed to audit personal credentials, detect data breaches, and analyze security habits using a **Local Heuristic Intelligence Engine**.

---

## 🚀 Key Advantages

- **Zero-Trust Privacy**: All analysis (Password strength, pattern detection, privacy audit) happens locally on your machine. No data is sent to external AI providers.
- **Real-Time Analytics**: Instant feedback on password complexity and predictable patterns (Keyboard sequences, common keywords).
- **Comprehensive Audit**: Evaluates security habits like 2FA usage and password reuse to provide a dynamic Privacy Score.
- **Cyber-Tech UI**: A futuristic, high-contrast dark theme designed with modern UX principles (Glassmorphism, Neon-accented UI).

---

## 🛠️ Technical Architecture

### **Frontend (The Interface)**
- **Framework**: React.js with Vite for lightning-fast HMR.
- **Styling**: Tailwind CSS & Framer Motion for smooth, high-fidelity animations.
- **Icons**: Lucide-React for crisp, scalable security iconography.

### **Backend (The Core)**
- **Framework**: Python Flask (RESTful API).
- **Auth**: JWT (JSON Web Tokens) with Bcrypt password hashing.
- **Engine**: Custom Heuristic Security Engine using advanced Regex and logic.
- **Database**: SQLite with SQLAlchemy ORM for reliable data persistence.

---

## ⚙️ Installation & Setup

### **1. Prerequisites**
- Python 3.8+
- Node.js 16+

### **2. Backend Setup**
```bash
cd server
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### **3. Frontend Setup**
```bash
cd client
npm install
npm run dev
```

---

## 📂 Project Structure

```text
├── client/                 # React application source
│   ├── src/components/     # Shared UI components
│   ├── src/pages/          # Main dashboard & scanner pages
│   └── src/services/       # API communication layer
├── server/                 # Flask backend source
│   ├── routes/             # API endpoints (Auth, Security, History)
│   ├── models.py           # Database schema
│   └── app.py              # Application entry point
└── .gitignore              # Production-ready exclusion rules
```

---

## 📜 Educational Purpose

This project was developed as a showcase for **Full-Stack Security Engineering**. It demonstrates expertise in building secure authentication systems, designing complex UI/UX, and implementing local data analysis logic.

---

## 🔒 Security Compliance

This tool is strictly for personal auditing and educational research. Always practice safe digital hygiene:
- Never use real passwords in public/untrusted environments.
- Regularly rotate sensitive credentials.
- Always enable Multi-Factor Authentication (MFA).


