// App.tsx
import "./App.css";
import Layout from "./HOC/Layout";
import SuperDashboard from "./pages/(super_admin)/dashboard/superDashboard";
import IeltsDashboard from "./pages/(super_admin)/ielts/ieltsDashboard";
import LessonDashboard from "./pages/(super_admin)/ielts/lesson/LesssonDashboard";
import CreateSectionPage from "./pages/(super_admin)/ielts/section/[id]/CreateSectionPage";
import SectionDashboard from "./pages/(super_admin)/ielts/section/sectionDashboard";
import NewUserModel from "./pages/(super_admin)/users/NewUserModel";
import UserManagement from "./pages/(super_admin)/users/UserManagement";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>

          <Route path="/" element={<SuperDashboard />} />

          <Route path="/user" element={<UserManagement />} />
          <Route path="/user/new" element={<NewUserModel />} />


          <Route path="/ielts" element={<IeltsDashboard />} />

          <Route
            path="/ielts/course/:courseId"
            element={<SectionDashboard />}
          />

          <Route
            path="/ielts/course/:courseId/sections"
            element={<CreateSectionPage />}
          />

          <Route
            path="/ielts/course/:courseId/section/:sectionId"
            element={<LessonDashboard />}
          />

        </Route>
      </Routes>
    </>
  );
}

export default App;