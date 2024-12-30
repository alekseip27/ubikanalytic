
document.getElementById('rightarrow').addEventListener('click', function() {
  if(nexturl){
  constructURL(nexturl)
  }
  });


  document.getElementById('leftarrow').addEventListener('click', function() {
  if(prevurl){
  constructURL(prevurl)
  }
  });

  function constructURL(next) {
      document.querySelector('#loading').style.display = "flex";
      document.querySelector('#flexbox').style.display = "none";

      var searchbar1 = document.getElementById('searchbar1');
      searchbar1.value = searchbar1.value.trimEnd();

      var searchbar2 = document.getElementById('searchbar2');
      searchbar2.value = searchbar2.value.trimEnd();

      var searchbar3 = document.getElementById('searchbar3');
      searchbar3.value = searchbar3.value.trimEnd();

      let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
      let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
      let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value);

    let cb1 = document.getElementById('closed-check').checked
    let cb2 = document.getElementById('paused-check').checked

      let baseUrl = 'https://ubik.wiki/api/purchasing-accounts/?';

      let params = [];

    if (keywords1.length > 0) {
        params.push('email__icontains=' + keywords1)
    }

    if (keywords2.length > 0) {
        params.push('state__icontains=' + keywords2)
    }

    if (keywords3.length > 0) {
        params.push('phone_number__icontains=' + keywords3)
    }

    if (cb1) {
    params.push('&closed__iexact=true');
    }

    if (cb2) {
    params.push('&paused__iexact=true');
    }

      params.push('limit=100');


  $('.event-box').hide()

  xanoUrl = ''

  if (next) {
    const nurl = new URL(next);
    const param = new URLSearchParams(nurl.search);
    const offset = param.get('offset');
    console.log('Offset:', offset);
    params.push('offset=' + offset);
    xanoUrl = nurl.origin + nurl.pathname + '?' + params.join('&');
    } else {
    xanoUrl = baseUrl + params.join('&');
    }
    getEvents(xanoUrl);
    }

    document.querySelector('#search-button').addEventListener("click", () => {
    constructURL()
    })
    function getEvents(fetchurl) {
      let request = new XMLHttpRequest();
  
      request.open('GET', fetchurl, true);
      request.setRequestHeader("Content-type", "application/json; charset=utf-8");
      request.setRequestHeader('Authorization', `Bearer ${token}`);
      request.onload = function () {
          let data = JSON.parse(this.response);
  
          if (request.status >= 200 && request.status < 400) {
              $('.event-box').hide();
  
              nexturl = data.next;
              prevurl = data.previous;
  
              // Calculate total pages
              const totalResults = data.count;
              const resultsPerPage = 100;
              const totalPages = Math.ceil(totalResults / resultsPerPage);
  
              document.getElementById('maxpages').textContent = totalPages;
  
              let currentPage = 1;
  
              if (nexturl) {
                  const match = nexturl.match(/offset=(\d+)/);
                  if (match && match[1]) {
                      const offset = parseInt(match[1]);
                      currentPage = Math.ceil(offset / resultsPerPage);
                  }
              } else if (prevurl) {
                  // If `nexturl` is missing but `prevurl` exists, we're on the last page
                  currentPage = totalPages;
              }
  
              document.getElementById('curpage').textContent = currentPage;
  
              if (!nexturl && !prevurl) {
                  // For single-page result
                  document.getElementById('maxpages').textContent = '1';
                  document.getElementById('curpage').textContent = '1';
              }
  

        document.querySelector('#loading').style.display = "none";
        document.querySelector('#flexbox').style.display = "flex";

  const cardContainer = document.getElementById("Cards-Container")

  data.results.forEach(events => {
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)
    const idcard =  events.id

    card.setAttribute('id', '');
    card.setAttribute('cardid', idcard);

    card.setAttribute('email', events.email);
    card.setAttribute('id', events.id);

    card.addEventListener('click', function(){

    if (event.target.closest('.main-edit-button')) {
    return;
    }

    document.querySelector('#errortext').textContent = ''
    document.querySelector(".edit-wrapper").style.display = 'flex'

        
 		document.querySelector('#closed').checked = events.closed
    document.querySelector('#paused').checked = events.paused
    document.querySelector('#editid').value = events.id
    document.querySelector('#edit-email').value = events.email
    document.querySelector('#edit-fname').value = events.first_name
    document.querySelector('#edit-lname').value = events.last_name
    document.querySelector('#edit-gender').value = events.gender
    document.querySelector('#edit-bday').value = events.birthdate
    document.querySelector('#edit-pnumber').value = events.phone_number
    document.querySelector('#edit-plocation').value = events.phone_location
    document.querySelector('#edit-country').value = events.country
    document.querySelector('#edit-address').value = events.address
    document.querySelector('#edit-city').value = events.city
    document.querySelector('#edit-state').value = events.state
    document.querySelector('#edit-zip').value = events.zip
    document.querySelector('#edit-created').value = events.created_date
    })

    card.style.display = 'flex';

    const emailcard = card.getElementsByClassName('main-text-acc')[0]
    emailcard.textContent = events.email;

    const numbercard = card.getElementsByClassName('main-text-numbers')[0]
    numbercard.textContent = events.phone_number;

    const fname = card.getElementsByClassName('main-text-fname')[0]
    fname.textContent = events.first_name

    const lname = card.getElementsByClassName('main-text-lname')[0]
    lname.textContent = events.last_name;

    const addresscard = card.getElementsByClassName('main-text-address')[0]
    addresscard.textContent = events.address;

    if(addresscard.textContent.length>10) {
    addresscard.textContent = events.address.slice(0, 10)+'...'
    }

    const statecard = card.getElementsByClassName('main-text-states')[0]
    statecard.textContent = events.state;

    const zipcard = card.getElementsByClassName('main-text-zip')[0]
    zipcard.textContent = events.zip;

    const countrycard = card.getElementsByClassName('main-text-countrys')[0]
    countrycard.textContent = events.country;

    const gendercard = card.getElementsByClassName('main-text-genders')[0]
    gendercard.textContent = events.gender;


    const deletebutton = card.getElementsByClassName('main-edit-button')[0];
    const cardid = card.getAttribute('cardid');
    let clickCount = 0; // Track the number of clicks on deletebutton

    deletebutton.addEventListener('click', function() {
        if (clickCount === 0) {
            // First click: change button color to red
            deletebutton.style.color = 'red';
            clickCount++; // Increment click count
        } else if (clickCount === 1) {
            // Second click: run the API call and hide elements
            document.querySelector('.edit-wrapper').style.display = 'none';
            const url = `https://ubik.wiki/api/delete/purchasing-accounts/`;
            const bodyData = JSON.stringify({
                id: cardid
            });

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
                    // Hide the card only if the API call is successful
                    card.style.display = 'none';
                } else {
                    console.error('Failed to delete:', response.statusText);
                }
            })
            .catch(error => console.error('Error:', error));

            clickCount = 0; // Reset click count in case of re-use
        }
    });

    cardContainer.appendChild(card);
    })
   }}

  request.send();

  }

  {
      var intervalId = window.setInterval(function(){
      let boxes = document.querySelectorAll('.event-box')
      for (let i = 0; i<boxes.length;i++) {
      if(boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
      boxes[i].remove()
      }}
      }, 100);
  }

  let intervalIds;

function retryClickingSearchBar() {
  if (token.length === 40) {
      constructURL()
  clearInterval(intervalIds);
  }}

intervalIds = setInterval(retryClickingSearchBar, 1000);



  var input = document.getElementById("searchbar1");
  input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
  event.preventDefault();
  document.getElementById("search-button").click();
  }
  });
  var input = document.getElementById("searchbar2");
  input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
  event.preventDefault();
  document.getElementById("search-button").click();
  }
  });
  var input = document.getElementById("searchbar3");
  input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
  event.preventDefault();
  document.getElementById("search-button").click();
  }
  });
