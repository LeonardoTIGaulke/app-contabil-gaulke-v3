import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from django.db import connections

import warnings
warnings.simplefilter(action='ignore')

with open("config_app.json", "r") as f:
    file = json.loads(f.read())

class PrepareData_DB:
    def __init__(self, app):
        self.app = app
        self.list_month = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]


    def resume_balancetes_delivery_performance(self, df_all_balancetes):

        # df_all_balancetes["competencia_calc"] = "-"

        df_all_balancetes["competencia_DATETIME"] = ""
        for i in df_all_balancetes.index:
            comp = "28/" + df_all_balancetes["competencia"][i]
            comp = datetime.strptime(comp, "%d/%m/%Y")
            df_all_balancetes["competencia_DATETIME"][i] = comp
            # print(f"\n\n >>> comp: {comp}")


        df_all_balancetes["data_da_entrega_DATETIME"] = pd.to_datetime(df_all_balancetes["data_da_entrega"], format="%d/%m/%Y")
        df_all_balancetes["competencia_DATETIME"] = pd.to_datetime(df_all_balancetes["competencia_DATETIME"], format="%d/%m/%Y")
        

        print(f"\n\n ------------------- df_all_balancetes ------------------- ")
        dt_now_string = datetime.now().strftime("%Y-%m-%d")
        df_all_balancetes["dt_now"] = datetime.strptime(dt_now_string, "%Y-%m-%d")
        df_all_balancetes["dias_atraso"] = df_all_balancetes["dt_now"] - df_all_balancetes["competencia_DATETIME"]

        # print(df_all_balancetes)
        # print(df_all_balancetes.info())


        # Calcular a diferença em meses
        df_all_balancetes["meses_atraso"] = (df_all_balancetes["dt_now"].dt.year - df_all_balancetes["competencia_DATETIME"].dt.year) * 12 + (df_all_balancetes["dt_now"].dt.month - df_all_balancetes["competencia_DATETIME"].dt.month) - 1
        df_all_balancetes["meses_atraso_historico"] = (df_all_balancetes["data_da_entrega_DATETIME"].dt.year - df_all_balancetes["competencia_DATETIME"].dt.year) * 12 + (df_all_balancetes["data_da_entrega_DATETIME"].dt.month - df_all_balancetes["competencia_DATETIME"].dt.month) - 1
        
        
        df_all_balancetes["status_entrega"] = "dentro-prazo"
        df_all_balancetes["status_entrega-historico"] = "dentro-prazo"
        df_all_balancetes.loc[df_all_balancetes["meses_atraso"] > 0, "status_entrega"] = "fora-prazo"
        df_all_balancetes.loc[df_all_balancetes["meses_atraso_historico"] > 0, "status_entrega-historico"] = "fora-prazo"

        df_all_balancetes['dt_entrega'] = df_all_balancetes['data_da_entrega'].dt.strftime('%d/%m/%Y')

        df_all_balancetes = df_all_balancetes.sort_values(by=["empresa", "obrigacao", "competencia_DATETIME", "data_da_entrega", "competencia_DATETIME"]) # "data_da_entrega"
        return df_all_balancetes
    
    def resume_deliveries_regime(self, df_all_companies):
        print(" ---------------- resume_deliveries_regime/df_all_companies ---------------- ")
        print(df_all_companies)
        print(df_all_companies.info())

        data_resume_regimes = list()
        list_regimes = list(df_all_companies.drop_duplicates(subset=["regime"], keep="last")["regime"].values)
        for regime in list_regimes:
            tt_regime = len(df_all_companies[df_all_companies["regime"] == regime])
            tt_regime_periodo_meses_atraso = len(df_all_companies[ ( df_all_companies["regime"] == regime ) & ( df_all_companies["mensal_status_entrega"] == "fora-prazo") ])
            
            sum_regime_periodo_meses_atraso = 0
            data_aux = list(df_all_companies[ ( df_all_companies["regime"] == regime ) & ( df_all_companies["mensal_status_entrega"] == "fora-prazo") ]["mensal_meses_atraso"].values)
            for x in data_aux:
                sum_regime_periodo_meses_atraso += int(x)

            data_resume_regimes.append({
                "regime": regime,
                "tt_regime": tt_regime,
                "tt_regime_periodo_meses_atraso": tt_regime_periodo_meses_atraso,
                "sum_regime_periodo_meses_atraso": sum_regime_periodo_meses_atraso,
            })
            # print(f">>> regime: {regime}")
        
        print(" ---------------- resume_deliveries_regime/data_resume_regimes ---------------- ")
        data_resume_regimes = pd.DataFrame.from_dict(data_resume_regimes, orient="columns")
        data_resume_regimes.sort_values(by=["sum_regime_periodo_meses_atraso"], ascending=False, inplace=True)
        data_resume_regimes.index = list(range(0, len(data_resume_regimes.index)))
        data_resume_regimes = data_resume_regimes.to_dict("index")
        print(data_resume_regimes)
        
        return data_resume_regimes

    def resume_deliveries_meses(self, df_all_companies):
        print(" ---------------- resume_deliveries_regime/df_all_companies ---------------- ")
        df_all_companies["dt_mes_lancado"] = "-"
        df_all_companies["dt_mes_mensal"] = "-"

        for i in df_all_companies.index:
            dt_mes_lancado = df_all_companies["mensal_comp"][i].split("/")[0]
            dt_mes_mensal = df_all_companies["mensal_comp"][i].split("/")[0]
            if dt_mes_lancado != "-":
                df_all_companies["dt_mes_lancado"][i] = self.list_month[int(dt_mes_lancado)-1]
            # ----
            if dt_mes_mensal != "-":
                df_all_companies["dt_mes_mensal"][i] = self.list_month[int(dt_mes_mensal)-1]

        print(df_all_companies)
        print(df_all_companies.info())

        data_resume_dt_mes_mensal = list()
        for mes in self.list_month:
            
            tt_periodo_meses_atraso = len(df_all_companies[ ( df_all_companies["dt_mes_mensal"] == mes ) & ( df_all_companies["mensal_status_entrega"] == "fora-prazo") ])
            
            sum_regime_periodo_meses_atraso = 0
            data_aux = list(df_all_companies[ ( df_all_companies["dt_mes_mensal"] == mes ) & ( df_all_companies["mensal_status_entrega"] == "fora-prazo") ]["mensal_meses_atraso"].values)
            for x in data_aux:
                sum_regime_periodo_meses_atraso += int(x)

            data_resume_dt_mes_mensal.append({
                "mes": mes,
                "tt_periodo_meses_atraso": tt_periodo_meses_atraso,
                "sum_regime_periodo_meses_atraso": sum_regime_periodo_meses_atraso,
            })
            # print(f">>> regime: {mes}")
        
        print(" ---------------- data_resume_deliveries_meses ---------------- ")
        data_resume_dt_mes_mensal = pd.DataFrame.from_dict(data_resume_dt_mes_mensal, orient="columns")
        # data_resume_dt_mes_mensal.sort_values(by=["sum_regime_periodo_meses_atraso"], ascending=False, inplace=True)
        data_resume_dt_mes_mensal.index = list(range(0, len(data_resume_dt_mes_mensal.index)))
        data_resume_dt_mes_mensal = data_resume_dt_mes_mensal.to_dict("index")
        print(data_resume_dt_mes_mensal)
        
        return data_resume_dt_mes_mensal

    def prepare_all_balancetes(self, df_all_balancetes):

        df_all_balancetes.sort_values(by=["empresa", "competencia_DATETIME"])
        try:
            df_all_balancetes.to_excel("df_all_balancetes.xlsx")
        except:
            pass

        return df_all_balancetes


    def extract_month_year_and_regime(self, dataframe, extract_from_column, column_name_month, column_name_year, add_day_init=True):
        dataframe[column_name_month] = "-"
        dataframe[column_name_year] = "-"
        dataframe["regime_agrup"] = "Outros"
        dataframe["type_company"] = "Normal"
        
        for i in dataframe.index:

            if "SIMPLES" in dataframe["regime"][i]:
                dataframe["regime_agrup"][i] = "Simples"
            elif "LUCRO REAL" in dataframe["regime"][i]:
                dataframe["regime_agrup"][i] = "Lucro Real"
            elif "LUCRO PRESUMIDO" in dataframe["regime"][i]:
                dataframe["regime_agrup"][i] = "Lucro Presumido"

            if "MEI" in dataframe["regime"][i]:
                dataframe["type_company"][i] = "MEI"

            if dataframe[extract_from_column][i] != "-":
                if add_day_init:
                    dt_aux = datetime.strptime( "01/" + dataframe[extract_from_column][i], "%d/%m/%Y")
                else:
                    dt_aux = datetime.strptime(dataframe[extract_from_column][i], "%d/%m/%Y")

                mes = self.list_month[ dt_aux.month - 1]
                ano =dt_aux.year
                # print(f"""
                #       >>>>>> dt_aux: {dt_aux}
                #       >>>>>> mes: {mes}
                #       >>>>>> ano: {ano}
                # """)

                dataframe[column_name_month][i] = mes
                dataframe[column_name_year][i] = ano
        
        return dataframe



    def prepare_dataframe_all_companies_and_balancetes(self, df_all_companies, df_all_balancetes):

        # ---> prepara dados do balancete com resumo de entregas (dias e meses).


        df_all_balancetes = self.resume_balancetes_delivery_performance(df_all_balancetes=df_all_balancetes)
        
        df_all_deliveries_balancetes = self.prepare_all_balancetes(df_all_balancetes=df_all_balancetes)
        df_all_deliveries_balancetes["regime"] = "-"
        df_all_deliveries_balancetes["fiscal"] = "-"
        df_all_deliveries_balancetes["contabil"] = "-"

        # ----
        df_all_balancetes = df_all_balancetes.drop_duplicates(subset=["id_empresa", "obrigacao"], keep="last")
        df_all_balancetes["regime"] = "-"
        df_all_balancetes["fiscal"] = "-"
        df_all_balancetes["contabil"] = "-"

        # ----------------------------------------------- LANÇADO -----------------------------------------------

        df_all_companies["lancado_meses_atraso"] = 0
        df_all_companies["lancado_dt_entrega"] = "-"
        df_all_companies["lancado_comp"] = "-"
        df_all_companies["lancado_status_entrega"] = "-"
        # ----------------------------------------------- MENSAL -----------------------------------------------
        df_all_companies["mensal_meses_atraso"] = "-"
        df_all_companies["mensal_dt_entrega"] = "-"
        df_all_companies["mensal_comp"] = "-"
        df_all_companies["mensal_status_entrega"] = "-"

        # ----------------------------------------------- PERÍODO -----------------------------------------------
        df_all_companies["periodo_meses_atraso"] = 0
        df_all_companies["periodo_comp"] = "-"
        df_all_companies["periodo_DT"] = "-"
        df_all_companies["periodo_status"] = "-"

        # df_all_companies["periodo_mes"] = "-"
        # df_all_companies["periodo_ano"] = "-"
        
        # resumo_balancete_lancado    = list()
        # resumo_balancete_mensal     = list()

        df_balancete_lancado                = df_all_balancetes[df_all_balancetes["obrigacao"] == "BALANCETE LANÇADO"].sort_values(by="meses_atraso", ascending=False)
        df_balancete_mensal                 = df_all_balancetes[df_all_balancetes["obrigacao"] == "BALANCETE MENSAL"].sort_values(by="meses_atraso", ascending=False)
        df_balancete_lancado.index          = list(range(0, len(df_balancete_lancado.index)))
        df_balancete_mensal.index           = list(range(0, len(df_balancete_mensal.index)))
        df_all_deliveries_balancetes.index  = list(range(0, len(df_all_deliveries_balancetes.index)))

        for i in df_all_companies.index:

            id_acessorias_all_comp = df_all_companies["id_acessorias"][i]
            regime_acessorias = df_all_companies["regime"][i]
            fiscal_acessorias = df_all_companies["fiscal"][i]
            contabil_acessorias = df_all_companies["contabil"][i]
            

            # print(f"""
            #     ---------------------------------------------------------
            #     >>> id_acessorias_all_comp: {id_acessorias_all_comp}
            #     >>> regime_acessorias: {regime_acessorias}
            #     >>> fiscal_acessorias: {fiscal_acessorias}
            #     >>> contabil_acessorias: {contabil_acessorias}
            # """)

            entrega_lancado = df_balancete_lancado[df_balancete_lancado["id_empresa"] == id_acessorias_all_comp]
            entrega_mensal = df_balancete_mensal[df_balancete_mensal["id_empresa"] == id_acessorias_all_comp]
            deliveries_balancetes = df_all_deliveries_balancetes[df_all_deliveries_balancetes["id_empresa"] == id_acessorias_all_comp]



            if len(entrega_lancado) > 0:

                lancado_meses_atraso    = entrega_lancado["meses_atraso"].values[0]
                lancado_dt_entrega      = entrega_lancado["dt_entrega"].values[0]
                lancado_comp            = entrega_lancado["competencia"].values[0]
                lancado_status_entrega  = entrega_lancado["status_entrega"].values[0]
                # ----
                df_all_companies["lancado_meses_atraso"][i]     = lancado_meses_atraso
                df_all_companies["lancado_dt_entrega"][i]       = lancado_dt_entrega
                df_all_companies["lancado_comp"][i]             = lancado_comp
                df_all_companies["lancado_status_entrega"][i]   = lancado_status_entrega
                # ----
                df_balancete_lancado.loc[ df_balancete_lancado["id_empresa"] == id_acessorias_all_comp,  "regime"] = regime_acessorias
                df_balancete_lancado.loc[ df_balancete_lancado["id_empresa"] == id_acessorias_all_comp,  "fiscal"] = fiscal_acessorias
                df_balancete_lancado.loc[ df_balancete_lancado["id_empresa"] == id_acessorias_all_comp,  "contabil"] = contabil_acessorias

            
            # --------------------------------------------------------------------
            if len(entrega_mensal) > 0:

                mensal_meses_atraso = df_all_companies["regime"][i]
                mensal_meses_atraso = df_all_companies["fiscal"][i]
                mensal_meses_atraso = df_all_companies["contabil"][i]

                mensal_meses_atraso     = entrega_mensal["meses_atraso"].values[0]
                mensal_dt_entrega       = entrega_mensal["dt_entrega"].values[0]
                mensal_comp             = entrega_mensal["competencia"].values[0]
                mensal_status_entrega   = entrega_mensal["status_entrega"].values[0]

                df_all_companies["mensal_meses_atraso"][i]      = mensal_meses_atraso
                df_all_companies["mensal_dt_entrega"][i]        = mensal_dt_entrega
                df_all_companies["mensal_comp"][i]              = mensal_comp
                df_all_companies["mensal_status_entrega"][i]    = mensal_status_entrega
                # ----
                df_balancete_mensal.loc[ df_balancete_mensal["id_empresa"] == id_acessorias_all_comp,  "regime"] = regime_acessorias
                df_balancete_mensal.loc[ df_balancete_mensal["id_empresa"] == id_acessorias_all_comp,  "fiscal"] = fiscal_acessorias
                df_balancete_mensal.loc[ df_balancete_mensal["id_empresa"] == id_acessorias_all_comp,  "contabil"] = contabil_acessorias
            
            # --------------------------------------------------------------------
            if len(deliveries_balancetes) > 0:

                # ----
                df_all_deliveries_balancetes.loc[ df_all_deliveries_balancetes["id_empresa"] == id_acessorias_all_comp,  "regime"] = regime_acessorias
                df_all_deliveries_balancetes.loc[ df_all_deliveries_balancetes["id_empresa"] == id_acessorias_all_comp,  "fiscal"] = fiscal_acessorias
                df_all_deliveries_balancetes.loc[ df_all_deliveries_balancetes["id_empresa"] == id_acessorias_all_comp,  "contabil"] = contabil_acessorias





            # --------------------------------------------------------------------
            # --------> VALIDA PERÍODO PARA DESTACAR NA TABELA DE EMPRESA
            if df_all_companies["lancado_dt_entrega"][i] == "-":

                df_all_companies["periodo_meses_atraso"][i] = df_all_companies["mensal_meses_atraso"][i]
                df_all_companies["periodo_DT"][i] = df_all_companies["mensal_dt_entrega"][i]
                df_all_companies["periodo_status"][i] = df_all_companies["mensal_status_entrega"][i]
                df_all_companies["periodo_comp"][i] = df_all_companies["mensal_comp"][i]


            elif df_all_companies["lancado_dt_entrega"][i] != "-":
                if df_all_companies["mensal_dt_entrega"][i] != "-":
                    df_all_companies["periodo_meses_atraso"][i] = df_all_companies["mensal_meses_atraso"][i]
                    df_all_companies["periodo_DT"][i] = df_all_companies["mensal_dt_entrega"][i]
                    df_all_companies["periodo_status"][i] = df_all_companies["mensal_status_entrega"][i]
                    df_all_companies["periodo_comp"][i] = df_all_companies["mensal_comp"][i]

                else:
                    df_all_companies["periodo_meses_atraso"][i] = df_all_companies["lancado_meses_atraso"][i]
                    df_all_companies["periodo_DT"][i] = df_all_companies["lancado_dt_entrega"][i]
                    df_all_companies["periodo_status"][i] = df_all_companies["lancado_status_entrega"][i]
                    df_all_companies["periodo_comp"][i] = df_all_companies["lancado_comp"][i]


        df_all_companies = self.extract_month_year_and_regime(
            dataframe=df_all_companies,
            extract_from_column="periodo_comp",
            column_name_month="periodo_mes_comp",
            column_name_year="periodo_ano_comp")
        # ----
        df_balancete_lancado = self.extract_month_year_and_regime(
            dataframe=df_balancete_lancado,
            extract_from_column="competencia",
            column_name_month="mes_comp",
            column_name_year="ano_comp")
        # ----
        df_balancete_mensal = self.extract_month_year_and_regime(
            dataframe=df_balancete_mensal,
            extract_from_column="competencia",
            column_name_month="mes_comp",
            column_name_year="ano_comp")
        # ----
        df_all_deliveries_balancetes = self.extract_month_year_and_regime(
            dataframe=df_all_deliveries_balancetes,
            extract_from_column="dt_entrega",
            column_name_month="mes_comp",
            column_name_year="ano_comp",
            add_day_init=False)
        

        

        lancado_tt_fora_prazo = len(df_all_companies[df_all_companies["lancado_status_entrega"] == "fora-prazo"])
        lancado_tt_dentro_prazo = len(df_all_companies[df_all_companies["lancado_status_entrega"] == "dentro-prazo"])
        mensal_tt_fora_prazo = len(df_all_companies[df_all_companies["mensal_status_entrega"] == "fora-prazo"])
        mensal_tt_dentro_prazo = len(df_all_companies[df_all_companies["mensal_status_entrega"] == "dentro-prazo"])

        # -----------------------------------
        # ------ visão geral balancetes ------
        tt_balancete_dentro_prazo = len(df_all_companies[df_all_companies["periodo_status"] == "dentro-prazo"])
        tt_balancete_fora_prazo = len(df_all_companies[df_all_companies["periodo_status"] == "fora-prazo"])


        

        tt_companies = len(df_all_companies)
        tt_companies_MEI = len(df_all_companies[df_all_companies['regime'].str.contains('MEI')])
        tt_companies_NORMAL = len(df_all_companies[~df_all_companies['regime'].str.contains('MEI')])
        # ----
        mes_comp = self.list_month[(datetime.now() - timedelta(days=30)).month -1]
        ano_comp = (datetime.now() - timedelta(days=30)).year
        competencia_atual = f"{mes_comp}/{ano_comp}"


        print("\n\n\n ------------------------ prepare_dataframe_all_companies_and_balancetes/df_all_companies ------------------------ ")
        print(df_all_companies)
        print("\n\n\n ------------------------ prepare_dataframe_all_companies_and_balancetes/df_all_balancetes ------------------------ ")
        print(df_all_balancetes[["id", "obrigacao", "id_empresa", "empresa", "cnpj", "data_da_entrega", "competencia", "competencia_DATETIME", "dias_atraso", "meses_atraso", "status_entrega"]])
        print(f"""
            -----------------------
            >>> competencia_atual: {competencia_atual}
            -----------------------
            lancado_tt_fora_prazo: {lancado_tt_fora_prazo}
            lancado_tt_dentro_prazo: {lancado_tt_dentro_prazo}
            -----------------------
            mensal_tt_fora_prazo: {mensal_tt_fora_prazo}
            mensal_tt_dentro_prazo: {mensal_tt_dentro_prazo}
            -----------------------
            tt_balancete_dentro_prazo: {tt_balancete_dentro_prazo}
            tt_balancete_fora_prazo: {tt_balancete_fora_prazo}""")
        

        # for i in df_all_deliveries_balancetes.index:

        df_all_deliveries_balancetes.sort_values(by=[ "empresa", "competencia_DATETIME", "data_da_entrega_DATETIME"], inplace=True)
        df_all_deliveries_balancetes.index  = list(range(0, len(df_all_deliveries_balancetes.index)))



        # ----------------------------------------------------------------------------------------------------------------------------------
        list_id_empresa_unique = list(df_all_deliveries_balancetes.drop_duplicates(subset=["id_empresa"], keep="last")["id_empresa"].values)
        print(" ----------------------------- list_id_empresa_unique ----------------------------- ")
        print(list_id_empresa_unique)
        df_all_deliveries_balancetes["diferenca_meses_COMP"] = "-"
        df_all_deliveries_balancetes["diferenca_meses_DT_entrega"] = "-"
        df_all_deliveries_balancetes["indice_calculo"] = "-"

        for id_company in list_id_empresa_unique:
           
           
            df_aux = df_all_deliveries_balancetes[ df_all_deliveries_balancetes["id_empresa"] == id_company ]
            count_aux = 0
            for i in df_aux.index:

                if count_aux == 0:

                    df_all_deliveries_balancetes["diferenca_meses_COMP"][i]         = "origem"
                    df_all_deliveries_balancetes["diferenca_meses_DT_entrega"][i]   = "origem"
                    df_all_deliveries_balancetes["indice_calculo"][i]               = "origem"

                elif count_aux >= 1:

                    df_all_deliveries_balancetes["diferenca_meses_COMP"][i] = (
                        df_aux["competencia_DATETIME"][i].year - df_aux["competencia_DATETIME"][i-1].year) * 12 + (df_aux["competencia_DATETIME"][i].month - df_aux["competencia_DATETIME"][i-1].month)
                    # ----
                    df_all_deliveries_balancetes["diferenca_meses_DT_entrega"][i] = (df_aux["data_da_entrega_DATETIME"][i].year - df_aux["data_da_entrega_DATETIME"][i-1].year) * 12 + (df_aux["data_da_entrega_DATETIME"][i].month - df_aux["data_da_entrega_DATETIME"][i-1].month)
                    # ----
                    df_all_deliveries_balancetes["indice_calculo"][i] = df_aux["id"][i-1]
                
                count_aux += 1





            # competencia_DATETIME = df_all_deliveries_balancetes["competencia_DATETIME"][i]
            # data_da_entrega_DATETIME = df_all_deliveries_balancetes["data_da_entrega_DATETIME"][i]
    
        try:
            df_all_deliveries_balancetes.to_excel("df_all_deliveries_balancetes.xlsx")
        except:
            pass



        # print(df_all_companies)
        # print(df_all_companies.info())
        obj_all_companies = df_all_companies.to_dict("index")
        obj_balancete_lancado = df_balancete_lancado.to_dict("index")
        obj_balancete_mensal = df_balancete_mensal.to_dict("index")
        obj_all_deliveries_balancetes = df_all_deliveries_balancetes.to_dict("index")


        # list_months = list(df_all_companies.drop_duplicates(subset=["periodo_mes_comp"], keep="last")["periodo_mes_comp"].values)
        # list_years = list(df_all_companies.drop_duplicates(subset=["periodo_ano_comp"], keep="last")["periodo_ano_comp"].values)
        
        data = {
            # "list_months": list_months,
            # "list_years": list_years,
            
            "competencia_atual": competencia_atual,
            "tt_companies": tt_companies,
            "tt_companies_MEI": tt_companies_MEI,
            "tt_companies_NORMAL": tt_companies_NORMAL,

            "obj_all_companies": obj_all_companies,
            "obj_balancete_lancado": obj_balancete_lancado,
            "obj_balancete_mensal": obj_balancete_mensal,
            "obj_all_deliveries_balancetes": obj_all_deliveries_balancetes,


            "lancado_tt_fora_prazo": lancado_tt_fora_prazo,
            "lancado_tt_dentro_prazo": lancado_tt_dentro_prazo,
            "mensal_tt_fora_prazo": mensal_tt_fora_prazo,
            "mensal_tt_dentro_prazo": mensal_tt_dentro_prazo,
            "tt_balancete_dentro_prazo": tt_balancete_dentro_prazo,
            "tt_balancete_fora_prazo": tt_balancete_fora_prazo,

        }
        # print(data)
        # df_balancete_lancado.to_excel("df_balancete_lancado.xlsx")
        # df_balancete_mensal.to_excel("df_balancete_mensal.xlsx")
        # df_all_companies.to_excel("df_all_companies.xlsx")
        return data

    
    def get_all_companies_and_balancetes(self):

        try:

            obj_all_companies = list()
            obj_balancetes = list()

            DB_all_companies = connections["db_gaulke_contabil"]
            TABLE_NAME_ALL_COMPANIES =  file["DATABASE"]["TABLE_NAME_ALL_COMPANIES"]
            TABLE_NAME_ALL_BALANCETES =  file["DATABASE"]["TABLE_NAME_ALL_BALANCETES"]

            print("\n\n\n ----------------- db_gaulke_contabil ----------------- ")
            print(DB_all_companies)
            print("\n ----------------- TABLE_NAME_ALL_COMPANIES ----------------- ")
            print(TABLE_NAME_ALL_COMPANIES)
            print("\n ----------------- TABLE_NAME_ALL_BALANCETES ----------------- ")
            print(TABLE_NAME_ALL_BALANCETES)
            print("\n\n")

            with DB_all_companies.cursor() as cursor:

                cursor.execute(f'SELECT id_acessorias, cnpj, razao_social, fiscal, contabil, pessoal, tags, regime, id FROM {TABLE_NAME_ALL_COMPANIES} order by razao_social ASC;')
                rows = cursor.fetchall()
                for result in rows:
                    obj_all_companies.append(
                        {
                            "id_acessorias":    result[0],
                            "cnpj":             result[1],
                            "razao_social":     result[2],
                            "fiscal":           result[3],
                            "contabil":         result[4],
                            "pessoal":          result[5],
                            "tags":             result[6],
                            "regime":           result[7],
                            "id_database":      result[8],
                        })
                

                # --------------------------------------------------------------------------------------
                # ----------------------------- TABLE_NAME_ALL_BALANCETES ------------------------------
                cursor.execute(f'SELECT * FROM {TABLE_NAME_ALL_BALANCETES};')
                rows = cursor.fetchall()
                for result in rows:
                    obj_balancetes.append(
                        {
                            "id":                   result[0],
                            "obrigacao":            result[1],
                            "tipo":                 result[2],
                            "empresa":              result[3],
                            "id_empresa":           result[4],
                            "cnpj":                 result[5],
                            "cidade":               result[6],
                            "estado":               result[7],
                            "prazo_legal":          result[8],
                            "prazo_tecnico":        result[9],
                            "data_da_entrega":      result[10],
                            "status":               result[11],
                            "departamento":         result[12],
                            "responsavel_tecnico":  result[13],
                            "responsavel_entrega":  result[14],
                            "competencia":          result[15],
                            "protocolo":            result[16],
                            "update_at":            result[17],
                        })
                    

            df_all_companies = pd.DataFrame.from_dict(data=obj_all_companies, orient="columns")
            df_all_balancetes = pd.DataFrame.from_dict(data=obj_balancetes, orient="columns")
            # df_all_companies.to_excel("df_all_companies.xlsx")
            # df_all_balancetes.to_excel("df_all_balancetes.xlsx")

            data_all_companies = self.prepare_dataframe_all_companies_and_balancetes(df_all_companies=df_all_companies, df_all_balancetes=df_all_balancetes)
            # ----

            resume_deliveries_regime = self.resume_deliveries_regime(df_all_companies=df_all_companies)
            resume_deliveries_meses = self.resume_deliveries_meses(df_all_companies=df_all_companies)
            
            data_all_companies.update({
                "resume_deliveries_regime": resume_deliveries_regime
            })
            data_all_companies.update({
                "resume_deliveries_meses": resume_deliveries_meses
            })
            
            return {
                "data_all_companies": data_all_companies,
            }
        
        except Exception as e:
            print(f" ### ERROR CGET ALL COMPANIES | ERROR: {e}")
            return None