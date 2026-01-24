
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
    let cb3 = document.getElementById('tmrestricted-check').checked
    
    )
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

    
    if (cb3) {
    params.push('&tm_restricted=true');
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

    if (event.target.closest('.main-text-ip')) {
    return;
    }

    if (event.target.closest('.fwrefresh')) {
    return;
    }

    document.querySelector('#errortext').textContent = ''
    document.querySelector(".edit-wrapper").style.display = 'flex'


 		document.querySelector('#closed').checked = events.closed
    document.querySelector('#paused').checked = events.paused
    document.querySelector('#tmrestrict').checked = events.tm_restricted
    document.querySelector('#editid').value = events.id
    document.querySelector('#edit-email').value = events.email
    document.querySelector('#edit-fname').value = events.first_name
    document.querySelector('#edit-lname').value = events.last_name
    document.querySelector('#edit-gender').value = events.gender
    document.querySelector('#edit-bday').value = events.birthdate
    document.querySelector('#edit-pnumber').value = events.phone_number
    document.querySelector('#edit-tm-number').value = events.tm_phone_number
    document.querySelector('#edit-plocation').value = events.phone_location
    document.querySelector('#edit-country').value = events.country
    document.querySelector('#edit-address').value = events.address
    document.querySelector('#edit-city').value = events.city
    document.querySelector('#edit-state').value = events.state
    document.querySelector('#edit-zip').value = events.zip
    document.querySelector('#edit-cards').value = events.cards
    document.querySelector('#edit-created').value = events.created_date
    })

    card.style.display = 'flex';

    const emailcard = card.getElementsByClassName('main-text-acc')[0]
    emailcard.textContent = events.email;

    const numbercard = card.getElementsByClassName('main-text-numbers')[0]
    numbercard.textContent = events.phone_number;

    const tmnumbercard = card.getElementsByClassName('main-text-tmnum')[0]
    tmnumbercard.textContent = events.tm_phone_number;

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
retrieveProxys()
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




async function retrieveProxys() {
  if (typeof token === 'undefined') {
    console.error('token is not defined. Define token (Bearer) before running this script.');
    return;
  }

  const url = 'https://ubik.wiki/api/proxy-manager/?active__icontains=yes&limit=1000';

  function findEventBoxByEmail(email) {
    if (window.CSS && CSS.escape) {
      try {
        return document.querySelector(`.event-box[email="${CSS.escape(email)}"]`);
      } catch (e) {}
    }
    const boxes = document.querySelectorAll('.event-box');
    for (const b of boxes) {
      if (b.getAttribute('email') === email) return b;
    }
    return null;
  }

  async function fetchAllResults(startUrl) {
    const all = [];
    let next = startUrl;
    while (next) {
      console.log('Fetching', next);
      const resp = await fetch(next, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!resp.ok) {
        throw new Error(`Fetch failed for ${next} — status ${resp.status} ${resp.statusText}`);
      }
      const data = await resp.json();
      if (!data || !Array.isArray(data.results)) {
        throw new Error('Unexpected response format (no results array)');
      }
      all.push(...data.results);
      next = data.next;
    }
    return all;
  }

  try {
    const proxies = await fetchAllResults(url);
    console.log(`Fetched ${proxies.length} proxy items.`);

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const item of proxies) {
      const email = item.email;
      if (!email) {
        console.warn('Skipping item without email:', item);
        continue;
      }

      const box = findEventBoxByEmail(email);
      if (!box) {
        notFoundCount++;
        continue;
      }

      const ip = item.ip ?? '';
      const username = item.name ?? '';
      const dataid = item.id ?? '';

      const ipText = ip;
      const proxyText = ipText;

      const ipNode = box.querySelector('.main-text-ip');
      const proxyNode = box.querySelector('.main-text-proxy');

      if (ipNode) {
        ipNode.textContent = proxyText || '\u00A0';
      }
      if (proxyNode) {
        proxyNode.textContent = username || '\u00A0';
        proxyNode.setAttribute("data-id",dataid)
      }

      updatedCount++;
    }

    console.log(`Update complete. Updated: ${updatedCount}, Not found in DOM: ${notFoundCount}`);
    document.querySelectorAll(".event-box .fwrefresh").forEach(btn => {
  btn.addEventListener("click", () => {
    const eventBox = btn.closest(".event-box");
    if (!eventBox) {
      console.warn("⚠️ .fwrefresh clicked but no parent .event-box found.");
      return; // graceful skip
    }
    fetchFirstUnassignedProxy(eventBox);
  });
});
  } catch (err) {
    console.error('Error during fetch/update:', err);
  }
}


// Optional: tiny helper to sanity-check email-ish strings
const looksLikeEmail = (str) => typeof str === "string" && /\S+@\S+\.\S+/.test(str);

async function fetchFirstUnassignedProxy(eventBox) {
  if (!eventBox) {
    console.warn("⚠️ fetchFirstUnassignedProxy called without an eventBox.");
    return;
  }

  // Get email text from this event box (gracefully handle missing)
  const emailNode = eventBox.querySelector(".main-text-acc");
  const current_email = emailNode?.textContent?.trim();

  if (!current_email) {
    console.warn("⚠️ Skipping: .main-text-acc missing or empty in this .event-box.", eventBox);
    return; // graceful skip
  }
  if (!looksLikeEmail(current_email)) {
    console.warn("⚠️ Skipping: .main-text-acc text doesn't look like an email:", current_email, eventBox);
    return; // graceful skip
  }

  // Scoped elements for this box
  const proxyElement = eventBox.querySelector(".main-text-proxy");
  const ipElement = eventBox.querySelector(".main-text-ip");

  if (!proxyElement || !ipElement) {
    console.warn("⚠️ Skipping: Required elements (.main-text-proxy / .main-text-ip) not found in this .event-box.", eventBox);
    return; // graceful skip
  }

  const url = "https://ubik.wiki/api/proxy-manager/?email__isblank=true&active__idoesnotcontains=no";

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error("❌ Failed to fetch unassigned proxies:", await res.text());
      return;
    }

    const json = await res.json();
    const result = json.results?.[0];

    if (!result) {
      console.warn("⚠️ No unassigned proxies found.");
      return;
    }

    const oldProxy = proxyElement.textContent.trim();
    const oldIp = ipElement.textContent.trim();
    const oldID = proxyElement.getAttribute("data-id") || "";

    console.log("🔁 Replacing old values:", { oldProxy, oldIp, oldID });

    // Unassign old proxy (if any)
    if (oldID) {
      const unassignPayload = { id: oldID, email: "", active: "no" };
      try {
        const putRes = await fetch("https://ubik.wiki/api/update/proxy-manager/", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(unassignPayload)
        });
        if (!putRes.ok) {
          console.error("❌ Failed to unassign old proxy:", await putRes.text());
        } else {
          console.log("✅ Old proxy unassigned.");
        }
      } catch (err) {
        console.error("❌ PUT network error (unassign):", err);
      }
    }

    // Assign new proxy to this email
    const newProxy = result.name || "[No Name]";
    const newIp = result.ip || "[No IP]";
    const newID = result.id;

    const assignPayload = { id: newID, active: "yes", email: current_email };
    try {
      const assignRes = await fetch("https://ubik.wiki/api/update/proxy-manager/", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(assignPayload)
      });

      if (!assignRes.ok) {
        console.error("❌ Failed to assign new proxy:", await assignRes.text());
        return;
      }
      console.log("✅ New proxy assigned to", current_email);
    } catch (err) {
      console.error("❌ PUT error assigning new proxy:", err);
      return;
    }

    // Update UI in this box only
    proxyElement.textContent = newProxy;
    proxyElement.setAttribute("data-id", newID);
    ipElement.textContent = newIp;

    console.log("✅ Updated proxy:", newProxy, newIp);
  } catch (err) {
    console.error("❌ Network error while fetching unassigned proxy:", err);
  }
}
