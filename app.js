/* =========================================================
   FrameMaster
   Main Application JavaScript
   Version: 1.0.0
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIG
       ===================================================== */

    const STORAGE_KEY = "framemaster_projects";

    const pageTitles = {
        dashboard: "داشبورد",
        projects: "پروژه‌ها",
        windows: "پنجره‌ها",
        optimizer: "بهینه‌سازی برش",
        reports: "گزارش‌ها",
        settings: "تنظیمات"
    };


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const sidebar = document.querySelector("#sidebar");
    const menuButton = document.querySelector(".menu-button");
    const closeSidebarButton = document.querySelector(".close-sidebar");
    const sidebarOverlay = document.querySelector(".sidebar-overlay");

    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

    const pageTitle = document.querySelector("#pageTitle");

    const modal = document.querySelector(".modal");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    const modalCloseButtons = document.querySelectorAll(
        ".modal-close, [data-close-modal]"
    );

    const modalOpenButtons = document.querySelectorAll("[data-open-modal]");


    /* =====================================================
       LOCAL STORAGE
       ===================================================== */

    function getProjects() {
        try {
            const projects = localStorage.getItem(STORAGE_KEY);

            if (!projects) {
                return [];
            }

            const parsed = JSON.parse(projects);

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {
            console.error("FrameMaster: خطا در خواندن پروژه‌ها", error);
            return [];
        }
    }


    function saveProjects(projects) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(projects)
            );

            return true;

        } catch (error) {
            console.error("FrameMaster: خطا در ذخیره پروژه", error);
            return false;
        }
    }


    /* =====================================================
       SIDEBAR
       ===================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.classList.add("sidebar-open");
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.classList.remove("sidebar-open");
    }


    if (menuButton) {
        menuButton.addEventListener("click", openSidebar);
    }


    if (closeSidebarButton) {
        closeSidebarButton.addEventListener("click", closeSidebar);
    }


    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }


    /* =====================================================
       PAGE NAVIGATION
       ===================================================== */

    function getPageIdFromNavItem(item) {

        if (!item) return null;

        // اول data-page
        if (item.dataset.page) {
            return item.dataset.page;
        }

        // سپس href
        const href = item.getAttribute("href");

        if (href && href.startsWith("#")) {
            return href.substring(1);
        }

        return null;
    }


    function showPage(pageId) {

        if (!pageId) {
            pageId = "dashboard";
        }

        let pageExists = false;

        pages.forEach(page => {

            const isActive =
                page.id === pageId ||
                page.dataset.page === pageId;

            page.classList.toggle("active", isActive);

            if (isActive) {
                pageExists = true;
            }
        });


        // اگر صفحه وجود نداشت
        if (!pageExists) {

            const dashboard =
                document.querySelector("#dashboard");

            if (dashboard) {
                dashboard.classList.add("active");
                pageId = "dashboard";
            }
        }


        // فعال کردن آیتم منو
        navItems.forEach(item => {

            const itemPage = getPageIdFromNavItem(item);

            item.classList.toggle(
                "active",
                itemPage === pageId
            );
        });


        // تغییر عنوان بالای صفحه
        if (pageTitle) {
            pageTitle.textContent =
                pageTitles[pageId] || "FrameMaster";
        }


        // بستن منوی موبایل
        closeSidebar();


        // تغییر URL بدون Reload
        if (window.location.hash !== `#${pageId}`) {

            try {
                history.replaceState(
                    null,
                    "",
                    `#${pageId}`
                );
            } catch (error) {
                // در صورت خطا نادیده گرفته می‌شود
            }
        }


        // رویداد اختصاصی برای آینده
        document.dispatchEvent(
            new CustomEvent("framemaster:pagechange", {
                detail: {
                    page: pageId
                }
            })
        );
    }


    navItems.forEach(item => {

        item.addEventListener("click", event => {

            const pageId = getPageIdFromNavItem(item);

            if (!pageId) return;

            event.preventDefault();

            showPage(pageId);
        });

    });


    /* =====================================================
       HASH NAVIGATION
       ===================================================== */

    function loadInitialPage() {

        const hash =
            window.location.hash.replace("#", "").trim();

        if (hash && pageTitles[hash]) {
            showPage(hash);
        } else {
            showPage("dashboard");
        }
    }


    window.addEventListener("hashchange", () => {

        const hash =
            window.location.hash.replace("#", "").trim();

        if (hash && pageTitles[hash]) {
            showPage(hash);
        }

    });


    /* =====================================================
       MODAL
       ===================================================== */

    function openModal() {

        if (!modal) return;

        modal.classList.add("active");

        document.body.classList.add("modal-open");

        // فوکوس روی اولین input
        setTimeout(() => {

            const firstInput =
                modal.querySelector(
                    "input:not([type='hidden']), textarea, select"
                );

            if (firstInput) {
                firstInput.focus();
            }

        }, 100);
    }


    function closeModal() {

        if (!modal) return;

        modal.classList.remove("active");

        document.body.classList.remove("modal-open");
    }


    modalOpenButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            openModal();
        });

    });


    // دکمه‌های احتمالی ساخت پروژه
    const newProjectButtons = document.querySelectorAll(
        "#newProjectBtn, #newProjectButton, .new-project-card"
    );


    newProjectButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            openModal();
        });

    });


    modalCloseButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            closeModal();
        });

    });


    if (modalBackdrop) {

        modalBackdrop.addEventListener("click", event => {

            if (event.target === modalBackdrop) {
                closeModal();
            }

        });

    }


    // بستن Modal با Escape
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (
                modal &&
                modal.classList.contains("active")
            ) {
                closeModal();
            }

            closeSidebar();
        }

    });


    /* =====================================================
       PROJECT FORM
       ===================================================== */

    const projectForm =
        document.querySelector(
            "#projectForm, .project-form"
        );


    if (projectForm) {

        projectForm.addEventListener("submit", event => {

            event.preventDefault();


            const nameInput =
                projectForm.querySelector(
                    "#projectName, [name='projectName'], [name='name']"
                );


            const typeInput =
                projectForm.querySelector(
                    "#projectType, [name='projectType'], [name='type']"
                );


            const projectName =
                nameInput ?
                nameInput.value.trim() :
                "پروژه جدید";


            const projectType =
                typeInput ?
                typeInput.value.trim() :
                "پنجره";


            if (!projectName) {

                if (nameInput) {
                    nameInput.focus();
                }

                return;
            }


            const projects = getProjects();


            const newProject = {

                id:
                    "project_" +
                    Date.now(),

                name:
                    projectName,

                type:
                    projectType || "پنجره",

                createdAt:
                    new Date().toISOString(),

                windows: [],

                profiles: [],

                cuts: [],

                status:
                    "active"
            };


            projects.unshift(newProject);


            const saved =
                saveProjects(projects);


            if (!saved) {
                alert(
                    "ذخیره پروژه انجام نشد. لطفاً دوباره تلاش کنید."
                );

                return;
            }


            // پاک کردن فرم
            projectForm.reset();


            // بستن Modal
            closeModal();


            // برو به پروژه‌ها
            showPage("projects");


            // بروزرسانی داشبورد
            updateDashboard();


            // اطلاع‌رسانی داخلی
            document.dispatchEvent(
                new CustomEvent(
                    "framemaster:projectcreated",
                    {
                        detail: newProject
                    }
                )
            );


            console.log(
                "FrameMaster: پروژه ایجاد شد",
                newProject
            );
        });

    }


    /* =====================================================
       DASHBOARD
       ===================================================== */

    function updateDashboard() {

        const projects = getProjects();


        // تعداد پروژه‌ها
        const projectCountElements =
            document.querySelectorAll(
                "#projectCount, [data-stat='projects']"
            );


        projectCountElements.forEach(element => {

            element.textContent =
                projects.length;

        });


        // تعداد پنجره‌ها
        let totalWindows = 0;

        projects.forEach(project => {

            if (
                Array.isArray(project.windows)
            ) {
                totalWindows +=
                    project.windows.length;
            }

        });


        const windowCountElements =
            document.querySelectorAll(
                "#windowCount, [data-stat='windows']"
            );


        windowCountElements.forEach(element => {

            element.textContent =
                totalWindows;

        });


        // تعداد برش‌ها
        let totalCuts = 0;

        projects.forEach(project => {

            if (
                Array.isArray(project.cuts)
            ) {
                totalCuts +=
                    project.cuts.length;
            }

        });


        const cutCountElements =
            document.querySelectorAll(
                "#cutCount, [data-stat='cuts']"
            );


        cutCountElements.forEach(element => {

            element.textContent =
                totalCuts;

        });


        updateRecentProjects(projects);
    }


    /* =====================================================
       RECENT PROJECTS
       ===================================================== */

    function updateRecentProjects(projects) {

        const container =
            document.querySelector(
                "#recentProjects"
            );


        if (!container) return;


        if (!projects.length) {

            return;
        }


        // فقط در صورتی که Container
        // مخصوص رندر پروژه داشته باشد
        const list =
            container.querySelector(
                "[data-project-list]"
            );


        if (!list) return;


        list.innerHTML = "";


        projects
            .slice(0, 5)
            .forEach(project => {

                const item =
                    document.createElement("div");


                item.className =
                    "recent-project-item";


                item.innerHTML = `

                    <div>
                        <strong>
                            ${escapeHTML(project.name)}
                        </strong>

                        <span>
                            ${escapeHTML(project.type)}
                        </span>
                    </div>

                    <button
                        type="button"
                        data-project-id="${project.id}"
                    >
                        مشاهده
                    </button>
                `;


                list.appendChild(item);

            });


        list
            .querySelectorAll(
                "[data-project-id]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.projectId;

                        openProject(id);
                    }
                );

            });

    }


    /* =====================================================
       OPEN PROJECT
       ===================================================== */

    function openProject(projectId) {

        const projects =
            getProjects();


        const project =
            projects.find(
                item =>
                    item.id === projectId
            );


        if (!project) return;


        window.FrameMaster.currentProject =
            project;


        showPage("windows");


        document.dispatchEvent(
            new CustomEvent(
                "framemaster:projectopen",
                {
                    detail: project
                }
            )
        );

    }


    /* =====================================================
       HTML SECURITY
       ===================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }


        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* =====================================================
       BUTTON FEEDBACK
       ===================================================== */

    const buttons =
        document.querySelectorAll(
            "button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    button.disabled
                ) {
                    return;
                }


                button.classList.add(
                    "button-clicked"
                );


                setTimeout(() => {

                    button.classList.remove(
                        "button-clicked"
                    );

                }, 180);

            }
        );

    });


    /* =====================================================
       RESPONSIVE SIDEBAR
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {
                closeSidebar();
            }

        }
    );


    /* =====================================================
       GLOBAL APP OBJECT
       ===================================================== */

    window.FrameMaster = {

        version: "1.0.0",

        storageKey:
            STORAGE_KEY,

        currentProject:
            null,

        getProjects,

        saveProjects,

        openModal,

        closeModal,

        openSidebar,

        closeSidebar,

        showPage,

        updateDashboard,

        openProject,

        escapeHTML

    };


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateDashboard();

    loadInitialPage();


    console.log(
        "%cFrameMaster%c initialized successfully.",
        "font-weight:bold;",
        "font-weight:normal;"
    );

});
