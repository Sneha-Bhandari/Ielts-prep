import "./App.css";
import Layout from "./HOC/Layout";
import SuperDashboard from "./pages/(super_admin)/dashboard/superDashboard";
import NewUserModel from "./pages/(super_admin)/users/NewUserModel";
import UserManagement from "./pages/(super_admin)/users/UserManagement";
import UserDetail from "./pages/(super_admin)/users/UserDetail";
// import PlanManagement from "./pages/(super_admin)/users/PlanManagement";
// import PaymentManagement from "./pages/(super_admin)/users/PaymentManagement";
// import StatusManagement from "./pages/(super_admin)/users/StatusManagement";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import StudentDashboard from "./pages/(super_admin)/students/StudentDashboard";

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
          
          {/* Company Management Routes */}
          {/* <Route path="/user/:id/plan" element={<PlanManagement />} />
          <Route path="/user/:id/payment" element={<PaymentManagement />} />
          <Route path="/user/:id/status" element={<StatusManagement />} /> */}

<Route path="/students" element={<StudentDashboard />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;