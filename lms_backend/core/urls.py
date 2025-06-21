from django.urls import path
from .views import (
    category_list_create,
    course_list_create,
    course_detail,
    lesson_list_create,
    material_list_create,
    question_list_create,
    student_enrolled_courses,
)

urlpatterns = [
    path("categories/", category_list_create),
    path("courses/", course_list_create),
    path("courses/<int:pk>/", course_detail),
    path("lessons/", lesson_list_create),
    path("materials/", material_list_create),
    path("questions/", question_list_create),
    path("student/courses/", student_enrolled_courses),  # ✅ fixed and working
]
