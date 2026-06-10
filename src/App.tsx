// import { Routes } from 'react-router-dom'
import "./App.css";
import Layout from "./HOC/Layout";
import SuperDashboard from "./pages/(super_admin)/dashboard/superDashboard";
import NewUserModel from "./pages/(super_admin)/users/NewUserModel";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>



          {/* //Home */}
          <Route path="/" element={<SuperDashboard />} />
          <Route path="/user" element={<NewUserModel/>} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
