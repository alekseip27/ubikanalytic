let selected = [];
let intervalIds;
let sourceInstructions = [];

// Stamps the current US Eastern time (daylight saving handled by moment-timezone).
// dategoal / estdates / vividurl used to be implicit globals; they are now set on
// window explicitly so they still exist for any other script on the page.
function stampEasternTime() {
    const nowInEastern = moment().tz('America/New_York');
    window.dategoal = nowInEastern.format('MM/DD/YYYY, hh:mm A'); // 10/02/2026, 05:08 AM
    window.estdates = nowInEastern.format('MM/DD/YYYY h:mm');     // 10/02/2026 5:08
    return window.dategoal;
}

function readSelectedTags() {
    const select = document.getElementById('tags');
    selected = [];
    for (let i = 0; i < select.options.length; i++) {
        const opt = select.options[i];
        if (opt.selected) {
            selected.push(opt.value);
        }
    }
    return selected;
}

function initializeSourceInstructions() {
    return fetch('https://ubik.wiki/api/source-instructions/?limit=100', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status + ' ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            sourceInstructions = Array.isArray(data.results) ? data.results : [];
            console.log('Source instructions loaded.');
        })
        .catch(error => {
            // Not fatal: the event still loads, its source just falls back to OTHER.
            console.error('Error occurred during fetch:', error);
        });
}

function retrievefetch(url) {
    url = url || '';

    // Every return path carries a `source`, so callers can rely on it being a string.
    const fallback = {
        source: 'OTHER',
        event_prefix: 'other',
        venue_prefix: 'other',
        url: url
    };

    if (!sourceInstructions.length) {
        console.log('Source instructions not loaded yet.');
        return fallback;
    }

    const matchingRecord = sourceInstructions.find(record => {
        if (!record.contains) {
            return false;
        }
        return record.contains
            .split(',')
            .map(part => part.trim())
            // An empty piece (trailing comma, double comma) would match every URL.
            .filter(part => part !== '')
            .some(part => url.includes(part));
    });

    if (!matchingRecord) {
        return fallback;
    }

    return {
        source: String(matchingRecord.source || 'OTHER'),
        event_prefix: matchingRecord.event_prefix,
        venue_prefix: matchingRecord.venue_prefix,
        url: url
    };
}

async function loadEventDetails() {
    const pkid = new URLSearchParams(window.location.search).get('id');
    if (!pkid) {
        throw new Error('No event id in the page URL (expected ?id=...).');
    }

    // Both requests run in parallel, but the event is only rendered once the source
    // instructions are in, because working out the event's source depends on them.
    const [, response] = await Promise.all([
        initializeSourceInstructions(),
        fetch('https://ubik.wiki/api/event-venue/?site_event_id__iexact=' + encodeURIComponent(pkid), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    ]);

    if (!response.ok) {
        throw new Error('Event lookup failed (' + response.status + ' ' + response.statusText + ').');
    }

    const data = await response.json();
    const eventData = data && data.results && data.results[0];
    if (!eventData) {
        throw new Error('No event found for id ' + pkid + '.');
    }

    document.getElementById('event').textContent = eventData.event_name;
    document.getElementById('venue').textContent = eventData.venue_name;

    const prefixes = retrievefetch(eventData.event_url);
    document.getElementById('source').textContent = prefixes.source;

    if (prefixes.source.includes('TM')) {
        document.getElementById('url2x').textContent = 'http://142.93.115.105:8100/event/' + pkid + '/details/';
        document.getElementById('url2box').style.display = 'flex';
        document.getElementById('organic-movement').disabled = false;
        document.getElementById('app-142-drop-estimate').disabled = false;
    }

    document.getElementById('date').textContent = eventData.date;
    document.getElementById('time').textContent = eventData.time;

    if (eventData.warning) {
        document.getElementById('warning').textContent = eventData.warning;
    }

    stampEasternTime();
    window.vividurl = eventData.vivid_url;

    document.getElementById('url').textContent = eventData.event_url;
    document.getElementById('pref1rem').textContent = eventData.Event_Other_Master_Pref1_Remaining;
    document.getElementById('pref2rem').textContent = eventData.Event_Other_Master_Pref2_Remaining;
    document.getElementById('pref3rem').textContent = eventData.Event_Other_Master_Pref3_Remaining;
    document.getElementById('remcheckdate').textContent = eventData.Event_Other_Master_Remain_Check_Date;
    document.getElementById('remchecktime').textContent = eventData.Event_Other_Master_Remain_Check_Time;
    document.getElementById('totalresale').textContent = eventData.Event_Other_Master_Resale_Total_Amnt;
    document.getElementById('prefresale').textContent = eventData.Event_Other_Master_Resale_Pref_Amnt;
    document.getElementById('prefsec1').textContent = eventData.Venue_Other_Master_Pref_Section1;
    document.getElementById('prefsec2').textContent = eventData.Venue_Other_Master_Pref_Section2;
    document.getElementById('prefsec3').textContent = eventData.Venue_Other_Master_Pref_Section3;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('Item-Container').style.display = 'flex';
}

function retryClickingSearchBar() {
    // Wait until the auth script has set the 40-character API token.
    if (typeof token !== 'string' || token.length !== 40) {
        return;
    }

    // Stop polling before doing anything else, so an error further down can't make
    // this run again every second and stack up duplicate listeners and requests.
    clearInterval(intervalIds);

    document.getElementById('purchasetotal').setAttribute('min', '0');
    document.getElementById('quantityper').setAttribute('min', '0');
    document.getElementById('organic-movement').disabled = true;
    document.getElementById('app-142-drop-estimate').disabled = true;

    function updateBuyButtonVisibility() {
        const filled = ['purchasetotal', 'quantityper', 'section', 'buyingurgency', 'purchaseaccs', 'assign', 'signal-identifier']
            .every(function (id) {
                return document.getElementById(id).value.trim() !== '';
            });

        // min="0" is only enforced by native form submission, which this page doesn't use.
        const noNegatives = ['purchasetotal', 'quantityper']
            .every(function (id) {
                return !(Number(document.getElementById(id).value) < 0);
            });

        const ready = filled && noNegatives;
        document.getElementById('buyfake').style.display = ready ? 'none' : 'flex';
        document.getElementById('buybtn').style.display = ready ? 'flex' : 'none';
    }

    ['purchasetotal', 'quantityper', 'section', 'buyingurgency', 'signal-identifier', 'purchaseaccs', 'assign'].forEach(function (id) {
        const field = document.getElementById(id);
        field.addEventListener('input', updateBuyButtonVisibility);
        field.addEventListener('change', updateBuyButtonVisibility);
    });

    // Set the correct state on load (covers values restored by the browser).
    updateBuyButtonVisibility();

    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = text;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    document.getElementById('urlx').addEventListener('click', function () {
        copyToClipboard(document.getElementById('url').textContent);
    });

    document.getElementById('url2').addEventListener('click', function () {
        copyToClipboard(document.getElementById('url2x').textContent);
    });

    loadEventDetails().catch(function (error) {
        console.error('Error:', error);
        alert('Could not load this event.\n\n' + error.message);
    });
}

// 'change' also fires for keyboard selection, which 'click' missed.
document.getElementById('tags').addEventListener('change', readSelectedTags);

intervalIds = setInterval(retryClickingSearchBar, 1000);

document.getElementById('buybtn').addEventListener('click', async function () {
    const button = this;

    // Guard against double submits (pointer-events alone doesn't stop the keyboard).
    if (button.dataset.submitting === 'true') {
        return;
    }
    button.dataset.submitting = 'true';
    button.style.pointerEvents = 'none';

    function unlockButton() {
        button.dataset.submitting = 'false';
        button.style.pointerEvents = '';
    }

    let response;
    try {
        const pkid = new URLSearchParams(window.location.search).get('id');
        const requestData = {
            purchase_total: document.getElementById('purchasetotal').value,
            quantity_per: document.getElementById('quantityper').value,
            section: document.getElementById('section').value,
            buying_urgency: document.getElementById('buyingurgency').value,
            presale_code: document.getElementById('presalecode').value,
            purchase_notes: document.getElementById('notes').value,
            // Time the buy is actually submitted, not the time the page was opened.
            added_timestamp: stampEasternTime(),
            added_by: document.getElementById('username').textContent.trim().split(/\s+/)[0],
            event_name: document.getElementById('event').textContent,
            event_id: pkid,
            event_venue: document.getElementById('venue').textContent,
            event_date: document.getElementById('date').textContent,
            event_url: document.getElementById('url').textContent,
            event_time: document.getElementById('time').textContent,
            event_source: document.getElementById('source').textContent,
            purchase_account: document.getElementById('purchaseaccs').value,
            credit_account: document.getElementById('purchaseaccs').value,
            assign: document.getElementById('assign').value,
            signal_identifier: document.getElementById('signal-identifier').value,
            signal_identifier_two: document.getElementById('signal-identifier-two').value,
            pricing_notes: document.getElementById('pricer-notes').value,
            purchase_scenario: document.getElementById('purchase-scenario').value,
            organic_movement: document.getElementById('organic-movement').value,
            app_142_estimate: document.getElementById('app-142-drop-estimate').value,
            vivid_venue_id: window.vividurl,
            // Read at submit time so the payload always matches what is selected.
            tags: readSelectedTags().join(',')
        };

        response = await fetch('https://ubik.wiki/api/create/buying-queue/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });
    } catch (error) {
        console.error('Error creating buy:', error);
        unlockButton();
        alert('The buy could not be sent (' + error.message + ').\n\nCheck the buy queue before trying again, in case it did go through.');
        return;
    }

    if (!response.ok) {
        let detail = '';
        try {
            detail = (await response.text()).slice(0, 300);
        } catch (error) {
            // Body unreadable: the status line below is enough.
        }
        console.error('Buy rejected by API:', response.status, detail);
        unlockButton();
        alert('The buy was NOT added to the queue (' + response.status + ' ' + response.statusText + ').' + (detail ? '\n\n' + detail : ''));
        return;
    }

    // The buy is saved from here on.
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('Item-Container').style.display = 'none';

    // The notification is best-effort: a failed webhook must not strand the user
    // on a dead page after the buy has already been created.
    try {
        await fetch('https://hook.us1.make.com/c7ug12vaoqk99aomiix1279qrhv13tk1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'New Buy': document.getElementById('buyingurgency').value })
        });
    } catch (error) {
        console.error('Notification webhook failed:', error);
    }

    setTimeout(function () {
        window.location.href = '/buy-queue';
    }, 2000);
});
