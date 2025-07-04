from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from django.db import IntegrityError
from rest_framework import viewsets
from .models import Course
from .serializers import CourseSerializer

from .models import Category, Course, Lesson, Material, Enrollment, QuestionAnswer, LessonCompletion
from .serializers import (
    CategorySerializer,
    CourseSerializer,
    LessonSerializer,
    MaterialSerializer,
    EnrollmentSerializer,
    QuestionAnswerSerializer,
    CourseCreateSerializer,
)


class MyPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "limit"
    max_page_size = 100


# ------------------------ Category ------------------------

@swagger_auto_schema(method="post", request_body=CategorySerializer)
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
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

@swagger_auto_schema(method="post", request_body=CourseCreateSerializer)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def course_list_create(request):
    if request.method == "GET":
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True, context={"request": request})
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = CourseCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(instructor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------ Course Detail ------------------------

@swagger_auto_schema(methods=["patch", "put"], request_body=CourseSerializer)
@api_view(["GET", "PATCH", "PUT", "DELETE"])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])  # Adjust to IsAuthenticated if needed
def lesson_list_create(request):
    if request.method == "GET":
        lessons = Lesson.objects.all()
        course_id = request.GET.get("course_id")
        if course_id:
            lessons = lessons.filter(course__id=course_id)

        paginator = MyPagination()
        result_page = paginator.paginate_queryset(lessons, request)
        serializer = LessonSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_lesson_complete(request):
    user = request.user
    lesson_id = request.data.get('lesson_id')

    try:
        lesson = Lesson.objects.get(id=lesson_id)
        completion, created = LessonCompletion.objects.get_or_create(
            student=user, lesson=lesson
        )
        return Response({'detail': 'Lesson marked as complete.'})
    except Lesson.DoesNotExist:
        return Response({'detail': 'Lesson not found.'}, status=404)



# ------------------------ Material ------------------------

@swagger_auto_schema(method="post", request_body=MaterialSerializer)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def material_list_create(request):
    if request.method == "GET":
        if request.user.role == "teacher":
            materials = Material.objects.filter(course__instructor=request.user)
        else:
            materials = Material.objects.all()
        paginator = MyPagination()
        result_page = paginator.paginate_queryset(materials, request)
        serializer = MaterialSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.user.role != "teacher":
        return Response({"detail": "Only teachers can upload materials."}, status=403)

    course_id = request.data.get("course")
    if not course_id:
        return Response({"detail": "Course ID is required."}, status=400)

    try:
        course = Course.objects.get(id=course_id, instructor=request.user)
    except Course.DoesNotExist:
        return Response({"detail": "Course not found or not yours."}, status=404)

    serializer = MaterialSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(course=course)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


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


# ------------------------ Enrolled Courses ------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_enrolled_courses(request):
    if request.user.role != "student":
        return Response({"detail": "Only students can access this endpoint."}, status=403)

    enrollments = Enrollment.objects.filter(user=request.user, is_active=True).select_related("course")
    serializer = EnrollmentSerializer(enrollments, many=True, context={"request": request})
    return Response(serializer.data)


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
        serializer = EnrollmentSerializer(enrollment, context={"request": request})
        return Response(serializer.data, status=201)

    except Course.DoesNotExist:
        return Response({"detail": "Course not found."}, status=404)
    except Exception as e:
        return Response({"detail": "Error", "error": str(e)}, status=500)


# ------------------------ Lesson & Material Detail ------------------------

@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def lesson_detail(request, pk):
    try:
        lesson = Lesson.objects.select_related("course").get(pk=pk)
    except Lesson.DoesNotExist:
        return Response({"detail": "Lesson not found"}, status=404)

    if request.method == "GET":
        serializer = LessonSerializer(lesson)
        return Response(serializer.data)

    if request.user != lesson.course.instructor:
        return Response({"detail": "Only the course instructor can modify this lesson."}, status=403)

    if request.method == "PATCH":
        serializer = LessonSerializer(lesson, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        lesson.delete()
        return Response({"detail": "Lesson deleted successfully"}, status=204)


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def material_detail(request, pk):
    try:
        material = Material.objects.select_related("course").get(pk=pk)
    except Material.DoesNotExist:
        return Response({"detail": "Material not found"}, status=404)

    if request.method == "GET":
        serializer = MaterialSerializer(material)
        return Response(serializer.data)

    if request.user != material.course.instructor:
        return Response({"detail": "Only the course instructor can modify this material."}, status=403)

    if request.method == "PATCH":
        serializer = MaterialSerializer(material, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        material.delete()
        return Response({"detail": "Material deleted successfully"}, status=204)


# ------------------------ Public Course Lessons ------------------------

@api_view(["GET"])
@permission_classes([AllowAny])
def course_lessons_public(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({"detail": "Course not found"}, status=404)

    lessons = Lesson.objects.filter(course=course)
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_courses(request):
    if request.user.role != "teacher":
        return Response({"error": "Only teachers can access this."}, status=403)
    courses = Course.objects.filter(instructor=request.user)
    serializer = CourseSerializer(courses, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_lesson(request, course_id):
    course = Course.objects.get(id=course_id)
    if course.instructor != request.user:
        return Response(status=403)
    data = request.data.copy()
    data['course'] = course.id
    serializer = LessonSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def teacher_course_list_create(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Only teachers can access this.'}, status=403)

    if request.method == 'GET':
        courses = Course.objects.filter(instructor=request.user)
        serializer = CourseSerializer(courses, many=True, context={"request": request})
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(instructor=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def teacher_course_update_delete(request, pk):
    try:
        course = Course.objects.get(pk=pk, instructor=request.user)
    except Course.DoesNotExist:
        return Response({'error': 'Not found or not your course.'}, status=404)

    if request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        course.delete()
        return Response(status=204)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_course_progress(request, course_id):
    user = request.user
    try:
        enrollment = Enrollment.objects.get(user=user, course_id=course_id)
        return Response({
            "progress_percent": enrollment.progress,
            "is_completed": enrollment.is_completed
        })
    except Enrollment.DoesNotExist:
        return Response({"progress_percent": 0})



@api_view(['GET'])
@permission_classes([AllowAny])  # or IsAuthenticated if needed
def get_course_lessons(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)

    lessons = Lesson.objects.filter(course=course)
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_lesson(request):
    try:
        user = request.user
        lesson_id = request.data.get("lesson_id")
        print("User:", user)
        print("Lesson ID:", lesson_id)

        if not lesson_id:
            return Response({"error": "Missing lesson_id"}, status=400)

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=404)

        if user.role != "student":
            return Response({"error": "Only students can complete lessons"}, status=403)

        completed, created = LessonCompletion.objects.get_or_create(
            student=user,
            lesson=lesson
        )

        if not created:
            return Response({"message": "Lesson already marked as complete"}, status=200)

        try:
            enrollment = Enrollment.objects.get(user=user, course=lesson.course)
        except Enrollment.DoesNotExist:
            return Response({"error": "Enrollment not found"}, status=404)

        total_lessons = Lesson.objects.filter(course=lesson.course).count()
        completed_count = LessonCompletion.objects.filter(student=user, lesson__course=lesson.course).count()

        progress_percent = int((completed_count / total_lessons) * 100)
        enrollment.progress = progress_percent
        if progress_percent >= 100:
            enrollment.is_completed = True
        enrollment.save()

        return Response({"message": "Lesson marked as complete", "progress": progress_percent}, status=200)

    except Exception as e:
        print("🔥 Server Error:", str(e))
        return Response({"error": "Internal Server Error", "details": str(e)}, status=500)

    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def completed_lessons(request, course_id):
    try:
        if not hasattr(request.user, "role") or request.user.role != "student":
            return Response({"error": "Only students can view completed lessons"}, status=403)

        lesson_ids = LessonCompletion.objects.filter(
            student=request.user,
            lesson__course_id=course_id
        ).values_list("lesson_id", flat=True)

        return Response(list(lesson_ids), status=200)

    except Exception as e:
        print("[ERROR] completed_lessons:", str(e))
        return Response({"error": "Failed to fetch completed lessons"}, status=500)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_lesson(request):
    try:
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # ✅ it uses `course = request.data['course']`
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    except Exception as e:
        print("❌ Add lesson error:", str(e))
        return Response({"error": "Internal Server Error", "details": str(e)}, status=500)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def create_course(request):
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(instructor=request.user)  # ✅ Use instructor
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)