class DedranSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const activeTab = this.getAttribute('active-tab') || 'feed';

        const getLinkClass = (tabName) => {
            if (activeTab === tabName) {
                return "bg-primary-container text-on-primary-container rounded-xl font-bold flex items-center gap-3 px-4 py-3 scale-95 duration-150 ease-in-out";
            }
            return "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl flex items-center gap-3 px-4 py-3 transition-colors dark:hover:bg-surface-container-highest transition-all duration-200";
        };

        const getIconClass = (tabName) => {
            if (activeTab === tabName) {
                return "material-symbols-outlined icon-filled";
            }
            return "material-symbols-outlined";
        };

        this.innerHTML = `
        <nav class="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface dark:bg-surface-container shadow-sm border-r border-outline-variant p-4 z-50 justify-between">
            <div>
                <div class="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface dark:text-on-surface mb-8 px-2">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">stars</span>
                    Dedran
                </div>
                <div class="flex flex-col gap-2">
                    <a class="${getLinkClass('feed')}" href="dashboard.html">
                        <span class="${getIconClass('feed')}" style="${activeTab === 'feed' ? "font-variation-settings: 'FILL' 1;" : ""}">home</span>
                        <span class="font-label-md text-label-md">Feed</span>
                    </a>
                    <a class="${getLinkClass('perfil')}" href="perfil.html">
                        <span class="${getIconClass('perfil')}">person</span>
                        <span class="font-label-md text-label-md">Profile</span>
                    </a>
                    <a class="${getLinkClass('cursos')}" href="cursos.html">
                        <span class="${getIconClass('cursos')}">auto_stories</span>
                        <span class="font-label-md text-label-md">Courses</span>
                    </a>
                    <a class="${getLinkClass('applications')}" href="#">
                        <span class="${getIconClass('applications')}">work</span>
                        <span class="font-label-md text-label-md">Applications</span>
                    </a>
                    <a class="${getLinkClass('companies')}" href="#">
                        <span class="${getIconClass('companies')}">groups</span>
                        <span class="font-label-md text-label-md">Companies & Users</span>
                    </a>
                    <a class="${getLinkClass('settings')}" href="#">
                        <span class="${getIconClass('settings')}">settings</span>
                        <span class="font-label-md text-label-md">Personalization</span>
                    </a>
                </div>
            </div>
            <div class="mt-auto">
                <div class="bg-surface-variant/50 rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/30">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-variant">
                            <img alt="User avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwIZilAM5dAGi_V2NnCvZvhL22m9cGH1vNWWbDKlO_gLNwPwq-OSevEPZNUsyKcEDkneKnPTh1ZwtPYoq0tcW7wSNSjwwpMPsxEPRSVxY6brAmEO8KIj6dNu312bHbHNchlntjcDXa-cO1pitch_l0goR9IohhWRfYhEmS5EXebFs6fOZaX5JD8KzZW4hwaRZP2AAM58sVwz4bSLX5Pf_QCjZIS3QLwQ70m9gUqyMmS0hTICcY98j5bjbYqRtufOs9wUyrpw6ZIfjx" />
                        </div>
                        <div class="flex flex-col">
                            <span class="font-label-md text-label-md text-on-surface font-bold">Luis</span>
                            <span class="font-label-sm text-label-sm text-on-surface-variant">luisahg444@gmail.com</span>
                        </div>
                    </div>
                    <button class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors font-label-md">
                        <span class="material-symbols-outlined text-[18px]">logout</span>
                        Sign out
                    </button>
                </div>
            </div>
        </nav>
        
        <!-- TopAppBar Mobile -->
        <nav class="md:hidden flex justify-between items-center px-4 h-16 w-full bg-surface dark:bg-background border-b border-outline-variant fixed top-0 z-50">
            <div class="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">stars</span>
                Dedran
            </div>
            <button class="text-on-surface-variant material-symbols-outlined">menu</button>
        </nav>
        `;
    }
}

customElements.define('dedran-sidebar', DedranSidebar);
