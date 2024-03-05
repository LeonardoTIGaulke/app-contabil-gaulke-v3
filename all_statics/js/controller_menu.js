function modeMenuSidebar(element) {



    if (!element.classList.contains("rotate-0")){
        window.localStorage.setItem("mode-sidebar", "expanded");
    } else {
        window.localStorage.setItem("mode-sidebar", "");
    }

    // ----

    element.classList.toggle("rotate-0");
    document.querySelector(".sidebar").classList.toggle("expanded-sidebar");
    document.querySelector(".block-profile-menu-user").classList.toggle("rezize");

    document.querySelectorAll(".data-info-sidebar").forEach((e)=>{
        e.classList.toggle("hidden");
    });
    document.querySelectorAll(".sidebar button > span > a").forEach((e)=>{
        e.classList.toggle("rezize");
    });
}

function checkModeSidebar() {

    let modeSidebar = window.localStorage.getItem("mode-sidebar");

    console.log(">>>>>>>> modeSidebar: ", modeSidebar)

    if (modeSidebar === "expanded") {

        document.querySelector(".block-btn-mode-sidebar > i").classList.add("rotate-0");

        document.querySelector(".sidebar").classList.add("expanded-sidebar");
        document.querySelector(".block-profile-menu-user").classList.add("rezize");
    
        document.querySelectorAll(".data-info-sidebar").forEach((e)=>{
            e.classList.add("hidden");
        });
        document.querySelectorAll(".sidebar button > span > a").forEach((e)=>{
            e.classList.add("rezize");
        });
    }
}


// ----

function expandReport(element){
    let container;
    container = element.getAttribute("data-container-report");
    document.querySelector(`.${container}`).classList.toggle("expanded-report");
    element.classList.toggle("rotate-180");
}
