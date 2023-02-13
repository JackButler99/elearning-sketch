import React from 'react';
import {Route, Routes, Redirect} from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Courses from './pages/Courses/Courses'
import CourseDetails from './pages/CourseDetails/CourseDetails';
import Learning from './pages/Learning/Learning';
import AddCourse from './pages/LecturerDashboard/AddCourse';
import LecturerDashboard from './pages/LecturerDashboard/LecturerDashboard';
import EditCourse from './pages/LecturerDashboard/EditCourse';
import AddLessons from './pages/LecturerDashboard/AddLessons';
import UserSettings from './pages/UserSettings/UserSettings';
import LoginGate from './pages/LoginGate';
import ProtectedRoute from './logic/ProtectedRoute';

const App = () => {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginGate/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="/course/:slug" element={<CourseDetails/>} />
        <Route path="/course/:courseId/learning/:lessonId" element={
          <ProtectedRoute>
            <Learning/>
          </ProtectedRoute>
        }/>
        <Route path="/addCourse" element={ 
          <ProtectedRoute>
            <AddCourse/>
          </ProtectedRoute>
        } />
        <Route path="/course/:slug/edit" element={
          <ProtectedRoute>
            <EditCourse/>
          </ProtectedRoute>
          } />
        <Route path="/course/:slug/addlessons" element={
          <ProtectedRoute>
            <AddLessons/>
          </ProtectedRoute>
        } />
        <Route path="/lecturer" element={
          <ProtectedRoute>
            <LecturerDashboard/>
          </ProtectedRoute>  
          }/>
        <Route path="/userSettings" element={<UserSettings/>}/>
        
      </Routes>
   </BrowserRouter>
  )
}

export default App