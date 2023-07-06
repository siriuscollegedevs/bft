from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import LoginSerializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = LoginSerializers(data=data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(
                request=request,
                username=username, 
                password=password
            )
            if user:
                refresh = RefreshToken.for_user(user)
                return Response(
                    data={
                    'userId': user.id,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'access_exp': 300,
                    'refresh_exp': 86400
                    },
                    status=status.HTTP_200_OK
                )
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class BlacklistTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)
