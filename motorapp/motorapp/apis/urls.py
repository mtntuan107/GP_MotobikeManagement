from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('account', views.AccountViewSet, basename='account')

urlpatterns = [
    # path('', views.index, name='index'),
    path('', include(router.urls)),
]

