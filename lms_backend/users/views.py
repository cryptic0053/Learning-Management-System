from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(method="get", responses={200: UserSerializer(many=True)})
@swagger_auto_schema(method="post", request_body=UserSerializer)
@api_view(["GET", "POST"])
@permission_classes([AllowAny])  # Allow open registration
def user_list_create(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        users = User.objects.filter(id=request.user.id)  # Only return own data
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
