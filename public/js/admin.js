const API_URL = '/api';
const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];

const state = {
    pages: [],
    pagesBySlug: {},
    contentBlocks: [],
    teamMembers: [],
    clients: [],
    testimonials: [],
    partners: [],
    services: [],
    activeTab: 'home',
    activePageId: null
};

const TAB_CONFIG = {
    home: { pageSlug: 'home', title: 'Home Page', description: 'Hero section first, then all home content. Partner logos for the marquee are managed below.' },
    services: { pageSlug: 'services', title: 'Services Page', description: 'Hero section first, then service page text and sections.' },
    team: { pageSlug: 'team', title: 'Team Page', description: 'Hero section first, then all text sections used in Team page.' },
    clients: { pageSlug: 'clients', title: 'Clients Page', description: 'Hero section first, then all text sections used in Clients page.' },
    contact: { pageSlug: 'contact', title: 'Contact Page', description: 'Hero section first, then contact page text. Submissions are shown below.' },
    tokyoSummit: {
        pageSlug: 'tokyo-summit',
        pageSlugCandidates: ['tokyo-summit', 'tokyo-summit-2026'],
        title: 'Tokyo Summit Page',
        description: 'Hero section first, then Tokyo Summit sections in order.'
    },
    settings: {
        pageSlug: '',
        title: 'Site Settings',
        description: 'Edit footer links, social media URLs, contact email and office info.'
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        window.location.href = '/admin/login';
        return;
    }

    bindEvents();
    await loadPages();
    switchTab('home');
});

function bindEvents() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('reloadBlocksBtn')?.addEventListener('click', async () => {
        if (state.activePageId) {
            await loadContentBlocks(state.activePageId);
            showToast('Page content refreshed.');
        }
    });

    document.getElementById('contentModalForm')?.addEventListener('submit', saveContentBlock);
    document.getElementById('closeContentModalBtn')?.addEventListener('click', closeContentModal);
    document.getElementById('cancelContentModalBtn')?.addEventListener('click', closeContentModal);

    document.getElementById('contentModalOverlay')?.addEventListener('click', (event) => {
        if (event.target.id === 'contentModalOverlay') {
            closeContentModal();
        }
    });

    document.getElementById('summitLiveToggle')?.addEventListener('change', saveSummitStatus);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeContentModal();
        }
    });
}

function switchTab(tabName) {
    const tabConfig = TAB_CONFIG[tabName];
    if (!tabConfig) return;

    state.activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    const editorTitle = document.getElementById('editorTitle');
    const editorDescription = document.getElementById('editorDescription');

    if (editorTitle) editorTitle.textContent = tabConfig.title;
    if (editorDescription) editorDescription.textContent = tabConfig.description;

    syncPageAndLoadContent(tabConfig);
}

async function syncPageAndLoadContent(tabConfig) {
    const page = resolvePageFromConfig(tabConfig);
    const contactSubmissionsPanel = document.getElementById('contactSubmissionsPanel');
    const teamManagerPanel = document.getElementById('teamManagerPanel');
    const summitTogglePanel = document.getElementById('summitTogglePanel');

    if (contactSubmissionsPanel) {
        contactSubmissionsPanel.classList.toggle('hidden', state.activeTab !== 'contact');
    }

    if (teamManagerPanel) {
        teamManagerPanel.classList.toggle('hidden', state.activeTab !== 'team');
    }

    const clientsManagerPanel = document.getElementById('clientsManagerPanel');
    if (clientsManagerPanel) {
        clientsManagerPanel.classList.toggle('hidden', state.activeTab !== 'clients');
    }

    const testimonialsManagerPanel = document.getElementById('testimonialsManagerPanel');
    if (testimonialsManagerPanel) {
        testimonialsManagerPanel.classList.toggle('hidden', state.activeTab !== 'clients');
    }

    const partnersManagerPanel = document.getElementById('partnersManagerPanel');
    if (partnersManagerPanel) {
        partnersManagerPanel.classList.toggle('hidden', state.activeTab !== 'partners' && state.activeTab !== 'home');
    }

    const servicesManagerPanel = document.getElementById('servicesManagerPanel');
    if (servicesManagerPanel) {
        servicesManagerPanel.classList.toggle('hidden', state.activeTab !== 'services');
    }

    if (summitTogglePanel) {
        summitTogglePanel.classList.toggle('hidden', state.activeTab !== 'tokyoSummit');
    }

    const settingsManagerPanel = document.getElementById('settingsManagerPanel');
    if (settingsManagerPanel) {
        settingsManagerPanel.classList.toggle('hidden', state.activeTab !== 'settings');
    }

    const contactFormFieldsPanel = document.getElementById('contactFormFieldsPanel');
    if (contactFormFieldsPanel) {
        contactFormFieldsPanel.classList.toggle('hidden', state.activeTab !== 'contact');
    }

    const summitFormFieldsPanel = document.getElementById('summitFormFieldsPanel');
    if (summitFormFieldsPanel) {
        summitFormFieldsPanel.classList.toggle('hidden', state.activeTab !== 'tokyoSummit');
    }

    const summitSubmissionsPanel = document.getElementById('summitSubmissionsPanel');
    if (summitSubmissionsPanel) {
        summitSubmissionsPanel.classList.toggle('hidden', state.activeTab !== 'tokyoSummit');
    }

    if (state.activeTab === 'settings') {
        renderEmptyState('');
        await loadSettingsManager();
        return;
    }

    // Load form fields manager — does not depend on page being found
    // Wrapped in try/catch so a failure here never blocks the rest of the tab load
    if (state.activeTab === 'contact') {
        try { await loadFormFieldsManager('contact'); } catch (e) { /* non-fatal */ }
        try { await loadContactFormSettings(); } catch (e) { /* non-fatal */ }
    }
    if (state.activeTab === 'tokyoSummit') {
        try { await loadFormFieldsManager('summit'); } catch (e) { /* non-fatal */ }
        try { await loadSummitFormSettings(); } catch (e) { /* non-fatal */ }
    }

    if (!page) {
        renderEmptyState(`No page found for ${tabConfig.title}.`);
        state.activePageId = null;
        return;
    }

    state.activePageId = page.id;

    await loadContentBlocks(page.id);
    if (state.activeTab === 'contact') {
        await loadSubmissions();
    }
    if (state.activeTab === 'team') {
        await loadTeamManager();
    }
    if (state.activeTab === 'clients') {
        await loadClientsManager();
        await loadTestimonialsManager();
    }
    if (state.activeTab === 'partners' || state.activeTab === 'home') {
        await loadPartnersManager();
    }
    if (state.activeTab === 'services') {
        await loadServicesManager();
    }
    if (state.activeTab === 'tokyoSummit') {
        syncSummitToggle();
        await loadSummitSubmissions();
    }
}

function resolvePageFromConfig(tabConfig) {
    if (state.pagesBySlug[tabConfig.pageSlug]) {
        return state.pagesBySlug[tabConfig.pageSlug];
    }

    const candidates = tabConfig.pageSlugCandidates || [tabConfig.pageSlug];
    const found = candidates.find((slug) => state.pagesBySlug[slug]);
    if (found) return state.pagesBySlug[found];

    return state.pages.find((page) => page.slug && page.slug.startsWith(tabConfig.pageSlug)) || null;
}

async function loadPages() {
    const pages = await apiCall('/admin/pages');

    state.pages = Array.isArray(pages) ? pages : [];
    state.pagesBySlug = {};

    state.pages.forEach((page) => {
        if (page.slug) state.pagesBySlug[page.slug] = page;
    });
}

async function loadContentBlocks(pageId) {
    const blocks = await apiCall(`/admin/content-blocks?pageId=${pageId}`);
    if (!Array.isArray(blocks)) {
        state.contentBlocks = [];
        renderEmptyState('No blocks found for this page.');
        return;
    }

    state.contentBlocks = blocks.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    renderSectionGroups(state.contentBlocks);
}

async function loadTeamManager() {
    const members = await apiCall('/admin/team');
    const table = document.getElementById('teamManagerTable');
    if (!table) return;

    if (!Array.isArray(members) || !members.length) {
        state.teamMembers = [];
        table.innerHTML = '<tbody><tr><td colspan="5">No team members found.</td></tr></tbody>';
        return;
    }

    state.teamMembers = members;
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name &amp; Position</th>
                <th>Photo</th>
                <th>LinkedIn URL</th>
                <th>Sort / Visible</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${members.map((member) => `
                <tr id="team-row-${member.id}">
                    <td class="team-info-cell">
                        <div class="team-info-cell-inner">
                            <input class="table-input" id="team-name-${member.id}" value="${escapeHtml(member.name || '')}" placeholder="Full name" />
                            <input class="table-input muted" id="team-pos-${member.id}" value="${escapeHtml(member.position_en || '')}" placeholder="Position (English)" />
                            <button type="button" class="link-btn" id="team-extra-btn-${member.id}" onclick="toggleTeamExtra(${member.id})">
                                <i class="fa-solid fa-chevron-down" aria-hidden="true"></i> Translations &amp; Details
                            </button>
                        </div>
                    </td>
                    <td>
                        <div class="photo-input-row">
                            <img class="team-photo-thumb" id="team-thumb-${member.id}" src="${escapeHtml(member.photo_url || '')}" alt="" ${member.photo_url ? '' : 'style="display:none"'}>
                            <div class="photo-input-controls">
                                <input class="table-input" id="team-photo-${member.id}" value="${escapeHtml(member.photo_url || '')}" placeholder="https://..." oninput="document.getElementById('team-thumb-${member.id}').src=this.value;document.getElementById('team-thumb-${member.id}').style.display=this.value?'':'none'" />
                                <label class="upload-icon-btn" title="Upload photo">
                                    <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Upload
                                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" style="display:none" onchange="uploadTeamPhoto(${member.id}, this)">
                                </label>
                            </div>
                        </div>
                    </td>
                    <td><input class="table-input" id="team-linkedin-${member.id}" value="${escapeHtml(member.linkedin_url || '')}" placeholder="https://linkedin.com/in/..." /></td>
                    <td class="sort-visible-cell">
                        <div class="sort-row">
                            Sort <input type="number" class="table-input tiny" id="team-sort-${member.id}" value="${member.sort_order || 0}" min="0" max="999">
                        </div>
                        <label class="visible-toggle-label">
                            <input type="checkbox" id="team-visible-${member.id}" ${member.is_visible ? 'checked' : ''} />
                            Visible
                        </label>
                    </td>
                    <td class="actions-cell">
                        <button class="secondary-btn" onclick="saveTeamMember(${member.id})">Save</button>
                        <button class="danger-btn" onclick="deleteTeamMember(${member.id})">Delete</button>
                    </td>
                </tr>
                <tr class="hidden" id="team-extra-${member.id}">
                    <td colspan="5" class="team-extra-cell">
                        <div class="team-extra-grid">
                            <div>
                                <p class="extra-section-title">Position — Translations</p>
                                <div class="extra-section-fields">
                                    <input class="table-input" id="team-pos-ja-${member.id}" value="${escapeHtml(member.position_ja || '')}" placeholder="Position Japanese (auto if empty)" />
                                    <input class="table-input" id="team-pos-ko-${member.id}" value="${escapeHtml(member.position_ko || '')}" placeholder="Position Korean (auto if empty)" />
                                </div>
                            </div>
                            <div>
                                <p class="extra-section-title">Bio / Role Description</p>
                                <div class="extra-section-fields">
                                    <textarea class="table-input" id="team-bio-${member.id}" placeholder="Bio (English)">${escapeHtml(member.bio_en || '')}</textarea>
                                    <textarea class="table-input" id="team-bio-ja-${member.id}" placeholder="Bio Japanese (auto if empty)">${escapeHtml(member.bio_ja || '')}</textarea>
                                    <textarea class="table-input" id="team-bio-ko-${member.id}" placeholder="Bio Korean (auto if empty)">${escapeHtml(member.bio_ko || '')}</textarea>
                                </div>
                            </div>
                            <div>
                                <p class="extra-section-title">Details</p>
                                <div class="extra-section-fields">
                                    <input class="table-input" id="team-dept-${member.id}" value="${escapeHtml(member.department || '')}" placeholder="Department (e.g. leadership)" />
                                    <input class="table-input" id="team-fp-${member.id}" value="${escapeHtml(member.field_position || '')}" placeholder="Field position (GK, CB, coach...)" />
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function toggleTeamExtra(id) {
    const row = document.getElementById(`team-extra-${id}`);
    const btn = document.getElementById(`team-extra-btn-${id}`);
    if (!row) return;
    const isOpen = row.classList.toggle('hidden') === false;
    if (btn) {
        btn.classList.toggle('open', isOpen);
        btn.innerHTML = `<i class="fa-solid fa-chevron-down" aria-hidden="true"></i> ${isOpen ? 'Hide Details' : 'Translations &amp; Details'}`;
    }
}

async function saveTeamMember(id) {
    const member = state.teamMembers.find((item) => item.id === id);
    if (!member) { showToast('Team member not found.', 'error'); return; }

    const g = (elId) => document.getElementById(elId);
    const v = (elId, fallback = '') => g(elId) ? g(elId).value.trim() : fallback;

    const name = v(`team-name-${id}`, member.name);
    const positionEn = v(`team-pos-${id}`, member.position_en || '-');
    if (!name) { showToast('Name is required.', 'error'); return; }
    if (!positionEn) { showToast('Position (English) is required.', 'error'); return; }

    const payload = {
        name,
        positionEn,
        positionJa: v(`team-pos-ja-${id}`, member.position_ja || ''),
        positionKo: v(`team-pos-ko-${id}`, member.position_ko || ''),
        bioEn: v(`team-bio-${id}`, member.bio_en || ''),
        bioJa: v(`team-bio-ja-${id}`, member.bio_ja || ''),
        bioKo: v(`team-bio-ko-${id}`, member.bio_ko || ''),
        photoUrl: v(`team-photo-${id}`, member.photo_url || ''),
        linkedinUrl: v(`team-linkedin-${id}`, member.linkedin_url || ''),
        department: v(`team-dept-${id}`, member.department || ''),
        fieldPosition: v(`team-fp-${id}`, member.field_position || ''),
        sortOrder: parseInt(v(`team-sort-${id}`, String(member.sort_order || 0))) || 0,
        isVisible: g(`team-visible-${id}`) ? g(`team-visible-${id}`).checked : !!member.is_visible
    };

    const result = await apiCall(`/admin/team/${id}`, { method: 'PUT', body: payload });
    if (!result) return;

    showToast('Team member updated.');
    await loadTeamManager();
}

async function toggleTeamMember(id) {
    const member = state.teamMembers.find((item) => item.id === id);
    if (!member) {
        showToast('Team member not found.', 'error');
        return;
    }

    const payload = {
        name: member.name,
        positionEn: member.position_en || '-',
        positionJa: member.position_ja || '',
        positionKo: member.position_ko || '',
        bioEn: member.bio_en || '',
        bioJa: member.bio_ja || '',
        bioKo: member.bio_ko || '',
        photoUrl: member.photo_url || '',
        linkedinUrl: member.linkedin_url || '',
        department: member.department || '',
        fieldPosition: member.field_position || '',
        sortOrder: member.sort_order || 0,
        isVisible: !member.is_visible
    };

    const result = await apiCall(`/admin/team/${id}`, { method: 'PUT', body: payload });
    if (!result) return;

    showToast(member.is_visible ? 'Team member removed from website.' : 'Team member restored to website.');
    await loadTeamManager();
}

// ============================
// CLIENTS MANAGER
// ============================
async function loadClientsManager() {
    const clients = await apiCall('/admin/clients');
    const table = document.getElementById('clientsManagerTable');
    if (!table) return;

    if (!Array.isArray(clients) || !clients.length) {
        state.clients = [];
        table.innerHTML = '<tbody><tr><td colspan="5">No clients found.</td></tr></tbody>';
        return;
    }

    state.clients = clients;

    table.innerHTML = `
        <thead><tr><th>Logo</th><th>Name</th><th>Website URL</th><th>Sort / Visible</th><th>Actions</th></tr></thead>
        <tbody>
            ${clients.map((c) => `
                <tr>
                    <td>
                        <div class="photo-input-row">
                            <img class="team-photo-thumb" id="client-thumb-${c.id}" src="${escapeHtml(c.logo_url || '')}" alt="" ${c.logo_url ? '' : 'style="display:none"'}>
                            <div class="photo-input-controls">
                                <input class="table-input" id="client-logo-${c.id}" value="${escapeHtml(c.logo_url || '')}" placeholder="https://..." oninput="document.getElementById('client-thumb-${c.id}').src=this.value;document.getElementById('client-thumb-${c.id}').style.display=this.value?'':'none'" />
                                <label class="upload-icon-btn" title="Upload logo">
                                    <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Upload
                                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" style="display:none" onchange="uploadLogoImage('client', ${c.id}, this)">
                                </label>
                            </div>
                        </div>
                    </td>
                    <td><input class="table-input" id="client-name-${c.id}" value="${escapeHtml(c.name || '')}" placeholder="Client name" /></td>
                    <td><input class="table-input" id="client-web-${c.id}" value="${escapeHtml(c.website_url || '')}" placeholder="https://..." /></td>
                    <td class="sort-visible-cell">
                        <div class="sort-row">Sort <input type="number" class="table-input tiny" id="client-sort-${c.id}" value="${c.sort_order || 0}" min="0" max="999"></div>
                        <label class="visible-toggle-label">
                            <input type="checkbox" id="client-visible-${c.id}" ${c.is_visible ? 'checked' : ''} /> Visible
                        </label>
                    </td>
                    <td class="actions-cell">
                        <button class="secondary-btn" onclick="saveClient(${c.id})">Save</button>
                        <button class="danger-btn" onclick="deleteClient(${c.id})">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

async function saveClient(id) {
    const client = state.clients.find((item) => item.id === id);
    if (!client) { showToast('Client not found.', 'error'); return; }
    const g = (elId) => document.getElementById(elId);
    const name = g(`client-name-${id}`) ? g(`client-name-${id}`).value.trim() : client.name;
    if (!name) { showToast('Client name is required.', 'error'); return; }
    const result = await apiCall(`/admin/clients/${id}`, {
        method: 'PUT',
        body: {
            name,
            logoUrl: g(`client-logo-${id}`) ? g(`client-logo-${id}`).value.trim() : (client.logo_url || ''),
            websiteUrl: g(`client-web-${id}`) ? g(`client-web-${id}`).value.trim() : (client.website_url || ''),
            category: client.category || '',
            isVisible: g(`client-visible-${id}`) ? g(`client-visible-${id}`).checked : !!client.is_visible,
            sortOrder: g(`client-sort-${id}`) ? parseInt(g(`client-sort-${id}`).value) || 0 : (client.sort_order || 0)
        }
    });
    if (!result) return;
    showToast('Client updated.');
    await loadClientsManager();
}

// ============================
// PARTNERS MANAGER
// ============================
// TESTIMONIALS MANAGER
async function loadTestimonialsManager() {
    const testimonials = await apiCall('/admin/testimonials');
    const table = document.getElementById('testimonialsManagerTable');
    if (!table) return;

    if (!Array.isArray(testimonials) || !testimonials.length) {
        state.testimonials = [];
        table.innerHTML = '<tbody><tr><td colspan="5">No testimonials found.</td></tr></tbody>';
        return;
    }

    state.testimonials = testimonials;

    table.innerHTML = `
        <thead><tr><th>Author</th><th>Position (EN)</th><th>Quote</th><th>Logos</th><th>Sort / Visible</th><th>Actions</th></tr></thead>
        <tbody>
            ${testimonials.map((t) => `
                <tr id="testimonial-row-${t.id}">
                    <td>
                        <input class="table-input" id="tm-author-${t.id}" value="${escapeHtml(t.author_name || '')}" placeholder="Author name" />
                    </td>
                    <td style="min-width:160px">
                        <input class="table-input" id="tm-pos-en-${t.id}" value="${escapeHtml(t.author_position_en || '')}" placeholder="Position (EN)" />
                    </td>
                    <td style="min-width:220px">
                        <textarea class="table-input" id="tm-quote-en-${t.id}" style="min-height:70px;font-size:0.8rem" placeholder="Quote (English)">${escapeHtml(t.quote_en || '')}</textarea>
                        <button type="button" class="link-btn" id="tm-extra-btn-${t.id}" onclick="toggleTestimonialExtra(${t.id})">
                            <i class="fa-solid fa-chevron-down" aria-hidden="true"></i> JA / KO translations
                        </button>
                    </td>
                    <td>
                        <div class="photo-input-row">
                            <div class="photo-input-controls">
                                <input class="table-input" id="tm-avatar-${t.id}" value="${escapeHtml(t.author_avatar_url || '')}" placeholder="Avatar URL" />
                                <label class="upload-icon-btn" title="Upload avatar">
                                    <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
                                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" style="display:none" onchange="uploadNewLogoGeneric('tm-avatar-${t.id}', this)">
                                </label>
                            </div>
                            <div class="photo-input-controls" style="margin-top:4px">
                                <input class="table-input" id="tm-logo-${t.id}" value="${escapeHtml(t.team_logo_url || '')}" placeholder="Club logo URL" />
                                <label class="upload-icon-btn" title="Upload logo">
                                    <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
                                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" style="display:none" onchange="uploadNewLogoGeneric('tm-logo-${t.id}', this)">
                                </label>
                            </div>
                        </div>
                    </td>
                    <td class="sort-visible-cell">
                        <div class="sort-row">Sort <input type="number" class="table-input tiny" id="tm-sort-${t.id}" value="${t.sort_order || 0}" min="0" max="999"></div>
                        <label class="visible-toggle-label">
                            <input type="checkbox" id="tm-visible-${t.id}" ${t.is_visible ? 'checked' : ''} /> Visible
                        </label>
                    </td>
                    <td class="actions-cell">
                        <button class="secondary-btn" onclick="saveTestimonial(${t.id})">Save</button>
                        <button class="danger-btn" onclick="deleteTestimonial(${t.id})">Delete</button>
                    </td>
                </tr>
                <tr class="hidden" id="tm-extra-${t.id}">
                    <td colspan="6" class="service-extra-cell">
                        <div class="service-extra-grid">
                            <div class="service-extra-section">
                                <p class="extra-section-title">Position (Japanese)</p>
                                <input class="table-input" id="tm-pos-ja-${t.id}" value="${escapeHtml(t.author_position_ja || '')}" placeholder="Position JA (auto if empty)" />
                                <p class="extra-section-title" style="margin-top:8px">Quote (Japanese)</p>
                                <textarea class="table-input" id="tm-quote-ja-${t.id}" style="min-height:70px">${escapeHtml(t.quote_ja || '')}</textarea>
                            </div>
                            <div class="service-extra-section">
                                <p class="extra-section-title">Position (Korean)</p>
                                <input class="table-input" id="tm-pos-ko-${t.id}" value="${escapeHtml(t.author_position_ko || '')}" placeholder="Position KO (auto if empty)" />
                                <p class="extra-section-title" style="margin-top:8px">Quote (Korean)</p>
                                <textarea class="table-input" id="tm-quote-ko-${t.id}" style="min-height:70px">${escapeHtml(t.quote_ko || '')}</textarea>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function toggleTestimonialExtra(id) {
    const row = document.getElementById(`tm-extra-${id}`);
    const btn = document.getElementById(`tm-extra-btn-${id}`);
    if (!row) return;
    const isOpen = row.classList.toggle('hidden') === false;
    if (btn) {
        btn.classList.toggle('open', isOpen);
        btn.innerHTML = `<i class="fa-solid fa-chevron-down" aria-hidden="true"></i> ${isOpen ? 'Hide translations' : 'JA / KO translations'}`;
    }
}

async function saveTestimonial(id) {
    const t = state.testimonials.find((item) => item.id === id);
    if (!t) { showToast('Testimonial not found.', 'error'); return; }
    const g = (elId) => document.getElementById(elId);
    const v = (elId, fallback = '') => g(elId) ? g(elId).value.trim() : fallback;

    const authorName = v(`tm-author-${id}`, t.author_name);
    const quoteEn = v(`tm-quote-en-${id}`, t.quote_en);
    if (!authorName) { showToast('Author name is required.', 'error'); return; }
    if (!quoteEn) { showToast('Quote (English) is required.', 'error'); return; }

    const result = await apiCall(`/admin/testimonials/${id}`, {
        method: 'PUT',
        body: {
            authorName,
            authorPositionEn: v(`tm-pos-en-${id}`, t.author_position_en || ''),
            authorPositionJa: v(`tm-pos-ja-${id}`, t.author_position_ja || ''),
            authorPositionKo: v(`tm-pos-ko-${id}`, t.author_position_ko || ''),
            quoteEn,
            quoteJa: v(`tm-quote-ja-${id}`, t.quote_ja || ''),
            quoteKo: v(`tm-quote-ko-${id}`, t.quote_ko || ''),
            authorAvatarUrl: v(`tm-avatar-${id}`, t.author_avatar_url || ''),
            teamLogoUrl: v(`tm-logo-${id}`, t.team_logo_url || ''),
            isVisible: g(`tm-visible-${id}`) ? g(`tm-visible-${id}`).checked : !!t.is_visible,
            sortOrder: parseInt(v(`tm-sort-${id}`, String(t.sort_order || 0))) || 0
        }
    });
    if (!result) return;
    showToast('Testimonial updated.');
    await loadTestimonialsManager();
}

async function deleteTestimonial(id) {
    if (!confirm('Delete this testimonial permanently? This cannot be undone.')) return;
    const result = await apiCall(`/admin/testimonials/${id}`, { method: 'DELETE' });
    if (!result) return;
    showToast('Testimonial deleted.');
    await loadTestimonialsManager();
}

function openAddTestimonialForm() {
    document.getElementById('addTestimonialForm')?.classList.remove('hidden');
}

function closeAddTestimonialForm() {
    document.getElementById('addTestimonialForm')?.classList.add('hidden');
    ['newTestimonialAuthor', 'newTestimonialPosition', 'newTestimonialAvatar', 'newTestimonialLogo',
     'newTestimonialQuoteEn', 'newTestimonialPositionJa', 'newTestimonialPositionKo',
     'newTestimonialQuoteJa', 'newTestimonialQuoteKo'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

async function addTestimonial() {
    const authorName = document.getElementById('newTestimonialAuthor')?.value.trim();
    const quoteEn = document.getElementById('newTestimonialQuoteEn')?.value.trim();
    if (!authorName) { showToast('Author name is required.', 'error'); return; }
    if (!quoteEn) { showToast('Quote (English) is required.', 'error'); return; }
    const nextSort = state.testimonials.length > 0
        ? Math.max(...state.testimonials.map((t) => t.sort_order || 0)) + 1
        : 1;
    const g = (id) => document.getElementById(id)?.value.trim() || '';
    const result = await apiCall('/admin/testimonials', {
        method: 'POST',
        body: {
            authorName,
            authorPositionEn: g('newTestimonialPosition'),
            authorPositionJa: g('newTestimonialPositionJa'),
            authorPositionKo: g('newTestimonialPositionKo'),
            quoteEn,
            quoteJa: g('newTestimonialQuoteJa'),
            quoteKo: g('newTestimonialQuoteKo'),
            authorAvatarUrl: g('newTestimonialAvatar') || null,
            teamLogoUrl: g('newTestimonialLogo') || null,
            isVisible: true,
            sortOrder: nextSort
        }
    });
    if (!result) return;
    showToast('Testimonial added.');
    closeAddTestimonialForm();
    await loadTestimonialsManager();
}

async function loadPartnersManager() {
    const partners = await apiCall('/admin/partners');
    const table = document.getElementById('partnersManagerTable');
    if (!table) return;

    if (!Array.isArray(partners) || !partners.length) {
        state.partners = [];
        table.innerHTML = '<tbody><tr><td colspan="6">No partners found.</td></tr></tbody>';
        return;
    }

    state.partners = partners;

    table.innerHTML = `
        <thead><tr><th>Logo</th><th>Name</th><th>Website URL</th><th>Country</th><th>Sort / Visible</th><th>Actions</th></tr></thead>
        <tbody>
            ${partners.map((p) => `
                <tr>
                    <td>
                        <div class="photo-input-row">
                            <img class="team-photo-thumb" id="partner-thumb-${p.id}" src="${escapeHtml(p.logo_url || '')}" alt="" ${p.logo_url ? '' : 'style="display:none"'}>
                            <div class="photo-input-controls">
                                <input class="table-input" id="partner-logo-${p.id}" value="${escapeHtml(p.logo_url || '')}" placeholder="https://..." oninput="document.getElementById('partner-thumb-${p.id}').src=this.value;document.getElementById('partner-thumb-${p.id}').style.display=this.value?'':'none'" />
                                <label class="upload-icon-btn" title="Upload logo">
                                    <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Upload
                                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" style="display:none" onchange="uploadLogoImage('partner', ${p.id}, this)">
                                </label>
                            </div>
                        </div>
                    </td>
                    <td><input class="table-input" id="partner-name-${p.id}" value="${escapeHtml(p.name || '')}" placeholder="Partner name" /></td>
                    <td><input class="table-input" id="partner-web-${p.id}" value="${escapeHtml(p.website_url || '')}" placeholder="https://..." /></td>
                    <td><input class="table-input" id="partner-country-${p.id}" value="${escapeHtml(p.country || '')}" placeholder="Country" /></td>
                    <td class="sort-visible-cell">
                        <div class="sort-row">Sort <input type="number" class="table-input tiny" id="partner-sort-${p.id}" value="${p.sort_order || 0}" min="0" max="999"></div>
                        <label class="visible-toggle-label">
                            <input type="checkbox" id="partner-visible-${p.id}" ${p.is_visible ? 'checked' : ''} /> Visible
                        </label>
                    </td>
                    <td class="actions-cell">
                        <button class="secondary-btn" onclick="savePartner(${p.id})">Save</button>
                        <button class="danger-btn" onclick="deletePartner(${p.id})">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

async function savePartner(id) {
    const partner = state.partners.find((item) => item.id === id);
    if (!partner) { showToast('Partner not found.', 'error'); return; }
    const g = (elId) => document.getElementById(elId);
    const name = g(`partner-name-${id}`) ? g(`partner-name-${id}`).value.trim() : partner.name;
    if (!name) { showToast('Partner name is required.', 'error'); return; }
    const result = await apiCall(`/admin/partners/${id}`, {
        method: 'PUT',
        body: {
            name,
            logoUrl: g(`partner-logo-${id}`) ? g(`partner-logo-${id}`).value.trim() : (partner.logo_url || ''),
            websiteUrl: g(`partner-web-${id}`) ? g(`partner-web-${id}`).value.trim() : (partner.website_url || ''),
            country: g(`partner-country-${id}`) ? g(`partner-country-${id}`).value.trim() : (partner.country || ''),
            category: partner.category || '',
            descriptionEn: partner.description_en || '',
            isVisible: g(`partner-visible-${id}`) ? g(`partner-visible-${id}`).checked : !!partner.is_visible,
            sortOrder: g(`partner-sort-${id}`) ? parseInt(g(`partner-sort-${id}`).value) || 0 : (partner.sort_order || 0)
        }
    });
    if (!result) return;
    showToast('Partner updated.');
    await loadPartnersManager();
}

// ============================
// SERVICES MANAGER
// ============================
async function loadServicesManager() {
    const services = await apiCall('/admin/services');
    const table = document.getElementById('servicesManagerTable');
    if (!table) return;

    if (!Array.isArray(services) || !services.length) {
        state.services = [];
        table.innerHTML = '<tbody><tr><td colspan="5">No services found.</td></tr></tbody>';
        return;
    }

    state.services = services;

    table.innerHTML = `
        <thead><tr><th>Title (EN)</th><th>Image</th><th>Sort / Visible</th><th>Actions</th></tr></thead>
        <tbody>
            ${services.map((s) => `
                <tr id="service-row-${s.id}">
                    <td class="service-info-cell">
                        <div class="service-info-cell-inner">
                        <input class="table-input" id="service-title-${s.id}" value="${escapeHtml(s.title_en || s.slug || '')}" placeholder="Service title (English)" />
                        <button type="button" class="link-btn" id="service-extra-btn-${s.id}" onclick="toggleServiceExtra(${s.id})">
                            <i class="fa-solid fa-chevron-down" aria-hidden="true"></i> Subtitle &amp; Description
                        </button>
                        </div>
                    </td>
                    <td>
                        <div class="photo-input-row">
                            <img class="team-photo-thumb" id="service-thumb-${s.id}" src="${escapeHtml(s.image_url || '')}" alt="" ${s.image_url ? '' : 'style="display:none"'}>
                            <div class="photo-input-controls">
                                <input class="table-input" id="service-img-${s.id}" value="${escapeHtml(s.image_url || '')}" placeholder="https://..." oninput="document.getElementById('service-thumb-${s.id}').src=this.value;document.getElementById('service-thumb-${s.id}').style.display=this.value?'':'none'" />
                                <label class="upload-icon-btn" title="Upload image">
                                    <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Upload
                                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" style="display:none" onchange="uploadLogoImage('service', ${s.id}, this)">
                                </label>
                            </div>
                        </div>
                    </td>
                    <td class="sort-visible-cell">
                        <div class="sort-row">Sort <input type="number" class="table-input tiny" id="service-sort-${s.id}" value="${s.sort_order || 0}" min="0" max="999"></div>
                        <label class="visible-toggle-label">
                            <input type="checkbox" id="service-visible-${s.id}" ${s.is_visible ? 'checked' : ''} /> Visible
                        </label>
                    </td>
                    <td class="actions-cell">
                        <button class="secondary-btn" onclick="saveService(${s.id})">Save</button>
                    </td>
                </tr>
                <tr class="hidden" id="service-extra-${s.id}">
                    <td colspan="4" class="service-extra-cell">
                        <div class="service-extra-grid">
                            <div class="service-extra-section">
                                <p class="extra-section-title">Subtitle (English)</p>
                                <textarea class="table-input" id="service-subtitle-${s.id}" placeholder="Short subtitle shown under the title...">${escapeHtml(s.subtitle_en || '')}</textarea>
                            </div>
                            <div class="service-extra-section">
                                <p class="extra-section-title">Description (English)</p>
                                <textarea class="table-input" id="service-desc-${s.id}" style="min-height:100px" placeholder="Full description of this service...">${escapeHtml(s.description_en || '')}</textarea>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function toggleServiceExtra(id) {
    const row = document.getElementById(`service-extra-${id}`);
    const btn = document.getElementById(`service-extra-btn-${id}`);
    if (!row) return;
    const isOpen = row.classList.toggle('hidden') === false;
    if (btn) {
        btn.classList.toggle('open', isOpen);
        btn.innerHTML = `<i class="fa-solid fa-chevron-down" aria-hidden="true"></i> ${isOpen ? 'Hide Details' : 'Subtitle &amp; Description'}`;
    }
}

async function saveService(id) {
    const service = state.services.find((item) => item.id === id);
    if (!service) { showToast('Service not found.', 'error'); return; }
    const g = (elId) => document.getElementById(elId);
    const result = await apiCall(`/admin/services/${id}`, {
        method: 'PUT',
        body: {
            titleEn: g(`service-title-${id}`) ? g(`service-title-${id}`).value.trim() : undefined,
            subtitleEn: g(`service-subtitle-${id}`) ? g(`service-subtitle-${id}`).value.trim() : undefined,
            descriptionEn: g(`service-desc-${id}`) ? g(`service-desc-${id}`).value.trim() : undefined,
            imageUrl: g(`service-img-${id}`) ? g(`service-img-${id}`).value.trim() : undefined,
            isVisible: g(`service-visible-${id}`) ? g(`service-visible-${id}`).checked : service.is_visible,
            sortOrder: g(`service-sort-${id}`) ? parseInt(g(`service-sort-${id}`).value) || 0 : service.sort_order
        }
    });
    if (!result) return;
    showToast('Service updated.');
    await loadServicesManager();
}

async function uploadLogoImage(type, id, fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
        const input = document.getElementById(`${type}-${type === 'service' ? 'img' : 'logo'}-${id}`);
        const thumb = document.getElementById(`${type}-thumb-${id}`);
        if (input) input.value = url;
        if (thumb) { thumb.src = url; thumb.style.display = ''; }
        showToast('Foto subida. Haz clic en Save para guardar.');
    }
    fileInput.value = '';
}

function updateSummitBadge(isLive) {
    const badge = document.getElementById('summitStatusBadge');
    const text = document.getElementById('summitStatusText');
    const labelOff = document.getElementById('summitLabelOff');
    const labelOn = document.getElementById('summitLabelOn');
    if (badge) badge.classList.toggle('live', isLive);
    if (text) text.textContent = isLive ? 'Live' : 'Coming Soon';
    if (labelOff) labelOff.classList.toggle('active-label', !isLive);
    if (labelOn) labelOn.classList.toggle('active-label', isLive);
}

async function syncSummitToggle() {
    const toggle = document.getElementById('summitLiveToggle');
    if (!toggle) return;
    const rows = await apiCall('/admin/settings');
    if (!rows) return;
    const setting = rows.find(function(r) { return r.key === 'summit_form_enabled'; });
    const isLive = setting && setting.value_en === 'true';
    toggle.checked = isLive;
    updateSummitBadge(isLive);
}

async function saveSummitStatus() {
    const toggle = document.getElementById('summitLiveToggle');
    if (!toggle) return;

    const isLive = toggle.checked;
    const result = await apiCall('/admin/settings/summit_form_enabled', {
        method: 'PUT',
        body: { value: isLive ? 'true' : 'false' }
    });
    if (!result) return;

    updateSummitBadge(isLive);
    showToast(isLive ? 'Tokyo Summit: modo LIVE activado.' : 'Tokyo Summit: modo Coming Soon activado.');
}

function renderSectionGroups(blocks) {
    const container = document.getElementById('sectionGroups');
    if (!container) return;

    if (!blocks.length) {
        renderEmptyState('This page has no content blocks yet.');
        return;
    }

    const groups = {};
    blocks.forEach((block) => {
        const sectionName = String(block.section || 'general').trim().toLowerCase();
        if (!groups[sectionName]) groups[sectionName] = [];
        groups[sectionName].push(block);
    });

    const orderedSections = Object.keys(groups).sort((a, b) => sectionPriority(a) - sectionPriority(b) || a.localeCompare(b));

    const SECTION_COLORS = [
        '#18c964', '#38bdf8', '#fb923c', '#a78bfa',
        '#facc15', '#f472b6', '#34d399', '#f87171',
        '#fbbf24', '#67e8f9', '#818cf8', '#4ade80'
    ];

    container.innerHTML = orderedSections.map((section, idx) => {
        const color = SECTION_COLORS[idx % SECTION_COLORS.length];
        const rows = groups[section]
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((block) => {
                const content = block.content_en || '';
                const isImageUrl = /^(https?:\/\/.+|\/(img|uploads)\/).+\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(content) || block.block_type === 'image';
                const previewHtml = isImageUrl
                    ? `<img class="block-thumb" src="${escapeHtml(content)}" alt="" loading="lazy">`
                    : `<p class="block-preview">${escapeHtml(content.slice(0, 180)) || '<em>empty</em>'}</p>`;
                return `
                    <div class="block-row">
                        <div class="block-meta">
                            <p class="block-key">${escapeHtml(formatBlockKey(block.block_key || 'no-key'))}</p>
                            <p class="block-type">${escapeHtml(block.block_type || 'text')}</p>
                        </div>
                        <div class="block-preview-wrap">${previewHtml}</div>
                        <button class="edit-block-btn" onclick="openContentModal(${block.id})"><i class="fa-solid fa-pen" aria-hidden="true"></i> Edit</button>
                    </div>
                `;
            })
            .join('');

        return `
            <article class="section-card">
                <header class="section-card-head" style="border-left: 3px solid ${color}">
                    <h3 style="color: ${color}">${formatSectionName(section)} Section</h3>
                    <span class="section-block-count">${groups[section].length} block${groups[section].length !== 1 ? 's' : ''}</span>
                </header>
                <div class="section-blocks">${rows}</div>
            </article>
        `;
    }).join('');
}

function renderEmptyState(message) {
    const container = document.getElementById('sectionGroups');
    if (!container) return;
    container.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function sectionPriority(section) {
    if (section.includes('hero')) return 0;
    if (section.includes('expertise')) return 1;
    if (section.includes('about')) return 2;
    if (section.includes('service')) return 3;
    return 10;
}

function formatSectionName(value) {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function formatBlockKey(key) {
    return key
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

// Parse HTML title patterns into plain fields
// Handles: "TEXT<br><span>GREEN</span>", "TEXT <span>GREEN</span>", "PLAIN TEXT"
function parseHtmlTitle(html) {
    if (!html) return { before: '', highlight: '', hasBr: false };
    // Pattern with <br>
    const brMatch = html.match(/^([\s\S]*?)<br\s*\/?><span[^>]*>([\s\S]*?)<\/span>\s*$/i);
    if (brMatch) return { before: brMatch[1].trim(), highlight: brMatch[2].trim(), hasBr: true };
    // Pattern without <br>
    const spanMatch = html.match(/^([\s\S]*?)\s*<span[^>]*>([\s\S]*?)<\/span>\s*$/i);
    if (spanMatch) return { before: spanMatch[1].trim(), highlight: spanMatch[2].trim(), hasBr: false };
    // No span at all — plain text
    return { before: html, highlight: '', hasBr: false };
}

function buildHtmlTitle(before, highlight, hasBr) {
    const b = before.trim();
    const h = highlight.trim();
    if (!h) return b;
    const sep = hasBr ? '<br>' : ' ';
    return `${b}${sep}<span>${h}</span>`;
}

function updateHtmlLivePreview() {
    const main = document.getElementById('modalTitleMain')?.value || '';
    const accent = document.getElementById('modalTitleAccent')?.value || '';
    const hasBr = document.getElementById('modalTitleBr')?.checked;
    const previewEl = document.getElementById('modalLivePreview');
    if (!previewEl) return;
    const html = buildHtmlTitle(main, accent, hasBr);
    previewEl.innerHTML = html || '<em style="color:#4a5a4a">Escribe algo arriba para ver el preview</em>';
}

function openContentModal(id) {
    const block = state.contentBlocks.find((item) => item.id === id);
    if (!block) {
        showToast('Content block not found.', 'error');
        return;
    }

    const form = document.getElementById('contentModalForm');
    const overlay = document.getElementById('contentModalOverlay');
    if (!form || !overlay) return;

    // Set hidden technical fields
    form.blockId.value = String(block.id);
    form.section.value = block.section || '';
    form.blockKey.value = block.block_key || '';
    form.blockType.value = block.block_type || 'text';
    form.sortOrder.value = block.sort_order || 0;

    const blockType = block.block_type || 'text';
    const content = block.content_en || '';
    const isImage = blockType === 'image' || /^(https?:\/\/.+|\/(img|uploads)\/).+\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(content);
    const isHtml = blockType === 'html' && !isImage;

    // Set modal title and kicker
    const kicker = document.getElementById('contentModalKicker');
    const title = document.getElementById('contentModalTitle');
    if (kicker) kicker.textContent = formatSectionName(block.section || 'general') + ' section';
    if (title) {
        const icon = isImage ? '\uD83D\uDDBC\uFE0F ' : isHtml ? '\u270F\uFE0F ' : '';
        title.textContent = icon + formatBlockKey(block.block_key || 'Content');
    }

    // Render current content preview
    const currentPreview = document.getElementById('modalCurrentPreview');
    const currentWrap = document.getElementById('modalCurrentWrap');
    if (currentPreview) {
        if (isHtml) {
            // For html blocks show rendered HTML as preview
            currentPreview.innerHTML = content || '<p class="modal-text-empty">Sin contenido todavía.</p>';
        } else if (isImage && content) {
            currentPreview.innerHTML = `<img class="modal-img-preview" src="${escapeHtml(content)}" alt="Imagen actual">`;
        } else if (content) {
            currentPreview.innerHTML = `<p class="modal-text-preview">${escapeHtml(content)}</p>`;
        } else {
            currentPreview.innerHTML = '<p class="modal-text-empty">Sin contenido todavía.</p>';
        }
    }
    // For html blocks, the live preview replaces the current-content box
    if (currentWrap) currentWrap.classList.toggle('hidden', isHtml);

    // Render the edit area based on type
    const newWrap = document.getElementById('modalNewWrap');
    if (newWrap) {
        if (isImage) {
            newWrap.innerHTML = `
                <label class="modal-section-label">Subir nueva imagen</label>
                <div class="modal-upload-zone" id="modalUploadZone">
                    <label class="upload-zone-label" for="modalImageFileInput">
                        <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
                        <span>Haz clic o arrastra una foto aquí</span>
                        <small>JPG, PNG, WebP, SVG &ndash; máx. 8 MB</small>
                        <input type="file" id="modalImageFileInput" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" style="display:none">
                    </label>
                </div>
                <p class="modal-section-label" style="margin-top:12px">O pega una URL directa</p>
                <div class="modal-url-row">
                    <input type="text" id="modalContentEn" name="contentEn" placeholder="https://..." value="${escapeHtml(content)}" autocomplete="off">
                    <button type="button" class="secondary-btn" id="modalPreviewUrlBtn" title="Previsualizar"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                </div>
            `;
            document.getElementById('modalImageFileInput')?.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const url = await uploadFile(file, 'modalUploadZone');
                if (url) {
                    const input = document.getElementById('modalContentEn');
                    if (input) input.value = url;
                    const blockTypeInput = document.querySelector('#contentModalForm [name="blockType"]');
                    if (blockTypeInput) blockTypeInput.value = 'image';
                    if (currentPreview) currentPreview.innerHTML = `<img class="modal-img-preview" src="${escapeHtml(url)}" alt="Subida">`;
                    if (currentWrap) currentWrap.classList.remove('hidden');
                    document.getElementById('contentModalForm')?.requestSubmit();
                }
            });
            document.getElementById('modalPreviewUrlBtn')?.addEventListener('click', () => {
                const url = document.getElementById('modalContentEn')?.value.trim();
                if (url && currentPreview) {
                    currentPreview.innerHTML = `<img class="modal-img-preview" src="${escapeHtml(url)}" alt="Preview">`;
                    if (currentWrap) currentWrap.classList.remove('hidden');
                }
            });

        } else if (isHtml) {
            const parsed = parseHtmlTitle(content);
            newWrap.innerHTML = `
                <div class="html-editor-fields">
                    <div class="html-field-group">
                        <label class="modal-section-label">Texto principal</label>
                        <input type="text" id="modalTitleMain" class="modal-text-input" value="${escapeHtml(parsed.before)}" placeholder="Ej: OUR" autocomplete="off">
                    </div>
                    <div class="html-field-group">
                        <label class="modal-section-label">Texto en verde <span class="green-badge">VERDE</span></label>
                        <input type="text" id="modalTitleAccent" class="modal-text-input" value="${escapeHtml(parsed.highlight)}" placeholder="Ej: STARTING LINEUP" autocomplete="off">
                    </div>
                    <label class="checkbox-label" style="margin:4px 0 12px">
                        <input type="checkbox" id="modalTitleBr" ${parsed.hasBr ? 'checked' : ''}>
                        Separar en dos líneas
                    </label>
                </div>
                <div class="html-live-preview-wrap">
                    <p class="modal-section-label">Vista previa</p>
                    <div class="html-live-preview" id="modalLivePreview"></div>
                </div>
                <input type="hidden" id="modalContentEn" name="contentEn" value="${escapeHtml(content)}">
                <div class="lang-fields-group">
                    <p class="lang-title"><i class="fa-solid fa-language" aria-hidden="true"></i> Traducciones <span class="lang-hint">&nbsp;— dejar vacío para auto-traducción</span></p>
                    <div class="lang-field-row">
                        <label for="modalContentJa">日本語 (Japonés)</label>
                        <textarea id="modalContentJa" name="contentJa" placeholder="Se auto-traduce si se deja vacío...">${escapeHtml(block.content_ja || '')}</textarea>
                    </div>
                    <div class="lang-field-row">
                        <label for="modalContentKo">한국어 (Coreano)</label>
                        <textarea id="modalContentKo" name="contentKo" placeholder="Se auto-traduce si se deja vacío...">${escapeHtml(block.content_ko || '')}</textarea>
                    </div>
                </div>
            `;
            // Wire up live preview
            ['modalTitleMain', 'modalTitleAccent', 'modalTitleBr'].forEach((elId) => {
                document.getElementById(elId)?.addEventListener('input', updateHtmlLivePreview);
                document.getElementById(elId)?.addEventListener('change', updateHtmlLivePreview);
            });
            updateHtmlLivePreview();

        } else {
            const jaContent = escapeHtml(block.content_ja || '');
            const koContent = escapeHtml(block.content_ko || '');
            newWrap.innerHTML = `
                <label class="modal-section-label" for="modalContentEn">English</label>
                <textarea id="modalContentEn" name="contentEn" placeholder="Escribe aquí el nuevo contenido..." required></textarea>
                <div class="lang-fields-group">
                    <p class="lang-title"><i class="fa-solid fa-language" aria-hidden="true"></i> Traducciones <span class="lang-hint">&nbsp;— dejar vacío para auto-traducción</span></p>
                    <div class="lang-field-row">
                        <label for="modalContentJa">日本語 (Japonés)</label>
                        <textarea id="modalContentJa" name="contentJa" placeholder="Se auto-traduce si se deja vacío...">${jaContent}</textarea>
                    </div>
                    <div class="lang-field-row">
                        <label for="modalContentKo">한국어 (Coreano)</label>
                        <textarea id="modalContentKo" name="contentKo" placeholder="Se auto-traduce si se deja vacío...">${koContent}</textarea>
                    </div>
                </div>
            `;
        }
    }

    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeContentModal() {
    const overlay = document.getElementById('contentModalOverlay');
    const form = document.getElementById('contentModalForm');
    if (overlay) overlay.classList.add('hidden');
    form?.reset();
    document.body.classList.remove('modal-open');
}

async function saveContentBlock(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const blockId = parseInt(formData.get('blockId') || '0', 10);

    if (!state.activePageId || !blockId) {
        showToast('Invalid block selection.', 'error');
        return;
    }

    // If this is an html title block (split fields), rebuild HTML before saving
    const mainInput = document.getElementById('modalTitleMain');
    const accentInput = document.getElementById('modalTitleAccent');
    const brInput = document.getElementById('modalTitleBr');
    if (mainInput && accentInput) {
        const rebuilt = buildHtmlTitle(mainInput.value, accentInput.value, brInput?.checked);
        const hiddenInput = document.getElementById('modalContentEn');
        if (hiddenInput) hiddenInput.value = rebuilt;
    }

    // Read final contentEn value
    const contentEnValue = (document.getElementById('modalContentEn')?.value || '').trim();

    // Read manual JA/KO overrides (may be empty if fields not shown or left blank)
    const contentJaValue = (document.getElementById('modalContentJa')?.value || '').trim();
    const contentKoValue = (document.getElementById('modalContentKo')?.value || '').trim();

    const payload = {
        pageId: state.activePageId,
        section: String(formData.get('section') || '').trim(),
        blockKey: String(formData.get('blockKey') || '').trim(),
        blockType: String(formData.get('blockType') || 'text').trim(),
        contentEn: contentEnValue,
        sortOrder: parseInt(formData.get('sortOrder') || '0', 10) || 0,
        autoTranslate: true
    };

    // Include manual translations only if the user provided them;
    // backend auto-fills whichever remain empty.
    if (contentJaValue) payload.contentJa = contentJaValue;
    if (contentKoValue) payload.contentKo = contentKoValue;

    const result = await apiCall(`/admin/content-blocks/${blockId}`, { method: 'PUT', body: payload });
    if (!result) return;

    closeContentModal();
    showToast('Block updated successfully.');
    await loadContentBlocks(state.activePageId);
}

async function loadSubmissions() {
    const submissions = await apiCall('/admin/submissions?source=contact');
    const table = document.getElementById('submissionsTable');
    if (!table) return;

    table.innerHTML = `
        <thead><tr>
            <th>Date</th><th>First Name</th><th>Last Name</th><th>Email</th>
            <th>Company</th><th>Message</th><th>Newsletter</th>
        </tr></thead>
        <tbody></tbody>
    `;

    if (!Array.isArray(submissions) || !submissions.length) {
        table.querySelector('tbody').innerHTML = '<tr><td colspan="7">No submissions yet.</td></tr>';
        return;
    }

    const tbody = table.querySelector('tbody');
    submissions.forEach((sub) => {
        const extra = sub.extra_data || {};
        const newsletter = extra.mailingListOptIn
            ? '<span style="color:#22c55e;font-weight:600">✓ Yes</span>'
            : '<span style="color:#9ca3af">✗ No</span>';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="white-space:nowrap">${new Date(sub.created_at).toLocaleDateString()}</td>
            <td>${escapeHtml(sub.first_name || '-')}</td>
            <td>${escapeHtml(sub.last_name || '-')}</td>
            <td>${escapeHtml(sub.email || '-')}</td>
            <td>${escapeHtml(sub.company || '-')}</td>
            <td style="max-width:260px;word-break:break-word">${escapeHtml(sub.message || '-')}</td>
            <td>${newsletter}</td>
        `;
        tbody.appendChild(row);
    });
}

async function loadSummitSubmissions() {
    const submissions = await apiCall('/admin/submissions?source=tokyo-summit');
    const table = document.getElementById('summitSubmissionsTable');
    if (!table) return;

    table.innerHTML = `
        <thead><tr>
            <th>Date</th><th>First Name</th><th>Last Name</th><th>Email</th>
            <th>Company</th><th>Position</th><th>Country</th>
            <th>Ticket</th><th>Phone</th><th>Special Requirements</th>
        </tr></thead>
        <tbody></tbody>
    `;

    if (!Array.isArray(submissions) || !submissions.length) {
        table.querySelector('tbody').innerHTML = '<tr><td colspan="10">No registrations yet.</td></tr>';
        return;
    }

    const tbody = table.querySelector('tbody');
    submissions.forEach((sub) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="white-space:nowrap">${new Date(sub.created_at).toLocaleDateString()}</td>
            <td>${escapeHtml(sub.first_name || '-')}</td>
            <td>${escapeHtml(sub.last_name || '-')}</td>
            <td>${escapeHtml(sub.email || '-')}</td>
            <td>${escapeHtml(sub.company || '-')}</td>
            <td>${escapeHtml(sub.position || '-')}</td>
            <td>${escapeHtml(sub.country || '-')}</td>
            <td>${escapeHtml(sub.ticket_type || '-')}</td>
            <td>${escapeHtml(sub.phone || '-')}</td>
            <td style="max-width:200px;word-break:break-word">${escapeHtml(sub.special_requirements || '-')}</td>
        `;
        tbody.appendChild(row);
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 2400);
}

// ============================
// FILE UPLOAD
// ============================
async function uploadFile(file, spinnerTargetId) {
    const spinnerTarget = spinnerTargetId ? document.getElementById(spinnerTargetId) : null;
    if (spinnerTarget) spinnerTarget.classList.add('uploading');

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_URL}/admin/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            showToast(data.error || 'Upload failed', 'error');
            return null;
        }
        showToast('Photo uploaded successfully.');
        return data.url || null;
    } catch (err) {
        showToast('Upload failed', 'error');
        return null;
    } finally {
        if (spinnerTarget) spinnerTarget.classList.remove('uploading');
    }
}

async function uploadTeamPhoto(memberId, fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
        const input = document.getElementById(`team-photo-${memberId}`);
        const thumb = document.getElementById(`team-thumb-${memberId}`);
        if (input) input.value = url;
        if (thumb) { thumb.src = url; thumb.style.display = ''; }
        showToast('Foto subida. Haz clic en Save para guardar.');
    }
    fileInput.value = '';
}

// ============================
// ADD / DELETE — TEAM
// ============================
function openAddTeamForm() {
    document.getElementById('addTeamForm')?.classList.remove('hidden');
}

function closeAddTeamForm() {
    document.getElementById('addTeamForm')?.classList.add('hidden');
    ['newTeamName', 'newTeamPosition', 'newTeamDepartment', 'newTeamFieldPos', 'newTeamPhoto', 'newTeamLinkedin'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

async function addTeamMember() {
    const name = document.getElementById('newTeamName')?.value.trim();
    const positionEn = document.getElementById('newTeamPosition')?.value.trim();
    if (!name || !positionEn) { showToast('Name and position are required.', 'error'); return; }
    const result = await apiCall('/admin/team', {
        method: 'POST',
        body: {
            name,
            positionEn,
            positionJa: '',
            positionKo: '',
            bioEn: '',
            bioJa: '',
            bioKo: '',
            photoUrl: document.getElementById('newTeamPhoto')?.value.trim() || '',
            linkedinUrl: document.getElementById('newTeamLinkedin')?.value.trim() || '',
            department: document.getElementById('newTeamDepartment')?.value.trim() || '',
            fieldPosition: document.getElementById('newTeamFieldPos')?.value.trim() || '',
            sortOrder: 0,
            isVisible: true
        }
    });
    if (!result) return;
    showToast('Team member added.');
    closeAddTeamForm();
    await loadTeamManager();
}

async function uploadNewTeamPhoto(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
        const input = document.getElementById('newTeamPhoto');
        if (input) input.value = url;
    }
    fileInput.value = '';
}

async function deleteTeamMember(id) {
    if (!confirm('Delete this team member permanently? This cannot be undone.')) return;
    const result = await apiCall(`/admin/team/${id}`, { method: 'DELETE' });
    if (!result) return;
    showToast('Team member deleted.');
    await loadTeamManager();
}

// ============================
// ADD / DELETE — CLIENTS
// ============================
function openAddClientForm() {
    document.getElementById('addClientForm')?.classList.remove('hidden');
}

function closeAddClientForm() {
    document.getElementById('addClientForm')?.classList.add('hidden');
    ['newClientName', 'newClientLogo', 'newClientWebsite'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

async function addClient() {
    const name = document.getElementById('newClientName')?.value.trim();
    if (!name) { showToast('Client name is required.', 'error'); return; }
    const nextSortOrder = state.clients.length > 0
        ? Math.max(...state.clients.map((c) => c.sort_order || 0)) + 1
        : 0;
    const result = await apiCall('/admin/clients', {
        method: 'POST',
        body: {
            name,
            logoUrl: document.getElementById('newClientLogo')?.value.trim() || '',
            websiteUrl: document.getElementById('newClientWebsite')?.value.trim() || '',
            category: '',
            isVisible: true,
            sortOrder: nextSortOrder
        }
    });
    if (!result) return;
    showToast('Client added.');
    closeAddClientForm();
    await loadClientsManager();
}

async function deleteClient(id) {
    if (!confirm('Delete this client permanently? This cannot be undone.')) return;
    const result = await apiCall(`/admin/clients/${id}`, { method: 'DELETE' });
    if (!result) return;
    showToast('Client deleted.');
    await loadClientsManager();
}

async function uploadNewLogoGeneric(inputId, fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
        const input = document.getElementById(inputId);
        if (input) input.value = url;
    }
    fileInput.value = '';
}

// ============================
// ADD / DELETE — PARTNERS
// ============================
function openAddPartnerForm() {
    document.getElementById('addPartnerForm')?.classList.remove('hidden');
}

function closeAddPartnerForm() {
    document.getElementById('addPartnerForm')?.classList.add('hidden');
    ['newPartnerName', 'newPartnerLogo', 'newPartnerWebsite', 'newPartnerCountry'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

async function addPartner() {
    const name = document.getElementById('newPartnerName')?.value.trim();
    if (!name) { showToast('Partner name is required.', 'error'); return; }
    const nextSortOrder = state.partners.length > 0
        ? Math.max(...state.partners.map((p) => p.sort_order || 0)) + 1
        : 0;
    const result = await apiCall('/admin/partners', {
        method: 'POST',
        body: {
            name,
            logoUrl: document.getElementById('newPartnerLogo')?.value.trim() || '',
            websiteUrl: document.getElementById('newPartnerWebsite')?.value.trim() || '',
            category: '',
            country: document.getElementById('newPartnerCountry')?.value.trim() || '',
            descriptionEn: '',
            isVisible: true,
            sortOrder: nextSortOrder
        }
    });
    if (!result) return;
    showToast('Partner added.');
    closeAddPartnerForm();
    await loadPartnersManager();
}

async function deletePartner(id) {
    if (!confirm('Delete this partner permanently? This cannot be undone.')) return;
    const result = await apiCall(`/admin/partners/${id}`, { method: 'DELETE' });
    if (!result) return;
    showToast('Partner deleted.');
    await loadPartnersManager();
}

// ============================
// FORM FIELDS MANAGER
// ============================
async function loadFormFieldsManager(formId) {
    const tableId = formId === 'contact' ? 'contactFormFieldsTable' : 'summitFormFieldsTable';
    const table = document.getElementById(tableId);
    if (!table) return;

    const fields = await apiCall(`/admin/form-fields?formId=${formId}`);
    if (!Array.isArray(fields)) {
        table.innerHTML = '<tbody><tr><td colspan="6">Failed to load fields.</td></tr></tbody>';
        return;
    }

    if (!fields.length) {
        table.innerHTML = '<tbody><tr><td colspan="6">No fields found. Run migration 003 first.</td></tr></tbody>';
        return;
    }

    table.innerHTML = `
        <thead>
            <tr>
                <th>Label</th>
                <th>Field Name</th>
                <th>Type</th>
                <th>Placeholder</th>
                <th>Sort / Required / Visible</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${fields.map((f) => `
                <tr id="ff-row-${f.id}">
                    <td><input class="table-input" id="ff-label-${f.id}" value="${escapeHtml(f.label_en || '')}" placeholder="Label" /></td>
                    <td>
                        <span class="muted" style="font-size:0.85rem">${escapeHtml(f.field_name || '')}${f.is_core ? ' <i class="fa-solid fa-lock" title="Core field" style="color:var(--grey)"></i>' : ''}</span>
                    </td>
                    <td><span class="muted" style="font-size:0.85rem">${escapeHtml(f.field_type || '')}</span></td>
                    <td><input class="table-input" id="ff-placeholder-${f.id}" value="${escapeHtml(f.placeholder_en || '')}" placeholder="Placeholder" /></td>
                    <td class="sort-visible-cell">
                        <div class="sort-row">
                            Sort <input type="number" class="table-input tiny" id="ff-sort-${f.id}" value="${f.sort_order || 0}" min="0" max="999">
                        </div>
                        <label class="visible-toggle-label">
                            <input type="checkbox" id="ff-req-${f.id}" ${f.is_required ? 'checked' : ''}> Required
                        </label>
                        <label class="visible-toggle-label">
                            <input type="checkbox" id="ff-vis-${f.id}" ${f.is_visible ? 'checked' : ''}> Visible
                        </label>
                    </td>
                    <td class="actions-cell">
                        <button class="secondary-btn" onclick="saveFormField(${f.id})">Save</button>
                        ${f.is_core ? '' : `<button class="danger-btn" onclick="deleteFormField(${f.id}, '${escapeHtml(formId)}')">Delete</button>`}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function openAddFormFieldForm(formId) {
    const id = formId === 'contact' ? 'addContactFieldForm' : 'addSummitFieldForm';
    document.getElementById(id)?.classList.remove('hidden');
}

function closeAddFormFieldForm(formId) {
    const id = formId === 'contact' ? 'addContactFieldForm' : 'addSummitFieldForm';
    const form = document.getElementById(id);
    if (!form) return;
    form.classList.add('hidden');
    const prefix = formId === 'contact' ? 'newContactField' : 'newSummitField';
    ['Label', 'Name', 'Placeholder', 'Sort'].forEach((suffix) => {
        const el = document.getElementById(`${prefix}${suffix}`);
        if (el) el.value = suffix === 'Sort' ? '100' : '';
    });
    const reqEl = document.getElementById(`${prefix}Required`);
    if (reqEl) reqEl.checked = false;
}

async function addFormField(formId) {
    const prefix = formId === 'contact' ? 'newContactField' : 'newSummitField';
    const labelEl = document.getElementById(`${prefix}Label`);
    const nameEl = document.getElementById(`${prefix}Name`);
    const typeEl = document.getElementById(`${prefix}Type`);
    const placeholderEl = document.getElementById(`${prefix}Placeholder`);
    const sortEl = document.getElementById(`${prefix}Sort`);
    const reqEl = document.getElementById(`${prefix}Required`);

    const labelEn = labelEl?.value.trim();
    const fieldName = nameEl?.value.trim();
    const fieldType = typeEl?.value || 'text';

    if (!labelEn) { showToast('Label is required.', 'error'); return; }
    if (!fieldName) { showToast('Field name is required.', 'error'); return; }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fieldName)) { showToast('Field name must start with a letter and contain only letters, numbers, or underscores.', 'error'); return; }

    const result = await apiCall('/admin/form-fields', {
        method: 'POST',
        body: {
            formId,
            fieldType,
            fieldName,
            labelEn,
            placeholderEn: placeholderEl?.value.trim() || '',
            isRequired: reqEl?.checked || false,
            isVisible: true,
            sortOrder: parseInt(sortEl?.value || '100', 10)
        }
    });

    if (!result) return;
    showToast('Field added.');
    closeAddFormFieldForm(formId);
    await loadFormFieldsManager(formId);
}

async function saveFormField(fieldId) {
    const labelEl = document.getElementById(`ff-label-${fieldId}`);
    const placeholderEl = document.getElementById(`ff-placeholder-${fieldId}`);
    const sortEl = document.getElementById(`ff-sort-${fieldId}`);
    const reqEl = document.getElementById(`ff-req-${fieldId}`);
    const visEl = document.getElementById(`ff-vis-${fieldId}`);

    const labelEn = labelEl?.value.trim();
    if (!labelEn) { showToast('Label cannot be empty.', 'error'); return; }

    const result = await apiCall(`/admin/form-fields/${fieldId}`, {
        method: 'PUT',
        body: {
            labelEn,
            placeholderEn: placeholderEl?.value.trim() || '',
            isRequired: reqEl?.checked || false,
            isVisible: visEl?.checked !== false,
            sortOrder: parseInt(sortEl?.value || '0', 10)
        }
    });

    if (!result) return;
    showToast('Field saved.');
}

async function deleteFormField(fieldId, formId) {
    if (!confirm('Delete this field? This cannot be undone.')) return;
    const result = await apiCall(`/admin/form-fields/${fieldId}`, { method: 'DELETE' });
    if (!result) return;
    showToast('Field deleted.');
    await loadFormFieldsManager(formId);
}

// ============================
// SETTINGS MANAGER
// ============================
async function runTranslateAll() {
    const btn = document.getElementById('translateAllBtn');
    const result = document.getElementById('translateAllResult');
    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Translating...';
    if (result) { result.style.display = 'none'; result.textContent = ''; }

    const data = await apiCall('/admin/translate-all', { method: 'POST', body: { force: true } });

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-language" aria-hidden="true"></i> Translate Entire Website';

    if (!data) return;

    if (result) {
        result.style.display = 'block';
        result.style.color = data.failed > 0 ? 'var(--yellow, orange)' : 'var(--green)';
        result.textContent = `Done — ${data.total} items translated`
            + (data.results.content_blocks ? ` (${data.results.content_blocks} page blocks` : '')
            + (data.results.team ? `, ${data.results.team} team members` : '')
            + (data.results.faq ? `, ${data.results.faq} FAQ items` : '')
            + (data.results.content_blocks || data.results.team || data.results.faq ? ')' : '')
            + (data.failed > 0 ? ` · ${data.failed} failed` : '');
    }
    showToast(`Translation complete — ${data.total} items updated.`);
}

async function loadSettingsManager() {
    const container = document.getElementById('settingsForm');
    if (!container) return;

    const rows = await apiCall('/admin/settings');
    if (!Array.isArray(rows)) {
        container.innerHTML = '<p class="section-intro">Failed to load settings.</p>';
        return;
    }

    const data = {};
    rows.forEach((row) => { data[row.key] = row.value_en || ''; });

    const groups = [
        {
            title: 'General',
            icon: 'fa-globe',
            fields: [
                { key: 'site_name', label: 'Site Name', placeholder: 'GANASSA', hint: 'Brand name used in page titles and meta tags.' },
                { key: 'site_slogan', label: 'Site Slogan', placeholder: 'Football Intelligence Agency' }
            ]
        },
        {
            title: 'Contact',
            icon: 'fa-envelope',
            fields: [
                { key: 'contact_email', label: 'Contact Email', placeholder: 'info@ganassa.jp', hint: 'Email displayed in the footer and used for contact form notifications.' }
            ]
        },
        {
            title: 'Social Media',
            icon: 'fa-share-nodes',
            fields: [
                { key: 'social_linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/ganassa' },
                { key: 'social_twitter', label: 'X / Twitter URL', placeholder: 'https://x.com/ganassa' },
                { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/ganassa' }
            ]
        },
        {
            title: 'Office Locations',
            icon: 'fa-building',
            fields: [
                { key: 'office_japan', label: 'Japan Office', placeholder: 'Ganassa LLC - Tokyo and Higashikawa, Japan' },
                { key: 'office_singapore', label: 'Singapore Office', placeholder: 'Ganassa PTE LTD - Singapore' },
                { key: 'office_china', label: 'China Office', placeholder: 'Ganassa Sports Consulting LTD - Shanghai, China' },
                { key: 'office_spain', label: 'Spain Office', placeholder: 'Ganassa Europe - Madrid, Spain' }
            ]
        },
        {
            title: 'Footer',
            icon: 'fa-copyright',
            fields: [
                { key: 'footer_copyright', label: 'Copyright Text', placeholder: '© 2026 GANASSA. All rights reserved.', hint: 'Copyright line shown at the bottom of every page.' }
            ]
        },
    ];

    container.innerHTML = groups.map((group) => `
        <article class="section-card">
            <header class="section-card-head">
                <h3><i class="fa-solid ${group.icon}" aria-hidden="true"></i> ${escapeHtml(group.title)}</h3>
            </header>
            <div class="settings-fields">
                ${group.fields.map((field) => `
                    <div class="settings-field-row">
                        <label class="settings-field-label" for="setting-${field.key}">${escapeHtml(field.label)}</label>
                        <div class="settings-field-input-wrap">
                            <input type="text" id="setting-${field.key}" class="table-input" value="${escapeHtml(data[field.key] || '')}" placeholder="${escapeHtml(field.placeholder || '')}" autocomplete="off">
                            <button class="secondary-btn" onclick="saveSetting('${field.key}')">Save</button>
                        </div>
                        ${field.hint ? `<p class="settings-field-hint">${escapeHtml(field.hint)}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </article>
    `).join('');
}

function renderSettingsGroupsHtml(groups, data) {
    return groups.map((group) => `
        <article class="section-card" style="margin-bottom:16px">
            <header class="section-card-head">
                <h3><i class="fa-solid ${group.icon}" aria-hidden="true"></i> ${escapeHtml(group.title)}</h3>
            </header>
            <div class="settings-fields">
                ${group.fields.map((field) => `
                    <div class="settings-field-row">
                        <label class="settings-field-label" for="setting-${field.key}">${escapeHtml(field.label)}</label>
                        <div class="settings-field-input-wrap">
                            <input type="text" id="setting-${field.key}" class="table-input" value="${escapeHtml(data[field.key] || '')}" placeholder="${escapeHtml(field.placeholder || '')}" autocomplete="off">
                            <button class="secondary-btn" onclick="saveSetting('${field.key}')">Save</button>
                        </div>
                        ${field.hint ? `<p class="settings-field-hint">${escapeHtml(field.hint)}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </article>
    `).join('');
}

async function loadContactFormSettings() {
    const container = document.getElementById('contactFormSettings');
    if (!container) return;
    const rows = await apiCall('/admin/settings');
    if (!Array.isArray(rows)) return;
    const data = {};
    rows.forEach((row) => { data[row.key] = row.value_en || ''; });
    const groups = [{
        title: 'Contact Form Text',
        icon: 'fa-envelope-open-text',
        fields: [
            { key: 'contact_form_title', label: 'Form Title', placeholder: 'CONTACT FORM' },
            { key: 'contact_form_description', label: 'Form Description', placeholder: 'Fill out the form below...' },
            { key: 'contact_form_submit_btn', label: 'Submit Button Text', placeholder: 'SEND MESSAGE' },
            { key: 'contact_form_footer_note', label: 'Footer Note', placeholder: '* Required fields. We typically respond within 24 hours on business days.' }
        ]
    }];
    container.innerHTML = renderSettingsGroupsHtml(groups, data);
}

async function loadSummitFormSettings() {
    const container = document.getElementById('summitFormSettings');
    if (!container) return;
    const rows = await apiCall('/admin/settings');
    if (!Array.isArray(rows)) return;
    const data = {};
    rows.forEach((row) => { data[row.key] = row.value_en || ''; });
    const groups = [{
        title: 'Registration Form Text',
        icon: 'fa-city',
        fields: [
            { key: 'summit_reg_title', label: 'Form Title', placeholder: 'REGISTER NOW' },
            { key: 'summit_reg_description', label: 'Form Description', placeholder: 'Secure your spot at Tokyo Summit 2026...' },
            { key: 'summit_reg_submit_btn', label: 'Submit Button Text', placeholder: 'SUBMIT REGISTRATION' }
        ]
    }];
    container.innerHTML = renderSettingsGroupsHtml(groups, data);
}

async function saveSetting(key) {
    const input = document.getElementById(`setting-${key}`);
    if (!input) return;
    const value = input.value.trim();
    const result = await apiCall(`/admin/settings/${key}`, {
        method: 'PUT',
        body: { value }
    });
    if (!result) return;
    showToast('Setting saved.');
}

async function changePassword() {
    const currentPassword = document.getElementById('currentPassword')?.value || '';
    const newPassword = document.getElementById('newPassword')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';

    if (!currentPassword) { showToast('Enter your current password.', 'error'); return; }
    if (newPassword.length < 8) { showToast('New password must be at least 8 characters.', 'error'); return; }
    if (newPassword !== confirmPassword) { showToast('New passwords do not match.', 'error'); return; }

    const result = await apiCall('/admin/change-password', {
        method: 'PUT',
        body: { currentPassword, newPassword }
    });
    if (!result) return;

    showToast('Password changed successfully.');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

async function apiCall(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        ...options
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        if (response.status === 401) {
            logout();
            return null;
        }
        if (response.status === 204) {
            return { success: true };
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `Request failed (${response.status})`);
        }
        return data;
    } catch (error) {
        showToast(error.message, 'error');
        return null;
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function logout() {
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/admin/login';
}
