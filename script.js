// Handle tab switching in Dashboard
function switchTab(tabId, element) {
    // 1. Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.add('hidden');
    });

    // 2. Show the selected tab content
    const selectedTab = document.getElementById('tab-' + tabId);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // 3. Update active state on navigation items
    const navItems = document.querySelectorAll('#sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('nav-item-active');
        item.classList.add('text-gray-500');
    });

    // 4. Set current element as active
    if (element) {
        element.classList.add('nav-item-active');
        element.classList.remove('text-gray-500');
    }

    // Replace icons inside the newly shown content
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}
