from django.urls import path
from .views import (
    category_list_create,
    course_list_create,
    course_detail,
    lesson_list_create,
    material_list_create,
    question_list_create,
    student_enrolled_courses,
    enroll_in_course,
    lesson_detail,
    teacher_courses,
    mark_lesson_complete,
    get_course_progress,
    get_course_lessons,
    complete_lesson,
    completed_lessons,
)

urlpatterns = [
    path("categories/", category_list_create),
    path("courses/", course_list_create),
    path("courses/<int:pk>/", course_detail),
    path("lessons/", lesson_list_create),
    path("materials/", material_list_create),
    path("questions/", question_list_create),
    path("student/courses/", student_enrolled_courses),
    path("student/enroll/", enroll_in_course),
    path("lessons/<int:pk>/", lesson_detail),
    path("teacher/courses/", teacher_courses),
    path("student/lesson-complete/", mark_lesson_complete),
    path("student/progress/<int:course_id>/", get_course_progress),
    path("courses/<int:course_id>/lessons/", get_course_lessons),  # ✅ fixed here
    path("student/complete-lesson/", complete_lesson),
    path("student/completed-lessons/<int:course_id>/", completed_lessons),
]
