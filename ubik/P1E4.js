// ======================
// Globals
// ======================

let nexturl = null;
let prevurl = null;

let currentPage = 1;
let maxPages = 1;
const pageLimit = 100; // matches limit=100 in URL




// ======================
// Optional date sorter (kept from your code)
// ======================

let datear = function () {
  setTimeout(() => {
    let now = new Date();
    let date1 = moment(now).format('YYYY/MM/DD');
    $('.event-box')
      .sort(function (a, b) {
        if (date1 > $(b).attr('date')) { return 1; }
        else { return -1; }
      })
      .appendTo('#Cards-Container');
  }, 2500);
};


// ======================
// Enter key on search inputs
// ======================

{
  var input = document.getElementById("searchbar1");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
}

{
  var input = document.getElementById("searchbar2");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
}

{
  var input = document.getElementById("searchbar3");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
}

// ======================
// Core fetch & render with pagination
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

      const rightArrow = document.getElementById('rightarrow');
      const leftArrow = document.getElementById('leftarrow');

      if (rightArrow) {
        rightArrow.classList.toggle('disabled', !nexturl);
      }
      if (leftArrow) {
        leftArrow.classList.toggle('disabled', !prevurl);
      }

      // page counts
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
        const evid = events.id;

        card.setAttribute('id', '');
        card.setAttribute('checked', 'false');
        card.setAttribute('name', events.artist_name); // fixed from events.name
        card.setAttribute('eventid', evid);

        card.addEventListener('click', function (eventObj) {

          if (eventObj.target.closest('.main-edit-button')) {
            return;
          }

          document.querySelector('#errortext').textContent = '';
          document.querySelector(".edit-wrapper").style.display = 'flex';

          document.querySelector('#edit-id').value = events.id;

          document.querySelector('#edit-name').value = events.artist_name;
          document.querySelector('#edit-aliases').value = events.artist_aliases;

          document.querySelector('#edit-vividid').value = events.vivid_id;

          document.querySelector('#edit-tevoid').value = events.tevo_id;

        });

        card.style.display = 'flex';

        const performer = card.getElementsByClassName('main-text-performer')[0];
        performer.textContent = events.artist_name;

        const aliases = card.getElementsByClassName('main-text-aliases')[0];
        aliases.textContent = events.artist_aliases || '';

        const vividid = card.getElementsByClassName('main-text-vivid-id')[0];
        vividid.textContent = events.vivid_id;

        const tevoid = card.getElementsByClassName('main-text-tevo-id')[0];
        tevoid.textContent = events.tevo_id;

        const deletebutton = card.getElementsByClassName('main-edit-button')[0];
        const evids = card.getAttribute('eventid');
        deletebutton.addEventListener('click', function () {
          document.querySelector('.edit-wrapper').style.display = 'none';
          const delUrl = `https://ubik.wiki/api/delete/artists/`;
          const bodyData = JSON.stringify({
            id: evids
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

      // update counter after render

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

  var searchbar1 = document.getElementById('searchbar1');
  searchbar1.value = searchbar1.value.trimEnd();
  var searchbar2 = document.getElementById('searchbar2');
  searchbar2.value = searchbar2.value.trimEnd();
  var searchbar3 = document.getElementById('searchbar3');
  searchbar3.value = searchbar3.value.trimEnd();

  let cb1 = document.getElementById('tevo-id').checked;
  let cb2 = document.getElementById('vivid-id').checked;

  let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
  let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
  let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value);

  $('.event-box').hide();

  let baseUrl = 'https://ubik.wiki/api/artists/?';
  let params = [];

  if (keywords1.length > 0) {
    params.push('artist_name__icontains=' + keywords1);
  }

  if (keywords2.length > 0) {
    params.push('vivid_id__icontains=' + keywords2);
  }

  if (keywords3.length > 0) {
    params.push('tevo_id__icontains=' + keywords3);
  }

  if (cb1) {
    // no leading "&" here; params.join('&') will handle separation
    params.push('tevo_id__isblank=true');
  }

  if (cb2) {
    params.push('vivid_id__isblank=true');
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
  var intervalId = window.setInterval(function () {
    let boxes = document.querySelectorAll('.event-box');
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
        boxes[i].remove();
      }
    }
  }, 100);
}
