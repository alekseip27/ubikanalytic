'use strict';

const API_BASE     = 'https://ubik.wiki/api';
const CARD_BASE    = 'https://shibuy.co:8443';
const QUEUE_PATH   = '/buy-queue';
const NY_TZ        = 'America/New_York';
const POLL_MS      = 8000;
const TOKEN_LENGTH = 40;
const EMAIL_RE     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formats accepted for `added_timestamp` / `#purchaserequest` (read as New York time).
const timestampFormats = () => [
  'MM/DD/YYYY, h:mm A', 'MM/DD/YYYY, h:mm:ss A', 'MM/DD/YYYY HH:mm:ss', 'MM/DD/YYYY, HH:mm', moment.ISO_8601,
];
// Formats accepted for event dates stored in purchases_tracking.
const dateFormats = () => [
  moment.ISO_8601, 'YYYY-MM-DD', 'MM/DD/YYYY', 'M/D/YYYY', 'MMM D, YYYY', 'MMMM D, YYYY', 'ddd, MMM D, YYYY',
];

/**
 * Ticketing sources. First match wins, so order matters
 * (e.g. ticketmaster.com.mx must come before ticketmaster.com).
 * `code` is the key used in purchases_tracking; `instructionsId` is the
 * source-instructions row to show.
 */
const SOURCES = [
  { match: 'showclix',            code: 'SHOW',       instructionsId: '45' },
  { match: 'thecomplexslc',       code: 'SHOW',       instructionsId: '45' },
  { match: 'ticketmaster.co.uk',  code: 'TM-UK',      instructionsId: '30' },
  { match: 'ticketmaster.ca',     code: 'TM',         instructionsId: '51' },
  { match: 'ticketmaster.de',     code: 'TM-DE',      instructionsId: '30' },
  { match: 'ticketmaster.com.mx', code: 'TM-MX',      instructionsId: '50' },
  { match: 'ticketmaster.com',    code: 'TM',         instructionsId: '9'  },
  { match: 'livenation.ca',       code: 'TM',         instructionsId: '51' },
  { match: 'livenation.com',      code: 'TM',         instructionsId: '9'  },
  { match: 'livenation',          code: 'TM',         instructionsId: '30' },
  { match: '24tix',               code: '24TIX',      instructionsId: '47' },
  { match: 'admitone',            code: 'ADMIT1',     instructionsId: '48' },
  { match: 'axs',                 code: 'AXS',        instructionsId: '2'  },
  { match: 'dice',                code: 'DICE',       instructionsId: '8'  },
  { match: 'etix',                code: 'ETIX',       instructionsId: '16' },
  { match: 'eventbrite',          code: 'EBRITE',     instructionsId: '11' },
  { match: 'freshtix',            code: 'FRESH',      instructionsId: '10' },
  { match: 'frontgate',           code: 'FGATE',      instructionsId: '49' },
  { match: 'holdmyticket',        code: 'HOLDMT',     instructionsId: '5'  },
  { match: 'prekindle',           code: 'PRE',        instructionsId: '19' },
  { match: 'seetickets',          code: 'SEETIX',     instructionsId: '18' },
  { match: 'eventim',             code: 'SEETIX',     instructionsId: '30' },
  { match: 'ticketweb',           code: 'TWEB',       instructionsId: '14' },
  { match: 'ticketswest',         code: 'TWEST',      instructionsId: '13' },
  { match: 'tixr',                code: 'TIXR',       instructionsId: '23' },
  { match: 'stubwire',            code: 'STUBW',      instructionsId: '15' },
  { match: 'fgtix',               code: 'FGATE',      instructionsId: '49' },
  { match: 'evenue',              code: 'EVENUE',     instructionsId: '6'  },
  { match: 'gruenehall',          code: 'gruenehall', instructionsId: '7'  },
  { match: 'meowwolf',            code: 'MEOW',       instructionsId: '21' },
  { match: 'thevogue.com',        code: 'thevogue',   instructionsId: '25' },
];
const DEFAULT_SOURCE = { match: '', code: 'OTHER', instructionsId: '30' };

/** Sources that use the stricter "TM-only" purchasing-account filter. */
const TM_FAMILY = ['ticketmaster.com', 'ticketmaster.ca', 'livenation.com', 'livenation.ca', 'axs.com', 'dice.fm'];

const STATE_MAP = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', QC: 'Quebec', ON: 'Ontario',
};

/** Elements whose text is copied to the clipboard when clicked. */
const COPY_ON_CLICK_IDS = [
  'presalecode', 'firstname', 'lastname', 'fullname', 'zip', 'city', 'street', 'birthdate',
  'gender', 'phonenumber', 'dnum3', 'ipaddress', 'proxy', 'url', 'primobrowser', 'primobrowser2',
];

/* ================================================================== */
/*  Page state                                                         */
/*  (top-level `let` so other page scripts can still read these by name) */
/* ================================================================== */

let thiseventid        = '';   // primary event id (site_event_id)
let encodedthiseventid = '';
let credit_account     = '';   // 'ramp' | 'slash' | …
let signalidentifier   = '';
let purchaser          = '';
let evurl              = '';
let vdidurl            = '';
let category           = '';
let emails             = '';   // CSV of used emails (kept for compatibility)

let usedEmails = new Set();
let accounts   = [];           // purchasing accounts loaded for this event
let pageLoaded = false;
let buying     = false;
let buyJob     = null;         // in-progress purchase record (survives a failed step for retry)
let buyButtonLabel = null;
let accountsRequestSeq = 0;
let pollers = [];
let countdownTimer = null;
let proxyChangeBusy = false;
let suppressIssuerHandler = false;
const inflightRequests = new Set();

const queueId = new URLSearchParams(window.location.search).get('id') || '';

/* ================================================================== */
/*  Small helpers                                                      */
/* ================================================================== */

const $id = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pad2 = (n) => String(n).padStart(2, '0');

function getText(id)  { return ($id(id)?.textContent || '').trim(); }
function getValue(id) { return ($id(id)?.value || '').trim(); }
function setText(id, value)  { const el = $id(id); if (el) el.textContent = value == null ? '' : String(value); }
function setValue(id, value) { const el = $id(id); if (el) el.value = value == null ? '' : String(value); }
function show(id, display = 'flex') { const el = $id(id); if (el) el.style.display = display; }
function hide(id) { const el = $id(id); if (el) el.style.display = 'none'; }
function on(id, event, handler) { const el = $id(id); if (el) el.addEventListener(event, handler); return el; }

function addDefaultOption(select, text) {
  const option = document.createElement('option');
  option.value = '';
  option.textContent = text;
  select.appendChild(option);
}

/** DRF list responses may be a bare array or `{results: [...]}`. */
function resultList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return null;
}
function firstResult(data) { return (resultList(data) || [])[0]; }

class HttpError extends Error {
  constructor(status, url, bodyText) {
    super(`HTTP ${status} for ${url}${bodyText ? `: ${bodyText.slice(0, 200)}` : ''}`);
    this.name = 'HttpError';
    this.status = status;
  }
}
/** An error whose message should be shown to the operator. */
class UserError extends Error {
  constructor(message) { super(message); this.name = 'UserError'; }
}

/* ================================================================== */
/*  Network                                                            */
/* ================================================================== */

function isTokenReady() {
  return typeof token === 'string' && token.length === TOKEN_LENGTH;
}

async function waitFor(predicate, { timeoutMs = 15000, pollMs = 200, label = 'condition' } = {}) {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) throw new Error(`Timed out waiting for ${label}`);
    await sleep(pollMs);
  }
}

/** Resolves once the auth token is present and the queue item has been rendered. */
function waitForReady() {
  return waitFor(() => isTokenReady() && pageLoaded, { label: 'token / queue item' });
}

/** Aborts every request started with `tracked: true` (per-selection lookups). */
function abortAllRequests() {
  for (const controller of inflightRequests) controller.abort();
  inflightRequests.clear();
}

/**
 * fetch() wrapper: JSON in/out, bearer auth, per-attempt timeout, retries
 * (network errors, timeouts, 5xx/408/429), optional cancellation via
 * abortAllRequests(). Throws HttpError on non-2xx.
 */
async function apiFetch(url, {
  method = 'GET',
  body,
  auth = true,
  tracked = false,
  timeoutMs = 15000,
  attempts = 1,
  retryDelayMs = 1000,
  parse = 'json',          // 'json' | 'auto' | 'none'
} = {}) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
    if (tracked) inflightRequests.add(controller);

    try {
      const headers = { 'Content-Type': 'application/json; charset=utf-8' };
      if (auth) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new HttpError(response.status, url, await response.text().catch(() => ''));
      }
      if (parse === 'none') return null;

      const text = await response.text();
      if (parse === 'json') return text ? JSON.parse(text) : null;
      try { return JSON.parse(text); } catch { return text; }
    } catch (err) {
      // Cancelled on purpose (selection changed) → stop immediately, no retry.
      if (err.name === 'AbortError' && !timedOut) throw err;

      lastError = timedOut ? new Error(`Timed out after ${timeoutMs} ms: ${url}`) : err;

      // Client errors won't get better by retrying.
      if (err instanceof HttpError && err.status >= 400 && err.status < 500
          && err.status !== 408 && err.status !== 429) {
        throw err;
      }
      if (attempt < attempts) {
        console.warn(`${method} ${url} failed (attempt ${attempt}/${attempts}): ${lastError.message}`);
        await sleep(retryDelayMs);
      }
    } finally {
      clearTimeout(timer);
      inflightRequests.delete(controller);
    }
  }
  throw lastError;
}

/* ================================================================== */
/*  Clipboard                                                          */
/* ================================================================== */

async function copyText(text) {
  const str = text == null ? '' : String(text);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(str);
      return true;
    }
  } catch (_) { /* fall through to legacy path */ }

  const ta = document.createElement('textarea');
  ta.value = str;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
  document.body.removeChild(ta);
  return ok;
}

/* ================================================================== */
/*  Sources / states                                                   */
/* ================================================================== */

function findSource(eventUrl) {
  const url = String(eventUrl || '').toLowerCase();
  return SOURCES.find((s) => url.includes(s.match)) || DEFAULT_SOURCE;
}
function getsource(eventUrl)   { return findSource(eventUrl).code; }
function getsourceid(eventUrl) { return findSource(eventUrl).instructionsId; }
function isTmFamily(eventUrl) {
  const url = String(eventUrl || '').toLowerCase();
  return TM_FAMILY.some((d) => url.includes(d));
}

/** Purchasing-accounts list URL; filter depends on the event's ticketing source. */
function accountsListUrl() {
  const base = `${API_BASE}/purchasing-accounts/`;
  return isTmFamily(getText('url'))
    ? `${base}?closed__iexact=false&paused__iexact=false&tm_restricted__iexact=false&baps__iexact=false&kyc__iexact=false&gmail_block__iexact=false&tm_only__iexact=true`
    : `${base}?gmail_block__iexact=false&tm_only__iexact=false`;
}

/** "NY" → "New York", "New York" → "NY", unknown → "". Case-insensitive. */
function toggleStateName(input) {
  const s = String(input || '').trim();
  if (!s) return '';
  const upper = s.toUpperCase();
  if (STATE_MAP[upper]) return STATE_MAP[upper];
  return Object.keys(STATE_MAP).find((abbr) => STATE_MAP[abbr].toUpperCase() === upper) || '';
}

/* ================================================================== */
/*  Dates                                                              */
/* ================================================================== */

function todayNY() { return moment.tz(NY_TZ).startOf('day'); }

function parseNYTimestamp(value) {
  return moment.tz(String(value || '').trim(), timestampFormats(), NY_TZ);
}

function isOnOrAfterToday(value) {
  if (value === null || value === undefined || value === '') return false;
  const str = String(value).trim();
  const parsed = moment.tz(str, dateFormats(), true, NY_TZ);
  if (parsed.isValid()) return parsed.isSameOrAfter(todayNY(), 'day');
  return str >= todayNY().format('YYYY-MM-DD'); // legacy fallback: plain string compare
}

function formatHMS(ms) {
  const sign = ms < 0 ? '-' : '';
  const d = moment.duration(Math.abs(ms));
  return `${sign}${Math.floor(d.asHours())}:${pad2(d.minutes())}:${pad2(d.seconds())}`;
}

function urgencyToMinutes(urgency) {
  const m = /^(\d+)\s*(min|mins|minute|minutes|hr|hrs|hour|hours|day|days)$/i.exec(String(urgency || '').trim());
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit.startsWith('min')) return n;
  if (unit.startsWith('h')) return n * 60;
  return n * 1440;
}

function randomId(prefix, length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(length);
  if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  let out = prefix;
  for (const b of bytes) out += chars[b % chars.length];
  return out;
}

/* ================================================================== */
/*  Buy-button enable/disable (replaces the two `input` listeners)      */
/* ================================================================== */

function updateBuyButtons() {
  const ready1 = !!getValue('purchasequantity') && !!getValue('purchaseconfirmation');
  show('buyfake', ready1 ? 'none' : 'flex');
  show('buybtn',  ready1 ? 'flex' : 'none');

  const ready2 = !!getValue('failedemail') && !!getValue('failedmsg') && !!getValue('browserused');
  show('buyfake2', ready2 ? 'none' : 'flex');
  show('buybtn2',  ready2 ? 'flex' : 'none');
}

function setBuyButton(text, disabled) {
  const btn = $id('buybtn');
  if (!btn) return;
  if (buyButtonLabel === null) buyButtonLabel = btn.textContent;
  btn.textContent = text;
  btn.style.pointerEvents = disabled ? 'none' : 'auto';
}

/* ================================================================== */
/*  Used emails                                                        */
/* ================================================================== */

function setUsedEmails(csv) {
  usedEmails = new Set(String(csv || '').split(',').map((s) => s.trim()).filter(Boolean));
  emails = [...usedEmails].join(',');
}

/** Removes used emails from the dropdown; clears the panel if the current one was taken. */
function pruneUsedEmailOptions() {
  const select = $id('buyer_email');
  if (!select) return;
  const current = select.value;
  let removedCurrent = false;

  for (const option of [...select.options]) {
    if (option.index === 0 || !option.value || !usedEmails.has(option.value)) continue;
    console.log(`Removed used email: ${option.value}`);
    if (option.value === current) removedCurrent = true;
    select.remove(option.index);
  }

  if (removedCurrent) {
    console.warn(`${current} was just used on this event by someone else — clearing selection.`);
    abortAllRequests();
    erasedata();
  }
}

/* ================================================================== */
/*  Purchasing accounts → state / email dropdowns                      */
/* ================================================================== */

function clearEmailsUIOnly() {
  const select = $id('buyer_email');
  if (!select) return;
  select.innerHTML = '';
  addDefaultOption(select, 'Select one...');
}

/** Renders the state dropdown; returns the state key actually selected ('' if none). */
function renderStateOptions(items, preferred) {
  const select = $id('buyer_state');
  if (!select) return '';

  const counts = {};
  for (const item of items) {
    if (!item || !item.state) continue;
    const key = String(item.state);
    counts[key] = (counts[key] || 0) + 1;
  }

  // Accept either spelling of the venue state (abbreviation or full name), case-insensitively.
  const candidates = (Array.isArray(preferred) ? preferred : [preferred]).filter(Boolean);
  let chosen = '';
  for (const candidate of candidates) {
    const wanted = String(candidate).trim().toUpperCase();
    const key = Object.keys(counts).find((k) => k.toUpperCase() === wanted);
    if (key) { chosen = key; break; }
  }

  const keys = Object.keys(counts).sort();
  if (chosen) { keys.splice(keys.indexOf(chosen), 1); keys.unshift(chosen); }

  select.innerHTML = '';
  addDefaultOption(select, 'Select one...');
  for (const key of keys) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = `${key} (${counts[key]})`;
    select.appendChild(option);
  }
  select.value = chosen;
  return chosen;
}

function countUpcomingPurchases(account, sourceCode) {
  const tracking = Array.isArray(account.purchases_tracking) ? account.purchases_tracking : [];
  let count = 0;
  for (const entry of tracking) {
    const bySource = entry && entry[sourceCode];
    if (!bySource || typeof bySource !== 'object') continue;
    for (const date of Object.values(bySource)) if (isOnOrAfterToday(date)) count++;
  }
  return count;
}

/** Fills the email dropdown for a state; keeps `prevEmail` selected if still available. */
function populateEmails(stateKey, prevEmail = '') {
  const select = $id('buyer_email');
  if (!select) return [];

  const cachedPrev = (prevEmail || select.value || '').trim();
  const sourceCode = getsource(getText('url'));

  const options = accounts
    .filter((a) => a && a.state === stateKey && a.email)
    .map((a) => ({ email: String(a.email).trim(), count: countUpcomingPurchases(a, sourceCode) }))
    .filter((o) => !usedEmails.has(o.email) || o.email === cachedPrev)
    .sort((a, b) => a.count - b.count);

  select.innerHTML = '';
  addDefaultOption(select, 'Select one...');
  for (const o of options) {
    const option = document.createElement('option');
    option.value = o.email;
    option.textContent = o.count > 0 ? `${o.email} (${o.count})` : o.email;
    select.appendChild(option);
  }

  const rendered = options.map((o) => o.email);
  if (cachedPrev && rendered.includes(cachedPrev)) select.value = cachedPrev;
  return rendered;
}

/** Follows DRF `next` links so more than 1000 accounts are not silently dropped. */
async function fetchAllAccounts() {
  let url = `${accountsListUrl()}&limit=1000`;
  const all = [];
  for (let page = 0; url && page < 10; page++) {
    const data = await apiFetch(url);
    const items = resultList(data);
    if (!items) throw new Error("Expected an array in 'data' or 'data.results'.");
    all.push(...items);
    url = Array.isArray(data) ? null : data.next;
  }
  return all;
}

/**
 * Loads purchasing accounts and (re)builds the state + email dropdowns.
 * `preferredState` may be a string or an array of candidate spellings.
 * Only the most recent call is allowed to touch the UI (fixes the startup race).
 */
async function loadAccounts(preferredState, provider, prevBuyerEmail = '') {
  const seq = ++accountsRequestSeq;
  try {
    await waitForReady();
    refreshCardBalance(provider);

    const items = await fetchAllAccounts();
    if (seq !== accountsRequestSeq) return; // superseded by a newer call

    accounts = items;
    const chosen = renderStateOptions(items, preferredState);
    if (chosen) populateEmails(chosen, prevBuyerEmail);
    else clearEmailsUIOnly();

    // The previously selected email is no longer offered → don't leave its data on screen.
    if (prevBuyerEmail && getValue('buyer_email') !== prevBuyerEmail) {
      abortAllRequests();
      erasedata();
    }
  } catch (err) {
    console.error('Error loading purchasing accounts:', err);
  }
}

/* ================================================================== */
/*  Selected-account panel                                              */
/* ================================================================== */

function erasedata() {
  for (const id of ['fullname', 'firstname', 'lastname', 'phonenumber', 'birthdate', 'gender',
    'street', 'city', 'state', 'zip', 'dnum3', 'dnum4', 'dnum5', 'proxy', 'ipaddress', 'primobrowser']) {
    setText(id, '');
  }
  $id('proxy')?.setAttribute('data-id', '');      // the proxy id lives here (was clearing #ipaddress)
  $id('ipaddress')?.setAttribute('data-id', '');

  for (const id of ['unlock', 'unlock2']) {
    const el = $id(id);
    if (!el) continue;
    el.setAttribute('retrieve', '');
    el.style.pointerEvents = 'none';
    el.style.display = 'none';
  }
  setText('unlock2', '');

  setValue('purchaseaccounts', '');
  setValue('failedemail', '');
  updateBuyButtons();
}

function revealUnlock(id, retrieveValue, label) {
  const el = $id(id);
  if (!el) return;
  el.setAttribute('retrieve', retrieveValue);
  if (label !== undefined) el.textContent = label;
  el.classList.remove('none');
  el.style.pointerEvents = 'auto';
  el.style.display = 'flex';
}

function browserProfileLabel(email, eventUrl) {
  const url = String(eventUrl || '').toLowerCase();
  let suffix = '';
  if (url.includes('ticketmaster.com'))     suffix = 'TM US';
  else if (url.includes('ticketmaster.ca')) suffix = 'TM CA';
  else if (url.includes('livenation.com'))  suffix = 'LN';
  else if (url.includes('axs.com'))         suffix = 'AXS';
  return suffix ? `${email} - ${suffix}` : email;
}

/** Mirrors the chosen email into the hidden form fields + clipboard (was `setvalue`). */
function applySelectedEmail(email) {
  setValue('purchaseaccounts', email);
  setValue('failedemail', email);
  copyText(email);
  setText('primobrowser', browserProfileLabel(email, getText('url')));
  updateBuyButtons();
}

async function displayBuyerData(email) {
  try {
    await waitForReady();
    const data = await apiFetch(
      `${accountsListUrl()}&email__iexact=${encodeURIComponent(email)}`,
      { tracked: true },
    );
    if (getValue('buyer_email') !== email) return; // selection changed while loading

    const a = firstResult(data);
    if (!a) throw new Error(`No account information found for ${email}.`);

    setText('fullname', [a.first_name, a.last_name].filter(Boolean).join(' '));
    setText('firstname',   a.first_name);
    setText('lastname',    a.last_name);
    setText('phonenumber', a.phone_number);
    setText('birthdate',   a.birthdate);
    setText('gender',      a.gender);
    setText('street',      a.address);
    setText('city',        a.city);
    setText('state',       a.state);
    setText('zip',         a.zip);
  } catch (err) {
    if (err.name !== 'AbortError') console.error('Error displaying buyer data:', err);
  }
}

/* ---- Card details (shibuy.co) ---- */

async function loadCardDetails(email, provider) {
  if (!EMAIL_RE.test(email)) {
    console.error(`Invalid email format: "${email}"`);
    return;
  }
  try {
    const data = await apiFetch(`${CARD_BASE}/retrievedata`, {
      method: 'POST',
      body: { id: email, provider },
      tracked: true,
      attempts: 5,
      retryDelayMs: 1000,
      timeoutMs: 10000,
    });
    if (getValue('buyer_email') !== email) return;

    const cd = data && data.data;
    if (!cd) throw new Error('retrievedata response has no "data" field');

    const isSlash  = provider === 'slash';
    const cardRef  = String((isSlash ? cd.s1 : cd.n1) || 'N/A');
    const cardInfo = String((isSlash ? cd.s2 : cd.n2) || 'N/A');

    setText('dnum3', cardInfo);
    setText('dnum4', isSlash ? 'Slash' : 'Ramp');
    setText('dnum5', 'Visa');
    revealUnlock('unlock', email);
    revealUnlock('unlock2', cardRef, cardRef.slice(-4));
  } catch (err) {
    if (err.name !== 'AbortError') console.error('Error loading card details:', err);
  }
}

async function copyZipForCard(id, provider) {
  if (!id) return;
  try {
    const data = await apiFetch(`${CARD_BASE}/retrievezip`, {
      method: 'POST',
      body: { id, provider },
      tracked: true,
      attempts: 5,
      retryDelayMs: 2000,
      parse: 'auto',
    });
    await copyText(typeof data === 'object' ? JSON.stringify(data) : data);
    document.querySelector('.hdnclick')?.click();
  } catch (err) {
    if (err.name !== 'AbortError') console.error('Error retrieving zip:', err);
  }
}

function refreshCardBalance(provider) {
  const path = provider === 'slash' ? '/sba' : '/rba';
  // NOTE: these endpoints were called without an Authorization header in the original; kept as-is.
  apiFetch(`${CARD_BASE}${path}`, { method: 'POST', auth: false, parse: 'auto' })
    .then((balance) => setText('dnum6', `$${typeof balance === 'object' ? JSON.stringify(balance) : balance}`))
    .catch((err) => console.error('Error loading card balance:', err));
}

/* ---- Proxies ---- */

async function loadProxyForEmail(email) {
  try {
    const data = await apiFetch(
      `${API_BASE}/proxy-manager/?email__iexact=${encodeURIComponent(email)}`,
      { tracked: true },
    );
    if (getValue('buyer_email') !== email) return null;

    const row = firstResult(data);
    if (!row) { console.warn(`No proxy assigned to ${email}.`); return null; }

    setText('proxy', row.name);
    $id('proxy')?.setAttribute('data-id', row.id ?? '');
    setText('ipaddress', row.ip);
    return row;
  } catch (err) {
    if (err.name !== 'AbortError') console.error('Error fetching proxy:', err);
    return null;
  }
}

async function assignNextFreeProxy() {
  const email = getValue('buyer_email');
  if (!email) { alert('Please select a buyer email first.'); return; }
  if (proxyChangeBusy) return;

  proxyChangeBusy = true;
  const btn = $id('proxychange');
  if (btn) btn.style.pointerEvents = 'none';

  try {
    const data = await apiFetch(`${API_BASE}/proxy-manager/?email__isblank=true&active__idoesnotcontains=no`);
    const next = firstResult(data);
    if (!next) {
      console.warn('No unassigned proxies found.');
      alert('No unassigned proxies available.');
      return;
    }

    const proxyEl = $id('proxy');
    const oldId = proxyEl?.getAttribute('data-id') || '';
    if (oldId) {
      try {
        await apiFetch(`${API_BASE}/update/proxy-manager/`, {
          method: 'PUT', body: { id: oldId, email: '', active: 'no' },
        });
      } catch (err) {
        console.error('Failed to unassign old proxy:', err);
      }
    }

    await apiFetch(`${API_BASE}/update/proxy-manager/`, {
      method: 'PUT', body: { id: next.id, active: 'yes', email },
    });

    setText('proxy', next.name || '[No Name]');
    proxyEl?.setAttribute('data-id', next.id ?? '');
    setText('ipaddress', next.ip || '[No IP]');
    console.log('Proxy assigned:', next.name, next.ip, '→', email);
  } catch (err) {
    console.error('Error assigning proxy:', err);
  } finally {
    proxyChangeBusy = false;
    if (btn) btn.style.pointerEvents = 'auto';
  }
}

/* ================================================================== */
/*  Queue item / event data                                            */
/* ================================================================== */

function fetchQueueItem()    { return apiFetch(`${API_BASE}/buying-queue/${encodeURIComponent(queueId)}/`); }
function fetchPrimaryEvent() { return apiFetch(`${API_BASE}/primary-events/${encodedthiseventid}/`); }

async function fetchEventVenue() {
  const data = await apiFetch(`${API_BASE}/event-venue/?site_event_id__iexact=${encodedthiseventid}`);
  if (!data || data.count !== 1) {
    console.warn(`event-venue lookup returned ${data ? data.count : 'no'} rows for ${thiseventid}`);
    return null;
  }
  return data.results[0];
}

function applyQueueAmounts(q) {
  if (q.credit_account) credit_account = q.credit_account;
  setText('amountbought1', Number(q.purchased_amount) > 0 ? q.purchased_amount : '0');
  if (q.purchase_total !== undefined && q.purchase_total !== null) setText('amountbought2', q.purchase_total);
}

function applyQueueItem(q) {
  thiseventid        = q.event_id == null ? '' : String(q.event_id);
  encodedthiseventid = encodeURIComponent(thiseventid);
  credit_account     = q.credit_account || '';
  signalidentifier   = q.signal_identifier || '';
  category           = q.category || '';
  purchaser          = q.added_by || '';
  if (purchaser.includes('Jan')) purchaser = 'JJ';
  if (purchaser.includes('Jayvee')) purchaser = 'Jibs';

  // Issuer dropdown: make sure the event's card provider exists, then select it.
  const issuerEl = $id('issuer');
  if (issuerEl) {
    if (credit_account && ![...issuerEl.options].some((o) => o.value === credit_account)) {
      const option = document.createElement('option');
      option.value = credit_account;
      option.textContent = credit_account.charAt(0).toUpperCase() + credit_account.slice(1);
      issuerEl.appendChild(option);
    }
    issuerEl.value = credit_account || '';
    // Let any other listeners know, but don't run our own handler (loadEventVenue loads accounts).
    suppressIssuerHandler = true;
    issuerEl.dispatchEvent(new Event('change'));
    suppressIssuerHandler = false;
  }

  setValue('evids',   queueId);
  setValue('queueid', queueId);
  setValue('seid',    encodedthiseventid);

  setText('date',        q.event_date);
  setText('event',       q.event_name);
  setText('venue',       q.event_venue);
  setText('time',        q.event_time);
  setText('url',         q.event_url);
  setText('quantityper', q.quantity_per);
  applyQueueAmounts(q);
  setText('section',        q.section);
  setText('purchasesource', q.scraper_name);
  setText('eventid',        q.event_id);
  setText('purchasealltime', (q.purchase_total == null || String(q.purchase_total) === '') ? '0' : q.purchase_total);
  if (q.presale_code) setText('presalecode', q.presale_code);
  setText('purchaseurgency', q.buying_urgency);
  setText('notes',           q.purchase_notes);
  setText('purchaserequest', q.added_timestamp);

  startUrgencyCountdown(q.buying_urgency, q.added_timestamp);
  loadSourceInstructions(q.event_url);

  const container = $id('Item-Container');
  const item = $id('samplestyle');
  if (container && item) container.appendChild(item);

  hide('loading');
  show('Item-Container');

  pageLoaded = true;
  loadEventVenue();
  startPollers();
}

async function loadQueueItem() {
  if (!queueId) {
    console.error('No ?id= parameter in the URL — nothing to load.');
    return;
  }
  try {
    await waitFor(isTokenReady, { timeoutMs: 120000, pollMs: 500, label: 'auth token' });
    const q = await apiFetch(`${API_BASE}/buying-queue/${encodeURIComponent(queueId)}/`, {
      attempts: 3, retryDelayMs: 1500,
    });
    applyQueueItem(q);
  } catch (err) {
    console.error('Could not load the queue item:', err);
  }
}

async function loadEventVenue() {
  let row = null;
  try { row = await fetchEventVenue(); } catch (err) { console.error('Error loading event venue:', err); }

  if (!row) {
    await loadAccounts('', credit_account); // still offer the state/email pickers
    return;
  }

  evurl   = row.event_url || '';
  vdidurl = row.vivid_url || '';
  setUsedEmails(row.used_emails);

  setText('purchasetotal', Number(row.purchased_amount) || 0);
  setValue('evname', row.event_name);
  setValue('evdate', row.date);
  setValue('evurl',  evurl);
  setValue('evtime', row.time);
  setValue('vename', row.venue_name);
  setText('primobrowser2', [row.event_name, row.city].filter(Boolean).join(' '));

  await loadAccounts([row.state, toggleStateName(row.state)], credit_account);
}

async function loadSourceInstructions(eventUrl) {
  const id = getsourceid(eventUrl);
  try {
    const data = await apiFetch(`${API_BASE}/source-instructions/?id__iexact=${encodeURIComponent(id)}`);
    const r = firstResult(data);
    if (!r) { console.warn(`No source-instructions row for id ${id}.`); return; }

    if (r.instructions) setText('instructions', r.instructions); else hide('headerbar1');
    if (r.backup_one)   setText('backup-1', r.backup_one);       else hide('headerbar2');
    if (r.backup_two)   setText('backup-2', r.backup_two);       else hide('headerbar3');
    setText('browser', r.browser);
  } catch (err) {
    console.error('Error loading source instructions:', err);
  }
}

/* ---- Urgency countdown (replaces the 20-case switch; now ticks every second) ---- */

function startUrgencyCountdown(urgency, addedTimestamp) {
  const el = $id('buytimestamp');
  if (!el) return;
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }

  const minutes   = urgencyToMinutes(urgency);
  const requested = parseNYTimestamp(addedTimestamp);
  if (!minutes || !requested.isValid()) return; // unknown urgency → leave the field alone

  const deadline = requested.clone().add(minutes, 'minutes');
  const tick = () => {
    const ms = deadline.diff(moment());
    if (ms <= 0) {
      el.textContent = 'ASAP';
      el.style.color = 'red';
      clearInterval(countdownTimer);
      countdownTimer = null;
      return;
    }
    el.textContent = formatHMS(ms);
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}

/* ================================================================== */
/*  Background refresh (every 8 s, paused while a purchase is saving)   */
/* ================================================================== */

async function refreshQueueItem() {
  if (buying || !queueId) return;
  try {
    const q = await fetchQueueItem();
    if (buying) return;
    applyQueueAmounts(q);

    const bought = Number(getText('amountbought1')) || 0;
    const limit  = Number(getText('amountbought2')) || 0;
    if (limit > 0 && bought >= limit) {
      console.log('Queue item is complete — returning to the queue.');
      window.location.replace(QUEUE_PATH);
    }
  } catch (err) {
    console.error('Error refreshing queue item:', err);
  }
}

async function refreshPrimaryEvent() {
  if (buying || !thiseventid) return;
  try {
    const p = await fetchPrimaryEvent();
    if (!buying && p && p.purchased_amount) setText('purchasetotal', p.purchased_amount);
  } catch (err) {
    console.error('Error refreshing primary event:', err);
  }
}

async function syncUsedEmails() {
  if (buying || !thiseventid) return;
  try {
    const row = await fetchEventVenue();
    if (!row || buying) return;
    setUsedEmails(row.used_emails);
    pruneUsedEmailOptions();
  } catch (err) {
    console.error('Error syncing used emails:', err);
  }
}

function startPollers() {
  stopPollers();
  pollers = [
    setInterval(refreshQueueItem,   POLL_MS),
    setInterval(refreshPrimaryEvent, POLL_MS),
    setInterval(syncUsedEmails,      POLL_MS),
  ];
}
function stopPollers() {
  for (const id of pollers) clearInterval(id);
  pollers = [];
}

/* ================================================================== */
/*  Recording a purchase                                               */
/* ================================================================== */

/** Reads the form, refreshes server-side counters, and snapshots everything the steps need. */
async function prepareBuyJob() {
  const email = getValue('purchaseaccounts');
  const qty   = Number(getValue('purchasequantity'));
  if (!email) throw new UserError('Select a purchasing account (email) first.');
  if (!Number.isInteger(qty) || qty <= 0) throw new UserError('Enter a valid purchase quantity.');

  // Fresh numbers so concurrent operators don't overwrite each other.
  const [queue, primary, venue] = await Promise.all([
    fetchQueueItem().catch((e) => { console.warn('Could not refresh queue item; using on-page values.', e); return null; }),
    fetchPrimaryEvent().catch((e) => { console.warn('Could not refresh primary event; using on-page values.', e); return null; }),
    fetchEventVenue().catch((e) => { console.warn('Could not refresh used emails; using on-page values.', e); return null; }),
  ]);
  if (queue) applyQueueAmounts(queue);
  if (primary && primary.purchased_amount) setText('purchasetotal', primary.purchased_amount);
  if (venue) setUsedEmails(venue.used_emails);

  return {
    email,
    qty,
    bought:  Number(getText('amountbought1')) || 0,
    limit:   Number(getText('amountbought2')) || 0,
    allTime: Number(getText('purchasetotal')) || 0,
    done: { account: false, queue: false, primary: false, order: false },
  };
}

/** Step 1 — add this event to the account's purchases_tracking (was emailpart1 + emailpart2). */
async function recordAccountPurchase(email) {
  const base = `${API_BASE}/purchasing-accounts/?email__iexact=${encodeURIComponent(email)}`;
  let row = firstResult(await apiFetch(`${base}&closed__iexact=false&paused__iexact=false&tm_restricted__iexact=false`));
  if (!row) {
    // The account may have been flagged closed/paused/restricted after it was selected;
    // the purchase still happened on it, so retry by email only.
    console.warn(`No active account matched "${email}" — retrying without status filters.`);
    row = firstResult(await apiFetch(base));
  }
  if (!row) {
    throw new UserError(`No purchasing account found for "${email}" — purchase tracking was NOT updated.`);
  }

  const tracking   = Array.isArray(row.purchases_tracking) ? row.purchases_tracking : [];
  const sourceCode = getsource(getText('url'));
  const eventDate  = getText('date');

  const entry = tracking.find((t) => t && typeof t === 'object' && t[sourceCode] !== undefined);
  if (entry) {
    if (!entry[sourceCode] || typeof entry[sourceCode] !== 'object') entry[sourceCode] = {};
    entry[sourceCode][encodedthiseventid] = eventDate;
  } else {
    tracking.push({ [sourceCode]: { [encodedthiseventid]: eventDate } });
  }

  await apiFetch(`${API_BASE}/update/purchasing-accounts/`, {
    method: 'PUT', body: { id: row.id, purchases_tracking: tracking },
  });
}

/** Step 2 — bump the queue item's purchased amount, completing it when the target is hit (was part1). */
async function updateQueueItem(combined, limit) {
  const body = { id: queueId, purchased_amount: combined };
  if (combined >= limit) body.completed = 'TRUE';
  await apiFetch(`${API_BASE}/update/buying-queue/`, { method: 'PUT', body });
}

/** Step 3 — bump the primary event's all-time amount and record the email as used (was part2). */
async function updatePrimaryEvent(allTimeCombined, email) {
  const body = { site_event_id: thiseventid, purchased_amount: allTimeCombined };
  const alreadyUsed = usedEmails.has(email);
  if (!alreadyUsed) body.used_emails = [...usedEmails, email].join(',');

  await apiFetch(`${API_BASE}/update/primary-events/`, { method: 'PUT', body });

  if (!alreadyUsed) {
    usedEmails.add(email);
    emails = [...usedEmails].join(',');
  }
}

/** Step 4 — create the order-history row (was part3). */
async function createOrderHistory(job) {
  const now           = moment.tz(NY_TZ);
  const requestedText = getText('purchaserequest');
  const requested     = parseNYTimestamp(requestedText);

  const pfilled = now.format('MM/DD/YYYY HH:mm:ss');
  setValue('purchd', pfilled);

  const body = {
    event_name:               getText('event'),
    event_id:                 thiseventid,
    event_date:               getText('date'),
    event_venue:              getText('venue'),
    event_time:               getText('time'),
    purchase_source:          getText('purchasesource'),
    purchase_quantity:        getValue('purchasequantity'),
    purchase_quantity_total:  getText('amountbought2'),
    confirmation:             getValue('purchaseconfirmation'),
    purchased_by:             getText('username'),
    purchase_requested:       requestedText,
    purchase_difference:      requested.isValid() ? formatHMS(now.diff(requested)) : '',
    p_filled:                 pfilled,
    p_requested:              requested.isValid() ? requested.format('MM/DD/YYYY HH:mm:ss') : '',
    purchase_date:            now.format('MM/DD/YYYY, hh:mm A'),
    purchase_quantity_alltime: job.allTime + job.qty,
    one_ticket_id:            randomId('Oneticket_', 8),
    details_match:            $id('detailsmatch')?.checked ?? false,
    did_not_select_wc:        $id('willcall')?.checked ?? false,
    purchase_urgency:         getText('purchaseurgency'),
    signal_identifier:        signalidentifier,
    purchaser,
    primary_event_url:        evurl,
    vivid_event_url:          vdidurl,
    purchase_account:         job.email.slice(0, 1).toUpperCase(),
    purchase_email:           job.email,
  };

  await apiFetch(`${API_BASE}/create/order-history/`, { method: 'POST', body });
}

async function onBuyClick() {
  if (buying) return;
  buying = true;
  stopPollers();
  setBuyButton('Checking...', true);

  try {
    if (!buyJob) buyJob = await prepareBuyJob();
    const job = buyJob;
    setBuyButton('Saving...', true);

    // Steps that already succeeded (on a previous attempt) are skipped, so a retry
    // never double-counts tickets.
    const steps = [
      ['account', () => recordAccountPurchase(job.email)],
      ['queue',   () => updateQueueItem(job.bought + job.qty, job.limit)],
      ['primary', () => updatePrimaryEvent(job.allTime + job.qty, job.email)],
      ['order',   () => createOrderHistory(job)],
    ];
    const results = await Promise.allSettled(steps.map(async ([name, run]) => {
      if (job.done[name]) return;
      await run();
      job.done[name] = true;
    }));
    const failures = results.filter((r) => r.status === 'rejected').map((r) => r.reason);
    if (failures.length) throw failures[0];

    buyJob = null;
    show('loading');
    hide('Item-Container');
    await sleep(2000);
    window.location.href = QUEUE_PATH;
  } catch (err) {
    console.error('Purchase could not be fully recorded:', err);
    buying = false;

    // Only resume background refresh if nothing was written yet; otherwise the
    // "complete" redirect could fire before the operator can retry the failed step.
    if (!buyJob && pageLoaded) startPollers();

    if (err instanceof UserError) alert(err.message);
    setBuyButton(buyJob ? 'Failed — click to retry' : buyButtonLabel, false);
  }
}

/* ================================================================== */
/*  Event handlers                                                     */
/* ================================================================== */

function onBuyerEmailChange() {
  abortAllRequests();
  erasedata();

  const email = getValue('buyer_email');
  if (!email) return;

  const provider = getValue('issuer') || credit_account;
  applySelectedEmail(email);
  loadCardDetails(email, provider);
  displayBuyerData(email);
  loadProxyForEmail(email);
}

function onBuyerStateChange() {
  const stateKey = getValue('buyer_state');
  if (!stateKey) return; // "Select one..." → leave the email list as it is

  const hadSelection = !!getValue('buyer_email');
  populateEmails(stateKey);

  // Switching state de-selects the email; don't leave the old account's data (and hidden
  // #purchaseaccounts value) on screen where it could be bought against by mistake.
  if (hadSelection && !getValue('buyer_email')) {
    abortAllRequests();
    erasedata();
  }
}

function onIssuerChange() {
  if (suppressIssuerHandler) return;

  const issuer = getValue('issuer');
  if (!issuer) { console.warn('Issuer selection is empty.'); return; }

  const prevEmail = getValue('buyer_email');
  const prevState = getValue('buyer_state');

  abortAllRequests();
  erasedata();

  if (prevEmail) {
    applySelectedEmail(prevEmail);
    loadCardDetails(prevEmail, issuer);
    displayBuyerData(prevEmail);
    loadProxyForEmail(prevEmail);
  }
  // Used-emails filter comes from the shared `usedEmails` set, not from #purchaseaccounts.
  loadAccounts(prevState, issuer, prevEmail);
}

function bindEvents() {
  $id('purchasequantity')?.setAttribute('min', '0');

  on('buyer_email', 'change', onBuyerEmailChange);
  on('buyer_email', 'click',  () => { syncUsedEmails(); });
  on('buyer_state', 'change', onBuyerStateChange);
  on('issuer',      'change', onIssuerChange);
  on('buybtn',      'click',  onBuyClick);
  on('proxychange', 'click',  assignNextFreeProxy);

  on('unlock', 'click', function () {
    copyZipForCard(this.getAttribute('retrieve') || '', getValue('issuer') || credit_account);
  });
  on('unlock2', 'click', function () {
    copyText(this.getAttribute('retrieve') || '');
  });

  for (const id of COPY_ON_CLICK_IDS) on(id, 'click', () => copyText(getText(id)));

  on('purchaseaccounts', 'change', function () {
    if (this.value && this.value !== 'manual') copyText(this.value);
  });

  document.addEventListener('input',  updateBuyButtons);
  document.addEventListener('change', updateBuyButtons);
  updateBuyButtons();

  // Webflow form submit (failed-purchase report) → back to the queue after 3 s.
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    $('form').on('submit', () => {
      setTimeout(() => { window.location.href = QUEUE_PATH; }, 3000);
    });
  });
}

/* ================================================================== */
/*  Boot                                                               */
/* ================================================================== */

function init() {
  bindEvents();
  loadQueueItem();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
