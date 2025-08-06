from django.db import models

class School(models.Model):
    school_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    incharge = models.CharField(max_length=100)

    def __str__(self):
        return self.school_name
