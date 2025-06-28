// ────────────────────────────────────────────────────────────────────────────
// GLOBAL STATE
// ────────────────────────────────────────────────────────────────────────────
let selected = [];

// ────────────────────────────────────────────────────────────────────────────
// FETCH & RENDER EVENT
// ────────────────────────────────────────────────────────────────────────────
function getevent() {
  // Extract event ID from URL
  const pkid = document.location.href
    .split('https://www.ubikanalytic.com/edit-event?id=')[1];

  // Prepare and send the XHR
  const request = new XMLHttpRequest();
  const xanoUrl = new URL(
    'https://ubik.wiki/api/buying-queue/' +
    encodeURIComponent(pkid) + '/'
  );
  request.open('GET', xanoUrl.toString(), true);
  request.setRequestHeader("Content-type", "application/json; charset=utf-8");
  request.setRequestHeader('Authorization', `Bearer ${token}`);

  request.onload = function() {
    if (request.status < 200 || request.status >= 400) {
      console.error('Error loading event:', request.status);
      return;
    }

    // Parse API response
    const events = JSON.parse(this.response);
    const itemContainer = document.getElementById("Item-Container");
    const item = document.getElementById('samplestyle');

    // Populate all your fields
    document.querySelector('#event').textContent       = events.event_name;
    document.querySelector('#venue').textContent       = events.event_venue;
    document.querySelector('#source').textContent      = events.event_source;
    document.querySelector('#date').textContent        = events.event_date;
    document.querySelector('#time').textContent        = events.event_time;

    if (events.source_site === 'TM') {
      document.querySelector('#url2').textContent      =
        'http://142.93.115.105:8100/event/' + pkid + '/details/';
      document.querySelector('#url2box').style.display = "flex";
    }
    document.querySelector('#url').textContent         = events.event_url;
    document.querySelector('#purchasetotal').value     = events.purchase_total;
    document.querySelector('#quantityper').value       = events.quantity_per;
    document.querySelector('#section').value           = events.section;
    document.querySelector('#buyingurgency').value     = events.buying_urgency;
    document.querySelector('#creditaccount').value     = events.credit_account;
    document.querySelector('#presalecode').value       = events.presale_code;
    document.querySelector('#notes').value             = events.purchase_notes;
    document.querySelector('#assign').value            = events.assign;

    // Insert your template (which contains <select id="tags">) into the DOM
    itemContainer.appendChild(item);

    // ──────────────────────────────────────────────────────────────────────────
    // MULTI-SELECT TAGS SETUP
    // ──────────────────────────────────────────────────────────────────────────
    const tagsSelect = document.getElementById('tags');
    tagsSelect.multiple = true;

    /**
     * Pre-selects <option>s based on a comma-separated `tags` string.
     * Normalizes both sides to lowercase & trimmed values.
     */
    function applyEventTags(tags) {
      // Split CSV, trim & lowercase each tag
      const tagsArr = tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      // For each <option>, match normalized value
      Array.from(tagsSelect.options).forEach(opt => {
        const valNorm = opt.value.trim().toLowerCase();
        opt.selected = tagsArr.includes(valNorm);
      });

      // Sync our `selected` array
      selected = Array.from(tagsSelect.selectedOptions).map(o => o.value);
    }

    // Apply initial selection from API
    applyEventTags(events.tags || '');

    // Keep `selected` in sync when user changes the selection
    tagsSelect.addEventListener('change', function() {
      selected = Array.from(this.selectedOptions).map(o => o.value);
    });

    // ──────────────────────────────────────────────────────────────────────────
    // COPY-TO-CLIPBOARD HELPERS
    // ──────────────────────────────────────────────────────────────────────────
    function copyToClipboard(text) {
      const $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove();
    }
    $('#urlx').click(() => copyToClipboard($('#url').text()));
    $('#url2').click(() => copyToClipboard($('#url2').text()));

    // Show UI, hide loader
    document.querySelector('#loading').style.display        = "none";
    document.querySelector('#Item-Container').style.display = "flex";
  };

  request.send();
}

// Retry until `token` is valid, then load the event
const intervalIds = setInterval(function retryInit() {
  if (token && token.length === 40) {
    getevent();
    clearInterval(intervalIds);
  }
}, 1000);


// ────────────────────────────────────────────────────────────────────────────
// SAVE / UPDATE EVENT
// ────────────────────────────────────────────────────────────────────────────
const urltwo = "https://ubik.wiki/api/update/buying-queue/";
document.querySelector('#buybtn').addEventListener("click", () => {
  $('#buybtn').css({ pointerEvents: "none" });

  // Timestamp in Eastern Time
  const nowInEastern = moment().tz("America/New_York");
  const dategoal     = nowInEastern.format('MM/DD/YYYY, hh:mm A');

  // Gather form data
  const queueid       = location.href.split('id=')[1];
  const purchasetotal = document.querySelector('#purchasetotal').value;
  const quantityper   = document.querySelector('#quantityper').value;
  const section       = document.querySelector('#section').value;
  const buyingurgency = document.querySelector('#buyingurgency').value;
  const creditacc     = document.querySelector('#creditaccount').value;
  const presale       = document.querySelector('#presalecode').value;
  const note          = document.querySelector('#notes').value;

  const params = JSON.stringify({
    id:               queueid,
    purchase_total:   purchasetotal,
    quantity_per:     quantityper,
    section:          section,
    buying_urgency:   buyingurgency,
    credit_account:   creditacc,
    presale_code:     presale,
    purchase_notes:   note,
    added_timestamp:  dategoal,
    assign:           document.getElementById('assign').value,
    tags:             selected.join(',')
  });

  fetch(urltwo, {
    method: 'PUT',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: params
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      document.querySelector('#loading').style.display        = "flex";
      document.querySelector('#Item-Container').style.display = "none";
      setTimeout(() => {
        window.location.href = "/buy-queue";
      }, 750);
    })
    .catch(err => console.error(err));
});
