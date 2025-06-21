from rest_framework import serializers
from .models import Category, Course, Lesson, Material, Enrollment, QuestionAnswer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    category_title = serializers.CharField(source="category.title", read_only=True)
    lessons = serializers.SerializerMethodField()
    image = serializers.ImageField(source="banner", read_only=True)
    instructor = serializers.SerializerMethodField()  # ✅ Updated to return full instructor info

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

    def validate(self, data):
        user = self.context.get("request").user
        if user.role != "teacher":
            raise serializers.ValidationError("Only teachers can create courses.")
        return data


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'


class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = '__all__'
