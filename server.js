const express = require('express');
const compression = require('compression');
const { getJobData, getJobSchema, TOTAL_JOBS, jobTitles, companies, deLocations, industries } = require('./jobData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.static(__dirname));
app.use(express.static('public'));

// ─── GET BASE URL ──────────────────────────────────────────────────────────
function getBaseUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${protocol}://${host}`;
}

// ─── AD CONFIGURATION ──────────────────────────────────────────────────────────
const AD_SCRIPT = `
<script>
  atOptions = {
    'key' : '52f2121fe372a34db4a66c66482eec90',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/52f2121fe372a34db4a66c66482eec90/invoke.js"></script>
`;

const AD_TOP = `
<div style="text-align:center; width:100%; padding:10px 0; background:#fff; border-bottom:1px solid #eee;">
  ${AD_SCRIPT}
</div>
`;

const AD_MIDDLE = `
<div style="text-align:center; width:100%; padding:10px 0; background:#fff; margin:20px 0; border:1px solid #eee; border-radius:8px;">
  ${AD_SCRIPT}
</div>
`;

const AD_BOTTOM = `
<div style="text-align:center; width:100%; padding:10px 0; background:#fff; border-top:1px solid #eee; margin-top:20px;">
  ${AD_SCRIPT}
</div>
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const JOBS_PER_PAGE = 20;

function renderHTML({ title, meta, bodyContent, schema }) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="google-site-verification" content="caV8L_sobLIVDDbS_WFYoT7SftALcyf5h0wkWyxKkmY" />
<meta name="google-site-verification" content="XrH9c03tsqCVBwOX4DzHrmE5fqKcvaidkRTE3cD1A2g" />
<title>${title}</title>
<meta name="description" content="${meta}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${meta}"/>
<meta name="robots" content="index, follow"/>
${schema ? `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>` : ''}
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#222;line-height:1.6}
a{color:inherit;text-decoration:none}
/* NAV */
nav{background:#DD0000;color:#fff;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:60px;position:sticky;top:0;z-index:100}
nav .brand{font-size:1.25rem;font-weight:700;color:#fff}
nav .brand span{color:#FFD700}
nav .nav-links{display:flex;gap:1.5rem;font-size:0.85rem}
nav .nav-links a{color:rgba(255,255,255,0.8);transition:color .2s}
nav .nav-links a:hover{color:#FFD700}
/* HERO */
.hero{background:linear-gradient(135deg,#DD0000 0%,#b30000 50%,#8a0000 100%);color:#fff;padding:3rem 1.5rem;text-align:center}
.hero h1{font-size:clamp(1.6rem,4vw,2.8rem);font-weight:800;margin-bottom:.75rem}
.hero h1 .accent{color:#FFD700}
.hero p{font-size:1rem;opacity:.85;margin-bottom:1.5rem;max-width:600px;margin-left:auto;margin-right:auto}
.stat-bar{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-top:1.5rem}
.stat{text-align:center}.stat strong{display:block;font-size:1.5rem;color:#FFD700}
.stat span{font-size:.8rem;opacity:.75}
/* SEARCH */
.search-bar{background:#fff;padding:1.25rem 1.5rem;border-bottom:1px solid #e0e0e0;display:flex;gap:.75rem;flex-wrap:wrap;max-width:960px;margin:0 auto}
.search-bar input,.search-bar select{flex:1;min-width:160px;padding:.6rem .9rem;border:1.5px solid #d0d0d0;border-radius:8px;font-size:.9rem;outline:none}
.search-bar input:focus,.search-bar select:focus{border-color:#DD0000}
.search-bar button{padding:.6rem 1.4rem;background:#FFD700;color:#1a1a2e;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:.9rem}
/* FILTERS */
.filter-row{background:#fff;border-bottom:1px solid #ebebeb;padding:.6rem 1.5rem;display:flex;gap:.5rem;flex-wrap:wrap;max-width:960px;margin:0 auto}
.filter-chip{padding:.35rem .85rem;border:1.5px solid #d0d0d0;border-radius:20px;font-size:.78rem;cursor:pointer;background:#fff;transition:all .2s;white-space:nowrap}
.filter-chip.active,.filter-chip:hover{background:#DD0000;color:#fff;border-color:#DD0000}
/* LAYOUT */
.container{max-width:960px;margin:0 auto;padding:1.5rem}
.page-grid{display:grid;grid-template-columns:1fr;gap:1rem}
/* JOB CARD */
.job-card{background:#fff;border-radius:12px;padding:1.25rem 1.5rem;border:1.5px solid #e8e8e8;transition:border-color .2s,transform .15s;display:flex;flex-direction:column;gap:.75rem}
.job-card:hover{border-color:#DD0000;transform:translateY(-2px)}
.card-header{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap}
.card-title{font-size:1.05rem;font-weight:700;color:#1a1a2e;margin-bottom:.2rem}
.card-company{font-size:.88rem;color:#555}
.card-badges{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
.badge{padding:.28rem .7rem;border-radius:20px;font-size:.73rem;font-weight:600;white-space:nowrap}
.badge-remote{background:#e8f5e9;color:#2e7d32}
.badge-office{background:#e3f2fd;color:#1565c0}
.badge-type{background:#f3e5f5;color:#6a1b9a}
.badge-exp{background:#fff3e0;color:#e65100}
.card-meta{display:flex;gap:1rem;flex-wrap:wrap;font-size:.82rem;color:#666}
.card-meta span{display:flex;align-items:center;gap:.3rem}
.card-desc{font-size:.85rem;color:#555;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}
.card-salary{font-weight:700;color:#1a1a2e;font-size:.9rem}
.btn-apply{padding:.55rem 1.3rem;background:#DD0000;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:.85rem;cursor:pointer;transition:background .2s}
.btn-apply:hover{background:#b30000}
/* JOB DETAIL */
.job-detail{background:#fff;border-radius:12px;padding:2rem;border:1.5px solid #e8e8e8}
.job-detail h1{font-size:1.6rem;font-weight:800;color:#1a1a2e;margin-bottom:.5rem}
.detail-meta{display:flex;gap:.75rem;flex-wrap:wrap;margin:1rem 0;padding:1rem 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}
.detail-chip{padding:.4rem 1rem;border-radius:8px;font-size:.82rem;font-weight:600;background:#f5f5f5;color:#333}
.detail-chip.highlight{background:#fff8e1;color:#f57f17}
.detail-body{font-size:.9rem;color:#444;line-height:1.8;white-space:pre-line;margin:1.5rem 0}
.apply-section{background:#f9f9f9;border-radius:12px;padding:1.5rem;text-align:center;border:1.5px dashed #e0e0e0}
.apply-section h3{margin-bottom:.5rem;color:#1a1a2e}
.apply-section p{font-size:.85rem;color:#666;margin-bottom:1rem}
.btn-apply-big{padding:.85rem 2.5rem;background:#DD0000;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;transition:background .2s}
.btn-apply-big:hover{background:#b30000}
/* PAGINATION */
.pagination{display:flex;justify-content:center;gap:.4rem;margin:2rem 0;flex-wrap:wrap}
.pagination a,.pagination span{padding:.5rem .9rem;border-radius:8px;border:1.5px solid #e0e0e0;font-size:.85rem;background:#fff}
.pagination a:hover{border-color:#DD0000;color:#DD0000}
.pagination .current{background:#DD0000;color:#fff;border-color:#DD0000}
/* BREADCRUMB */
.breadcrumb{font-size:.82rem;color:#888;margin-bottom:1rem}
.breadcrumb a{color:#DD0000}
/* SITEMAP NOTE */
.info-box{background:#fff;border-radius:12px;padding:1.25rem 1.5rem;border-left:4px solid #DD0000;margin-bottom:1rem;font-size:.88rem}
/* FOOTER */
footer{background:#1a1a2e;color:rgba(255,255,255,0.7);text-align:center;padding:1.5rem;font-size:.82rem;margin-top:3rem}
footer a{color:#FFD700}
/* MODAL */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:999;align-items:center;justify-content:center}
.modal-overlay.open{display:flex}
.modal{background:#fff;border-radius:16px;padding:2rem;max-width:480px;width:90%;position:relative}
.modal h2{font-size:1.2rem;font-weight:700;margin-bottom:1rem;color:#1a1a2e}
.modal input{width:100%;padding:.7rem;border:1.5px solid #ddd;border-radius:8px;font-size:.9rem;margin-bottom:.85rem;outline:none}
.modal input:focus{border-color:#DD0000}
.modal .btn-submit{width:100%;padding:.75rem;background:#DD0000;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.95rem}
.modal .btn-submit:hover{background:#b30000}
.modal .close-btn{position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#888}
.success-msg{display:none;text-align:center;padding:1rem;color:#2e7d32;font-weight:600}
@media(max-width:600px){.search-bar{flex-direction:column}.stat-bar{gap:1rem}}
</style>

</head>
<body>
${AD_TOP}
<nav>
  <a class="brand" href="/"><span>DE</span>Jobs<span>.de</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/jobs">Browse Jobs</a>
    <a href="/jobs?type=remote">Remote</a>
    <a href="/sitemap">Sitemap</a>
  </div>
</nav>
<!-- Center Ad Start -->
<div style="display:flex; justify-content:center; margin:20px 0;">
    <div>
<script>
  atOptions = {
    'key' : 'ca3349d75612b6053048b6ed52e67010',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/ca3349d75612b6053048b6ed52e67010/invoke.js"></script>
</div>
</div>
${bodyContent}
${AD_BOTTOM}
<footer>
  &copy; 2025 DEJobs.de — <strong>100,000 Jobs</strong> across Germany |
  <a href="/jobs">Browse All</a> · <a href="/jobs?type=remote">Remote Jobs</a> · <a href="/sitemap">Sitemap</a>
</footer>
<script>
function openApply(title){
  window.location.href='https://dejobs-production.up.railway.app/apply-now.html';
}
</script>
</body>
</html>`;
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const featuredIds = [1, 50001, 2, 50002, 3, 50003, 10000, 60000];
  const featuredJobs = featuredIds.map(id => getJobData(id));

  const cards = featuredJobs.map(job => `
<a href="/jobs/${job.id}" style="display:block">
<div class="job-card">
  <div class="card-header">
    <div>
      <div class="card-title">${job.title}</div>
      <div class="card-company">${job.company}</div>
    </div>
    <div class="card-badges">
      <span class="badge ${job.isRemote ? 'badge-remote' : 'badge-office'}">${job.isRemote ? '🌐 Remote' : '🏢 On-site'}</span>
      <span class="badge badge-type">${job.jobType}</span>
    </div>
  </div>
  <div class="card-meta">
    <span>📍 ${job.location}</span>
    <span>🏭 ${job.industry}</span>
    <span>📅 ${job.postedDate}</span>
  </div>
  <div class="card-desc">${job.description.substring(0, 180)}...</div>
  <div class="card-footer">
    <span class="card-salary">${job.salary}</span>
    <button class="btn-apply" onclick="event.preventDefault();openApply('${job.title.replace(/'/g, "\\'")} at ${job.company.replace(/'/g, "\\'")}')">Apply Now</button>
  </div>
</div>
</a>`).join('');

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DEJobs.de",
    "url": baseUrl,
    "description": "Germany's largest job portal with 100,000 job listings — remote and on-site across all 16 states",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/jobs?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const body = `
<div class="hero">
  <h1>Finde deinen Traumjob in <span class="accent">Deutschland</span></h1>
  <p>100,000 verifizierte Stellenangebote — remote & vor Ort — in allen 16 Bundesländern</p>
  <form action="/jobs" method="get" style="display:flex;gap:.75rem;max-width:580px;margin:0 auto;flex-wrap:wrap">
    <input name="q" type="text" placeholder="Jobtitel, Fähigkeit oder Unternehmen..." style="flex:2;min-width:200px;padding:.7rem 1rem;border-radius:8px;border:none;font-size:.95rem"/>
    <select name="location" style="flex:1;min-width:140px;padding:.7rem;border-radius:8px;border:none;font-size:.85rem">
      <option value="">Alle Bundesländer</option>
      <option value="remote">Nur Remote</option>
      <option value="berlin">Berlin</option>
      <option value="bayern">Bayern</option>
      <option value="nrw">Nordrhein-Westfalen</option>
    </select>
    <button type="submit" style="padding:.7rem 1.5rem;background:#FFD700;color:#1a1a2e;border:none;border-radius:8px;font-weight:700;cursor:pointer">Suchen →</button>
  </form>
  <div class="stat-bar">
    <div class="stat"><strong>100,000</strong><span>Jobs insgesamt</span></div>
    <div class="stat"><strong>50,000</strong><span>Remote Jobs</span></div>
    <div class="stat"><strong>50,000</strong><span>Vor Ort Jobs</span></div>
    <div class="stat"><strong>16</strong><span>Bundesländer</span></div>
    <div class="stat"><strong>100+</strong><span>Unternehmen</span></div>
  </div>
</div>

<div class="container">
  <div class="info-box">
    🇩🇪 Deutschlands umfassendste Jobbörse — entdecke <strong>50,000 Remote-Jobs</strong> und <strong>50,000 Vor-Ort-Jobs</strong> in allen Branchen.
  </div>
   ${AD_MIDDLE}
  <h2 style="margin-bottom:1rem;font-size:1.2rem">Empfohlene Jobs</h2>
  <div class="page-grid">${cards}</div>
  <div style="text-align:center;margin-top:2rem">
    <a href="/jobs" style="display:inline-block;padding:.85rem 2.5rem;background:#1a1a2e;color:#fff;border-radius:10px;font-weight:700">Alle 100,000 Jobs durchsuchen →</a>
  </div>
</div>`;

  res.send(renderHTML({
    title: 'DEJobs.de — 100,000 Jobs in Deutschland | Remote & Vor Ort',
    meta: 'Finde deinen nächsten Job in Deutschland. 100,000 verifizierte Stellenangebote — 50,000 remote und 50,000 vor Ort in allen 16 Bundesländern.',
    bodyContent: body,
    schema: websiteSchema
  }));
});

// ── JOB LISTING PAGE ──────────────────────────────────────────────────────────
app.get('/jobs', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const typeFilter = req.query.type || 'all';
  const locationFilter = req.query.location || '';
  const q = req.query.q || '';

  let jobIds = [];
  if (typeFilter === 'remote') {
    const start = (page - 1) * JOBS_PER_PAGE + 1;
    for (let i = start; i < start + JOBS_PER_PAGE && i <= 50000; i++) jobIds.push(i);
  } else if (typeFilter === 'onsite') {
    const start = 50000 + (page - 1) * JOBS_PER_PAGE + 1;
    for (let i = start; i < start + JOBS_PER_PAGE && i <= TOTAL_JOBS; i++) jobIds.push(i);
  } else {
    const start = (page - 1) * JOBS_PER_PAGE + 1;
    for (let i = start; i < start + JOBS_PER_PAGE && i <= TOTAL_JOBS; i++) jobIds.push(i);
  }

  const jobs = jobIds.map(id => getJobData(id));
  const totalPages = Math.ceil(TOTAL_JOBS / JOBS_PER_PAGE);

  const cards = jobs.map(job => `
<a href="/jobs/${job.id}" style="display:block">
<div class="job-card">
  <div class="card-header">
    <div>
      <div class="card-title">${job.title}</div>
      <div class="card-company">${job.company}</div>
    </div>
    <div class="card-badges">
      <span class="badge ${job.isRemote ? 'badge-remote' : 'badge-office'}">${job.isRemote ? '🌐 Remote' : '🏢 Vor Ort'}</span>
      <span class="badge badge-type">${job.jobType}</span>
      <span class="badge badge-exp">${job.experience}</span>
    </div>
  </div>
  <div class="card-meta">
    <span>📍 ${job.location}</span>
    <span>🏭 ${job.industry}</span>
    <span>📅 ${job.postedDate}</span>
  </div>
  <div class="card-desc">${job.description.substring(0, 200)}...</div>
  <div class="card-footer">
    <span class="card-salary">${job.salary}</span>
    <button class="btn-apply" onclick="event.preventDefault();openApply('${job.title.replace(/'/g, "\\'")} at ${job.company.replace(/'/g, "\\'")}')">Apply Now</button>
  </div>
</div>
</a>`).join('');

  const pages = [];
  if (page > 1) pages.push(`<a href="/jobs?page=${page - 1}&type=${typeFilter}">← Prev</a>`);
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  if (start > 1) pages.push(`<a href="/jobs?page=1&type=${typeFilter}">1</a><span>…</span>`);
  for (let p = start; p <= end; p++) {
    pages.push(p === page
      ? `<span class="current">${p}</span>`
      : `<a href="/jobs?page=${p}&type=${typeFilter}">${p}</a>`);
  }
  if (end < totalPages) pages.push(`<span>…</span><a href="/jobs?page=${totalPages}&type=${typeFilter}">${totalPages.toLocaleString()}</a>`);
  if (page < totalPages) pages.push(`<a href="/jobs?page=${page + 1}&type=${typeFilter}">Next →</a>`);

  const body = `
<div class="hero" style="padding:1.75rem 1.5rem">
  <h1 style="font-size:1.8rem">Durchsuche <span class="accent">100,000 Jobs</span> in Deutschland</h1>
  <p>Seite ${page.toLocaleString()} von ${totalPages.toLocaleString()}</p>
</div>
<div class="filter-row">
  <a href="/jobs"><span class="filter-chip ${typeFilter==='all'?'active':''}">Alle Jobs (100,000)</span></a>
  <a href="/jobs?type=remote"><span class="filter-chip ${typeFilter==='remote'?'active':''}">🌐 Remote (50,000)</span></a>
  <a href="/jobs?type=onsite"><span class="filter-chip ${typeFilter==='onsite'?'active':''}">🏢 Vor Ort (50,000)</span></a>
</div>
<div class="container">
  <div class="page-grid">${cards}</div>
  <div class="pagination">${pages.join('')}</div>
</div>`;

  res.send(renderHTML({
    title: `Deutschland Jobs — Seite ${page} von ${totalPages.toLocaleString()} | DEJobs.de`,
    meta: `Durchsuche ${TOTAL_JOBS.toLocaleString()} Jobs in Deutschland. Seite ${page}. Remote und Vor-Ort-Stellen in allen Branchen.`,
    bodyContent: body,
    schema: null
  }));
});

// ── INDIVIDUAL JOB PAGE ───────────────────────────────────────────────────────
app.get('/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || id < 1 || id > TOTAL_JOBS) {
    return res.status(404).send(renderHTML({
      title: 'Job Not Found | DEJobs.de',
      meta: 'Diese Stellenanzeige wurde nicht gefunden.',
      bodyContent: `<div class="container" style="text-align:center;padding:4rem 1.5rem"><h1>404 — Job nicht gefunden</h1><p style="margin:1rem 0 2rem">Diese Stelle wurde möglicherweise bereits besetzt oder entfernt.</p><a href="/jobs" style="color:#DD0000">← Alle Jobs durchsuchen</a></div>`,
      schema: null
    }));
  }

  const job = getJobData(id);
  const schema = getJobSchema(job);

  const relatedIds = [
    Math.max(1, id - 2), Math.max(1, id - 1),
    Math.min(TOTAL_JOBS, id + 1), Math.min(TOTAL_JOBS, id + 2)
  ].filter(rid => rid !== id);
  const relatedJobs = relatedIds.slice(0, 3).map(rid => getJobData(rid));

  const relatedCards = relatedJobs.map(rj => `
<a href="/jobs/${rj.id}" style="display:block">
<div class="job-card" style="padding:1rem">
  <div class="card-title" style="font-size:.95rem">${rj.title}</div>
  <div class="card-company">${rj.company}</div>
  <div style="margin-top:.5rem;display:flex;gap:.5rem;flex-wrap:wrap">
    <span class="badge ${rj.isRemote ? 'badge-remote' : 'badge-office'}" style="font-size:.7rem">${rj.isRemote ? '🌐 Remote' : '🏢 Vor Ort'}</span>
    <span class="badge badge-type" style="font-size:.7rem">${rj.jobType}</span>
  </div>
</div>
</a>`).join('');

  const body = `
<div class="container">
  <div class="breadcrumb">
    <a href="/">Home</a> › <a href="/jobs">Jobs</a> › <a href="/jobs?type=${job.isRemote ? 'remote' : 'onsite'}">${job.isRemote ? 'Remote' : 'Vor Ort'}</a> › ${job.title}
  </div>
  <div class="job-detail">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
      <div>
        <h1>${job.title}</h1>
        <p style="font-size:1.05rem;color:#555;margin-top:.35rem">${job.company} · ${job.industry}</p>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem">
        <span class="badge ${job.isRemote ? 'badge-remote' : 'badge-office'}" style="font-size:.85rem;padding:.4rem 1rem">${job.isRemote ? '🌐 Remote' : '🏢 Vor Ort'}</span>
        <span style="font-size:.8rem;color:#888">Job ID: DE-${String(job.id).padStart(6, '0')}</span>
      </div>
    </div>
    <div class="detail-meta">
      <span class="detail-chip highlight">💰 ${job.salary}</span>
      <span class="detail-chip">📍 ${job.location}</span>
      <span class="detail-chip">💼 ${job.jobType}</span>
      <span class="detail-chip">📊 ${job.experience}</span>
      <span class="detail-chip">🏭 ${job.industry}</span>
      <span class="detail-chip">📅 Veröffentlicht: ${job.postedDate}</span>
    </div>
    <div class="detail-body">${job.description}</div>
    <div class="apply-section">
      <h3>Bereit zu bewerben?</h3>
      <p>Reiche deine Bewerbung ein für <strong>${job.title}</strong> bei <strong>${job.company}</strong> — dauert weniger als 2 Minuten</p>
      <button class="btn-apply-big" onclick="openApply('${job.title.replace(/'/g, "\\'")} at ${job.company.replace(/'/g, "\\'")}')">
        Jetzt bewerben →
      </button>
    </div>
  </div>

  <div style="margin-top:2rem">
    <h2 style="font-size:1.1rem;margin-bottom:1rem">Ähnliche Jobs, die dir gefallen könnten</h2>
    <div class="page-grid">${relatedCards}</div>
  </div>
  <div style="text-align:center;margin-top:1.5rem">
    <a href="/jobs" style="color:#DD0000;font-weight:600">← Alle 100,000 Jobs durchsuchen</a>
  </div>
</div>`;

  res.send(renderHTML({
    title: `${job.title} bei ${job.company} — ${job.location} | DEJobs.de`,
    meta: `${job.title} Stelle bei ${job.company}. ${job.isRemote ? 'Remote' : job.location}. ${job.salary}. Jetzt bewerben auf DEJobs.de.`,
    bodyContent: body,
    schema
  }));
});

// ─── SITEMAP INDEX ─────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const totalSitemaps = 100;
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (let i = 1; i <= totalSitemaps; i++) {
    xml += `\n<sitemap><loc>${baseUrl}/sitemap-${i}.xml</loc></sitemap>`;
  }
  xml += `\n</sitemapindex>`;
  res.type('application/xml').send(xml);
});

app.get('/sitemap-:num.xml', (req, res) => {
  const num = parseInt(req.params.num);
  const baseUrl = getBaseUrl(req);
  if (!num || num < 1 || num > 100) return res.status(404).send('Not found');
  const start = (num - 1) * 1000 + 1;
  const end = Math.min(num * 1000, TOTAL_JOBS);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (let i = start; i <= end; i++) {
    xml += `\n<url><loc>${baseUrl}/jobs/${i}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
  }
  xml += `\n</urlset>`;
  res.type('application/xml').send(xml);
});

// ─── SITEMAP HTML PAGE ─────────────────────────────────────────────────────────
app.get('/sitemap', (req, res) => {
  const body = `
<div class="container">
  <h1 style="margin-bottom:1rem">Sitemap — DEJobs.de</h1>
  <div class="info-box">📌 100,000 individuelle Jobseiten + XML-Sitemaps für alle Suchmaschinen</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-top:1rem">
    <div class="job-card">
      <div class="card-title">Hauptseiten</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.75rem;font-size:.88rem">
        <a href="/" style="color:#DD0000">🏠 Home</a>
        <a href="/jobs" style="color:#DD0000">📋 Alle Jobs (100,000)</a>
        <a href="/jobs?type=remote" style="color:#DD0000">🌐 Remote Jobs (50,000)</a>
        <a href="/jobs?type=onsite" style="color:#DD0000">🏢 Vor Ort Jobs (50,000)</a>
      </div>
    </div>
    <div class="job-card">
      <div class="card-title">XML-Sitemaps</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.75rem;font-size:.88rem">
        <a href="/sitemap.xml" style="color:#DD0000">📄 Sitemap Index</a>
        <a href="/sitemap-1.xml" style="color:#DD0000">📄 Sitemap 1 (Jobs 1–1,000)</a>
        <a href="/sitemap-2.xml" style="color:#DD0000">📄 Sitemap 2 (Jobs 1,001–2,000)</a>
        <span style="color:#888">… 100 Sitemap-Dateien insgesamt</span>
      </div>
    </div>
    <div class="job-card">
      <div class="card-title">Jobseiten Bereiche</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.75rem;font-size:.88rem">
        <a href="/jobs/1" style="color:#DD0000">Job #1 (Erster Remote Job)</a>
        <a href="/jobs/50000" style="color:#DD0000">Job #50,000 (Letzter Remote Job)</a>
        <a href="/jobs/50001" style="color:#DD0000">Job #50,001 (Erster Vor Ort Job)</a>
        <a href="/jobs/100000" style="color:#DD0000">Job #100,000 (Letzter Vor Ort Job)</a>
      </div>
    </div>
  </div>
</div>`;

  res.send(renderHTML({
    title: 'Sitemap | DEJobs.de',
    meta: 'Vollständige Sitemap von DEJobs.de mit 100,000 Stellenangeboten in ganz Deutschland.',
    bodyContent: body,
    schema: null
  }));
});

// ─── ROBOTS.TXT ────────────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.type('text/plain').send(`User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
Disallow: /api/`);
});

// ─── API ─────────────────────────────────────────────────────────────────────
app.get('/api/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || id < 1 || id > TOTAL_JOBS) return res.status(404).json({ error: 'Job not found' });
  const job = getJobData(id);
  res.json({ job, schema: getJobSchema(job) });
});

app.get('/api/jobs', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const start = (page - 1) * limit + 1;
  const jobs = [];
  for (let i = start; i < start + limit && i <= TOTAL_JOBS; i++) {
    jobs.push(getJobData(i));
  }
  res.json({ page, limit, total: TOTAL_JOBS, jobs });
});

// ─── HEALTHCHECK ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`🇩🇪 DEJobs.de running on port ${PORT}`);
  console.log(`📋 ${TOTAL_JOBS.toLocaleString()} job pages ready`);
  console.log(`🏢 ${companies.length} companies hiring in Germany`);
  console.log(`📍 ${deLocations.length} locations across Germany`);
});
