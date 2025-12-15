<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
        <!-- Icon Sidebar -->
        <aside class="w-16 bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800">
            <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                <img src="/assets/images/NHS-logo.png" alt="NHS Logo" class="h-10 w-10 object-contain" />
            </div>

            <nav class="flex-1 flex flex-col items-center py-4 space-y-2">
                <UButton
                    v-for="item in mainNavItems"
                    :key="item.id"
                    @click="handleMainNavClick(item.id)"
                    variant="primary"
                    :icon="item.icon"
                    :ui="getNavButtonUI(item.id)"
                    :title="item.name"
                />
            </nav>
        </aside>

        <!-- Secondary Sidebar -->
        <aside
            class="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 overflow-hidden"
            :class="isSidebarCollapsed ? 'w-0' : 'w-64'"
        >
            <template v-if="!isSidebarCollapsed">
                <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ currentSectionName }}</h2>
                </div>

                <div class="p-4 border-b border-gray-200 dark:border-gray-800">
                    <UInput icon="i-lucide-search" placeholder="Search..." />
                </div>

                <div class="flex-1 flex flex-col overflow-hidden">
                    <nav class="flex-1 overflow-y-auto p-3">
                        <div class="space-y-1">
                            <template v-for="item in currentNavItems" :key="item.name">
                                <NuxtLink
                                    v-if="!item.children"
                                    :to="item.path"
                                    class="flex items-center px-3 py-2 rounded-lg text-sm group"
                                    :class="isActive(item.path)
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
                                >
                                    <div class="flex items-center gap-3 flex-1">
                                        <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                                        <span class="truncate">{{ item.name }}</span>
                                    </div>
                                    <UIcon
                                        v-if="item.count"
                                        name="lucide:chevron-right"
                                        class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0"
                                    />
                                </NuxtLink>

                                <div v-else>
                                    <UButton
                                        @click="toggleExpanded(item.name)"
                                        variant="ghost"
                                        class="w-full justify-between"
                                    >
                                        <div class="flex items-center gap-3 flex-1">
                                            <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                                            <span class="truncate">{{ item.name }}</span>
                                        </div>
                                        <UIcon
                                            name="lucide:chevron-down"
                                            class="w-4 h-4 text-gray-400 shrink-0 transition-transform"
                                            :class="expandedItems.includes(item.name) ? 'rotate-180' : ''"
                                        />
                                    </UButton>

                                    <ul v-if="expandedItems.includes(item.name)" class="ml-8 mt-1 space-y-1">
                                        <li v-for="child in item.children" :key="child.name">
                                            <NuxtLink
                                                :to="child.path"
                                                class="flex items-center px-3 py-2 rounded-lg text-sm"
                                                :class="isActive(child.path)
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'"
                                            >
                                                {{ child.name }}
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </div>
                    </nav>

                    <div class="p-3 pt-2 border-t border-gray-200 dark:border-gray-800 mt-auto">
                        <UButton
                            @click="navigateTo('/upgrade')"
                            variant="soft"
                            color="neutral"
                            block
                            icon="lucide:sparkles"
                            label="Upgrade"
                        />
                    </div>
                </div>
            </template>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6">
                <div class="flex items-center gap-4 flex-1">
                    <UButton
                        @click="isSidebarCollapsed = !isSidebarCollapsed"
                        variant="ghost"
                        color="gray"
                        size="sm"
                        :icon="isSidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
                    />

                    <nav class="flex items-center gap-2">
                        <template v-for="(item, index) in breadcrumbItems" :key="index">
                            <NuxtLink
                                v-if="item.to"
                                :to="item.to"
                                class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <span>{{ item.label }}</span>
                            </NuxtLink>
                            <span
                                v-else
                                class="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 font-medium"
                            >
                                {{ item.label }}
                            </span>
                            <UIcon
                                v-if="index < breadcrumbItems.length - 1"
                                name="lucide:chevron-right"
                                class="w-4 h-4 text-gray-400 dark:text-gray-500"
                            />
                        </template>
                    </nav>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Customer Care Button (Account Manager) -->
                    <UButton variant="outline" color="neutral">
                        <UAvatar
                            :src="accountManagerAvatar"
                            :alt="accountManagerName"
                            size="sm"
                        />
                        <div class="flex flex-col items-start ml-2">
                            <span class="text-sm leading-tight">Meet {{ accountManagerName }}</span>
                            <span class="text-xs leading-tight text-gray-500 dark:text-gray-400">Your Account Manager</span>
                        </div>
                    </UButton>

                    <!-- Notification Button -->
                    <div class="relative">
                        <UButton
                            variant="soft"
                            color="neutral"
                            size="md"
                            icon="tabler:message"
                            @click="console.log('Notifications')"
                        />
                        <!-- <UBadge
                            v-if="notificationCount > 0"
                            :label="notificationCount > 9 ? '9+' : String(notificationCount)"
                            color="red"
                            class="absolute -top-1 -right-1"
                        /> -->
                    </div>

                    <!-- User Profile Avatar with Dropdown -->
                    <div ref="userMenuRef" class="relative">
                        <UButton
                            variant="solid"
                            color='info'
                            class="p-0.5 rounded-full"
                            @click="isUserMenuOpen = !isUserMenuOpen"
                        >
                            <UAvatar
                                :src="userAvatar"
                                :alt="userName"
                                :text="!userAvatar ? userInitials : undefined"
                                size="sm"
                            />
                        </UButton>

                        <!-- Dropdown Menu -->
                        <div
                            v-if="isUserMenuOpen"
                            class="absolute right-0 mt-2 w-72 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 z-50 overflow-hidden"
                            @click.stop
                        >
                            <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div class="flex items-center gap-3">
                                    <UAvatar
                                        :src="userAvatar"
                                        :alt="userName"
                                        :text="!userAvatar ? userInitials : undefined"
                                        size="md"
                                        
                                    />
                                    <div class="flex-1">
                                        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ userName }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="py-2 px-4 space-y-2">
                                <UButton
                                    @click="isUserMenuOpen = false; navigateTo('/profile')"
                                    variant="outline"
                                    block
                                    color="neutral"
                                    icon="lucide:user"
                                    label="My Profile"
                                />
                                <UButton
                                    @click="isUserMenuOpen = false; navigateTo('/settings')"
                                    variant="outline"
                                    color="neutral"
                                    block
                                  
                                    icon="lucide:settings"
                                    label="Settings"
                                />
                            </div>

                            <div class="border-t border-gray-200 dark:border-gray-700"></div>

                            <div class="px-4 py-2.5">
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="lucide:moon" class="w-4 h-4" />
                                        <span class="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                                    </div>
                                    <USwitch
                                        :model-value="isDarkMode"
                                        @update:model-value="colorMode.preference = $event ? 'dark' : 'light'"
                                    />
                                </div>
                            </div>

                            <div class="px-4 pb-3 pt-2">
                                <UButton
                                    @click="isUserMenuOpen = false; navigateTo('/')"
                                    label="Log out"
                                    color="error"
                                    variant="solid"
                                    block
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['pageTitle', 'pageDescription']);
const route = useRoute();
const colorMode = useColorMode();

const activeSection = ref('dashboard');
const expandedItems = ref(['Settings', 'Team']);
const notificationCount = ref(1);
const isSidebarCollapsed = ref(false);
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

const userName = ref('NHS Hospital');
const userEmail = ref('nhsuser@example.com');
const userAvatar = ref(null);
const accountManagerName = ref('Helper');
const accountManagerAvatar = ref('https://www.qualtrics.com/sites/default/files/styles/standard_medium_retina/public/2025-11/great-customer-service.jpg.webp?itok=XBoyPxI_');

const userInitials = computed(() => {
    if (!userName.value) return 'U';
    const names = userName.value.split(' ');
    return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : userName.value.substring(0, 2).toUpperCase();
});

const isDarkMode = computed({
    get: () => colorMode.value === 'dark',
    set: (value) => {
        colorMode.preference = value ? 'dark' : 'light';
    }
});

const mainNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'lucide:layout-dashboard' },
    { id: 'projects', name: 'Projects', icon: 'lucide:folder' },
    { id: 'analytics', name: 'Analytics', icon: 'lucide:bar-chart-3' },
    { id: 'team', name: 'Team', icon: 'lucide:users' },
    { id: 'messages', name: 'Messages', icon: 'lucide:message-square' },
    { id: 'calendar', name: 'Calendar', icon: 'lucide:calendar' },
    { id: 'files', name: 'Files', icon: 'lucide:file-text' },
];

const navSections = {
    dashboard: [
        { name: 'Overview', path: '/dashboard', icon: 'lucide:home' },
        { name: 'Forms', path: '/masters/form_builder/forms', icon: 'lucide:file-text' },
        { name: 'Reports', path: '/reports', icon: 'lucide:file-bar-chart' },
        {name: 'Statistics', path: '/statistics', icon: 'lucide:pie-chart' },
        {name:'Patient', path: '/patient', icon: 'lucide:user' },
        {name:'Table',path:'/table', icon:'lucide:table' },
        {name:'Hr',path:'/hr', icon:'lucide:users'}
    ],
    projects: [
        { name: 'All Projects', path: '/registration', icon: 'lucide:folder-open' },
        { name: 'Active', path: '/projects/active', icon: 'lucide:zap' },
        { name: 'Archived', path: '/projects/archived', icon: 'lucide:archive' },
        { name: 'Templates', path: '/projects/templates', icon: 'lucide:layout-template' },
    ],
    analytics: [
        { name: 'Overview', path: '/analytics', icon: 'lucide:activity' },
        { name: 'Traffic', path: '/analytics/traffic', icon: 'lucide:trending-up' },
        { name: 'Conversion', path: '/analytics/conversion', icon: 'lucide:target' },
        { name: 'Revenue', path: '/analytics/revenue', icon: 'lucide:dollar-sign' },
    ],
    team: [
        { name: 'Members', path: '/team/members', icon: 'lucide:users' },
        { name: 'Roles', path: '/team/roles', icon: 'lucide:shield' },
        { name: 'Permissions', path: '/team/permissions', icon: 'lucide:lock' },
        
    ],
    messages: [
        { name: 'Inbox', path: '/messages', icon: 'lucide:inbox' },
        { name: 'Sent', path: '/messages/sent', icon: 'lucide:send' },
        { name: 'Drafts', path: '/messages/drafts', icon: 'lucide:file-edit' },
        { name: 'Archived', path: '/messages/archived', icon: 'lucide:archive' },
    ],
    calendar: [
        { name: 'Month View', path: '/calendar', icon: 'lucide:calendar-days' },
        { name: 'Week View', path: '/calendar/week', icon: 'lucide:calendar-range' },
        { name: 'Events', path: '/calendar/events', icon: 'lucide:calendar-check' },
        { name: 'Reminders', path: '/calendar/reminders', icon: 'lucide:bell' },
    ],
    files: [
        { name: 'All Files', path: '/files', icon: 'lucide:folder' },
        { name: 'Recent', path: '/files/recent', icon: 'lucide:clock' },
        { name: 'Shared', path: '/files/shared', icon: 'lucide:share-2' },
        { name: 'Trash', path: '/files/trash', icon: 'lucide:trash-2' },
    ],
};

const currentNavItems = computed(() => navSections[activeSection.value] || []);
const currentSectionName = computed(() => mainNavItems.find(item => item.id === activeSection.value)?.name || 'Dashboard');

const breadcrumbItems = computed(() => {
    const items = [
        { label: 'Home', to: '/' },
        { label: currentSectionName.value }
    ];
    if (props.pageTitle) {
        items.push({ label: props.pageTitle });
    } else {
        items.push({ label: 'Overview' });
    }
    return items;
});

const toggleExpanded = (itemName) => {
    const index = expandedItems.value.indexOf(itemName);
    index > -1 ? expandedItems.value.splice(index, 1) : expandedItems.value.push(itemName);
};

const isActive = (path) => {
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    return route.path === normalizedPath || route.path.startsWith(normalizedPath + '/');
};

const handleMainNavClick = (sectionId) => {
    activeSection.value = sectionId;
};
const getNavButtonUI = (itemId) => {
    const isActive = activeSection.value === itemId;
    return {
        base: isActive
            ? 'transition-all bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
            : 'transition-all text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
        color: {
            gray: {
                ghost: isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
                    : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }
        }
    };
};
watch(() => route.path, () => {
    isUserMenuOpen.value = false;
});

onMounted(() => {
    const handleClickOutside = (event) => {
        if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
            isUserMenuOpen.value = false;
        }
    };

    if (typeof document !== 'undefined') {
        document.addEventListener('click', handleClickOutside);
        onUnmounted(() => document.removeEventListener('click', handleClickOutside));
    }
});
</script>