import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

class Account(AbstractUser):
    phone = models.CharField(max_length=10, null=False, default="None")
    role = models.CharField(max_length=100, null=False, default="user")
    dob = models.DateField(auto_now=False, auto_now_add=False, default="2024-9-2")
    address = models.CharField(max_length=100, null=False, default="None")
    avatar = CloudinaryField(null=True)

    def __str__(self):
        return self.username

class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True

class PartCategory(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")

    def __str__(self):
        return self.name

class Company(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")
    country = models.CharField(max_length=100, null=False, default="None")

    def __str__(self):
        return self.name

class Part(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")
    part_number = models.CharField(max_length=100, null=False, default="None")
    image = CloudinaryField(null=True)
    duration = models.IntegerField(null=False, default=0)
    price = models.IntegerField(null=False, default=0)

    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    category = models.ForeignKey(PartCategory, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

class MotorbikeModel(BaseModel):
    brand = models.CharField(max_length=100, null=False, default="None")
    engine_capacity =  models.CharField(max_length=100, null=False, default="None")#Dung tich xe
    model_code = models.CharField(max_length=100, null=False, default="None")
    color = models.CharField(max_length=100, null=False, default="None")
    image = CloudinaryField(null=True)
    year = models.IntegerField(null=False, default=0)
    price = models.IntegerField(null=False, default=0)

    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name = 'Motorbike Model'  # Tên model khi hiển thị số ít
        verbose_name_plural = 'Motorbike Models'

    def __str__(self):
        return self.brand

class PartMM(BaseModel):
    part = models.ForeignKey(Part, null=False, on_delete=models.CASCADE)
    motorbike_model = models.ForeignKey(MotorbikeModel, null=False, on_delete=models.CASCADE)
    is_Maintenance = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Part of Model Motorbike'  # Tên model khi hiển thị số ít
        verbose_name_plural = 'Parts of Model Motorbike'

    def __str__(self):
        return self.part.name

class UserMotorbike(BaseModel):
    buy_days = models.DateField(auto_now=False, auto_now_add=False, default="2024-9-2")
    license_plate = models.CharField(max_length=100, null=False, default="None")
    chassis_number = models.CharField(max_length=100, null=False, default="None") #So khung
    engine_number = models.CharField(max_length=100, null=False, default="None") #So may

    user = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)
    motorbike_model = models.OneToOneField(MotorbikeModel, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.user.username

class MaintenanceType(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")
    cost = models.IntegerField(null=False, default=0)

    def __str__(self):
        return self.name

class Maintenance(BaseModel):
    day = models.DateField(auto_now=False, auto_now_add=False, default="2024-9-2")
    description = models.CharField(max_length=100, null=False, default="None")

    employee = models.ForeignKey(Account, null=False, on_delete=models.CASCADE)
    user_motorbike = models.ForeignKey(UserMotorbike, null=False, on_delete=models.CASCADE)
    part_mm = models.ForeignKey(PartMM, null=False, on_delete=models.CASCADE)
    maintenance_type = models.ForeignKey(MaintenanceType, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return self.maintenance_type.name