(function () {
    // Provided by other scripts on the page: token, chart, window.chartvs, $, moment.
    // initsource / TOKEN / nexturl / prevurl / pcount / xanoUrl / savedevents / keyword6
    // are assigned without a declaration on purpose so other scripts can keep reading them.
    initsource = false;

    const API = 'https://ubik.wiki/api';
    const SEARCH_BASE_URL = `${API}/event-venue/?`;
    const PAGE_LIMIT = 100;
    const PENDING_BATCH_SIZE = 50;

    const DEFAULT_SOURCE_DETAILS = {
        source: 'OTHER',
        event_prefix: 'other',
        venue_prefix: 'other',
        url: ''
    };

    const TM_PREF_COLORS = {
        pref1: 'rgba(52, 152, 219, 1)',
        pref2: 'rgba(46, 204, 113, 1)',
        pref3: 'rgba(241, 196, 15, 1)'
    };

    // Same array object for the page's lifetime so external references stay valid
    const abortControllers = [];
    let sourceInstructionsMap = new Map();
    let sourceTokens = [];
    let searchController = null;
    let pendingController = null;
    let chartController = null;

    // ============================================================
    // Generic helpers
    // ============================================================

    function hasToken() {
        return typeof token === 'string' && token.length === 40;
    }

    function authHeaders() {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        };
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitFor(predicate, intervalMs) {
        return new Promise(resolve => {
            if (predicate()) return resolve();
            const id = setInterval(() => {
                if (predicate()) {
                    clearInterval(id);
                    resolve();
                }
            }, intervalMs || 300);
        });
    }

    function isAbort(err) {
        return !!err && err.name === 'AbortError';
    }

    function newController() {
        const controller = new AbortController();
        abortControllers.push(controller);
        return controller;
    }

    function dropController(controller) {
        if (!controller) return;
        try {
            controller.abort();
        } catch (e) {
            // ignore
        }
        const i = abortControllers.indexOf(controller);
        if (i !== -1) abortControllers.splice(i, 1);
    }

    function abortAll() {
        abortControllers.splice(0).forEach(controller => {
            try {
                controller.abort();
            } catch (e) {
                // ignore
            }
        });
    }

    async function fetchJSON(url, options) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status} for ${url}`);
        }
        return response.json();
    }

    // Follows DRF pagination. `next` is forced to https so a proxy that reports
    // http:// doesn't get blocked as mixed content.
    async function fetchAllPages(url, options) {
        const results = [];
        let nextUrl = url;
        while (nextUrl) {
            const json = await fetchJSON(nextUrl, options);
            if (Array.isArray(json)) {
                results.push(...json);
                break;
            }
            results.push(...(json.results || []));
            nextUrl = json.next ? String(json.next).replace(/^http:\/\//i, 'https://') : null;
        }
        return results;
    }

    function parseLooseJSON(value) {
        let current = value;
        for (let i = 0; i < 2 && typeof current === 'string'; i++) {
            const trimmed = current.trim();
            if (!trimmed) return null;
            try {
                current = JSON.parse(trimmed);
            } catch (e) {
                return null;
            }
        }
        return current;
    }

    function toBool(value) {
        return value === true || String(value).toLowerCase() === 'true';
    }

    function hasValue(value) {
        return value !== null && value !== undefined && String(value).length > 0;
    }

    function setText(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.textContent = value == null ? '' : String(value);
    }

    function setTextEl(el, value) {
        if (el) el.textContent = value == null ? '' : String(value);
    }

    function setAttr(el, name, value) {
        el.setAttribute(name, value == null ? '' : value);
    }

    function setDisplay(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.style.display = value;
    }

    function showIf(el, condition) {
        if (el) el.style.display = condition ? 'flex' : 'none';
    }

    function truncate(text, max) {
        const str = text == null ? '' : String(text);
        return str.length > max ? str.slice(0, max) + '...' : str;
    }

    function copyToClipboard(text) {
        const legacyCopy = () => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
            } catch (e) {
                console.error('Copy failed:', e);
            }
            ta.remove();
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(legacyCopy);
        } else {
            legacyCopy();
        }
    }

    // Preferred-section match that requires the preference to start at a word boundary,
    // so "GA" matches "GA", "GA Floor", "GA1" but not "STAGE" or "Vegas".
    function sectionMatches(sectionName, pref) {
        if (!sectionName || !pref) return false;
        const s = String(sectionName).toLowerCase();
        const p = String(pref).toLowerCase().trim();
        if (!p) return false;

        const isLetter = c => /[a-z]/.test(c);
        const isDigit = c => /[0-9]/.test(c);
        const first = p[0];

        let idx = s.indexOf(p);
        while (idx !== -1) {
            const prev = idx > 0 ? s[idx - 1] : '';
            const atBoundary =
                !prev ||
                (!isLetter(prev) && !isDigit(prev)) ||
                (isLetter(first) && isDigit(prev)) ||
                (isDigit(first) && isLetter(prev));
            if (atBoundary) return true;
            idx = s.indexOf(p, idx + 1);
        }
        return false;
    }

    // ============================================================
    // Date helpers
    // ============================================================

    // Helper: format Date -> "MM/DD/YYYY"
    function formatDate(date) {
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }

    // Helper: convert "YYYY-MM-DD" -> "MM/DD/YYYY" (timezone-safe)
    function ymdToMdy(ymd) {
        const [y, m, d] = String(ymd).split('-');
        return `${m}/${d}/${y}`;
    }

    function getDayOfWeek(dateString) {
        const [month, day, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        return daysOfWeek[date.getDay()] || '';
    }

    // Returns "YYYY-MM-DD HH:MM" or null. Wall-clock formats (MDY or ISO without a
    // timezone) are kept as written; anything with a timezone is converted to local time.
    // The output sorts correctly as a plain string, which avoids Safari's Date parsing gaps.
    function normalizeDate(date) {
        if (date == null || date === '') return null;
        const s = String(date).trim();

        const build = (yyyy, mm, dd, hh, min, ap) => {
            let hours = hh ? parseInt(hh, 10) : 0;
            if (ap) {
                if (/pm/i.test(ap) && hours < 12) hours += 12;
                if (/am/i.test(ap) && hours === 12) hours = 0;
            }
            return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')} ` +
                `${String(hours).padStart(2, '0')}:${min ? String(min).padStart(2, '0') : '00'}`;
        };

        let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?)?/i);
        if (m) return build(m[3], m[1], m[2], m[4], m[5], m[6]);

        m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T,\s]+(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\s*(AM|PM)?)?$/i);
        if (m) return build(m[1], m[2], m[3], m[4], m[5], m[6]);

        const d = new Date(s);
        if (isNaN(d.getTime())) return null;
        return build(d.getFullYear(), d.getMonth() + 1, d.getDate(), String(d.getHours()), String(d.getMinutes()), null);
    }

    function countKey(count) {
        if (!count || !count.scrape_date) return null;
        return normalizeDate(count.scrape_time ? `${count.scrape_date}, ${count.scrape_time}` : count.scrape_date);
    }

    // Provided diff-per-day calculator (sorts a copy so the caller's array is untouched)
    const calculateChange = (counts) => {
        if (!Array.isArray(counts) || counts.length === 0) {
            return { scrapeDate: '0000-00-00', lastAmount: '0.00', differencePerDay: '0.00' };
        }
        const sorted = counts.slice().sort((a, b) => new Date(a.scrape_date) - new Date(b.scrape_date));
        const latest = sorted[sorted.length - 1];
        const secondLatest = sorted.length > 1 ? sorted[sorted.length - 2] : null;
        const lastAmount = parseFloat(latest.primary_amount || 0).toFixed(2);
        const scrapeDate = formatDate(new Date(latest.scrape_date));
        if (!secondLatest || !secondLatest.primary_amount) {
            return { scrapeDate, lastAmount, differencePerDay: '0.00' };
        }
        const latestAmount = parseFloat(latest.primary_amount) || 0;
        const secondLatestAmount = parseFloat(secondLatest.primary_amount) || 0;
        const valueDifference = secondLatestAmount - latestAmount;
        const timeDifferenceMinutes = (new Date(latest.scrape_date) - new Date(secondLatest.scrape_date)) / 60000;
        let differencePerDay = '0.00';
        if (timeDifferenceMinutes > 0) {
            differencePerDay = ((valueDifference / timeDifferenceMinutes) * 1440).toFixed(2);
        }
        return { scrapeDate, lastAmount, differencePerDay };
    };

    function getLatestCount(counts) {
        if (!Array.isArray(counts) || counts.length === 0) return 0;
        let latest = null;
        let latestKey = '';
        counts.forEach(count => {
            const key = countKey(count) || '';
            if (latest === null || key > latestKey) {
                latest = count;
                latestKey = key;
            }
        });
        return latest ? latest.primary_amount : 0;
    }

    // ============================================================
    // Chart helpers — copied from tevochartpricing.js
    // Dependencies: window.chartvs, token (already on this page)
    // ============================================================

    function parseUSDateTime(s) {
        if (!s) return null;
        // eg "8/18/2025, 3:07:11 AM"
        const m = String(s).match(
            /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)\s*$/i
        );
        if (!m) {
            const dt = new Date(s);
            if (isNaN(dt)) return null;
            return {
                ts: dt.getTime(),
                label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
            };
        }
        let [, mm, dd, yyyy, hh, min, ss, ap] = m;
        mm = +mm; dd = +dd; yyyy = +yyyy; hh = +hh; min = +min; ss = +ss;
        if (/pm/i.test(ap) && hh < 12) hh += 12;
        if (/am/i.test(ap) && hh === 12) hh = 0;
        const dt = new Date(yyyy, mm - 1, dd, hh, min, ss);
        if (isNaN(dt)) return null;
        return {
            ts: dt.getTime(),
            label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
        };
    }

    function getParseDateFn() {
        return (typeof parseStubhubScrapeDate === 'function')
            ? parseStubhubScrapeDate
            : parseUSDateTime;
    }

    function getOrInitLabelTs(chart) {
        if (!chart.$labelTs) chart.$labelTs = new Map(); // label -> ts
        return chart.$labelTs;
    }

    function mergeLabelsAndReindexAllDatasets(chart, incomingLabelTs) {
        const labelTs = getOrInitLabelTs(chart);

        const oldLabels = Array.isArray(chart.data.labels) ? chart.data.labels.map(String) : [];
        const oldIndex = new Map(oldLabels.map((l, i) => [l, i]));

        for (const l of oldLabels) {
            if (!labelTs.has(l)) labelTs.set(l, Number.NaN);
        }

        for (const [label, ts] of incomingLabelTs.entries()) {
            if (!label || !Number.isFinite(ts)) continue;
            labelTs.set(label, ts);
        }

        const merged = new Set(oldLabels);
        for (const label of incomingLabelTs.keys()) merged.add(label);

        const newLabels = Array.from(merged);
        newLabels.sort((a, b) => {
            const ta = labelTs.get(a);
            const tb = labelTs.get(b);
            const fa = Number.isFinite(ta);
            const fb = Number.isFinite(tb);
            if (fa && fb) return ta - tb;
            if (fa && !fb) return -1;
            if (!fa && fb) return 1;
            return 0;
        });

        chart.data.labels = newLabels;
        const newIndex = new Map(newLabels.map((l, i) => [l, i]));

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

    function setDatasetValuesByLabel(chart, datasetLabel, valueByLabelMap, newIndex) {
        const ds = chart.data.datasets.find(d => d.label === datasetLabel);
        if (!ds) return;
        for (const [label, value] of valueByLabelMap.entries()) {
            const idx = newIndex.get(label);
            if (idx == null) continue;
            ds.data[idx] = value;
        }
    }

    // Clears the StubHub/TEVO chart so the next event doesn't inherit the previous one's points
    function resetVsChart() {
        const vs = window.chartvs;
        if (!vs) return;
        vs.data.labels = [];
        vs.data.datasets.forEach(ds => {
            ds.data = [];
        });
        vs.$labelTs = new Map();
        vs.update();
    }

    function computeTevoSeries(results) {
        const parseDate = getParseDateFn();
        const points = [];

        for (const r of (Array.isArray(results) ? results : [])) {
            const parsed = parseDate(r?.scrape_date);
            if (!parsed?.label || !Number.isFinite(parsed.ts)) continue;

            const raw = parseLooseJSON(r?.tickets_by_sections) ?? r?.tickets_by_sections;
            const sections = Array.isArray(raw)
                ? raw
                : (raw && typeof raw === 'object' && raw.id) ? [raw] : [];

            let minPrice = null;
            for (const s of sections) {
                const price = Number(s?.price);
                if (Number.isFinite(price)) minPrice = (minPrice === null) ? price : Math.min(minPrice, price);
            }

            points.push({ ts: parsed.ts, label: parsed.label, total: Number(r?.total_amount ?? 0), minPrice });
        }

        // Oldest first, so the latest scrape of each day wins regardless of API order
        points.sort((a, b) => a.ts - b.ts);

        const labelTs = new Map();
        const totalsByLabel = new Map();
        const minByLabel = new Map();
        for (const p of points) {
            labelTs.set(p.label, p.ts);
            totalsByLabel.set(p.label, p.total);
            if (p.minPrice !== null) minByLabel.set(p.label, p.minPrice);
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
            const lp = parsePrice(item.price);
            return (amt != null || lp != null) ? [{ amount: amt ?? 0, price: lp ?? null }] : [];
        };

        for (const item of (Array.isArray(results) ? results : [])) {
            if (!item) continue;
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
        return {
            labelTs: new Map(series.map(p => [p.label, p.ts])),
            totalsByLabel: new Map(series.map(p => [p.label, p.total ?? 0])),
            minByLabel: new Map(series.map(p => [p.label, p.min2 ?? null]))
        };
    }

    async function tevochartdata(tevoid, signal) {
        const vs = window.chartvs;
        if (!vs) throw new Error('Chart not initialized: window.chartvs');

        const results = await fetchAllPages(
            `${API}/tevo-data/?event_id__iexact=${encodeURIComponent(tevoid)}&limit=1000`,
            { headers: authHeaders(), signal }
        );
        if (signal && signal.aborted) return;

        const tevo = computeTevoSeries(results);
        const newIndex = mergeLabelsAndReindexAllDatasets(vs, tevo.labelTs);
        setDatasetValuesByLabel(vs, 'TEVO Totals', tevo.totalsByLabel, newIndex);
        setDatasetValuesByLabel(vs, 'TEVO Min Price', tevo.minByLabel, newIndex);
        vs.update();
    }

    async function stubhubchartdata(stubhubid, signal) {
        const vs = window.chartvs;
        if (!vs) throw new Error('Chart not initialized: window.chartvs');

        const results = await fetchAllPages(
            `${API}/stubhub-data/?stubhub_id__iexact=${encodeURIComponent(stubhubid)}&limit=1000`,
            { headers: authHeaders(), signal }
        );
        if (signal && signal.aborted) return;

        const sh = computeShSeries(results);
        const newIndex = mergeLabelsAndReindexAllDatasets(vs, sh.labelTs);
        setDatasetValuesByLabel(vs, 'SH Totals', sh.totalsByLabel, newIndex);
        setDatasetValuesByLabel(vs, 'SH Min Price', sh.minByLabel, newIndex);
        vs.update();
    }

    // ============================================================
    // Source instructions
    // ============================================================

    async function initializeSourceInstructions() {
        try {
            const results = await fetchAllPages(`${API}/source-instructions/?limit=100`, {
                headers: authHeaders()
            });

            const map = new Map();
            results.forEach(record => {
                if (!record.contains) return;
                record.contains
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean)
                    .forEach(t => {
                        map.set(t, {
                            source: record.source,
                            event_prefix: record.event_prefix,
                            venue_prefix: record.venue_prefix
                        });
                    });
            });

            sourceInstructionsMap = map;
            // Longest token first so "ticketmaster.com.mx" wins over "ticketmaster"
            sourceTokens = Array.from(map.entries()).sort((a, b) => b[0].length - a[0].length);

            console.log(`Loaded ${results.length} source instructions.`);
            return true;
        } catch (error) {
            console.error('Error fetching source instructions:', error);
            return false;
        }
    }

    function getSourceDetails(url) {
        if (!url || typeof url !== 'string') {
            return { ...DEFAULT_SOURCE_DETAILS, url: url || '' };
        }
        for (const [tokenStr, details] of sourceTokens) {
            if (url.includes(tokenStr)) {
                return { ...details, url };
            }
        }
        return { ...DEFAULT_SOURCE_DETAILS, url };
    }

    // Updates source labels on cards rendered before the instructions finished loading
    function relabelSources() {
        document.querySelectorAll('.event-box').forEach(card => {
            if (card.id === 'samplestyle') return;
            const details = getSourceDetails(card.getAttribute('url'));
            card.setAttribute('source', details.source);
            setTextEl(card.querySelector('.main-textsource'), details.source);
        });
    }

    async function bootSources() {
        await waitFor(hasToken, 1000);
        TOKEN = token;

        const ok = await initializeSourceInstructions();
        // Don't block other scripts waiting on initsource if the first attempt fails
        initsource = true;

        if (!ok) {
            while (!(await initializeSourceInstructions())) {
                await sleep(5000);
            }
            relabelSources();
        }
    }

    // ============================================================
    // TM / primary chart
    // ============================================================

    function displayLoadingFailed() {
        setDisplay('#tmloader', 'none');
        setDisplay('#tmerror', 'flex');
        setDisplay('#tmchart', 'none');
    }

    async function updateChartWithPrimaryAndPreferred(events, signal) {
        const siteEventId = events.site_event_id || '';
        const venueid = events.site_venue_id;

        // Fresh counts from primary-events
        let counts;
        try {
            const fresh = await fetchJSON(
                `${API}/primary-events/?site_event_id__iexact=${encodeURIComponent(siteEventId)}&limit=1&format=json`,
                { headers: authHeaders(), signal }
            );
            counts = parseLooseJSON(fresh.results?.[0]?.counts) ?? fresh.results?.[0]?.counts;
        } catch (error) {
            if (isAbort(error)) return;
            console.error('Failed to fetch fresh primary counts:', error);
            displayLoadingFailed();
            return;
        }
        if (signal && signal.aborted) return;
        if (!Array.isArray(counts)) counts = [];

        const details = getSourceDetails(events.event_url);
        chart.data.datasets[0].label = `${details.source.toUpperCase()} Primary`;
        chart.data.datasets.splice(1);
        chart.update();

        // Keep only the latest scrape per calendar day
        const byDay = new Map();
        counts
            .map(count => ({ count, key: countKey(count) }))
            .filter(x => x.count && x.key)
            .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
            .forEach(x => byDay.set(x.key.slice(0, 10), x));

        // Drop consecutive same-amount entries (always keep first and last)
        const daily = Array.from(byDay.values()).filter((x, i, arr) => {
            if (i === 0 || i === arr.length - 1) return true;
            return Number(x.count.primary_amount) !== Number(arr[i - 1].count.primary_amount);
        });

        const primaryByDate = new Map();
        daily.forEach(x => primaryByDate.set(x.key, Math.round(Number(x.count.primary_amount) || 0)));
        const combinedDates = new Set(primaryByDate.keys());

        const preferredData = [];

        if (venueid) {
            try {
                const venue = await fetchJSON(`${API}/venues/${encodeURIComponent(venueid)}/`, {
                    headers: authHeaders(),
                    signal
                });

                const validPrefs = [venue.pref_section1, venue.pref_section2, venue.pref_section3]
                    .filter(pref => pref && pref !== 'null');

                if (validPrefs.length > 0) {
                    const data = await fetchJSON(
                        `${API}/primary-counts/?tickets_by_sections__icontains=%7B&event_id__icontains=${encodeURIComponent(siteEventId)}&limit=1000&format=json`,
                        { headers: authHeaders(), signal }
                    );
                    const results = data.results || [];

                    validPrefs.forEach((pref, index) => {
                        const byDate = {};

                        results.forEach(result => {
                            const date = normalizeDate(result && result.event && result.event.scrape_date);
                            if (!date) return;
                            if (!(date in byDate)) byDate[date] = 0;

                            const sections = parseLooseJSON(result.tickets_by_sections) ?? result.tickets_by_sections;
                            if (!Array.isArray(sections)) return;

                            sections.forEach(section => {
                                if (section && sectionMatches(section.section, pref)) {
                                    byDate[date] += Math.round(Number(section.amount) || 0);
                                    combinedDates.add(date);
                                }
                            });
                        });

                        preferredData.push({
                            label: pref,
                            byDate,
                            backgroundColor: `rgba(${75 + index * 40}, 179, 113, 1)`,
                            borderColor: `rgba(${75 + index * 40}, 170, 113, 1)`
                        });
                    });
                }
            } catch (error) {
                if (isAbort(error)) return;
                console.error('Preferred section data failed, showing primary only:', error);
            }
        }

        if (signal && signal.aborted) return;

        const labels = Array.from(combinedDates).sort();
        if (labels.length === 0) {
            displayLoadingFailed();
            return;
        }

        // Primary is one point per day while preferred has every scrape, so missing
        // points are null (a gap the line spans) instead of a fake drop to 0
        chart.data.labels = labels;
        chart.data.datasets[0].data = labels.map(d => (primaryByDate.has(d) ? primaryByDate.get(d) : null));
        chart.data.datasets[0].spanGaps = true;

        preferredData.forEach(pref => {
            chart.data.datasets.push({
                data: labels.map(d => (d in pref.byDate ? pref.byDate[d] : null)),
                label: pref.label,
                backgroundColor: pref.backgroundColor,
                borderColor: pref.borderColor,
                borderWidth: 1,
                spanGaps: true
            });
        });

        chart.update();

        setDisplay('#tmloader', 'none');
        setDisplay('#tmerror', 'none');
        setDisplay('#tmchart', 'flex');
    }

    async function fetchTicketmasterData(eventid, signal) {
        chart.update();
        try {
            const data = await fetchJSON(`https://shibuy.co:8443/142data?eventid=${encodeURIComponent(eventid)}`, {
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                signal
            });
            if (signal && signal.aborted) return;

            if (Array.isArray(data) && data.length > 0) {
                processTicketmasterData(data);
            } else {
                console.log('No data received from Ticketmaster.');
                displayLoadingFailed();
            }
        } catch (error) {
            if (isAbort(error)) return;
            console.error('Ticketmaster data request failed:', error);
            displayLoadingFailed();
        }
    }

    function processTicketmasterData(data) {
        const prefSections = {};
        const venue = data[0] && data[0].venue;
        if (venue && Array.isArray(venue.preferred_sections)) {
            venue.preferred_sections.forEach((section, i) => {
                if (section && section.name) prefSections[`pref${i + 1}`] = section.name;
            });
        }

        const activePrefs = Object.keys(TM_PREF_COLORS).filter(k => prefSections[k] && prefSections[k] !== 'null');

        chart.data.datasets.splice(1);
        chart.update();

        // One row per scrape so every preferred series has exactly one value per label
        const rows = [];
        data.forEach(event => {
            const summaries = event && Array.isArray(event.summaries) ? event.summaries : [];
            summaries.forEach(summary => {
                if (!summary || !Array.isArray(summary.sections) || summary.sections.length === 0 || !summary.scrape_date) {
                    return;
                }

                const primarySections = summary.sections.filter(section => section && section.type !== 'resale');
                const total = primarySections.reduce((acc, section) => acc + (Number(section.amount) || 0), 0);
                if (total <= 0) return;

                const row = {
                    date: String(summary.scrape_date).slice(0, 16).replace('T', ' '),
                    total,
                    prefs: {}
                };

                activePrefs.forEach(key => {
                    row.prefs[key] = primarySections
                        .filter(section => sectionMatches(section.section, prefSections[key]))
                        .reduce((acc, section) => acc + (Number(section.amount) || 0), 0);
                });

                rows.push(row);
            });
        });

        rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

        if (rows.length === 0) {
            console.log('No primary ticket data for this event.');
            displayLoadingFailed();
            return;
        }

        chart.data.labels = rows.map(r => r.date);
        chart.data.datasets = [{
            data: rows.map(r => r.total),
            label: 'TICKETMASTER Primary',
            backgroundColor: 'rgba(0, 102, 51, 1)',
            borderColor: 'rgba(0, 102, 51, 1)',
            borderWidth: 1
        }];

        activePrefs.forEach(key => {
            const values = rows.map(r => r.prefs[key]);
            if (values.some(v => v > 0)) {
                chart.data.datasets.push({
                    data: values,
                    label: String(prefSections[key]),
                    backgroundColor: TM_PREF_COLORS[key],
                    borderColor: TM_PREF_COLORS[key],
                    borderWidth: 1
                });
            }
        });

        chart.update();

        setDisplay('#tmchart', 'flex');
        setDisplay('#tmloader', 'none');
        setDisplay('#tmerror', 'none');
    }

    // ============================================================
    // Chart overlay
    // ============================================================

    function openEventCharts(card, events, evid) {
        // Cancel the previous event's requests so they can't write into this chart
        dropController(chartController);
        chartController = newController();
        const signal = chartController.signal;

        const attr = name => card.getAttribute(name) || '';
        const url = events.event_url || '';

        setText('#chart-date', attr('date'));
        setText('#chart-event', attr('name'));
        setText('#chart-venue', attr('venue'));
        setText('#chart-location', [attr('city'), attr('state')].filter(Boolean).join(', '));
        setText('#chart-time', attr('time'));

        chart.data.datasets.splice(1);
        chart.data.datasets[0].label = '';
        chart.data.datasets[0].data = [];
        chart.data.labels = [];
        chart.update();

        setDisplay('#tmloader', 'flex');
        setDisplay('#tmerror', 'none');
        setDisplay('#tmchart', 'none');

        resetVsChart();

        if (events.stubhub_id || events.tevo_event_id) {
            setDisplay('#vschart', 'none');
            setDisplay('#vsloader', 'flex');
            setDisplay('#vserror', 'none');

            const tasks = [];
            if (events.stubhub_id) tasks.push(stubhubchartdata(events.stubhub_id, signal));
            if (events.tevo_event_id) tasks.push(tevochartdata(events.tevo_event_id, signal));

            Promise.allSettled(tasks).then(results => {
                if (signal.aborted) return;

                results.forEach((r, i) => {
                    if (r.status === 'rejected') console.error(`chart source ${i} failed:`, r.reason);
                });

                const anySucceeded = results.some(r => r.status === 'fulfilled');
                setDisplay('#vschart', anySucceeded ? 'flex' : 'none');
                setDisplay('#vsloader', 'none');
                setDisplay('#vserror', anySucceeded ? 'none' : 'flex');
            });
        } else {
            setDisplay('#vschart', 'none');
            setDisplay('#vsloader', 'none');
            setDisplay('#vserror', 'flex');
        }

        setDisplay('#graph-overlay', 'flex');
        setDisplay('#closecharts', 'flex');
        setDisplay('#eventicon', 'none');
        setDisplay('#tmurl', 'block');

        const tmurl = document.querySelector('#tmurl');

        if (url.includes('ticketmaster') || url.includes('livenation')) {
            if (tmurl) tmurl.href = 'http://142.93.115.105:8100/event/' + evid.substring(2) + '/details/';
            fetchTicketmasterData(evid.substring(2), signal);
        } else {
            if (tmurl) tmurl.href = url;
            updateChartWithPrimaryAndPreferred(events, signal);
        }
    }

    // ============================================================
    // Scraping and event updates
    // ============================================================

    async function updatePrimaryEvent(siteEventId, fields) {
        const response = await fetch(`${API}/update/primary-events/`, {
            method: 'PUT',
            headers: { ...authHeaders(), 'Accept': 'application/json' },
            body: JSON.stringify({ site_event_id: siteEventId, ...fields })
        });
        if (!response.ok) throw new Error(`Update failed with status ${response.status}`);
        return response.json().catch(() => ({}));
    }

    function updatedata(siteEventId) {
        const currentdate = new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');

        return updatePrimaryEvent(siteEventId, { status: 'sold out', previous_status: currentdate })
            .then(data => console.log('Marked sold out:', data))
            .catch(error => console.error('Error marking event sold out:', error));
    }

    async function scrapeurl(eventid, primrem, dpd) {
        try {
            const data = await fetchJSON('https://shibuy.co:8443/primaryurl?eventid=' + encodeURIComponent(eventid));
            setTextEl(primrem, typeof data.count === 'number' && data.count !== 0 ? data.count : 'unknown');
            if (typeof data.diffperday === 'number') setTextEl(dpd, parseInt(data.diffperday, 10));
            return data;
        } catch (error) {
            console.error('Error fetching primary url:', error);
            setTextEl(primrem, 'unknown');
            return null;
        }
    }

    // eventid: the id the scraper expects (no prefix)
    // siteEventId: the full site_event_id used when marking the event sold out
    async function scrapetm(eventid, siteEventId, primrem, dpd) {
        const raw = String(eventid);
        const scrapeId = raw.startsWith('tm') ? raw.substring(2) : raw;

        try {
            const response = await fetch('https://shibuy.co:8443/scrapeurl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ eventid: scrapeId })
            });
            const data = await response.json().catch(() => null);
            console.log('scrape response:', data);

            if (!response.ok || !data || JSON.stringify(data).includes('No amounts available')) {
                setTextEl(primrem, 'unavailable');
                return data;
            }

            scrapeurl(scrapeId, primrem, dpd);

            // Accept both { amounts: [...] } and [{ amounts: [...] }]
            const payload = Array.isArray(data) ? (data[0] || {}) : data;
            const amounts = Array.isArray(payload.amounts) ? payload.amounts : [];
            if (amounts.some(item => item.amount === undefined || item.amount < 50)) {
                updatedata(siteEventId || eventid);
            }
            return data;
        } catch (error) {
            console.error('Scrape failed:', error);
            setTextEl(primrem, 'unavailable');
            return null;
        }
    }

    async function scrapeAndUpdate(eventUrl, card) {
        if (!/\/(\d+)(?:[\/?#]|$)/.test(eventUrl)) {
            console.error('No numeric ID in URL:', eventUrl);
            return;
        }

        const scrapeRes = await fetch(`${API}/scrape/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                site_name: 'seetickets',
                event_url: eventUrl
            })
        });
        if (!scrapeRes.ok) throw new Error(`Scrape failed with status ${scrapeRes.status}`);

        const scraped = await scrapeRes.json();
        console.log('scrape response:', scraped);

        if (card) {
            const amount = parseFloat(scraped.primary_amount);
            if (Number.isFinite(amount)) card.setAttribute('primaryamount', amount);
            setTextEl(card.querySelector('.main-text-scrapedate'), scraped.scrape_date ?? '');
            setTextEl(card.querySelector('.main-text-scrapetime'), scraped.scrape_time ?? '');
            setTextEl(card.querySelector('.main-text-primary'), Number.isFinite(amount) ? amount.toFixed(2) : '');
        }

        return scraped;
    }

    function updatenomap(siteEventId) {
        return updatePrimaryEvent(siteEventId, { no_map: false })
            .then(data => {
                console.log('Success:', data);
                setDisplay('.warning-pricing', 'none');
                return data;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }

    // ============================================================
    // Pending amounts from the buying queue (batched)
    // ============================================================

    async function fetchEventVenueData() {
        dropController(pendingController);
        const controller = newController();
        pendingController = controller;
        const signal = controller.signal;

        const template = document.getElementById('samplestyle');
        const boxesByKey = new Map();

        document.querySelectorAll('.event-box').forEach(box => {
            if (box === template) return;
            const id = box.getAttribute('pendingid');
            if (!id) return;
            const key = id.toLowerCase();
            if (!boxesByKey.has(key)) boxesByKey.set(key, { id, boxes: [] });
            boxesByKey.get(key).boxes.push(box);
        });

        const ids = Array.from(boxesByKey.values()).map(entry => entry.id);
        const batches = [];
        for (let i = 0; i < ids.length; i += PENDING_BATCH_SIZE) {
            batches.push(ids.slice(i, i + PENDING_BATCH_SIZE));
        }

        const allResults = [];

        await Promise.all(batches.map(async batch => {
            const url = `${API}/buying-queue/?completed__iexact=false&limit=1000&event_id__filters=` +
                batch.map(id => encodeURIComponent(id)).join(',');
            try {
                const results = await fetchAllPages(url, { headers: authHeaders(), signal });
                if (signal.aborted) return;
                allResults.push(...results);

                // An event can have several open queue items, so remaining is summed across them
                const remainingByKey = new Map();
                results.forEach(result => {
                    if (!result || !result.event_id) return;
                    const key = String(result.event_id).toLowerCase();
                    const total = Number(result.purchase_total) || 0;
                    const bought = Number(result.purchased_amount) || 0;
                    remainingByKey.set(key, (remainingByKey.get(key) || 0) + (total - bought));
                });

                remainingByKey.forEach((remaining, key) => {
                    const entry = boxesByKey.get(key);
                    if (!entry) return;
                    entry.boxes.forEach(el => {
                        el.setAttribute('pending', remaining);
                        setTextEl(el.querySelector('.main-text-pending'), Math.round(remaining));
                    });
                });
            } catch (err) {
                if (isAbort(err)) return;
                console.error(`Failed to fetch buying queue batch [${batch.join(',')}]:`, err);
            }
        }));

        if (pendingController === controller) {
            dropController(controller);
            pendingController = null;
        }

        if (!signal.aborted) console.log('Pending amounts added to DOM elements');
        return allResults;
    }

    // ============================================================
    // Search
    // ============================================================

    function removeCards() {
        document.querySelectorAll('.event-box').forEach(box => {
            if (box.id !== 'samplestyle') box.remove();
        });
    }

    function updatePager(fetchurl, count) {
        let limit = PAGE_LIMIT;
        let offset = 0;
        try {
            const u = new URL(fetchurl);
            limit = parseInt(u.searchParams.get('limit'), 10) || PAGE_LIMIT;
            offset = parseInt(u.searchParams.get('offset'), 10) || 0;
        } catch (e) {
            // keep defaults
        }

        const maxPages = Math.max(1, Math.ceil((Number(count) || 0) / limit));
        const curPage = Math.min(maxPages, Math.floor(offset / limit) + 1);

        pcount = maxPages;
        setText('#maxpages', maxPages);
        setText('#curpage', curPage);
    }

    function constructURL(next) {
        setDisplay('#loading', 'flex');
        setDisplay('#flexbox', 'none');

        const val = id => {
            const el = document.getElementById(id);
            return el ? String(el.value) : '';
        };
        const trimmed = id => {
            const el = document.getElementById(id);
            if (!el) return '';
            el.value = el.value.trimEnd();
            return el.value;
        };
        const isChecked = id => {
            const el = document.getElementById(id);
            return !!(el && el.checked);
        };

        const keywords1 = encodeURIComponent(trimmed('searchbar1'));
        const keywords2 = encodeURIComponent(trimmed('searchbar2'));
        const keywords3 = val('countryselect');
        const keywords4 = val('categoryselect');
        const keywords5 = val('sourceselect');
        const keywords6 = val('sortby');
        const keywords7 = encodeURIComponent(val('searchbar3'));

        const capgte = val('capacity-greater');
        const caplt = val('capacity-lower');
        const primgte = val('primary-greater');
        const primlt = val('primary-lower');
        const capacityfilters = val('capacityfilter');

        removeCards();

        const params = [];

        if (keywords1.length > 0) params.push('event_name__icontains=' + keywords1);
        if (keywords2.length > 0) params.push('venue_name__icontains=' + keywords2);

        if (keywords3 === 'uscanada') params.push('country__icontains=US&country__icontains=Canada');
        if (keywords3 === 'international') params.push('country__idoesnotcontains=US&country__idoesnotcontains=Canada');

        if (keywords4) params.push('category__iexact=' + encodeURIComponent(keywords4));

        if (capacityfilters.length > 0) {
            params.push('event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster&amount_per_capacity__lte=' + encodeURIComponent(capacityfilters));
        }

        const sourceParams = {
            'ticketweb': 'event_url__icontains=ticketweb',
            'axs': 'event_url__icontains=axs',
            'seetickets': 'event_url__icontains=eventim.us&event_url__icontains=seetickets.us',
            'ticketmaster': 'event_url__icontains=ticketmaster&event_url__icontains=livenation',
            'ticketmaster-mexico': 'site_event_id__icontains=tm-mx',
            'seatgeek': 'event_url__icontains=seatgeek.com',
            'nontm': 'event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster',
            'nontmaxs': 'event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster&event_url__idoesnotcontains=axs',
            'nonseeticketstmaxsgeektweb': 'event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster&event_url__idoesnotcontains=axs&event_url__idoesnotcontains=seetickets&event_url__idoesnotcontains=eventim.us&event_url__idoesnotcontains=seatgeek&event_url__idoesnotcontains=ticketweb'
        };
        if (sourceParams[keywords5]) params.push(sourceParams[keywords5]);

        const sortParams = {
            'recentlyadded': 'date_created__sort=-1',
            'lowestamount': 'app_142_primary_amount__sort=1',
            'fastall': 'app_142_difference_per_day__sort=-1',
            'fast10': 'app_142_scrape_date__yte=10&app_142_difference_per_day__sort=-1',
            'fast3': 'app_142_scrape_date__yte=3&app_142_difference_per_day__sort=-1',
            'before10': 'app_142_scrape_date__ote=10&app_142_difference_per_day__sort=-1'
        };
        if (sortParams[keywords6]) params.push(sortParams[keywords6]);

        if (keywords6 === 'fastmovement' && keywords5 === 'seetickets') params.push('app_142_primary_amount__gt=0');

        if (keywords7.length > 0) params.push('status__icontains=' + keywords7);

        if (capgte.length > 0) params.push('venue_capacity__gte=' + encodeURIComponent(capgte));
        if (caplt.length > 0) params.push('venue_capacity__lt=' + encodeURIComponent(caplt));
        if (primgte.length > 0) params.push('app_142_primary_amount__gte=' + encodeURIComponent(primgte));
        if (primlt.length > 0) params.push('app_142_primary_amount__lt=' + encodeURIComponent(primlt));

        if (isChecked('favorite')) params.push('favorites__iexact=true');
        if (isChecked('hotlisted')) params.push('hotlist__iexact=true');
        if (isChecked('preonsales')) params.push('is_preonsale__iexact=true');

        params.push('limit=' + PAGE_LIMIT);

        if (next) {
            let offset = null;
            try {
                offset = new URL(next).searchParams.get('offset');
            } catch (e) {
                console.warn('Could not read offset from', next);
            }
            // DRF drops offset from the first page's "previous" link, which just means 0
            if (offset) params.push('offset=' + encodeURIComponent(offset));
        }

        xanoUrl = SEARCH_BASE_URL + params.join('&');
        console.log('Constructed URL:', xanoUrl);
        return getEvents(xanoUrl);
    }

    function renderSearchCard(events, template) {
        const card = template.cloneNode(true);
        const q = cls => card.querySelector('.' + cls);

        const siteEventId = events.site_event_id ? String(events.site_event_id) : '';
        const evid = encodeURIComponent(siteEventId);
        const url = events.event_url || '';
        const isTM = url.includes('ticketmaster') || url.includes('livenation');
        const counts = Array.isArray(events.counts) ? events.counts : [];

        card.removeAttribute('id');
        card.setAttribute('checked', 'false');
        setAttr(card, 'name', events.event_name);
        setAttr(card, 'url', url);
        setAttr(card, 'country', events.country);
        setAttr(card, 'city', events.city);
        setAttr(card, 'state', events.state);
        setAttr(card, 'pendingid', siteEventId);
        setAttr(card, 'capacity', events.venue_capacity);
        if (events.vivid_venue_id) card.setAttribute('vivid_venue_id', events.vivid_venue_id);
        if (events.tevo_venue_id) card.setAttribute('tevo_venue_id', events.tevo_venue_id);
        setAttr(card, 'eventid', evid.startsWith('tm') ? evid.substring(2) : evid);
        if (events.time) card.setAttribute('time', String(events.time).slice(0, 8));
        setAttr(card, 'venue', events.venue_name);
        setAttr(card, 'vivid_id', events.vdid);
        setAttr(card, 'timezone', events.timezone);

        // Remaining % of capacity (non-TM only)
        const available = q('main-text-available');
        if (available && events.venue_capacity && events.app_142_primary_amount && !siteEventId.toLowerCase().startsWith('tm')) {
            const cap = Number(events.venue_capacity);
            const prim = Number(events.app_142_primary_amount);
            if (cap > 0 && Number.isFinite(prim)) {
                available.textContent = ((prim / cap) * 100).toFixed(2) + '%';
                available.style.display = 'flex';
            }
        }

        // No-map warning
        const eventsnomap = q('main-text-nomap');
        if (eventsnomap) {
            eventsnomap.addEventListener('click', () => {
                setDisplay('.warning-pricing', 'flex');
                const btn = document.querySelector('#warningcontinue');
                if (btn) {
                    btn.dataset.siteEventId = siteEventId;
                    btn._nomapEl = eventsnomap;
                }
            });
            if (events.no_map === true) eventsnomap.style.display = 'flex';
        }

        // SeeTickets scrape
        const seetixBtn = q('scrape-seetix');
        if (seetixBtn && url.includes('eventim.us')) {
            seetixBtn.style.display = 'flex';
            seetixBtn.addEventListener('click', async e => {
                e.preventDefault();
                e.stopPropagation();
                if (seetixBtn.dataset.busy === '1') return;
                seetixBtn.dataset.busy = '1';
                try {
                    await scrapeAndUpdate(url, card);
                } catch (err) {
                    console.error('scrape-seetix click error:', err);
                } finally {
                    seetixBtn.dataset.busy = '0';
                }
            });
        }

        // Date
        if (events.date) {
            const ymd = String(events.date).slice(0, 10);
            const slashed = ymd.replace(/-/g, '/');
            const mdy = [slashed.slice(5), slashed.slice(0, 4)].join('/');
            card.setAttribute('date', slashed);
            card.setAttribute('vivid_ed', ymd);
            setTextEl(q('main-text-date'), mdy);
            setTextEl(q('main-text-weekday'), getDayOfWeek(mdy));
        }

        // Source
        const txtsource = q('main-textsource');
        const details = getSourceDetails(url);
        setTextEl(txtsource, details.source);
        card.setAttribute('source', details.source);
        if (isTM && txtsource) {
            txtsource.addEventListener('click', () => {
                window.open('http://142.93.115.105:8100/event/' + evid.substring(2) + '/details/', '142');
            });
            txtsource.classList.add('clickable');
        }

        // Venue tags
        const venuetags = q('main-text-tags');
        if (events.venue_tags && events.venue_tags.length > 0) {
            setTextEl(q('tag-text'), events.venue_tags);
        } else if (venuetags) {
            venuetags.remove();
        }

        // TEVO / StubHub
        if (hasValue(events.tevo_primary_amount)) {
            setTextEl(q('main-text-tevo-primary'), Number(events.tevo_primary_amount));
            card.setAttribute('tevoprimary', Number(events.tevo_primary_amount));
        } else {
            card.setAttribute('tevoprimary', -1);
        }

        if (hasValue(events.tevo_scrape_date)) setTextEl(q('main-text-tevo-scrape-date'), events.tevo_scrape_date);
        if (hasValue(events.stubhub_scrape_date)) setTextEl(q('main-text-shub-scrape-date'), events.stubhub_scrape_date);

        if (hasValue(events.stubhub_primary_amount)) {
            setTextEl(q('main-text-shub-primary'), Number(events.stubhub_primary_amount));
            card.setAttribute('shubprimary', Number(events.stubhub_primary_amount));
        } else {
            card.setAttribute('shubprimary', -1);
        }

        if (events.stubhub_min_price) setTextEl(q('main-text-shub-price'), events.stubhub_min_price);

        if (hasValue(events.tevo_primary_amount) && hasValue(events.stubhub_primary_amount)) {
            const tevo = parseFloat(events.tevo_primary_amount);
            const shub = parseFloat(events.stubhub_primary_amount);
            setTextEl(
                q('main-text-shub-ratio'),
                Number.isFinite(tevo) && Number.isFinite(shub) && shub > 0 ? Math.round((tevo / shub) * 100) / 100 : ''
            );
        }

        // Purchased
        if (events.purchased_amount) {
            const purchased = parseInt(events.purchased_amount, 10);
            if (!isNaN(purchased)) {
                card.setAttribute('purchased', purchased);
                setTextEl(q('main-text-purchased'), purchased);
            }
        }

        if (events.status) setTextEl(q('main-text-status'), events.status);

        // Chart icon
        const charticon = q('main-text-chart');
        if (charticon) {
            charticon.addEventListener('click', () => openEventCharts(card, events, evid));
            const chartable =
                counts.length > 0 ||
                (isTM &&
                    !url.includes('ticketmaster.com.mx') &&
                    !url.includes('ticketmaster.co.uk') &&
                    !url.includes('ticketmaster.de'));
            charticon.style.display = chartable ? 'flex' : 'none';
        }

        setTextEl(q('main-text-timezone'), events.timezone);

        // TM scrape buttons
        const primrem = q('main-text-primary');
        const dpd = q('main-text-aday');
        const rescrapebutton = q('re-scrape-div');
        const scrapebutton = q('scrape-div-fresh');

        if (scrapebutton) {
            scrapebutton.addEventListener('click', () => {
                setTextEl(primrem, '');
                setTextEl(dpd, '');
                scrapetm(evid.substring(2), siteEventId, primrem, dpd);
            });
        }

        if (rescrapebutton) {
            rescrapebutton.addEventListener('click', () => {
                setTextEl(primrem, '');
                setTextEl(dpd, '');
                scrapeurl(evid.substring(2), primrem, dpd);
            });
        }

        const canScrape =
            (!url.includes('ticketmaster.com.mx') && url.includes('ticketmaster.com')) ||
            url.includes('livenation') ||
            url.includes('ticketmaster.ca');
        showIf(q('topbox'), true);
        showIf(rescrapebutton, canScrape);
        showIf(scrapebutton, canScrape);

        // Navigation buttons
        const buybutton = q('main-buy-button');
        if (buybutton) {
            buybutton.addEventListener('click', () => {
                window.location.assign('https://www.ubikanalytic.com/event?id=' + evid);
            });
        }

        const mbutton = q('manualbutton');
        if (mbutton) {
            mbutton.addEventListener('click', () => {
                window.location.assign('https://www.ubikanalytic.com/buy-manual?id=' + evid);
            });
        }

        // Text fields
        const eventname = q('main-text-event');
        setTextEl(eventname, truncate(events.event_name, 10));
        if (eventname) eventname.addEventListener('click', () => copyToClipboard(url));

        setTextEl(q('main-text-url'), url);
        if (events.time) setTextEl(q('main-text-time'), String(events.time).slice(0, 8));
        setTextEl(q('main-text-venue'), truncate(events.venue_name, 13));
        setTextEl(q('main-text-location'), events.city);
        setTextEl(q('main-text-capacity'), events.venue_capacity);

        // Primary amount / scrape info (non-TM)
        if (events.app_142_scrape_date && !isTM) {
            const scrapeDate = String(events.app_142_scrape_date);
            setTextEl(q('main-text-scrapedate'), scrapeDate);
            card.setAttribute('scrapedate', scrapeDate.length < 10 ? '1998-09-09' : scrapeDate);

            if (events.app_142_scrape_time) setTextEl(q('main-text-scrapetime'), events.app_142_scrape_time);

            const primam = parseInt(events.app_142_primary_amount, 10);
            if (Number(getLatestCount(counts)) && !isNaN(primam)) {
                setTextEl(primrem, primam);
                card.setAttribute('primaryamount', primam);
            } else {
                setTextEl(primrem, '');
                card.setAttribute('primaryamount', '-1');
            }

            if (events.app_142_difference_per_day) {
                setTextEl(dpd, events.app_142_difference_per_day);
                card.setAttribute('perday', events.app_142_difference_per_day);
            }
        }

        // Hide (only removed once the API confirms)
        const hidebtn = q('hidebtn');
        if (hidebtn) {
            hidebtn.addEventListener('click', async () => {
                if (hidebtn.dataset.busy === '1') return;
                hidebtn.dataset.busy = '1';
                try {
                    await updatePrimaryEvent(siteEventId, { hidden: 'true' });
                    card.style.display = 'none';
                } catch (error) {
                    console.error('Hide failed:', error);
                    alert('Could not hide this event, please try again.');
                } finally {
                    hidebtn.dataset.busy = '0';
                }
            });
        }

        // Favorite / hotlist checkboxes (reverted if the save fails)
        const bindFlag = (cls, field) => {
            const checkbox = q(cls);
            if (!checkbox) return;
            checkbox.checked = toBool(events[field]);
            checkbox.addEventListener('click', async () => {
                const value = checkbox.checked;
                try {
                    await updatePrimaryEvent(siteEventId, { [field]: value });
                } catch (error) {
                    console.error(`Saving ${field} failed:`, error);
                    checkbox.checked = !value;
                    alert(`Could not save ${field}, please try again.`);
                }
            });
        };
        bindFlag('main-checkbox-favorite', 'favorites');
        bindFlag('main-checkbox-hotlist', 'hotlist');

        card.style.display = toBool(events.hidden) ? 'none' : 'flex';
        return card;
    }

    async function getEvents(fetchurl) {
        if (searchController) searchController.abort();
        const controller = new AbortController();
        searchController = controller;

        try {
            const data = await fetchJSON(fetchurl, { headers: authHeaders(), signal: controller.signal });
            if (controller !== searchController) return;

            nexturl = data.next || null;
            prevurl = data.previous || null;
            updatePager(fetchurl, data.count);

            const container = document.getElementById('Cards-Container');
            const template = document.getElementById('samplestyle');
            if (!container || !template) throw new Error('#Cards-Container or #samplestyle not found');

            removeCards();

            const fragment = document.createDocumentFragment();
            (data.results || []).forEach(events => {
                try {
                    fragment.appendChild(renderSearchCard(events, template));
                } catch (error) {
                    console.error('Failed to render event', events && events.site_event_id, error);
                }
            });
            container.appendChild(fragment);

            const sortby = document.querySelector('#sortby');
            keyword6 = sortby ? sortby.value : '';

            checkresults();
            fetchEventVenueData();
        } catch (error) {
            if (isAbort(error)) return;
            console.error('searchfailed', error);
        } finally {
            if (controller === searchController) {
                searchController = null;
                setDisplay('#loading', 'none');
                setDisplay('#flexbox', 'flex');
            }
        }
    }

    // ============================================================
    // Result counter and housekeeping
    // ============================================================

    function checkresults() {
        let count = 0;
        document.querySelectorAll('.event-box').forEach(box => {
            if (box.id !== 'samplestyle' && box.style.display !== 'none') count++;
        });
        setText('#counter', count);
        setText('#countertxt', count === 1 ? 'Result' : 'Results');
    }

    // Kept for other scripts that may call it
    let datear = function () {
        setTimeout(() => {
            let now = new Date();
            let date1 = moment(now).format('YYYY/MM/DD');
            $('.event-box').sort(function (a, b) {
                if (date1 > $(b).attr('date')) { return 1; }
                else { return -1; }
            }).appendTo('#Cards-Container');
        }, 2500);
    };

    // Hidden cards are removed and the counter refreshed whenever the list changes,
    // instead of two 100ms polling intervals
    function startHousekeeping() {
        let scheduled = false;
        const run = () => {
            scheduled = false;
            document.querySelectorAll('.event-box').forEach(box => {
                if (box.id !== 'samplestyle' && box.style.display === 'none') box.remove();
            });
            checkresults();
        };
        const schedule = () => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(run);
        };

        new MutationObserver(schedule).observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['style']
        });
        schedule();
    }

    // ============================================================
    // Wiring
    // ============================================================

    function docReady(fn) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(fn, 1);
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    docReady(() => {
        const on = (selector, event, handler) => {
            const el = document.querySelector(selector);
            if (el) el.addEventListener(event, handler);
        };

        on('#rightarrow', 'click', () => {
            if (window.nexturl) constructURL(window.nexturl);
        });

        on('#leftarrow', 'click', () => {
            if (window.prevurl) constructURL(window.prevurl);
        });

        on('#search-button', 'click', () => {
            savedevents = [];
            abortAll();
            constructURL();
        });

        ['#searchbar1', '#searchbar2', '#searchbar3'].forEach(selector => {
            on(selector, 'keyup', event => {
                if (event.key === 'Enter' || event.keyCode === 13) {
                    event.preventDefault();
                    const button = document.getElementById('search-button');
                    if (button) button.click();
                }
            });
        });

        on('#closecharts', 'click', () => {
            dropController(chartController);
            chartController = null;
        });

        const warningContinueBtn = document.querySelector('#warningcontinue');
        if (warningContinueBtn) {
            warningContinueBtn.addEventListener('click', () => {
                const siteEventId = warningContinueBtn.dataset.siteEventId;
                if (!siteEventId) {
                    console.error('No event id set on #warningcontinue');
                    return;
                }
                updatenomap(siteEventId)
                    .then(() => {
                        if (warningContinueBtn._nomapEl) {
                            warningContinueBtn._nomapEl.style.display = 'none';
                            warningContinueBtn._nomapEl = null;
                        }
                        delete warningContinueBtn.dataset.siteEventId;
                    })
                    .catch(() => alert('Could not update the map flag, please try again.'));
            });
        }

        startHousekeeping();
        bootSources();
    });

    // Functions other page scripts may call
    Object.assign(window, {
        abortControllers,
        formatDate,
        ymdToMdy,
        calculateChange,
        scrapeAndUpdate,
        parseUSDateTime,
        getParseDateFn,
        getOrInitLabelTs,
        mergeLabelsAndReindexAllDatasets,
        setDatasetValuesByLabel,
        computeTevoSeries,
        computeShSeries,
        tevochartdata,
        initializeSourceInstructions,
        getSourceDetails,
        constructURL,
        getEvents,
        updatenomap,
        checkresults,
        datear,
        fetchEventVenueData
    });
})();
