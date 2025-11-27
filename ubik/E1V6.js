// ======================
// Globals
// ======================

let nexturl = null;
let prevurl = null;

let currentPage = 1;
let maxPages = 1;
const pageLimit = 100; // matches limit=100 in URL

// ======================
// Result counter
// ======================


// date sort (if you use it somewhere)
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

{
  let input = document.getElementById("searchbar1");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
}

{
  let input = document.getElementById("searchbar2");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
}

{
  let input = document.getElementById("searchbar3");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
}

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

      // clear old cards except template
      document.querySelectorAll('.event-box').forEach(box => {
        if (box.id !== 'samplestyle') {
          box.remove();
        }
      });

      // pagination URLs
      nexturl = data.next || null;
      prevurl = data.previous || null;

      // optionally disable arrows
      const rightArrow = document.getElementById('rightarrow');
      const leftArrow = document.getElementById('leftarrow');

      if (rightArrow) {
        rightArrow.classList.toggle('disabled', !nexturl);
      }
      if (leftArrow) {
        leftArrow.classList.toggle('disabled', !prevurl);
      }

      // page counts (from data.count + offset)
      if (typeof data.count !== 'undefined') {
        maxPages = Math.ceil(data.count / pageLimit);
      } else {
        maxPages = 1;
      }

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
        const evid = events.site_venue_id;

        card.setAttribute('id', '');
        card.setAttribute('checked', 'false');
        card.setAttribute('name', events.name);

        card.setAttribute('eventid', evid);
        card.setAttribute('source', events.source_site);

        card.addEventListener('click', function (event) {

          if (event.target.closest('.main-edit-button')) {
            return;
          }

          document.querySelector('#errortext').textContent = '';
          document.querySelector(".edit-wrapper").style.display = 'flex';

          document.querySelector('#editvenueid').value = events.site_venue_id;
          document.querySelector('#editvenueidvs').value = events.vivid_venue_id;
          document.querySelector('#editvenueidsh').value = events.stubhub_venue_id;

          document.querySelector('#editwarning').value = events.warning;

          document.querySelector('#editpref1').value = events.pref_section1;
          document.querySelector('#editpref2').value = events.pref_section2;
          document.querySelector('#editpref3').value = events.pref_section3;

          document.querySelector('#editurl').value = events.venue_url;
          document.querySelector('#editurlsh').value = events.stubhub_url;
          document.querySelector('#editurlvs').value = events.vivid_url;

          document.querySelector('#editname').value = events.name;
          document.querySelector('#editcity').value = events.city;
          document.querySelector('#editsource').value = events.source_site;
          document.querySelector('#editstate').value = events.state;
          document.querySelector('#editcountry').value = events.country;
          document.querySelector('#editzip').value = events.zip_code;
          document.querySelector('#edit-tzone').value = events.timezone;
          document.querySelector('#edit-capacity').value = events.capacity;
          document.querySelector('#edit-addedby').value = events.created_by;
          document.querySelector('#edit-addedtime').value = events.created_date;

          document.querySelector('#edit-venuetags').value = events.venue_tags;

          document.querySelector('#edit-tevoid').value = events.tevo_venue_id;
        });

        card.style.display = 'flex';

        const venueids = card.getElementsByClassName('main-text-venueid')[0];
        venueids.textContent = events.site_venue_id;
        if (venueids.textContent.length > 15) {
          venueids.textContent = events.site_venue_id.slice(0, 15) + '..';
        }

        const venurl = card.getElementsByClassName('main-text-url')[0];
        venurl.textContent = events.venue_url;
        if (venurl.textContent.length > 15) {
          venurl.textContent = events.venue_url.slice(0, 15) + '..';
        }

        const venuename = card.getElementsByClassName('main-text-vname')[0];
        venuename.textContent = events.name;
        if (venuename.textContent.length > 10) {
          venuename.textContent = events.name.slice(0, 10) + '..';
        }

        const vencity = card.getElementsByClassName('main-text-city')[0];
        vencity.textContent = events.city;

        const vensrc = card.getElementsByClassName('main-text-srcs')[0];
        vensrc.textContent = events.source_site;

        const venstate = card.getElementsByClassName('main-text-state')[0];
        venstate.textContent = events.state;

        const vencntry = card.getElementsByClassName('main-text-country')[0];
        vencntry.textContent = events.country;

        const venzip = card.getElementsByClassName('main-text-zipcode')[0];
        venzip.textContent = events.zip_code;

        const timezone = card.getElementsByClassName('main-text-timezone')[0];
        timezone.textContent = events.timezone;

        const venuecap = card.getElementsByClassName('main-text-venuecap')[0];
        venuecap.textContent = events.capacity;

        const addedby = card.getElementsByClassName('main-text-addedby')[0];
        addedby.textContent = events.created_by;

        const tevoid = card.getElementsByClassName('main-text-tevo-id')[0];
        tevoid.textContent = events.tevo_venue_id;

        const addedtime = card.getElementsByClassName('main-text-timeadded')[0];
        addedtime.textContent = events.created_date;

        const deletebutton = card.getElementsByClassName('main-edit-button')[0];
        const evids = card.getAttribute('eventid');
        deletebutton.addEventListener('click', function () {
          document.querySelector('.edit-wrapper').style.display = 'none';
          const delUrl = `https://ubik.wiki/api/delete/venues/`;
          const bodyData = JSON.stringify({
            site_venue_id: evids
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

        cardContainer.appendChild(card);
      });


      searchcompleted = true;

    } else if (request.status > 400) {
      document.querySelector('#loading').style.display = "none";
      document.querySelector('#flexbox').style.display = "flex";
      console.log('searchfailed');
    }
  };

  request.send();
}

// ======================
// Search button handler
// ======================

document.querySelector('#search-button').addEventListener("click", () => {
  document.querySelector('#loading').style.display = "flex";
  document.querySelector('#flexbox').style.display = "none";

  let searchbar1 = document.getElementById('searchbar1');
  searchbar1.value = searchbar1.value.trimEnd();
  let searchbar2 = document.getElementById('searchbar2');
  searchbar2.value = searchbar2.value.trimEnd();
  let searchbar3 = document.getElementById('searchbar3');
  searchbar3.value = searchbar3.value.trimEnd();

  let cb1 = document.getElementById('tevo-id').checked;
  let cb2 = document.getElementById('vivid-id').checked;
  let cb3 = document.getElementById('shub-id').checked;

  let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
  let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
  let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value);

  $('.event-box').hide();

  let baseUrl = 'https://ubik.wiki/api/venues/?';
  let params = [];

  if (keywords1.length > 0) {
    params.push('name__icontains=' + keywords1);
  }

  if (keywords2.length > 0) {
    params.push('site_venue_id__icontains=' + keywords2);
  }

  if (keywords3.length > 0) {
    params.push('source_site__icontains=' + keywords3);
  }

  if (cb1) {
    params.push('tevo_venue_id__isblank=true');
  }

  if (cb2) {
    params.push('vivid_venue_id__isblank=true');
  }

  if (cb3) {
    params.push('stubhub_venue_id__isblank=true');
  }

  params.push('limit=' + pageLimit);

  let xanoUrl = baseUrl + params.join('&');

  let intervalIds = setInterval(function retryClickingSearchBar() {
    if (token && token.length === 40) {
      clearInterval(intervalIds);
      getEvents(xanoUrl);
    }
  }, 250);
});

// ======================
// Pagination arrows
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
// Cleanup hidden boxes
// ======================

{
  let intervalId = window.setInterval(function () {
    let boxes = document.querySelectorAll('.event-box');
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
        boxes[i].remove();
      }
    }
  }, 100);
}
