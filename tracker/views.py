from django.shortcuts import render, redirect, get_object_or_404
from django.http import Http404
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import StudyTask
from .forms import StudyTaskForm
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

def new_task(request):
    if request.method == "POST":
        form = StudyTaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("task_list")
        
    else:
        form = StudyTaskForm()
    return render(request,"tracker/task_form.html",{
        "form" : form
    })

def task_detail (request,pk):
    task = get_object_or_404(StudyTask, id=pk)
    return render(request,"tracker/task_detail.html",{
        "task" : task
    })

def task_edit(request,pk):
    task = get_object_or_404(StudyTask,id = pk)
    if request.method == "POST":
        form = StudyTaskForm(request.POST,instance=task)
        if form.is_valid():
            form.save()
            return redirect("task_detail",pk = task.pk)
    else:
        form = StudyTaskForm(instance=task)
    return render(request,"tracker/task_form.html",{
        "form" : form
    })

def task_delete(request,pk):
    task = get_object_or_404(StudyTask,id=pk)
    if request.method == "POST":
        task.delete()
        return redirect("task_list")
    return render(request,"tracker/task_confirm_delete.html",{
        "task" :task
    })

def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request,username = username,password = password)
        if user is not None:
            login(request,user)
            return redirect('task_list')
        else:
            messages.error(request, "Invalid username or password")
            return render(request,'tracker/login.html',{
                'username' : username
            })

    return render(request,'tracker/login.html')

def log_out(request):
    logout(request)
    return redirect("login_view")

def sign_up(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login_view")
    else:
        form = UserCreationForm()
    
    return render(request, "tracker/signup.html",{
        "form" : form
    })