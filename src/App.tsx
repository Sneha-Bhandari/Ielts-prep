import "./App.css";
import Layout from "./HOC/Layout";
import StdIeltsDashboard from "./pages/(student_ielts)/stdIeltsDashboard";
import StudentCoursePlayer from "./pages/(student_ielts)/StudentCoursePlayer";
import SuperDashboard from "./pages/(super_admin)/dashboard/superDashboard";
import AddLessonPage from "./pages/(super_admin)/ielts/AddLessonPage";
import CourseCategory from "./pages/(super_admin)/courses/courseCategory";
import IeltsDashboard from "./pages/(super_admin)/ielts/ieltsDashboard";
import LessonDashboard from "./pages/(super_admin)/ielts/lesson/LesssonDashboard";
import CreateSectionPage from "./pages/(super_admin)/ielts/section/[id]/CreateSectionPage";
import SectionDashboard from "./pages/(super_admin)/ielts/section/sectionDashboard";
import CreateListeningQn from "./pages/(super_admin)/mock-tests/[id]/Listening/CreateListeningQn";
import ListeningDashboard from "./pages/(super_admin)/mock-tests/[id]/Listening/ListeningDashboard";
import ModuleSelection from "./pages/(super_admin)/mock-tests/[id]/ModuleSelection";
import CreateMockTest from "./pages/(super_admin)/mock-tests/CreateMockTest";
import MockTestDashboard from "./pages/(super_admin)/mock-tests/MockTestDashboard";
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

          <Route path="/" element={<SuperDashboard />} />

          {/* Home */}

          <Route path="/" element={<SuperDashboard />} />



          {/* User Routes */}

          <Route path="/user" element={<UserManagement />} />

          <Route path="/user/new" element={<NewUserModel />} />



          <Route
            path="/mock-tests"
            element={<MockTestDashboard />}
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
            path="/mock-tests/create"
            element={<CreateMockTest />}
          />

          <Route
            path="/mock-tests/:id/modules"
            element={<ModuleSelection />}
          />

          <Route
            path="/mock-tests/:id/modules/listening"
            element={<ListeningDashboard />}
          />

          <Route
            path="/mock-tests/:id/modules/listening/create"
            element={<CreateListeningQn />}
          />



          {/* Ielts */}
          <Route path="/ielts" element={<IeltsDashboard />} />
          <Route path="/ielts/course/:courseId" element={<SectionDashboard />} />
          <Route path="/ielts/course/:courseId/sections" element={<CreateSectionPage />} />
          <Route path="/ielts/course/:courseId/section/:sectionId" element={<LessonDashboard />} />

          <Route path="/studentIelts" element={<StdIeltsDashboard />} />
          <Route path="/studentIelts/course/:courseId" element={<StudentCoursePlayer />} />


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

