<template>
  <!-- Main Layout Container: Full height flex container with dark mode support -->
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Mobile Overlay Backdrop: Dark overlay that appears when mobile menu is open -->
    <!-- Clicking on it closes the mobile menu -->
    <div
      v-if="isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed top-14 sm:top-16 inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
      aria-label="Close mobile menu"
    />

    <!-- Left Icon Sidebar: Primary navigation sidebar with icon buttons -->
    <!-- On mobile: slides in from left when menu is open, hidden by default -->
    <!-- On desktop: always visible, static positioned -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-50 w-16 bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800 shadow-xl lg:shadow-none transition-transform duration-300"
      :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      aria-label="Main navigation"
    >
      <!-- Logo Section: Contains NHS logo and mobile close button -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 relative">
        <img src="/assets/images/NHS-logo.png" alt="NHS Logo" class="h-10 w-10 object-contain" />
        <!-- Close button only visible on mobile screens -->
        <UButton
          @click.stop="closeMobileMenu"
          variant="primary"
          size="xs"
          icon="lucide:x"
          class="lg:hidden absolute top-2 right-2 w-6 h-6 p-0"
        />
      </div>

      <!-- Main Navigation Icons: Vertical list of navigation icon buttons -->
      <!-- Each button represents a main section (Dashboard, Projects, Analytics, etc.) -->
      <!-- Active section is highlighted with blue background -->
      <nav class="flex-1 flex flex-col items-center py-4 space-y-2" aria-label="Main navigation">
        <UButton
          v-for="item in mainNavItems"
          :key="item.id"
          @click="handleMainNavClick(item.id)"
          variant="ghost"
          :icon="item.icon"
          :ui="getNavButtonUI(item.id)"
         
          :title="item.name"
        />
      </nav>
    </aside>

    <!-- Secondary Navigation Sidebar: Shows sub-navigation items for the active main section -->
    <!-- Can be collapsed on desktop, slides in/out on mobile -->
    <!-- Positioned next to the icon sidebar, shows detailed navigation for current section -->
    <aside 
      class="fixed lg:static inset-y-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 overflow-hidden shadow-xl lg:shadow-none"
      :class="[
        isMobileMenuOpen ? 'left-16' : 'left-0 lg:left-auto',
        !isMobileMenuOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
        isSidebarCollapsed ? 'w-0' : 'w-64'
      ]"
      aria-label="Secondary navigation"
    >
      <!-- Sidebar Header: Shows current section name and mobile close button -->
      <div v-if="!isSidebarCollapsed" class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{{ currentSectionName }}</h2>
        <!-- Mobile close button -->
        <UButton
          @click.stop="closeMobileMenu"
          variant="primary"
          size="sm"
          icon="lucide:x"
          class="lg:hidden w-8 h-8 shrink-0"
        />
      </div>

      <!-- Search Bar: Allows users to search within the current section -->
      <div v-if="!isSidebarCollapsed" class="p-4 border-b border-gray-200 dark:border-gray-800">
        <UInput
          icon="i-lucide-search"
          type="text"
          placeholder="Search..."
        />
      </div>

      <!-- Secondary Navigation Menu: Lists all navigation items for the active section -->
      <!-- Supports both simple links and expandable items with children -->
      <nav v-if="!isSidebarCollapsed" class="flex-1 overflow-y-auto p-3" aria-label="Secondary navigation">
        <div class="space-y-1">
          <template v-for="item in currentNavItems" :key="item.name">
            <!-- Simple Navigation Link: Direct link without children -->
            <NuxtLink
              v-if="!item.children"
              :to="item.path"
              @click="handleSecondaryNavClick"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm group"
              :class="isActive(item.path) 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ item.name }}</span>
              </div>
              <!-- Chevron icon appears on hover for items with count -->
              <UIcon 
                v-if="item.count" 
                name="lucide:chevron-right" 
                class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0" 
              />
            </NuxtLink>

            <!-- Expandable Navigation Item: Has children that can be toggled -->
            <div v-else>
              <UButton
                @click="toggleExpanded(item.name)"
                variant="primary"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                  <span class="truncate">{{ item.name }}</span>
                </div>
                <!-- Chevron rotates 180 degrees when expanded -->
                <UIcon 
                  name="lucide:chevron-down" 
                  class="w-4 h-4 text-gray-400 shrink-0 transition-transform"
                  :class="expandedItems.includes(item.name) ? 'rotate-180' : ''"
                />
              </UButton>
              
              <!-- Child Navigation Items: Nested list of sub-items -->
              <ul v-if="expandedItems.includes(item.name)" class="ml-7 mt-1 space-y-1">
                <li v-for="child in item.children" :key="child.name">
                  <NuxtLink
                    :to="child.path"
                    @click="handleSecondaryNavClick"
                    class="flex items-center px-3 py-2 rounded-lg text-sm"
                    :class="isActive(child.path) 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'"
                  >
                    {{ child.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area: Contains header and page content -->
    <div class="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
      <!-- Top Header: Contains navigation controls, breadcrumb, and action buttons -->
      <header class="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6 z-30">
        <!-- Left Side: Menu toggles and breadcrumb navigation -->
        <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <!-- Mobile Menu Toggle: Hamburger/X icon button, only visible on mobile -->
          <UButton
            @click.stop="toggleMobileMenu"
            variant="primary"
            size="sm"
            :icon="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'"
            class="lg:hidden w-9 h-9 shrink-0"
          />
          <!-- Desktop Sidebar Toggle: Collapse/expand secondary sidebar, only visible on desktop -->
          <UButton
            @click.stop="toggleSidebar"
            variant="primary"
            size="sm"
            :icon="isSidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
            class="hidden lg:flex w-9 h-9 shrink-0"
          />
          
          <!-- Breadcrumb Navigation: Shows navigation path (Home > Section > Page) -->
          <nav class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1" aria-label="Breadcrumb">
            <span class="text-gray-500 dark:text-gray-400 hidden sm:inline">Home</span>
            <UIcon name="lucide:chevron-right" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 hidden sm:inline shrink-0" />
            <span class="text-gray-500 dark:text-gray-400 truncate">{{ currentSectionName }}</span>
            <UIcon name="lucide:chevron-right" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <span class="text-gray-900 dark:text-gray-100 font-medium truncate">{{ pageTitle || 'Overview' }}</span>
          </nav>
        </div>

        <!-- Right Side: Action buttons (theme toggle, notifications, user profile) -->
        <div class="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          <!-- Dark Mode Toggle: Switches between light and dark theme -->
          <UColorModeButton class="w-8 h-8 sm:w-9 sm:h-9" />
          <!-- Notifications Button: Shows notification count badge if there are notifications -->
          <UButton
            variant="primary"
            size="sm"
            icon="lucide:bell"
            class="relative w-8 h-8 sm:w-9 sm:h-9"
            @click="handleNotifications"
          >
            <!-- Notification Badge: Red circle showing count (max 9+) -->
            <span 
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center px-0.5 sm:px-1 bg-red-500 text-white text-[10px] sm:text-xs font-semibold rounded-full border-2 border-white dark:border-gray-900"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </UButton>
          
          <!-- User Profile Dropdown: GitHub-style profile menu with Settings and Logout -->
          <div ref="userMenuRef" class="relative">
            <UButton
              variant="primary"
              size="sm"
              class="w-8 h-8 sm:w-9 sm:h-9 p-0 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all"
              :class="isUserMenuOpen ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''"
              aria-label="User menu"
              @click="isUserMenuOpen = !isUserMenuOpen"
            >
              <!-- User Avatar: Shows user's profile picture or initials -->
              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-semibold text-xs sm:text-sm">
                <span v-if="!userAvatar">{{ userInitials }}</span>
                <img v-else :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
              </div>
            </UButton>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50"
                @click.stop
              >
                <!-- User Info Header -->
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ userName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
                </div>

                <!-- Menu Items -->
                <div class="py-1">
                  <UButton
                    @click="handleProfileClick"
                    variant="primary"
                    icon="lucide:user"
                    label="Your Profile"
                    class="hover:bg-gray-400 hover:scale-95 transition-all duration-200"
                  />
                   
                  <UButton
                    @click="handleSettingsClick"
                    variant="primary"
                    icon="lucide:settings"
                    label="Settings"
                    class="hover:bg-gray-400 hover:scale-95 transition-all duration-200"
                  />
                    
                </div>

                <!-- Logout Section -->
                <div class="border-t border-gray-200 dark:border-gray-700 py-1">
                  <UButton
                    @click="handleLogoutClick"
                    variant="primary"
                    color="error"
                    icon="lucide:log-out"
                    label="Logout"
                    class="w-full align-center justify-center hover:bg-red-400 hover:scale-95 transition-all duration-200"
                    
                  />
                   
                  
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page Content: Main content area with page title and slot for page-specific content -->
      <main class="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
        <!-- Page Title Section: Displays page title and optional description -->
        <div class="mb-4 sm:mb-6">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">{{ pageTitle || 'Dashboard' }}</h1>
          <p v-if="pageDescription" class="text-sm sm:text-base text-gray-600 dark:text-gray-400">{{ pageDescription }}</p>
        </div>
        <!-- Content Slot: Where page-specific content is rendered -->
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// ============================================================================
// PROPS & ROUTE
// ============================================================================
// Accept page title and description as props from child pages
const props = defineProps(['pageTitle', 'pageDescription']);
// Get current route for active link detection
const route = useRoute();

// ============================================================================
// REACTIVE STATE
// ============================================================================
// Currently active main navigation section (dashboard, projects, etc.)
const activeSection = ref('dashboard');
// Array of expanded menu items (items with children that are currently open)
const expandedItems = ref(['Settings', 'Team']);
// Number of unread notifications (for badge display)
const notificationCount = ref(1);
// Whether the secondary sidebar is collapsed (desktop only)
const isSidebarCollapsed = ref(false);
// Whether the mobile menu is open (mobile only)
const isMobileMenuOpen = ref(false);
// Whether the user profile dropdown menu is open
const isUserMenuOpen = ref(false);

// User profile data (can be fetched from API or store)
const userName = ref('NHS Hospital');
const userEmail = ref('nhsuser@example.com');
const userAvatar = ref(null); // Set to image URL if available

// Compute user initials from name
const userInitials = computed(() => {
  if (!userName.value) return 'U';
  const names = userName.value.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return userName.value.substring(0, 2).toUpperCase();
});

// ============================================================================
// NAVIGATION DATA
// ============================================================================
// Main navigation items displayed in the left icon sidebar
// Each item represents a major section of the application
const mainNavItems = [
  { id: 'dashboard', name: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { id: 'projects', name: 'Projects', icon: 'lucide:folder' },
  { id: 'analytics', name: 'Analytics', icon: 'lucide:bar-chart-3' },
  { id: 'team', name: 'Team', icon: 'lucide:users' },
  { id: 'messages', name: 'Messages', icon: 'lucide:message-square' },
  { id: 'calendar', name: 'Calendar', icon: 'lucide:calendar' },
  { id: 'files', name: 'Files', icon: 'lucide:file-text' },
];

// Navigation sections: Maps each main section to its sub-navigation items
// Each section can have simple links or expandable items with children
const navSections = {
  dashboard: [
    { name: 'Overview', path: '/dashboard', icon: 'lucide:home' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: 'lucide:trending-up' },
    { name: 'Reports', path: '/dashboard/reports', icon: 'lucide:file-bar-chart' },
    { name: 'Statistics', path: '/dashboard/stats', icon: 'lucide:pie-chart' },
  ],
  projects: [
    { name: 'All Projects', path: '/projects', icon: 'lucide:folder-open' },
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
    { 
      name: 'Settings', 
      path: '/team/settings', 
      icon: 'lucide:settings',
      children: [
        { name: 'General', path: '/team/settings/general' },
        { name: 'Security', path: '/team/settings/security' },
        { name: 'Notifications', path: '/team/settings/notifications' },
      ]
    },
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

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
// Get navigation items for the currently active section
const currentNavItems = computed(() => navSections[activeSection.value] || []);

// Get the display name of the currently active section
const currentSectionName = computed(() => 
  mainNavItems.find(item => item.id === activeSection.value)?.name || 'Dashboard'
);

// Check if current screen size is mobile (< 1024px)
// Used to determine mobile-specific behavior
const isMobileScreen = computed(() => 
  globalThis.window !== undefined && globalThis.window.innerWidth < 1024
);

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================
// Get custom UI configuration for navigation buttons based on active state
// Uses UButton's :ui prop to customize styling for active/inactive states
// Returns UI config object that UButton will merge with its default styles
const getNavButtonUI = (itemId) => {
  const isActive = activeSection.value === itemId;
  
  if (isActive) {
    // Active button: Blue background with white text
    return {
      base: 'transition-all bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500',
      color: {
        gray: {
          ghost: 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
        }
      }
    };
  } else {
    // Inactive button: Gray text with hover effects
    return {
      base: 'transition-all text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
      color: {
        gray: {
          ghost: 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        }
      }
    };
  }
};

// Toggle expanded state of a navigation item with children
// If item is expanded, collapse it; if collapsed, expand it
const toggleExpanded = (itemName) => {
  const index = expandedItems.value.indexOf(itemName);
  index > -1 ? expandedItems.value.splice(index, 1) : expandedItems.value.push(itemName);
};

// Check if a given path matches the current route
// Returns true if path exactly matches or is a parent of current route
const isActive = (path) => route.path === path || route.path.startsWith(path + '/');

// ============================================================================
// SIDEBAR & MENU TOGGLE FUNCTIONS
// ============================================================================
// Toggle secondary sidebar collapse state (desktop only)
const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
// Toggle mobile menu open/closed state
const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
// Close mobile menu
const closeMobileMenu = () => isMobileMenuOpen.value = false;

// ============================================================================
// EVENT HANDLERS
// ============================================================================
// Handle click on main navigation icon (Dashboard, Projects, etc.)
// Sets active section and ensures mobile menu is open on mobile devices
const handleMainNavClick = (sectionId) => {
  activeSection.value = sectionId;
  // On mobile: open menu and ensure sidebar is visible
  if (isMobileScreen.value) {
    isMobileMenuOpen.value = true;
    isSidebarCollapsed.value = false;
  }
};

// Handle click on secondary navigation link
// Closes mobile menu after navigation on mobile devices
const handleSecondaryNavClick = () => {
  if (isMobileScreen.value) closeMobileMenu();
};

// Handle notifications button click
const handleNotifications = () => console.log('Notifications clicked');

// Handle logout button click - navigates to home/login page
const handleLogout = () => navigateTo('/');

// Handle profile navigation
const handleProfileClick = () => {
  isUserMenuOpen.value = false;
  navigateTo('/profile');
};

// Handle settings navigation
const handleSettingsClick = () => {
  isUserMenuOpen.value = false;
  navigateTo('/settings');
};

// Handle logout with menu close
const handleLogoutClick = () => {
  isUserMenuOpen.value = false;
  handleLogout();
};

// ============================================================================
// WATCHERS
// ============================================================================
// Close mobile menu automatically when route changes
// This ensures menu doesn't stay open after navigation
watch(() => route.path, () => {
  closeMobileMenu();
  isUserMenuOpen.value = false;
});

// Close user menu when clicking outside
const userMenuRef = ref(null);

onMounted(() => {
  const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      isUserMenuOpen.value = false;
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup on unmount
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
  }
});
</script>