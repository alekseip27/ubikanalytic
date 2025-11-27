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



// optional date sorter (kept as you had it)
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

{
  var input = document.getElementById("searchbar4");
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
        const evid = encodeURIComponent(events.id);

        card.setAttribute('id', '');
        card.setAttribute('checked', 'false');
        card.setAttribute('name', events.event_name);
        card.setAttribute('eventid', evid);
        card.setAttribute('source', events.purchase_source);

        card.addEventListener('click', function (event) {

          if (event.target.closest('.main-edit-button')) {
            return;
          }

          cardid = events.id; // you had this
          document.querySelector('#errortext').textContent = '';
          document.querySelector(".edit-wrapper").style.display = 'flex';

          document.querySelector('#editid').value = events.event_id;
          document.querySelector('#editname').value = events.event_name;
          document.querySelector('#editvenue').value = events.event_venue;
          document.querySelector('#editconfirmation').value = events.confirmation;
          document.querySelector('#editaccount').value = events.purchase_account.slice(0, 1).toUpperCase();
          document.querySelector('#editemail').value = events.purchase_email;
          document.querySelector('#editpquantity').value = events.purchase_quantity;
          document.querySelector('#editsource').value = events.purchase_source;
          document.querySelector('#edit-requested').value = events.purchase_requested;
          document.querySelector('#edit-boughtby').value = events.purchased_by;
          document.querySelector('#edit-pdate').value = events.purchase_date;
          document.querySelector('#edit-urgency').value = events.purchase_urgency;
          document.querySelector('#edit-eventdate').value = events.event_date;
        });

        card.style.display = 'flex';

        const evname = card.getElementsByClassName('main-text-enm')[0];
        evname.textContent = events.event_name;
        if (evname.textContent.length > 15) {
          evname.textContent = events.event_name.slice(0, 15) + '..';
        }

        const evenue = card.getElementsByClassName('main-text-even')[0];
        evenue.textContent = events.event_venue;
        if (evenue.textContent.length > 15) {
          evenue.textContent = events.event_venue.slice(0, 15) + '..';
        }

        const confirmation = card.getElementsByClassName('main-text-conf')[0];
        confirmation.textContent = events.confirmation;
        if (confirmation.textContent.length > 15) {
          confirmation.textContent = events.confirmation.slice(0, 15) + '..';
        }

        const emails = card.getElementsByClassName('main-text-emls')[0];
        emails.textContent = events.purchase_email;

        const pquant = card.getElementsByClassName('main-text-purchquant')[0];
        pquant.textContent = events.purchase_quantity;

        const requested = card.getElementsByClassName('main-text-requested')[0];
        requested.textContent = events.purchase_requested;

        const purchasedby = card.getElementsByClassName('main-text-purchasedby')[0];
        purchasedby.textContent = events.purchased_by;

        const pdate = card.getElementsByClassName('main-text-purchasedate')[0];
        pdate.textContent = events.purchase_date;

        const urgency = card.getElementsByClassName('main-text-urgency')[0];
        urgency.textContent = events.purchase_urgency;

        const difference = card.getElementsByClassName('main-text-difference')[0];
        difference.textContent = events.purchase_difference;

        const deletebutton = card.getElementsByClassName('main-edit-button')[0];
        const evids = card.getAttribute('eventid');
        deletebutton.addEventListener('click', function () {
          document.querySelector('.edit-wrapper').style.display = 'none';
          const delUrl = `https://ubik.wiki/api/delete/order-history/`;
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
  var searchbar4 = document.getElementById('searchbar4');
  searchbar4.value = searchbar4.value.trimEnd();

  let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
  let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
  let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value);
  let keywords4 = encodeURIComponent(document.getElementById('searchbar4').value);

  $('.event-box').hide();

  let baseUrl = 'https://ubik.wiki/api/order-history/?';
  let params = [];

  if (keywords1.length > 0) {
    params.push('event_name__icontains=' + keywords1);
  }

  if (keywords2.length > 0) {
    params.push('confirmation__icontains=' + keywords2);
  }

  if (keywords3.length > 0) {
    params.push('purchased_by__icontains=' + keywords3);
  }

  if (keywords4.length > 0) {
    params.push('purchase_email__icontains=' + keywords4);
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
