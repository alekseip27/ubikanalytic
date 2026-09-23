(function () {
    // Provided by other scripts on the page: token, chart, chartvs, Howl, $, firebase.
    // initsource / searchcompleted are assigned without a declaration on purpose so other
    // scripts can keep reading them exactly as before.
    initsource = false;
    searchcompleted = false;

    const API = 'https://ubik.wiki/api';
    const REFRESH_MS = 180000;
    const EMAIL_TIMEOUT_MS = 15000;
    const VENUE_BATCH_SIZE = 50;
    const ALERT_SOUND_URL = 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3';

    // Kept global so other scripts can still tweak the queue query before a refresh
    window.xanoUrl = new URL(`${API}/buying-queue/?completed__iexact=false&limit=1000`);

    const DEFAULT_SOURCE_DETAILS = {
        source: 'OTHER',
        event_prefix: 'other',
        venue_prefix: 'other',
        url: ''
    };

    const ROLE_ACCESS = {
        'Prohyrph All': [
            'tim@ubikanalytic.com',
            'aleksei@ubikanalytic.com',
            'prohyrph1@ubikanalytic.com',
            'prohyrph2@ubikanalytic.com',
            'arcel@ubikanalytic.com',
            'jj@ubikanalytic.com',
            'franz@ubikanalytic.com',
            'jibs@ubikanalytic.com'
        ],
        'Prohyrph 1': [
            'tim@ubikanalytic.com',
            'aleksei@ubikanalytic.com',
            'prohyrph1@ubikanalytic.com',
            'arcel@ubikanalytic.com',
            'jj@ubikanalytic.com',
            'franz@ubikanalytic.com',
            'jibs@ubikanalytic.com'
        ],
        'Prohyrph 2': [
            'tim@ubikanalytic.com',
            'aleksei@ubikanalytic.com',
            'prohyrph2@ubikanalytic.com',
            'arcel@ubikanalytic.com',
            'jj@ubikanalytic.com',
            'franz@ubikanalytic.com',
            'jibs@ubikanalytic.com'
        ],
        'Remote': [
            'tim@ubikanalytic.com',
            'aleksei@ubikanalytic.com',
            'jan@ubikanalytic.com',
            'jen@ubikanalytic.com',
            'danielle@ubikanalytic.com',
            'arcel@ubikanalytic.com',
            'jj@ubikanalytic.com',
            'franz@ubikanalytic.com',
            'jibs@ubikanalytic.com'
        ],
        'Self': [
            'aleksei@ubikanalytic.com',
            'tim@ubikanalytic.com',
            'arcel@ubikanalytic.com',
            'jj@ubikanalytic.com',
            'franz@ubikanalytic.com',
            'jibs@ubikanalytic.com'
        ]
    };

    const URGENCY_MINUTES = {
        '15 min': 15,
        '30 min': 30,
        '45 min': 45,
        '1 hr': 60,
        '2 hrs': 120,
        '3 hrs': 180,
        '4 hrs': 240,
        '5 hrs': 300,
        '6 hrs': 360,
        '7 hrs': 420,
        '8 hrs': 480,
        '9 hrs': 540,
        '10 hrs': 600,
        '11 hrs': 660,
        '12 hrs': 720,
        '14 hrs': 840,
        '16 hrs': 960,
        '18 hrs': 1080,
        '20 hrs': 1200,
        '1 day': 1440,
        '2 days': 2880,
        '4 days': 5760
    };

    const TAG_CLASSES = {
        'urgent': 'tags-urgent',
        'dont-buy': 'tags-dontbuy',
        'queue-9:50': 'tags-950',
        'queue-10:50': 'tags-1050',
        'queue-11:50': 'tags-1150',
        'queue-12:50': 'tags-1250',
        'queue-13:50': 'tags-1350'
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
    let isAdmin = false;
    let refreshInFlight = null;
    let previousAsapIds = null;
    let alertSound = null;
    let emailPromise = null;
    const boundChartIcons = new WeakSet();

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

    function setText(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.textContent = value == null ? '' : String(value);
    }

    function setTextEl(el, value) {
        if (el) el.textContent = value == null ? '' : String(value);
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

    // Converts a Python repr string (single quotes, None/True/False) into valid JSON.
    // Handles apostrophes inside names like "Guns N' Roses", which a blanket ' -> " swap breaks.
    function pythonLiteralToJSON(src) {
        let out = '';
        let i = 0;
        const n = src.length;

        while (i < n) {
            const ch = src[i];

            if (ch === "'" || ch === '"') {
                const quote = ch;
                let str = '';
                i++;
                while (i < n && src[i] !== quote) {
                    if (src[i] === '\\' && i + 1 < n) {
                        const esc = src[i + 1];
                        if (esc === 'n') { str += '\n'; i += 2; }
                        else if (esc === 't') { str += '\t'; i += 2; }
                        else if (esc === 'r') { str += '\r'; i += 2; }
                        else if (esc === 'x') { str += String.fromCharCode(parseInt(src.slice(i + 2, i + 4), 16) || 0); i += 4; }
                        else if (esc === 'u') { str += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16) || 0); i += 6; }
                        else if (esc === 'U') { str += String.fromCodePoint(parseInt(src.slice(i + 2, i + 10), 16) || 0); i += 10; }
                        else { str += esc; i += 2; }
                    } else {
                        str += src[i];
                        i++;
                    }
                }
                i++; // closing quote
                out += JSON.stringify(str);
            } else if (/[A-Za-z_]/.test(ch)) {
                let word = '';
                while (i < n && /[A-Za-z0-9_]/.test(src[i])) {
                    word += src[i];
                    i++;
                }
                if (word === 'None' || word === 'nan' || word === 'inf') out += 'null';
                else if (word === 'True') out += 'true';
                else if (word === 'False') out += 'false';
                else out += word;
            } else {
                out += ch;
                i++;
            }
        }

        return out;
    }

    // Accepts real arrays/objects, JSON strings, double-encoded JSON, or Python repr strings
    function parseLooseJSON(value) {
        let current = value;
        for (let attempt = 0; attempt < 2 && typeof current === 'string'; attempt++) {
            const trimmed = current.trim();
            if (!trimmed) return null;
            try {
                current = JSON.parse(trimmed);
                continue;
            } catch (e) {
                // fall through to Python repr conversion
            }
            try {
                current = JSON.parse(pythonLiteralToJSON(trimmed));
            } catch (e) {
                console.error('Could not parse data:', e);
                return null;
            }
        }
        return current;
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

    // Minutes to add to New York wall-clock time to get UTC (240 in EDT, 300 in EST)
    function getNYOffset(date) {
        const parts = {};
        new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            hourCycle: 'h23',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).formatToParts(date).forEach(p => {
            parts[p.type] = p.value;
        });

        const nyAsUTC = Date.UTC(
            Number(parts.year),
            Number(parts.month) - 1,
            Number(parts.day),
            Number(parts.hour) % 24,
            Number(parts.minute),
            Number(parts.second)
        );
        return Math.round((date.getTime() - nyAsUTC) / 60000);
    }

    // Parses "MM/DD/YYYY, HH:MM AM" as New York time and returns the real instant
    function parseNewYorkDate(dateStr) {
        if (typeof dateStr !== 'string') return null;
        const m = dateStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
        if (!m) return null;

        const month = Number(m[1]);
        const day = Number(m[2]);
        const year = Number(m[3]);
        let hours = Number(m[4]);
        const minutes = Number(m[5]);
        const modifier = m[6] ? m[6].toUpperCase() : null;

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const wallAsUTC = Date.UTC(year, month - 1, day, hours, minutes);
        let instant = wallAsUTC + getNYOffset(new Date(wallAsUTC)) * 60000;
        // Second pass lands on the right side of a DST switch
        instant = wallAsUTC + getNYOffset(new Date(instant)) * 60000;
        return new Date(instant);
    }

    function calculateTimeLeft(purchasedDate, interval, currentTime) {
        const ms = purchasedDate.getTime() + interval * 60000 - currentTime.getTime();
        if (ms < 0) return { expired: true };

        const totalSeconds = Math.floor(ms / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);

        return {
            timeLeft: totalMinutes,
            displayText: `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
            expired: false
        };
    }

    // Returns "YYYY-MM-DD HH:MM" in local time, or null for unparseable input.
    // Space-separated timestamps are converted to ISO form so Safari can parse them.
    function normalizeDate(date) {
        if (date == null || date === '') return null;
        let input = date;
        if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2} \d/.test(input)) {
            input = input.replace(' ', 'T');
        }
        const d = new Date(input);
        if (isNaN(d.getTime())) return null;

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
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
            initsource = true;
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
        if (sourceTokens.length === 0) {
            return { ...DEFAULT_SOURCE_DETAILS, url };
        }
        for (const [tokenStr, details] of sourceTokens) {
            if (url.includes(tokenStr)) {
                return { ...details, url };
            }
        }
        return { ...DEFAULT_SOURCE_DETAILS, url };
    }

    // ============================================================
    // Charts
    // ============================================================

    function abortChartRequests() {
        while (abortControllers.length) {
            const controller = abortControllers.pop();
            try {
                controller.abort();
            } catch (e) {
                // ignore
            }
        }
    }

    function displayLoadingFailed() {
        setDisplay('#tmloader', 'none');
        setDisplay('#tmerror', 'flex');
        setDisplay('#tmchart', 'none');
    }

    function bindChartIconClick(card, events) {
        const charticon = card.querySelector('.main-text-chart');
        if (!charticon || boundChartIcons.has(charticon)) return;
        boundChartIcons.add(charticon);
        charticon.setAttribute('listener-bound', 'true');

        charticon.addEventListener('click', function () {
            // Cancel whatever the previous click is still loading so it can't overwrite this chart
            abortChartRequests();
            const controller = new AbortController();
            abortControllers.push(controller);
            const signal = controller.signal;

            const box = charticon.closest('.event-box') || card;
            const attr = name => box.getAttribute(name) || '';
            const eventurl = attr('url');
            const eventidv = attr('eventid');
            const vdid = attr('vdid');

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
            setDisplay('#graph-overlay', 'flex');
            setDisplay('#closecharts', 'flex');
            setDisplay('#eventicon', 'none');
            setDisplay('#tmurl', 'block');

            const tmurl = document.querySelector('#tmurl');

            if (eventurl.includes('ticketmaster') || eventurl.includes('livenation')) {
                if (tmurl) tmurl.href = 'http://142.93.115.105:8100/event/' + eventidv.substring(2) + '/details/';
                fetchTicketmasterData(eventidv.substring(2), signal);
            } else {
                if (tmurl) tmurl.href = eventurl;
                updateChartWithPrimaryAndPreferred({
                    event_id: eventidv,
                    event_url: eventurl,
                    counts: parseLooseJSON(attr('counts')) || [],
                    site_venue_id: attr('venueid')
                }, signal);
            }

            vschartdata(vdid, signal);
        });
    }

    async function vschartdata(VDID, signal) {
        const showVs = state => {
            setDisplay('#vsloader', state === 'loading' ? 'flex' : 'none');
            setDisplay('#vschart', state === 'chart' ? 'flex' : 'none');
            setDisplay('#vserror', state === 'error' ? 'flex' : 'none');
        };

        const defaultLabels = ['Total', '', '', '', 'Lowest Price', '', '', ''];
        for (let i = 0; i < 8; i++) {
            if (!chartvs.data.datasets[i]) continue;
            chartvs.data.datasets[i].data = [];
            chartvs.data.datasets[i].label = defaultLabels[i];
        }
        chartvs.data.labels = [];
        chartvs.update();
        showVs('loading');

        // An empty vdid__iexact filter is ignored by the API and returns every row,
        // which would chart some other event's data
        if (!VDID) {
            showVs('error');
            return;
        }

        try {
            const data = await fetchJSON(
                `${API}/vividseats/?vdid__iexact=${encodeURIComponent(VDID)}&format=json`,
                { headers: authHeaders(), signal }
            );
            if (signal && signal.aborted) return;

            const record = (data.results || [])[0];
            const datas = parseLooseJSON(record && record.data_scrapes);
            if (!Array.isArray(datas) || datas.length === 0) {
                throw new Error('No VividSeats scrape data');
            }

            const series = key => datas.map(item => (item ? item[key] : null)).reverse();
            const p1name = datas[0].pref1_title || '';
            const p2name = datas[0].pref2_title || '';
            const p3name = datas[0].pref3_title || '';

            showVs('chart');

            chartvs.data.labels = series('scrape_datetime');
            chartvs.data.datasets[0].data = series('total_count');
            chartvs.data.datasets[1].data = series('pref1_count');
            chartvs.data.datasets[2].data = series('pref2_count');
            chartvs.data.datasets[3].data = series('pref3_count');
            chartvs.data.datasets[4].data = series('lowest_price');
            chartvs.data.datasets[5].data = series('pref1_lowest');
            chartvs.data.datasets[6].data = series('pref2_lowest');
            chartvs.data.datasets[7].data = series('pref3_lowest');

            chartvs.data.datasets[1].label = p1name;
            chartvs.data.datasets[2].label = p2name;
            chartvs.data.datasets[3].label = p3name;
            chartvs.data.datasets[5].label = p1name ? p1name + ' Lowest Price' : '';
            chartvs.data.datasets[6].label = p2name ? p2name + ' Lowest Price' : '';
            chartvs.data.datasets[7].label = p3name ? p3name + ' Lowest Price' : '';

            chartvs.update();
        } catch (error) {
            if (isAbort(error)) return;
            console.error('VividSeats chart error:', error);
            showVs('error');
        }
    }

    async function updateChartWithPrimaryAndPreferred(events, signal) {
        let counts = parseLooseJSON(events.counts);
        if (!Array.isArray(counts)) counts = [];
        const venueid = events.site_venue_id;
        const details = getSourceDetails(events.event_url);

        chart.data.datasets[0].label = `${details.source.toUpperCase()} Primary`;
        chart.data.datasets.splice(1);
        chart.update();

        const amountsPrimary = [];
        const datesPrimary = [];
        const combinedDates = new Set();

        counts.forEach(count => {
            if (!count) return;
            const date = normalizeDate(count.scrape_date);
            if (!date) return;
            const primary = parseInt(count.primary_amount || '0', 10);
            amountsPrimary.push(isNaN(primary) ? 0 : primary);
            datesPrimary.push(date);
            combinedDates.add(date);
        });

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
                        `${API}/primary-counts/?tickets_by_sections__icontains=%7B&event_id__icontains=${encodeURIComponent(events.event_id)}&limit=1000&format=json`,
                        { headers: authHeaders(), signal }
                    );
                    const results = data.results || [];

                    validPrefs.forEach((pref, index) => {
                        const byDate = {};

                        results.forEach(result => {
                            const date = normalizeDate(result && result.event && result.event.scrape_date);
                            if (!date) return;
                            if (!(date in byDate)) byDate[date] = 0;

                            const sections = parseLooseJSON(result.tickets_by_sections);
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

        // "YYYY-MM-DD HH:MM" sorts correctly as a plain string in every browser
        const labels = Array.from(combinedDates).sort();
        if (labels.length === 0) {
            displayLoadingFailed();
            return;
        }

        chart.data.labels = labels;
        chart.data.datasets[0].data = labels.map(date => {
            const i = datesPrimary.indexOf(date);
            return i !== -1 ? amountsPrimary[i] : 0;
        });

        preferredData.forEach(pref => {
            chart.data.datasets.push({
                data: labels.map(date => pref.byDate[date] || 0),
                label: pref.label,
                backgroundColor: pref.backgroundColor,
                borderColor: pref.borderColor,
                borderWidth: 1
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
    // Scraping
    // ============================================================

    // eventid: the id the scraper expects (no prefix)
    // siteEventId: the full site_event_id used when marking the event sold out
    async function scrapetm(eventid, siteEventId) {
        const raw = String(eventid);
        const eventidscrape = raw.startsWith('tm') ? raw.substring(2) : raw;
        const updateId = siteEventId || eventid;

        try {
            const response = await fetch('https://shibuy.co:8443/scrapeurl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ eventid: eventidscrape })
            });
            if (!response.ok) throw new Error(`Scrape failed with status ${response.status}`);

            const responseData = await response.json();
            if (!Array.isArray(responseData) || responseData.length === 0) {
                return 'unknown';
            }

            const eventData = responseData[0] || {};
            const sections = Array.isArray(eventData.sections) ? eventData.sections : [];
            const totalPrimaryAmount = sections
                .filter(section => section.type !== 'resale' && typeof section.amount === 'number')
                .reduce((sum, section) => sum + section.amount, 0);

            const amounts = Array.isArray(eventData.amounts) ? eventData.amounts : [];
            if (amounts.some(item => item.amount === undefined || item.amount < 50)) {
                updatedata(updateId);
            }

            return totalPrimaryAmount;
        } catch (error) {
            console.error('Error scraping:', error);
            return 'unavailable';
        }
    }

    async function scrapeurl(eventid) {
        try {
            const data = await fetchJSON('https://shibuy.co:8443/primaryurl?eventid=' + encodeURIComponent(eventid));
            return typeof data.count === 'number' && data.count !== 0 ? data.count : 'unknown';
        } catch (error) {
            console.error('Error fetching primary url:', error);
            return 'unknown';
        }
    }

    function updatedata(eventid) {
        const currentdate = new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');

        fetch(`${API}/update/primary-events/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                site_event_id: eventid,
                status: 'sold out',
                previous_status: currentdate
            })
        })
            .then(response => {
                if (!response.ok) throw new Error(`Update failed with status ${response.status}`);
                return response.json();
            })
            .then(data => console.log('Marked sold out:', data))
            .catch(error => console.error('Error marking event sold out:', error));
    }

    // ============================================================
    // Venue data (batched)
    // ============================================================

    function applyVenueResult(el, result) {
        const counts = parseLooseJSON(result.counts);
        const hasCounts = Array.isArray(counts) && counts.length > 0;

        el.setAttribute('venueid', result.site_venue_id || '');
        el.setAttribute('city', result.city || '');
        el.setAttribute('state', result.state || '');
        el.setAttribute('vdid', result.vdid || '');
        el.setAttribute('counts', Array.isArray(counts) ? JSON.stringify(counts) : '');

        const primaryAmount = parseInt(result.app_142_primary_amount, 10);
        el.setAttribute('primaryamount', isNaN(primaryAmount) ? -2 : primaryAmount);

        const chartIcon = el.querySelector('.main-text-chart');
        if (chartIcon && (primaryAmount > 0 || hasCounts)) {
            chartIcon.style.display = 'flex';
        }

        if (primaryAmount > 0) {
            const reBox = el.querySelector('.re-box');
            const primary = el.querySelector('.main-text-primary');
            if (reBox) reBox.style.display = 'flex';
            if (primary) {
                primary.style.display = 'flex';
                primary.textContent = primaryAmount;
            }
        }
    }

    async function fetchEventVenueData() {
        const template = document.getElementById('samplestyle');
        const boxesByKey = new Map();

        document.querySelectorAll('.event-box').forEach(box => {
            if (box === template) return;
            const id = box.getAttribute('eventid');
            if (!id) return;
            const key = id.toLowerCase();
            if (!boxesByKey.has(key)) boxesByKey.set(key, { id, boxes: [] });
            boxesByKey.get(key).boxes.push(box);
        });

        const ids = Array.from(boxesByKey.values()).map(entry => entry.id);
        const batches = [];
        for (let i = 0; i < ids.length; i += VENUE_BATCH_SIZE) {
            batches.push(ids.slice(i, i + VENUE_BATCH_SIZE));
        }

        const allResults = [];

        await Promise.all(batches.map(async batch => {
            const url = `${API}/event-venue/?site_event_id__filters=` + batch.map(id => encodeURIComponent(id)).join(',');
            try {
                const results = await fetchAllPages(url, { headers: authHeaders() });
                allResults.push(...results);

                const resultByKey = new Map();
                results.forEach(result => {
                    if (result && result.site_event_id) {
                        resultByKey.set(String(result.site_event_id).toLowerCase(), result);
                    }
                });

                batch.forEach(id => {
                    const key = id.toLowerCase();
                    const result = resultByKey.get(key);
                    if (!result) {
                        console.warn(`No venue data returned for event ID ${id}`);
                        return;
                    }
                    boxesByKey.get(key).boxes.forEach(el => applyVenueResult(el, result));
                });
            } catch (err) {
                console.error(`Failed to fetch venue batch [${batch.join(',')}]:`, err);
            }
        }));

        console.log('All venue data added to DOM elements');

        document.querySelectorAll('.event-box').forEach(box => {
            if (box === template) return;
            bindChartIconClick(box, {
                event_id: box.getAttribute('eventid'),
                event_url: box.getAttribute('url'),
                vdid: box.getAttribute('vdid'),
                site_venue_id: box.getAttribute('venueid'),
                counts: box.getAttribute('counts'),
                city: box.getAttribute('city'),
                state: box.getAttribute('state'),
                primary_amount: box.getAttribute('primaryamount')
            });
        });

        return allResults;
    }

    // ============================================================
    // Queue cards
    // ============================================================

    function waitForUserEmail() {
        if (!emailPromise) {
            emailPromise = new Promise(resolve => {
                const read = () => {
                    const el = document.getElementById('email');
                    const text = el ? el.textContent.trim().toLowerCase() : '';
                    return text.includes('@') ? text : null;
                };
                const now = read();
                if (now) return resolve(now);
                const id = setInterval(() => {
                    const value = read();
                    if (value) {
                        clearInterval(id);
                        resolve(value);
                    }
                }, 300);
            });
        }
        return emailPromise;
    }

    function canUserSee(assign, email) {
        const allowed = ROLE_ACCESS[assign];
        return !!(email && allowed && allowed.includes(email));
    }

    function applyUrgency(card, events, statusEl) {
        const setStatus = (text, red) => {
            if (!statusEl) return;
            statusEl.textContent = text;
            if (red) statusEl.style.color = 'red';
        };

        const urgency = events.buying_urgency;

        switch (urgency) {
            case 'error':
                setStatus('ERROR', true);
                card.setAttribute('timeleft', '999999999');
                card.setAttribute('error', 'true');
                return;
            case 'Extremely Urgent':
                setStatus('URGENT', true);
                card.setAttribute('timeleft', '-1');
                card.setAttribute('asap', 'true');
                return;
            case 'Immediate':
                setStatus('ASAP', true);
                card.setAttribute('timeleft', '0');
                card.setAttribute('asap', 'true');
                return;
        }

        const interval = URGENCY_MINUTES[urgency];
        if (!interval) {
            console.error(`Unrecognized urgency: ${urgency}`);
            return;
        }

        const added = parseNewYorkDate(events.added_timestamp);
        if (!added) {
            console.error(`Unparseable added_timestamp: ${events.added_timestamp}`);
            return;
        }

        const { timeLeft, displayText, expired } = calculateTimeLeft(added, interval, new Date());
        if (expired) {
            setStatus('ASAP', true);
            card.setAttribute('timeleft', '0');
        } else {
            setStatus(displayText, false);
            card.setAttribute('timeleft', timeLeft);
        }
    }

    function renderCard(events, template, email) {
        const card = template.cloneNode(true);
        const q = cls => card.querySelector('.' + cls);

        const url = events.event_url || '';
        const eventId = events.event_id || '';
        const tags = events.tags || [];

        card.setAttribute('id', eventId);
        card.setAttribute('eventid', eventId);
        card.setAttribute('queueid', events.id);
        card.setAttribute('name', events.event_name || '');
        card.setAttribute('venue', events.event_venue || '');
        card.setAttribute('url', url);
        card.setAttribute('time', events.event_time || '');
        card.setAttribute('postedby', events.signal_identifier ?? '');
        card.setAttribute('checked', 'false');
        card.removeAttribute('listener-bound');

        // Chart icon
        const charticon = q('main-text-chart');
        const counts = events.counts;
        const tmChartable =
            (url.includes('ticketmaster') || url.includes('livenation')) &&
            !url.includes('ticketmaster.com.mx') &&
            !url.includes('ticketmaster.co.uk') &&
            !url.includes('ticketmaster.de');
        showIf(charticon, (counts && counts.length > 0) || tmChartable);
        bindChartIconClick(card, events);

        // Source
        const details = getSourceDetails(url);
        setTextEl(q('main-text-src'), details.source);
        card.setAttribute('source', details.source);

        // Text fields
        const eventname = q('main-text-event');
        setTextEl(eventname, truncate(events.event_name, 21));
        if (eventname) eventname.addEventListener('click', () => copyToClipboard(url));

        setTextEl(q('main-text-time'), String(events.event_time || '').slice(0, 8));

        setTextEl(q('main-text-tl'), events.added_timestamp);
        card.setAttribute('dateposted', events.added_timestamp || '');

        setTextEl(q('main-text-postedby'), events.added_by);

        if (events.assign) {
            setTextEl(q('main-text-assign'), events.assign);
            card.setAttribute('assign', events.assign);
        }

        setTextEl(q('main-text-venue'), truncate(events.event_venue, 20));

        setTextEl(q('main-text-date'), events.event_date);
        card.setAttribute('date', events.event_date || '');

        const fulfilled = events.purchased_amount ? events.purchased_amount : '0';
        setTextEl(q('main-text-quantity'), fulfilled);
        card.setAttribute('fulfilled', fulfilled);

        setTextEl(q('main-text-quantity-max'), events.purchase_total);

        // Tags
        Object.keys(TAG_CLASSES).forEach(tag => {
            if (tags.includes(tag)) showIf(q(TAG_CLASSES[tag]), true);
        });

        // Scrape buttons
        const primrem = q('main-text-primary');
        const rescrapebutton = q('re-scrape-div');
        const scrapebutton = q('scrape-div-fresh');
        const canScrape = !url.includes('ticketmaster.com.mx') &&
            (url.includes('ticketmaster.com') || url.includes('livenation'));

        showIf(q('topbox'), true);
        showIf(rescrapebutton, canScrape);
        showIf(scrapebutton, canScrape);

        if (scrapebutton) {
            scrapebutton.addEventListener('click', async () => {
                setTextEl(primrem, '');
                try {
                    setTextEl(primrem, await scrapetm(eventId.substring(2), eventId));
                } catch (error) {
                    console.log('Scrape failed:', error);
                    setTextEl(primrem, 'unavailable');
                }
            });
        }

        if (rescrapebutton) {
            rescrapebutton.addEventListener('click', async () => {
                setTextEl(primrem, '');
                try {
                    setTextEl(primrem, await scrapeurl(eventId.substring(2)));
                } catch (error) {
                    console.log('Rescrape failed:', error);
                    setTextEl(primrem, 'unknown');
                }
            });
        }

        // Urgency / countdown
        applyUrgency(card, events, q('main-text-status'));

        // Buy / respond (one listener, so "Respond" doesn't also fire the buy navigation)
        const buybutton = q('main-buy-button');
        if (buybutton) {
            if (card.getAttribute('error') === 'true') buybutton.textContent = 'Respond';
            buybutton.addEventListener('click', () => {
                if (card.getAttribute('error') === 'true') {
                    window.location.assign('https://www.ubikanalytic.com/error-respond?id=' +
                        encodeURIComponent(events.error_id).replace(/%20/g, '+'));
                } else {
                    window.location.assign('https://www.ubikanalytic.com/buy-event?id=' + events.id);
                }
            });
        }

        // Edit (admins only)
        const editbutton = q('main-edit-button');
        if (editbutton) {
            editbutton.style.display = isAdmin ? 'flex' : 'none';
            editbutton.addEventListener('click', () => {
                window.location.assign('https://www.ubikanalytic.com/edit-event?id=' + events.id);
            });
        }

        // Delete (only hides the card once the API confirms)
        const confirmbutton = q('main-confirm-button');
        const deletebutton = q('main-delete-button-confirm');
        if (confirmbutton && deletebutton) {
            confirmbutton.addEventListener('click', () => {
                confirmbutton.style.display = 'none';
                deletebutton.style.display = 'flex';
            });

            deletebutton.addEventListener('click', async () => {
                if (deletebutton.dataset.busy === 'true') return;
                deletebutton.dataset.busy = 'true';
                try {
                    const response = await fetch(`${API}/delete/buying-queue/`, {
                        method: 'DELETE',
                        headers: authHeaders(),
                        body: JSON.stringify({ id: String(events.id) })
                    });
                    if (!response.ok) throw new Error(`Delete failed with status ${response.status}`);
                    card.style.display = 'none';
                } catch (error) {
                    console.error('Delete failed:', error);
                    deletebutton.style.display = 'none';
                    confirmbutton.style.display = 'flex';
                    alert('Delete failed, the item is still in the queue.');
                } finally {
                    delete deletebutton.dataset.busy;
                }
            });
        }

        card.style.display = canUserSee(events.assign, email) ? 'flex' : 'none';
        return card;
    }

    function sortCards() {
        const container = document.getElementById('Cards-Container');
        if (!container) return;

        const value = el => {
            const v = parseFloat(el.getAttribute('timeleft'));
            return isNaN(v) ? Infinity : v;
        };

        Array.from(container.querySelectorAll('.event-box'))
            .sort((a, b) => {
                const va = value(a);
                const vb = value(b);
                return va === vb ? 0 : va < vb ? -1 : 1;
            })
            .forEach(el => container.appendChild(el));
    }

    // Fetches the queue first, then swaps the cards in one go, so a failed request
    // leaves the current cards on screen instead of an empty page
    function getEvents() {
        if (refreshInFlight) return refreshInFlight;

        refreshInFlight = (async () => {
            const container = document.getElementById('Cards-Container');
            const template = document.getElementById('samplestyle');
            if (!container || !template) {
                throw new Error('#Cards-Container or #samplestyle not found');
            }

            const [results, email] = await Promise.all([
                fetchAllPages(window.xanoUrl.toString(), { headers: authHeaders(), cache: 'no-store' }),
                Promise.race([waitForUserEmail(), sleep(EMAIL_TIMEOUT_MS).then(() => null)])
            ]);

            const fragment = document.createDocumentFragment();
            results.forEach(events => {
                try {
                    fragment.appendChild(renderCard(events, template, email));
                } catch (error) {
                    console.error('Failed to render queue item', events && events.id, error);
                }
            });

            container.querySelectorAll('.event-box').forEach(box => {
                if (box !== template) box.remove();
            });
            container.appendChild(fragment);
            template.style.display = 'none';

            await fetchEventVenueData();
            sortCards();
            searchcompleted = true;
        })().finally(() => {
            refreshInFlight = null;
        });

        return refreshInFlight;
    }

    // ============================================================
    // Refresh loop, alert sound, admin check
    // ============================================================

    function playAlert() {
        try {
            if (!alertSound) alertSound = new Howl({ src: [ALERT_SOUND_URL] });
            alertSound.play();
        } catch (error) {
            console.error('Could not play alert sound:', error);
        }
    }

    function visibleAsapIds() {
        const ids = new Set();
        document.querySelectorAll('#Cards-Container .event-box').forEach(el => {
            if (el.id === 'samplestyle' || el.style.display === 'none') return;
            if (el.getAttribute('asap') === 'true' || el.getAttribute('timeleft') === '0') {
                ids.add(el.getAttribute('queueid'));
            }
        });
        return ids;
    }

    async function refreshCycle() {
        setDisplay('#loading', 'flex');
        setDisplay('#flexbox', 'none');
        try {
            await getEvents();

            // Chime only when an ASAP item appears that you can see and that wasn't ASAP last time
            const current = visibleAsapIds();
            const hasNew = previousAsapIds !== null && Array.from(current).some(id => !previousAsapIds.has(id));
            previousAsapIds = current;
            if (hasNew) playAlert();
        } catch (error) {
            console.error('Queue refresh failed:', error);
        } finally {
            setDisplay('#loading', 'none');
            setDisplay('#flexbox', 'flex');
        }
    }

    function applyAdminButtons() {
        if (!isAdmin) return;
        document.querySelectorAll('.main-edit-button').forEach(button => {
            button.style.display = 'flex';
        });
    }

    function checkAdmin() {
        const id = setInterval(() => {
            if (typeof firebase === 'undefined' || !firebase.auth) return;
            const user = firebase.auth().currentUser;
            if (!user) return;
            clearInterval(id);

            firebase.firestore().doc('users/' + user.uid).get()
                .then(docSnap => {
                    const data = docSnap.data() || {};
                    isAdmin = data.admin === true;
                    applyAdminButtons();
                })
                .catch(error => console.error('Admin check failed:', error));
        }, 1000);
    }

    async function boot() {
        await waitFor(hasToken, 500);

        while (!(await initializeSourceInstructions())) {
            await sleep(5000);
        }

        await refreshCycle();
        setInterval(refreshCycle, REFRESH_MS);
    }

    function docReady(fn) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(fn, 1);
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    docReady(() => {
        const template = document.getElementById('samplestyle');
        if (template) template.style.display = 'none';

        const closeBtn = document.querySelector('#closecharts');
        if (closeBtn) closeBtn.addEventListener('click', abortChartRequests);

        checkAdmin();
        boot();
    });

    // Functions other page scripts may call
    Object.assign(window, {
        abortControllers,
        initializeSourceInstructions,
        getSourceDetails,
        bindChartIconClick,
        getEvents,
        vschartdata,
        normalizeDate,
        updateChartWithPrimaryAndPreferred,
        displayLoadingFailed,
        fetchTicketmasterData,
        processTicketmasterData,
        scrapetm,
        scrapeurl,
        updatedata,
        fetchEventVenueData
    });
})();
