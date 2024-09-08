from django.http import HttpResponse
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *

def index(request):
    return HttpResponse("Motor app")

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    # permission_classes = [permissions.AllowAny]

class PartCategoryViewSet(viewsets.ModelViewSet):
    queryset = PartCategory.objects.all()
    serializer_class = PartCategorySerializer

class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all()
    serializer_class = PartSerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class MotorbikeModelViewSet(viewsets.ModelViewSet):
    queryset = MotorbikeModel.objects.all()
    serializer_class = MotorbikeModelSerializer

class PartMMViewSet(viewsets.ModelViewSet):
    queryset = PartMM.objects.all()
    serializer_class = PartMMSerializer

class UserMotorbikeViewSet(viewsets.ModelViewSet):
    queryset = UserMotorbike.objects.all()
    serializer_class = UserMotorbikeSerializer

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

class MaintenanceTypeViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceType.objects.all()
    serializer_class = MaintenanceTypeSerializer