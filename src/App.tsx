// App.tsx
import "./App.css";
import Layout from "./HOC/Layout";
import SuperDashboard from "./pages/(super_admin)/dashboard/superDashboard";
import AddLessonPage from "./pages/(super_admin)/ielts/AddLessonPage";
import AddSectionPage from "./pages/(super_admin)/ielts/AddSectionPage";
// import CourseDetails from "./pages/(super_admin)/ielts/courseDetails";
import IeltsDashboard from "./pages/(super_admin)/ielts/ieltsDashboard";
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
          {/* Home */}
          <Route path="/" element={<SuperDashboard />} />

          {/* User Routes */}
          <Route path="/user" element={<UserManagement />} />
          <Route path="/user/new" element={<NewUserModel />} />

          <Route path="/ielts" element={<IeltsDashboard />} />
          <Route
            path="/ielts/course/:courseId/sections"
            element={<AddSectionPage />}
          />

          <Route
            path="/ielts/course/:courseId/section/:sectionId"
            element={<AddLessonPage />}
          />

          {/* Company Routes */}
        </Route>
      </Routes>
    </>
  );
}

export default App;