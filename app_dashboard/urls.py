from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="homepage"),
    path("importacoes-JB/", views.importacoes_JB, name="importacoes_JB"),
    path("dashboards/", views.dashboards, name="dashboards"),


    path("get-all-companies/", views.get_all_companies, name="get_all_companies"),

]
