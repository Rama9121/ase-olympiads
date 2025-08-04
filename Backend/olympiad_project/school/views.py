from rest_framework import viewsets
from .models import School, Appointment
from .serializers import SchoolSerializer, AppointmentSerializer

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().select_related('school')
    serializer_class = AppointmentSerializer
