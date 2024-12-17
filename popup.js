document.addEventListener('DOMContentLoaded', () => {
    const websiteInput = document.getElementById('websiteInput');
    const addButton = document.getElementById('addButton');
    const blockedList = document.getElementById('blockedList');

    // Load blocked websites
    const loadBlockedSites = () => {
        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            renderBlockedSites(blockedSites);
        });
    };

    // Render blocked websites list
    const renderBlockedSites = (sites) => {
        blockedList.innerHTML = '';
        if (sites.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No websites blocked yet';
            blockedList.appendChild(emptyState);
            return;
        }

        sites.forEach((site) => {
            const li = document.createElement('li');
            li.className = 'list-item';
            
            const siteInfo = document.createElement('div');
            siteInfo.className = 'site-info';
            
            const icon = document.createElement('div');
            icon.className = 'site-icon';
            icon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" />
                </svg>
            `;
            
            const domain = document.createElement('span');
            domain.className = 'site-domain';
            domain.textContent = site;
            
            siteInfo.appendChild(icon);
            siteInfo.appendChild(domain);
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            `;
            deleteButton.setAttribute('aria-label', `Remove ${site} from blocked list`);
            
            deleteButton.addEventListener('click', () => {
                li.classList.add('fade-out');
                setTimeout(() => removeSite(site), 200);
            });
            
            li.appendChild(siteInfo);
            li.appendChild(deleteButton);
            blockedList.appendChild(li);
        });
    };

    // Add new website to blocked list
    const addSite = () => {
        const site = websiteInput.value.trim().toLowerCase();
        if (!site) return;

        // Basic URL validation
        if (!/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/.test(site)) {
            websiteInput.classList.add('error');
            setTimeout(() => {
                websiteInput.classList.remove('error');
            }, 2000);
            return;
        }

        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            if (blockedSites.includes(site)) {
                websiteInput.classList.add('warning');
                setTimeout(() => {
                    websiteInput.classList.remove('warning');
                }, 2000);
                return;
            }

            const updatedSites = [...blockedSites, site];
            chrome.storage.sync.set({ blockedSites: updatedSites }, () => {
                renderBlockedSites(updatedSites);
                websiteInput.value = '';
                websiteInput.classList.add('success');
                setTimeout(() => {
                    websiteInput.classList.remove('success');
                }, 1000);
            });
        });
    };

    // Remove website from blocked list
    const removeSite = (site) => {
        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            const updatedSites = blockedSites.filter(s => s !== site);
            chrome.storage.sync.set({ blockedSites: updatedSites }, () => {
                renderBlockedSites(updatedSites);
            });
        });
    };

    // Event listeners
    addButton.addEventListener('click', addSite);
    websiteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSite();
    });

    // Focus input on popup open
    websiteInput.focus();

    // Initial load
    loadBlockedSites();
}); 