// src/App.tsx
import "./App.css";
import Layout from "./HOC/Layout";
import SuperDashboard from "./pages/(super_admin)/dashboard/superDashboard";
import NewUserModel from "./pages/(super_admin)/users/NewUserModel";
import UserManagement from "./pages/(super_admin)/users/UserManagement";
import UserDetail from "./pages/(super_admin)/users/UserDetail";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import { AddStudent } from "./pages/(super_admin)/students/components/AddStudent";
import { StudentManagement } from "./pages/(super_admin)/students/StudentManagement";
import { EditStudent } from "./pages/(super_admin)/students/components/EditStudent";
import { StudentDetail } from "./pages/(super_admin)/students/components/StudentDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          {/* Home */}
          <Route path="/" element={<SuperDashboard />} />

          {/* User/Company Routes */}
          <Route path="/user" element={<UserManagement />} />
          <Route path="/user/new" element={<NewUserModel />} />
          <Route path="/user/:id" element={<UserDetail />} />
          
          {/* Student Routes */}
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/:id" element={<StudentDetail/>} />
          <Route path="/students/edit/:id" element={<EditStudent />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;