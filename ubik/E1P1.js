// ======================
// Globals & helpers
// ======================

let nexturl = null;
let prevurl = null;

let currentPage = 1;
let maxPages = 1;
const pageLimit = 100; // matches limit=100 in URL

// date-based sorter (unchanged)
let datear = function () {
  setTimeout(() => {
    let now = new Date();
    let date1 = moment(now).format('YYYY/MM/DD');
    $('.event-box')
      .sort(function (a, b) {
        if (date1 > $(b).attr('date')) {
          return 1;
        } else {
          return -1;
        }
      })
      .appendTo('#Cards-Container');
  }, 2500);
};

// ======================
// Enter key on search inputs
// ======================

let input = document.getElementById("searchbar1");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

input = document.getElementById("searchbar2");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

input = document.getElementById("searchbar3");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

input = document.getElementById("searchbar4");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

// ======================
// Main search click handler
// ======================

document.querySelector('#search-button').addEventListener("click", () => {
  document.querySelector('#loading').style.display = "flex";
  document.querySelector('#flexbox').style.display = "none";

  // trim trailing spaces
  let searchbar1 = document.getElementById('searchbar1');
  searchbar1.value = searchbar1.value.trimEnd();
  let searchbar2 = document.getElementById('searchbar2');
  searchbar2.value = searchbar2.value.trimEnd();
  let searchbar3 = document.getElementById('searchbar3');
  searchbar3.value = searchbar3.value.trimEnd();
  let searchbar4 = document.getElementById('searchbar4');
  searchbar4.value = searchbar4.value.trimEnd();

  let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
  let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
  let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value);
  let keywords4 = encodeURIComponent(document.getElementById('searchbar4').value);
  let addedbygoogle = document.getElementById('addedbygoogle').checked;

  $('.event-box').hide();

  let baseUrl = 'https://ubik.wiki/api/primary-events/?';
  let params = [];

  if (addedbygoogle) {
    params.push('added_by__icontains=google&site_venue_id__isblank=true');
  }

  if (keywords1.length > 0) {
    params.push('name__icontains=' + keywords1);
  }

  if (keywords2.length > 0) {
    params.push('site_event_id__icontains=' + keywords2);
  }

  if (keywords3.length > 0) {
    params.push('venue__icontains=' + keywords3);
  }

  if (keywords4.length > 0) {
    params.push('site_venue_id__icontains=' + keywords4);
  }

  params.push('limit=' + pageLimit);

  let xanoUrl = baseUrl + params.join('&');

  // wait for token to be available, then run the search
  let intervalIds = setInterval(function retryClickingSearchBar() {
    if (token && token.length === 40) {
      clearInterval(intervalIds);
      getEvents(xanoUrl);
    }
  }, 250);
});

// ======================
// Core fetch & render (with pagination + page counts)
// ======================

function getEvents(url) {
  document.querySelector('#loading').style.display = "flex";
  document.querySelector('#flexbox').style.display = "none";

  let request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.setRequestHeader("Content-type", "application/json; charset=utf-8");

  request.onload = function () {
    let data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      document.querySelector('#loading').style.display = "none";
      document.querySelector('#flexbox').style.display = "flex";
      const cardContainer = document.getElementById("Cards-Container");

      // remove old event cards except the template
      document.querySelectorAll('.event-box').forEach(box => {
        if (box.id !== 'samplestyle') {
          box.remove();
        }
      });

      // set pagination URLs from response
      nexturl = data.next || null;
      prevurl = data.previous || null;

      // optional: visually disable arrows when no page
      const rightArrow = document.getElementById('rightarrow');
      const leftArrow = document.getElementById('leftarrow');

      if (rightArrow) {
        rightArrow.classList.toggle('disabled', !nexturl);
      }
      if (leftArrow) {
        leftArrow.classList.toggle('disabled', !prevurl);
      }

      // --- PAGE COUNTS ---
      if (typeof data.count !== "undefined") {
        maxPages = Math.ceil(data.count / pageLimit);
      } else {
        maxPages = 1;
      }

      // determine current page from URL (offset-based)
      try {
        let u = new URL(url);
        let offset = parseInt(u.searchParams.get("offset") || "0", 10);
        currentPage = Math.floor(offset / pageLimit) + 1;
      } catch (e) {
        currentPage = 1;
      }

      let curpageElem = document.getElementById('curpage');
      let maxpagesElem = document.getElementById('maxpages');
      if (curpageElem) curpageElem.textContent = currentPage;
      if (maxpagesElem) maxpagesElem.textContent = maxPages;

      // render cards
      data.results.forEach(events => {
        const style = document.getElementById('samplestyle');
        const card = style.cloneNode(true);
        const evid = events.site_event_id;
        const eventdate = card.getElementsByClassName('main-text-date')[0];

        card.setAttribute('id', '');
        card.setAttribute('checked', 'false');
        card.setAttribute('name', events.name);

        if (events.date) {
          card.setAttribute('date', events.date.slice(0, 10).replaceAll("-", "/"));
          card.setAttribute('vivid_ed', events.date.slice(0, 10));

          let tdate = events.date.slice(0, 10).replaceAll("-", "/");
          tdate = [tdate.slice(5), tdate.slice(0, 4)].join('/');
          eventdate.textContent = tdate;
        }

        card.setAttribute('eventid', evid);
        if (events.time) {
          card.setAttribute('time', events.time.slice(0, 8));
        }
        card.setAttribute('source', events.scraper_name);
        card.setAttribute('vivid_id', events.vdid);

        card.addEventListener('click', function (event) {
          if (event.target.closest('.main-edit-button')) {
            return;
          }

          document.querySelector('#errortext').textContent = '';
          document.querySelector(".edit-wrapper").style.display = 'flex';
          document.querySelector('#editname').value = events.name;
          document.querySelector('#editdate').value = events.date;
          document.querySelector('#edittime').value = events.time;
          document.querySelector('#editeventid').value = events.site_event_id;
          document.querySelector('#editvenueid').value = events.site_venue_id;
          document.querySelector('#editurl').value = events.event_url;
          document.querySelector('#editsource').value = events.scraper_name;
          document.querySelector('#vdid').value = events.vdid;
        });

        card.style.display = 'flex';

        const eventname = card.getElementsByClassName('main-text-event')[0];
        eventname.textContent = events.name;
        if (eventname.textContent.length > 10) {
          eventname.textContent = events.name.slice(0, 10) + '..';
        }

        const eventur = card.getElementsByClassName('main-text-urls')[0];
        eventur.textContent = events.event_url;
        if (eventur.textContent.length > 15) {
          eventur.textContent = events.event_url.slice(0, 15) + '..';
        }

        const eventid = card.getElementsByClassName('main-text-event-id')[0];
        eventid.textContent = events.site_event_id;
        if (eventid.textContent.length > 10) {
          eventid.textContent = events.site_event_id.slice(0, 10) + '..';
        }

        const venue = card.getElementsByClassName('main-text-venue')[0];
        venue.textContent = events.venue;

        const deletebutton = card.getElementsByClassName('main-edit-button')[0];
        const evids = card.getAttribute('eventid');
        deletebutton.addEventListener('click', function () {
          document.querySelector('.edit-wrapper').style.display = 'none';
          const delUrl = `https://ubik.wiki/api/delete/primary-events/`;
          const bodyData = JSON.stringify({
            site_event_id: evids
          });

          fetch(delUrl, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: bodyData
          });

          card.style.display = 'none';
        });

        const venueid = card.getElementsByClassName('main-text-venue-id')[0];
        venueid.textContent = events.site_venue_id;

        if (events.time) {
          let eventtime = card.getElementsByClassName('main-text-time')[0];
          eventtime.textContent = events.time.slice(0, 8);
        }

        let txtsource = card.getElementsByClassName('main-textsource')[0];
        txtsource.textContent = events.scraper_name;

        let addedby = card.getElementsByClassName('main-addedby')[0];
        addedby.textContent = events.added_by;

        let timeadded = card.getElementsByClassName('main-timeadded')[0];
        timeadded.textContent = events.date_created;

        cardContainer.appendChild(card);
      });

      // optionally re-sort by date
      // datear();

      searchcompleted = true; // if you use this elsewhere

    } else if (request.status >= 400) {
      document.querySelector('#loading').style.display = "none";
      document.querySelector('#flexbox').style.display = "flex";
      console.log('searchfailed');
    }
  };

  request.send();
}

// ======================
// Pagination: constructURL + arrows
// ======================

function constructURL(url) {
  if (!url) return;
  getEvents(url);
}

document.getElementById('rightarrow').addEventListener('click', function () {
  if (nexturl) {
    constructURL(nexturl);
  }
});

document.getElementById('leftarrow').addEventListener('click', function () {
  if (prevurl) {
    constructURL(prevurl);
  }
});

// ======================
// Cleanup interval for hidden boxes (original logic)
// ======================

let cleanupIntervalId = window.setInterval(function () {
  let boxes = document.querySelectorAll('.event-box');
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
      boxes[i].remove();
    }
  }
}, 100);
