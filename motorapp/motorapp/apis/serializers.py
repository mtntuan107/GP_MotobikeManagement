from rest_framework.serializers import ModelSerializer
from .models import *

class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'email', 'avatar', 'phone', 'dob', 'role']

class PartCategorySerializer(ModelSerializer):
    class Meta:
        model = PartCategory
        fields = '__all__'

class PartSerializer(ModelSerializer):
    class Meta:
        model = Part
        fields = '__all__'

class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class MotorbikeModelSerializer(ModelSerializer):
    class Meta:
        model = MotorbikeModel
        fields = '__all__'

class UserMotorbikeSerializer(ModelSerializer):
    class Meta:
        model = UserMotorbike
        fields = '__all__'

class PartMMSerializer(ModelSerializer):
    class Meta:
        model = PartMM
        fields = '__all__'

class MaintenanceSerializer(ModelSerializer):
    class Meta:
        model = Maintenance
        fields = '__all__'

class MaintenanceTypeSerializer(ModelSerializer):
    class Meta:
        model = MaintenanceType
        fields = '__all__'

