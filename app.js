document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       ELEMENTS
    ================================= */

    const sidebar = document.getElementById("sidebar");
    const menuButton = document.querySelector(".menu-button");
    const closeSidebar = document.querySelector(".close-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

    const pageTitle = document.getElementById("pageTitle");

    const modal = document.querySelector(".modal");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    const modalClose = document.querySelector(".modal-close");


    /* ================================
       PAGE TITLES
    ================================= */

    const titles = {
        dashboard: "داشبورد",
        projects: "پروژه‌ها",
        windows: "پنجره‌ها",
        optimizer: "بهینه‌سازی برش",
        reports: "گزارش‌ها",
        settings: "تنظیمات"
    };


    /* ================================
       SIDEBAR
    ================================= */

    function openMenu() {
        if (sidebar) sidebar.classList.add("open");
        if (overlay) overlay.classList.add("active");
    }

    function closeMenu() {
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("active");
    }

    if (menuButton) {
        menuButton.addEventListener("click", openMenu);
    }

    if (closeSidebar) {
        closeSidebar.addEventListener("click", closeMenu);
    }

    if (overlay) {
        overlay.addEventListener("click", closeMenu);
    }


    /* ================================
       NAVIGATION
    ================================= */

    function openPage(pageName) {

        if (!pageName) return;

        /* صفحات */

        pages.forEach(page => {

            page.classList.remove("active");

            if (page.id === pageName) {
                page.classList.add("active");
            }

        });


        /* منو */

        navItems.forEach(item => {

            item.classList.remove("active");

            const href = item.getAttribute("href");

            if (href === `#${pageName}`) {
                item.classList.add("active");
            }

            if (item.dataset.page === pageName) {
                item.classList.add("active");
            }

        });


        /* عنوان */

        if (pageTitle) {
            pageTitle.textContent =
                titles[pageName] || "FrameMaster";
        }


        /* موبایل */

        closeMenu();


        /* آدرس */

        history.replaceState(
            null,
            "",
            `#${pageName}`
        );

    }


    /* کلیک روی منو */

    navItems.forEach(item => {

        item.addEventListener("click", event => {

            event.preventDefault();

            let pageName = item.dataset.page;

            if (!pageName) {

                const href =
                    item.getAttribute("href");

                if (href) {
                    pageName =
                        href.replace("#", "");
                }

            }

            openPage(pageName);

        });

    });


    /* ================================
       INITIAL PAGE
    ================================= */

    let firstPage =
        window.location.hash.replace("#", "");

    if (!titles[firstPage]) {
        firstPage = "dashboard";
    }

    openPage(firstPage);


    /* ================================
       MODAL
    ================================= */

    function showModal() {

        if (!modal) return;

        modal.classList.add("active");
    }


    function hideModal() {

        if (!modal) return;

        modal.classList.remove("active");
    }


    /* تمام دکمه‌های باز کردن Modal */

    document
        .querySelectorAll("[data-open-modal]")
        .forEach(button => {

            button.addEventListener(
                "click",
                showModal
            );

        });


    /* دکمه پروژه جدید */

    const newProjectButtons =
        document.querySelectorAll(
            "#newProjectBtn, #newProjectButton"
        );

    newProjectButtons.forEach(button => {

        button.addEventListener(
            "click",
            showModal
        );

    });


    /* بستن */

    if (modalClose) {
        modalClose.addEventListener(
            "click",
            hideModal
        );
    }

    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            hideModal
        );

    }


    /* ESC */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                hideModal();
                closeMenu();

            }

        }
    );


    /* ================================
       PROJECT STORAGE
    ================================= */

    const STORAGE_KEY =
        "framemaster_projects";


    function getProjects() {

        const data =
            localStorage.getItem(STORAGE_KEY);

        if (!data) return [];

        try {
            return JSON.parse(data);
        } catch {
            return [];
        }

    }


    function saveProjects(projects) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(projects)
        );

    }


    /* ================================
       PROJECT FORM
    ================================= */

    const projectForm =
        document.getElementById(
            "projectForm"
        );


    if (projectForm) {

        projectForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "projectName"
                    );


                const typeInput =
                    document.getElementById(
                        "projectType"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                const type =
                    typeInput
                        ? typeInput.value
                        : "پنجره";


                if (!name) {

                    alert(
                        "لطفاً نام پروژه را وارد کنید."
                    );

                    return;

                }


                const projects =
                    getProjects();


                const project = {

                    id:
                        Date.now(),

                    name:
                        name,

                    type:
                        type,

                    createdAt:
                        new Date().toISOString(),

                    windows:
                        [],

                    cuts:
                        []

                };


                projects.push(project);

                saveProjects(projects);


                projectForm.reset();

                hideModal();

                openPage("projects");


                updateProjectCount();


                console.log(
                    "Project created:",
                    project
                );

            }
        );

    }


    /* ================================
       DASHBOARD COUNTERS
    ================================= */

    function updateProjectCount() {

        const projects =
            getProjects();


        const counters =
            document.querySelectorAll(
                "#projectCount, [data-stat='projects']"
            );


        counters.forEach(counter => {

            counter.textContent =
                projects.length;

        });

    }


    updateProjectCount();


    /* ================================
       QUICK ACTIONS
    ================================= */

    const quickCards =
        document.querySelectorAll(
            ".quick-card"
        );


    quickCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const target =
                    card.dataset.page;

                if (target) {
                    openPage(target);
                }

            }
        );

    });


    /* ================================
       GLOBAL API
    ================================= */

    window.FrameMaster = {

        openPage,
        showModal,
        hideModal,
        getProjects,
        saveProjects,
        updateProjectCount

    };


    console.log(
        "FrameMaster initialized successfully."
    );

});
