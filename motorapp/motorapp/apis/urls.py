from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('account', views.AccountViewSet, basename='account')
router.register('part_category', views.PartCategoryViewSet, basename='part_category')
router.register('part', views.PartViewSet, basename='part')
router.register('motorbike_model', views.MotorbikeModelViewSet, basename='motorbike_model')
router.register('user_motorbike', views.UserMotorbikeViewSet, basename='user_motorbike')
router.register('part_mm', views.PartMMViewSet, basename='part_mm')
router.register('company', views.CompanyViewSet, basename='company')
router.register('maintenance', views.MaintenanceViewSet, basename='maintenance')
router.register('maintenance_type', views.MaintenanceTypeViewSet, basename='maintenance_type')
urlpatterns = [
    # path('', views.index, name='index'),
    path('', include(router.urls)),
]

