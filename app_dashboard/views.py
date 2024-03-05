import json

from django.shortcuts import render
from django.http.response import JsonResponse

from prepare_data.prepare_data_DB import PrepareData_DB



def home(request):

    if request.method == "GET":
        return render(request, "app/homepage.html")
    
    return JsonResponse({
        "code": 200,
        "data": "dashboard-gaulke-contabil"
    })

# ----

def importacoes_JB(request):

    if request.method == "GET":
        return render(request, "app/importacoes_JB.html")

    return JsonResponse({
        "code": 200,
        "data": "dashboard-gaulke-contabil"
    })

# ----

def dashboards(request):

    if request.method == "GET":
        return render(request, "app/dashboards.html")
    
    return JsonResponse({
        "code": 200,
        "data": "dashboard-gaulke-contabil"
    })

def get_all_companies(request):
    if request.method == "GET":
        print("\n\n -----> requisição para get_all_companies...")

        df_dict = PrepareData_DB(app="").get_all_companies_and_balancetes()
        
        data_all_companies = df_dict["data_all_companies"]


        data = {
            # data_all_companies
            "data_all_companies": data_all_companies,
        }

        return JsonResponse({"code": 200, "data": data})