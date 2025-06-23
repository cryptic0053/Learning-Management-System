import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import StudentDashboard from "./pages/StudentDashboard";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import RequireAuth from "./components/RequireAuth";
import EditCourse from "./pages/EditCourse";
import NotFound from "./pages/NotFound";
import AddLesson from "./pages/AddLesson";
import AddMaterial from "./pages/AddMaterial";
import EditMaterial from "./pages/EditMaterial";
import EditLesson from "./pages/EditLesson";
import CourseLessonsPage from "./pages/CourseLessonsPage";




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
          <Route path="/courses/:courseId/lessons" element={<CourseLessonsPage />} />
        </Route>

        {/* ✅ Protected for Teacher */}
        <Route element={<RequireAuth allowedRoles={["teacher"]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/add-course" element={<AddCourse />} />
          <Route path="/teacher/edit-course/:id" element={<EditCourse />} />
          <Route path="/teacher/add-lesson/:courseId" element={<AddLesson />} />
          <Route path="/teacher/add-material/:courseId" element={<AddMaterial />} />
          <Route path="/teacher/edit-material/:materialId" element={<EditMaterial />} />
          <Route path="/teacher/edit-lesson/:lessonId" element={<EditLesson />} />

        </Route>

        {/* Fallback Page */}
        <Route path="*" element={<div>404 - Page not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
