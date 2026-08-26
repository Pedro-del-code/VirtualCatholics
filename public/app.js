const state = {
  category: 'todas',
  query: '',
  categories: []
};

const el = {
  tabs: document.getElementById('categoryTabs'),
  grid: document.getElementById('resultsGrid'),
  count: document.getElementById('resultsCount'),
  empty: document.getElementById('emptyState'),
  searchForm: document.getElementById('searchForm'),
  searchInput: document.getElementById('searchInput'),
  detailModal: document.getElementById('detailModal'),
  modalContent: document.getElementById('modalContent'),
  adminToggle: document.getElementById('adminToggle'),
  adminModal: document.getElementById('adminModal'),
  adminForm: document.getElementById('adminForm'),
  fCategory: document.getElementById('f_category'),
  adminFormMsg: document.getElementById('adminFormMsg')
};

async function init() {
  await loadCategories();
  await loadEntries();
  bindEvents();
}

async function loadCategories() {
  const res = await fetch('/api/categories');
  const categories = await res.json();
  state.categories = categories;

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.slug = cat.slug;
    btn.style.setProperty('--tab-color', cat.color);
    btn.textContent = cat.name;
    el.tabs.appendChild(btn);
  });

  // Popular select do formulário admin
  el.fCategory.innerHTML = categories
    .map((c) => `<option value="${c.slug}">${c.name}</option>`)
    .join('');
}

async function loadEntries() {
  el.count.textContent = 'Carregando registros…';
  const params = new URLSearchParams();
  if (state.category !== 'todas') params.set('category', state.category);
  if (state.query) params.set('q', state.query);

  const res = await fetch(`/api/entries?${params.toString()}`);
  const entries = await res.json();
  renderEntries(entries);
}

function renderEntries(entries) {
  el.grid.innerHTML = '';
  if (!entries.length) {
    el.empty.hidden = false;
    el.count.textContent = '0 registros encontrados';
    return;
  }
  el.empty.hidden = true;
  el.count.textContent = `${entries.length} registro${entries.length > 1 ? 's' : ''} encontrado${entries.length > 1 ? 's' : ''}`;

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.setProperty('--card-color', entry.category_color);
    card.innerHTML = `
      <span class="cat-label">${escapeHtml(entry.category_name)}</span>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.summary || '')}</p>
      <div class="meta">${[entry.location, entry.event_date].filter(Boolean).map(escapeHtml).join(' · ')}</div>
    `;
    card.addEventListener('click', () => openDetail(entry.id));
    el.grid.appendChild(card);
  });
}

async function openDetail(id) {
  const res = await fetch(`/api/entries/${id}`);
  if (!res.ok) return;
  const entry = await res.json();

  el.modalContent.innerHTML = `
    <span class="detail-cat" style="color:${entry.category_color}">${escapeHtml(entry.category_name)}</span>
    <h2 class="detail-title">${escapeHtml(entry.title)}</h2>
    <div class="detail-meta">
      ${entry.location ? `<span>📍 ${escapeHtml(entry.location)}</span>` : ''}
      ${entry.event_date ? `<span>🗓️ ${escapeHtml(entry.event_date)}</span>` : ''}
    </div>
    ${entry.image_url ? `<img src="${escapeHtml(entry.image_url)}" alt="" style="width:100%;border-radius:8px;margin-bottom:14px;">` : ''}
    <div class="detail-content">${escapeHtml(entry.content || entry.summary || '')}</div>
    ${entry.source_url ? `<div class="detail-source">Fonte: <a href="${escapeHtml(entry.source_url)}" target="_blank" rel="noopener">${escapeHtml(entry.source_url)}</a></div>` : ''}
  `;
  el.detailModal.hidden = false;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function bindEvents() {
  el.tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    state.category = btn.dataset.slug;
    loadEntries();
  });

  el.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.query = el.searchInput.value.trim();
    loadEntries();
  });

  document.querySelectorAll('[data-close]').forEach((elm) =>
    elm.addEventListener('click', () => (el.detailModal.hidden = true))
  );
  document.querySelectorAll('[data-close-admin]').forEach((elm) =>
    elm.addEventListener('click', () => (el.adminModal.hidden = true))
  );

  el.adminToggle.addEventListener('click', () => {
    el.adminModal.hidden = false;
  });

  el.adminForm.addEventListener('submit', submitNewEntry);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      el.detailModal.hidden = true;
      el.adminModal.hidden = true;
    }
  });
}

async function submitNewEntry(e) {
  e.preventDefault();
  el.adminFormMsg.textContent = 'Salvando…';
  el.adminFormMsg.className = 'form-msg';

  const payload = {
    category_slug: el.fCategory.value,
    title: document.getElementById('f_title').value,
    summary: document.getElementById('f_summary').value,
    content: document.getElementById('f_content').value,
    location: document.getElementById('f_location').value,
    event_date: document.getElementById('f_date').value,
    image_url: document.getElementById('f_image').value,
    source_url: document.getElementById('f_source').value
  };
  const adminKey = document.getElementById('f_adminkey').value;

  try {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao salvar.');

    el.adminFormMsg.textContent = 'Registro salvo com sucesso!';
    el.adminFormMsg.className = 'form-msg success';
    el.adminForm.reset();
    await loadEntries();
    setTimeout(() => (el.adminModal.hidden = true), 1200);
  } catch (err) {
    el.adminFormMsg.textContent = err.message;
    el.adminFormMsg.className = 'form-msg error';
  }
}

init();
