from rest_framework import serializers
from .models import Category, Course, Lesson, Material, Enrollment, QuestionAnswer, LessonCompletion


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    instructor = serializers.SerializerMethodField()
    lessons = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id", "title", "description", "price", "duration", "category",
            "instructor", "lessons", "image", "is_active", "created_at", "updated_at"
        ]
        read_only_fields = ["instructor"]

    def get_category(self, obj):
        return {
            "id": obj.category.id,
            "title": obj.category.title
        } if obj.category else None

    def get_instructor(self, obj):
        return {
            "id": obj.instructor.id,
            "username": obj.instructor.username,
            "full_name": obj.instructor.get_full_name()
        } if obj.instructor else None

    def get_lessons(self, obj):
        from .models import Lesson
        count = Lesson.objects.filter(course=obj).count()
        print(f"[DEBUG] Course: {obj.id} - '{obj.title}' has {count} lessons.")
        return count

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.banner and request:
            return request.build_absolute_uri(obj.banner.url)
        return None


class LessonSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'course', 'video']

    def get_course(self, obj):
        return {
            "id": obj.course.id,
            "title": obj.course.title,
        }


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    course = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'progress', 'is_completed']

    def get_course(self, obj):
        return CourseSerializer(obj.course, context=self.context).data


class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = '__all__'


class LessonCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonCompletion
        fields = ['id', 'student', 'lesson', 'completed_at']
        read_only_fields = ['student', 'completed_at']

class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['title', 'description', 'video', 'course']

