from rest_framework import serializers
from .models import Category, Course, Lesson, Material, Enrollment, QuestionAnswer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    category_title = serializers.CharField(source="category.title", read_only=True)
    lessons = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    instructor = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ["instructor", "category_title"]
        extra_kwargs = {
            "banner": {"required": False},
        }

    def get_lessons(self, obj):
        return obj.lesson_set.count()

    def get_instructor(self, obj):
        return {
            "id": obj.instructor.id,
            "username": obj.instructor.username
        }

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.banner and request:
            return request.build_absolute_uri(obj.banner.url)
        return None



class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "course", "course_title", "progress", "is_completed"]



class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = '__all__'
