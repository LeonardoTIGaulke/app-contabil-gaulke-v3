from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('web/v3/', include("app_dashboard.urls")),
]
