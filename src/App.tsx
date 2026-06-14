import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import  Course from './pages/(super_admin)/courses/course'
function App() {

  return (
  <section className="hero">

    <Routes>
      <Route  path='/' element={<Login />} />
      <Route path='/course' element={<Course />} />

      

    </Routes>
  <Login />
   
  </section>
  )
}

export default App
