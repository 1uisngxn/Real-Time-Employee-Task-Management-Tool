import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./admin/LoginPage";
import OwnerValidatePage from "./admin/ValidatePage";
import DashboardPage from "./admin/DashboardPage";  
import AuthEmployee from "./employee/AuthLogin";
import EmployeeValidatePage from "./employee/ValidatePage";
import EmployeeDashboardPage from "./employee/DashboardPage";
import SetupAccountPage from "./employee/SetupAccountPage";
import Login from "./employee/Login";
import EditProfilePage from "./employee/EditProfilePage";
import ChooseRole from "./components/ChooseRole";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page choose role */}
        <Route path="/chooseRole" element={<ChooseRole />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/chooseRole" replace />} />

        {/* Owner */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/validate" element={<OwnerValidatePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Employee */}
        <Route path="/authEmployee" element={<AuthEmployee />} />
        <Route path="/employee/validate" element={<EmployeeValidatePage />} />
        <Route path="/employee/setupAccount" element={<SetupAccountPage />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
        <Route path="/employee/login" element={<Login />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />

        {/* Catch all (404) */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
