import { Routes, Route, Navigate } from "react-router-dom";
import Backend_Test from './Components/Test-Components/Backend_Test.jsx';
import AuthPage from "./Pages/AuthuntcationPage.jsx";
import ResetPassword from './Components/Authuntcation-Components/ResetPassword.jsx';
import Home from "./Pages/Home.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import ProtectedRoute from "./Context/ProtectedRoute.jsx";
import ErrorModule from "./Pages/ErrorModule.jsx";
import ThemeSwitcher from "./Components/General-Componenets/ThemeSwitcher.jsx";
import TransactionOperations from "./Pages/TransactionOperations.jsx";
import Accounts_managment from "./Pages/AccountsManagment.jsx";
import AuditLogs from "./Pages/AuditLogs.jsx";
import { useAuth } from "./Context/AuthContext.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ThemeSwitcher />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Supervisor", "User"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Supervisor", "User"]}>
              <TransactionOperations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Supervisor"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Accounts_managment />
            </ProtectedRoute>
          }
        />
        <Route path="/auth-page" element={<AuthPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/backend-test" element={<Backend_Test />} />
        <Route path="/unauthorized" element={<ErrorModule type="unauthorized" />} />
        <Route path="/session-expired" element={<ErrorModule type="sessionExpired" />} />
        <Route path="/test" element={<Backend_Test />} />
      </Routes>
    </>
  );
}
export default App
