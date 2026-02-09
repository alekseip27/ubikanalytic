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
  searchbar1.value = searchbar1.value.trimEnd();
  searchbar2.value = searchbar2.value.trimEnd();
  searchbar3.value = searchbar3.value.trimEnd();

  const keywords1 = encodeURIComponent(searchbar1.value);
  const keywords2 = encodeURIComponent(searchbar2.value);
  const keywords3 = encodeURIComponent(searchbar3.value);

  const baseUrl = 'https://ubik.wiki/api/tevo-missing/?';
  const params = [];

  if (keywords1.length > 0) params.push('event_name__icontains=' + keywords1);
  if (keywords2.length > 0) params.push('site_event_id__icontains=' + keywords2);
  if (keywords3.length > 0) params.push('venue_name__icontains=' + keywords3);

  params.push('limit=100');

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
        card.setAttribute('cardid', events.id);
        card.setAttribute('email', events.email ?? '');
        // If you actually want DOM id, it must be unique:
        card.setAttribute('data-event-id', String(events.id));

        card.style.display = 'flex';



    const eventnamecard = card.getElementsByClassName('main-text-event-name')[0]
    eventnamecard.textContent = events.event_name;

    const siteeventidcard = card.getElementsByClassName('main-text-event-id')[0]
    siteeventidcard.textContent = events.site_event_id;

    const eventdatecard = card.getElementsByClassName('main-text-eventdate')[0]
    eventdatecard.textContent = events.event_date;

    const eventtimecard = card.getElementsByClassName('main-text-eventtime')[0]
    eventtimecard.textContent = events.event_time;

    const venuenamecard = card.getElementsByClassName('main-text-venuename')[0]
    venuenamecard.textContent = events.venue_name;

    const vividvenueidcard = card.getElementsByClassName('main-text-vivid-venue-id')[0]
    vividvenueidcard.textContent = events.vivid_venue_id;

    const performernamecard = card.getElementsByClassName('main-text-performername')[0]
    performernamecard.textContent = events.performer_name;


    const performeridcard = card.getElementsByClassName('main-text-vivid-performer-id')[0]
    performeridcard.textContent = events.vivid_performer_id;



        // Delete button: 2-click confirm
        const deletebutton = card.getElementsByClassName('main-edit-button')[0];
        const cardid = card.getAttribute('cardid');
        let clickCount = 0;

        if (deletebutton) {
          deletebutton.addEventListener('click', function () {
            if (clickCount === 0) {
              deletebutton.style.color = 'red';
              clickCount = 1;
              return;
            }

            // Second click
            document.querySelector('.edit-wrapper')?.style && (document.querySelector('.edit-wrapper').style.display = 'none');

            const url = `https://ubik.wiki/api/delete/tevo-missing/`;
            const bodyData = JSON.stringify({ id: cardid });

            fetch(url, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: bodyData
            })
              .then(response => {
                if (response.ok) {
                  card.style.display = 'none';
                  // optional: remove from DOM
                  card.remove();
                } else {
                  console.error('Failed to delete:', response.statusText);
                  showError('Failed to delete item.');
                }
              })
              .catch(error => {
                console.error('Error:', error);
                showError('Delete request failed.');
              })
              .finally(() => {
                clickCount = 0;
                deletebutton.style.color = '';
              });
          });
        }

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
['searchbar1', 'searchbar2', 'searchbar3'].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
});
