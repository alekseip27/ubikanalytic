initsource = false

const DEFAULT_SOURCE_DETAILS = {
    source: "OTHER",
    event_prefix: "other",
    venue_prefix: "other",
    url: ""
  };

  let sourceInstructionsMap = new Map();


 async function initializeSourceInstructions() {
    try {
      const response = await fetch('https://ubik.wiki/api/source-instructions/?limit=100', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const results = data.results || [];

      sourceInstructionsMap = new Map();
      results.forEach(record => {
        if (record.contains) {
          const tokens = record.contains.split(',').map(token => token.trim());
          tokens.forEach(token => {
            sourceInstructionsMap.set(token, {
              source: record.source,
              event_prefix: record.event_prefix,
              venue_prefix: record.venue_prefix
            });
          });
        }
      });

      console.log(`Loaded ${results.length} source instructions.`);
      initsource = true
      return true;
    } catch (error) {
      console.error('Error fetching source instructions:', error);
      return false;
    }
  }


  function getSourceDetails(url) {
    if (sourceInstructionsMap.size === 0) {
      console.log("Source instructions not loaded yet.");
      return { ...DEFAULT_SOURCE_DETAILS, url };
    }

    for (const [token, details] of sourceInstructionsMap) {
      if (url.includes(token)) {
        return { ...details, url };
      }
    }
    return { ...DEFAULT_SOURCE_DETAILS, url };
}






let xanoUrl = new URL('https://ubik.wiki/api/buying-queue/?completed__iexact=false&limit=1000');

function getEvents() {
    let request = new XMLHttpRequest();
    let url = xanoUrl.toString();
    request.open('GET', url, true);
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.setRequestHeader("Cache-Control", "no-cache")
    request.onload = function() {
        let data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("Cards-Container");
            console.log(request);
            data.results.forEach(events => {
                const style = document.getElementById('samplestyle');
                const card = style.cloneNode(true);

                card.setAttribute('id', '');
                card.setAttribute('name', events.event_name);
                card.setAttribute('venue', events.event_venue);
                card.setAttribute('url', events.event_url);
		card.setAttribute('checked','false')
                card.style.display = 'flex';
		    
           	card.setAttribute('eventid', evid);

		if (evid.startsWith("tm")) {
            	card.setAttribute('eventid', evid.substring(2));
    		}
		    

                const txtsource = card.getElementsByClassName('main-text-src')[0];
                const details = getSourceDetails(events.event_url);
                txtsource.textContent = details.source;
                card.setAttribute('source', details.source);


                const buybutton = card.getElementsByClassName('main-buy-button')[0];
                buybutton.addEventListener('click', function() {
                    window.location.assign("https://www.ubikanalytic.com/buy-event?id=" + events.id);
                });

                const editbutton = card.getElementsByClassName('main-edit-button')[0];
                editbutton.style.display = 'none';
                editbutton.addEventListener('click', function() {
                    window.location.assign("https://www.ubikanalytic.com/edit-event?id=" + events.id);
                });

                let ems = document.querySelector('#email').textContent;

                const eventname = card.getElementsByClassName('main-text-event')[0];
                eventname.textContent = events.event_name;
                if (eventname.textContent.length > 21) {
                    eventname.textContent = events.event_name.slice(0, 21) + '...';
                }

                let eventtime = card.getElementsByClassName('main-text-time')[0];
                eventtime.textContent = events.event_time;
                if (eventtime.textContent.length > 8) {
                    eventtime.textContent = events.event_time.slice(0, 8);
                }

                let eventtl = card.getElementsByClassName("main-text-tl")[0];
                eventtl.textContent = events.added_timestamp;
                card.setAttribute('dateposted', events.added_timestamp);

                let assigncard = card.getElementsByClassName("main-text-assign")[0];

		if(events.assign){
                assigncard.textContent = events.assign;
                card.setAttribute('assign', events.assign);
		}


const checkEmailLoaded = setInterval(() => {
  const emailElement = document.getElementById('email');
  if (emailElement && emailElement.textContent.includes('@')) {
    clearInterval(checkEmailLoaded);

    let currentuser = emailElement.textContent.trim();
    let assign = events.assign;

    card.style.display = 'none';

    const roleAccess = {
      'Prohyrph All': [
        'tim@ubikanalytic.com',
        'aleksei@ubikanalytic.com',
        'prohyrph1@ubikanalytic.com',
        'prohyrph2@ubikanalytic.com'
      ],
      'Prohyrph 1': [
        'tim@ubikanalytic.com',
        'aleksei@ubikanalytic.com',
        'prohyrph1@ubikanalytic.com'
      ],
      'Prohyrph 2': [
        'tim@ubikanalytic.com',
        'aleksei@ubikanalytic.com',
        'prohyrph2@ubikanalytic.com'
      ],
      'Remote': [
        'tim@ubikanalytic.com',
        'aleksei@ubikanalytic.com',
        'jan@ubikanalytic.com',
        'jen@ubikanalytic.com',
	'danielle@ubikanalytic.com'
      ],
      'Self': [
        'aleksei@ubikanalytic.com',
        'tim@ubikanalytic.com'
      ]
    };

    if (roleAccess[assign] && roleAccess[assign].includes(currentuser)) {
      card.style.display = 'flex';
    }
  }
}, 300);







                let tagurgent = card.getElementsByClassName("tags-urgent")[0];
                let tagdontbuy = card.getElementsByClassName("tags-dontbuy")[0];
                let tag950 = card.getElementsByClassName("tags-950")[0];
                let tag1050 = card.getElementsByClassName("tags-1050")[0];
                let tag1150 = card.getElementsByClassName("tags-1150")[0];
                let tag1250 = card.getElementsByClassName("tags-1250")[0];
                let tag1350 = card.getElementsByClassName("tags-1350")[0];


        if(events.tags.includes('urgent')){
        tagurgent.style.display = 'flex';
            }

		if(events.tags.includes('queue-9:50')){
        tag950.style.display = 'flex';
		}
		if(events.tags.includes('queue-10:50')){
            tag1050.style.display = 'flex';
        }

		if(events.tags.includes('queue-11:50')){
            tag1150.style.display = 'flex';
        }


		if(events.tags.includes('queue-12:50')){
            tag1250.style.display = 'flex';
        }

		if(events.tags.includes('queue-13:50')){
            tag1350.style.display = 'flex';
        }
		if(events.tags.includes('dont-buy')){
            tagdontbuy.style.display = 'flex';
        }

                const eventvenue = card.getElementsByClassName('main-text-venue')[0];
                eventvenue.textContent = events.event_venue;
                if (eventvenue.textContent.length > 20) {
                    eventvenue.textContent = events.event_venue.slice(0, 20) + '...';
                }

                const eventdate = card.getElementsByClassName('main-text-date')[0];
                var tdate = events.event_date;
                eventdate.textContent = tdate;
                card.setAttribute('date', tdate);

                let purchasequantity = card.getElementsByClassName('main-text-quantity')[0];
                if (events.purchased_amount) {
                    purchasequantity.textContent = events.purchased_amount;
                    card.setAttribute('fulfilled', events.purchased_amount);
                } else {
                    purchasequantity.textContent = "0";
                    card.setAttribute('fulfilled', "0");
                }

                let purchasequantitymax = card.getElementsByClassName('main-text-quantity-max')[0];
                purchasequantitymax.textContent = events.purchase_total;

                const eventurl = events.event_url;
                function copyToClipboard(text) {
                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val(text).select();
                    document.execCommand("copy");
                    $temp.remove();
                }

                eventname.addEventListener('click', function() {
                    copyToClipboard(eventurl);
                });

                function parseNewYorkDate(dateStr) {
                    const [datePart, timePart] = dateStr.split(', ');
                    const [month, day, year] = datePart.split('/').map(Number);
                    const [time, modifier] = timePart.split(' ');
                    let [hours, minutes] = time.split(':').map(Number);

                    // Convert to 24-hour format
                    if (modifier === 'PM' && hours !== 12) hours += 12;
                    if (modifier === 'AM' && hours === 12) hours = 0;

                    // Create temporary date object
                    const localDate = new Date(year, month - 1, day, hours, minutes);

                    // Get timezone offsets
                    const localOffset = localDate.getTimezoneOffset();
                    const nyOffset = getNYOffset(localDate);

                    // Adjust to get correct UTC time
                    const utcTime = localDate.getTime() - (localOffset - nyOffset) * 60000;
                    return new Date(utcTime);
                }

                function getNYOffset(date) {
                    const nyDateStr = date.toLocaleString('en-CA', {
                        timeZone: 'America/New_York',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    }).replace(/, /, 'T');

                    const nyDate = new Date(nyDateStr + 'Z');
                    return Math.round((date.getTime() - nyDate.getTime()) / 60000);
                }

                // Helper function to calculate time left
                function calculateTimeLeft(purchasedDate, interval, currentTime) {
                    const expirationTime = purchasedDate.getTime() + interval * 60000;
                    const currentUTC = currentTime.getTime();
                    const ms = expirationTime - currentUTC;

                    if (ms < 0) {
                        return { expired: true };
                    }

                    const totalSeconds = Math.floor(ms / 1000);
                    const seconds = totalSeconds % 60;
                    const totalMinutes = Math.floor(totalSeconds / 60);
                    const minutes = totalMinutes % 60;
                    const hours = Math.floor(totalMinutes / 60);

                    const displayText = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    const timeLeft = totalMinutes;

                    return { timeLeft, displayText, expired: false };
                }

                // Main code execution
                const urgency = events.buying_urgency;
                const buytimestamp = events.added_timestamp;
                const date = parseNewYorkDate(buytimestamp);
                const currentTime = new Date(); // Current time in UTC

                const eventstatus = card.getElementsByClassName('main-text-status')[0];

                // Predefined urgency mappings (in minutes)
                const urgencyMap = {
                    "15 min": 15,
                    "30 min": 30,
                    "45 min": 45,
                    "1 hr": 60,
                    "2 hrs": 120,
                    "3 hrs": 180,
                    "4 hrs": 240,
                    "5 hrs": 300,
                    "6 hrs": 360,
                    "7 hrs": 420,
                    "8 hrs": 480,
                    "9 hrs": 540,
                    "10 hrs": 600,
                    "11 hrs": 660,
                    "12 hrs": 720,
                    "14 hrs": 840,
                    "16 hrs": 960,
                    "18 hrs": 1080,
                    "20 hrs": 1200,
                    "1 day": 1440,
                    "2 days": 2880,
                    "4 days": 5760,
                };

                switch (urgency) {
                    case 'error':
                        eventstatus.textContent = 'ERROR';
                        eventstatus.style.color = "red";
                        card.setAttribute('timeleft', "999999999");
                        card.setAttribute('error', "true");
                        break;

                    case 'Extremely Urgent':
                        eventstatus.textContent = 'URGENT';
                        eventstatus.style.color = "red";
                        card.setAttribute('timeleft', "-1");
                        card.setAttribute('asap', "true");
                        break;

                    case 'Immediate':
                        eventstatus.textContent = 'ASAP';
                        eventstatus.style.color = "red";
                        card.setAttribute('timeleft', "0");
                        card.setAttribute('asap', "true");
                        break;

                    default:
                        const interval = urgencyMap[urgency];
                        if (interval) {
                            const { timeLeft, displayText, expired } = calculateTimeLeft(date, interval, currentTime);
                            if (expired) {
                                eventstatus.textContent = 'ASAP';
                                eventstatus.style.color = "red";
                                card.setAttribute('timeleft', "0");
                            } else {
                                eventstatus.textContent = displayText;
                                card.setAttribute('timeleft', timeLeft);
                            }
                        } else {
                            console.error(`Unrecognized urgency: ${urgency}`);
                        }
                        break;
                }

                if (card.getAttribute('error') === 'true') {
                    const errorbutton = card.getElementsByClassName('main-buy-button')[0];
                    errorbutton.textContent = 'Respond';
                    errorbutton.addEventListener('click', function() {
                        window.location.assign("https://www.ubikanalytic.com/error-respond?id=" + encodeURIComponent(events.error_id).replace('%20', '+'));
                    });
                }

                const confirmbutton = card.getElementsByClassName('main-confirm-button')[0];
                const deletebutton = card.getElementsByClassName('main-delete-button-confirm')[0];
                const eventid = encodeURIComponent(events.id);
                confirmbutton.addEventListener('click', function() {
                    confirmbutton.style.display = "none";
                    deletebutton.style.display = "flex";
                });

                deletebutton.addEventListener('click', function() {
                    var http = new XMLHttpRequest();
                    var url = "https://ubik.wiki/api/delete/buying-queue/";
                    var params = JSON.stringify({
                        "id": eventid
                    });
                    http.open("DELETE", url, true);
                    http.setRequestHeader('Authorization', `Bearer ${token}`);
                    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
                    http.send(params);
                    card.style.display = "none";
                });

                cardContainer.appendChild(card);
            });
        }
    }
    request.send();
}

let intervalIds;

let intervalIdx;

function initsources() {
    if (token.length === 40) {
	initializeSourceInstructions()
    clearInterval(intervalIdx);
}}

intervalIdx = setInterval(initsources, 1000);


function retryClickingSearchBar() {
    if (token.length === 40 && initsource === true) {
        getEvents();
	searchcompleted = true
        clearInterval(intervalIds);
    }
}

intervalIds = setInterval(retryClickingSearchBar, 1000);

setTimeout(() => {
    function play() {
        sound = new Howl({
            src: ['https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3']
        });
        sound.play();
    }

    let nowcount = document.querySelectorAll(".event-box").length - 1;
    let timer = setInterval(function () {
        document.querySelector('#loading').style.display = "flex";
        document.querySelector('#flexbox').style.display = "none";
        getEvents();
        let count = nowcount;
        let results = document.querySelectorAll('.event-box');

        for (let i = 0; i < results.length; i++) {
            if (results[i].style.display !== 'none' && results[i].getAttribute('id') !== 'samplestyle') {
                results[i].remove();
            }

            if (results[i].getAttribute('asap') === 'true' || results[i].getAttribute('timeleft') === '0') {
                count++;
            }
        }

        console.log("count" + count);
        console.log("now" + nowcount);
        if (count > nowcount) {
            document.querySelector('#samplestyle').style.display = "none";
            play();
            let nowcount = 0;
            let count = 0;
        }
        setTimeout(() => {
            document.querySelector('#loading').style.display = "none";
            document.querySelector('#flexbox').style.display = "flex";
        }, 5000);
        setTimeout(() => {
            var wrapper = $('#Cards-Container');
            wrapper.find('.event-box').sort(function(a, b) {
                return +a.getAttribute("timeleft") - +b.getAttribute("timeleft");
            }).appendTo(wrapper);
        }, 5000);
    }, 180000);
}, 3500);

setTimeout(() => {
    $("#samplestyle").hide();
    document.querySelector('#loading').style.display = "none";
    document.querySelector('#flexbox').style.display = "flex";
}, 3500);

function docReady(fn) {
   if (document.readyState === "complete" || document.readyState === "interactive") {
       setTimeout(fn, 1);
   } else {
       document.addEventListener("DOMContentLoaded", fn);
   }
}

docReady(function() {
    setTimeout(() => {
        var wrapper = $('#Cards-Container');
        wrapper.find('.event-box').sort(function(a, b) {
            return +a.getAttribute("timeleft") - +b.getAttribute("timeleft");
        }).appendTo(wrapper);
    }, 2500);

    checkeditbutton = setInterval(function () {
        let myFS = firebase.firestore();
        let docRef = myFS.doc("users/" + firebase.auth().currentUser.uid);
        docRef.get().then((docSnap) => {
            let data = docSnap.data();
            let admin = data["admin"];

            if (admin === true) {
                var ebutton = document.getElementsByClassName("main-edit-button");
                for (var i = 0; i < ebutton.length; i++) {
                    ebutton[i].style.display = 'flex';
                }
            }
            clearInterval(checkeditbutton);
        });
    }, 1000);
});
