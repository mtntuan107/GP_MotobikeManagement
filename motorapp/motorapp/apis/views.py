from datetime import date
from operator import truediv
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from oauthlib.uri_validate import query
from rest_framework import viewsets, permissions, generics,status
from .models import *
from .serializers import *
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser
from django.db.models import Q
def index(request):
    return HttpResponse("Motor app")

class AccountViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    # permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(AccountSerializer(user).data)

    @action(methods=['post'], detail=False, url_path='create-account')
    def create_account(self, request):
        fn = request.data.get('firstname', 'new')
        ln = request.data.get('lastname', 'account')
        un = request.data.get('username')
        pw = request.data.get('password')
        e = request.data.get('email')
        a = request.data.get('address')
        avatar = request.data.get('avatar')
        phone = request.data.get('phone')
        dob = request.data.get('dob')
        role = request.data.get('role','user')

        user = Account.objects.create(
            first_name=fn,
            last_name=ln,
            username=un,
            address=a,
            phone=phone,
            avatar=avatar,
            dob = dob,
            role= role,
            email=e
        )

        user.set_password(pw)
        user.save()

        return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'patch'], url_path='search', detail=False)
    def search(self, request):
        query = request.query_params.get('query', None)

        if query:
            # Tìm kiếm theo tên hoặc ID
            user = Account.objects.filter(
                Q(username__icontains=query)|
                Q(last_name__icontains=query) | Q(first_name__icontains=query)
            ).distinct()  # Tránh trùng lặp

            if user.exists():
                serializer = AccountSerializer(user, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Không tìm thấy bộ phận nào phù hợp với truy vấn."},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Vui lòng cung cấp một truy vấn."},
                            status=status.HTTP_400_BAD_REQUEST)

class PartCategoryViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = PartCategory.objects.all()
    serializer_class = PartCategorySerializer

class PartViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer

    @action(methods=['get', 'patch'], url_path='search', detail=False)
    def search(self, request):
        query = request.query_params.get('query', None)

        if query:
            # Tìm kiếm theo tên hoặc ID
            part = Part.objects.filter(
                Q(name__icontains=query) | Q(id__icontains=query),
                active=True
            ).distinct()  # Tránh trùng lặp

            if part.exists():
                serializer = PartSerializer(part, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Không tìm thấy bộ phận nào phù hợp với truy vấn."},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Vui lòng cung cấp một truy vấn."},
                            status=status.HTTP_400_BAD_REQUEST)

class CompanyViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    @action(methods=['get', 'patch'], url_path='search', detail=False)
    def search(self, request):
        query = request.query_params.get('query', None)
        if query:
            company = Company.objects.filter(Q(name__icontains=query), active=True)
            if company.exists():
                serializer = CompanySerializer(company, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Dont find company"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Please provide a query"}, status=status.HTTP_400_BAD_REQUEST)

class MotorbikeModelViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = MotorbikeModel.objects.all()
    serializer_class = MotorbikeModelSerializer

class PartMMViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = PartMM.objects.all()
    serializer_class = PartMMSerializer

    @action(methods=['get', 'patch'], url_path='search', detail=False)
    def search(self, request):
        query = request.query_params.get('query', None)
        if query:
            part = PartMM.objects.filter(Q(name__icontains=query), active=True)
            if part.exists():
                serializer = PartMMSerializer(part, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Dont find part"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Please provide a query"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='motorbike', detail=False)
    def get_usermotorbike(self, request):
        user_id = request.user.id

        user_motorbike = get_object_or_404(UserMotorbike, user=user_id)

        motorbike_model = user_motorbike.motorbike_model

        part_mm_list = PartMM.objects.filter(motorbike_model=motorbike_model)

        if not part_mm_list.exists():
            return Response({"error": "No parts found for this motorbike model."}, status=status.HTTP_404_NOT_FOUND)

        data = []
        for part_mm in part_mm_list:
            part_mm_data = PartMMSerializer(part_mm).data
            part_mm_data['duration'] = part_mm.part.duration
            data.append(part_mm_data)

        return Response(data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='input', detail=False)
    def get_partmm_by_user(self, request):
        user_id = request.query_params['user']

        user_motorbike = get_object_or_404(UserMotorbike, user=user_id)

        motorbike_model = user_motorbike.motorbike_model

        part_mm_list = PartMM.objects.filter(motorbike_model=motorbike_model)

        if not part_mm_list.exists():
            return Response({"error": "No parts found for this motorbike model."}, status=status.HTTP_404_NOT_FOUND)

        data = []
        for part_mm in part_mm_list:
            part_mm_data = PartMMSerializer(part_mm).data
            part_mm_data['duration'] = part_mm.part.duration
            part_mm_data['name'] = part_mm.part.name
            data.append(part_mm_data)

        return Response(data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='schedule', detail=False)
    def get_schedule(self, request):
        user_id = request.user.id
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(Account, id=user_id)
        user_motorbike = get_object_or_404(UserMotorbike, user=user)

        # Get all parts that are not under maintenance
        parts = PartMM.objects.filter(motorbike_model=user_motorbike.motorbike_model, is_Maintenance=False)

        # Get the latest maintenance record for the user motorbike
        try:
            maintenance = Maintenance.objects.filter(user_motorbike=user_motorbike).latest('day')
        except Maintenance.DoesNotExist:
            maintenance = None  # or handle this case accordingly

        # Serialize parts and maintenance
        parts_data = PartMMSerializer(parts, many=True).data  # Serialize as many
        maintenance_data = MaintenanceSerializer(maintenance).data if maintenance else None

        # Prepare the response data
        response_data = {
            'partmm': parts_data,
            'maintenance': maintenance_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)

class UserMotorbikeViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = UserMotorbike.objects.all()
    serializer_class = UserMotorbikeSerializer

    @action(methods=['get'], url_path='get_motorbike', detail=False)
    def get_info(self, request):
        user_id = request.user.id
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(Account, id=user_id)

        motor = get_object_or_404(UserMotorbike, user=user)

        motor_data = UserMotorbikeSerializer(motor).data

        motorbike_model = motor.motorbike_model

        motor_data['motorbike_model'] = {
            'brand': motorbike_model.brand,
            'engine_capacity': motorbike_model.engine_capacity,
            'model_code': motorbike_model.model_code,
            'image': motorbike_model.image.url if motorbike_model.image else None,
            'year': motorbike_model.year,
        }

        return Response(motor_data, status=status.HTTP_200_OK)

class MaintenanceViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

    @action(methods=['get'], url_path='user_history', detail=False)
    def get_history(self, request):
        user_id = request.user.id
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(Account, id=user_id)
        user_motorbike = get_object_or_404(UserMotorbike, user=user)

        history = Maintenance.objects.filter(user_motorbike=user_motorbike)

        return Response(MaintenanceSerializer(history, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='history', detail=False)
    def get_history_of_user(self, request):
        user_id = request.data.get('user')
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(Account, id=user_id)
        user_motorbike = get_object_or_404(UserMotorbike, user=user)

        history = Maintenance.objects.filter(user_motorbike=user_motorbike)

        return Response(MaintenanceSerializer(history, many=True).data, status=status.HTTP_200_OK)
    @action(methods=['post'], url_path='create', detail=False)
    def create_bill(self, request):
        user_id = request.data.get('user')
        part_id = request.data.get('part')
        description = request.data.get('description')
        type_id = request.data.get('type')
        e_id = request.user.id
        e = get_object_or_404(Account, id=e_id)
        user = get_object_or_404(Account, id=user_id)
        user_motorbike = get_object_or_404(UserMotorbike, user=user)
        part = get_object_or_404(PartMM, id=part_id)
        type = get_object_or_404(MaintenanceType, id=type_id)

        maintenance = Maintenance.objects.create(user_motorbike=user_motorbike, part_mm=part, day = date.today(),
                                                 description=description, maintenance_type = type, employee = e)
        if (part.is_Maintenance == False):
            part.is_Maintenance = True
        part.save()
        return Response(MaintenanceSerializer(maintenance).data, status=status.HTTP_201_CREATED)

class MaintenanceTypeViewSet(viewsets.ModelViewSet,
                     generics.CreateAPIView,
                     generics.DestroyAPIView,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = MaintenanceType.objects.all()
    serializer_class = MaintenanceTypeSerializer