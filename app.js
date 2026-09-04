document.addEventListener("DOMContentLoaded", () => {
    /* ==================================================
       ELEMENTS
    ================================================== */
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("openSidebar");
    const closeSidebarButton = document.getElementById("closeSidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");
    const pageTitle = document.getElementById("pageTitle");
    const modal = document.getElementById("projectModal");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const closeModalButton = document.getElementById("closeModal");
    const cancelModalButton = document.getElementById("cancelModal");
    const createProjectButton = document.getElementById("createProject");
    const projectNameInput = document.getElementById("projectName");
    const customerNameInput = document.getElementById("customerName");
    const profileTypeInput = document.getElementById("profileType");
    const profileLengthInput = document.getElementById("profileLength");
    /* ==================================================
       PAGE TITLES
    ================================================== */
    const titles = {
        dashboard: "داشبورد",
        projects: "پروژه‌ها",
        windows: "پنجره‌ها",
        optimizer: "بهینه‌سازی برش",
        reports: "گزارش‌ها",
        settings: "تنظیمات"
    };
    /* ==================================================
       SIDEBAR
    ================================================== */
    function openMenu() {
        if (sidebar) {
            sidebar.classList.add("open");
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }
    }
    function closeMenu() {
        if (sidebar) {
            sidebar.classList.remove("open");
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }
    }
    if (menuButton) {
        menuButton.addEventListener("click", openMenu);
    }
    if (closeSidebarButton) {
        closeSidebarButton.addEventListener("click", closeMenu);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeMenu);
    }
    /* ==================================================
       PAGE NAVIGATION
    ================================================== */
    function openPage(pageName) {
        if (!pageName || !titles[pageName]) {
            pageName = "dashboard";
        }
        /* Hide all pages */
        pages.forEach(page => {
            page.classList.remove("active");
        });
        /* Show selected page */
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add("active");
        }
        /* Update navigation */
        navItems.forEach(item => {
            item.classList.remove("active");
            const itemPage =
                item.dataset.page ||
                item.dataset.pageTarget;
            if (itemPage === pageName) {
                item.classList.add("active");
            }
        });
        /* Update header title */
        if (pageTitle) {
            pageTitle.textContent = titles[pageName];
        }
        /* Close mobile menu */
        closeMenu();
        /* Update URL */
        try {
            history.replaceState(
                null,
                "",
                `#${pageName}`
            );
        } catch (error) {
            console.log("History API unavailable.");
        }
    }
    /* Navigation buttons */
    navItems.forEach(item => {
        item.addEventListener("click", event => {
            event.preventDefault();
            const pageName =
                item.dataset.page ||
                item.dataset.pageTarget;
            openPage(pageName);
        });
    });
    /* ==================================================
       INITIAL PAGE
    ================================================== */
    let initialPage =
        window.location.hash.replace("#", "");
    if (!titles[initialPage]) {
        initialPage = "dashboard";
    }
    openPage(initialPage);
    /* ==================================================
       MODAL
    ================================================== */
    function showModal() {
        if (!modal) return;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        if (projectNameInput) {
            setTimeout(() => {
                projectNameInput.focus();
            }, 100);
        }
    }
    function hideModal() {
        if (!modal) return;
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }
    /* Open modal buttons */
    const modalOpenButtons = [
        "newProjectButton",
        "startProject",
        "emptyCreateProject",
        "projectsCreateButton"
    ];
    modalOpenButtons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener("click", event => {
                event.preventDefault();
                showModal();
            });
        }
    });
    /* Close modal */
    if (closeModalButton) {
        closeModalButton.addEventListener(
            "click",
            hideModal
        );
    }
    if (cancelModalButton) {
        cancelModalButton.addEventListener(
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
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            hideModal();
            closeMenu();
        }
    });
    /* ==================================================
       PROJECT STORAGE
    ================================================== */
    const STORAGE_KEY = "framemaster_projects";
    function getProjects() {
        try {
            const data =
                localStorage.getItem(STORAGE_KEY);
            if (!data) {
                return [];
            }
            const parsed =
                JSON.parse(data);
            return Array.isArray(parsed)
                ? parsed
                : [];
        } catch (error) {
            console.error(
                "Error reading projects:",
                error
            );
            return [];
        }
    }
    function saveProjects(projects) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(projects)
            );
        } catch (error) {
            console.error(
                "Error saving projects:",
                error
            );
        }
    }
    /* ==================================================
       DASHBOARD COUNTERS
    ================================================== */
    function updateDashboard() {
        const projects = getProjects();
        /* Projects */
        const projectCount =
            document.getElementById("projectCount");
        if (projectCount) {
            projectCount.textContent =
                projects.length;
        }
        /* Windows */
        let totalWindows = 0;
        projects.forEach(project => {
            if (
                Array.isArray(project.windows)
            ) {
                totalWindows +=
                    project.windows.length;
            }
        });
        const windowCount =
            document.getElementById("windowCount");
        if (windowCount) {
            windowCount.textContent =
                totalWindows;
        }
        /* Profiles */
        const profileCount =
            document.getElementById("profileCount");
        if (profileCount) {
            let totalProfiles = 0;
            projects.forEach(project => {
                if (
                    Array.isArray(project.cuts)
                ) {
                    totalProfiles +=
                        project.cuts.length;
                }
            });
            profileCount.textContent =
                totalProfiles;
        }
        /* Waste */
        const wastePercent =
            document.getElementById("wastePercent");
        if (wastePercent) {
            wastePercent.textContent =
                "0%";
        }
    }
    updateDashboard();
    /* ==================================================
       CREATE PROJECT
    ================================================== */
    function createProject() {
        const name =
            projectNameInput
                ? projectNameInput.value.trim()
                : "";
        const customer =
            customerNameInput
                ? customerNameInput.value.trim()
                : "";
        const profileType =
            profileTypeInput
                ? profileTypeInput.value
                : "upvc";
        const profileLength =
            profileLengthInput
                ? Number(profileLengthInput.value)
                : 6000;
        /* Validate */
        if (!name) {
            alert(
                "لطفاً نام پروژه را وارد کنید."
            );
            if (projectNameInput) {
                projectNameInput.focus();
            }
            return;
        }
        if (!profileLength || profileLength < 1000) {
            alert(
                "طول شاخه باید حداقل 1000 میلی‌متر باشد."
            );
            if (profileLengthInput) {
                profileLengthInput.focus();
            }
            return;
        }
        /* Create object */
        const project = {
            id: Date.now(),
            name: name,
            customer: customer,
            profileType: profileType,
            profileLength: profileLength,
            createdAt:
                new Date().toISOString(),
            windows: [],
            cuts: []
        };
        /* Save */
        const projects =
            getProjects();
        projects.push(project);
        saveProjects(projects);
        /* Reset */
        if (projectNameInput) {
            projectNameInput.value = "";
        }
        if (customerNameInput) {
            customerNameInput.value = "";
        }
        if (profileTypeInput) {
            profileTypeInput.value = "upvc";
        }
        if (profileLengthInput) {
            profileLengthInput.value = 6000;
        }
        /* Close modal */
        hideModal();
        /* Update dashboard */
        updateDashboard();
        /* Go to projects */
        openPage("projects");
        console.log(
            "FrameMaster project created:",
            project
        );
    }
    if (createProjectButton) {
        createProjectButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                createProject();
            }
        );
    }
    /* ==================================================
       QUICK ACTIONS
    ================================================== */
    const quickCards =
        document.querySelectorAll(".quick-card");
    quickCards.forEach(card => {
        card.addEventListener(
            "click",
            event => {
                event.preventDefault();
                const target =
                    card.dataset.pageTarget;
                if (target) {
                    openPage(target);
                }
            }
        );
    });
    /* ==================================================
       TEXT BUTTONS
    ================================================== */
    const textButtons =
        document.querySelectorAll(".text-button");
    textButtons.forEach(button => {
        button.addEventListener(
            "click",
            event => {
                event.preventDefault();
                const target =
                    button.dataset.pageTarget;
                if (target) {
                    openPage(target);
                }
            }
        );
    });
    /* ==================================================
       NOTIFICATION BUTTON
    ================================================== */
    const notificationButton =
        document.querySelector(".icon-button");
    if (notificationButton) {
        notificationButton.addEventListener(
            "click",
            () => {
                alert(
                    "در حال حاضر اعلان جدیدی وجود ندارد."
                );
            }
        );
    }
    /* ==================================================
       GLOBAL API
    ================================================== */
    window.FrameMaster = {
        openPage,
        showModal,
        hideModal,
        getProjects,
        saveProjects,
        updateDashboard,
        createProject
    };
    /* ==================================================
       READY
    ================================================== */
    console.log(
        "FrameMaster initialized successfully."
    );
});
