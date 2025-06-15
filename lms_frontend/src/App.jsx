import { Route, Routes } from "react-router";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import StudentDashboard from "./pages/StudentDashboard";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import { DashboardLayout } from "./layout/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/teacher/dashboard"
          element={<div>PROTECTED Dashboard</div>}
        />

        <Route path="/student/dashboard" element={<StudentDashboard />} />

        <Route path="*" element={<div>404</div>} />
      </Route>
      {/* <Route element={<DashboardLayout/>}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route> */}
    </Routes>
  );
}

export default App;
