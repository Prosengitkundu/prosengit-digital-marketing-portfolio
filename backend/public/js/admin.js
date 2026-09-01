/* ===========================================================================
   Prosengit CMS — Admin dashboard SPA
   ---------------------------------------------------------------------------
   Vanilla JS. Talks to the /api/* endpoints. Views are rendered into #view.
   =========================================================================== */
'use strict';

const Cms = (() => {
  const viewEl = document.getElementById('view');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBox = document.getElementById('modalBox');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalFoot = document.getElementById('modalFoot');
  const toastWrap = document.getElementById('toastWrap');

  const ICONS = {
    plus: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M1 1l22 22"/></svg>',
    up: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 15l7-7 7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>'
  };

  /* ------------------------------ Auth ------------------------------ */
  async function api(path, opts = {}) {
    const cfg = {
      method: opts.method || 'GET',
      credentials: 'same-origin',
      headers: opts.headers || {},
      body: opts.body
    };
    if (cfg.body && typeof cfg.body === 'object' && !(cfg.body instanceof FormData) && !(cfg.body instanceof Blob)) {
      cfg.headers['Content-Type'] = 'application/json';
      cfg.body = JSON.stringify(cfg.body);
    }
    const res = await fetch('/api' + path, cfg);
    let data;
    try { data = await res.json(); } catch (e) { data = { success: false, error: 'Unexpected response' }; }
    if (res.status === 401) {
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
  }

  /* ------------------------------ UI helpers ------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function toast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.textContent = msg;
    toastWrap.appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  function loading(html = false) {
    viewEl.innerHTML = `<div class="loading"><div class="spinner"></div>${html || 'Loading…'}</div>`;
  }

  function openModal(title, bodyHtml, footHtml = '') {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFoot.innerHTML = footHtml;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

  function confirmDialog(message, onYes, { confirmText = 'Delete', danger = true } = {}) {
    openModal('Please confirm',
      `<p style="margin:0 0 8px">${message}</p>`,
      `<button class="btn btn-ghost" onclick="Cms.closeModal()">Cancel</button>
       <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="confirmYes">${esc(confirmText)}</button>`
    );
    document.getElementById('confirmYes').addEventListener('click', async () => {
      closeModal();
      await onYes();
    });
  }

  function emptyState(msg, icon = 'eye') {
    return `<div class="empty">${ICONS[icon] || ICONS.eye}<div>${esc(msg)}</div></div>`;
  }

  function badgeClass(v) { return v ? 'badge badge-green' : 'badge badge-gray'; }
  function badgeText(v) { return v ? 'Published' : 'Draft'; }

  function statusBadge(s) {
    const map = { new: ['badge-green', 'New'], read: ['badge-blue', 'Read'], replied: ['badge-amber', 'Replied'], archived: ['badge-gray', 'Archived'] };
    const [c, l] = map[s] || ['badge-gray', s];
    return `<span class="status-pill ${s}"><span class="badge ${c}">${l}</span></span>`;
  }

  function field(label, inputHtml, hint = '') {
    return `<div class="field"><label>${esc(label)}</label>${inputHtml}${hint ? `<div class="hint">${esc(hint)}</div>` : ''}</div>`;
  }

  /* ------------------------------ Views registry ------------------------------ */
  const setTitle = (title, sub) => {
    document.getElementById('topbarTitle').textContent = title;
    document.getElementById('topbarSub').textContent = sub || '';
  };

  const views = {};

  /* ============ VIEW: Dashboard ============ */
  views.dashboard = async function () {
    setTitle('Dashboard', 'Overview of your website');
    loading();
    const d = await api('/dashboard');
    const counts = d.counts;
    const stat = (icon, color, num, label) => `<div class="stat"><div class="stat__icon stat--${color}">${icon}</div><div class="stat__num">${num}</div><div class="stat__label">${label}</div></div>`;
    const recent = (rows, url, cols) => rows.length ? `<div class="table-wrap"><table class="table"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map((c, i) => `<td>${i === 0 ? `<b>${esc(r.label)}</b>` : esc(r.val)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : emptyState('Nothing here yet', 'doc');

    const projRows = d.recentProjects.map(p => ({ label: p.title, val: `${p.category} · ${p.published ? 'Published' : 'Draft'}` }));
    const msgRows = d.recentMessages.map(m => ({ label: m.name, val: `${m.email} · ${statusBadge(m.status)}` }));
    const postRows = d.recentPosts.map(p => ({ label: p.title, val: p.category }));

    viewEl.innerHTML = `
      <div class="grid grid-4">
        ${stat(ICONS.plus, 'brand', counts.projects, 'Projects')}
        ${stat(ICONS.plus, 'green', counts.services, 'Services')}
        ${stat(ICONS.plus, 'violet', counts.blog_posts, 'Blog Posts')}
        ${stat(ICONS.plus, 'amber', counts.contact_messages, 'Messages')}
      </div>
      <div class="grid grid-2 mt-24">
        <div class="card">
          <div class="flex justify-between items-center"><h3>Recent Messages</h3><a class="link text-sm" onclick="Cms.goto('messages')">View all</a></div>
          <div class="mt-8">${recent(msgRows, 'messages', ['Name', 'Email · Status'])}</div>
        </div>
        <div class="card">
          <div class="flex justify-between items-center"><h3>Recent Projects</h3><a class="link text-sm" onclick="Cms.goto('projects')">Manage</a></div>
          <div class="mt-8">${recent(projRows, 'projects', ['Title', 'Category'])}</div>
        </div>
      </div>
      <div class="card mt-24">
        <div class="flex justify-between items-center"><h3>Recent Blog Posts</h3><a class="link text-sm" onclick="Cms.goto('blog')">Manage</a></div>
        <div class="mt-8">${recent(postRows, 'blog', ['Title', 'Category'])}</div>
      </div>
      <div class="card mt-24">
        <h3>Quick actions</h3>
        <div class="grid grid-4 mt-16">
          <div class="quick-action" onclick="Cms.goto('services')"><div class="quick-action__icon stat--brand">${ICONS.plus}</div> Add Service</div>
          <div class="quick-action" onclick="Cms.goto('projects')"><div class="quick-action__icon stat--green">${ICONS.plus}</div> Add Project</div>
          <div class="quick-action" onclick="Cms.goto('blog')"><div class="quick-action__icon stat--violet">${ICONS.plus}</div> New Post</div>
          <div class="quick-action" onclick="Cms.goto('media')"><div class="quick-action__icon stat--amber">${ICONS.plus}</div> Upload Media</div>
        </div>
      </div>`;
  };

  /* ============ VIEW: Settings ============ */
  views.settings = async function () {
    setTitle('Site Settings', 'Global website name, contact details & branding');
    loading();
    const rows = await api('/settings/full');
    const map = {};
    rows.forEach(r => { map[r.key] = r.value; });
    viewEl.innerHTML = `
      <div class="section-head"><h2>Website Settings</h2></div>
      <form id="settingsForm">
        <div class="grid grid-2">
          <div class="card">
            <h3>Identity</h3>
            ${field('Website name', `<input class="input" name="site_name" value="${esc(map.site_name)}">`)}
            ${field('Site tagline', `<input class="input" name="site_tagline" value="${esc(map.site_tagline)}">`)}
            ${field('SEO site title', `<input class="input" name="site_title" value="${esc(map.site_title)}">`)}
            ${field('Logo mark text', `<input class="input" name="logo_text" value="${esc(map.logo_text)}">`, 'The small badge/monogram shown next to the name, e.g. PK')}
          </div>
          <div class="card">
            <h3>Media</h3>
            ${field('Logo image URL', `<input class="input" name="logo" value="${esc(map.logo)}" placeholder="/uploads/logo.png or https://…">`)}
            ${field('Favicon URL', `<input class="input" name="favicon" value="${esc(map.favicon)}" placeholder="/uploads/favicon.ico or https://…">`)}
            ${field('Availability badge text', `<input class="input" name="availability_text" value="${esc(map.availability_text)}">`)}
          </div>
        </div>
        <div class="card mt-24">
          <h3>Contact & Location</h3>
          <div class="grid grid-2">
            ${field('Email', `<input class="input" name="email" value="${esc(map.email)}">`)}
            ${field('Phone (display)', `<input class="input" name="phone" value="${esc(map.phone)}">`)}
            ${field('Phone (link)', `<input class="input" name="phone_href" value="${esc(map.phone_href)}" placeholder="tel:+880…">`)}
            ${field('WhatsApp link', `<input class="input" name="whatsapp" value="${esc(map.whatsapp)}" placeholder="https://wa.me/…">`)}
            ${field('Location', `<input class="input" name="location" value="${esc(map.location)}">`)}
            ${field('Address', `<input class="input" name="address" value="${esc(map.address)}">`)}
          </div>
        </div>
        <div class="card mt-24">
          <h3>Social Media</h3>
          <div class="row">
            ${field('LinkedIn', `<input class="input" name="linkedin" value="${esc(map.linkedin)}">`)}
            ${field('Facebook', `<input class="input" name="facebook" value="${esc(map.facebook)}">`)}
            ${field('Instagram', `<input class="input" name="instagram" value="${esc(map.instagram)}">`)}
          </div>
          <div class="row mt-16">
            ${field('Twitter / X', `<input class="input" name="twitter" value="${esc(map.twitter)}">`)}
            ${field('YouTube', `<input class="input" name="youtube" value="${esc(map.youtube)}">`)}
            ${field('Copyright text', `<input class="input" name="copyright" value="${esc(map.copyright)}">`)}
          </div>
        </div>
        <div class="card mt-24">
          <h3>Footer</h3>
          ${field('Footer about text', `<textarea class="textarea" name="footer_about">${esc(map.footer_about)}</textarea>`)}
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="saveSettings">${ICONS.check} Save Settings</button>
        </div>
      </form>`;

    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = {};
      fd.forEach((v, k) => payload[k] = v);
      await api('/settings', { method: 'PUT', body: payload });
      toast('Settings saved. The public site will reflect these changes.');
    });
  };

  /* ============ VIEW: Navigation ============ */
  views.navigation = async function () {
    setTitle('Navigation Menu', 'Manage the site menu items and their order');
    loading();
    const items = await api('/navigation/full');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Navigation</h2><button class="btn btn-primary" onclick="Cms.navAdd()">${ICONS.plus} Add Menu Item</button></div>
      <div class="card">
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Order</th><th>Label</th><th>URL</th><th>Status</th><th style="width:150px">Actions</th></tr></thead>
          <tbody>
            ${items.map((it, i) => `
              <tr data-id="${it.id}">
                <td>
                  <div class="flex gap-6 items-center">
                    <button class="icon-btn" onclick="Cms.navMove(${it.id},'up')">${ICONS.up}</button>
                    <button class="icon-btn" onclick="Cms.navMove(${it.id},'down')">${ICONS.down}</button>
                    <span class="mono text-muted">${i + 1}</span>
                  </div>
                </td>
                <td><b>${esc(it.label)}</b></td>
                <td class="mono">${esc(it.url)}</td>
                <td><span class="badge ${it.active ? 'badge-green' : 'badge-gray'}">${it.active ? 'Enabled' : 'Disabled'}</span></td>
                <td>
                  <div class="flex gap-6">
                    <button class="icon-btn" title="Edit" onclick="Cms.navEdit(${it.id})">${ICONS.edit}</button>
                    <button class="icon-btn" title="Toggle" onclick="Cms.navToggle(${it.id})">${it.active ? ICONS.eyeOff : ICONS.eye}</button>
                    <button class="icon-btn danger" title="Delete" onclick="Cms.navDelete(${it.id})">${ICONS.trash}</button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table></div>
      </div>`;
  };
  const navForm = (it = {}) => `
    ${field('Label', `<input class="input" id="navLabel" value="${esc(it.label || '')}">`)}
    ${field('URL', `<input class="input" id="navUrl" value="${esc(it.url || '')}" placeholder="/about.html or https://…">`)}
    <div class="row">
      ${field('Position (number)', `<input class="input" type="number" id="navPos" value="${it.position != null ? it.position : (it.__next || 1)}">`)}
      ${field('Parent ID', `<input class="input" type="number" id="navParent" value="${it.parent_id != null ? it.parent_id : ''}" placeholder="0 (top-level)">`)}
    </div>`;
  Cms.navAdd = () => openModal('Add Menu Item', navForm(), footButtons(null, 'navSave', 'Add'));
  Cms.navEdit = async (id) => {
    const items = await api('/navigation/full');
    const it = items.find(x => x.id === id);
    openModal('Edit Menu Item', navForm(it), footButtons(id, 'navSave', 'Save'));
  };
  Cms.navSave = async (id) => {
    const body = {
      label: val('navLabel'), url: val('navUrl'),
      position: Number(val('navPos') || 0),
      parent_id: val('navParent') ? Number(val('navParent')) : null
    };
    if (id) await api('/navigation/' + id, { method: 'PUT', body });
    else await api('/navigation', { method: 'POST', body });
    closeModal(); toast('Navigation saved.'); views.navigation();
  };
  Cms.navToggle = async (id) => {
    const items = await api('/navigation/full');
    const it = items.find(x => x.id === id);
    await api('/navigation/' + id, { method: 'PUT', body: { active: it.active ? 0 : 1 } });
    toast('Menu item updated.'); views.navigation();
  };
  Cms.navDelete = (id) => confirmDialog('Delete this menu item? This cannot be undone.', async () => { await api('/navigation/' + id, { method: 'DELETE' }); toast('Deleted.'); views.navigation(); });
  Cms.navMove = async (id, dir) => {
    let items = await api('/navigation/full');
    items = items.map((it, idx) => ({ ...it, _i: idx }));
    const cur = items.find(x => x.id === id);
    const swapIdx = dir === 'up' ? cur._i - 1 : cur._i + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const other = items[swapIdx];
    await api('/navigation/reorder/apply', { method: 'PUT', body: { items: [
      { id: cur.id, position: other.position }, { id: other.id, position: cur.position }
    ]}});
    views.navigation();
  };

  /* ============ VIEW: Services ============ */
  views.services = async function () {
    setTitle('Services', 'Add, edit, reorder & publish your services');
    loading();
    const data = await api('/services/admin/all');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Services</h2><button class="btn btn-primary" onclick="Cms.svcForm()">${ICONS.plus} Add Service</button></div>
      <div class="grid grid-3">${data.map((s, i) => `
        <div class="card">
          <div class="flex justify-between items-start">
            <div style="min-width:0">
              <h3 style="margin:0">${esc(s.title)}</h3>
              <div class="card__muted mt-8">${esc(s.price_text || '—')}</div>
            </div>
            <span class="badge ${s.active ? 'badge-green' : 'badge-gray'}">${s.active ? 'Active' : 'Hidden'}</span>
          </div>
          <p class="text-sm text-muted mt-8" style="color:var(--muted)">${esc(s.description || '')}</p>
          <div class="flex gap-6 mt-16 items-center">
            <button class="icon-btn" title="Up" onclick="Cms.svcMove(${s.id},'up')">${ICONS.up}</button>
            <button class="icon-btn" title="Down" onclick="Cms.svcMove(${s.id},'down')">${ICONS.down}</button>
            <div style="flex:1"></div>
            <button class="icon-btn" title="Edit" onclick="Cms.svcForm(${s.id})">${ICONS.edit}</button>
            <button class="icon-btn" title="Toggle" onclick="Cms.svcToggle(${s.id})">${s.active ? ICONS.eyeOff : ICONS.eye}</button>
            <button class="icon-btn danger" title="Delete" onclick="Cms.svcDelete(${s.id})">${ICONS.trash}</button>
          </div>
        </div>`).join('')}
      </div>`;
  };
  Cms.svcForm = async (id) => {
    let s = { features: [], active: 1 };
    if (id) { const rows = await api('/services/admin/all'); s = rows.find(x => x.id === id); }
    openModal(id ? 'Edit Service' : 'Add Service', `
      ${field('Title', `<input class="input" id="svcTitle" value="${esc(s.title || '')}">`)}
      ${field('Description', `<textarea class="textarea" id="svcDesc">${esc(s.description || '')}</textarea>`)}
      <div class="row">
        ${field('Price text', `<input class="input" id="svcPrice" value="${esc(s.price_text || '')}" placeholder="Starting from $30">`)}
        ${field('Icon key', `<input class="input" id="svcIcon" value="${esc(s.icon || '')}" placeholder="search / chart / video…">`)}
      </div>
      ${field('Features (one per line)', `<textarea class="textarea" id="svcFeatures">${esc((s.features || []).join('\n'))}</textarea>`)}
      ${field('Active', `<select class="select" id="svcActive"><option value="1" ${s.active ? 'selected' : ''}>Active</option><option value="0" ${!s.active ? 'selected' : ''}>Hidden</option></select>`)}
    `, footButtons(id, 'svcSave', id ? 'Save' : 'Add'));
  };
  Cms.svcSave = async (id) => {
    const body = {
      title: val('svcTitle'), description: val('svcDesc'), price_text: val('svcPrice'),
      icon: val('svcIcon'), features: val('svcFeatures').split('\n').map(x => x.trim()).filter(Boolean),
      active: Number(val('svcActive'))
    };
    if (!body.title) return toast('Title is required.', 'error');
    if (id) await api('/services/' + id, { method: 'PUT', body });
    else await api('/services', { method: 'POST', body });
    closeModal(); toast('Service saved.'); views.services();
  };
  Cms.svcToggle = async (id) => { const rows = await api('/services/admin/all'); const s = rows.find(x => x.id === id); await api('/services/' + id, { method: 'PUT', body: { active: s.active ? 0 : 1 } }); toast('Updated.'); views.services(); };
  Cms.svcDelete = (id) => confirmDialog('Delete this service?', async () => { await api('/services/' + id, { method: 'DELETE' }); toast('Deleted.'); views.services(); });
  Cms.svcMove = async (id, dir) => {
    let list = (await api('/services/admin/all')).map((it, idx) => ({ ...it, _i: idx }));
    const cur = list.find(x => x.id === id); const idx = cur._i + (dir === 'up' ? -1 : 1);
    if (idx < 0 || idx >= list.length) return; const other = list[idx];
    await api('/services/reorder/apply', { method: 'PUT', body: { items: [{ id: cur.id, sort_order: other.sort_order }, { id: other.id, sort_order: cur.sort_order }] } });
    views.services();
  };

  /* ============ VIEW: Projects ============ */
  views.projects = async function () {
    setTitle('Portfolio / Projects', 'Full CRUD for projects & gallery images');
    loading();
    const data = await api('/projects/admin/all');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Projects</h2><button class="btn btn-primary" onclick="Cms.projForm()">${ICONS.plus} Add Project</button></div>
      <div class="card">
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Project</th><th>Category</th><th>Featured</th><th>Status</th><th style="width:190px">Actions</th></tr></thead>
          <tbody>${data.map(p => `
            <tr><td><div class="flex gap-10 items-center">${p.image ? `<img src="${esc(p.image)}" class="thumb">` : ''}<div><b>${esc(p.title)}</b><div class="text-sm text-muted">${esc(p.client || '')}</div></div></div></td>
              <td><span class="badge badge-violet">${esc(p.category_label || p.category)}</span></td>
              <td>${p.featured ? '⭐' : '—'}</td>
              <td><span class="badge ${p.published ? 'badge-green' : 'badge-gray'}">${p.published ? 'Published' : 'Unpublished'}</span></td>
              <td><div class="flex gap-6">
                <button class="icon-btn" title="Edit" onclick="Cms.projForm(${p.id})">${ICONS.edit}</button>
                <button class="icon-btn" title="Publish" onclick="Cms.projToggle(${p.id})">${p.published ? ICONS.eyeOff : ICONS.eye}</button>
                <button class="icon-btn" title="Featured" onclick="Cms.projFeature(${p.id})">${ICONS.star}</button>
                <button class="icon-btn danger" title="Delete" onclick="Cms.projDelete(${p.id})">${ICONS.trash}</button>
              </div></td></tr>`).join('')}</tbody>
        </table></div>
      </div>`;
  };
  Cms.projForm = async (id) => {
    let p = { tools: [], work: [], images: [], published: 1, featured: 0 };
    if (id) p = (await api('/projects/admin/all')).find(x => x.id === id);
    openModal(id ? 'Edit Project' : 'Add Project', `
      ${field('Title', `<input class="input" id="pjTitle" value="${esc(p.title || '')}">`)}
      ${field('Description', `<textarea class="textarea" id="pjDesc">${esc(p.description || '')}</textarea>`)}
      <div class="row">
        ${field('Category', `<select class="select" id="pjCat">${['web','seo','lead','ads','design'].map(c => `<option value="${c}" ${p.category === c ? 'selected' : ''}>${c.toUpperCase()}</option>`).join('')}</select>`)}
        ${field('Client / business type', `<input class="input" id="pjClient" value="${esc(p.client || '')}">`)}
      </div>
      <div class="row">
        ${field('Industry', `<input class="input" id="pjIndustry" value="${esc(p.industry || '')}">`)}
        ${field('Duration', `<input class="input" id="pjDuration" value="${esc(p.duration || '')}">`)}
      </div>
      ${field('Main image URL', `<input class="input" id="pjImage" value="${esc(p.image || '')}" placeholder="/uploads/… or https://…">`)}
      ${field('Project URL', `<input class="input" id="pjUrl" value="${esc(p.url || '')}">`)}
      ${field('Date', `<input class="input" id="pjDate" value="${esc(p.project_date || '')}" placeholder="2026-08-25">`)}
      ${field('Tools / technologies (one per line)', `<textarea class="textarea" id="pjTools">${esc((p.tools || []).join('\n'))}</textarea>`)}
      ${field('Deliverables / work items (one per line)', `<textarea class="textarea" id="pjWork">${esc((p.work || []).join('\n'))}</textarea>`)}
      ${field('Results / outcome', `<textarea class="textarea" id="pjOutcome">${esc(p.results || p.outcome || '')}</textarea>`)}
      <div class="row">
        ${field('Gallery image URLs (one per line)', `<textarea class="textarea" id="pjGallery">${esc((p.images || []).map(i => i.image || i).join('\n'))}</textarea>`)}
        ${field('Featured', `<select class="select" id="pjFeatured"><option value="1" ${p.featured ? 'selected' : ''}>Yes</option><option value="0" ${!p.featured ? 'selected' : ''}>No</option></select>`)}
      </div>
    `, footButtons(id, 'pjSave', id ? 'Save' : 'Add'));
  };
  Cms.projSave = async (id) => {
    const line = (x) => val(x).split('\n').map(s => s.trim()).filter(Boolean);
    const body = {
      title: val('pjTitle'), description: val('pjDesc'), category: val('pjCat'),
      client: val('pjClient'), industry: val('pjIndustry'), duration: val('pjDuration'),
      image: val('pjImage'), url: val('pjUrl'), project_date: val('pjDate'),
      tools: line('pjTools'), work: line('pjWork'), results: val('pjOutcome'),
      images: line('pjGallery').map(u => ({ image: u, caption: '' })),
      featured: Number(val('pjFeatured'))
    };
    if (!body.title) return toast('Title is required.', 'error');
    if (id) await api('/projects/' + id, { method: 'PUT', body });
    else await api('/projects', { method: 'POST', body });
    closeModal(); toast('Project saved.'); views.projects();
  };
  Cms.projToggle = async (id) => { const p = (await api('/projects/admin/all')).find(x => x.id === id); await api('/projects/' + id, { method: 'PUT', body: { published: p.published ? 0 : 1 } }); toast('Updated.'); views.projects(); };
  Cms.projFeature = async (id) => { const p = (await api('/projects/admin/all')).find(x => x.id === id); await api('/projects/' + id, { method: 'PUT', body: { featured: p.featured ? 0 : 1 } }); toast('Updated.'); views.projects(); };
  Cms.projDelete = (id) => confirmDialog('Delete this project? Gallery images are also removed.', async () => { await api('/projects/' + id, { method: 'DELETE' }); toast('Deleted.'); views.projects(); });

  /* ============ VIEW: Testimonials ============ */
  views.testimonials = async function () {
    setTitle('Testimonials', 'Add real, verified client testimonials only');
    loading();
    const data = await api('/testimonials/full');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Testimonials</h2><button class="btn btn-primary" onclick="Cms.tesForm()">${ICONS.plus} Add Testimonial</button></div>
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Client</th><th>Designation / Company</th><th>Rating</th><th>Status</th><th style="width:130px">Actions</th></tr></thead>
        <tbody>${data.map(t => `
          <tr><td><b>${esc(t.client_name)}</b></td><td>${esc(t.designation || '')}${t.company ? ' · ' + esc(t.company) : ''}</td>
            <td>${t.rating ? '★'.repeat(Math.min(5, t.rating)) : '—'}</td>
            <td><span class="badge ${t.published ? 'badge-green' : 'badge-gray'}">${t.published ? 'Published' : 'Pending'}</span></td>
            <td><div class="flex gap-6">
              <button class="icon-btn" title="Edit" onclick="Cms.tesForm(${t.id})">${ICONS.edit}</button>
              <button class="icon-btn" title="Publish" onclick="Cms.tesToggle(${t.id})">${t.published ? ICONS.eyeOff : ICONS.eye}</button>
              <button class="icon-btn danger" title="Delete" onclick="Cms.tesDelete(${t.id})">${ICONS.trash}</button>
            </div></td></tr>`).join('')}</tbody>
      </table></div>
      <p class="text-sm text-muted mt-16">Honesty policy: only add testimonials you have permission to publish. Do not fabricate clients or results.</p></div>`;
  };
  Cms.tesForm = async (id) => {
    let t = { published: 0, rating: 0 };
    if (id) t = (await api('/testimonials/full')).find(x => x.id === id);
    openModal(id ? 'Edit Testimonial' : 'Add Testimonial', `
      ${field('Client name', `<input class="input" id="tName" value="${esc(t.client_name || '')}">`)}
      <div class="row">
        ${field('Designation', `<input class="input" id="tRole" value="${esc(t.designation || '')}">`)}
        ${field('Company', `<input class="input" id="tCompany" value="${esc(t.company || '')}">`)}
      </div>
      ${field('Country', `<input class="input" id="tCountry" value="${esc(t.country || '')}">`)}
      ${field('Testimonial text', `<textarea class="textarea" id="tContent">${esc(t.content || '')}</textarea>`)}
      ${field('Client image URL', `<input class="input" id="tImage" value="${esc(t.image || '')}">`)}
      ${field('Rating (0-5)', `<input class="input" type="number" min="0" max="5" id="tRating" value="${t.rating || 0}">`)}
    `, footButtons(id, 'tSave', id ? 'Save' : 'Add'));
  };
  Cms.tesSave = async (id) => {
    const body = { client_name: val('tName'), designation: val('tRole'), company: val('tCompany'), country: val('tCountry'), content: val('tContent'), image: val('tImage'), rating: Number(val('tRating') || 0), published: 1 };
    if (!body.client_name) return toast('Client name is required.', 'error');
    if (id) await api('/testimonials/' + id, { method: 'PUT', body });
    else await api('/testimonials', { method: 'POST', body });
    closeModal(); toast('Testimonial saved.'); views.testimonials();
  };
  Cms.tesToggle = async (id) => { const t = (await api('/testimonials/full')).find(x => x.id === id); await api('/testimonials/' + id, { method: 'PUT', body: { published: t.published ? 0 : 1 } }); toast('Updated.'); views.testimonials(); };
  Cms.tesDelete = (id) => confirmDialog('Delete this testimonial?', async () => { await api('/testimonials/' + id, { method: 'DELETE' }); toast('Deleted.'); views.testimonials(); });

  /* ============ VIEW: Blog ============ */
  views.blog = async function () {
    setTitle('Blog Posts', 'Create, edit & publish articles');
    loading();
    const data = await api('/blog/admin/all');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Blog</h2><button class="btn btn-primary" onclick="Cms.blogForm()">${ICONS.plus} New Post</button></div>
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Post</th><th>Category</th><th>Date</th><th>Status</th><th style="width:130px">Actions</th></tr></thead>
        <tbody>${data.map(p => `
          <tr><td><div class="flex gap-10 items-center">${p.image ? `<img src="${esc(p.image)}" class="thumb">` : ''}<div><b>${esc(p.title)}</b></div></div></td>
            <td><span class="badge badge-blue">${esc(p.category || '—')}</span></td><td class="text-muted">${esc(p.publish_date || '')}</td>
            <td><span class="badge ${p.published ? 'badge-green' : 'badge-gray'}">${p.published ? 'Published' : 'Draft'}</span></td>
            <td><div class="flex gap-6">
              <button class="icon-btn" title="Edit" onclick="Cms.blogForm(${p.id})">${ICONS.edit}</button>
              <button class="icon-btn" title="Publish" onclick="Cms.blogToggle(${p.id})">${p.published ? ICONS.eyeOff : ICONS.eye}</button>
              <button class="icon-btn danger" title="Delete" onclick="Cms.blogDelete(${p.id})">${ICONS.trash}</button>
            </div></td></tr>`).join('')}</tbody>
      </table></div></div>`;
  };
  Cms.blogForm = async (id) => {
    let p = { tags: [], published: 0, featured: 0 };
    if (id) p = (await api('/blog/admin/detail/' + id));
    openModal(id ? 'Edit Post' : 'New Post', `
      ${field('Title', `<input class="input" id="bTitle" value="${esc(p.title || '')}">`)}
      ${field('Slug', `<input class="input" id="bSlug" value="${esc(p.slug || '')}" placeholder="leave blank to auto-generate">`)}
      ${field('Excerpt / summary', `<textarea class="textarea" id="bExcerpt">${esc(p.excerpt || '')}</textarea>`)}
      <div class="row">
        ${field('Category', `<input class="input" id="bCat" value="${esc(p.category || '')}">`)}
        ${field('Author', `<input class="input" id="bAuthor" value="${esc(p.author || 'Prosengit Kundu')}">`)}
      </div>
      <div class="row">
        ${field('Publish date', `<input class="input" type="date" id="bDate" value="${esc((p.publish_date || '').slice(0,10))}">`)}
        ${field('Read time', `<input class="input" id="bRead" value="${esc(p.read_time || '')}" placeholder="11 min read">`)}
      </div>
      ${field('Featured image URL', `<input class="input" id="bImage" value="${esc(p.image || '')}">`)}
      ${field('Tags (comma separated)', `<input class="input" id="bTags" value="${esc((p.tags || []).join(', '))}">`)}
      ${field('Content', rte('bContent', p.content || ''))}
      <div class="divider"></div>
      <h3 style="margin:6px 0">SEO</h3>
      <div class="row">
        ${field('SEO title', `<input class="input" id="bSeoTitle" value="${esc(p.seo_title || '')}">`)}
        ${field('SEO description', `<input class="input" id="bSeoDesc" value="${esc(p.seo_description || '')}">`)}
      </div>
      <div class="row">
        ${field('Canonical URL', `<input class="input" id="bCanonical" value="${esc(p.canonical_url || '')}">`)}
        ${field('Focus', `<input class="input" id="bPub" type="hidden" value="${p.published ? 1 : 0}">`)}
      </div>
    `, footButtons(id, 'bSave', id ? 'Save' : 'Publish'));
  };
  Cms.blogSave = async (id) => {
    const body = {
      title: val('bTitle'), slug: val('bSlug'), excerpt: val('bExcerpt'),
      category: val('bCat'), author: val('bAuthor'), publish_date: val('bDate'),
      read_time: val('bRead'), image: val('bImage'),
      tags: val('bTags').split(',').map(x => x.trim()).filter(Boolean),
      content: contentFor('bContent'),
      seo_title: val('bSeoTitle'), seo_description: val('bSeoDesc'), canonical_url: val('bCanonical'),
      published: 1
    };
    if (!body.title) return toast('Title is required.', 'error');
    if (id) await api('/blog/' + id, { method: 'PUT', body });
    else await api('/blog', { method: 'POST', body });
    closeModal(); toast('Post saved.'); views.blog();
  };
  Cms.blogToggle = async (id) => { const p = await api('/blog/admin/detail/' + id); await api('/blog/' + id, { method: 'PUT', body: { published: p.published ? 0 : 1 } }); toast('Updated.'); views.blog(); };
  Cms.blogDelete = (id) => confirmDialog('Delete this blog post?', async () => { await api('/blog/' + id, { method: 'DELETE' }); toast('Deleted.'); views.blog(); });

  /* ============ VIEW: Pages ============ */
  views.pages = async function () {
    setTitle('Pages & Sections', 'Edit page headings and reusable content blocks');
    loading();
    const data = await api('/pages/all');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Pages</h2><p>Edit the main heading and content blocks for each page.</p></div>
      ${data.map(p => `
        <div class="card mt-24">
          <div class="flex items-center justify-between"><div><h3 style="margin:0">${esc(p.title)}</h3><div class="card__muted">/ ${esc(p.slug)}</div></div>
          <button class="btn btn-ghost btn-sm" onclick="Cms.pageForm('${esc(p.slug)}')">${ICONS.edit} Edit</button></div>
          <div class="text-sm text-muted mt-8">Heading: <b>${esc(p.heading || '—')}</b></div>
          ${p.sections && p.sections.length ? `<div class="mt-8">${p.sections.map(s => `<div class="text-sm text-muted" style="padding:5px 0"><b>${esc(s.section_key)}</b> — ${esc(s.heading || '')}</div>`).join('')}</div>` : ''}
        </div>`).join('')}`;
  };
  Cms.pageForm = async (slug) => {
    const data = await api('/pages/all');
    const p = data.find(x => x.slug === slug);
    openModal('Edit Page: ' + p.title, `
      ${field('Page title', `<input class="input" id="pgTitle" value="${esc(p.title || '')}">`)}
      ${field('Main heading', `<input class="input" id="pgHeading" value="${esc(p.heading || '')}">`)}
      ${field('Page content (HTML, optional)', `<textarea class="textarea" id="pgContent" style="min-height:120px">${esc(p.content_html || '')}</textarea>`)}
      <input type="hidden" id="pageSlug" value="${esc(slug)}">
      <div class="divider"></div>
      <h3 style="margin:6px 0">Sections / content blocks</h3>
      <div id="pgSections">${(p.sections || []).map((s, i) => `
        <div class="card mt-8" style="padding:14px">
          <div class="flex justify-between items-center"><b>${esc(s.section_key)}</b><button class="icon-btn danger" onclick="this.closest('.sec-block').remove()">${ICONS.trash}</button></div>
          <div class="sec-block">
            <div class="row mt-8">${field('Heading', `<input class="input" data-sec="heading" value="${esc(s.heading || '')}">`)}${field('Subheading', `<input class="input" data-sec="subheading" value="${esc(s.subheading || '')}">`)}</div>
            ${field('Description', `<textarea class="textarea" data-sec="description">${esc(s.description || '')}</textarea>`)}
          </div>
        </div>`).join('')}</div>
      <button class="btn btn-ghost btn-sm mt-8" onclick="Cms.addSection(this)">${ICONS.plus} Add section</button>
    `, footButtons(null, 'pageSave', 'Save'));
  };
  Cms.addSection = (btn) => {
    const wrap = document.getElementById('pgSections');
    const div = document.createElement('div');
    div.className = 'card mt-8 sec-block'; div.style.padding = '14px';
    div.innerHTML = `<div class="flex justify-between items-center"><b>new_section</b><button class="icon-btn danger" onclick="this.closest('.sec-block').remove()">${ICONS.trash}</button></div>
      ${field('Section key', `<input class="input" data-sec="section_key" placeholder="hero / about / cta…">`)}
      <div class="row mt-8">${field('Heading', '<input class="input" data-sec="heading">')}${field('Subheading', '<input class="input" data-sec="subheading">')}</div>
      ${field('Description', '<textarea class="textarea" data-sec="description"></textarea>')}`;
    wrap.appendChild(div);
  };
  Cms.pageSave = async () => {
    const slug = val('pageSlug');
    const sections = [...document.querySelectorAll('#pgSections .sec-block')].map(b => {
      const g = (k) => b.querySelector(`[data-sec="${k}"]`).value;
      return { section_key: g('section_key') || 'section', heading: g('heading'), subheading: g('subheading'), description: g('description'), active: 1 };
    });
    const body = { title: val('pgTitle'), heading: val('pgHeading'), content_html: val('pgContent'), sections };
    await api('/pages/' + slug, { method: 'PUT', body });
    closeModal(); toast('Page saved.'); views.pages();
  };

  /* ============ VIEW: SEO ============ */
  views.seo = async function () {
    setTitle('SEO Settings', 'Meta, Open Graph & canonical data per page');
    loading();
    const data = await api('/seo');
    viewEl.innerHTML = `
      <div class="section-head"><h2>SEO</h2></div>
      <div class="grid grid-3">${data.map(s => `
        <div class="card">
          <h3 style="margin:0;text-transform:capitalize">${esc(s.page_slug)}</h3>
          <div class="text-sm text-muted text-sm mt-8 mb-16">${esc(s.meta_title || '—')}</div>
          <button class="btn btn-ghost btn-sm" onclick="Cms.seoForm('${esc(s.page_slug)}')">${ICONS.edit} Edit SEO</button>
        </div>`).join('')}</div>`;
  };
  Cms.seoForm = async (slug) => {
    const s = await api('/seo/admin/' + slug);
    openModal('SEO — ' + slug, `<input type="hidden" id="seoSlug" value="${esc(slug)}">
      ${field('Meta title', `<input class="input" id="seoTitle" value="${esc(s.meta_title || '')}">`)}
      ${field('Meta description', `<textarea class="textarea" id="seoDesc">${esc(s.meta_description || '')}</textarea>`)}
      <div class="row">
        ${field('Focus keyword', `<input class="input" id="seoKeyword" value="${esc(s.focus_keyword || '')}">`)}
        ${field('Robots', `<input class="input" id="seoRobots" value="${esc(s.robots || 'index, follow')}">`)}
      </div>
      ${field('Canonical URL', `<input class="input" id="seoCanonical" value="${esc(s.canonical_url || '')}" placeholder="/about.html">`)}
      <div class="divider"></div><h3 style="margin:6px 0">Open Graph / Twitter</h3>
      <div class="row">
        ${field('OG title', `<input class="input" id="ogTitle" value="${esc(s.og_title || '')}">`)}
        ${field('Twitter card', `<input class="input" id="twCard" value="${esc(s.twitter_card || 'summary_large_image')}">`)}
      </div>
      ${field('OG description', `<textarea class="textarea" id="ogDesc">${esc(s.og_description || '')}</textarea>`)}
      ${field('OG image URL', `<input class="input" id="ogImage" value="${esc(s.og_image || '')}">`)}
    `, footButtons(null, 'seoSave', 'Save'));
  };
  Cms.seoSave = async () => {
    const slug = val('seoSlug');
    const body = {
      meta_title: val('seoTitle'), meta_description: val('seoDesc'), focus_keyword: val('seoKeyword'),
      robots: val('seoRobots'), canonical_url: val('seoCanonical'),
      og_title: val('ogTitle'), og_description: val('ogDesc'), og_image: val('ogImage'), twitter_card: val('twCard')
    };
    await api('/seo/' + slug, { method: 'PUT', body });
    closeModal(); toast('SEO saved. The frontend will use it automatically.'); views.seo();
  };

  /* ============ VIEW: Media ============ */
  views.media = async function () {
    setTitle('Media Library', 'Upload, select & manage images used across the site');
    loading();
    const data = await api('/media');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Media</h2>
      <label class="btn btn-primary" style="cursor:pointer">${ICONS.plus} Upload<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" style="display:none"><input type="file" id="mediaUpload" multiple accept="image/*" style="display:none"></label>
      </div>
      <div class="card">
        <div class="media-grid">${data.length ? data.map(m => `
          <div class="media-item">
            <img src="${esc(m.url)}" alt="${esc(m.alt_text || '')}">
            <div class="media-item__info"><span title="${esc(m.path)}">${esc(m.filename.slice(0, 14))}…</span>
              <div class="flex gap-6">
                <button class="icon-btn" title="Copy URL" onclick="Cms.copy('${esc(m.url)}')">${ICONS.edit}</button>
                <button class="icon-btn danger" title="Delete" onclick="Cms.mediaDelete(${m.id})">${ICONS.trash}</button>
              </div></div>
          </div>`).join('') : emptyState('No media uploaded yet.', 'image')}</div>
      </div>
      <p class="text-sm text-muted mt-16">Uploaded files are served from <span class="mono">/uploads/…</span>. Copy the URL into a service/project/blog image field.</p>`;
    document.getElementById('mediaUpload').addEventListener('change', async (e) => {
      const files = [...e.target.files];
      if (!files.length) return;
      toast('Uploading…', 'info');
      for (const f of files) {
        const fd = new FormData(); fd.append('file', f);
        try { await api('/media/upload', { method: 'POST', body: fd }); }
        catch (err) { toast(err.message, 'error'); }
      }
      toast('Upload complete.'); views.media();
    });
  };
  Cms.copy = (url) => { navigator.clipboard.writeText(url).then(() => toast('URL copied')); };
  Cms.mediaDelete = (id) => confirmDialog('Delete this media file?', async () => { await api('/media/' + id, { method: 'DELETE' }); toast('Deleted.'); views.media(); });

  /* ============ VIEW: Messages ============ */
  views.messages = async function () {
    setTitle('Contact Messages', 'Messages submitted via the website contact form');
    loading();
    const data = await api('/contact');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Messages</h2></div>
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Name</th><th>Contact</th><th>Service</th><th>Message</th><th>Received</th><th>Status</th><th style="width:150px">Actions</th></tr></thead>
        <tbody>${data.length ? data.map(m => `
          <tr><td><b>${esc(m.name)}</b></td>
            <td class="text-sm">${esc(m.email)}${m.phone ? '<br>' + esc(m.phone) : ''}</td>
            <td class="text-sm">${esc(m.service || '—')}</td>
            <td class="text-sm" style="max-width:220px;color:var(--muted)">${esc((m.message || '').slice(0, 80))}</td>
            <td class="text-sm text-muted">${esc((m.created_at || '').slice(0, 16))}</td>
            <td>${statusBadge(m.status)}</td>
            <td><div class="flex gap-6">
              <select class="select" style="padding:4px 8px;font-size:12px" onchange="Cms.msgStatus(${m.id}, this.value)">
                ${['new','read','replied','archived'].map(s => `<option value="${s}" ${m.status === s ? 'selected' : ''}>${s[0].toUpperCase()+s.slice(1)}</option>`).join('')}
              </select>
              <button class="icon-btn danger" title="Delete" onclick="Cms.msgDelete(${m.id})">${ICONS.trash}</button>
            </div></td></tr>`).join('') : `<tr><td colspan="7">${emptyState('No messages yet.', 'mail')}</td></tr>`}</tbody>
      </table></div></div>`;
    updateMessagePill();
  };
  Cms.msgStatus = async (id, status) => { await api('/contact/' + id + '/status', { method: 'PUT', body: { status } }); toast('Status updated.'); updateMessagePill(); };
  Cms.msgDelete = (id) => confirmDialog('Delete this message?', async () => { await api('/contact/' + id, { method: 'DELETE' }); toast('Deleted.'); views.messages(); });

  /* ============ VIEW: Backup ============ */
  views.backup = async function () {
    setTitle('Backup', 'Download a snapshot of your database');
    loading();
    const st = await api('/backup/status');
    viewEl.innerHTML = `
      <div class="section-head"><h2>Backup & Safety</h2></div>
      <div class="grid grid-3">
        <div class="card"><h3>Database size</h3><div class="stat__num mt-8">${st.size_kb} KB</div><div class="card__muted">${st.tables} tables</div></div>
        <div class="card"><h3>Export snapshot</h3><p class="text-sm text-muted">Download a complete SQL dump of all content (settings, services, projects, blog, testimonials, media, messages, SEO).</p>
          <a class="btn btn-green mt-8" href="/api/backup/export" download>${ICONS.down} Download backup</a></div>
        <div class="card"><h3>Content safety</h3><ul class="text-sm text-muted" style="padding-left:18px">
          <li>Delete actions require confirmation.</li><li>Services & nav can be reordered.</li><li>Publish/unpublish any item.</li><li>SEO changes are applied automatically.</li></ul></div>
      </div>`;
  };

  /* ------------------------------ helpers ------------------------------ */
  function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function footButtons(id, fn, label) {
    modalBody.dataset.id = id != null ? id : '';
    return `<button class="btn btn-ghost" onclick="Cms.closeModal()">Cancel</button><button class="btn btn-primary" onclick="Cms['${fn}'](${id != null ? id : ''})">${ICONS.check} ${label}</button>`;
  }

  function rte(id, value) {
    return `<div class="rte-toolbar">
      <button type="button" data-cmd="bold">B</button><button type="button" data-cmd="italic">I</button>
      <button type="button" data-cmd="underline">U</button><button type="button" data-cmd="formatBlock" data-val="h2">H2</button>
      <button type="button" data-cmd="formatBlock" data-val="h3">H3</button>
      <button type="button" data-cmd="formatBlock" data-val="p">P</button>
      <button type="button" data-cmd="insertUnorderedList">• List</button>
      <button type="button" data-cmd="insertOrderedList">1. List</button>
      <button type="button" data-cmd="createLink">Link</button>
      <button type="button" data-cmd="formatBlock" data-val="blockquote">Quote</button>
    </div><div class="rte-area" id="${id}" contenteditable="true">${value || ''}</div>`;
  }
  function contentFor(id) { const el = document.getElementById(id); return el ? el.innerHTML : ''; }
  function bindRte() {
    if (!window._rteBound) {
      window._rteBound = true;
      modalBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.rte-toolbar button');
        if (!btn) return;
        const cmd = btn.dataset.cmd; const val = btn.dataset.val;
        document.execCommand(cmd, false, val || null);
        const area = btn.closest('.rte-toolbar').nextElementSibling; if (area) area.focus();
      });
    }
  }

  async function updateMessagePill() {
    try { const c = await api('/contact/counts'); const pill = document.getElementById('messagePill'); if (c.new > 0) { pill.textContent = c.new; pill.style.display = 'inline-block'; } else pill.style.display = 'none'; } catch (e) {}
  }

  /* ------------------------------ Router ------------------------------ */
  const meta = {
    dashboard: ['Dashboard', 'Overview of your website'],
    settings: ['Site Settings', 'Global website name, contact details & branding'],
    navigation: ['Navigation Menu', 'Manage the site menu'],
    services: ['Services', 'Add, edit, reorder & publish your services'],
    projects: ['Portfolio / Projects', 'Full CRUD for projects'],
    testimonials: ['Testimonials', 'Real, verified client testimonials'],
    blog: ['Blog Posts', 'Create, edit & publish articles'],
    pages: ['Pages & Sections', 'Edit page headings and content blocks'],
    seo: ['SEO Settings', 'Meta, Open Graph & canonical data per page'],
    media: ['Media Library', 'Upload, select & manage images'],
    messages: ['Contact Messages', 'Messages from the contact form'],
    backup: ['Backup', 'Download a snapshot of your database']
  };

  async function goto(view) {
    // mark active nav
    document.querySelectorAll('.sidebar__item').forEach(b => b.classList.toggle('is-active', b.dataset.view === view));
    const [t, s] = meta[view] || [view, ''];
    setTitle(t, s);
    // ensure all views that need it are bound
    bindRte();
    try { await views[view](); }
    catch (err) { viewEl.innerHTML = `<div class="card"><div class="empty">${ICONS.eye}<div>${esc(err.message)}</div></div></div>`; }
  }

  /* ------------------------------ Boot ------------------------------ */
  async function boot() {
    try {
      const me = await api('/auth/me');
      document.getElementById('whoName').textContent = me.name || me.username;
      document.getElementById('whoAvatar').textContent = (me.name || me.username || 'A').charAt(0).toUpperCase();
      // bind nav
      document.querySelectorAll('.sidebar__item').forEach(b => b.addEventListener('click', () => goto(b.dataset.view)));
      document.getElementById('logoutBtn').addEventListener('click', async () => { await api('/auth/logout', { method: 'POST' }); window.location.href = '/admin/login'; });
      await goto('dashboard');
    } catch (e) { window.location.href = '/admin/login'; }
  }
  boot();

  return { goto, closeModal, navAdd, navEdit, navSave, navToggle, navDelete, navMove, svcForm, svcSave, svcToggle, svcDelete, svcMove, projForm, projSave, projToggle, projFeature, projDelete, tesForm, tesSave, tesToggle, tesDelete, blogForm, blogSave, blogToggle, blogDelete, pageForm, pageSave, addSection, seoForm, seoSave, copy, mediaDelete, msgStatus, msgDelete };
})();
