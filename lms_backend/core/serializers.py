from rest_framework import serializers
from .models import Category, Course, Lesson, Material, Enrollment, QuestionAnswer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['instructor']  # 💡 This is the key fix
        extra_kwargs = {
            'banner': {'required': False},  # Optional for dev
        }

    def validate_category(self, value):
        if not isinstance(value, Category):
            raise serializers.ValidationError("Invalid category ID.")
        return value

    def validate(self, data):
        user = self.context.get('request').user
        if user.role != 'teacher':
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
