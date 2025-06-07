from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from drf_yasg.utils import swagger_auto_schema


@swagger_auto_schema(method="get", responses={200: UserSerializer(many=True)})
@swagger_auto_schema(method="post", request_body=UserSerializer)
@api_view(["GET", "POST"])
def user_list_create(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."}, status=401
            )

        if request.user.role == "admin":
            users = User.objects.all()
        else:
            users = User.objects.filter(id=request.user.id)

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
