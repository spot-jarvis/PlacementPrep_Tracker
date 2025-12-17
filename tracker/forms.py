from django import forms
from .models import StudyTask

class StudyTaskForm(forms.ModelForm):
    class Meta :
        model = StudyTask
        fields = ["title", "topic", "description", "target_date",  "completed", "notes"]
        