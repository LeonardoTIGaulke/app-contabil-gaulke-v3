// --------------------------------------------------------------------------------------------------------

function update_filter_company_names(update_cards, update_chart){

    let request, all_companies, all_companies_lancados;

    request = getAllCompanies("companies").then((data) => {

        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            all_companies = event.target.result;
            update_table_all_companies(true, 20, all_companies, true);
        }
    });
    // ----
    request = getAllCompanies("balancete_lancado", "meses_atraso").then((data) => {
        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            all_companies_lancados = event.target.result;
            update_table_balancetes_lancados(true, 8, all_companies_lancados);
        }
    });
    // ----
    request = getAllCompanies("balancete_mensal", "meses_atraso").then((data) => {
        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            all_companies_mensal = event.target.result;
            update_table_balancetes_mensais(true, 8, all_companies_mensal);
        }
    });
    // ----
    request = getAllCompanies("all_deliveries_balancetes", "meses_atraso_historico").then((data) => {
        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            all_deliveries_balancetes = event.target.result;
            update_table_all_deliveries_balancetes(true, 20, all_deliveries_balancetes, update_chart);
        }
    });
    // ----
    request = getAllCompanies("data_matriz_apont_horas").then((data) => {
        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            data_matriz_apont_horas = event.target.result;
            let tempo_matriz = calcularTempo(data_matriz_apont_horas).then((data)=>{
                // console.log(data)
            });
        }
    });
}

// ----------------------------------
async function calcularTempo(data_matriz_apont_horas) {

    let arr_id_filter = await checkValuesMratizApontHoras(data_matriz_apont_horas);
    console.log("\n\n ----------------------------------------- arr_id_filter ----------------------------------------- ")
    console.log(arr_id_filter)


    let data_matriz = new Array();
    let arr_check_colab = new Array();
    let data_colaborador = new Array();

    for (let i in  data_matriz_apont_horas){

        // console.log(`
        //     -------------------- | includes: ${i} | type: ${typeof(i)}
        // `)
        if (arr_id_filter.includes(i)){

            let colab = await data_matriz_apont_horas[i]["username"];
            let tempo = await data_matriz_apont_horas[i]["tempo"];
    
    
            let [horas, minutos] = await tempo.split(':');
    
            if (!arr_check_colab.includes(colab)){
                
                if (parseInt(horas) && parseInt(minutos) >= 0){
    
                    data_colaborador[colab] = await {
                        "data": [data_matriz_apont_horas[i]],
                        "horas_totais": parseInt(horas),
                        "minutos_totais": parseInt(minutos),
                    }
    
                } else {
                    data_colaborador[colab] = await {
                        "data": [data_matriz_apont_horas[i]],
                        "horas_totais": 0,
                        "minutos_totais": 0,
                    }
                }
                
                arr_check_colab.push(colab);
                
            } else {
                
                await data_colaborador[colab]["data"].push(data_matriz_apont_horas[i]);
    
                if (parseInt(horas) && parseInt(minutos) >=0 ) {
                    data_colaborador[colab]["horas_totais"] += parseInt(horas);
                    data_colaborador[colab]["minutos_totais"] += parseInt(minutos);
                }
                
            }
            await data_matriz.push(tempo);
        }
    }


    // console.log(" ------------------- data_colaborador ------------------- ")
    // console.log(data_colaborador)
    
    for ( let colab in data_colaborador){

        console.log(` ---------------- data_colaborador | colab: ${colab} ---------------- `)
        let data = data_colaborador[colab];
        let data_apont = data["data"];
        let horas_totais    = data["horas_totais"];
        let minutos_totais  = data["minutos_totais"];

        let tt_horas = 0;
        let tt_minutos = 0;

  
        for (let i in data_apont){
            let id_aux = String(data_apont[i]["id"]);

            if( arr_id_filter.includes( id_aux )) {
                tt_horas += parseInt(horas_totais);
                tt_minutos += parseInt(minutos_totais);
            } 
        }

        data["horas_totais"] = await tt_horas;
        data["minutos_totais"] = await tt_minutos;

        console.log(`
            ------------------------------------
            horas_totais: ${horas_totais}
            minutos_totais: ${minutos_totais}
            ------------------
            tt_horas: ${tt_horas}
            tt_minutos: ${tt_minutos}

        `)
        
    
    }
    // let totalHoras = 0;
    // let totalMinutos = 0;

    // // for (let i in data["data"]){

    // //     id_aux = String(data["data"][i]["id"]);

    // //     if (arr_id_filter.includes(id_aux)){
            
    // //         if (parseInt(totalHoras) >= 0 && parseInt(totalMinutos) >= 0){

    // //             totalHoras += data["data"][i]["horas_totais"];
    // //             totalMinutos += data["data"][i]["minutos_totais"];

    // //             console.log(`
    // //                 >> id_aux: ${id_aux}
    // //                 >> colab: ${colab}
    // //                 >> totalHoras: ${totalHoras}
    // //                 >> totalMinutos: ${totalMinutos}
    // //             `)
    // //         }

    // //     }
    // // }
    

    // if (totalMinutos >= 60) {
    //     const minutosExtrasColab = Math.floor(totalMinutos / 60);
    //     totalHoras += minutosExtrasColab;
    //     totalMinutos = totalMinutos % 60;
    // }
    
    // data["horas_totais"] = totalHoras;
    // data["minutos_totais"] = totalMinutos;
    

    // let resume_apont_colab = `Total: ${h} horas e ${m} minutos | tempo: ${tempo_tt} | tt_apont: ${tt_apont}`;
    // console.log(resume_apont_colab)
    

    // console.log(" ------------ data_colaborador ajustado ------------ ")
    // console.log(data_colaborador)
    // create_chart_900(data_colaborador);


        // // --------------------------------------------------------------------------------------
        // let totalHoras = 0;
        // let totalMinutos = 0;
      
        // for (const tempo of await data_matriz) {
        //     const [horas, minutos] = await tempo.split(':'); // Dividir o tempo em horas e minutos
        //     if(parseInt(horas) >= 0 && parseInt(minutos) >= 0){
        //         totalHoras += await parseInt(horas);
        //         totalMinutos += await parseInt(minutos);
        //     }
        // }
    
        // // Se os minutos excederem 60, ajustar as horas e minutos
        // if (totalMinutos >= 60) {
        //     const minutosExtras = await Math.floor(totalMinutos / 60);
        //     totalHoras += await minutosExtras;
        //     totalMinutos = await totalMinutos % 60;
        // }
    
    
        // let resume_geral = `Total: ${totalHoras} horas e ${totalMinutos} minutos`;
        // console.log(resume_geral)
        // return await resume_geral;
    // });




    
}







function updateCards_Resume_Totais(
        tt_companies, tt_companies_NORMAL, tt_companies_MEI,
        tt_geral_atraso, tt_geral_sem_atraso, soma_geral_meses_atraso,
        tt_atraso_mensal, tt_sem_atraso_mensal,
        tt_atraso_lancado, tt_sem_atraso_lancado) {
        

    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // >>>>>>>>>>>>>>>>>>>>>>> analisar esses KPI's para implementar nos cards principais. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
    // 01 =====> Taxa de Cumprimento de Prazo (TCP): Essa métrica mede a proporção de tarefas concluídas dentro do prazo em relação ao total de tarefas.
    // calculo:
    // TCP = tt_dentro_prazo / tt_dentro_prazo + tt_fora_prazo
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // 02 =====> Taxa de Atraso (TA): Essa métrica mede a proporção de tarefas concluídas fora do prazo em relação ao total de tarefas.
    // calculo:
    // TCP = tt_fora_prazo / tt_dentro_prazo + tt_fora_prazo

    // ------------------------------------------------------------------------------------------------------------------------------------------------

    
    let indice_eficiencia_operacional = 0;
    if (tt_companies > 0 ){
        indice_eficiencia_operacional = ( soma_geral_meses_atraso/tt_companies).toFixed(2);
    }
    
    document.querySelector(`[data-card-resume="1"]`).querySelectorAll("span")[1].innerText = `${tt_companies}`;
    document.querySelector(`[data-card-resume="2"]`).querySelectorAll("span")[1].innerText = `${tt_companies_NORMAL}`;
    document.querySelector(`[data-card-resume="3"]`).querySelectorAll("span")[1].innerText = `${tt_companies_MEI}`;
    
    document.querySelector(`[data-details-charts="info-visao-geral-regime"]`).querySelectorAll("span")[1].innerText = `${soma_geral_meses_atraso}`;
    document.querySelector(`[data-details-charts="info-visao-geral-tt-atraso"]`).querySelectorAll("span")[1].innerText = `${tt_geral_atraso}`;
    document.querySelector(`[data-details-charts="info-visao-geral-tt-sem-atraso"]`).querySelectorAll("span")[1].innerText = `${tt_geral_sem_atraso}`;
    document.querySelector(`[data-details-charts="info-visao-geral-indice-eficiencia-operacional"]`).querySelectorAll("span")[1].innerText = `${indice_eficiencia_operacional}`;
    // document.querySelector(`["data-tt-rows-resume="rows-all-companies"]`).querySelectorAll("span")[1].innerText = `${tt_companies}`;
    
    

    create_chart_0(tt_geral_sem_atraso, tt_geral_atraso);
    create_chart_01(tt_sem_atraso_mensal, tt_atraso_mensal);
    create_chart_02(tt_sem_atraso_lancado, tt_atraso_lancado);
}

function updateCards_Resume_Totais_02(
        tt_companies, tt_companies_NORMAL, tt_companies_MEI,
        acum_diff_comp, acum_diff_entregas
        ) {
        

    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // >>>>>>>>>>>>>>>>>>>>>>> analisar esses KPI's para implementar nos cards principais. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
    // 01 =====> Taxa de Cumprimento de Prazo (TCP): Essa métrica mede a proporção de tarefas concluídas dentro do prazo em relação ao total de tarefas.
    // calculo:
    // TCP = tt_dentro_prazo / tt_dentro_prazo + tt_fora_prazo
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // 02 =====> Taxa de Atraso (TA): Essa métrica mede a proporção de tarefas concluídas fora do prazo em relação ao total de tarefas.
    // calculo:
    // TCP = tt_fora_prazo / tt_dentro_prazo + tt_fora_prazo

    // ------------------------------------------------------------------------------------------------------------------------------------------------
    
    document.querySelector(`[data-card-resume="100"]`).querySelectorAll("span")[1].innerText = `${tt_companies}`;
    document.querySelector(`[data-card-resume="200"]`).querySelectorAll("span")[1].innerText = `${tt_companies_NORMAL}`;
    document.querySelector(`[data-card-resume="300"]`).querySelectorAll("span")[1].innerText = `${tt_companies_MEI}`;
    document.querySelector(`[data-card-resume="400"]`).querySelectorAll("span")[1].innerText = `${acum_diff_comp}`;
    document.querySelector(`[data-card-resume="500"]`).querySelectorAll("span")[1].innerText = `${acum_diff_entregas}`;

}




function selectDatePrincipalFilter(action){

    let date_init   = document.querySelector(`[data-range-name="date-init"]`).value;
    let date_final  = document.querySelector(`[data-range-name="date-final"]`).value;

    if (date_init && date_final != ""){
        // ----
        document.querySelector(`[data-range-name="date-final"]`).min = date_init;
        // ----
        date_init_split = date_init.split("-");
        date_final_split = date_final.split("-");
        // ----
        date_init_ajd = convertToDate(date_init_split[0], date_init_split[1] -1, date_init_split[2]);
        date_final_ajd = convertToDate(date_final_split[0], date_final_split[1] -1, date_final_split[2]);
        // ----
        date_init_text = `${date_init_split[2]}/${date_init_split[1]}/${date_init_split[0]}`;
        date_final_text = `${date_final_split[2]}/${date_final_split[1]}/${date_final_split[0]}`;
        
        if (action){
            update_filter_company_names(true);
        }
        return {
            "date_init_ajd": date_init_ajd,
            "date_final_ajd": date_final_ajd,
            "date_init_text": date_init_text,
            "date_final_text": date_final_text,
        }
    }


    if (action){
        update_filter_company_names(true);
    }
    return null;
}
function getDateRangePrincipalFilter(){

    let date_init   = document.querySelector(`[data-range-name="date-init"]`).value;
    let date_final  = document.querySelector(`[data-range-name="date-final"]`).value;

    if (date_init && date_final != ""){
        // ----
        document.querySelector(`[data-range-name="date-final"]`).min = date_init;
        // ----
        date_init_split = date_init.split("-");
        date_final_split = date_final.split("-");
        // ----
        date_init_ajd = convertToDate(date_init_split[0], date_init_split[1] -1, date_init_split[2]);
        date_final_ajd = convertToDate(date_final_split[0], date_final_split[1] -1, date_final_split[2]);
        // ----
        date_init_text = `${date_init_split[2]}/${date_init_split[1]}/${date_init_split[0]}`;
        date_final_text = `${date_final_split[2]}/${date_final_split[1]}/${date_final_split[0]}`;
        
        return {
            "date_init_ajd": date_init_ajd,
            "date_final_ajd": date_final_ajd,
            "date_init_text": date_init_text,
            "date_final_text": date_final_text,
        }
    }
    return null;
}



function convertToDate(year, month, day){
    date_string = new Date(year, month, day)
    return date_string;
}

function convertToPercentage(value_decimal){
    value_decimal = (value_decimal * 100).toFixed(2) + '%';
    return value_decimal;
}
// ----
function check_ID_Company_In_ListIDsCompanies(id_company) {
    if (list_id_companies.includes(id_company)){
        return true;
    }
    return false;
}
function check_ID_Company_In_ListIDs_BalancetesLancados(id_company) {
    if (list_balancetes_lancados.includes(id_company)){
        return true;
    }
    return false;
}
function check_ID_Company_In_ListIDs_BalancetesMensais(id_company) {
    if (list_balancetes_mensais.includes(id_company)){
        return true;
    }
    return false;
}
function check_ID_Company_In_ListIDs_CompanyNames(id_company) {
    if (list_id_companies_filter_by_name.includes(id_company)){
        return true;
    }
    return false;
}
function check_value_in_list(values, list) {
    if (list.includes(values)){
        return true;
    }
    return false;
}
// ----
async function add_List_IDs_Companies(id_company) {
    if (!list_id_companies.includes(id_company)){
        list_id_companies.push(id_company);
        return true;
    }
    return false;
}
async function add_List_IDs_All_Deliveries_Balancetes(id_company) {
    if (!list_id_database_deliveries_balancetes.includes(id_company)){
        list_id_database_deliveries_balancetes.push(id_company);
        return true;
    }
    return false;
}
function add_List_IDs_BalancetesLancados(id_company) {
    if (!list_balancetes_lancados.includes(id_company)){
        list_balancetes_lancados.push(id_company);
        return true;
    }
    return false;
}
function add_List_IDs_BalancetesMensais(id_company) {
    if (!list_balancetes_mensais.includes(id_company)){
        list_balancetes_mensais.push(id_company);
        return true;
    }
    return false;
}
// ----
async function isInArray(value, array) {
    return array.includes(value);
}
    
async function checkCompanies(data_companies) {

    let filter_month, filter_year, filter_regime_agrup;
    filter_month = await JSON.parse( window.localStorage.getItem("filter_month") )["filter"];
    filter_year = await JSON.parse( window.localStorage.getItem("filter_year") )["filter"];
    filter_regime_agrup = await JSON.parse( window.localStorage.getItem("filter_regime_agrup") )["filter"];
    filter_type_company = await JSON.parse( window.localStorage.getItem("filter_type_company") )["filter"];
    filter_company_name = await JSON.parse( window.localStorage.getItem("filter_company_name") )["filter"];
    
    // ----

    list_id_companies_check = new Array();
    // list_filters_groups_temp = new Array();
    for (let i in data_companies){

        id_acessorias = await data_companies[i]["id_acessorias"];
        periodo_mes_comp = await data_companies[i]["periodo_mes_comp"];
        periodo_ano_comp = await String(data_companies[i]["periodo_ano_comp"]);
        regime_agrup = await String(data_companies[i]["regime_agrup"]);
        type_company = await String(data_companies[i]["type_company"]);

        const mesValido = filter_month.length === 0 || await isInArray(periodo_mes_comp, filter_month);
        const anoValido = filter_year.length === 0 || await isInArray(periodo_ano_comp, filter_year);
        const regimeValido = filter_regime_agrup.length === 0 || await isInArray(regime_agrup, filter_regime_agrup);
        const typeCompanyValido = filter_type_company.length === 0 || await isInArray(type_company, filter_type_company);
        const id_by_name_company_valido = filter_company_name.length === 0 || await isInArray(String(id_acessorias), filter_company_name);

        if (mesValido && anoValido && regimeValido && typeCompanyValido && id_by_name_company_valido) {

            await list_id_companies_check.push(id_acessorias);

        }
    }
    return await list_id_companies_check;
}
async function checkBalancete(data_companies) {

    let filter_month, filter_year, filter_regime_agrup, filter_groups;
    
    filter_month = await JSON.parse( window.localStorage.getItem("filter_month") )["filter"];
    filter_year = await JSON.parse( window.localStorage.getItem("filter_year") )["filter"];
    filter_regime_agrup = await JSON.parse( window.localStorage.getItem("filter_regime_agrup") )["filter"];
    filter_groups = await [filter_month, filter_year, filter_regime_agrup];
    filter_type_company = await JSON.parse( window.localStorage.getItem("filter_type_company") )["filter"];
    filter_company_name = await JSON.parse( window.localStorage.getItem("filter_company_name") )["filter"];
    // ----

    list_id_companies_check = new Array();
    // list_filters_groups_temp = new Array();
    for (let i in data_companies){

        id_acessorias = await data_companies[i]["id_empresa"];
        periodo_mes_comp = await data_companies[i]["mes_comp"];
        periodo_ano_comp = await String(data_companies[i]["ano_comp"]);
        regime_agrup = await String(data_companies[i]["regime_agrup"]);
        meses_atraso = String(data_companies[i]["meses_atraso"]);
        type_company = await String(data_companies[i]["type_company"]);
        
        
        const mesValido = filter_month.length === 0 || await isInArray(periodo_mes_comp, filter_month);
        const anoValido = filter_year.length === 0 || await isInArray(periodo_ano_comp, filter_year);
        const regimeValido = filter_regime_agrup.length === 0 || await isInArray(regime_agrup, filter_regime_agrup);
        const typeCompanyValido = filter_type_company.length === 0 || await isInArray(type_company, filter_type_company);
        const id_by_name_company_valido = filter_company_name.length === 0 || await isInArray(String(id_acessorias), filter_company_name);

        if (mesValido && anoValido && regimeValido && meses_atraso > 1 && typeCompanyValido && id_by_name_company_valido) {

            await list_id_companies_check.push(id_acessorias);

        }
    }
    return await list_id_companies_check;
}

async function checkAllDeliveriesBalancete(data_companies) {

    let filter_month, filter_year, filter_regime_agrup, filter_type_company, filter_company_name, filter_id_database_deliveries_balancetes;
    let rows_table, id_database_in_table;
    let list_id_database_in_table = new Array();

    let status_range_date = false;
    let date_range = selectDatePrincipalFilter(false);

    if (date_range != null){

        // ----
        let date_init_ajd   = date_range["date_init_ajd"];
        let date_final_ajd  = date_range["date_final_ajd"];
        // ----
        let date_init_text  = date_range["date_init_text"];
        let date_final_text = date_range["date_final_text"];

    } else {
        status_range_date = true;
    }



    filter_month = await JSON.parse( window.localStorage.getItem("filter_month") )["filter"];
    filter_year = await JSON.parse( window.localStorage.getItem("filter_year") )["filter"];
    filter_regime_agrup = await JSON.parse( window.localStorage.getItem("filter_regime_agrup") )["filter"];

    filter_type_company = await JSON.parse( window.localStorage.getItem("filter_type_company") )["filter"];
    filter_company_name = await JSON.parse( window.localStorage.getItem("filter_company_name") )["filter"];
    filter_id_database_deliveries_balancetes = await JSON.parse( window.localStorage.getItem("filter_id_database_deliveries_balancetes") )["filter"];

    filter_colaborador = await JSON.parse( window.localStorage.getItem("filter_colaborador") )["filter"];
    // filter_colaborador = new Array();
    // await document.querySelectorAll("[data-checkbox-colab]").forEach((data)=>{
    //     name_colab = data.getAttribute("data-checkbox-colab");
    //     filter_colaborador.push(name_colab);
    // });

    table_rows_table = await document.querySelector(".table-all-deliveries-balancetes").querySelector("table").querySelector("tbody");
    rows_table = await table_rows_table.querySelectorAll("tr");

    // console.log(" ------------ list_id_database_in_table ------------ ")
    // console.log(await rows_table)

    try {
        for (let i = 0; i < rows_table.length; i++){
            id_database_in_table = await row[i].getAttribute("data-row-id-database-deliveries-balancetes");
            await list_id_database_in_table.push(parseInt(id_database_in_table));
        }
        
    } catch (error) {};


    // ----

    list_id_companies_check = new Array();
    // list_filters_groups_temp = new Array();
    for (let i in data_companies){

        id_database = await parseInt(data_companies[i]["id"]);
        id_acessorias = await String(data_companies[i]["id_empresa"]);
        // ----
        periodo_mes_comp = await data_companies[i]["mes_comp"];
        periodo_ano_comp = await String(data_companies[i]["ano_comp"]);
        regime_agrup = await String(data_companies[i]["regime_agrup"]);
        meses_atraso = String(data_companies[i]["meses_atraso"]);
        type_company = await String(data_companies[i]["type_company"]);
        contabil = await String(data_companies[i]["contabil"]);

        check_date_range = false;
        if (status_range_date){
            check_date_range = true;
        }
        else {

            data_da_entrega = await data_companies[i]["dt_entrega"];
            data_da_entrega_text = await data_companies[i]["dt_entrega"];

            if(data_da_entrega != "-"){
                data_da_entrega_split = data_da_entrega.split("/");
                data_da_entrega = await convertToDate(data_da_entrega_split[2], data_da_entrega_split[1]-1, data_da_entrega_split[0]);

                if (data_da_entrega >= date_init_ajd && data_da_entrega <= date_final_ajd) {
                    check_date_range = true;
                }
            }
        }
        
        

        const idAcessoriasValido = filter_company_name.length === 0 || await isInArray(id_acessorias, filter_company_name);
        const id_databaseValido = filter_id_database_deliveries_balancetes.length === 0 || await isInArray(id_database, filter_id_database_deliveries_balancetes);
        const id_database_in_tableValido = await isInArray(id_database, list_id_database_in_table); // list_id_database_in_table.length === 0 || 
        // ----
        const mesValido = filter_month.length === 0 || await isInArray(periodo_mes_comp, filter_month);
        const anoValido = filter_year.length === 0 || await isInArray(String(periodo_ano_comp), filter_year);
        const regimeValido = filter_regime_agrup.length === 0 || await isInArray(regime_agrup, filter_regime_agrup);
        const typeCompanyValido = filter_type_company.length === 0 || await isInArray(type_company, filter_type_company);
        // ----
        const contabilValido = filter_colaborador.length === 0 || await isInArray(contabil, filter_colaborador);
        
        // && id_databaseValido
        // id_database_in_tableValido
        if (list_id_database_in_table.length === 0) {

            // if ( idAcessoriasValido && id_databaseValido && mesValido && anoValido && regimeValido && typeCompanyValido && contabilValido && check_date_range) {
            if ( idAcessoriasValido && id_databaseValido && regimeValido && typeCompanyValido && contabilValido && check_date_range) {
                
                await list_id_companies_check.push(id_database);

            } else {
                try {document.querySelector(`[data-row-id-database-deliveries-balancetes="${id_database}"]`).remove();} catch (error) {};
            }
        } else {

            if ( idAcessoriasValido && id_databaseValido && mesValido && anoValido && regimeValido && typeCompanyValido && !id_database_in_tableValido ) {
                
                await list_id_companies_check.push(id_database);

            } else {
                try {document.querySelector(`[data-row-id-database-deliveries-balancetes="${id_database}"]`).remove();} catch (error) {};
            }
        }
    }
    return await list_id_companies_check;
}
async function checkValuesMratizApontHoras(data_apont_horas) {

    let status_range_date = false;
    let date_range = getDateRangePrincipalFilter();

    if (date_range != null){
        // ----
        let date_init_ajd   = date_range["date_init_ajd"];
        let date_final_ajd  = date_range["date_final_ajd"];
        // ----
        let date_init_text  = date_range["date_init_text"];
        let date_final_text = date_range["date_final_text"];

    } else {
        status_range_date = true;
    }


    filter_type_company = await JSON.parse( window.localStorage.getItem("filter_type_company") )["filter"];
    filter_company_name = await JSON.parse( window.localStorage.getItem("filter_company_name") )["filter"];
    filter_colaborador = await JSON.parse( window.localStorage.getItem("filter_colaborador") )["filter"];
    
    // ----

    list_id_companies_check = new Array();
    for (let i in data_apont_horas){

        id_acessorias = await String(data_apont_horas[i]["codigo_empresa"]);
        id_aux = await String(data_apont_horas[i]["id"]);
        contabil = await String(data_apont_horas[i]["username"]);
        let data_da_entrega = null;
        
        check_date_range = false;
        if (status_range_date){
            check_date_range = true;
        }
        else {

            data_da_entrega = await data_apont_horas[i]["data_apont"];

            if(data_da_entrega != "-" && data_da_entrega != null){
                data_da_entrega_split = data_da_entrega.split("/");
                data_da_entrega = await convertToDate(data_da_entrega_split[2], data_da_entrega_split[1]-1, data_da_entrega_split[0]);

                if (data_da_entrega >= date_init_ajd && data_da_entrega <= date_final_ajd) {
                    check_date_range = true;
                }
            }
        }

        // ---------------------------------------------------------------------------------------------------------------
        const idAcessoriasValido = filter_company_name.length === 0 || await isInArray(id_acessorias, filter_company_name);
        // status_range_date
        if ( idAcessoriasValido && check_date_range && data_da_entrega != null) {
            
            await list_id_companies_check.push(id_aux);
            
        }
     
    }
    return await list_id_companies_check;
}


async function update_table_all_companies(drop_table, limit_rows, data_all_companies, update_cards){

    // list_id_companies = new Array();
    let table_all_companies, obj_all_companies, tbody;

    // -------------------- ordena os valores em ordem decrescente com base na quantidade de meses em atraso.
    
    data_all_companies = data_all_companies.sort((a, b) => a.razao_social - b.razao_social);
    // console.log(" ----------- data_all_companies ----------- ")
    // console.log(data_all_companies)

    table_all_companies = document.querySelector(".table-all-companies").querySelector("table");

    if (drop_table){
        list_id_companies = new Array();
        table_all_companies.querySelector("tbody").remove();
        table_all_companies.innerHTML += "<tbody></tbody>";
    }

    tbody = table_all_companies.querySelector("tbody");

    // let limit_rows = 10;
    let count_aux = 0;

    let tt_companies = 0;
    let tt_companies_NORMAL = 0;
    let tt_companies_MEI = 0;

    
    let tt_geral_atraso = 0;
    let tt_geral_sem_atraso = 0;
    let soma_geral_meses_atraso = 0;

    let tt_atraso_mensal = 0;
    let tt_sem_atraso_mensal = 0;
    let soma_meses_atraso_mensal = 0;

    let tt_atraso_lancado = 0;
    let tt_sem_atraso_lancado = 0;
    let soma_meses_atraso_lancado = 0;

    let periodo_mes_comp, periodo_ano_comp, regime_agrup;


    list_id_companies_check = await checkCompanies(data_all_companies);

    let data_to_pareto_month = {};
    let data_to_pareto_company = {};
    // ----
    let data_month_aux = new Array();
    let data_company_aux = new Array();

    const calculateBase = new Promise((resolve, reject)=>{
        for ( let i in data_all_companies ) {
            
            id_acessorias = data_all_companies[i]["id_acessorias"];
            
            check_data = list_id_companies_check.includes(id_acessorias);
            
            if ( check_data ){
                
                razao_social = data_all_companies[i]["razao_social"];
                regime_agrup = String(data_all_companies[i]["regime_agrup"]);

                periodo_mes_comp = data_all_companies[i]["periodo_mes_comp"];
                periodo_ano_comp = String(data_all_companies[i]["periodo_ano_comp"]);
                periodo_meses_atraso = data_all_companies[i]["periodo_meses_atraso"];

                periodo_DT = data_all_companies[i]["periodo_DT"];
                periodo_status = data_all_companies[i]["periodo_status"];
                periodo_comp = data_all_companies[i]["periodo_comp"];

                indMonth = months.indexOf(periodo_mes_comp);
                
                if(indMonth > -1 && periodo_mes_comp != "-"){
                    if (!data_month_aux.includes(periodo_mes_comp)){

                        data_month_aux.push(periodo_mes_comp);
                        // ----
                        data_to_pareto_month[periodo_mes_comp] = periodo_meses_atraso;

                    } else {
                        v = data_to_pareto_month[periodo_mes_comp];
                        data_to_pareto_month[periodo_mes_comp] = v + periodo_meses_atraso;
                    }
                }
                // -----------------------------------------------------------------------
                if(periodo_mes_comp != "-"){
                    // name_aux =  `(${id_acessorias}) ${razao_social}`;
                    // name_aux =  `(${id_acessorias}) ${razao_social}`;
                    data_to_pareto_company[razao_social] = periodo_meses_atraso;
                }

                if ( count_aux < limit_rows ) {
                    
                    // id_acessorias = data_all_companies[i]["id_acessorias"];
                    updateList = check_ID_Company_In_ListIDsCompanies(id_acessorias);
                    
                    if ( !updateList ) {
    
                        cnpj = data_all_companies[i]["cnpj"];
                        regime = data_all_companies[i]["regime"];
        
                        lancado_meses_atraso = data_all_companies[i]["lancado_meses_atraso"];
                        lancado_dt_entrega = data_all_companies[i]["lancado_dt_entrega"];
                        lancado_status_entrega = data_all_companies[i]["lancado_status_entrega"];
                        lancado_comp = data_all_companies[i]["lancado_comp"];
        
                        mensal_meses_atraso = data_all_companies[i]["mensal_meses_atraso"];
                        mensal_dt_entrega = data_all_companies[i]["mensal_dt_entrega"];
                        meses_status_entrega = data_all_companies[i]["mensal_status_entrega"];
                        mensal_comp = data_all_companies[i]["mensal_comp"];
                        
                        
                        let lancado_class_focus = "no-focus-data";
                        let mensal_class_focus = "no-focus-data";
                        let periodo_class_focus = "no-focus-data";
                        let comp_class_focus = "no-focus-data";
    
                        if (lancado_meses_atraso == "-") {
                            lancado_class_focus = "focus-data";
                        }
                        if (mensal_meses_atraso == "-") {
                            mensal_class_focus = "focus-data";
                        }
                        if (periodo_DT == "-") {
                            periodo_class_focus = "focus-data";
                        }
                        if (periodo_comp == "-") {
                            comp_class_focus = "focus-data";
                        }
                        
                        tbody.innerHTML += `
                            <tr data-row-id-company="${id_acessorias}">
                                <td>${id_acessorias}</td>
                                <td>${cnpj}</td>
                                <td>${razao_social}</td>
                                <td>${regime}</td>
        
                                <!--- block data generic --->
    
                                <td>
                                    <span class="info-date-deliveries" data-class-focus="${periodo_class_focus}" >${periodo_meses_atraso}</span>
                                </td>
                                <td>
                                    <span class="info-date-deliveries" data-class-focus="${periodo_class_focus}" >${periodo_DT}</span>
                                </td>
                                <td>
                                    <span data-class-focus="${periodo_class_focus}" >${periodo_comp}</span>
                                </td>
                                <td>
                                    <span class="status-${periodo_status}" >${periodo_status}</span>
                                </td>
                                <td>
                                    <i class="fa-solid fa-circle-info" data-btn-id-company="${id_acessorias}" onclick="displayMoreDetails(this);"></i>
                                </td>
                                
                            </tr>
                        `;
                        add_List_IDs_Companies(id_acessorias);
                        count_aux += 1;
                    }
                }
    
                
                // -------------------- contagem de empresas
                tt_companies += 1;
                if (data_all_companies[i]["regime"].includes("MEI")){
                    tt_companies_MEI += 1;
                } else {
                    tt_companies_NORMAL += 1;
                }
    
                // -----------------------------------------------------------------------
                // -------------------- soma a quantidade de balancetes em atraso (mensal)
                if (data_all_companies[i]["periodo_status"] == "fora-prazo"){
                    tt_geral_atraso += 1;
                    soma_geral_meses_atraso += parseInt(data_all_companies[i]["periodo_meses_atraso"]);
                }
                if (data_all_companies[i]["periodo_status"] == "dentro-prazo"){
                    tt_geral_sem_atraso += 1;
                }

                // ----
                if (data_all_companies[i]["mensal_status_entrega"] == "fora-prazo"){
                    tt_atraso_mensal += 1;
                    soma_meses_atraso_mensal += parseInt(data_all_companies[i]["mensal_meses_atraso"]);
                }
                else if (data_all_companies[i]["mensal_status_entrega"] == "dentro-prazo"){
                    tt_sem_atraso_mensal += 1;
                    // soma_meses_atraso_mensal += parseInt(data_all_companies[i]["mensal_meses_atraso"]);
                }
                // ----
                if (data_all_companies[i]["lancado_status_entrega"] == "fora-prazo"){
                    tt_atraso_lancado += 1;
                    soma_meses_atraso_lancado += parseInt(data_all_companies[i]["lancado_meses_atraso"]);
                }
                else if (data_all_companies[i]["lancado_status_entrega"] == "dentro-prazo"){
                    tt_sem_atraso_lancado += 1;
                    // soma_meses_atraso_lancado += parseInt(data_all_companies[i]["lancado_meses_atraso"]);
                }
            }
            if (tt_companies == 0){
                document.querySelector(".table-all-companies").querySelector("table").style.display = "none";
                document.querySelector(".table-all-companies").querySelector("article").style.display = "flex";
            } else {
                document.querySelector(".table-all-companies").querySelector("table").style.display = "table-row";
                document.querySelector(".table-all-companies").querySelector("article").style.display = "none";
            }
    
            
        }

        resolve(true);
    }).then((data)=>{

        option_active = window.localStorage.getItem("data_btn_option_visual");
        if (option_active != "container-tabela-info-hist-balancetes") {



            updateCards_Resume_Totais(
                tt_companies, tt_companies_NORMAL, tt_companies_MEI,
                tt_geral_atraso, tt_geral_sem_atraso, soma_geral_meses_atraso,
                tt_atraso_mensal, tt_sem_atraso_mensal,
                tt_atraso_lancado, tt_sem_atraso_lancado);

                create_chart_700(data_to_pareto_month);
                create_chart_800(data_to_pareto_company);


        }
        
    });

}

async function update_table_balancetes_lancados(drop_table, limit_rows, data_all_companies_lancados){

    let table_all_companies, tbody;
    

    // -------------------- ordena os valores em ordem decrescente com base na quantidade de meses em atraso.
    data_all_companies_lancados = data_all_companies_lancados.sort((b, a) => a.meses_atraso - b.meses_atraso);
    // console.log(" ----------- data_all_companies_lancados ----------- ")
    // console.log(data_all_companies_lancados)

    let filter_month, filter_year;
    filter_month = JSON.parse( window.localStorage.getItem("filter_month") )["filter"];
    filter_year = JSON.parse( window.localStorage.getItem("filter_year") )["filter"];

    table_all_companies = document.querySelector(".table-balancetes-lancados").querySelector("table");

    if (drop_table){
        list_balancetes_lancados = new Array();
        table_all_companies.querySelector("tbody").remove();
        table_all_companies.innerHTML += "<tbody></tbody>";
    }

    tbody = table_all_companies.querySelector("tbody");

    // let limit_rows = 10;
    let tt_companies = 0;
    let count_aux = 0;
    let periodo_mes_comp, periodo_ano_comp;

    list_id_companies_check = await checkBalancete(data_all_companies_lancados);

    for ( let i in data_all_companies_lancados ) {

        id_acessorias = data_all_companies_lancados[i]["id_empresa"];
        periodo_mes_comp = data_all_companies_lancados[i]["mes_comp"];
        periodo_ano_comp = String(data_all_companies_lancados[i]["ano_comp"]);

        check_data = list_id_companies_check.includes(id_acessorias);

        if ( check_data  ){

            if ( count_aux < limit_rows ) {
                
                updateList = false;
                
                if ( !updateList ) {
                    
                    cnpj = data_all_companies_lancados[i]["cnpj"];
                    razao_social = data_all_companies_lancados[i]["empresa"];
                    // regime = data_all_companies_lancados[i]["obrigacao"];
    
                    lancado_meses_atraso = data_all_companies_lancados[i]["meses_atraso"];
                    lancado_dt_entrega = data_all_companies_lancados[i]["dt_entrega"];
                    lancado_regime = data_all_companies_lancados[i]["regime"];
                    lancado_status_entrega = data_all_companies_lancados[i]["status_entrega"];
                    lancado_comp = data_all_companies_lancados[i]["competencia"];
    
                    let lancado_class_focus = "no-focus-data";
                    if (lancado_meses_atraso == "-") {
                        lancado_class_focus = "focus-data";
                    }
                        
                    // <td>${regime}</td>
                    tbody.innerHTML += `
                        <tr data-row-id-company="${id_acessorias}">
                            <td>${id_acessorias}</td>
                            <td>${cnpj}</td>
                            <td>${razao_social}</td>
                            <td>${lancado_regime}</td>
    
                            <td>${lancado_meses_atraso}</td>
                            <td>${lancado_comp}</td>
                            <td>
                                <span class="info-date-deliveries" data-class-focus="${lancado_class_focus}">${lancado_dt_entrega}</span>
                            </td>
                            <td>
                                <span class="status-${lancado_status_entrega}">${lancado_status_entrega}</span>
                            </td>
                            
                            <td>
                                <i class="fa-solid fa-circle-info" data-btn-id-company="${id_acessorias}" onclick="displayMoreDetails(this);"></i>
                            </td>
                            
                        </tr>
                    `;
                    add_List_IDs_BalancetesLancados(id_acessorias);
                    count_aux += 1;
                    tt_companies += 1;
                }
            }
        }

    }

    
    if (tt_companies == 0){
        document.querySelector(".table-balancetes-lancados").querySelector("table").style.display = "none";
        document.querySelector(".table-balancetes-lancados").querySelector("article").style.display = "flex";
    } else {
        document.querySelector(".table-balancetes-lancados").querySelector("table").style.display = "table-row";
        document.querySelector(".table-balancetes-lancados").querySelector("article").style.display = "none";
    }
}
    
async function update_table_balancetes_mensais(drop_table, limit_rows, data_all_companies_mensais){

    let table_all_companies, tbody;
    

    // -------------------- ordena os valores em ordem decrescente com base na quantidade de meses em atraso.
    data_all_companies_mensais = data_all_companies_mensais.sort((b, a) => a.meses_atraso - b.meses_atraso);
    // console.log(" ----------- data_all_companies_mensais ----------- ")
    // console.log(data_all_companies_mensais)

    let filter_month, filter_year;
    filter_month = JSON.parse( window.localStorage.getItem("filter_month") )["filter"];
    filter_year = JSON.parse( window.localStorage.getItem("filter_year") )["filter"];

    table_all_companies = document.querySelector(".table-balancetes-mensal").querySelector("table");

    if (drop_table){
        list_balancetes_lancados = new Array();
        table_all_companies.querySelector("tbody").remove();
        table_all_companies.innerHTML += "<tbody></tbody>";
    }

    tbody = table_all_companies.querySelector("tbody");

    // let limit_rows = 10;
    let tt_companies = 0;
    let count_aux = 0;
    let periodo_mes_comp, periodo_ano_comp;

    
    list_id_companies_check = await checkBalancete(data_all_companies_mensais);

    for ( let i in data_all_companies_mensais ) {

        id_acessorias = data_all_companies_mensais[i]["id_empresa"];
        periodo_mes_comp = data_all_companies_mensais[i]["mes_comp"];
        periodo_ano_comp = String(data_all_companies_mensais[i]["ano_comp"]);
        meses_atraso = String(data_all_companies_mensais[i]["meses_atraso"]);

        check_data = list_id_companies_check.includes(id_acessorias);

        if ( check_data ){

            if ( count_aux < limit_rows ) {
                
                updateList = false;
                
                if ( !updateList ) {

                    
                    
                    cnpj = data_all_companies_mensais[i]["cnpj"];
                    razao_social = data_all_companies_mensais[i]["empresa"];
                    // regime = data_all_companies_mensais[i]["obrigacao"];
    
                    lancado_meses_atraso = data_all_companies_mensais[i]["meses_atraso"];
                    lancado_dt_entrega = data_all_companies_mensais[i]["dt_entrega"];
                    lancado_regime = data_all_companies_mensais[i]["regime"];
                    lancado_status_entrega = data_all_companies_mensais[i]["status_entrega"];
                    lancado_comp = data_all_companies_mensais[i]["competencia"];
    
                    let lancado_class_focus = "no-focus-data";
                    if (lancado_meses_atraso == "-") {
                        lancado_class_focus = "focus-data";
                    }
                        
                    // <td>${regime}</td>
                    tbody.innerHTML += `
                        <tr data-row-id-company="${id_acessorias}">
                            <td>${id_acessorias}</td>
                            <td>${cnpj}</td>
                            <td>${razao_social}</td>
                            <td>${lancado_regime}</td>
    
                            <td>${lancado_meses_atraso}</td>
                            <td>${lancado_comp}</td>
                            <td>
                                <span class="info-date-deliveries" data-class-focus="${lancado_class_focus}">${lancado_dt_entrega}</span>
                            </td>
                            <td>
                                <span class="status-${lancado_status_entrega}">${lancado_status_entrega}</span>
                            </td>
                            
                            <td>
                                <i class="fa-solid fa-circle-info" data-btn-id-company="${id_acessorias}" onclick="displayMoreDetails(this);"></i>
                            </td>
                            
                        </tr>
                    `;
                    add_List_IDs_BalancetesLancados(id_acessorias);
                    count_aux += 1;
                    tt_companies += 1;
                }
            }
        }

    }
    if (tt_companies == 0){
        document.querySelector(".table-balancetes-mensal").querySelector("table").style.display = "none";
        document.querySelector(".table-balancetes-mensal").querySelector("article").style.display = "flex";
    } else {
        document.querySelector(".table-balancetes-mensal").querySelector("table").style.display = "table-row";
        document.querySelector(".table-balancetes-mensal").querySelector("article").style.display = "none";
    }
}
// ----
async function update_table_all_deliveries_balancetes(drop_table, limit_rows, data_all_deliveries_balancetes, update_chart=true){

    // ----
    
    let data_chart_01 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let data_chart_02 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let labels_chart = [];
    let responsaveis_contabil_chart = {};

    let table_all_companies, tbody;
    
    // -------------------- ordena os valores em ordem decrescente com base na quantidade de meses em atraso.
    data_all_deliveries_balancetes = await data_all_deliveries_balancetes.sort((b, a) => a.meses_atraso_historico - b.meses_atraso_historico);
    
    table_all_companies = await document.querySelector(".table-all-deliveries-balancetes").querySelector("table");

    if (drop_table){
        list_id_database_deliveries_balancetes = new Array();
        list_add_id_database_company_table = new Array();
        table_all_companies.querySelector("tbody").remove();
        table_all_companies.innerHTML += "<tbody></tbody>";
    }

    tbody = table_all_companies.querySelector("tbody");

    // let limit_rows = 10;
    let tt_companies = 0;
    let count_aux = 0;

    let tt_normal_company = 0;
    let tt_mei_company = 0;
    let tt_atraso = 0;
    let tt_sem_atraso = 0;
    let soma_diff_competencia_meses = 0;
    let soma_diff_entrega_meses = 0;

    let list_id_companies_check = await checkAllDeliveriesBalancete(data_all_deliveries_balancetes);
    let list_ids_companies = new Array();

    for ( let i in data_all_deliveries_balancetes ) {

        id_database     = await data_all_deliveries_balancetes[i]["id"];
        id_empresa      = await data_all_deliveries_balancetes[i]["id_empresa"];
        type_company    = await data_all_deliveries_balancetes[i]["type_company"];
        
        check_data = list_id_companies_check.includes(parseInt(id_database));
        
        if ( check_data ){

            if (!list_ids_companies.includes(id_empresa)){
                list_ids_companies.push(id_empresa);
                // ----
                if (type_company == "Normal"){
                    tt_normal_company += 1;
                } else if (type_company == "MEI"){
                    tt_mei_company += 1;
                }
            }
            
            cnpj                        = await data_all_deliveries_balancetes[i]["cnpj"];
            empresa                     = await data_all_deliveries_balancetes[i]["empresa"];
            regime                      = await data_all_deliveries_balancetes[i]["regime"];
            contabil                    = await data_all_deliveries_balancetes[i]["contabil"];
            competencia                 = await data_all_deliveries_balancetes[i]["competencia"];
            dt_entrega                  = await data_all_deliveries_balancetes[i]["dt_entrega"];

            // ----
            diferenca_meses_COMP        = await data_all_deliveries_balancetes[i]["diferenca_meses_COMP"];
            diferenca_meses_DT_entrega  = await data_all_deliveries_balancetes[i]["diferenca_meses_DT_entrega"];
            // ----
            status_entrega_historico    = await data_all_deliveries_balancetes[i]["status_entrega-historico"];
            meses_atraso_historico    = await data_all_deliveries_balancetes[i]["meses_atraso_historico"];
            // ----
            obrigacao                   = await data_all_deliveries_balancetes[i]["obrigacao"];
            // ----
            month_aux                   = await data_all_deliveries_balancetes[i]["mes_comp"];
            index_month_aux = months.indexOf(month_aux);

 
            
            if(diferenca_meses_COMP != "origem" && diferenca_meses_COMP != "-") {
                soma_diff_competencia_meses += parseInt(diferenca_meses_COMP);

                if(index_month_aux > -1 && meses_atraso_historico != "-"){
                    data_chart_01[index_month_aux] = data_chart_01[index_month_aux] += parseInt(diferenca_meses_COMP);
                    labels_chart[index_month_aux] = month_aux;

                    if(responsaveis_contabil_chart[contabil]){
                        responsaveis_contabil_chart[contabil] += parseInt(diferenca_meses_COMP);
                    } else {
                        responsaveis_contabil_chart[contabil] = parseInt(diferenca_meses_COMP);
                    }
                    
                }

            } else if (diferenca_meses_COMP === "origem") {
                soma_diff_competencia_meses += 1;
            }
            
            if(diferenca_meses_DT_entrega != "origem" && diferenca_meses_DT_entrega != "-") {

                soma_diff_entrega_meses += parseInt(diferenca_meses_DT_entrega);

                if(index_month_aux > -1 && meses_atraso_historico != "-"){
                    data_chart_02[index_month_aux] = data_chart_02[index_month_aux] += parseInt(diferenca_meses_DT_entrega);
                }

            } else if (diferenca_meses_DT_entrega === "origem") {
                soma_diff_entrega_meses += 1;
            }
            

            // if (meses_atraso_historico > 0 && meses_atraso_historico != "-"){
            //     tt_atraso += 1;
            // }
            // else if (meses_atraso_historico === 0 && meses_atraso_historico != "-"){
            //     tt_sem_atraso += 1;
            // }

            // ----

            // if ( count_aux < 100 ) {
            if ( count_aux < limit_rows ) {
                
                if (!list_add_id_database_company_table.includes(id_database)){
                    
                    list_add_id_database_company_table.push(id_database);
                    // ---------------------------------------------------------------------------------------------------------------------

                    obrigacao_data = "";
                    if (obrigacao == "BALANCETE LANÇADO"){
                        obrigacao_data = `data-obrigacao="status-BL"`;
                    } else if (obrigacao == "BALANCETE MENSAL"){
                        obrigacao_data = `data-obrigacao="status-BM"`;
                    }

                    // ---------------------------------------------------------------------------------------------------------------------
                    
                    focus_date = `data-class-focus="no-focus-data"`;
                    
                    // <td>${regime}</td>
                    tbody.innerHTML += `
                        <tr data-row-id-company="${id_empresa}" data-row-id-database-deliveries-balancetes="${id_database}">
                            
                            <td> ${id_empresa} </td>
                            <td> ${cnpj} </td>
                            <td> ${empresa} </td>
                            <td> ${regime} </td>
                            <td> ${contabil} </td>
                            <td>
                                <span ${focus_date}>
                                    ${competencia}
                                </span)
                            </td>
                            <td>
                                <span class="info-date-deliveries" ${focus_date}>
                                    ${dt_entrega}
                                </span>    
                            </td>
                            <td>
                                <span ${obrigacao_data}>
                                    ${obrigacao}
                                </span>
                            </td>
                            <td> ${diferenca_meses_COMP} </td>
                            <td> ${diferenca_meses_DT_entrega} </td>
                            <td>
                                <span class="status-${status_entrega_historico}">
                                    ${status_entrega_historico}
                                </span>
                            </td>
                            <td>
                                <i class="fa-solid fa-circle-info" data-btn-id-company="${id_database}"  onclick="displayMoreDetails_AllDeliveriesBalancetes(this);"></i>
                            </td>
                            
                        </tr>
                    `;

                    count_aux += 1;
                }

                
            }
            

            if( add_List_IDs_All_Deliveries_Balancetes(String(id_acessorias)) ){
                tt_companies += 1
            }
        }

    }


    document.querySelector(`[data-tt-rows-resume="rows-all-deliveries-balancetes"]`).querySelector("b").innerText = await `${list_id_companies_check.length}`;
    
    if (tt_companies == 0){
        document.querySelector(".table-all-deliveries-balancetes").querySelector("table").style.display = "none";
        document.querySelector(".table-all-deliveries-balancetes").querySelector("article").style.display = "flex";
    } else {
        document.querySelector(".table-all-deliveries-balancetes").querySelector("table").style.display = "table-row";
        document.querySelector(".table-all-deliveries-balancetes").querySelector("article").style.display = "none";
    }
    // ----


    
    option_active = window.localStorage.getItem("data_btn_option_visual");
    
    if (option_active == "container-tabela-info-hist-balancetes"){     
        updateCards_Resume_Totais_02(
            list_ids_companies.length, tt_normal_company, tt_mei_company,
            soma_diff_competencia_meses, soma_diff_entrega_meses);
    }

    if (update_chart){
        create_chart_500( data_chart_01, data_chart_02, labels_chart);
        create_chart_600(responsaveis_contabil_chart);
    }

}



function update_first_check_FilterCompaniesPrincipal(data_all_companies_global, data_all_deliveries_balancetes, selectVisualManual=false){

    let status_checked;
    let block_dropdown_all_companies = document.querySelector(".block-all-companies");

    let filter_company_name = new Array();
    let filter_id_database  = new Array();
    let filter_colaborador  = new Array();
    
    for (let i in data_all_companies_global) {
        id_acessorias = data_all_companies_global[i]["id_acessorias"];
        filter_company_name.push(String(id_acessorias));
    }
    
    // ---------------------------------------------------------------------------------------------------------------------
    
    for (let i in data_all_deliveries_balancetes) {

        id_database = data_all_deliveries_balancetes[i]["id"];
        contabil = data_all_deliveries_balancetes[i]["contabil"];

        if (!filter_colaborador.includes(contabil)){
            filter_colaborador.push(contabil);
        }

        filter_id_database.push(id_database);
    }
    
    window.localStorage.setItem( "filter_company_name" , JSON.stringify({"filter": filter_company_name}) );
    window.localStorage.setItem( "filter_id_database_deliveries_balancetes" , JSON.stringify({"filter": filter_id_database}) );
    window.localStorage.setItem( "filter_colaborador" , JSON.stringify({"filter": filter_colaborador}) );

    if (selectVisualManual) {
        selectVisual_Generic();
    }
    
}

function updateFilterCompaniesPrincipal(){

    let status_checked;
    let block_dropdown_all_companies = document.querySelector(".block-all-companies");

    filter_company_name = JSON.parse( window.localStorage.getItem("filter_company_name") )["filter"];

    for (let i in data_all_companies_global) {
        id_acessorias = data_all_companies_global[i]["id_acessorias"];
        razao_social = data_all_companies_global[i]["razao_social"];

        if( filter_company_name.includes(String(id_acessorias)) ){
            status_checked = "checked";
        } else {
            status_checked = "";
        }
        
        block_dropdown_all_companies.innerHTML += `
            <span>
                <input type="checkbox" data-checkbox-company="${id_acessorias}" ${status_checked} onclick="actionFilterCompanyName(this);">
                <p> <b>${id_acessorias}</b> - ${razao_social}</p>
            </span>
        `;
    }
}

function updateFilterColabPrincipal(){

    let status_checked;
    let list_aux = new Array();
    let block_dropdown_all_companies = document.querySelector(".block-all-colab");

    filter_colaborador = JSON.parse( window.localStorage.getItem("filter_colaborador") )["filter"];

    // if (filter_colaborador.length === 0){
    //     document.getElementById("selec-all-colab-principal-filter").checked = false;
    // } else {
    //     document.getElementById("selec-all-colab-principal-filter").checked = true;
    // }
    
    for (let i in data_all_deliveries_balancetes) {
        contabil = data_all_deliveries_balancetes[i]["contabil"];

        if (!list_aux.includes(contabil)){

            if( filter_colaborador.includes(String(contabil)) ){
                status_checked = "checked";
            } else {
                status_checked = "";
            }
            
            block_dropdown_all_companies.innerHTML += `
                <span data-checkbox-colab-row="${contabil}">
                    <input type="checkbox" data-checkbox-colab="${contabil}" ${status_checked} onclick="actionFilterColabName(this);">
                    <p>${contabil}</p>
                </span>
            `;
            list_aux.push(contabil);
        }
        
    }
}


// ---------------------------------------------------------------
// --------------------------- FILTERS ---------------------------
// ---------------------------------------------------------------

function actionFilter_Select_Or_Clear(element, option_filter){

    let attr_elem, status_btn, data_LI;
    attr_elem = element.getAttribute("data-filter-generic");
    status_btn = element.classList.contains("active");
    data_LI = document.querySelector(`.${attr_elem}`).querySelectorAll("li");

    if (option_filter == "month") {
        if (status_btn){
            setFilterMonth("clear");
            data_LI.forEach((li)=>{
                li.classList.remove("active");
            });
            
        } else {
            setFilterMonth("all");
            data_LI.forEach((li)=>{
                li.classList.add("active");
            });
        }
    }
    else if (option_filter == "year") {
        if (status_btn){
            setFilterYear("clear");
            data_LI.forEach((li)=>{
                li.classList.remove("active");
            });
            
        } else {
            setFilterYear("all");
            data_LI.forEach((li)=>{
                li.classList.add("active");
            });
        }
    }
    else if (option_filter == "regime_agrup") {
        if (status_btn){
            setFilterRegimeAgrup("clear");
            data_LI.forEach((li)=>{
                li.classList.remove("active");
            });
            
        } else {
            setFilterRegimeAgrup("all");
            data_LI.forEach((li)=>{
                li.classList.add("active");
            });
        }
    }
    else if (option_filter == "type_company") {
        if (status_btn){
            setFilterRegimeAgrup("clear");
            data_LI.forEach((li)=>{
                li.classList.remove("active");
            });
            
        } else {
            setFilterRegimeAgrup("all");
            data_LI.forEach((li)=>{
                li.classList.add("active");
            });
        }
    }


    element.classList.toggle("active");

}

// ----

function setFilterMonth(action){
    // ----
    if (action == "all"){
        window.localStorage.setItem(
            "filter_month",
            JSON.stringify(
                {
                    "filter": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "-"],
                }
            )
        );
    } else if (action == "clear") {
        window.localStorage.setItem( "filter_month", JSON.stringify({"filter": []}) );
    }
    update_filter_company_names(true);       
}
function setFilterYear(action){
    // ----
    if (action == "all"){
        window.localStorage.setItem(
            "filter_year",
            JSON.stringify(
                {
                    "filter": ["2022", "2023", "2024", "-"],
                }
            )
        );
    } else if (action == "clear") {
        window.localStorage.setItem( "filter_year", JSON.stringify({"filter": []}) );
    }
    update_filter_company_names(true);
}
function setFilterRegimeAgrup(action){
    // ----
    if (action == "all"){
        window.localStorage.setItem(
            "filter_regime_agrup",
            JSON.stringify(
                {
                    "filter": ["Simples", "Lucro Real", "Lucro Presumido", "Outros"],
                }
            )
        );
    } else if (action == "clear") {
        window.localStorage.setItem( "filter_regime_agrup", JSON.stringify({"filter": []}) );
    }
    update_filter_company_names(true);
}
function setFilterTypeCompany(action){
    // ----
    if (action == "all"){
        window.localStorage.setItem(
            "filter_type_company",
            JSON.stringify(
                {
                    "filter": ["Normal", "MEI"],
                }
            )
        );
    } else if (action == "clear") {
        window.localStorage.setItem( "filter_type_company", JSON.stringify({"filter": []}) );
    }
    update_filter_company_names(true);
}

// ----

function update_status_btn_filter_month(){
    
    let filter = JSON.parse( window.localStorage.getItem("filter_month") )["filter"];
    let btns = document.querySelectorAll("[data-filter-month]");

    btns.forEach((btn)=>{
        if (filter.includes(btn.getAttribute("data-filter-month"))){
            btn.classList.add("active");
        }
    });
}
function update_status_btn_filter_year(){
    
    let filter = JSON.parse( window.localStorage.getItem("filter_year") )["filter"];
    let btns = document.querySelectorAll("[data-filter-year]");

    btns.forEach((btn)=>{
        if (filter.includes( String(btn.getAttribute("data-filter-year")) )){
            btn.classList.add("active");
        }
    });
}
function update_status_btn_filter_regime_agrup(){
    
    let filter = JSON.parse( window.localStorage.getItem("filter_regime_agrup") )["filter"];
    let btns = document.querySelectorAll("[data-filter-regime-agrup]");

    btns.forEach((btn)=>{
        if (filter.includes( String(btn.getAttribute("data-filter-regime-agrup")) )){
            btn.classList.add("active");
        }
    });
}
function update_status_btn_filter_type_company(){
    
    let filter = JSON.parse( window.localStorage.getItem("filter_type_company") )["filter"];
    let btns = document.querySelectorAll("[data-filter-type-company]");

    btns.forEach((btn)=>{
        if (filter.includes( String(btn.getAttribute("data-filter-type-company")) )){
            btn.classList.add("active");
        }
    });
}


// send primary keys to list database IDs: filter rows table all balances, balancetes lançados and balancetes mensais.
async function update_status_btn_filter_id_company_by_name(){
    try {
        let filter_temp = await JSON.parse( window.localStorage.getItem("filter_company_name") )["filter"];
        let tt_filter = await filter_temp.length;
        let tt_companies = await Object.keys(data_all_companies_global).length;
        let check_length = await tt_filter == tt_companies;
        let btn = await document.getElementById("selec-all-companies-principal-filter");

        
        if (tt_filter == 0){
            btn.checked = await false;
        } else {
            btn.c
            hecked = await check_length;
        }


        let filter_colaborador  = new Array();
        for (let i in data_all_deliveries_balancetes) {
            id_database = data_all_deliveries_balancetes[i]["id"];
            contabil = data_all_deliveries_balancetes[i]["contabil"];

            if (!filter_colaborador.includes(contabil)){
                filter_colaborador.push(contabil);
            }

            filter_id_database.push(id_database);
        }
        await window.localStorage.setItem( "filter_colaborador" , JSON.stringify({"filter": filter_colaborador}) );

        
        await updateFilterColabPrincipal();
        // -------------------------------------------------------------------------------------------------
        
    }
    catch (error) {
        update_first_check_FilterCompaniesPrincipal(data_all_companies_global, data_all_deliveries_balancetes, true);
    };

}
    
// ----
