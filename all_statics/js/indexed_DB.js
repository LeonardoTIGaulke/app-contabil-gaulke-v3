var db;
var DB_Request = window.indexedDB.open("db_companies", 1);

DB_Request.onerror = function(event) {
    console.log(`Error IndexedDB: ${e}`)
}
DB_Request.onsuccess = function(event){
    db = event.target.result;
}
DB_Request.onupgradeneeded = function(event){
    db = event.target.result;
    db.createObjectStore("companies", {keyPath: "id_acessorias"});
    db.createObjectStore("balancete_mensal", {keyPath: "id_empresa"});
    db.createObjectStore("balancete_lancado", {keyPath: "id_empresa"});
    db.createObjectStore("all_deliveries_balancetes", {keyPath: "id"});
    // var objectStore = db.createObjectStore("deliveries_regime", {keyPath: "id_acessorias"});
    // console.log(`>> objectStore: ${objectStore}`)
}


async function getCompany(table_name, company_id) {
    let transaction = db.transaction([table_name], "readwrite");
    let companyTable = transaction.objectStore(table_name);
    let request = companyTable.get(company_id);
    return await request;
}
async function getAllCompanies(table_name) {
    let transaction = db.transaction([table_name], "readwrite");
    let companyTable = transaction.objectStore(table_name);
    let request = companyTable.getAll();
    return await request;
}

async function putCompany(obj_company, table_name) {
    // let transaction = db.transaction(["companies"], "readwrite");
    // let companyTable = transaction.objectStore("companies");

    let transaction = db.transaction([table_name], "readwrite");
    let companyTable = transaction.objectStore(table_name);
    let request;
    for (let i in obj_company){
        request = companyTable.put(obj_company[i]);
        // request.onsuccess = function(event){
        //     console.log(event.target.result)
        // }
    }
    return;
}
