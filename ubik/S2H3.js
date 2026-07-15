document.getElementById('rightarrow').addEventListener('click', function () {
  if (nexturl) constructURL(nexturl);
});

document.getElementById('leftarrow').addEventListener('click', function () {
  if (prevurl) constructURL(prevurl);
});

document.querySelector('#search-button').addEventListener("click", () => {
  constructURL();
});

function constructURL(next) {
  document.querySelector('#loading').style.display = "flex";
  document.querySelector('#flexbox').style.display = "none";

  // Trim trailing spaces (safer than trimEnd on the value only)
  const searchbar1 = document.getElementById('searchbar1');
  const searchbar2 = document.getElementById('searchbar2');
  const searchbar3 = document.getElementById('searchbar3');
  const searchbar4 = document.getElementById('searchbar4');
  const searchbar5 = document.getElementById('searchbar5');
  const checkbox1 =  document.getElementById('linked-oh').checked

  searchbar1.value = searchbar1.value.trimEnd();
  searchbar2.value = searchbar2.value.trimEnd();
  searchbar3.value = searchbar3.value.trimEnd();
  searchbar4.value = searchbar4.value.trimEnd();
  searchbar5.value = searchbar5.value.trimEnd();

  const keywords1 = encodeURIComponent(searchbar1.value);
  const keywords2 = encodeURIComponent(searchbar2.value);
  const keywords3 = encodeURIComponent(searchbar3.value);
  const keywords4 = encodeURIComponent(searchbar4.value);
  const keywords5 = encodeURIComponent(searchbar5.value);

  const baseUrl = 'https://ubik.wiki/api/skybox-sales-data/?invoice_date__sort=-1&limit=100&'
  const params = [];

  if (keywords1.length > 0) params.push('performer__icontains=' + keywords1);
  if (keywords2.length > 0) params.push('venue_name__icontains=' + keywords2);
  if (keywords3.length > 0) params.push('invoice_date__icontains=' + keywords3);
  if (keywords4.length > 0) params.push('purchaser__icontains=' + keywords4);
  if (keywords5.length > 0) params.push('signal_identifier__icontains=' + keywords5);
  if (checkbox1) { params.push('purchaser__isblank=false'); }
  // hide existing boxes quickly
  $('.event-box').hide();

  let xanoUrl = '';

  if (next) {
    const nurl = new URL(next);
    const param = new URLSearchParams(nurl.search);
    const offset = param.get('offset');
    if (offset) params.push('offset=' + offset);

    xanoUrl = nurl.origin + nurl.pathname + '?' + params.join('&');
  } else {
    xanoUrl = baseUrl + params.join('&');
  }

  getEvents(xanoUrl);
}

function getEvents(fetchurl) {
  const request = new XMLHttpRequest();
  request.open('GET', fetchurl, true);
  request.setRequestHeader("Content-type", "application/json; charset=utf-8");
  request.setRequestHeader('Authorization', `Bearer ${token}`);

  request.onload = function () {
    let data;
    try {
      data = JSON.parse(this.response);
    } catch (e) {
      console.error("Bad JSON:", this.response);
      showError("Server returned invalid JSON.");
      return;
    }

    if (request.status >= 200 && request.status < 400) {
      // Update pagination URLs
      nexturl = data.next;
      prevurl = data.previous;

      // Paging display
      const totalResults = data.count ?? 0;
      const resultsPerPage = 100;
      const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));
      document.getElementById('maxpages').textContent = String(totalPages);

      let currentPage = 1;

      if (nexturl) {
        const match = nexturl.match(/offset=(\d+)/);
        if (match && match[1]) {
          const offset = parseInt(match[1]);
          currentPage = Math.ceil(offset / resultsPerPage);
        }
      } else if (prevurl) {
        currentPage = totalPages;
      }

      document.getElementById('curpage').textContent = String(currentPage);

      // Switch UI
      document.querySelector('#loading').style.display = "none";
      document.querySelector('#flexbox').style.display = "flex";
      // Clear old cards (everything except template)
      cleanupCards();

      const cardContainer = document.getElementById("Cards-Container");
      const template = document.getElementById('samplestyle');

      // Render cards
      (data.results || []).forEach(events => {
        const card = template.cloneNode(true);

        // IMPORTANT: do not duplicate the template id
        card.removeAttribute('id');

        // Keep identifiers on the element
        // NOTE: skybox-sales-data has no site_event_id/email; use skybox_id
        card.setAttribute('cardid', events.skybox_id ?? '');
        card.setAttribute('url', events.primary_event_url ?? '');

        const stubhubId = events.stubhub_url?.match(/\/event\/(\d+)/)?.[1] ?? '';
        const vseatsId  = events.vividseats_url?.match(/productionId=(\d+)/)?.[1] ?? '';

        card.setAttribute('stubhubid', stubhubId);
        card.setAttribute('vseatsid', vseatsId);
        // If you actually want DOM id, it must be unique:
        card.setAttribute('data-event-id', String(events.id));

        card.style.display = 'flex';

        const invoicedatecard = card.getElementsByClassName('main-text-invoicedate')[0]
        invoicedatecard.textContent = events.invoice_date;

        const eventdatecard = card.getElementsByClassName('main-text-eventdate')[0]
        eventdatecard.textContent = events.event_date;

        const performernamecard = card.getElementsByClassName('main-text-performern')[0]
        performernamecard.textContent = events.performer;

        if (performernamecard.textContent.length > 10) {
          performernamecard.textContent = events.performer.slice(0, 10) + '...'
        }

        const venuenamecard = card.getElementsByClassName('main-text-venuen')[0]
        venuenamecard.textContent = events.venue_name;

        if (venuenamecard.textContent.length > 10) {
          venuenamecard.textContent = events.venue_name.slice(0, 10) + '...'
        }

        const venuestatecard = card.getElementsByClassName('main-text-venue-state')[0]
        venuestatecard.textContent = events.venue_state;

        const sectioncard = card.getElementsByClassName('main-text-sections')[0]
        sectioncard.textContent = events.section;

        const rowcard = card.getElementsByClassName('main-text-rown')[0]
        rowcard.textContent = events.row;

        const categorycard = card.getElementsByClassName('main-text-categorys')[0]
        categorycard.textContent = events.category;

        const quantitycard = card.getElementsByClassName('main-text-quantityn')[0]
        quantitycard.textContent = events.quantity;

        const totalcard = card.getElementsByClassName('main-text-total')[0]
        totalcard.textContent = events.total;
        
        const profitcard = card.getElementsByClassName('main-text-profitn')[0]
        profitcard.textContent = events.profit;
        
        const profitmargincard = card.getElementsByClassName('main-text-profitm')[0]
        profitmargincard.textContent = events.profit_margin + '%'

        const purchasercard = card.getElementsByClassName('main-text-purchaser')[0]
        purchasercard.textContent = events.purchaser;

        const signalcard = card.getElementsByClassName('main-text-signal-identifier')[0]
        signalcard.textContent = events.signal_identifier;

        const vividseatsbtn = card.getElementsByClassName('vividseats-url-btn')[0];
        vividseatsbtn.addEventListener('click', () => {
          const w = window.open(events.vividseats_url, 'vividmain');
          if (w) w.focus();
        });

        const primaryurlbtn = card.getElementsByClassName('primary-url-btn')[0];
        primaryurlbtn.addEventListener('click', () => {
          const w = window.open(events.primary_event_url, 'primaryurl');
          if (w) w.focus();
        });

        const stubhubbtn = card.getElementsByClassName('stubhub-url-button')[0];
        stubhubbtn.addEventListener('click', () => {
          const w = window.open(events.stubhub_url, 'stubhubmain');
          if (w) w.focus();
        });

        const charticon = card.getElementsByClassName('main-text-chart-sbox')[0];

        charticon.addEventListener('click', async function () {
          // header info comes straight from this sale record
          // (skybox rows have no city/time; the old attribute reads were
          // leftovers from the primary-events page and always returned null)
          document.querySelector('#chart-date').textContent = events.event_date ?? '';
          document.querySelector('#chart-event').textContent = events.performer ?? '';
          document.querySelector('#chart-venue').textContent = events.venue_name ?? '';
          document.querySelector('#chart-location').textContent = events.venue_state ?? '';
          document.querySelector('#chart-time').textContent = '';

          // reset primary chart
          chart.data.datasets.splice(1, 3);
          chart.data.datasets[0].label = '';
          chart.data.datasets[0].data = [];
          chart.config.data.labels = [];
          chart.update();

          // open overlay with both loaders up
          document.querySelector('#graph-overlay').style.display = 'flex';
          document.querySelector('#closecharts').style.display = 'flex';
          document.querySelector('#tmloader').style.display = 'flex';
          document.querySelector('#tmerror').style.display = 'none';
          document.querySelector('#tmchart').style.display = 'none';
          document.querySelector('#vsloader').style.display = 'flex';
          document.querySelector('#vserror').style.display = 'none';
          document.querySelector('#vschart').style.display = 'none';

          const src = events.primary_event_url || '';

          // this page renders skybox sales, so the primary-events record
          // (site_event_id, site_venue_id, tevo id) has to be looked up
          let primary = null;
          if (src) {
            try {
              const res = await fetch(
                `https://ubik.wiki/api/primary-events/?event_url__iexact=${encodeURIComponent(src)}&limit=1&format=json`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              const json = await res.json();
              primary = json.results?.[0] ?? null;
            } catch (e) {
              console.error('primary-events lookup failed:', e);
            }
          }

          // ---- secondary market chart (#vschart) ----
          // stubhub id is parsed from the sale's own url; tevo id only
          // exists on the primary-events side
          const shId = stubhubId || primary?.stubhub_id || '';
          const tevoId = primary?.tevo_event_id || null;

          if (shId || tevoId) {
            const tasks = [];
            if (shId) tasks.push(vschartdata(shId));
            if (tevoId && typeof tevochartdata === 'function') tasks.push(tevochartdata(tevoId));

            // allSettled waits for all, never short-circuits on one failure
            Promise.allSettled(tasks).then((results) => {
              const anySucceeded = results.some(r => r.status === 'fulfilled');

              results.forEach((r, i) => {
                if (r.status === 'rejected') console.error(`chart source ${i} failed:`, r.reason);
              });

              document.querySelector('#vsloader').style.display = 'none';
              document.querySelector('#vschart').style.display = anySucceeded ? 'flex' : 'none';
              document.querySelector('#vserror').style.display = anySucceeded ? 'none' : 'flex';
            });
          } else {
            document.querySelector('#vsloader').style.display = 'none';
            document.querySelector('#vschart').style.display = 'none';
            document.querySelector('#vserror').style.display = 'flex';
          }

          // ---- primary chart (#tmchart) ----
          const isTm = src.includes('ticketmaster') || src.includes('livenation');
          const tmurlEl = document.querySelector('#tmurl');
          document.querySelector('#eventicon').style.display = 'none';

          if (isTm) {
            // TM event id: prefer site_event_id minus its 2-char source
            // prefix, fall back to the last path segment of the event url
            const tmId = primary?.site_event_id
              ? String(primary.site_event_id).substring(2)
              : (src.split('/event/')[1]?.split(/[/?#]/)[0] ?? '');

            tmurlEl.style.display = 'block';
            if (tmId) {
              tmurlEl.href = 'http://142.93.115.105:8100/event/' + tmId + '/details/';
              fetchTicketmasterData(tmId);
            } else {
              tmurlEl.href = src;
              displayLoadingFailed();
            }
          } else if (primary?.site_event_id) {
            tmurlEl.style.display = 'block';
            tmurlEl.href = src;
            updateChartWithPrimaryAndPreferred(primary);
          } else {
            // no primary url on this sale, or no matching primary-events record
            tmurlEl.style.display = src ? 'block' : 'none';
            if (src) tmurlEl.href = src;
            displayLoadingFailed();
          }
        });

        // chart icon visibility: anything with a stubhub id is chartable,
        // and any primary url except the unscraped TM regions
        const chartSrc = events.primary_event_url || '';
        const excludedTm = chartSrc.includes('ticketmaster.com.mx')
          || chartSrc.includes('ticketmaster.co.uk')
          || chartSrc.includes('ticketmaster.de');

        if (stubhubId || (chartSrc && !excludedTm)) {
          charticon.style.display = 'flex'
        } else {
          charticon.style.display = 'none'
        }

        // ✅ Append card immediately (NOT inside delete click)
        cardContainer.appendChild(card);
      });

      // periodic cleanup of hidden boxes (your original idea, but safer)
      startCleanupInterval();
      updateSummaryTotals();

    } else {
      console.error("Request failed:", request.status, request.responseText);
      showError("Request failed. Check console for details.");
    }
  };

  request.onerror = function () {
    showError("Network error while fetching events.");
  };

  // ✅ send must be outside onload
  request.send();
}

function setText(rootEl, className, value) {
  const el = rootEl.getElementsByClassName(className)[0];
  if (el) el.textContent = (value ?? '').toString();
}

function showError(msg) {
  document.querySelector('#loading').style.display = "none";
  document.querySelector('#flexbox').style.display = "flex";
  if (err) err.textContent = msg;
}

function cleanupCards() {
  const boxes = document.querySelectorAll('.event-box');
  for (const box of boxes) {
    if (box.id !== 'samplestyle') box.remove();
  }
}

let cleanupIntervalId = null;
function startCleanupInterval() {
  if (cleanupIntervalId) return;
  cleanupIntervalId = window.setInterval(function () {
    const boxes = document.querySelectorAll('.event-box');
    for (const box of boxes) {
      if (box.id !== 'samplestyle' && box.style.display === 'none') {
        box.remove();
      }
    }
  }, 500);
}


function updateSummaryTotals() {
  let qty = 0, total = 0, profit = 0;

  document.querySelectorAll('.event-box').forEach(box => {
    if (box.id === 'samplestyle' || box.style.display === 'none') return;

    qty    += parseFloat(box.getElementsByClassName('main-text-quantityn')[0]?.textContent) || 0;
    total  += parseFloat(box.getElementsByClassName('main-text-total')[0]?.textContent) || 0;
    profit += parseFloat(box.getElementsByClassName('main-text-profitn')[0]?.textContent) || 0;
  });

  // profit margin = (profit / total) x 100 — computed from the sums,
  // NOT averaged from the per-row margins
  const margin = total !== 0 ? (profit / total) * 100 : 0;

  document.querySelector('#sum-quantity').textContent = qty.toLocaleString('en-US');
  document.querySelector('#sum-total').textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.querySelector('#sum-profit').textContent = profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.querySelector('#sum-margin').textContent = margin.toFixed(2) + '%';
}

// Auto-run once token is ready (keeps your behavior)
let tokenWaitIntervalId = null;
function retryWhenTokenReady() {
  if (typeof token === 'string' && token.length === 40) {
    constructURL();
    clearInterval(tokenWaitIntervalId);
    tokenWaitIntervalId = null;
  }
}
tokenWaitIntervalId = setInterval(retryWhenTokenReady, 1000);

// Enter-to-search (modern key)
['searchbar1', 'searchbar2', 'searchbar3', 'searchbar4', 'searchbar5'].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
});


  function parseUSDateTime(s) {
      if (!s) return null;
      // eg "8/18/2025, 3:07:11 AM"
      const m = String(s).match(
        /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)\s*$/i
      );
      if (!m) {
        const dt = new Date(s);
        if (isNaN(dt)) return null;
        return { ts: dt.getTime(), label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) };
      }
      let [ , mm, dd, yyyy, hh, min, ss, ap ] = m;
      mm = +mm; dd = +dd; yyyy = +yyyy; hh = +hh; min = +min; ss = +ss;
      if (/pm/i.test(ap) && hh < 12) hh += 12;
      if (/am/i.test(ap) && hh === 12) hh = 0;
      const dt = new Date(yyyy, mm - 1, dd, hh, min, ss);
      if (isNaN(dt)) return null;
      return {
        ts: dt.getTime(),
        // include year to avoid collisions
        label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
      };
    }


function getParseDateFn() {
  return (typeof parseStubhubScrapeDate === "function")
    ? parseStubhubScrapeDate
    : parseUSDateTime;
}

function getOrInitLabelTs(chart) {
  if (!chart.$labelTs) chart.$labelTs = new Map(); // label -> ts
  return chart.$labelTs;
}



function getOrInitLabelTs(chart) {
  if (!chart.$labelTs) chart.$labelTs = new Map(); // label -> ts
  return chart.$labelTs;
}

// Merge new labels into chart, sort by stored ts, and reindex all datasets preserving values
function mergeLabelsAndReindexAllDatasets(chart, incomingLabelTs) {
  const labelTs = getOrInitLabelTs(chart);

  // capture old state
  const oldLabels = Array.isArray(chart.data.labels) ? chart.data.labels.map(String) : [];
  const oldIndex = new Map(oldLabels.map((l, i) => [l, i]));

  // seed labelTs with existing labels if missing (best-effort: keep stable order)
  // NOTE: We do NOT parse label strings like "Dec 15, 25" back into dates.
  // If a label has no ts, it sorts to the end.
  for (let i = 0; i < oldLabels.length; i++) {
    const l = oldLabels[i];
    if (!labelTs.has(l)) labelTs.set(l, Number.NaN);
  }

  // add incoming label timestamps
  for (const [label, ts] of incomingLabelTs.entries()) {
    if (!label || !Number.isFinite(ts)) continue;
    labelTs.set(label, ts);
  }

  // merge labels
  const merged = new Set(oldLabels);
  for (const label of incomingLabelTs.keys()) merged.add(label);

  const newLabels = Array.from(merged);

  // sort using stored ts (never parse label strings)
  newLabels.sort((a, b) => {
    const ta = labelTs.get(a);
    const tb = labelTs.get(b);
    const fa = Number.isFinite(ta);
    const fb = Number.isFinite(tb);
    if (fa && fb) return ta - tb;
    if (fa && !fb) return -1;
    if (!fa && fb) return 1;
    return 0; // keep relative order for unknown ts
  });

  chart.data.labels = newLabels;
  const newIndex = new Map(newLabels.map((l, i) => [l, i]));

  // reindex ALL datasets preserving existing values by label
  for (const ds of chart.data.datasets) {
    const oldData = Array.isArray(ds.data) ? ds.data : [];
    const newData = new Array(newLabels.length).fill(null);

    for (const [label, oi] of oldIndex.entries()) {
      const ni = newIndex.get(label);
      if (ni == null) continue;
      newData[ni] = oldData[oi] ?? null;
    }

    ds.data = newData;
  }

  return newIndex;
}


async function tevochartdata(tevoid) {
  const chart = window.chartvs;
  if (!chart) throw new Error("Chart not initialized: window.chartvs");

  const url = `https://ubik.wiki/api/tevo-data/?event_id__iexact=${encodeURIComponent(tevoid)}&limit=1000`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(`TEVO fetch failed: ${res.status}`);

  const json = await res.json();
  const results = Array.isArray(json?.results) ? json.results : [];

  const tevo = computeTevoSeries(results);

  // merge labels + reindex preserving existing values (including SH)
  const newIndex = mergeLabelsAndReindexAllDatasets(chart, tevo.labelTs);

  // write TEVO values by label (aligned to merged labels)
  setDatasetValuesByLabel(chart, "TEVO Totals", tevo.totalsByLabel, newIndex);
  setDatasetValuesByLabel(chart, "TEVO Min Price", tevo.minByLabel, newIndex);

  chart.update();
}



function computeTevoDailySeries(results, parseDate) {
  const dailyTotals = new Map();
  const dailyMin = new Map();
  for (const r of (Array.isArray(results) ? results : [])) {
    const parsed = parseDate?.(r?.scrape_date);
    const dayLabel = parsed?.label;
    if (!dayLabel) continue;

    const totalTickets = Number(r?.total_amount ?? 0);
    
    const sections = Array.isArray(r?.tickets_by_sections) ? r.tickets_by_sections : [];
    let minPrice = null;
    for (const s of sections) {
      const price = Number(s?.price);
      if (Number.isFinite(price)) {
        minPrice = (minPrice === null) ? price : Math.min(minPrice, price);
      }
    }

    dailyTotals.set(dayLabel, (dailyTotals.get(dayLabel) ?? 0) + totalTickets);
    if (minPrice !== null) {
      const prevMin = dailyMin.get(dayLabel);
      dailyMin.set(dayLabel, (prevMin == null) ? minPrice : Math.min(prevMin, minPrice));
    }
  }
  return { dailyTotals, dailyMin };
}



function applyTevoToChart(chart, dailyTotals, dailyMin) {
  const oldLabels = chart.data.labels || [];

  // normalize existing labels
  const normalizedOld = oldLabels.map(l => normalizeDayLabel(l)).filter(Boolean);

  const oldIndex = new Map(
    normalizedOld.map((l, i) => [l, i])
  );

  // --- STEP 1: merge normalized labels ---
  const labelSet = new Set(normalizedOld);
  for (const k of dailyTotals.keys()) {
    labelSet.add(normalizeDayLabel(k));
  }

  const mergedLabels = Array.from(labelSet).sort((a, b) => {
    const pa = parseUSDateTime(a);
    const pb = parseUSDateTime(b);
    return (pa?.ts ?? 0) - (pb?.ts ?? 0);
  });

  chart.data.labels = mergedLabels;
  const newIndex = new Map(mergedLabels.map((l, i) => [l, i]));

  // --- STEP 2: realign ALL datasets ---
  chart.data.datasets.forEach(ds => {
    const oldData = ds.data || [];
    const newData = new Array(mergedLabels.length).fill(null);

    for (const [label, oldIdx] of oldIndex.entries()) {
      const newIdx = newIndex.get(label);
      if (newIdx != null) {
        newData[newIdx] = oldData[oldIdx] ?? null;
      }
    }

    ds.data = newData;
  });

  // --- STEP 3: insert TEVO data (NOW IT MATCHES) ---
  const tevoTotalsDs = chart.data.datasets.find(d => d.label === "TEVO Totals");
  const tevoMinDs    = chart.data.datasets.find(d => d.label === "TEVO Min Price");

  for (const [rawLabel, total] of dailyTotals.entries()) {
    const label = normalizeDayLabel(rawLabel);
    const idx = newIndex.get(label);
    if (idx != null) tevoTotalsDs.data[idx] = total;
  }

  for (const [rawLabel, minP] of dailyMin.entries()) {
    const label = normalizeDayLabel(rawLabel);
    const idx = newIndex.get(label);
    if (idx != null) tevoMinDs.data[idx] = minP;
  }
}



function setDatasetValuesByLabel(chart, datasetLabel, valueByLabelMap, newIndex) {
  const ds = chart.data.datasets.find(d => d.label === datasetLabel);
  if (!ds) return;

  for (const [label, value] of valueByLabelMap.entries()) {
    const idx = newIndex.get(label);
    if (idx == null) continue;
    ds.data[idx] = value;
  }
}

// ------------------------------
// TEVO series computation (per result/day)
// ------------------------------
function computeTevoSeries(results) {
  const parseDate = getParseDateFn();
  const labelTs = new Map();
  const totalsByLabel = new Map();
  const minByLabel = new Map();
  for (const r of (Array.isArray(results) ? results : [])) {
    const parsed = parseDate(r?.scrape_date);
    if (!parsed?.label || !Number.isFinite(parsed.ts)) continue;
    const label = parsed.label;
    labelTs.set(label, parsed.ts);

    const totalTickets = Number(r?.total_amount ?? 0);

    const raw = r?.tickets_by_sections;
    const sections = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' && raw.id) ? [raw] : [];
    let minPrice = null;
    for (const s of sections) {
      const price = Number(s?.price);
      if (Number.isFinite(price)) minPrice = (minPrice === null) ? price : Math.min(minPrice, price);
    }

    totalsByLabel.set(label, totalTickets);
    if (minPrice !== null) minByLabel.set(label, minPrice);
  }
  return { labelTs, totalsByLabel, minByLabel };
}

function computeShSeries(results) {
  const parseDate = getParseDateFn();

  const points = [];
  const toNum = (x) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  };
  const parsePrice = (p) => {
    if (p == null) return null;
    const n = Number(String(p).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : null;
  };
  const coerceToSections = (item) => {
    if (Array.isArray(item.tickets_by_sections)) return item.tickets_by_sections;
    const amt = toNum(item.total_amount ?? item.total ?? item.total_tickets);
    const lp  = parsePrice(item.price);
    return (amt != null || lp != null) ? [{ amount: amt ?? 0, price: lp ?? null }] : [];
  };

  for (const item of (Array.isArray(results) ? results : [])) {
    const sections = coerceToSections(item);
    if (!sections.length) continue;

    const parsed = parseDate(item.scrape_date || item.date || item.created_on);
    if (!parsed?.label || !Number.isFinite(parsed.ts)) continue;

    let total = toNum(item.total_amount ?? item.total ?? item.total_tickets);
    if (total == null) {
      let sum = 0;
      for (const s of sections) sum += toNum(s.amount) ?? 0;
      total = sum;
    }

    let min2 = null;
    for (const sec of sections) {
      const amt = toNum(sec.amount);
      const price = parsePrice(sec.price);
      if (amt != null && amt >= 2 && price != null) {
        min2 = (min2 == null) ? price : Math.min(min2, price);
      }
    }
    if (min2 == null) {
      for (const sec of sections) {
        const price = parsePrice(sec.price);
        if (price != null) { min2 = price; break; }
      }
    }

    points.push({ ts: parsed.ts, label: parsed.label, total, min2 });
  }

  // dedupe per day (last scrape wins)
  points.sort((a, b) => a.ts - b.ts);
  const byLabel = new Map();
  for (const p of points) byLabel.set(p.label, p);

  const series = Array.from(byLabel.values());

  const labelTs = new Map(series.map(p => [p.label, p.ts]));
  const totalsByLabel = new Map(series.map(p => [p.label, p.total ?? 0]));
  const minByLabel = new Map(series.map(p => [p.label, p.min2 ?? null]));

  return { labelTs, totalsByLabel, minByLabel };
}

function getDayOfWeek(dateString) {
    // Parse the date string into a Date object
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    // Array of days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    // Get the day of the week as a number (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = date.getDay();

    // Return the name of the day
    return daysOfWeek[dayOfWeek];
}

async function vschartdata(stubhubid) {
  const chart = window.chartvs;
  if (!chart) throw new Error("Chart not initialized: window.chartvs");

  const url = `https://ubik.wiki/api/stubhub-data/?stubhub_id__iexact=${encodeURIComponent(stubhubid)}&limit=1000`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(`StubHub fetch failed: ${res.status}`);

  const json = await res.json();
  const results = Array.isArray(json?.results)
    ? json.results
    : (Array.isArray(json) ? json : []);

  const sh = computeShSeries(results);
  const newIndex = mergeLabelsAndReindexAllDatasets(chart, sh.labelTs);

  setDatasetValuesByLabel(chart, 'SH Totals',    sh.totalsByLabel, newIndex);
  setDatasetValuesByLabel(chart, 'SH Min Price', sh.minByLabel,    newIndex);

  chart.update();
}

function normalizeDate(date) {
    // Handle "MM/DD/YYYY" and "MM/DD/YYYY, HH:MM:SS AM/PM" formats from counts
    const mdyMatch = String(date).match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?)?/i
    );
    if (mdyMatch) {
        const [, mm, dd, yyyy, hh, min, ap] = mdyMatch;
        let hours = hh ? parseInt(hh) : 0;
        const mins = min ? min : '00';
        if (ap) {
            if (/pm/i.test(ap) && hours < 12) hours += 12;
            if (/am/i.test(ap) && hours === 12) hours = 0;
        }
        return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')} ${String(hours).padStart(2,'0')}:${mins}`;
    }
    // Fallback: ISO or other formats
    const d = new Date(date);
    if (isNaN(d)) return String(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// takes the primary-events record resolved from the sale's primary_event_url
async function updateChartWithPrimaryAndPreferred(primary) {
    let amountsPrimary = [];
    let datesPrimary = [];
    let combinedDates = new Set();
    let preferredData = [];
    let venueid = primary.site_venue_id;

    // Fetch fresh counts from primary-events
    let counts = [];
    try {
        const freshRes = await fetch(
            `https://ubik.wiki/api/primary-events/?site_event_id__iexact=${encodeURIComponent(primary.site_event_id)}&limit=1&format=json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const freshJson = await freshRes.json();
        counts = freshJson.results?.[0]?.counts || [];
    } catch (err) {
        console.error('Failed to fetch fresh primary counts:', err);
        displayLoadingFailed();
        return;
    }

    const detailstwo = (typeof getSourceDetails === 'function')
        ? getSourceDetails(primary.event_url || '')
        : { source: 'primary' };

    // Reset the chart for primary and preferred datasets
    chart.data.datasets[0].label = `${detailstwo.source.toUpperCase()} Primary`;
    chart.data.datasets.splice(1, 3); // Remove old preferred datasets
    chart.update();

    // Populate primary amounts and dates
    counts.sort((a, b) => {
        const da = normalizeDate(a.scrape_date + (a.scrape_time ? ', ' + a.scrape_time : ''));
        const db = normalizeDate(b.scrape_date + (b.scrape_time ? ', ' + b.scrape_time : ''));
        return new Date(da) - new Date(db);
    });

    // Keep only latest scrape per calendar day
    const byDay = new Map();
    counts.forEach(count => {
        const fullDate = normalizeDate(count.scrape_date + (count.scrape_time ? ', ' + count.scrape_time : ''));
        const day = fullDate.slice(0, 10); // "YYYY-MM-DD"
        byDay.set(day, { ...count, _normalized: fullDate });
    });
    counts = Array.from(byDay.values());

    // Drop consecutive same-amount entries
    counts = counts.filter((count, i, arr) => {
        if (i === 0 || i === arr.length - 1) return true;
        return Number(count.primary_amount) !== Number(arr[i - 1].primary_amount);
    });

    counts.forEach(count => {
        amountsPrimary.push(Math.round(count.primary_amount));
        datesPrimary.push(count._normalized);
        combinedDates.add(count._normalized);
    });

    console.log("Primary data amounts:", amountsPrimary);
    console.log("Primary data dates:", datesPrimary);

    // Fetch preferred sections and counts
    window.abortControllers = window.abortControllers || [];
    const controller = new AbortController();
    abortControllers.push(controller);

    // Step 1: Fetch preferred sections
    var http = new XMLHttpRequest();
    var url = `https://ubik.wiki/api/venues/${venueid}/`;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader('Authorization', `Bearer ${token}`);

    http.onload = function() {
        let dataResponse = JSON.parse(this.response);
        let prefSections = {
            pref1: dataResponse.pref_section1,
            pref2: dataResponse.pref_section2,
            pref3: dataResponse.pref_section3
        };

        console.log("Preferred sections:", prefSections);

        // Step 2: Fetch counts for preferred sections
        fetch(`https://ubik.wiki/api/primary-counts/?tickets_by_sections__icontains={&event_id__icontains=${primary.site_event_id}&limit=1000&format=json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal
        })
        .then(response => response.json())
        .then(data => {
            console.log("Preferred counts data response:", data);

            // Process datasets for each preferred section
            const validPrefs = [prefSections.pref1, prefSections.pref2, prefSections.pref3].filter(pref => pref && pref !== 'null' && pref !== null);
            validPrefs.forEach((pref, index) => {
                let datewiseAggregation = {};

                data.results.forEach(result => {
                    let scrapeDate = normalizeDate(result.event.scrape_date);

                    if (!datewiseAggregation[scrapeDate]) {
                        datewiseAggregation[scrapeDate] = 0; // Initialize aggregation for this date
                    }

                    result.tickets_by_sections.forEach(section => {
                        // Use includes for flexible matching
                        if (section.section && section.section.toLowerCase().includes(pref.toLowerCase())) {
                            datewiseAggregation[scrapeDate] += Math.round(section.amount);
                            combinedDates.add(scrapeDate);
                            console.log(`Adding ${section.amount} from ${section.section} to ${scrapeDate} for preferred section "${pref}"`);
                        }
                    });
                });

                let prefAmounts = [];
                let prefDates = [];
                Object.keys(datewiseAggregation).forEach(date => {
                    prefDates.push(date);
                    prefAmounts.push(datewiseAggregation[date]);
                });

                preferredData.push({
                    label: pref,
                    amounts: prefAmounts,
                    dates: prefDates,
                    backgroundColor: `rgba(${75 + index * 40}, 179, 113, 1)`,
                    borderColor: `rgba(${75 + index * 40}, 170, 113, 1)`
                });
            });

            // Step 3: Combine and sort all dates
            combinedDates = Array.from(combinedDates).sort((a, b) => new Date(a) - new Date(b));

            // Step 4: Align primary data with combined dates
            let alignedPrimaryData = combinedDates.map(date => {
                let index = datesPrimary.indexOf(date);
                return index !== -1 ? amountsPrimary[index] : 0; // Use 0 if no match
            });

            // Step 5: Align preferred data with combined dates
            preferredData.forEach(prefDataset => {
                prefDataset.alignedAmounts = combinedDates.map(date => {
                    let index = prefDataset.dates.indexOf(date);
                    return index !== -1 ? prefDataset.amounts[index] : 0; // Use 0 if no match
                });
            });

            // Step 6: Update the chart with combined data
            chart.config.data.labels = combinedDates;
            chart.data.datasets[0].data = alignedPrimaryData;

            preferredData.forEach(prefDataset => {
                chart.data.datasets.push({
                    data: prefDataset.alignedAmounts,
                    label: prefDataset.label,
                    backgroundColor: prefDataset.backgroundColor,
                    borderColor: prefDataset.borderColor,
                    borderWidth: 1
                });
            });

            chart.update();
            console.log("Chart updated with primary and preferred data");

            document.querySelector('#tmloader').style.display = 'none';
            document.querySelector('#tmerror').style.display = 'none';
            document.querySelector('#tmchart').style.display = 'flex';
        })
        .catch(error => {
            console.error('There was an error with the fetch request for preferred counts.', error);
            displayLoadingFailed();
        });
    };

    http.onerror = function() {
        console.error('There was an error with the XMLHttpRequest for preferred sections.');
        displayLoadingFailed();
    };

    http.send();
}

function displayLoadingFailed() {
    document.querySelector('#tmloader').style.display = 'none';
    document.querySelector('#tmerror').style.display = 'flex';
    document.querySelector('#tmchart').style.display = 'none';
}

function fetchTicketmasterData(tmEventId) {
    chart.update();
    window.abortControllers = window.abortControllers || [];
    const controller = new AbortController();
    abortControllers.push(controller);

    var http = new XMLHttpRequest();
    var url = `https://shibuy.co:8443/142data?eventid=${tmEventId}`;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");

    http.onload = function() {
        let data;
        try {
            data = JSON.parse(this.response);
        } catch (e) {
            console.error('Bad JSON from TM endpoint:', this.response);
            displayLoadingFailed();
            return;
        }
        if (Array.isArray(data) && data.length > 0) {
            processTicketmasterData(data);
        } else {
            console.log("No data received from Ticketmaster.");
            displayLoadingFailed();
        }
    };

    http.onerror = function() {
        console.error('There was an error with the XMLHttpRequest.');
        displayLoadingFailed();
    };

    http.send();
}

function processTicketmasterData(data) {
    let dates = [];
    let amounts = [];

    let preferredDates1 = [];
    let preferredAmounts1 = [];

    let preferredDates2 = [];
    let preferredAmounts2 = [];

    let preferredDates3 = [];
    let preferredAmounts3 = [];

    let prefSections = {};

    if (data[0].venue && Array.isArray(data[0].venue.preferred_sections)) {
        for (let i = 0; i < data[0].venue.preferred_sections.length; i++) {
            if (data[0].venue.preferred_sections[i] && data[0].venue.preferred_sections[i].name) {
                prefSections[`pref${i + 1}`] = data[0].venue.preferred_sections[i].name;
            }
        }
    }

    console.log(prefSections);

    chart.data.datasets.splice(1, 3);
    chart.update();

    data.forEach(event => {
        event.summaries.forEach((summary, index) => {

            if (!summary.sections || summary.sections.length === 0) {
                console.log("No sections available for this summary:", summary.scrape_date);
                return;
            }

            // Filter out resale sections
            const filteredSections = summary.sections.filter(section => section.type !== 'resale');
            const totalAmount = filteredSections.reduce((accumulator, section) => accumulator + section.amount, 0);

            if (totalAmount > 0) {
                // Format the scrape_date string to "YYYY-MM-DD HH:MM"
                const scrapeDateStr = summary.scrape_date;
                const formattedDate = scrapeDateStr.slice(0, 16).replace("T", " ");
                console.log("Formatted Date:", formattedDate);

                dates.push(formattedDate);
                amounts.push(totalAmount);

                // Process for preferred section 1 (matching all "GA" sections)
                if (prefSections.pref1 && prefSections.pref1 !== "null") {
                    const matchingSections1 = filteredSections.filter(section => section.section.includes(prefSections.pref1));
                    if (matchingSections1.length > 0) {
                        const prefAmount1 = matchingSections1.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates1.push(formattedDate);
                        preferredAmounts1.push(prefAmount1);
                    }
                }

                // Process for preferred section 2
                if (prefSections.pref2 && prefSections.pref2 !== "null") {
                    const matchingSections2 = filteredSections.filter(section => section.section.includes(prefSections.pref2));
                    if (matchingSections2.length > 0) {
                        const prefAmount2 = matchingSections2.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates2.push(formattedDate);
                        preferredAmounts2.push(prefAmount2);
                    }
                }

                // Process for preferred section 3
                if (prefSections.pref3 && prefSections.pref3 !== "null") {
                    const matchingSections3 = filteredSections.filter(section => section.section.includes(prefSections.pref3));
                    if (matchingSections3.length > 0) {
                        const prefAmount3 = matchingSections3.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates3.push(formattedDate);
                        preferredAmounts3.push(prefAmount3);
                    }
                }
            } else {
                console.log("No valid sections found for this summary.");
            }
        });
    });

    // Sort the collected data
    const sortData = (amounts, dates) => {
        const indices = Array.from({ length: dates.length }, (_, i) => i);
        indices.sort((a, b) => new Date(dates[a]) - new Date(dates[b]));
        return {
            sortedAmounts: indices.map(i => amounts[i]),
            sortedDates: indices.map(i => dates[i])
        };
    };

    const sortedPrimaryData = sortData(amounts, dates);
    const sortedData1 = sortData(preferredAmounts1, preferredDates1);
    const sortedData2 = sortData(preferredAmounts2, preferredDates2);
    const sortedData3 = sortData(preferredAmounts3, preferredDates3);

    // Ensure primary dataset is always present
    chart.data.datasets = [{
        data: sortedPrimaryData.sortedAmounts,
        label: "TICKETMASTER Primary",
        backgroundColor: 'rgba(0, 102, 51, 1)',
        borderColor: 'rgba(0, 102, 51, 1)',
        borderWidth: 1
    }];
    chart.config.data.labels = sortedPrimaryData.sortedDates;

    // Add other datasets conditionally, only if prefSections are not empty or "null"
    if (prefSections.pref1 && prefSections.pref1 !== "null" && sortedData1.sortedAmounts.length > 0) {
        chart.data.datasets.push({
            data: sortedData1.sortedAmounts,
            label: `${prefSections.pref1}`,
            backgroundColor: 'rgba(52, 152, 219, 1)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        });
    }

    if (prefSections.pref2 && prefSections.pref2 !== "null" && sortedData2.sortedAmounts.length > 0) {
        chart.data.datasets.push({
            data: sortedData2.sortedAmounts,
            label: `${prefSections.pref2}`,
            backgroundColor: 'rgba(46, 204, 113, 1)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1
        });
    }

    if (prefSections.pref3 && prefSections.pref3 !== "null" && sortedData3.sortedAmounts.length > 0) {
        chart.data.datasets.push({
            data: sortedData3.sortedAmounts,
            label: `${prefSections.pref3}`,
            backgroundColor: 'rgba(241, 196, 15, 1)',
            borderColor: 'rgba(241, 196, 15, 1)',
            borderWidth: 1
        });
    }

    console.log("Final datasets for the chart:", chart.data.datasets);

    // Update the chart
    chart.update();

    document.querySelector("#tmchart").style.display = "flex";
    document.querySelector("#tmloader").style.display = "none";
    document.querySelector("#tmerror").style.display = "none";
}
