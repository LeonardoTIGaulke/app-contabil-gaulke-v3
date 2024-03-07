
// --------------------------------------------------------------------------------------------------------
// ------------------> atualiza tabela todas empresas dinamicamente.

const container_table_all_companies = document.querySelector(".table-all-companies");
const table_all_companies = container_table_all_companies.querySelector("table");

container_table_all_companies.addEventListener("scroll", function(){

    const topo_container = container_table_all_companies.scrollTop;
    const area_visivel_container = container_table_all_companies.clientHeight;
    const area_visivel_table = table_all_companies.clientHeight;
    const margem = 60;
    
    if ( topo_container + area_visivel_container >= area_visivel_table - margem){

        let request = getAllCompanies("companies").then((data)=> {
            data.onsuccess = function(event) {
                console.log(" ---- success ---- ")
                let all_companies = event.target.result;
                update_table_all_companies(false, 5, all_companies, false);
            }
        });
    }

});


// --------------------------------------------------------------------------------------------------------
// ------------------> atualiza tabela todas empresas dinamicamente.
const container_table_all_deliveries_balancetes = document.querySelector(".table-all-deliveries-balancetes");
const table_all_deliveries_balancetes = container_table_all_deliveries_balancetes.querySelector("table");

container_table_all_deliveries_balancetes.addEventListener("scroll", function(){

    const topo_container = container_table_all_deliveries_balancetes.scrollTop;
    const area_visivel_container = container_table_all_deliveries_balancetes.clientHeight;
    const area_visivel_table = table_all_deliveries_balancetes.clientHeight;
    const margem = 60;
    
    if ( topo_container + area_visivel_container >= area_visivel_table - margem){

        let request = getAllCompanies("all_deliveries_balancetes").then((data)=> {
            data.onsuccess = function(event) {
                console.log(" ---- success ---- ")
                let all_companies = event.target.result;
                update_table_all_deliveries_balancetes(false, 5, all_companies, false);
            }
        });
    }

});







// Função para gerar cores suavizadas
function generateColors(numColors) {
    const baseColor = "#ff0000"; // Vermelho intenso
    const colors = [];


    let r, g, b, a;
    r = 255;
    g = 0;
    b = 0;
    a = 1;

    for (let i = 0; i < numColors; i++) {
        
        g += 30;
        b += 30;
        const rgbaColor = `rgba(${r},${g},${b}, ${a})`;
        colors.push(rgbaColor);
    }

    return colors;
}
function limitarNome(nomeCompleto) {
    if (nomeCompleto.length > 11) {
        return nomeCompleto.slice(0, 11) + '...';
    }
    return nomeCompleto;
}

function create_chart_0(tt_dentro_prazo, tt_fora_prazo) {
        
    // ------------- gráfico de doughnut -------------
    // ------------- gráfico --> visão geral balancetes -------------


    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // 01 =====> Taxa de Cumprimento de Prazo (TCP): Essa métrica mede a proporção de tarefas concluídas dentro do prazo em relação ao total de tarefas.
    // calculo:
    // TCP = tt_dentro_prazo / tt_dentro_prazo + tt_fora_prazo
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // 02 =====> Taxa de Atraso (TA): Essa métrica mede a proporção de tarefas concluídas fora do prazo em relação ao total de tarefas.
    // calculo:
    // TCP = tt_fora_prazo / tt_dentro_prazo + tt_fora_prazo
    // ------------------------------------------------------------------------------------------------------------------------------------------------




    let perc_balancete, datails_info;

    datails_info = document.querySelector(`[data-details-charts="info-visao-geral-balancetes"]`).querySelectorAll("p");

    if (tt_fora_prazo > 0){
        perc_balancete = convertToPercentage( tt_dentro_prazo / (tt_dentro_prazo+tt_fora_prazo) );
    } else {
        perc_balancete = "0%";
    }
    
    datails_info[0].querySelector("span").innerText = tt_dentro_prazo;
    datails_info[1].querySelector("span").innerText = tt_fora_prazo;
    datails_info[2].querySelector("span").innerText = `${perc_balancete}`;

    const ctx = document.getElementById('myChart0');

    
    try {
        chart_0.destroy();
    } catch (error) {};

    chart_0 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Dentro do Prazo', 'Fora do Prazo'],
            datasets: [{
                label: '# Balancetes',
                data: [tt_dentro_prazo, tt_fora_prazo],
                backgroundColor: ["#0D6DAC", '#f49d37'],
                borderWidth: 1,
                datalabels: {
                color: "#000",
                backgroundColor: '#f4f4f9',
                align: 'center',
                anchor: 'center',
                offset: 0,
                borderRadius: 5,
            },
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                    // position: 'top',
                },
                title: {
                    display: true,
                    // text: 'Representação atraso por regime'
                },
            },
            scales: {
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
            },
        }
    });

}

function create_chart_01(tt_dentro_prazo, tt_fora_prazo) {
    // ------------- gráfico de doughnut -------------
    // ------------- gráfico --> balancete mensal -------------
    
    let perc_balancete, datails_info;
    datails_info = document.querySelector(`[data-details-charts="info-mensal"]`).querySelectorAll("p");
    
    if (tt_fora_prazo > 0){
        perc_balancete = convertToPercentage( tt_dentro_prazo / (tt_dentro_prazo+tt_fora_prazo) );
    } else {
        perc_balancete = "0%";
    }
    
    datails_info[0].querySelector("span").innerText = tt_dentro_prazo;
    datails_info[1].querySelector("span").innerText = tt_fora_prazo;
    datails_info[2].querySelector("span").innerText = `${perc_balancete}`;

    const ctx = document.getElementById('myChart1');

    // let color_fora_prazo = (context) => createLinearGradient(context.chart.ctx, context.chart.chartArea);
    
    try {
        chart_01.destroy();
    } catch (error) {};

    chart_01 = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Dentro do Prazo', 'Fora do Prazo'],
        datasets: [{
            label: '# Balancetes (Mensal)',
            data: [tt_dentro_prazo, tt_fora_prazo],
            backgroundColor: ["#0D6DAC", '#f49d37'],
            borderWidth: 1,
            datalabels: {
                color: "#000",
                backgroundColor: '#f4f4f9',
                align: 'center',
                anchor: 'center',
                offset: 0,
                borderRadius: 5,
            },
        }]
    },
    plugins: [ChartDataLabels],
    options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
                // position: 'top',
            },
            title: {
                display: true,
                // text: 'Representação atraso por regime'
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false
                },
            },
            y: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false
                },
            },
        },
    }
    });
}

function create_chart_02(tt_dentro_prazo, tt_fora_prazo) {


    // ------------- gráfico de doughnut -------------
    // ------------- gráfico --> balancete lançado -------------
    
    let datails_info;
    datails_info = document.querySelector(`[data-details-charts="info-lancado"]`).querySelectorAll("p");
    
    datails_info[0].querySelector("span").innerText = tt_dentro_prazo;
    datails_info[1].querySelector("span").innerText = tt_fora_prazo;

    if (tt_fora_prazo > 0){
        perc_balancete = convertToPercentage( tt_dentro_prazo / (tt_dentro_prazo+tt_fora_prazo) );
    } else {
        perc_balancete = "0%";
    }
    datails_info[2].querySelector("span").innerText = perc_balancete;

    const ctx = document.getElementById('myChart2');

    try {
        chart_02.destroy();
    } catch (error) {};

    chart_02 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Dentro do Prazo', 'Fora do Prazo'],
            datasets: [{
                label: '# Balancetes (Lanç.)',
                data: [tt_dentro_prazo, tt_fora_prazo],
                backgroundColor: ["#0D6DAC", '#f49d37'],
                borderWidth: 1,
                datalabels: {
                    color: "#000",
                    backgroundColor: '#f4f4f9',
                    align: 'center',
                    anchor: 'center',
                    offset: 0,
                    borderRadius: 5,
                },
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                    // position: 'top',
                },
                title: {
                    display: true,
                    // text: 'Representação atraso por regime'
                },
            },
            scales: {
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
            },
        }
    });
}
    
function create_chart_03() {
    // ------------- gráfico de doughnut -------------
    // ------------- gráfico --> balancete lançado -------------
    let tt_dentro_prazo, tt_fora_prazo, datails_info, resume_deliveries_regime;
    let acumulado, qte_atraso;
    let list_regimes = new Array();
    let list_tt_regime = new Array();
    let list_soma_atraso = new Array();
    

    resume_deliveries_regime = data_all_companies["resume_deliveries_regime"];
    // console.log(" ------------ resume_deliveries_regime ------------ ")
    // console.log(resume_deliveries_regime)

    
    acumulado = 0;
    qte_atraso = 0;
    for (let i in resume_deliveries_regime){
        list_regimes.push(resume_deliveries_regime[i]["regime"]);
        list_tt_regime.push(resume_deliveries_regime[i]["tt_regime"]);
        list_soma_atraso.push(resume_deliveries_regime[i]["sum_regime_periodo_meses_atraso"]);

        acumulado += resume_deliveries_regime[i]["sum_regime_periodo_meses_atraso"];
        qte_atraso += resume_deliveries_regime[i]["tt_regime_periodo_meses_atraso"];
    }
    console.log(list_regimes)
    console.log(list_tt_regime)
    console.log(list_soma_atraso)
    console.log(`>>>> acumulado: ${acumulado}`)
    console.log(`>>>> qte_atraso: ${qte_atraso}`)

    datails_info_regime = document.querySelector(`[data-details-charts="info-visao-geral-regime"]`).querySelectorAll("span");
    datails_info_tt_atraso = document.querySelector(`[data-details-charts="info-visao-geral-tt-atraso"]`).querySelectorAll("span");
    // datails_info_regime = document.querySelector(`[data-details-charts="info-visao-geral-regime"]`).querySelectorAll("span");
    // ----
    datails_info_regime[1].innerText = acumulado;
    datails_info_tt_atraso[1].innerText = qte_atraso;
    // datails_info[1].querySelector("span").innerText = tt_fora_prazo;
    // perc_balancete = convertToPercentage(tt_dentro_prazo/tt_fora_prazo);
    // datails_info[2].querySelector("span").innerText = perc_balancete;

    
    let list_backgrounds = generateColors(list_regimes.length);
    const ctx = document.getElementById('myChart-entregas-regimes');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: list_regimes,
            datasets: [
                {
                    label: '# Consolid. soma meses em atraso',
                    data: list_soma_atraso,
                    borderWidth: 1,
                    backgroundColor: list_backgrounds,
                    borderRadius: 5,
                    datalabels: {
                        color: "#000",
                        // backgroundColor: '#f4f4f9',
                        align: 'right',
                        anchor: 'end',
                        offset: 5,
                        borderRadius: 5,
                    },
                }
            ]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                    // position: 'top',
                },
                title: {
                    display: true,
                    text: 'Representação atraso por regime'
                },
            },
            scales: {
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        display: true,
                    },
                    grid: {
                        display: false
                    },
                },
            },
        }
    });
}

function create_chart_04() {
    // ------------- gráfico de doughnut -------------
    // ------------- gráfico --> balancete lançado -------------
    let tt_dentro_prazo, tt_fora_prazo, datails_info, resume_deliveries_meses;
    let acumulado, qte_atraso;
    let list_meses = new Array();
    let list_tt_periodo_meses_atraso = new Array();
    let list_soma_atraso = new Array();
    
    // console.log(" ------------ resume_deliveries_meses ------------ ")
    // console.log(resume_deliveries_meses)

    
    acumulado = 0;
    qte_atraso = 0;
    for (let i in resume_deliveries_meses){
        list_meses.push(resume_deliveries_meses[i]["mes"]);
        list_tt_periodo_meses_atraso.push(resume_deliveries_meses[i]["tt_periodo_meses_atraso"]);
        list_soma_atraso.push(resume_deliveries_meses[i]["sum_regime_periodo_meses_atraso"]);
        
    }
    console.log(list_meses)
    // console.log(list_tt_regime)
    console.log(list_soma_atraso)
  

    
    let list_backgrounds = generateColors(list_meses.length);
    const ctx = document.getElementById('myChart-entregas-meses');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: list_meses,
            datasets: [
                {
                    label: '# Consolid. soma meses em atraso',
                    data: list_soma_atraso,
                    borderWidth: 1,
                    backgroundColor: "red",
                    borderRadius: 5,
                    datalabels: {
                        color: "#000",
                        backgroundColor: '#f4f4f9',
                        align: 'top',
                        anchor: 'end',
                        offset: 5,
                        borderRadius: 5,
                    },
                }
            ]
        },
        plugins: [ChartDataLabels],
        options: {
            onClick: testeClick,
            indexAxis: 'x',
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    // position: 'top',
                },
                title: {
                    display: true,
                    text: 'Representação atraso por mês'
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
            },
        }
    });
}

async function create_chart_500(data_chart_01, data_chart_02, labels_chart ){



    try {chart_500.destroy();} catch (error) {};

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "-"];

    let calculate = 0;
    let tt_chart_01 = 0;
    for(let i = 0; i < data_chart_01.length; i++) {

        if( parseInt(data_chart_01[i]) > 0 && parseInt(data_chart_02[i]) > 0 ){
            calculate += data_chart_01[i];
            tt_chart_01 += 1;
        } else {
            data_chart_01[i] = null;
            data_chart_02[i] = null;
        }
    }

    console.log(" ----------------- data_chart_01 ----------------- ")
    console.log(data_chart_01)
    console.log(" ----------------- data_chart_02 ----------------- ")
    console.log(data_chart_02)
    console.log(" ----------------- labels_chart ----------------- ")
    console.log(labels_chart)
    average_chart_01 = await (calculate / tt_chart_01);

    document.querySelector(`[data-tt-rows-resume="rows-all-deliveries-balancetes-average"]`).querySelector("b").innerText = average_chart_01.toFixed(2);

    document.querySelector(".container-cards-more-info-chart").querySelectorAll("span")[0].innerHTML = `
    <p>
        <i class="fa-solid fa-circle"></i>
        Cons. (Int. de compt.): <b>${calculate}</b> | Meses: <b>${tt_chart_01}</b>
     </p>`;
    document.querySelector(".container-cards-more-info-chart").querySelectorAll("span")[1].innerHTML = `<p> Média (Período): <b>${average_chart_01.toFixed(2)}</b> </p>`;
    document.querySelector(".container-cards-more-info-chart").querySelectorAll("span")[2].innerHTML = `<p> info </p>`;
    
    const ctx = document.getElementById('myChart-500');
    chart_500 = new Chart(ctx, {
        data: {
            labels: labels,
            skipNull: true,
            datasetFill: true,
            datasets: [
                {
                    type: 'bar',
                    label: '#Intervalo de compt.',
                    data: await data_chart_01,
                    borderWidth: 1,
                    borderRadius: 6,
                    backgroundColor: "#0D6DAC",
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 5,
                        color: "#000",
                        backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    },
                },
                {
                    type: "bar",
                    label: '#Intervalo de entrega',
                    data: await data_chart_02,
                    borderWidth: 1,
                    borderRadius: 6,
                    backgroundColor: "#f49d37",
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 5,
                        color: "#000",
                        backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    },
                },
                {
                    type: "line",
                    label: '#Média de entrega',
                    data: await Array(data_chart_01.length).fill(average_chart_01),
                    borderWidth: 1,
                    borderRadius: 6,
                    backgroundColor: "#0D6DAC",
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 5,
                        color: "transparent",
                        backgroundColor: 'transparent',
                        borderRadius: 5,
                    },
                },

            ]
        },

        
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // indexAxis: 'y',
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: false,
                    // position: 'top',
                },
                title: {
                    display: true,
                    text: 'Representação entregas de balancates (meses)'
                },
            },
            scales: {
                x: {
                    ticks: {
                        display: true,
                    },
                    grid: {
                        display: false
                    },
                    // stacked: true,
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: true,
                    },
                    grid: {
                        display: false
                    },
                },
            },
        }
    });
}
function create_chart_600(responsaveis_contabil_chart){
    try {chart_600.destroy();} catch (error) {};

    console.log(" ------------------------- responsaveis_contabil_chart-------------------------  ")
    console.log(responsaveis_contabil_chart)

    let labels  = new Array();
    let data    = new Array();

    for (let i in responsaveis_contabil_chart){
        labels.push(i)
        data.push(responsaveis_contabil_chart[i])
    }

    const ctx = document.getElementById('myChart-600');
    chart_600 = new Chart(ctx, {

        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '#Entregas contábil',
                    data: data,
                    borderWidth: 1,
                    datalabels: {
                    align: 'top',
                    anchor: 'end',
                    // offset: 5,
                    // color: "#000",
                    // backgroundColor: '#f4f4f9',
                    // borderRadius: 5,
            },
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            autoPadding: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
                
                title: { 
                    display: true, 
                    text: ['Representação por colaborador', '', /*'More Info Chart'], */],
                    align: 'center', 
                    // color: 'red', 
                    fullSize: false, 
                    position: 'top', 
                    font: { 
                        // size: 14,
                        // weight: 'bold', 
                        // family: 'Indie Flower, cursive', 
                        style: 'normal' 
                    }, 
                    padding: { 
                        top: 20, 
                        bottom: 10,
                    } 
                }
            },
            scales: {
                x: {
                    border: {
                        display: false,
                        // color: '#ccc',
                        // width: 2,
                    },
                    ticks: {
                        display: false,
                        beginAtZero: true,
                        padding: 25,
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    border: {
                        display: false,
                        // color: '#ccc',
                        // width: 2,
                    },
                    ticks: {
                        display: false,
                        beginAtZero: true,
                        padding: 25,
                    },
                    grid: {
                        display: false
                    },
                },
            },
        }
    });
}
async function create_chart_700(data_to_pareto_month){

    console.log(" ---------------------- data_to_pareto_month ---------------------- ")
    console.log(data_to_pareto_month)
    console.log(" ---------------------- months ---------------------- ")
    console.log(months)

    try {chart_700.destroy();} catch (error) {};

    let labels = [];
    let data_atraso = [];
    let data_acumulado_aux = [];
    let tt_acumulado = 0;

    for (let m in data_to_pareto_month){
        if (data_to_pareto_month[m] > 0){
            labels.push(m);
            data_atraso.push(data_to_pareto_month[m]);
        }
    }
    
    // ----
    data_atraso.forEach((data)=>{
        tt_acumulado += data;
    });

    // ----
    for (let i = 0; i < data_atraso.length; i++){
        data_acumulado_aux[i] = await {
            "tt": data_atraso[i],
            "mes": labels[i],
            }
    }
    data_acumulado_aux.sort(function(a, b){
        return b.tt - a.tt;
    });


    console.log(" ------------------- data_acumulado_aux - 01 ------------------- ")
    console.log(data_acumulado_aux)

    let cont_aux = 0;
    data_acumulado_aux.forEach((data)=>{

        data["ac"] = ((data["tt"] / tt_acumulado) * 100);

        ac = data["ac"];
        tt = data["tt"];

        
        if (cont_aux > 0) {

            ac_total = data_acumulado_aux[cont_aux-1]["ac_total"];

            
            // data["ac_total"] = parseFloat( ac )  + parseFloat(data[cont_aux-1]["ac_total"] );
            data["ac"] = ( ( tt / tt_acumulado ) * 100);
            if (cont_aux == data_acumulado_aux.length -1 ){
                data["ac_total"] = (parseFloat( ac )  + parseFloat(data_acumulado_aux[cont_aux-1]["ac_total"]) ).toFixed(0);
            } else {
                data["ac_total"] = (parseFloat( ac )  + parseFloat(data_acumulado_aux[cont_aux-1]["ac_total"]) ).toFixed(2);
            }
            
            
        } else {

            data["ac_total"] = ac.toFixed(2);
            
        }
        cont_aux += 1;
    });

    
    console.log(" ------------- data_acumulado_aux - 02 ------------- ")
    console.log(data_acumulado_aux)


    labels = await data_acumulado_aux.map(item => item.mes)
    data_atraso = await data_acumulado_aux.map(item => item.tt)
    data_acumulado = await data_acumulado_aux.map(item => item.ac_total)
    
    const ctx = document.getElementById('myChart-700');

    chart_700 = new Chart(ctx, {
        data: {
            labels: labels,
            suggestedMin: 0,
            suggestedMax: 100,
            datasets: [
                {
                    type: 'bar',
                    order: 1,
                    label: 'Qtd. acumulado em atraso',
                    data: data_atraso,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: '#f49d37',
                    datalabels: {
                        align: 'start',
                        anchor: 'start',
                        offset: 5,
                        color: "#595963",
                        // backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    }
                },
                {
                    type: 'line',
                    order: 0,
                    label: '(%) Acumulado atraso',
                    data: data_acumulado,
                    fill: false,
                    borderColor: '#0D6DAC',
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 5,
                        color: "#000",
                        backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    }
                }
            ]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            autoPadding: true,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                },
                title: { 
                    display: true,
                    text: ['Pareto - Atraso acumulado por mês', '', /*'More Info Chart'], */],
                    align: 'center',
                    // color: 'red',
                    fullSize: false,
                    position: 'top',
                    font: {
                        style: 'normal',
                        size: 16,
                    }, 
                    padding: {
                        top: 20,
                        bottom: 10,
                    } 
                }
            },
            scales: {
                x: {
                    border: {
                        display: false,
                    },
                    ticks: {
                        display: true,
                        beginAtZero: true,
                        padding: 25,
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    border: {
                        display: false,
                    },
                    ticks: {
                        display: true,
                        beginAtZero: true,
                        padding: 25,
                    },
                    grid: {
                        display: true
                    },
                },
            },
        }
    });
}
async function create_chart_800(data_company_aux){

    console.log(" ---------------------- data_company_aux ---------------------- ")
    console.log(data_company_aux)

    try {chart_800.destroy();} catch (error) {};

    let labels = [];
    let data_atraso = [];
    let data_acumulado_aux = [];
    let tt_acumulado = 0;

    for (let m in data_company_aux){
        if (data_company_aux[m] > 0){
            labels.push(m);
            data_atraso.push(data_company_aux[m]);
        }
    }
    
    // ----
    data_atraso.forEach((data)=>{
        tt_acumulado += data;
    });

    // ----
    for (let i = 0; i < data_atraso.length; i++){
        data_acumulado_aux[i] = await {
            "tt": data_atraso[i],
            "company": labels[i],
            }
    }
    data_acumulado_aux.sort(function(a, b){
        return b.tt - a.tt;
    });


    console.log(" ------------------- data_acumulado_aux - 01 ------------------- ")
    console.log(data_acumulado_aux)

    let cont_aux = 0;
    data_acumulado_aux.forEach((data)=>{

        data["ac"] = ((data["tt"] / tt_acumulado) * 100);

        ac = data["ac"];
        tt = data["tt"];

        
        if (cont_aux > 0) {

            ac_total = data_acumulado_aux[cont_aux-1]["ac_total"];

            
            // data["ac_total"] = parseFloat( ac )  + parseFloat(data[cont_aux-1]["ac_total"] );
            data["ac"] = ( ( tt / tt_acumulado ) * 100);
            if (cont_aux == data_acumulado_aux.length -1 ){
                data["ac_total"] = (parseFloat( ac )  + parseFloat(data_acumulado_aux[cont_aux-1]["ac_total"]) ).toFixed(0);
            } else {
                data["ac_total"] = (parseFloat( ac )  + parseFloat(data_acumulado_aux[cont_aux-1]["ac_total"]) ).toFixed(2);
            }
            
            
        } else {

            data["ac_total"] = ac.toFixed(2);
            
        }
        cont_aux += 1;
    });

    
    
    console.log(" ------------- COMUM data_acumulado_aux - 02 ------------- ")
    console.log(data_acumulado_aux)

    labels = await data_acumulado_aux.map(item => item.company);
    data_atraso = await data_acumulado_aux.map(item => item.tt);
    data_acumulado = await data_acumulado_aux.map(item => item.ac_total);

    labels_final = new Array();
    labels_inteiro_final = new Array();
    data_atraso_final = new Array();
    data_acumulado_final = new Array();

    let max_columns_chart = 35;
    let max_value_chart = 20;

    for (let i = 0; i < labels.length; i++) {

        if (i <= max_columns_chart || data_acumulado[i] <= max_value_chart) {
            
            labels_final.push( labels[i].slice(0, 11) );
            labels_inteiro_final.push( labels[i] );

            data_atraso_final.push(data_atraso[i]);
            data_acumulado_final.push(data_acumulado[i]);
            
        }
    }






    console.log(" ------------- AJUST TO 10 ------------- ")
    console.log(labels_final)
    console.log(data_atraso_final)
    console.log(data_acumulado_final)
    
    const ctx = document.getElementById('myChart-800');

    chart_800 = new Chart(ctx, {
        data: {
            labels: labels_inteiro_final,
            datasets: [
                {
                    type: 'bar',
                    order: 1,
                    label: 'Meses em atraso',
                    data: data_atraso_final,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: '#f49d37',
                    datalabels: {
                        align: 'start',
                        anchor: 'start',
                        offset: 5,
                        color: "#595963",
                        // backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    }
                },
                {
                    type: 'line',
                    order: 0,
                    label: '(%) Acumulado atraso',
                    data: data_acumulado_final,
                    fill: false,
                    borderColor: '#0D6DAC',
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 5,
                        color: "#000",
                        backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    }
                }
            ]
        },
        plugins: [ChartDataLabels],
        options: {
            
            responsive: true,
            maintainAspectRatio: false,
            autoPadding: true,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                },
                title: { 
                    display: true,
                    text: ['Pareto - Atraso acumulado por empresa', '', /*'More Info Chart'], */],
                    fullSize: false,
                    position: 'top',
                    font: {
                        style: 'normal',
                        size: 16,
                    }, 
                    padding: {
                        top: 20,
                        bottom: 10,
                    } 
                }
            },
            scales: {
                x: {

                    align: 'start',
                    ticks: {
                        minRotation: 45,
                        maxRotation: 45,
                        display: true,
                        beginAtZero: true,
                        padding: 25,
                        callback: function(value, index, values) {
                            // ----
                            return limitarNome(labels_inteiro_final[index]);
                        }
                    },
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        display: true,
                        beginAtZero: true,
                        padding: 25,
                    },
                    border: {
                        display: false,
                    },
                    grid: {
                        display: true
                    },
                },
            },
        }
    });
}
async function create_chart_900(data_chart){

    console.log(" ---------------------- data_chart ---------------------- ")
    console.log(data_chart)

    try {chart_900.destroy();} catch (error) {};

    let labels = [];
    let data = [];
    let data_tt_apont = [];
    let tt_acumulado = 0;
    
    for (let colab in data_chart){
        labels.push(await colab);
        h = await data_chart[colab]["horas_totais"];
        m = await data_chart[colab]["minutos_totais"];
        tempo_tt = await data_chart[colab]["tempo_tt"];
        tt_apont = await data_chart[colab]["tt_apont"];

        data.push(tempo_tt);
        data_tt_apont.push(tt_apont);

        console.log(`>>>>>>>>>>> COLAB: ${colab}`)
        console.log(data_chart[colab])
    }

    console.log("\n\n\n\n ------------------------------- labels | data | data_tt_apont ")
    console.log(labels)
    console.log(data)
    console.log(data_tt_apont)



    const ctx = document.getElementById('myChart-900');

    chart_900 = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    order: 1,
                    label: 'Colaborador',
                    data: data,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: '#f49d37',
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 10,
                        color: "#595963",
                        // backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    }
                },
                {
                    type: 'line',
                    order: 0,
                    label: 'Total apont.',
                    data: data_tt_apont,
                    fill: false,
                    borderColor: '#0D6DAC',
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        offset: 5,
                        color: "#000",
                        backgroundColor: '#f4f4f9',
                        borderRadius: 5,
                    }
                }
            ]
        },
        plugins: [ChartDataLabels],
        options: {
            
            responsive: true,
            maintainAspectRatio: false,
            autoPadding: true,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                },
                title: { 
                    display: true,
                    text: ['Representação de apont. de horas', '', /*'More Info Chart'], */],
                    fullSize: false,
                    position: 'top',
                    font: {
                        style: 'normal',
                        size: 16,
                    }, 
                    padding: {
                        top: 20,
                        bottom: 10,
                    } 
                }
            },
            scales: {
                x: {

                    align: 'start',
                    ticks: {
                        minRotation: 45,
                        maxRotation: 45,
                        display: true,
                        beginAtZero: true,
                        padding: 25,
                        callback: function(value, index, values) {
                            // ----
                            return limitarNome(labels[index]);
                        }
                    },
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        display: true,
                        beginAtZero: true,
                        padding: 25,
                    },
                    border: {
                        display: false,
                    },
                    grid: {
                        display: true
                    },
                },
            },
        }
    });
}