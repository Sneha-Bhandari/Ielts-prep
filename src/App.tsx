import "./App.css";
import Layout from "./HOC/Layout";
import SuperDashboard from "./pages/(super_admin)/dashboard/superDashboard";
import AddLessonPage from "./pages/(super_admin)/ielts/AddLessonPage";
import CourseCategory from "./pages/(super_admin)/courses/courseCategory";
import IeltsDashboard from "./pages/(super_admin)/ielts/ieltsDashboard";
import NewUserModel from "./pages/(super_admin)/users/NewUserModel";
import UserManagement from "./pages/(super_admin)/users/UserManagement";
import Login from "./pages/Login";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from "react-router-dom";
import AddCourseSection from './pages/(super_admin)/courses/addCourseSection'
import AddLesson from "./pages/(super_admin)/courses/AddLesson";



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



          {/* Core Categories */}

          <Route path="/ielts" element={<IeltsDashboard />} />

          <Route path="/courses/categories" element={<CourseCategory />} />
          <Route path="/courses/course/:entityId/section/:sectionId" element={<AddLesson />} />


          {/* UPDATED: Matches targetLink in CourseCard.tsx exactly */}

          <Route

            path="/courses/course/:courseId/sections"

            element={<AddCourseSection />}

          />



          {/* UPDATED: Matches sub-lesson page redirections inside AddCourseSection.tsx */}

          <Route

            path="/courses/course/:courseId/section/:sectionId"

            element={<AddLessonPage />}

          />

        </Route>

      </Routes>



      <ToastContainer

        position="top-right"

        autoClose={4000}

        hideProgressBar={false}

        newestOnTop={false}

        closeOnClick

        rtl={false}

        pauseOnFocusLoss

        draggable

        pauseOnHover

        theme="colored"

      />

    </>

  );

}



export default App;

