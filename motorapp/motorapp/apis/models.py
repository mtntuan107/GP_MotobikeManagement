import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

class Account(AbstractUser):
    phone = models.CharField(max_length=10, null=False, default="None")
    role = models.CharField(max_length=100, null=False, default="user")
    dob = models.DateField(auto_now=False, auto_now_add=False, default="2024-9-2")
    avatar = CloudinaryField(null=True)

class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True

class PartCategory(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")


class Company(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")
    country = models.CharField(max_length=100, null=False, default="None")

class Part(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")
    part_number = models.CharField(max_length=100, null=False, default="None")
    image = CloudinaryField(null=True)
    duration = models.IntegerField(null=False, default=0)

class MotorbikeModel(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")
    vin = models.CharField(max_length=100, null=False, default="None")
    engine_number = models.CharField(max_length=100, null=False, default="None")
    year = models.CharField(max_length=100, null=False, default="None")
    type = models.CharField(max_length=100, null=False, default="None")
    image = CloudinaryField(null=True)

class PartMM(BaseModel):
    part = models.ForeignKey(Part, null=False, on_delete=models.CASCADE)
    motorbike_model = models.ForeignKey(MotorbikeModel, null=False, on_delete=models.CASCADE)

class UserMotorbike(BaseModel):
    buy_days = models.DateField(auto_now=False, auto_now_add=False, default="2024-9-2")
    license_plate = models.CharField(max_length=100, null=False, default="None")

    user = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)
    motorbike_model = models.OneToOneField(MotorbikeModel, on_delete=models.CASCADE, null=True)

class MaintenanceType(BaseModel):
    name = models.CharField(max_length=100, null=False, default="None")


class MaintenanceHistory(BaseModel):
    day = models.DateField(auto_now=False, auto_now_add=False, default="2024-9-2")
    description = models.CharField(max_length=100, null=False, default="None")

    employee = models.ForeignKey(Account, null=False, on_delete=models.CASCADE)
    user_motorbike = models.ForeignKey(UserMotorbike, null=False, on_delete=models.CASCADE)
    part_mm = models.ForeignKey(PartMM, null=False, on_delete=models.CASCADE)
    maintenance_type = models.ForeignKey(MaintenanceType, null=False, on_delete=models.CASCADE)




