from django.shortcuts import render, redirect
from .models import StudyTask
# Create your views here.
def task_list(request):
    tasks = StudyTask.objects.all().order_by("completed","target_date")

    return render(request,"tracker/task_lists.html",{
        "tasks" : tasks
    })

def pending_list(request):
    tasks = StudyTask.objects.filter(completed = False).order_by("target_date")
    return render(request,"tracker/pending_list.html",{
        "tasks" : tasks
    })
