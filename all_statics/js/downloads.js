function downloadNewFileAllCompanies(){
    var rows;
    var data_table_rows = new Array();
    
    let data_to_csv = new Array();
    let headers_file = [
        "ID Acessórias", "Razão Social", "cnpj", "Regime", "Tags", "contábil", "fiscal", "Pessoal", "Lançado Comp.", "Lançado Data Entrega", "Lançado Meses Ataso", " Lançado Status Entrega", "Mensal Comp.", "Mensal Data Entrega", "Mensal Meses Atraso", "Mensal Status Entrega", "Período Data Entrega", "Período Comp.", "Período Meses Atraso.", "Período Status"
    ];
    data_to_csv.push(headers_file);

    let request = getAllCompanies("companies").then((data)=> {

        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            let rows = event.target.result;

            for(let i in rows){
                data_to_csv.push(
                    [
                        rows[i]["id_acessorias"],
                        rows[i]["razao_social"],
                        rows[i]["cnpj"],
                        rows[i]["regime"],
                        rows[i]["tags"],
                        rows[i]["contabil"],
                        rows[i]["fiscal"],
                        rows[i]["pessoal"],
                        rows[i]["lancado_comp"],
                        rows[i]["lancado_dt_entrega"],
                        rows[i]["lancado_meses_atraso"],
                        rows[i]["lancado_status_entrega"],
                        rows[i]["mensal_comp"],
                        rows[i]["mensal_dt_entrega"],
                        rows[i]["mensal_meses_atraso"],
                        rows[i]["mensal_status_entrega"],
                        rows[i]["periodo_DT"],
                        rows[i]["periodo_comp"],
                        rows[i]["periodo_meses_atraso"],
                        rows[i]["periodo_status"],
                    ]
                )
            }     
    
            
            var csv = '';
            for(var i=0; i<data_to_csv.length; i++){
                var values = data_to_csv[i];
                csv += values.join(';') + '\n';
            }
            
            var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.setAttribute("href", url);
    
            link.setAttribute("download", `Base empresas.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });



}

async function downloadNewFileAllCompanies_filtered(){
    var rows;
    var data_table_rows = new Array();
    
    let data_to_csv = new Array();
    let headers_file = ["id_acessorias", "razao_social", "cnpj", "regime", "tags", "contabil", "fiscal", "pessoal", "lancado_comp", "lancado_dt_entrega", "lancado_meses_atraso", "lancado_status_entrega", "mensal_comp", "mensal_dt_entrega", "mensal_meses_atraso", "mensal_status_entrega", "periodo_DT", "periodo_comp", "periodo_meses_atraso", "periodo_status"];
    data_to_csv.push(headers_file);

    let request = getAllCompanies("companies").then((data) => {
        
        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            let rows = event.target.result;

            const getDataCompanies = new Promise((resolve, reject)=>{
                let list_id_companies_check = checkCompanies(rows);
                resolve(list_id_companies_check);
            }).then((list_id_companies_check)=>{

                for(let i in rows){

                    id_acessorias = rows[i]["id_acessorias"];
                    if (list_id_companies_check.includes( id_acessorias )) {

                            data_to_csv.push(
                            [
                                id_acessorias,
                                rows[i]["razao_social"],
                                rows[i]["cnpj"],
                                rows[i]["regime"],
                                rows[i]["tags"],
                                rows[i]["contabil"],
                                rows[i]["fiscal"],
                                rows[i]["pessoal"],
                                rows[i]["lancado_comp"],
                                rows[i]["lancado_dt_entrega"],
                                rows[i]["lancado_meses_atraso"],
                                rows[i]["lancado_status_entrega"],
                                rows[i]["mensal_comp"],
                                rows[i]["mensal_dt_entrega"],
                                rows[i]["mensal_meses_atraso"],
                                rows[i]["mensal_status_entrega"],
                                rows[i]["periodo_DT"],
                                rows[i]["periodo_comp"],
                                rows[i]["periodo_meses_atraso"],
                                rows[i]["periodo_status"],
                            ]
                        );



                        }

                }


                
                var csv = '';
                for(var i=0; i<data_to_csv.length; i++){
                    var values = data_to_csv[i];
                    csv += values.join(';') + '\n';
                }
                
                var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                var url = URL.createObjectURL(blob);
                var link = document.createElement("a");
                link.setAttribute("href", url);
        
                link.setAttribute("download", `Report - Balancetes.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            });
            


        }
    });



}
// ----
async function downloadNewFileAllBalancetes_filtered(){

    // -------------------------------------------------------------------------------------------------------------------------
    // ------------------------------- RENOMEAR AS KEYS DO OBJECT JSON E DO ARRAY "headers_file" -------------------------------
    // -------------------------------------------------------------------------------------------------------------------------

    var rows;
    var data_table_rows = new Array();
    
    let data_to_csv = new Array();
    let headers_file = ["id_empresa", "cnpj", "empresa", "regime", "regime_agrup", "contabil", "competencia", "dt_entrega", "data_da_entrega", "obrigacao", "status", "diferenca_meses_COMP", "diferenca_meses_DT_entrega"];
    data_to_csv.push(headers_file);

    let request = getAllCompanies("all_deliveries_balancetes").then((data) => {
        
        data.onsuccess = function(event) {
            console.log(" ---- success ---- ")
            let rows = event.target.result;

            const getDataCompanies = new Promise((resolve, reject)=>{


                console.log(" ------------------------ rows ------------------------ ")
                console.log(rows)



                let list_id_companies_check = checkAllDeliveriesBalancete(rows);

                resolve(list_id_companies_check);

            }).then((list_id_companies_check)=>{

                for(let i in rows){

                    if ( list_id_companies_check.includes(rows[i]["id"]) ) {

                        // id_empresa
                        // cnpj
                        // empresa
                        // regime
                        // regime_agrup
                        // contabil
                        // competencia
                        // dt_entrega
                        // data_da_entrega
                        // obrigacao
                        // status
                        // diferenca_meses_COMP
                        // diferenca_meses_DT_entrega

                        data_to_csv.push(
                            [
                               rows[i]["id_empresa"],
                               rows[i]["cnpj"],
                               rows[i]["empresa"],
                               rows[i]["regime"],
                               rows[i]["regime_agrup"],
                               rows[i]["contabil"],
                               rows[i]["competencia"],
                               rows[i]["dt_entrega"],
                               rows[i]["data_da_entrega"],
                               rows[i]["obrigacao"],
                               rows[i]["status"],
                               rows[i]["diferenca_meses_COMP"],
                               rows[i]["diferenca_meses_DT_entrega"],
                            ]
                        );
                    }

                }


                
                var csv = '';
                for(var i=0; i<data_to_csv.length; i++){
                    var values = data_to_csv[i];
                    csv += values.join(';') + '\n';
                }
                
                var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                var url = URL.createObjectURL(blob);
                var link = document.createElement("a");
                link.setAttribute("href", url);
        
                link.setAttribute("download", `Report - Balancete entregue.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            });
            


        }
    });



}