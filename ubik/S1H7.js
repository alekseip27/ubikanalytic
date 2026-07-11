
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
        card.setAttribute('cardid', events.site_event_id);
        card.setAttribute('email', events.email ?? '');
        // If you actually want DOM id, it must be unique:
        card.setAttribute('data-event-id', String(events.id));

        card.style.display = 'flex';



    const invoicedatecard = card.getElementsByClassName('main-text-invoicedate')[0]
    invoicedatecard.textContent = events.invoice_date;

    const eventdatecard = card.getElementsByClassName('main-text-eventdate')[0]
    eventdatecard.textContent = events.event_date;

    const performernamecard = card.getElementsByClassName('main-text-performern')[0]
    performernamecard.textContent = events.performer;

    if(performernamecard.textContent.length>10) {
    performernamecard.textContent = events.performer.slice(0, 10)+'...'
    }
        
    const venuenamecard = card.getElementsByClassName('main-text-venuen')[0]
    venuenamecard.textContent = events.venue_name;

    if(venuenamecard.textContent.length>10) {
    venuenamecard.textContent = events.venue_name.slice(0, 10)+'...'
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

const vividseatsbtn = card.getElementsByClassName('vividseats-url-btn')[0];
vividseatsbtn.addEventListener('click', () => {
  const w = window.open(events.vividseats_url, 'vividmain');
  if (w) w.focus();
});

const stubhubbtn = card.getElementsByClassName('stubhub-url-button')[0];
stubhubbtn.addEventListener('click', () => {
  const w = window.open(events.stubhub_url, 'stubhubmain');
  if (w) w.focus();
});

        // ✅ Append card immediately (NOT inside delete click)
        cardContainer.appendChild(card);
      });

      // periodic cleanup of hidden boxes (your original idea, but safer)
      startCleanupInterval();

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
['searchbar1', 'searchbar2', 'searchbar3','searchbar4','searchbar5'].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
});
