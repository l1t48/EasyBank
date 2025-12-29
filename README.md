# Project Title & Short Description - EasyBank – Full-Stack Banking Application
A secure, responsive, web-based banking platform built to simulate real-world banking workflows,
including authentication, role-based access control, transaction approval flows, and real-time updates.

## 1. Project Overview
EasyBank is a full-stack, web-based banking application developed as a personal portfolio project to demonstrate real-world full-stack development skills.
The system simulates core banking workflows, including authentication, role-based access control (RBAC), transaction approval processes, audit logging, and real-time updates. While the platform does not handle real money, it follows strict validation rules and approval limits to model realistic banking behavior. The primary focus of this project is to showcase: 

- Secure authentication and authorization flows.
- Clear separation of user roles and responsibilities.
- Backend-driven business logic.
- Real-time communication using WebSockets.
- Scalable and maintainable system design.

This project is intended for learning, demonstration, and portfolio evaluation purposes.

### 1.1 Deployment Note

This application was not deployed to a public production environment due to infrastructure limitations of free hosting platforms.
The system relies on persistent WebSocket connections (Socket.IO) for real-time, role-based notifications, which are not reliably supported on free-tier platforms due to container sleeping and connection termination.

To ensure the real-time functionality is demonstrated correctly, a recorded demo video is provided instead. The video showcases the full system behavior under production-like conditions, including authentication, role-based updates, and live transaction state changes.

The application is fully production-ready and can be deployed on platforms that support long-lived WebSocket connections (e.g., Fly.io, paid Render plans, or equivalent infrastructure).


## 2. User Roles & Permissions
EasyBank implements Role-Based Access Control (RBAC) with three distinct roles, each having clearly defined permissions and limitations.

### 2.1 User (Customer)
- Register and authenticate securely.
- View personal dashboard and account overview.
- Create and cancel transactions.
- View transaction history with sorting and filtering.
- Access only their own data.

### 2.2 Supervisor
- Access a role-specific dashboard with relevant statistics.
- View pending transactions only.
- Approve or reject transactions below a defined limit (150,000).
- View audit logs related to users and other supervisors.
- Cannot access full transaction history or unrestricted approvals.

### 2.3 Administrator
- Full system access
- Approve or reject transactions without value limitations.
- View complete transaction history.
- Access all audit logs without restrictions.
- Manage users (create, update, search, and view details).
- Override or intervene in system operations when required.

## 3. Core Features

### 3.1 Authentication & Authorization
- Secure user registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Role-based access enforcement across all protected routes.
- Rate limiting on authentication endpoints to mitigate brute-force, spam, and DoS-style attacks.
- Password update functionality.

### 3.2 Dashboard System
- Dedicated dashboards for User, Supervisor, and Admin.
- Role-specific data visibility.
- Interactive charts and statistics.
- Responsive and animated UI components for improved UX.

### 3.3 Transaction Management
- Create, cancel, and view transactions (User).
- Approval workflow for pending transactions.
- Supervisor approval limit enforced at backend level.
- Admins have unrestricted approval authority.
- Transaction sorting and filtering tailored to each role.
- Atomic backend updates to prevent double-processing.
- Real-time synchronization across clients.

### 3.4 Audit Logs
- Available to Supervisors and Administrators.
- Logs can be viewed: 1. As structured tables, 2. As raw JSON data, 3. Export audit logs as JSON for debugging or forensic purposes.
- Role-based visibility: 1. Supervisors see limited logs, 2. Administrators see full system logs.

### 3.5 User Management (Admin Only)
- View all registered users.
- Search and filter users.
- Create new users.
- Modify existing user details.
- Centralized control panel for account administration.

## 4. Real-Time Features
EasyBank integrates real-time communication using Socket.IO to enhance responsiveness and system consistency.
Real-time functionality includes:
- Live updates for transaction status changes.
- Immediate UI synchronization across multiple sessions.
- Reduced need for manual refresh or polling.
This approach simulates real banking environments where multiple staff members may interact with the same data concurrently.

## 5. Technology Stack

### 5.1 Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Socket.IO Client
- Chart.js
- Framer Motion
- Animate.css
- JWT Decode
- React Toastify

### 5.2 Backend
- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- bcrypt (password hashing)
- Helmet (security headers)
- CORS
- RESTful API architecture

### 5.3 Other Tools & Testing
- Visual Studio Code (VS Code) – Primary IDE for coding, debugging, and project organization.
- Postman – Manual testing of backend APIs, validating endpoints, and inspecting request/response payloads.
- Jest – Automated testing framework planned for backend APIs; note that this feature was partially implemented and later removed from the final project.
- Cross-Browser Testing – Application tested on multiple browsers, including Google Chrome, Opera, and Firefox.

## 6. System Architecture
EasyBank follows a layered client–server architecture designed for clarity, security, and scalability. The system is structured as follows:
- Client (Frontend) - A React-based frontend responsible for user interaction, role-specific dashboards, and real-time UI updates. The client communicates with the backend via REST APIs and WebSocket connections.
- API Layer (Backend) - A Node.js and Express backend that handles business logic, authentication, authorization, validation, and data processing.
 Role-based middleware ensures that each request is authorized according to the user’s assigned role.
- Database Layer - MongoDB is used to persist user accounts, transactions, audit logs, and system data using structured schemas and validation rules.
- Authentication Flow - JWT-based authentication is used to secure protected routes. Tokens are issued upon successful login and validated by middleware on each request.
- Real-Time Communication Layer - Socket.IO enables real-time updates for transaction state changes and multi-user consistency.

Note: A system architecture diagram may be added in future iterations to visually represent the data flow and component interactions.

## 7. API Documentation Overview
The backend of EasyBank follows a structured and documented REST API design to improve readability, maintainability, and onboarding for other developers.
Each backend controller or route file begins with a standardized API documentation table that describes the available endpoints within that file. This documentation strategy ensures that API behavior and access rules are clearly visible directly in the codebase.
The API tables typically include the following fields:
- Endpoint – The URL path of the API route
- Method – HTTP method (GET, POST, PUT, DELETE)
- Description – A concise explanation of the endpoint’s functionality
- Required Role – The user role(s) allowed to access the endpoint
- Authentication Required – Indicates whether a valid JWT is required

This approach avoids duplicating large API lists in the README while keeping documentation close to the implementation. It also encourages consistency and reduces the risk of undocumented or misused endpoints.

## 8. Security Considerations
Security was a core focus during the design and implementation of EasyBank, especially given the banking-related domain being simulated.
The system includes the following security measures:
- Password Hashing - User passwords are securely hashed using bcrypt before being stored in the database.
- JWT Authentication - Authentication is handled using JSON Web Tokens (JWT). Tokens are stored in localStorage and attached to protected API requests.
- Role-Based Access Control (RBAC) - All protected routes enforce role validation at the backend level, ensuring that users can only access functionality permitted by their assigned role.
- Rate Limiting - Rate limiting is applied to sensitive endpoints (such as authentication routes) to reduce the risk of brute-force attacks, spam, and denial-of-service attempts.
- Security Headers - Helmet is used to configure secure HTTP headers and reduce exposure to common web vulnerabilities.
- CORS Configuration - Cross-Origin Resource Sharing (CORS) is explicitly configured to restrict and control cross-origin requests.
- Input Validation - Backend validation ensures that incoming request data follows expected formats and constraints, reducing the risk of malformed or malicious input.
- Error Handling & HTTP Status Codes - The backend consistently returns appropriate HTTP status codes for all success and error conditions (e.g., 400, 401, 403, 404, 409, 500). Errors are handled safely on both the backend and frontend: 1. The backend avoids leaking sensitive implementation details in error responses, 2. The frontend gracefully handles error states and displays user-friendly feedback, 3. Centralized error handling improves reliability, debugging, and system stability.

Important Disclaimer: EasyBank is a simulated banking system created for educational and portfolio demonstration purposes only. It does not handle real financial transactions and is not intended for production or real-world financial use.

## 9. Setup & Installation
Follow these steps to set up EasyBank on your local machine for development and testing.

### 9.1 Prerequisites
Before running the application, ensure the following are installed and properly configured:
- Node.js (v16+ recommended)
- npm (Node package manager, comes with Node.js)
- ⚠️ Make sure MongoDB is running before starting the backend server.

### 9.2 Backend Setup
- Navigate to the backend folder: ```cd backend```
- Install required packages: ```npm install```
- Create a .env file in the backend folder using the structure described in Environment Variables
- Start the backend server using nodemon (auto-reloads on file changes): ```nodemon server.js```
- The backend should now be running at the URL specified in your .env (BASE_URL), usually: ```http://localhost:5000```

### 9.3 Frontend Setup
- Navigate to the frontend folder: ```cd frontend```
- Install required packages: ```npm install```
- Create a .env file in the frontend folder using the structure described in Environment Variables
- Start the development server: ```npm run dev```
- The frontend will be accessible at: ```http://localhost:5173```

## 10. Environment Variables
EasyBank uses environment variables to manage configuration for both frontend and backend.
Two separate .env files are used: one for the frontend and one for the backend.

### 10.1 Frontend (.env)
- VITE_API_BACKEND_URL=<BACKEND_URL>

### 10.2 Backend (.env)
- MONGO_URI=<YOUR_MONGODB_URI>
- JWT_SECRET=<YOUR_JWT_SECRET>
- PORT=<YOUR_BACKEND_PORT>
- BASE_URL=<YOUR_BACKEND_BASE_URL>
- EMAIL_USER=<YOUR_EMAIL_ADDRESS>
- EMAIL_PASS=<YOUR_EMAIL_PASSWORD>
- ALLOWED_ORIGINS=<FRONTEND_URLS>
- NODE_ENV=production
- FRONTEND_URL=<FRONTEND_URL>

## 11. Known Limitations & Future Improvements

### 11.1 Security & Authentication
- The current rate-limiting mechanism may potentially be bypassed using IPv6 address rotation. A more robust solution (e.g., token-based or user-based rate limiting) should be implemented.
- The backend does not currently enforce HTTPS. As a result, data transmitted over HTTP could be intercepted or manipulated via man-in-the-middle attacks. Enforcing HTTPS is a critical improvement for production readiness.
- JWTs are stored in localStorage. While functional, this approach is less secure than using secure, httpOnly cookies with refresh tokens.
- Rate limiting is currently applied to selected endpoints only. Extending rate limits to additional sensitive endpoints would further improve security.
- Button-spamming protection is not fully implemented on the frontend. Rapid repeated requests could lead to unnecessary backend load or potential abuse.

### 11.2 Backend & Architecture
- Some backend controllers could be further refactored to improve code cleanliness, consistency, and long-term maintainability.
- While the codebase follows several design principles, additional refactoring would improve readability and make collaboration with other developers easier.
- Certain frontend components rely directly on MongoDB _id values. Replacing these with generated public identifiers would reduce potential security exposure.
- Multiple supervisors or administrators may see the same pending transactions simultaneously. Although backend atomic updates ensure that only one action succeeds and real-time updates synchronize the UI, this can still result in duplicated review work. Possible improvements include: 1. Atomic transaction assignment per supervisor, 2. Temporary locking mechanisms with TTL, 3. Queue-based transaction distribution
For a portfolio project, the current solution was considered sufficient.
- API layering/versioning was not implemented in this project but should be included to improve scalability, maintainability, and backward compatibility as the system grows.

### 11.3 Frontend & User Experience
- Some frontend components make additional temporary API calls, resulting in unnecessary requests. These could be optimized by redesigning backend endpoints. This was deprioritized during the final stages of development.
- UI spacing is not perfectly consistent across all components.
- The theme switcher occasionally overlaps underlying content, negatively affecting UI/UX. However, it was intentionally kept easily accessible to improve usability rather than being hidden in a settings page.
- Certain form styles (notably login and registration) render incorrectly in Firefox. Recommended browsers for this application are Chrome and Opera. This issue may be addressed in future iterations.
- Semantic HTML elements are not consistently used; replacing generic <div> elements with appropriate semantic tags would improve accessibility and structure.
- More comprehensive planning of user flows, wireframes, and UI layouts before implementation would have resulted in a more polished and responsive frontend.
- Improved spacing, typography, color schemes, and design consistency would enhance the overall professionalism and modern appearance.

### 11.4 Feature Scope & Missing Functionality
- Due to time constraints, several planned features were excluded from the final implementation, even though the backend partially or fully supports them.
- Account management for users and supervisors exists at the backend level, but no dedicated UI was implemented. Instead, users must request changes via the administrator, who can perform updates through the user management panel.
- An advanced statistics dashboard for administrators and supervisors was planned but excluded. The existing dashboards still provide sufficient insight and demonstrate technical competence.
- An issue-reporting system (user → supervisor → administrator) was conceptually planned but not implemented. Issue handling is currently managed via private communication.
- A private internal chat system for secure staff communication was planned but excluded due to backend readiness and time limitations.
- Automatic logout when a user leaves the browser session is not implemented and should be added.
- Introducing an additional role focused on incident response, threat detection, and security analysis would significantly enhance the system from a cybersecurity perspective.


## 12 Testing
Testing was conducted throughout the development process to ensure reliability, correctness, and stability of both the backend and frontend components.

### 12.1 Backend Testing
During the early stages of development, the backend was tested before implementing the real-time socket configuration and frontend integration. Manual testing was performed to verify API behavior, request handling, and response correctness.

In addition, automated test cases were implemented using Jest, where each API endpoint had its own dedicated test suite and individual test cases to validate expected functionality and error handling. These automated tests were later removed from the project to keep the scope focused, with the intention of publishing them as a separate testing-focused project in the future.

After frontend integration, the backend APIs were manually tested again to ensure correct communication between the frontend and backend. All APIs functioned as expected, and no critical issues were identified.

## 12.2 Frontend Testing
Frontend testing was performed manually using a structured testing approach:

- Unit testing was applied to individual components to verify their isolated behavior.

- Integration testing was conducted on each page to ensure proper interaction between components and backend APIs.

- System testing was performed on the complete application across all user roles to validate end-to-end functionality.

All tested scenarios behaved as intended, and no functional issues were observed during testing.


## 13. Author
Adnan Hamdan - Full-Stack Developer

## 14. MIT License
Copyright (c) 2025 Adnan Hamdan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



