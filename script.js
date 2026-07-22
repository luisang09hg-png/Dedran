// Aldebaram Dashboard — Tab Switching
function switchTab(tabId, element) {
    var tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(function (tab) {
        tab.classList.add('hidden');
    });

    var selectedTab = document.getElementById('tab-' + tabId);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    var navLinks = document.querySelectorAll('#navLinks a[data-tab]');
    navLinks.forEach(function (link) {
        link.classList.remove('active');
    });

    if (element) {
        element.classList.add('active');
    }

    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    var mobileNav = document.getElementById('navLinks');
    if (mobileNav) {
        mobileNav.classList.remove('open');
    }
}
