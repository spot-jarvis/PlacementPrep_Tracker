from django.contrib import admin
from .models import Company, Role, Topic, StudyTask

# Register your models here.
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "company_type")
    search_fields = ("name", "location")

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "package", "status")
    list_filter = ("status", "company")                 
    search_fields = ("title", "company__name")

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "difficulty")
    list_filter = ("category", "difficulty")
    search_fields = ("name",)

@admin.register(StudyTask)
class StudyTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "topic", "target_date", "completed")
    list_filter = ("completed", "topic", "target_date")
    search_fields = ("title", "topic__name")