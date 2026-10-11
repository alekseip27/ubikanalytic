// ────────────────────────────────────────────────────────────────────────────
// EDIT EVENT PAGE  (…/edit-event?id=<buying-queue id>)
//
// Depends on a global `token` (40-char API token) set by another script on the
// page. moment-timezone is used for the timestamp if it is loaded, but it is
// no longer required. jQuery is no longer required.
// ────────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  // CONFIG
  // ──────────────────────────────────────────────────────────────────────────
  const API_BASE            = 'https://ubik.wiki/api';
  const TM_DETAILS_BASE     = 'http://142.93.115.105:8100/event/';
  const AFTER_SAVE_URL      = '/buy-queue';
  const TOKEN_POLL_MS       = 250;
  const TOKEN_WARN_AFTER_MS = 30000;

  // Read-only labels: [element id, API field]
  const TEXT_FIELDS = [
    ['event',  'event_name'],
    ['venue',  'event_venue'],
    ['source', 'event_source'],
    ['date',   'event_date'],
    ['time',   'event_time'],
    ['url',    'event_url']
  ];

  // Editable inputs: [element id, API field].
  // Used for BOTH loading and saving, so the two can't drift apart.
  const FORM_FIELDS = [
    ['purchasetotal',         'purchase_total'],
    ['quantityper',           'quantity_per'],
    ['section',               'section'],
    ['buyingurgency',         'buying_urgency'],
    ['creditaccount',         'credit_account'],
    ['presalecode',           'presale_code'],
    ['notes',                 'purchase_notes'],
    ['assign',                'assign'],
    ['signal-identifier',     'signal_identifier'],
    ['signal-identifier-two', 'signal_identifier_two'],
    ['pricer-notes',          'pricing_notes'],
    ['purchase-scenario',     'purchase_scenario'],
    ['organic-movement',      'organic_movement'],
    ['app-142-drop-estimate', 'app_142_estimate']
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────────────────────────
  // Works on any host / with extra query params or a #hash, unlike splitting
  // the full URL on a hard-coded string.
  const eventId = (new URLSearchParams(window.location.search).get('id') || '').trim();

  let eventLoaded = false;   // form must be populated before it can be saved
  let saving      = false;   // blocks double submits (mouse AND keyboard)

  // ──────────────────────────────────────────────────────────────────────────
  // SMALL HELPERS
  // ──────────────────────────────────────────────────────────────────────────
  const byId = id => document.getElementById(id);

  /** Swap this out if you have a nicer toast/banner on the page. */
  function notify(message) {
    console.error(message);
    alert(message);
  }

  /** `token` lives in another script; typeof avoids a ReferenceError if it isn't there yet. */
  function getToken() {
    // eslint-disable-next-line no-undef
    return (typeof token === 'string' && token.length === 40) ? token : null;
  }

  function authHeaders(extra) {
    return Object.assign({ 'Authorization': `Bearer ${getToken()}` }, extra || {});
  }

  function show(id, display) {
    const el = byId(id);
    if (el) el.style.display = display;
  }

  function setText(id, value) {
    const el = byId(id);
    if (!el) { console.warn(`#${id} not found`); return; }
    el.textContent = value == null ? '' : String(value);
  }

  /**
   * Sets an input/select value. null/undefined become '' (otherwise inputs
   * literally show "undefined"). If a <select> has no option for the saved
   * value, the option is added – otherwise the select goes blank and the next
   * save silently wipes that field.
   */
  function setValue(id, value) {
    const el = byId(id);
    if (!el) { console.warn(`#${id} not found`); return; }
    const v = value == null ? '' : String(value);
    if (el.tagName === 'SELECT' && v !== '' &&
        !Array.from(el.options).some(o => o.value === v)) {
      el.add(new Option(v, v));
    }
    el.value = v;
  }

  /** Throws if the element is missing, so we never save a blank over real data. */
  function getValue(id) {
    const el = byId(id);
    if (!el) throw new Error(`Can't save: form field #${id} is missing from the page.`);
    return el.value;
  }

  /**
   * Ticketmaster event id = the path segment after /event/.
   *   https://www.ticketmaster.com/some-show-01-30-2027/event/090065441DB66657
   *     -> "090065441DB66657"
   * Query strings, #hashes and trailing slashes are ignored. If there is no
   * /event/ segment, falls back to the last path segment.
   */
  function getTmEventId(eventUrl) {
    const raw = String(eventUrl == null ? '' : eventUrl).trim();
    if (!raw) return '';

    let path;
    try { path = new URL(raw).pathname; }
    catch (_) { path = raw.split(/[?#]/)[0]; }   // not an absolute URL

    const match = path.match(/\/event\/([^/]+)/i);
    if (match) return match[1];

    const parts = path.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
  }

  /** Turns a failed response into a readable message. */
  async function describeError(res) {
    let detail = '';
    try {
      const body = JSON.parse(await res.text());
      detail = typeof body === 'string'
        ? body
        : (body.detail || body.error || body.message || JSON.stringify(body));
    } catch (_) { /* non-JSON body (e.g. HTML error page) – status is enough */ }
    return `HTTP ${res.status}${detail ? ' – ' + detail : ''}`;
  }

  /** MM/DD/YYYY, hh:mm AM/PM in US Eastern time. */
  function easternTimestamp() {
    // eslint-disable-next-line no-undef
    if (typeof moment === 'function' && typeof moment.tz === 'function') {
      // eslint-disable-next-line no-undef
      return moment().tz('America/New_York').format('MM/DD/YYYY, hh:mm A');
    }
    // Fallback if moment-timezone didn't load – same output format.
    const p = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).formatToParts(new Date()).forEach(part => { p[part.type] = part.value; });
    return `${p.month}/${p.day}/${p.year}, ${p.hour}:${p.minute} ${p.dayPeriod}`;
  }

  async function copyToClipboard(text) {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch (_) { /* fall through to the legacy path */ }
    try {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MULTI-SELECT TAGS
  // ──────────────────────────────────────────────────────────────────────────
  /** Accepts "a, b, c" or ['a', 'b', 'c']. */
  function parseTags(tags) {
    const list = Array.isArray(tags) ? tags : String(tags == null ? '' : tags).split(',');
    return list.map(t => String(t).trim()).filter(Boolean);
  }

  /**
   * Pre-selects <option>s for the event's tags (case-insensitive).
   * Tags that have no <option> are added as selected options, so saving the
   * form doesn't silently delete them.
   */
  function applyEventTags(select, tags) {
    const wanted     = parseTags(tags);
    const wantedNorm = new Set(wanted.map(t => t.toLowerCase()));
    const known      = new Set();

    Array.from(select.options).forEach(opt => {
      const norm = opt.value.trim().toLowerCase();
      known.add(norm);
      opt.selected = wantedNorm.has(norm);
    });

    wanted.forEach(tag => {
      const norm = tag.toLowerCase();
      if (!known.has(norm)) {
        select.add(new Option(tag, tag, true, true));
        known.add(norm);
      }
    });
  }

  /** Read straight from the DOM at save time – no separate array to go stale. */
  function getSelectedTags() {
    const select = byId('tags');
    if (!select) throw new Error("Can't save: #tags is missing from the page.");
    return Array.from(select.selectedOptions).map(o => o.value);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FETCH & RENDER EVENT
  // ──────────────────────────────────────────────────────────────────────────
  function renderEvent(ev) {
    TEXT_FIELDS.forEach(([id, field]) => setText(id, ev[field]));

    const isTM = ev.event_source === 'TM';

    // The details link uses the Ticketmaster event id taken from event_url
    // (NOT the buying-queue id from this page's ?id=, which is only for the API).
    const tmEventId = isTM ? getTmEventId(ev.event_url) : '';
    if (tmEventId) {
      setText('url2', TM_DETAILS_BASE + encodeURIComponent(tmEventId) + '/details/');
      show('url2box', 'flex');
    } else {
      if (isTM) console.warn('TM event but no event id found in event_url:', ev.event_url);
      show('url2box', 'none');   // better no link than a wrong one
    }
    ['organic-movement', 'app-142-drop-estimate'].forEach(id => {
      const el = byId(id);
      if (el) el.disabled = !isTM;
    });

    // Move the template (which contains <select id="tags">) into the container
    const itemContainer = byId('Item-Container');
    const item          = byId('samplestyle');
    if (itemContainer && item) itemContainer.appendChild(item);

    FORM_FIELDS.forEach(([id, field]) => setValue(id, ev[field]));

    const tagsSelect = byId('tags');
    if (tagsSelect) {
      tagsSelect.multiple = true;
      applyEventTags(tagsSelect, ev.tags);
    } else {
      console.warn('#tags not found');
    }

    eventLoaded = true;

    // Show UI, hide loader
    show('loading', 'none');
    show('Item-Container', 'flex');
  }

  async function getevent() {
    if (!eventId) {
      notify('No event id in the URL (expected …/edit-event?id=123).');
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/buying-queue/${encodeURIComponent(eventId)}/`,
        { method: 'GET', headers: authHeaders() }
      );
      if (!res.ok) throw new Error(await describeError(res));

      const ev = await res.json();
      if (!ev || typeof ev !== 'object') throw new Error('Unexpected response from the server.');

      renderEvent(ev);
    } catch (err) {
      // Previously this only logged to the console and left the spinner forever.
      notify(`Could not load event ${eventId}: ${err.message || err}`);
    }
  }

  /** Wait until `token` is valid, then load the event. */
  function waitForToken() {
    if (getToken()) { getevent(); return; }   // no pointless 1s delay if it's already there

    const started = Date.now();
    let warned = false;
    const timer = setInterval(() => {
      if (getToken()) {
        clearInterval(timer);
        getevent();
      } else if (!warned && Date.now() - started > TOKEN_WARN_AFTER_MS) {
        warned = true;   // keep polling, but tell the user why nothing is happening
        notify('Still waiting for your login token – you may need to sign in again.');
      }
    }, TOKEN_POLL_MS);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SAVE / UPDATE EVENT
  // ──────────────────────────────────────────────────────────────────────────
  async function saveEvent(e) {
    if (e) e.preventDefault();
    if (saving) return;

    if (!eventLoaded) {
      notify("The event hasn't finished loading yet – nothing was saved.");
      return;
    }

    const btn = byId('buybtn');
    saving = true;
    if (btn) btn.style.pointerEvents = 'none';

    try {
      if (!getToken()) throw new Error('Your login token is missing – please sign in again.');

      const payload = {
        id:              eventId,
        added_timestamp: easternTimestamp(),
        tags:            getSelectedTags().join(',')
      };
      FORM_FIELDS.forEach(([id, field]) => { payload[field] = getValue(id); });

      const res = await fetch(`${API_BASE}/update/buying-queue/`, {
        method:  'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body:    JSON.stringify(payload)
      });

      // fetch() does NOT reject on 4xx/5xx – without this check a rejected
      // save looked exactly like a successful one.
      if (!res.ok) throw new Error(await describeError(res));

      res.json().then(data => console.log(data)).catch(() => {});

      show('loading', 'flex');
      show('Item-Container', 'none');
      setTimeout(() => { window.location.href = AFTER_SAVE_URL; }, 750);
    } catch (err) {
      // Re-enable the button so the user can retry instead of being stuck.
      saving = false;
      if (btn) btn.style.pointerEvents = '';
      notify(`Save failed – your changes were NOT saved.\n${err.message || err}`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // INIT
  // ──────────────────────────────────────────────────────────────────────────
  function init() {
    const btn = byId('buybtn');
    if (btn) btn.addEventListener('click', saveEvent);
    else console.error('#buybtn not found – saving is disabled.');

    // Copy-to-clipboard: #urlx copies the event URL, #url2 copies itself
    const urlx = byId('urlx');
    if (urlx) urlx.addEventListener('click', () => {
      const url = byId('url');
      copyToClipboard(url ? url.textContent : '');
    });
    const url2 = byId('url2');
    if (url2) url2.addEventListener('click', () => copyToClipboard(url2.textContent));

    waitForToken();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
