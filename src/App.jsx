import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminStaff from "./pages/admin/Staff";
import AdminSettings from "./pages/admin/Admin Profile/AdminProfile";

import StaffDashboard from "./pages/staff/Dashboard";
import StaffCustomers from "./pages/staff/Customers";
import StaffTasks from "./pages/staff/Tasks";
import StaffProfile from "./pages/staff/StaffProfile";

import NotFound from "./pages/NotFound";
import DepartmentManagement from "./pages/admin/Staff Management/Department/DepartmentManagement";
import AllRoles from "./pages/admin/Staff Management/Roles/AllRoles";
import CreateRole from "./pages/admin/Staff Management/Roles/CreateRole";
import AllStaff from "./pages/admin/Staff Management/Staff/AllStaff";
import CreateEditStaff from "./pages/admin/Staff Management/Staff/CreateEditStaff";
import AdminLogs from "./pages/auth/AdminLogs";
import StaffLogs from "./pages/auth/StaffLogs";
import Policies from "./pages/admin/Settings/Policies";
import CreateEditFAQ from "./pages/admin/Settings/Faqs/CreateEditFAQs";
import AllFAQs from "./pages/admin/Settings/Faqs/AllFAQs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<Login role="admin" />} />
          <Route path="/staff/login" element={<Login role="staff" />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />

            <Route path="/admin/departments" element={<DepartmentManagement />} />

            <Route path="/admin/roles" element={<AllRoles />} />
            <Route path="/admin/roles/create" element={<CreateRole />} />
            <Route path="/admin/roles/edit/:id" element={<CreateRole />} />

            <Route path="/admin/staff" element={<AllStaff />} />
            <Route path="/admin/staff/create" element={<CreateEditStaff />} />
            <Route path="/admin/staff/edit/:id" element={<CreateEditStaff />} />

            <Route path="/admin/login/admin-logs" element={<AdminLogs />} />
            <Route path="/admin/login/staff-logs" element={<StaffLogs />} />

            <Route path="/admin/policies" element={<Policies />} />
            <Route path="/admin/policies/create" element={<CreateEditFAQ />} />
            <Route path="/admin/policies/edit/:id" element={<CreateEditFAQ />} />
            <Route path="/admin/faqs" element={<AllFAQs />} />

            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="staff" />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/customers" element={<StaffCustomers />} />
            <Route path="/staff/tasks" element={<StaffTasks />} />
            <Route path="/staff/profile" element={<StaffProfile />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}