from rest_framework import serializers
from .models import School, Appointment

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)
    state = serializers.CharField(write_only=True)
    district = serializers.CharField(write_only=True)
    area = serializers.CharField(write_only=True)

    school = SchoolSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'school', 'school_name', 'phone', 'state', 'district', 'area', 'status', 'date', 'time', 'description']

    def create(self, validated_data):
        school_name = validated_data.pop('school_name')
        phone = validated_data.pop('phone')
        state = validated_data.pop('state')
        district = validated_data.pop('district')
        area = validated_data.pop('area')

        school = School.objects.filter(school_name=school_name).first()
        if not school:
            school = School.objects.create(
                school_name=school_name,
                phone=phone,
                state=state,
                district=district,
                area=area
            )

        appointment = Appointment.objects.create(school=school, **validated_data)
        return appointment
