from django.db import models

class School(models.Model):
    school_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    area = models.CharField(max_length=100)

    def __str__(self):
        return self.school_name

class Appointment(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[('Pending', 'Pending'), ('Fixed', 'Fixed')])
    date = models.DateField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.school.school_name} - {self.status}"
