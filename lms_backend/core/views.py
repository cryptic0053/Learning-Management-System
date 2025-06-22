from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from django.db import IntegrityError

from .models import Category, Course, Lesson, Material, Enrollment, QuestionAnswer
from .serializers import (
    CategorySerializer,
    CourseSerializer,
    LessonSerializer,
    MaterialSerializer,
    EnrollmentSerializer,
    QuestionAnswerSerializer,
)


class MyPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "limit"
    max_page_size = 100


# ------------------------ Category ------------------------

@swagger_auto_schema(method="post", request_body=CategorySerializer)
@api_view(["GET", "POST"])
@permission_classes([AllowAny])  # ✅ Anyone can view categories
def category_list_create(request):
    if request.method == "GET":
        categories = Category.objects.all()
        paginator = MyPagination()
        result_page = paginator.paginate_queryset(categories, request)
        serializer = CategorySerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    if not request.user.is_authenticated or request.user.role != "admin":
        return Response({"detail": "Only admin can create categories."}, status=403)

    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------ Course List/Create ------------------------

@swagger_auto_schema(method="post", request_body=CourseSerializer)
@api_view(["GET", "POST"])
@permission_classes([AllowAny])  # ✅ Public can view courses
@parser_classes([MultiPartParser, FormParser])
def course_list_create(request):
    if request.method == "GET":
        courses = Course.objects.all()
        paginator = MyPagination()
        result_page = paginator.paginate_queryset(courses, request)
        serializer = CourseSerializer(result_page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)

    if not request.user.is_authenticated or request.user.role != "teacher":
        return Response({"detail": "Only authenticated teachers can create courses."}, status=403)

    serializer = CourseSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save(instructor=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------ Course Detail ------------------------

@swagger_auto_schema(methods=["patch", "put"], request_body=CourseSerializer)
@api_view(["GET", "PATCH", "PUT", "DELETE"])
@permission_classes([AllowAny])  # ✅ Public can view course detail
@parser_classes([MultiPartParser, FormParser])
def course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({"detail": "Course not found"}, status=404)

    if request.method == "GET":
        serializer = CourseSerializer(course, context={"request": request})
        return Response(serializer.data)

    if not request.user.is_authenticated or request.user != course.instructor:
        return Response({"detail": "Only the course owner can modify or delete."}, status=403)

    if request.method in ["PATCH", "PUT"]:
        partial = request.method == "PATCH"
        serializer = CourseSerializer(course, data=request.data, partial=partial, context={"request": request})
        if serializer.is_valid():
            serializer.save(instructor=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        course.delete()
        return Response({"detail": "Course deleted"}, status=status.HTTP_204_NO_CONTENT)


# ------------------------ Lesson ------------------------

@swagger_auto_schema(method="post", request_body=LessonSerializer)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def lesson_list_create(request):
    if request.method == "GET":
        lessons = Lesson.objects.all()
        paginator = MyPagination()
        result_page = paginator.paginate_queryset(lessons, request)
        serializer = LessonSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = LessonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------ Material ------------------------

@swagger_auto_schema(method="post", request_body=MaterialSerializer)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def material_list_create(request):
    if request.method == "GET":
        materials = Material.objects.all()
        paginator = MyPagination()
        result_page = paginator.paginate_queryset(materials, request)
        serializer = MaterialSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = MaterialSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------ Q&A ------------------------

@swagger_auto_schema(method="post", request_body=QuestionAnswerSerializer)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def question_list_create(request):
    if request.method == "GET":
        questions = QuestionAnswer.objects.all()
        paginator = MyPagination()
        result_page = paginator.paginate_queryset(questions, request)
        serializer = QuestionAnswerSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = QuestionAnswerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------ Student's Enrolled Courses ------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_enrolled_courses(request):
    if request.user.role != "student":
        return Response({"detail": "Only students can access this endpoint."}, status=403)

    enrollments = Enrollment.objects.filter(user=request.user, is_active=True).select_related("course")
    paginator = MyPagination()
    result_page = paginator.paginate_queryset(enrollments, request)
    serializer = EnrollmentSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll_in_course(request):
    try:
        user = request.user
        course_id = request.data.get("course_id")

        if not course_id:
            return Response({"detail": "Course ID is required."}, status=400)

        course = Course.objects.get(id=course_id)

        if Enrollment.objects.filter(user=user, course=course, is_active=True).exists():
            return Response({"detail": "Already enrolled in this course."}, status=400)

        enrollment = Enrollment.objects.create(user=user, course=course, is_active=True)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=201)

    except Course.DoesNotExist:
        return Response({"detail": "Course not found."}, status=404)
    except Exception as e:
        return Response({"detail": "Error", "error": str(e)}, status=500)


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def lesson_detail(request, pk):
    try:
        lesson = Lesson.objects.get(pk=pk)
    except Lesson.DoesNotExist:
        return Response({"detail": "Lesson not found"}, status=404)

    if request.method == "GET":
        serializer = LessonSerializer(lesson)
        return Response(serializer.data)

    if request.method == "PATCH":
        serializer = LessonSerializer(lesson, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        lesson.delete()
        return Response({"detail": "Lesson deleted successfully"}, status=204)
