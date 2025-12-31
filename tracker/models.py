from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
# Create your models here.

class Company(models.Model):
    name = models.CharField( max_length=50)
    website = models.URLField( max_length=200,blank=True)
    location = models.CharField( max_length=50)
    company_type = models.CharField( max_length=50)
    notes = models.TextField( blank=True)

    def __str__(self):
        return self.name

class Role(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.CharField( max_length=50)
    package = models.CharField(max_length=40)
    status = models.CharField(max_length=55)
    notes = models.TextField( blank=True)
    
    def __str__(self):
        return f"{self.title} at {self.company.name}"

class Topic(models.Model):
    name = models.CharField( max_length=50) 
    category = models.CharField( max_length=50)
    difficulty = models.CharField( max_length=50)

    def __str__(self):
        return f"{self.name}({self.category})"
User = get_user_model()
class StudyTask(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    title = models.CharField( max_length=50)
    description = models.TextField(blank=True)
    target_date = models.DateField(null=True,blank=True)
    completed = models.BooleanField(default=False)
    notes = models.TextField( blank=True)

    def __str__(self):
        status = "Done" if self.completed else "Not Done"
        return f"{self.title} - {status}"

