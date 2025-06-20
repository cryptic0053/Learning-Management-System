import { Route, Routes } from "react-router";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import StudentDashboard from "./pages/StudentDashboard";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import RequireAuth from "./components/RequireAuth";

// ✅ These are the two actual pages you created
import TeacherDashboard from "./pages/TeacherDashboard";
import AddCourse from "./pages/AddCourse";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Protected for Student */}
        <Route element={<RequireAuth allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* ✅ Protected for Teacher */}
        <Route element={<RequireAuth allowedRoles={["teacher"]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/add-course" element={<AddCourse />} />
        </Route>

        {/* Fallback Page */}
        <Route path="*" element={<div>404 - Page not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
