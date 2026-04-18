# EasyBank: Full-Stack Banking Simulation

EasyBank is a full-stack web application built to simulate core banking workflows, including role-based access control (RBAC), multi-tier transaction approvals, and real-time state synchronization. Originally developed to model complex backend-driven business logic, the platform serves as an evolving engineering sandbox demonstrating continuous improvement, system scaling, and modern architectural transitions.

---

## ⚠️ Status: Legacy Version (Refactor in Progress)

**This repository represents the legacy implementation (v1) of EasyBank.** While it successfully demonstrates core logic and real-time capabilities, it contains known architectural constraints and is **not production-ready**.

Active development is currently focused on rewriting the system into a secure, scalable, and fully tested "v2" architecture. This project serves to highlight engineering evolution, transitioning from a functional proof-of-concept to a robust, enterprise-grade system.

---

## 🛠 Refactor Roadmap (v2 Goals)

The upcoming iteration of EasyBank focuses heavily on security, data integrity, and best practices:

- **Secure Authentication:** Migrating from `localStorage` JWTs to secure `httpOnly` cookies with short-lived access tokens and refresh tokens.
- **Database Migration (MongoDB → SQL):** Replacing NoSQL with PostgreSQL to guarantee strict ACID compliance for all financial transactions.
- **Input Validation:** Replacing manual checks with strict **Zod** schema validation across all endpoints.
- **Security Hardening:** Implementing strict, distributed rate-limiting and comprehensive race-condition mitigation.
- **Frontend Architecture:** Introducing a centralized state management solution (e.g., Redux/Zustand) to decouple the UI from API calls.
- **Testing Infrastructure:** Implementing extensive end-to-end (E2E) testing using **Playwright**.
- **DevSecOps & CI/CD:** Automating deployment pipelines with integrated security scanning.
- **Code Refactoring:** Aggressively refactoring backend controllers to adhere to **SOLID** principles and **DRY** methodologies.
- **Third-Party Integrations:** Integrating the PayPal Sandbox API (simulated) to model external payment gateway interactions.

---

## ⚡ Key Features (v1)

- **Role-Based Access Control (RBAC):** Tiered system featuring distinct capabilities for **Users** (customers), **Supervisors** (approvals up to $150k), and **Administrators** (full system override).
- **Transaction Workflows:** Secure creation, cancellation, and processing of simulated funds with backend-enforced approval limits and audit logging.
- **Real-Time Synchronization:** WebSocket integration via **Socket.IO** ensures live UI updates across active sessions. If an Admin approves a transaction, the Supervisor's dashboard updates instantly.

---

## 💻 Technology Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Socket.IO Client

### Backend

- Node.js & Express.js
- MongoDB & Mongoose
- Socket.IO
- JWT & bcrypt

---

## 🧠 Engineering Insights & Learnings

Building and maintaining this system revealed critical insights into full-stack architecture, driving the v2 refactor:

- **Database Selection:** Using MongoDB initially demonstrated the difficulty of handling complex, multi-document transactions. Transitioning to a relational SQL database is necessary to ensure strict ACID compliance natively.
- **Security & Auth:** Relying on `localStorage` for JWTs exposed the application to potential XSS vulnerabilities. v2 will prioritize `httpOnly` cookies.
- **State Management:** Relying purely on component-level state resulted in redundant API calls. Centralized state is vital for scaling dashboards where multiple components rely on the same data snapshot.
- **Secret Management:** An early accidental `.env` commit required a complete repository reset. This reinforced the necessity of proactive secret scanning and strict `.gitignore` enforcement from day zero.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (running locally or via cloud URI)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_secure_jwt_secret_key
BASE_URL=your_backend_base_url
FRONTEND_URL=your_frontend_url
ALLOWED_ORIGINS=comma_separated_authorized_urls
NODE_ENV=development_or_production
EMAIL_USER=your_smtp_email_address
EMAIL_PASS=your_smtp_password_or_app_token
```

Start the backend server:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory and add your environment variables:

```env
VITE_API_BACKEND_URL=your_backend_api_url
VITE_API_FRONTEND_URL=your_frontend_url
```

Start the frontend server:

```bash
npm run dev
```

---

## 📁 Project Structure

```
└── Banking_System
    ├── LICENSE
    ├── README.md
    ├── backend
    │   ├── app.js
    │   ├── config
    │   │   ├── db.js
    │   │   └── global_variables.js
    │   ├── middlewares
    │   │   ├── authMiddleware.js
    │   │   ├── corsMiddleware.js
    │   │   ├── helmetMiddleware.js
    │   │   ├── rateLimiter.js
    │   │   ├── roleMiddleware.js
    │   │   ├── validateInput.js
    │   │   ├── validatePasswordReset.js
    │   │   └── validateTransactionCreation.js
    │   ├── models
    │   │   ├── ActivityLog.js
    │   │   ├── Transaction.js
    │   │   └── User.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   │   ├── admin
    │   │   │   ├── audit_logs.js
    │   │   │   ├── dashboard.js
    │   │   │   ├── transactions_operations.js
    │   │   │   └── users_management.js
    │   │   ├── authentication
    │   │   │   ├── login.js
    │   │   │   ├── password.js
    │   │   │   └── register.js
    │   │   ├── general
    │   │   │   └── fetchUsersData.js
    │   │   ├── supervisor
    │   │   │   ├── account_operations.js
    │   │   │   ├── audit_logs.js
    │   │   │   ├── dashboard.js
    │   │   │   └── transactions_operations.js
    │   │   ├── test
    │   │   │   └── test.js
    │   │   └── user
    │   │       ├── account_operations.js
    │   │       ├── dashboard.js
    │   │       └── transactions_operations.js
    │   ├── server.js
    │   ├── socket.js
    │   └── utils
    │       ├── Activitylogger.js
    │       ├── accountNumberGenerator.js
    │       ├── generateTransactionId.js
    │       ├── hashPassword.js
    │       ├── inputValidation.js
    │       ├── mailer.js
    │       ├── processTransactionType.js
    │       ├── testHelpers.js
    │       └── transactionEmitter.js
    └── frontend
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── src
        │   ├── App.jsx
        │   ├── Assets
        │   │   ├── image
        │   │   │   └── bank.png
        │   │   └── video
        │   │       ├── HeroSection-dark.mp4
        │   │       └── HeroSection-light.mp4
        │   ├── Components
        │   │   ├── Admin-Components
        │   │   │   ├── Admin-AuditLogs
        │   │   │   │   ├── AdminAuditLogsEntity.jsx
        │   │   │   │   ├── AdminAuditLogsFilteringOptions.jsx
        │   │   │   │   ├── AdminAuditLogsMobileCards.jsx
        │   │   │   │   └── AdminAuditLogsTable.jsx
        │   │   │   ├── Admin-Dashboard
        │   │   │   │   ├── AdminDashboardCharts.jsx
        │   │   │   │   ├── AdminDashboardEntity.jsx
        │   │   │   │   └── AdminDashboardMetrics.jsx
        │   │   │   ├── Admin-Transactions
        │   │   │   │   ├── AdminAllTransactionsEntity.jsx
        │   │   │   │   ├── AdminAllTransactionsMobileCards.jsx
        │   │   │   │   ├── AdminAllTransactionsTable.jsx
        │   │   │   │   ├── AdminPendingTransactionsEntity.jsx
        │   │   │   │   ├── AdminPendingTransactionsMobileCards.jsx
        │   │   │   │   ├── AdminPendingTransactionsTable.jsx
        │   │   │   │   ├── AdminTransactionsFilteringOptions.jsx
        │   │   │   │   └── AdminTransactionsMenu.jsx
        │   │   │   └── Admin-Users-Management-Panel
        │   │   │       ├── AdminUsersManagementPanelCreateUser.jsx
        │   │   │       ├── AdminUsersManagementPanelEditUser.jsx
        │   │   │       ├── AdminUsersManagementPanelEntity.jsx
        │   │   │       ├── AdminUsersManagementPanelMenu.jsx
        │   │   │       ├── AdminUsersManagementPanelSearchUser.jsx
        │   │   │       ├── AdminUsersManagementPanelUsersMobileCards.jsx
        │   │   │       └── AdminUsersManagementPanelUsersTable.jsx
        │   │   ├── Authuntcation-Components
        │   │   │   ├── LoginForm.jsx
        │   │   │   ├── RegisterForm.jsx
        │   │   │   └── ResetPassword.jsx
        │   │   ├── General-Componenets
        │   │   │   ├── Footer.jsx
        │   │   │   ├── Navbar.jsx
        │   │   │   └── ThemeSwitcher.jsx
        │   │   ├── Home-Components
        │   │   │   ├── CTASection.jsx
        │   │   │   ├── FeaturesSection.jsx
        │   │   │   ├── HeroSection.jsx
        │   │   │   └── TrustSection.jsx
        │   │   ├── Supervisor-Components
        │   │   │   ├── Supervisor-AuditLogs
        │   │   │   │   ├── SupervisorAuditLogsEntity.jsx
        │   │   │   │   ├── SupervisorAuditLogsFilteringOptions.jsx
        │   │   │   │   ├── SupervisorAuditLogsMobileCards.jsx
        │   │   │   │   └── SupervisorAuditLogsTable.jsx
        │   │   │   ├── Supervisor-Dashboard
        │   │   │   │   ├── SupervisorDashboardCharts.jsx
        │   │   │   │   ├── SupervisorDashboardEntity.jsx
        │   │   │   │   └── SupervisorDashboardMetrics.jsx
        │   │   │   └── Supervisor-Transactions
        │   │   │       ├── SupervisorTransactionsEntity.jsx
        │   │   │       ├── SupervisorTransactionsFilteringOptions.jsx
        │   │   │       └── SupervisorTransactionsMenu.jsx
        │   │   ├── Test-Components
        │   │   │   └── Backend_Test.jsx
        │   │   └── User-Components
        │   │       ├── User-Dashboard
        │   │       │   ├── UserDashboardEntity.jsx
        │   │       │   ├── UserDashboardMetrics.jsx
        │   │       │   ├── UserRecentTransactionsTable.jsx
        │   │       │   └── UserTransactionsCharts.jsx
        │   │       └── User-Transactions
        │   │           ├── UserTransactionsCreateNewTransaction.jsx
        │   │           ├── UserTransactionsEntity.jsx
        │   │           ├── UserTransactionsFilteringOptions.jsx
        │   │           ├── UserTransactionsMenu.jsx
        │   │           ├── UserTransactionsMobileCards.jsx
        │   │           └── UserTransactionsTable.jsx
        │   ├── Context
        │   │   ├── AuthContext.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   ├── ThemeContext.jsx
        │   │   └── Toast.jsx
        │   ├── Data
        │   │   ├── Features.js
        │   │   ├── Global_variables.js
        │   │   ├── Role_menus.js
        │   │   └── Testimonials.js
        │   ├── Hooks
        │   │   ├── Admin-Hooks
        │   │   │   ├── useAdminAuditLogsData.jsx
        │   │   │   ├── useAdminDashboardViewData.jsx
        │   │   │   ├── useAdminFetchTransactions.jsx
        │   │   │   ├── useAdminPendingTransactions.jsx
        │   │   │   ├── useAdminRealTimeTransactions.jsx
        │   │   │   ├── useAdminTransactionState.jsx
        │   │   │   └── useAdminTransactionsModeration.jsx
        │   │   ├── General-Hooks
        │   │   │   └── useToast.jsx
        │   │   ├── Supervisor-Hooks
        │   │   │   ├── useSupervisorAuditLogs.jsx
        │   │   │   ├── useSupervisorDashboardData.jsx
        │   │   │   └── useSupervisorPendingTransactions.jsx
        │   │   └── User-Hooks
        │   │       ├── useUserDashboardData.jsx
        │   │       ├── useUserManagement.jsx
        │   │       ├── useUserThemedColors.jsx
        │   │       └── useUserTransactions.jsx
        │   ├── Pages
        │   │   ├── AccountsManagment.jsx
        │   │   ├── AuditLogs.jsx
        │   │   ├── AuthuntcationPage.jsx
        │   │   ├── Dashboard.jsx
        │   │   ├── ErrorModule.jsx
        │   │   ├── Home.jsx
        │   │   └── TransactionOperations.jsx
        │   ├── Services
        │   │   └── APIs.js
        │   ├── Styles
        │   │   └── main.css
        │   ├── Utils
        │   │   ├── Admin-Utils
        │   │   │   ├── AdminAuditLogsExportUtils.jsx
        │   │   │   └── AdminTransactionUtils.jsx
        │   │   ├── General-Utils
        │   │   │   ├── FetchUserData.jsx
        │   │   │   └── SetupInterceptors.jsx
        │   │   ├── Supervisor-Utils
        │   │   │   ├── SupervisorAuditLogsExportUtils.jsx
        │   │   │   └── SupervisorTransactionsOperations.jsx
        │   │   └── User-Utils
        │   │       └── UserTransactionsCancelUtils.jsx
        │   └── main.jsx
        ├── vercel.json
        └── vite.config.js
```

---

## 🔮 What's Next (v2 Preview)

v2 is a ground-up rewrite prioritizing security, correctness, and production readiness. Key architectural shifts include moving to PostgreSQL for ACID-compliant transactions, adopting `httpOnly` cookie-based auth, introducing Redux for centralized frontend state, and building a full Playwright E2E test suite.

---

_This project is part of an active portfolio and is under continuous development._
