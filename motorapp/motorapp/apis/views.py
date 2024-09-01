from django.http import HttpResponse
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *

def index(request):
    return HttpResponse("Motor app")

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.AllowAny]

