// Function to create rule for blocking a site
const createRule = (site, ruleId) => ({
    id: ruleId,
    priority: 1,
    action: {
        type: "block"
    },
    condition: {
        urlFilter: `||${site}`,
        resourceTypes: ["main_frame"]
    }
});

// Function to update blocking rules
const updateBlockingRules = async (blockedSites) => {
    try {
        // Remove all existing rules
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: await chrome.declarativeNetRequest.getDynamicRules().then(rules => rules.map(rule => rule.id))
        });

        // Add new rules for each blocked site
        const rules = blockedSites.map((site, index) => createRule(site, index + 1));
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: rules
        });
    } catch (error) {
        console.error('Error updating rules:', error);
    }
};

// Create a blocking page
const createBlockingPage = () => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Site Blocked</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 h-screen flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
                <h1 class="text-2xl font-bold text-red-600 mb-4">Access Blocked</h1>
                <p class="text-gray-700 mb-4">
                    This website has been blocked by the Website Blocker extension.
                </p>
                <p class="text-gray-600 text-sm">
                    To unblock this site, please visit the extension settings.
                </p>
            </div>
        </body>
        </html>
    `;
};

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.blockedSites) {
        updateBlockingRules(changes.blockedSites.newValue || []);
    }
});

// Listen for installation or update
chrome.runtime.onInstalled.addListener(async () => {
    // Initialize storage with empty blocked sites list if not exists
    const result = await chrome.storage.sync.get(['blockedSites']);
    if (!result.blockedSites) {
        await chrome.storage.sync.set({ blockedSites: [] });
    } else {
        // Update rules for existing blocked sites
        updateBlockingRules(result.blockedSites);
    }
}); 