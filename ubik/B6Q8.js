initsource = false
let abortControllers = [];

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
  if (!url || typeof url !== 'string') {
    console.warn("Invalid or missing URL passed to getSourceDetails:", url);
    return { ...DEFAULT_SOURCE_DETAILS, url: url || "" };
  }

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

function bindChartIconClick(card, events) {
    const charticon = card.getElementsByClassName('main-text-chart')[0];

    if (!charticon) return;

    charticon.addEventListener('click', function () {
        document.querySelector('#chart-date').textContent = '';
        document.querySelector('#chart-event').textContent = '';
        document.querySelector('#chart-venue').textContent = '';
        document.querySelector('#chart-location').textContent = '';
        document.querySelector('#chart-time').textContent = '';
        chart.data.datasets.splice(1, 3);
        chart.data.labels.splice(0, 100);
        chart.update();

        const eventBoxParent = charticon.closest('.event-box');
        const daten = eventBoxParent.getAttribute('date');
        const eventn = eventBoxParent.getAttribute('name');
        const venuen = eventBoxParent.getAttribute('venue');
        const cityn = eventBoxParent.getAttribute('city');
        const staten = eventBoxParent.getAttribute('state');
        const timen = eventBoxParent.getAttribute('time');
        const eventurl = eventBoxParent.getAttribute('url');
        const eventidv = eventBoxParent.getAttribute('eventid');
        const vdid = eventBoxParent.getAttribute('vdid');

        document.querySelector('#chart-date').textContent = daten;
        document.querySelector('#chart-event').textContent = eventn;
        document.querySelector('#chart-venue').textContent = venuen;
        document.querySelector('#chart-location').textContent = cityn + ', ' + staten;
        document.querySelector('#chart-time').textContent = timen;

        chart.data.datasets[0].label = '';
        chart.data.datasets[0].data = [];
        chart.config.data.labels = [];
        chart.update();
        document.querySelector('#tmloader').style.display = 'flex';
        document.querySelector('#tmerror').style.display = 'none';
        document.querySelector('#tmchart').style.display = 'none';

        document.querySelector('#graph-overlay').style.display = 'flex';
        document.querySelector('#closecharts').style.display = 'flex';

        if (eventurl.includes('ticketmaster') || eventurl.includes('livenation')) {
            document.querySelector('#eventicon').style.display = 'none';
            document.querySelector('#tmurl').style.display = 'block';
            document.querySelector('#tmurl').href = 'http://142.93.115.105:8100/event/' + eventidv + "/details/";
            fetchTicketmasterData(eventidv.substring(2));
            vschartdata(vdid)

       } else {
            const parsedCounts = JSON.parse(eventBoxParent.getAttribute('counts') || '[]');
            const siteVenueId = eventBoxParent.getAttribute('venueid');
            const eventUrl = eventBoxParent.getAttribute('url');
            const eventId = eventBoxParent.getAttribute('eventid');

    const eventData = {
        event_id: eventId,
        event_url: eventUrl,
        counts: parsedCounts,
        site_venue_id: siteVenueId
    };

    updateChartWithPrimaryAndPreferred(eventData);
    vschartdata(vdid)

            document.querySelector('#eventicon').style.display = 'none';
            document.querySelector('#tmurl').style.display = 'block';
            document.querySelector('#tmurl').href = eventurl;
        }
    });

    charticon.setAttribute('listener-bound', 'true');
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

                card.setAttribute('id', events.event_id);
                card.setAttribute('name', events.event_name);
                card.setAttribute('venue', events.event_venue);
                card.setAttribute('url', events.event_url);
               	card.setAttribute('time', events.event_time);

		        card.setAttribute('checked','false')
                card.style.display = 'flex';
               	card.setAttribute('eventid', events.event_id);

               const eventurltwo = events.event_url
               const eventidtwo = events.event_id

                charticon = card.getElementsByClassName('main-text-chart')[0];


                bindChartIconClick(card, events);


let count = events.counts
let src = eventurltwo
if (count && count.length > 0 || (src.includes('ticketmaster') || src.includes('livenation')) && !src.includes('ticketmaster.com.mx') && !src.includes('ticketmaster.co.uk') && !src.includes('ticketmaster.de')) {
charticon.style.display = 'flex'
} else {
charticon.style.display = 'none'
}


                const txtsource = card.getElementsByClassName('main-text-src')[0];
                const details = getSourceDetails(card.getAttribute('url'));
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

				let eventaddedby = card.getElementsByClassName("main-text-postedby")[0];
                eventaddedby.textContent = events.added_by;


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
        'prohyrph2@ubikanalytic.com',
        'arcel@ubikanalytic.com',
        'jj@ubikanalytic.com',
        'franz@ubikanalytic.com'
      ],
      'Prohyrph 1': [
        'tim@ubikanalytic.com',
        'aleksei@ubikanalytic.com',
        'prohyrph1@ubikanalytic.com',
        'arcel@ubikanalytic.com',
        'jj@ubikanalytic.com',
        'franz@ubikanalytic.com'
      ],
      'Prohyrph 2': [
        'tim@ubikanalytic.com',
        'aleksei@ubikanalytic.com',
        'prohyrph2@ubikanalytic.com',
        'arcel@ubikanalytic.com',
        'jj@ubikanalytic.com',
        'franz@ubikanalytic.com'
      ],
      'Remote': [
        'tim@ubikanalytic.com',
        'aleksei@ubikanalytic.com',
        'jan@ubikanalytic.com',
        'jen@ubikanalytic.com',
		'danielle@ubikanalytic.com',
        'arcel@ubikanalytic.com',
        'jj@ubikanalytic.com',
        'franz@ubikanalytic.com'
      ],
      'Self': [
        'aleksei@ubikanalytic.com',
        'tim@ubikanalytic.com',
        'arcel@ubikanalytic.com',
        'jj@ubikanalytic.com',
        'franz@ubikanalytic.com'
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


            const primrem = card.getElementsByClassName('main-text-primary')[0]
            let rescrapebutton = card.getElementsByClassName('re-scrape-div')[0]
            let topbox = card.getElementsByClassName('topbox')[0]
            let scrapebutton = card.getElementsByClassName('scrape-div-fresh')[0]


   scrapebutton.addEventListener('click', async function () {
    const eventId = eventidtwo.substring(2);
    primrem.textContent = ''; // Clear while fetching
    try {
        const result = await scrapetm(eventId);
        primrem.textContent = result;
    } catch (error) {
        console.log('Scrape failed:', error);
        primrem.textContent = 'unavailable';
    }
});

rescrapebutton.addEventListener('click', async function () {
    primrem.textContent = '';
    try {
        const result = await scrapeurl(eventidtwo.substring(2));
        primrem.textContent = result;
    } catch (error) {
        console.log('Rescrape failed:', error);
        primrem.textContent = 'unknown';
    }
});

            if(!events.event_url.includes('ticketmaster.com.mx') && (events.event_url.includes('ticketmaster.com') || events.event_url.includes('livenation'))) {
            topbox.style.display = 'flex'
            rescrapebutton.style.display = 'flex'
            scrapebutton.style.display = 'flex'
            } else {
            topbox.style.display = 'flex'
            rescrapebutton.style.display = 'none'
            scrapebutton.style.display = 'none'
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

                function copyToClipboard(text) {
                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val(text).select();
                    document.execCommand("copy");
                    $temp.remove();
                }

                eventname.addEventListener('click', function() {
                    copyToClipboard(eventurltwo);
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


function vschartdata(VDID) {

    chartvs.data.datasets[0].data = []
    chartvs.data.datasets[1].data = []
    chartvs.data.datasets[2].data = []
    chartvs.data.datasets[3].data = []
    chartvs.data.datasets[4].data = []
    chartvs.data.datasets[5].data = []
    chartvs.data.datasets[6].data = []
    chartvs.data.datasets[7].data = []
    chartvs.data.datasets[0].label = "Total"
    chartvs.data.datasets[1].label = ""
    chartvs.data.datasets[2].label = ""
    chartvs.data.datasets[3].label = ""
    chartvs.data.datasets[4].label = "Lowest Price"
    chartvs.data.datasets[5].label = ""
    chartvs.data.datasets[6].label = ""
    chartvs.data.datasets[7].label = ""
    chartvs.config.data.labels = []
    chartvs.update();
    document.querySelector('#vsloader').style.display = 'flex';
    document.querySelector('#vserror').style.display = 'none';
    document.querySelector('#vschart').style.display = 'none';

const url = `https://ubik.wiki/api/vividseats/?vdid__iexact=${VDID}&format=json`;


const headers = new Headers({
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json; charset=utf-8',
});

// Create the request object
const request = new Request(url, {
method: 'GET',
headers: headers
});

// Use the fetch API to make the GET request
fetch(request)
.then(response => {
if (response.ok) {
document.querySelector('#vsloader').style.display = 'none';
document.querySelector('#vschart').style.display = 'flex';
document.querySelector('#vserror').style.display = 'none';
return response.json();
} else {
document.querySelector('#vsloader').style.display = 'none';
document.querySelector('#vschart').style.display = 'none';
document.querySelector('#vserror').style.display = 'flex';
throw new Error("Failed to fetch data");
}
})
.then(data => {

const str = data.results[0].data_scrapes;

if(str){

const replacedStr = str.replace(/'/g, '"');

const correctedData = replacedStr.replace(/:\s*None,/g, ':"None",');
let datas;

try {


datas = JSON.parse(correctedData);
console.log(datas[0])

} catch (e) {
// If parsing fails, log the error
console.error("Parsing failed:", e);
}

// Extract chart labels and data from the fetched data
const labels = datas.map(item => item.scrape_datetime).reverse();
const totalCount = datas.map(item => item.total_count).reverse();
const pref1Count = datas.map(item => item.pref1_count).reverse();
const pref2Count = datas.map(item => item.pref2_count).reverse();
const pref3Count = datas.map(item => item.pref3_count).reverse();
const lowestprice = datas.map(item => item.lowest_price).reverse();
const pref1lowest = datas.map(item => item.pref1_lowest).reverse();
const pref2lowest = datas.map(item => item.pref2_lowest).reverse();
const pref3lowest = datas.map(item => item.pref3_lowest).reverse();

const p1name = datas[0].pref1_title
const p2name = datas[0].pref2_title
const p3name = datas[0].pref3_title


// Update chart
chartvs.data.labels = labels;
chartvs.data.datasets[0].data = totalCount;
chartvs.data.datasets[1].data = pref1Count;
chartvs.data.datasets[2].data = pref2Count;
chartvs.data.datasets[3].data = pref3Count;

chartvs.data.datasets[4].data = lowestprice;

chartvs.data.datasets[5].data = pref1lowest;
chartvs.data.datasets[6].data = pref2lowest;
chartvs.data.datasets[7].data = pref3lowest;

chartvs.data.datasets[1].label = p1name
chartvs.data.datasets[2].label = p2name
chartvs.data.datasets[3].label = p3name

chartvs.data.datasets[5].label = p1name + ' Lowest Price'
chartvs.data.datasets[6].label = p2name + ' Lowest Price'
chartvs.data.datasets[7].label = p3name + ' Lowest Price'

chartvs.update();



} else {
    document.querySelector('#vsloader').style.display = 'none';
    document.querySelector('#vschart').style.display = 'none';
    document.querySelector('#vserror').style.display = 'flex';


}


})
.catch(error => {
console.error("Error:", error);
document.querySelector('#vsloader').style.display = 'none';
document.querySelector('#vschart').style.display = 'none';
document.querySelector('#vserror').style.display = 'flex';
});
}


function normalizeDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

      function updateChartWithPrimaryAndPreferred(events) {
          let amountsPrimary = [];
          let datesPrimary = [];
          let combinedDates = new Set();
          let preferredData = [];
          let counts = events.counts;
          let venueid = events.site_venue_id;

          const detailstwo = getSourceDetails(events.event_url);

          // Reset the chart for primary and preferred datasets
          chart.data.datasets[0].label = `${detailstwo.source.toUpperCase()} Primary`;
          chart.data.datasets.splice(1, 3); // Remove old preferred datasets
          chart.update();

          // Populate primary amounts and dates
counts.forEach(count => {
    let primary = parseInt(count.primary_amount || "0");
    amountsPrimary.push(primary);
    const normalizedDate = normalizeDate(count.scrape_date);
    datesPrimary.push(normalizedDate);
    combinedDates.add(normalizedDate);
});

          console.log("Primary data amounts:", amountsPrimary);
          console.log("Primary data dates:", datesPrimary);

          // Fetch preferred sections and counts
          const controller = new AbortController();
          abortControllers.push(controller);

          // Step 1: Fetch preferred sections
          var http = new XMLHttpRequest();
          var url = `https://ubik.wiki/api/venues/${venueid}/`;
          http.open("GET", url, true);
          http.setRequestHeader("Content-type", "application/json; charset=utf-8");
          http.setRequestHeader('Authorization', `Bearer ${token}`);
          http.signal = controller.signal;

          http.onload = function() {
              let dataResponse = JSON.parse(this.response);
              let prefSections = {
                  pref1: dataResponse.pref_section1,
                  pref2: dataResponse.pref_section2,
                  pref3: dataResponse.pref_section3
              };

              console.log("Preferred sections:", prefSections);

              // Step 2: Fetch counts for preferred sections
              fetch(`https://ubik.wiki/api/primary-counts/?tickets_by_sections__icontains={&event_id__icontains=${events.event_id}&limit=1000&format=json`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  signal: controller.signal
              })
              .then(response => response.json())
              .then(data => {
                  console.log("Preferred counts data response:", data);

                  // Process datasets for each preferred section
                  const validPrefs = [prefSections.pref1, prefSections.pref2, prefSections.pref3].filter(pref => pref && pref !== 'null' && pref !== null);
                  validPrefs.forEach((pref, index) => {
                    let datewiseAggregation = {};

                    data.results.forEach(result => {
                        let scrapeDate = normalizeDate(result.event.scrape_date);

                        if (!datewiseAggregation[scrapeDate]) {
                            datewiseAggregation[scrapeDate] = 0; // Initialize aggregation for this date
                        }

                        result.tickets_by_sections.forEach(section => {
                            // Use includes for flexible matching
                            if (section.section && section.section.toLowerCase().includes(pref.toLowerCase())) {
                                datewiseAggregation[scrapeDate] += Math.round(section.amount);
                                combinedDates.add(scrapeDate);
                                console.log(`Adding ${section.amount} from ${section.section} to ${scrapeDate} for preferred section "${pref}"`);
                            }
                        });
                    });

                    let prefAmounts = [];
                    let prefDates = [];
                    Object.keys(datewiseAggregation).forEach(date => {
                        prefDates.push(date);
                        prefAmounts.push(datewiseAggregation[date]);
                    });

                    preferredData.push({
                        label: pref,
                        amounts: prefAmounts,
                        dates: prefDates,
                        backgroundColor: `rgba(${75 + index * 40}, 179, 113, 1)`,
                        borderColor: `rgba(${75 + index * 40}, 170, 113, 1)`
                    });
                });

                  // Step 3: Combine and sort all dates
                  combinedDates = Array.from(combinedDates).sort((a, b) => new Date(a) - new Date(b));

                  // Step 4: Align primary data with combined dates
                  let alignedPrimaryData = combinedDates.map(date => {
                      let index = datesPrimary.indexOf(date);
                      return index !== -1 ? amountsPrimary[index] : 0; // Use 0 if no match
                  });

                  // Step 5: Align preferred data with combined dates
                  preferredData.forEach(prefDataset => {
                      prefDataset.alignedAmounts = combinedDates.map(date => {
                          let index = prefDataset.dates.indexOf(date);
                          return index !== -1 ? prefDataset.amounts[index] : 0; // Use 0 if no match
                      });
                  });

                  // Step 6: Update the chart with combined data
                  chart.config.data.labels = combinedDates;
                  chart.data.datasets[0].data = alignedPrimaryData;

                  preferredData.forEach(prefDataset => {
                      chart.data.datasets.push({
                          data: prefDataset.alignedAmounts,
                          label: prefDataset.label,
                          backgroundColor: prefDataset.backgroundColor,
                          borderColor: prefDataset.borderColor,
                          borderWidth: 1
                      });
                  });

                  chart.update();
                  console.log("Chart updated with primary and preferred data");

                  document.querySelector('#tmloader').style.display = 'none';
                  document.querySelector('#tmerror').style.display = 'none';
                  document.querySelector('#tmchart').style.display = 'flex';
              })
              .catch(error => {
                  console.error('There was an error with the fetch request for preferred counts.', error);
                  displayLoadingFailed();
              });
          };

          http.onerror = function() {
              console.error('There was an error with the XMLHttpRequest for preferred sections.');
              displayLoadingFailed();
          };

          http.send();
      }

      function displayLoadingFailed() {
          document.querySelector('#tmloader').style.display = 'none';
          document.querySelector('#tmerror').style.display = 'flex';
          document.querySelector('#tmchart').style.display = 'none';
      }

        function displayLoadingFailed() {
            document.querySelector('#tmloader').style.display = 'none';
            document.querySelector('#tmerror').style.display = 'flex';
            document.querySelector('#tmchart').style.display = 'none';
        }


function fetchTicketmasterData(eventid) {
    chart.update();
    const controller = new AbortController();
    abortControllers.push(controller);

    var http = new XMLHttpRequest();
    var url = `https://shibuy.co:8443/142data?eventid=${eventid}`;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.signal = controller.signal;

    http.onload = function() {
        let data = JSON.parse(this.response);
        if (data.length > 0) {
            processTicketmasterData(data);
        } else {
            console.log("No data received from Ticketmaster.");
            displayLoadingFailed();
        }
    };

    http.onerror = function() {
        console.error('There was an error with the XMLHttpRequest.');
        displayLoadingFailed();
    };

    http.send();
}




function processTicketmasterData(data) {
    let dates = [];
    let amounts = [];

    let preferredDates1 = [];
    let preferredAmounts1 = [];

    let preferredDates2 = [];
    let preferredAmounts2 = [];

    let preferredDates3 = [];
    let preferredAmounts3 = [];

    let prefSections = {};

    if (data[0].venue && Array.isArray(data[0].venue.preferred_sections)) {
        for (let i = 0; i < data[0].venue.preferred_sections.length; i++) {
            if (data[0].venue.preferred_sections[i] && data[0].venue.preferred_sections[i].name) {
                prefSections[`pref${i + 1}`] = data[0].venue.preferred_sections[i].name;
            }
        }
    }

    console.log(prefSections);

    chart.data.datasets.splice(1, 3);
    chart.update();

    data.forEach(event => {
        event.summaries.forEach((summary, index) => {

            if (!summary.sections || summary.sections.length === 0) {
                console.log("No sections available for this summary:", summary.scrape_date);
                return;
            }

            // Filter out resale sections
            const filteredSections = summary.sections.filter(section => section.type !== 'resale');
            const totalAmount = filteredSections.reduce((accumulator, section) => accumulator + section.amount, 0);

            if (totalAmount > 0) {
                // Format the scrape_date string to "YYYY-MM-DD HH:MM"
                const scrapeDateStr = summary.scrape_date;
                const formattedDate = scrapeDateStr.slice(0, 16).replace("T", " ");
                console.log("Formatted Date:", formattedDate);

                dates.push(formattedDate);
                amounts.push(totalAmount);

                // Process for preferred section 1 (matching all "GA" sections)
                if (prefSections.pref1 && prefSections.pref1 !== "null") {
                    const matchingSections1 = filteredSections.filter(section => section.section.includes(prefSections.pref1));
                    if (matchingSections1.length > 0) {
                        const prefAmount1 = matchingSections1.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates1.push(formattedDate);
                        preferredAmounts1.push(prefAmount1);
                    }
                }

                // Process for preferred section 2
                if (prefSections.pref2 && prefSections.pref2 !== "null") {
                    const matchingSections2 = filteredSections.filter(section => section.section.includes(prefSections.pref2));
                    if (matchingSections2.length > 0) {
                        const prefAmount2 = matchingSections2.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates2.push(formattedDate);
                        preferredAmounts2.push(prefAmount2);
                    }
                }

                // Process for preferred section 3
                if (prefSections.pref3 && prefSections.pref3 !== "null") {
                    const matchingSections3 = filteredSections.filter(section => section.section.includes(prefSections.pref3));
                    if (matchingSections3.length > 0) {
                        const prefAmount3 = matchingSections3.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates3.push(formattedDate);
                        preferredAmounts3.push(prefAmount3);
                    }
                }
            } else {
                console.log("No valid sections found for this summary.");
            }
        });
    });

    // Sort the collected data
    const sortData = (amounts, dates) => {
        const indices = Array.from({ length: dates.length }, (_, i) => i);
        indices.sort((a, b) => new Date(dates[a]) - new Date(dates[b]));
        return {
            sortedAmounts: indices.map(i => amounts[i]),
            sortedDates: indices.map(i => dates[i])
        };
    };

    const sortedPrimaryData = sortData(amounts, dates);
    const sortedData1 = sortData(preferredAmounts1, preferredDates1);
    const sortedData2 = sortData(preferredAmounts2, preferredDates2);
    const sortedData3 = sortData(preferredAmounts3, preferredDates3);

    // Update chart with primary data
    chart.data.datasets[0].data = sortedPrimaryData.sortedAmounts;
    chart.config.data.labels = sortedPrimaryData.sortedDates;

    // Ensure primary dataset is always present
    chart.data.datasets = [{
        data: sortedPrimaryData.sortedAmounts,
        label: "TICKETMASTER Primary",
        backgroundColor: 'rgba(0, 102, 51, 1)',
        borderColor: 'rgba(0, 102, 51, 1)',
        borderWidth: 1
    }];

    // Add other datasets conditionally, only if prefSections are not empty or "null"
    if (prefSections.pref1 && prefSections.pref1 !== "null" && sortedData1.sortedAmounts.length > 0) {
        chart.data.datasets.push({
            data: sortedData1.sortedAmounts,
            label: `${prefSections.pref1}`,
            backgroundColor: 'rgba(52, 152, 219, 1)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        });
    }

    if (prefSections.pref2 && prefSections.pref2 !== "null" && sortedData2.sortedAmounts.length > 0) {
        chart.data.datasets.push({
            data: sortedData2.sortedAmounts,
            label: `${prefSections.pref2}`,
            backgroundColor: 'rgba(46, 204, 113, 1)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1
        });
    }

    if (prefSections.pref3 && prefSections.pref3 !== "null" && sortedData3.sortedAmounts.length > 0) {
        chart.data.datasets.push({
            data: sortedData3.sortedAmounts,
            label: `${prefSections.pref3}`,
            backgroundColor: 'rgba(241, 196, 15, 1)',
            borderColor: 'rgba(241, 196, 15, 1)',
            borderWidth: 1
        });
    }

    console.log("Final datasets for the chart:", chart.data.datasets);

    // Update the chart
    chart.update();

    document.querySelector("#tmchart").style.display = "flex";
    document.querySelector("#tmloader").style.display = "none";
    document.querySelector("#tmerror").style.display = "none";
}


const scrapetm = async (eventid) => {
    const url = 'https://shibuy.co:8443/scrapeurl';
    let eventidscrape = eventid.startsWith('tm') ? eventid.substring(2) : eventid;

    const data = {
        eventid: eventidscrape
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();

        // Handle array response
        if (!Array.isArray(responseData) || responseData.length === 0) {
            return 'unknown';
        }

        const eventData = responseData[0];

        // Sum all amounts in sections where type !== 'resale'
        const totalPrimaryAmount = eventData.sections
            .filter(section => section.type !== 'resale' && typeof section.amount === 'number')
            .reduce((sum, section) => sum + section.amount, 0);

        const checktrue = eventData.amounts.some(item => item.amount === undefined || item.amount < 50);
        if (checktrue) {
            updatedata(eventid);
        }

        return totalPrimaryAmount;
    } catch (error) {
        console.error('Error scraping:', error);
        return 'unavailable';
    }
};



const scrapeurl = async (eventid) => {
    const url = 'https://shibuy.co:8443/primaryurl?eventid=' + eventid;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (typeof data.count === 'number' && data.count !== 0) {
            return data.count;
        } else {
            return 'unknown';
        }
    } catch (error) {
        console.error('Error fetching primary url:', error);
        return 'unknown';
    }
};

function updatedata(eventid){
    const url = 'https://ubik.wiki/api/update/primary-events/'

    const date1 = new Date();
    let date2 =
    date1.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    })

let currentdate = date2.replace(',','')

    const options = {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    "site_event_id":eventid,
    "status":"sold out",
    "previous_status":currentdate
    })
    };

    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        // Handle the response of the PUT request
        console.log(data);
    })
    .catch(error => {
        // Handle errors from the PUT request
        console.error('Error:', error);
    });


}


async function fetchEventVenueData() {

const eventBoxes = document.querySelectorAll('.event-box');
const validEventIds = [];

eventBoxes.forEach(function(box) {
    const eventUrl = box.getAttribute('url');
    const eventId = box.getAttribute('eventid');
    {
        if (eventId) {
            validEventIds.push(eventId);
        }
    }
});

    const baseUrl = 'https://ubik.wiki/api/event-venue/?site_event_id__iexact=';
    const allResults = [];

    function fetchWithXHR(url, token) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.setRequestHeader("Content-type", "application/json; charset=utf-8");
            request.setRequestHeader('Authorization', `Bearer ${token}`);

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 300) {
                        try {
                            const responseJson = JSON.parse(request.responseText);
                            resolve(responseJson.results || []);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`Request failed with status ${request.status}`));
                    }
                }
            };

            request.send();
        });
    }

    const fetchPromises = validEventIds.map(eventId => {
        const fetchUrl = baseUrl + encodeURIComponent(eventId);

        return fetchWithXHR(fetchUrl, token)
            .then(results => {
                allResults.push(...results);

                // Add attributes to the DOM element for each result
             results.forEach(result => {
    const normalizedId = eventId;
    const selector = '#' + CSS.escape(normalizedId);
    const el = document.querySelector(selector);

    if (el) {
        el.setAttribute('venueid', result.site_venue_id || '');
        el.setAttribute('counts', result.counts || '');
        el.setAttribute('city', result.city || '');
        el.setAttribute('state', result.state || '');
        el.setAttribute('vdid', result.vdid || '');
        el.setAttribute('counts', JSON.stringify(result.counts));
        const primaryAmount = parseInt(result.app_142_primary_amount);
        el.setAttribute('primaryamount', isNaN(primaryAmount) ? -2 : primaryAmount);

        if(result.app_142_primary_amount > 0) {
            el.querySelector('.re-box').style.display = 'flex';
            el.querySelector('.main-text-chart').style.display = 'flex';

            el.querySelector('.main-text-primary').style.display = 'flex';
            el.querySelector('.main-text-primary').textContent = parseInt(result.app_142_primary_amount);
        }
    } else {
        console.warn(`Element with ID ${normalizedId} not found`);
    }
});
})
            .catch(err => {
                console.error(`Failed to fetch for event ID ${eventId}:`, err);
            });
    });

    await Promise.all(fetchPromises);

    console.log('All venue data added to DOM elements');

const eventBoxesToBind = document.querySelectorAll('.event-box');
eventBoxesToBind.forEach(box => {
    const charticon = box.querySelector('.main-text-chart');
    if (charticon && charticon.getAttribute('listener-bound') !== 'true') {
        const mockEvent = {
            event_id: box.getAttribute('eventid'),
            event_url: box.getAttribute('url'),
            vdid: box.getAttribute('vdid'),
            site_venue_id: box.getAttribute('venueid'),
            counts: box.getAttribute('counts'),
            city: box.getAttribute('city'),
            state: box.getAttribute('state'),
            primary_amount: box.getAttribute('primaryamount'),
        };

        bindChartIconClick(box, mockEvent);
    }
});



    return allResults;
}


const intervalVenueReady = setInterval(() => {
    const sample = document.getElementById('samplestyle');
    const eventBoxes = document.querySelectorAll('.event-box');

    if (
        sample &&
        sample.style.display === 'none' &&
        eventBoxes.length > 1 // ignore the sample itself
    ) {
        clearInterval(intervalVenueReady);
        fetchEventVenueData();
    }
}, 1000);
