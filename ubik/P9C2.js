
let intervalIdx;
let sourcesinit = false

function initsource() {
    if (token.length === 40) {
		    initializeSourceInstructions()
    clearInterval(intervalIdx);
    }}

intervalIdx = setInterval(initsource, 1000);


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
      sourcesinit = true
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


let abortControllers = [];

var input = document.getElementById("searchbar1");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});


document.querySelector('#search-button').addEventListener("click", () => {
    document.getElementById('venuebox').style.display = 'none';
    $('#search-button').css({ pointerEvents: "none" });
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
    document.querySelector('#selectedevent').textContent = '';
    document.querySelector('#eventdate').textContent = '';
    document.querySelector('#eventtime').textContent = '';
    document.querySelector('#eventlocation').textContent = '';
    document.querySelector('#shub').setAttribute('url', '');
    document.querySelector('#vseats').setAttribute('url', '');
    document.querySelector('#shubmobile').setAttribute('url', '');
    document.querySelector('#vseatsmobile').setAttribute('url', '');
    document.querySelector('#fwicon1').textContent = '';
    document.querySelector('#fwicon2').textContent = '';
    document.querySelector('#fwicon3').textContent = '';
    document.querySelector('#fwicon4').textContent = '';
    document.querySelector('#fwicon5').textContent = '';
    document.querySelector('#selectedevent').setAttribute('lastfetched', '');
    document.querySelector('#fwicon5').textContent = '';

    document.querySelector('#chart2').style.display = 'none';
    document.querySelector('#chartloading2').style.display = 'none';
    document.querySelector("#loading2").style.display = "flex";
    document.querySelector("#loadingfailed2").style.display = "none";

    document.querySelector('#chart3').style.display = 'none';
    document.querySelector('#chartloading3').style.display = 'none';
    document.querySelector("#loading3").style.display = "flex";
    document.querySelector("#loadingfailed3").style.display = "none";

    document.querySelector('#pricingpart1').style.display = 'flex';
    document.querySelector('#pricingpart2').style.display = 'none';
    document.querySelector('#urlmain').style.display = 'none';
    document.querySelector('#changedata').style.display = 'none';
    document.querySelector('#urlmainmobile').style.display = 'none';
    document.getElementById('142box').style.display = 'none';
    document.getElementById('142boxmobile').style.display = 'none';
    document.querySelector('#urlmain').setAttribute('url', '');
    document.querySelector('#urlmainmobile').setAttribute('url', '');

    document.getElementById('mainurl').value = '';

    $('.event-box-pricing').hide();
    chartvs.data.datasets[0].data = '';
    chartvs.data.datasets[1].data = '';
    chartvs.config.data.labels = '';
    chartvs.update();

    let curUser = firebase.auth().currentUser;
    let myFS = firebase.firestore();
    let docRef = myFS.doc("users/" + curUser.uid);
    docRef.get().then((docSnap) => {
        datas = docSnap.data();
        let usr = datas['Email'];
        $(".platform-icon").hide();
        $('.event-box').each(function(i, obj) {
            if (this.id !== 'samplestyle') {
                this.remove();
            }
        });

        $('#samplestyle').show();
        const dt = new Date();
        let stimestamp2 = moment(dt).format('YYYY-MM-DD');
        let xanoUrl = new URL('https://shibuy.co:8443/sboxinventory?searchkey=');
        let request = new XMLHttpRequest();
        let url = xanoUrl.toString() + keywords1.replaceAll("'", "''") + '&user=' + usr;
        let pa = datas['pyeo'];
        request.open('GET', url, true);
        request.setRequestHeader("Authorization", pa);
        request.onload = function() {
            $('#search-button').css({ pointerEvents: "auto" });
            let data = JSON.parse(this.response);
            if (request.status === 401) {
            } else if (request.status >= 200 && request.status < 400) {
                const cardContainer = document.getElementById("Cards-Container");

                data.forEach(events => {
                    const style = document.getElementById('samplestyle');
                    const card = style.cloneNode(true);



                    if (events.tags) {
                        card.setAttribute('tags', events.tags);

                    if(events.tags.includes('lowerable')){
                    card.classList.add('lowerable');
                    }

                    }





                    if (events[0] === 'unlisted') {
                        card.classList.add('unlisted');
                    }
                    card.setAttribute('id', events.id);
                    card.setAttribute('event', events.name);
                    card.setAttribute('venue', events.venue.name);
                    card.setAttribute('location', events.venue.city);
                    card.setAttribute('date', events.date.slice(0, 10));

                    const eventname = card.getElementsByClassName('main-text-event')[0];
                    eventname.textContent = events.name;
                    if (eventname.textContent.length > 10) {
                        eventname.textContent = events.name.slice(0, 10) + '...';
                    }
                    const eventdate = card.getElementsByClassName('main-text-date')[0];
                    eventdate.textContent = events.date.slice(0, 10);

                    const weekday = card.getElementsByClassName('main-text-day')[0];
                    weekday.textContent = getDayOfWeek(events.date.slice(0, 10));

                    const eventtime = card.getElementsByClassName('main-text-time')[0];
                    eventtime.textContent = events.date.slice(11, 16);
                    const eventvenue = card.getElementsByClassName('main-text-venue')[0];
                    eventvenue.textContent = events.venue.name;
                    if (eventvenue.textContent.length > 10) {
                        eventvenue.textContent = events.venue.name.slice(0, 10) + '...';
                    }
                    const eventlocation = card.getElementsByClassName('main-text-loc')[0];
                    eventlocation.textContent = events.venue.city;
                    const eventquant = card.getElementsByClassName('main-text-quant')[0];
                    eventquant.textContent = events.quantity;
                    const eventcost = card.getElementsByClassName('main-text-cost')[0];
                    eventcost.textContent = '$' + events.cost;


                    if (events.venue.country === "CA") {
			card.classList.add('canada');
                    }


                    if (eventvenue.textContent.length > 10) {
                        eventvenue.textContent = events.venue.name.slice(0, 10) + '...';
                    }

                    function abortAllRequests() {
                        abortControllers.forEach(controller => controller.abort());
                        abortControllers = []; // Clear the array after aborting
                    }


//
function getDayOfWeek(dateString) {
    // Parse the date string into a Date object
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    // Array of days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    // Get the day of the week as a number (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = date.getDay();

    // Return the name of the day
    return daysOfWeek[dayOfWeek];
}

function retrievetickets(){
const eventID = document.querySelector('#selectedevent').getAttribute('eventid');
const xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_inventory?searchkey=');
const userEmail = datas['Email'];
const apiToken = datas['pyeo'];
const request = new XMLHttpRequest();
const url = `${xanoUrl}${eventID}&user=${userEmail}`;

request.open('GET', url, true);
request.setRequestHeader("Authorization", apiToken);
request.onload = function() {
if (request.status === 401) {
} else if (request.status >= 200 && request.status < 400) {
document.querySelector('.locked-content').style.display = 'none';
        const data = JSON.parse(this.response);
        const cardContainer = document.getElementById("Cards-Container2");
        const sampleStyle = document.getElementById('samplestyle2');
        const isAuthorizedUser = ['aleksei@ubikanalytic.com', 'tim@ubikanalytic.com'].includes(userEmail);

        document.querySelector('#lowerabletext').style.display = isAuthorizedUser ? 'flex' : 'none';
        containslowerable = false;

        data.forEach(events => {
            const card = sampleStyle.cloneNode(true);
            card.setAttribute('id', events.id);
            const eventPrice = card.querySelector('.main-field-price');

            const shownquant = card.querySelector('.main-text-shownquantity');

            if(events.shownQuantity !== null){
            shownquant.textContent = events.shownQuantity
            } else {
            shownquant.textContent = events.quantity

            }


if (events.tags && events.tags.includes('lowerable')) {
                containslowerable = true;
}


            const eventpriceticket = card.getElementsByClassName('main-text-priceticket')[0]
            let dticket = String((events.cost/events.quantity))

            if(dticket.includes('.')){
            let pti = dticket.split(".");

            let ptix = pti[0] + '.' + pti[1].slice(0,2)
            eventpriceticket.textContent = '$' + ptix
            } else {
            eventpriceticket.textContent = '$' + dticket
            }


            let typingTimer;
            let typingTimer2;
            const doneTypingInterval = 1000
/**
eventPrice.addEventListener('keyup', () => {
    let crds = document.querySelectorAll('.event-box.selected.includesfees').length

    clearTimeout(typingTimer);
    if (eventPrice.value && document.querySelector('#vspricing').checked && crds<=0) {
        typingTimer = setTimeout(() => {
            var Y_given = Number(eventPrice.value);
            if (isNaN(Y_given)) {
                console.error('Y_given is not a number');
                return;
            }

            let X_predicted = (1.16 * Y_given) - (0.0329 * Y_given);

            let X_predicted_rounded = X_predicted.toFixed(2);
            eventPrice.value = X_predicted_rounded;
        }, doneTypingInterval);
    }
});
**/

eventPrice.addEventListener('keyup', () => {
    let crds = document.querySelectorAll('.event-box.selected.includesfees').length

    clearTimeout(typingTimer2);
    if (eventPrice.value && document.querySelector('#vspricing').checked && crds>0) {
        typingTimer = setTimeout(() => {
            var Y_given = Number(eventPrice.value);
            if (isNaN(Y_given)) {
                console.error('Y_given is not a number');
                return;
            }

            let X_predicted = (0.87 * Y_given);
            let X_predicted_rounded = X_predicted.toFixed(2);
            eventPrice.value = X_predicted_rounded;
        }, doneTypingInterval);
    }
});



            eventPrice.addEventListener("keypress", (event) => {
                if ((event.keyCode === 13) && (!eventPrice.readOnly)) {
                    card.querySelector('.save-price-button').click();
                    document.querySelector('#isfocus').textContent = '1';
                    setTimeout(() => document.querySelector('#isfocus').textContent = '0', 5000);
                }
            });

            updateCardContent(card, events, isAuthorizedUser);
            cardContainer.appendChild(card);

        });

        lowerableview = document.querySelector('#lowerable').checked

        if(containslowerable === false && lowerableview){

            const eventID = document.querySelector('.event-box.selected').id

            const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/remove_pricechanges?event_id=${eventID}`;
            const http = new XMLHttpRequest();
            http.open("PUT", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.send();

            document.querySelector('.event-box.selected').remove()
            const pricingBoxes = document.querySelectorAll('.event-box-pricing');
            pricingBoxes.forEach(pricingBox => {
            if (pricingBox.id !== 'samplestyle2') {
                pricingBox.remove();
            }
            });
        }

    } else {
        console.error('Failed to load data');
    }

    $('#mainpricing').css("display", "block");
    $('#loadingpricing').css("display", "none");
    $('#samplestyle2').hide();
};
request.send();

}

function updateCardContent(card, events, isAuthorizedUser) {
const lowerableCheck = card.querySelector('.main-checkbox-lowerprice');
const eventID = document.querySelector('#selectedevent').getAttribute('eventid');

lowerableCheck.setAttribute('id', "check" + events.id);
lowerableCheck.style.display = isAuthorizedUser ? 'flex' : 'none';

card.querySelector('.main-text-id').textContent = events.id;
card.querySelector('.main-text-section').textContent = events.section;
card.querySelector('.main-text-rows').textContent = events.row;
card.querySelector('.main-text-seats').textContent = events.lowSeat + ' - ' + events.highSeat;
card.querySelector('.main-text-qty').textContent = events.quantity;
card.querySelector('.main-field-price').value = events.listPrice;
card.querySelector('.main-text-cst').textContent = `$${events.cost}`;
card.querySelector('.main-text-notes').textContent = events.notes;
card.querySelector('.main-text-inhand').textContent = events.inHandDate;

updateLowerableCheck(lowerableCheck, events, eventID);
updateLastUpdated(card, events);
updateViewPrice(eventID,card, events);
checkPricingStatus(card, events.id);

const savePriceButton = card.querySelector('.save-price-button');
savePriceButton.addEventListener('click', function() {
    handleSavePriceButtonClick(card);
});
}



async function updateLowerableCheck(lowerableCheck, events, eventID) {
    let tags = [];

    if (events.tags && events.tags.includes('lowerable')) {
        lowerableCheck.checked = true
    }


    // Add event listener to the checkbox
    lowerableCheck.addEventListener('change', function () {
        const eventID = document.querySelector('.event-box.selected').id
        const ticketID = lowerableCheck.closest('.event-box-pricing').id;
        // Construct URL for the PUT request
        const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/${lowerableCheck.checked ? 'allow' : 'remove'}_pricechanges?ticket_id=${ticketID}&event_id=${eventID}`;

        console.log('Request URL:', url); // Debug: Output the constructed URL

        // Send the PUT request
        const http = new XMLHttpRequest();
        http.open("PUT", url, true);
        http.setRequestHeader("Content-type", "application/json; charset=utf-8");
        http.send();
    });
}


function handleSavePriceButtonClick(card) {
const savePriceButton = card.querySelector('.save-price-button');
const eventPrice = card.querySelector('.main-field-price');

savePriceButton.addEventListener("click", (event) => {
    if (!eventPrice.readOnly) {
        document.querySelector('#isfocus').textContent = '1';
        setTimeout(() => document.querySelector('#isfocus').textContent = '0', 5000);
    }
});

$(savePriceButton).closest('div').find(".main-field-price").prop("readonly", true);
$(savePriceButton).hide();
$(savePriceButton).closest('div').find(".notbt").css("display", "flex");
document.querySelector(".confirmation-pricing").style.display = 'flex';

let eventsAmount = Number(document.querySelector("#eventsamount").textContent);
eventsAmount++;
document.querySelector("#eventtext").textContent = eventsAmount === 1 ? "event" : "events";
document.querySelector("#eventsamount").textContent = eventsAmount;

const activeEvent = document.querySelector('.event-box.selected').id
const activeTicket = $(savePriceButton).closest(".event-box-pricing").attr('id');
const price = eventPrice.value;
const user = datas['Email'];
const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_add_to_queue?ticket-id=${activeTicket}&price=${price}&user=${user}&eventid=${activeEvent}`;
const http = new XMLHttpRequest();
const apiToken = datas['pyeo'];

http.open("PUT", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.setRequestHeader("Authorization", apiToken);
http.send();
$('.event-box.selected').addClass('pricechange');
}

function updateLastUpdated(card, events) {
const lastUpdated = card.querySelector('.main-text-updated');
const updatedTime = moment.utc(events.lastPriceUpdate).subtract(4, 'hours').format('MM-DD HH:mm');

lastUpdated.textContent = updatedTime;
}

function updateViewPrice(selectedcard,card, events) {
const viewPrice = card.querySelector('.main-text-vw');
const listPrice = Math.round(Number(events.listPrice));

if (isNaN(listPrice)) {
    console.error('listPrice is not a number');
    return;
}

const a = 1.3513;
const b = 0.8123;
const predictedPrice = (a + b * listPrice).toFixed(2);

viewPrice.textContent = predictedPrice;


let curitem = document.getElementById(selectedcard);

if (curitem && curitem.classList.contains("includesfees")) {
    const feespricing = 2.5 + (listPrice * 1.18);
    viewPrice.textContent = feespricing.toFixed(2);
}


}

function checkPricingStatus(card, ticketID) {
const user = datas['Email'];
const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_check_item?ticket_id=${ticketID}&user=${user}`;
const http = new XMLHttpRequest();
const apiToken = datas['pyeo'];

http.open("GET", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.setRequestHeader("Authorization", apiToken);
http.send();

http.onload = function() {
    if (http.response === 'true') {
        card.querySelector('.main-field-price').readOnly = true;
        card.querySelector('.save-price-button').style.display = 'none';
        card.querySelector('.notbt').style.display = 'flex';
    }
};
}
                    card.addEventListener('click', function() {
                        abortAllRequests();
                        document.querySelector('#vividclick').style.display = 'none';
                        document.querySelector('#stubhubclick').style.display = 'none';
                        document.querySelector('#mainurl').value = '';
                        document.querySelector('#urlmain').style.display = 'none';
                        document.querySelector('#changedata').style.display = 'none';
                        document.querySelector('#urlmainmobile').style.display = 'none';
                        document.getElementById('142box').style.display = 'none';
                        document.getElementById('142boxmobile').style.display = 'none';
                        document.querySelector('#urlmain').setAttribute('url', '');
                        document.querySelector('#selectedevent').setAttribute('VDID', '');
                        document.querySelector('#urlmainmobile').setAttribute('url', '');
                        document.querySelector('#shubcross').style.display = 'none';

                        document.querySelector('#chart2').style.display = 'none';
                        document.querySelector('#chartloading2').style.display = 'flex';
                        document.querySelector("#loading2").style.display = "flex";
                        document.querySelector("#loadingfailed2").style.display = "none";

                        document.querySelector('#chart3').style.display = 'none';
                        document.querySelector('#chartloading3').style.display = 'flex';
                        document.querySelector("#loading3").style.display = "flex";
                        document.querySelector("#loadingfailed3").style.display = "none";

                        chartvs.data.datasets[0].data = '';
                        chartvs.data.datasets[1].data = '';
                        chartvs.config.data.labels = '';
                        chartvs.update();

                        chartprimary.data.datasets[0].data = '';
                        chartprimary.config.data.labels = '';
                        chartprimary.data.datasets[0].label = '';
                        chartprimary.data.datasets.splice(1,3)

                        chartprimary.update();

                        $('#mainpricing').hide();
                        $('#loadingpricing').css("display", "flex");
                        $(this).closest('div').find(".main-field-price").prop("readonly", true);
                        document.querySelector('#fwicon5').textContent = '';
                        $('.event-box-pricing').each(function(i, obj) {
                            if (this.id !== 'samplestyle2') {
                                this.remove();
                            }
                        });
                        document.querySelector('#samplestyle2').style.display = 'flex';
                        $(".event-box").removeClass("selected");

                        card.classList.add("selected");

                        setTimeout(() => {
                            if (events.stubhubEventUrl !== null && events.stubhubEventUrl.length > 0) {
                                let stuburl = events.stubhubEventUrl;
                                const regex = /event\/(\d+)/;
                                const match = stuburl.match(regex);
                                const stubhubid = match ? match[1] : null;
                                document.querySelector("#refreshstub").click();
                                document.querySelector('#selectedevent').setAttribute('stubhub-id', stubhubid);
                                document.querySelector('#shubcross').style.display = 'none';
                                document.querySelector("#shub").style.pointerEvents = "auto";
                            } else {
                                document.querySelector('#shubcross').style.display = 'flex';
                                document.querySelector("#shub").style.pointerEvents = "none";
                            }
                        }, 500);
                        document.querySelector('#selectedevent').setAttribute('eventid', events.id);

                        document.querySelector('#selectedevent').textContent = events.name.slice(0, 15);
                        document.querySelector('#selectedevent').setAttribute('VDID', events.venue.id + events.date.slice(0, 10));
                        document.querySelector('#eventdate').textContent = events.date.slice(0, 10);
                        document.querySelector('#eventtime').textContent = events.date.slice(11, 16);
                        document.querySelector('#eventlocation').textContent = events.venue.city + ", " + events.venue.state;
                        document.querySelector('#shub').setAttribute('url', events.stubhubEventUrl);
                        document.querySelector('#vseats').setAttribute('url', events.vividSeatsEventUrl);
                        document.querySelector('#shubmobile').setAttribute('url', events.stubhubEventUrl);
                        document.querySelector('#vseatsmobile').setAttribute('url', events.vividSeatsEventUrl);
                        vividseatsurl = events.vividSeatsEventUrl
                        $(".platform-icon").css('display', 'flex');
                        document.querySelector('#fwicon1').textContent = '';
                        document.querySelector('#fwicon2').textContent = '';
                        document.querySelector('#fwicon3').textContent = '';
                        document.querySelector('#fwicon4').textContent = '';

                        lowerableview = document.querySelector('#lowerable').checked

                        if(lowerableview === false){
                        getchartprimary();
                        getchartvs();
                        }

                        vividsections();
                        retrievetickets()
                        stubhubsections()
                    });
                    cardContainer.appendChild(card);
                });
                checkexp()
                checkpurchdates()
                $('#mainpricing').css("display", "block");
                $('#loadingpricing').css("display", "none");
                $('#samplestyle2').hide();
                document.querySelector('#searchbar1').disabled = false
            }
        };

        request.send();
    });
});

// Helper function to handle ticketmaster URL
function handleTicketmasterUrl(url) {
    document.getElementById('142box').style.display = 'flex';
    document.getElementById('142boxmobile').style.display = 'flex';
    let onefourtwo = `http://142.93.115.105:8100/event/${url.split('/event/')[1]}/details/`;

    document.getElementById('142box').addEventListener('click', function() {
        window.open(onefourtwo, 'onefourtwo');
    });

    document.getElementById('142boxmobile').addEventListener('click', function() {
        window.open(onefourtwo, 'onefourtwomobile');
    });
}

async function getchartprimary() {
    const controller = new AbortController();
    abortControllers.push(controller);

    let vdid = document.querySelector('#selectedevent').getAttribute('vdid');

    try {
        const response = await fetch(`https://ubik.wiki/api/primary-events/?vdid__iexact=${vdid}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const exists = data.count;

        if (exists > 0) {
            const event = data.results[0];
            const counts = event.counts;
            let details = getSourceDetails(event.event_url)
            let source = details.source
            let evname = event.name
            let evdate = event.date
            let venueid = event.site_venue_id;
            chartprimary.data.datasets[0].label = `${source.toUpperCase()} Primary`;

            document.getElementById('primaryicon1').textContent = ''
            document.getElementById('primaryicon2').textContent = ''
            document.getElementById('primaryname').textContent = ''
            document.getElementById('primarydate').textContent = ''

                document.getElementById('primaryicon1').textContent = ''
                document.getElementById('primaryicon2').textContent = ''
                document.getElementById('primaryname').textContent = evname.slice(0, 10) + '...'
                document.getElementById('primarydate').textContent = evdate



            let evids = event.site_event_id;
            let url = event.event_url
            if (evids.includes('tm')) evids = evids.substring(2);

            document.querySelector('#urlmain').setAttribute('url', event.event_url);
            document.querySelector('#mainurl').value = event.event_url;
            document.querySelector('#urlmain').style.display = 'flex';
            document.querySelector('#changedata').style.display = 'flex';
            document.querySelector('#urlmainmobile').setAttribute('url', event.event_url);
            document.querySelector('#urlmainmobile').style.display = 'flex';

            document.querySelector('#urlmain').addEventListener('click', function() {
            let url = document.querySelector('#urlmain').getAttribute('url');
            if (url.length > 10) window.open(url, 'urlmain');
            });

            document.querySelector('#fwicon6').textContent = '';

            if (url.includes('ticketmaster') || url.includes('livenation')) {
                handleTicketmasterUrl(url);
                fetchTicketmasterData(evids);
            } else if (counts && counts.length > 0 && !source.includes('tm')) {
                updateChartWithPrimaryAndPreferred(counts, venueid, evids);
            } else {
                displayLoadingFailed();
            }
        } else {
            document.querySelector('#urlmainmobile').style.display = 'none';
            document.querySelector('#urlmain').style.display = 'none';
            displayLoadingFailed();
        }
    } catch (error) {
        console.error('There was an error fetching the data:', error);
        displayLoadingFailed();
    }
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

function updateChartWithPrimaryAndPreferred(counts, venueid, evids) {
    let amountsPrimary = [];
    let datesPrimary = [];
    let combinedDates = new Set();
    let preferredData = [];

    chartprimary.data.datasets.splice(1,3)
    chartprimary.update();

    // Populate primary amounts and dates
    counts.forEach(count => {
        amountsPrimary.push(Math.round(count.primary_amount));
        datesPrimary.push(normalizeDate(count.scrape_date));
        combinedDates.add(normalizeDate(count.scrape_date));
    });

    console.log("Primary data amounts:", amountsPrimary);
    console.log("Primary data dates:", datesPrimary);

    // Fetch preferred sections and preferred counts
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

        // Step 2: Fetch counts for preferred sections from another API
        fetch(`https://ubik.wiki/api/primary-counts/?tickets_by_sections__icontains={&event_id__icontains=${evids}&limit=1000&format=json`, {
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
            chartprimary.config.data.labels = combinedDates;
            chartprimary.data.datasets[0].data = alignedPrimaryData;

                  preferredData.forEach(prefDataset => {
                    chartprimary.data.datasets.push({
                          data: prefDataset.alignedAmounts,
                          label: prefDataset.label,
                          backgroundColor: prefDataset.backgroundColor,
                          borderColor: prefDataset.borderColor,
                          borderWidth: 1
                      });
                  });

                  chartprimary.update();

            console.log("Chart updated with primary and preferred data");

            document.querySelector("#chart3").style.display = "flex";
            document.querySelector("#chartloading3").style.display = "none";
            document.querySelector("#loading3").style.display = "flex";
            document.querySelector("#loadingfailed3").style.display = "none";
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





// Helper function to fetch ticketmaster data
function fetchTicketmasterData(evids) {
    const controller = new AbortController();
    abortControllers.push(controller);

    var http = new XMLHttpRequest();
    var url = `https://shibuy.co:8443/142data?eventid=${evids}`;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.signal = controller.signal;

    http.onload = function() {
        let data = JSON.parse(this.response);
        if (data.length > 0) {
            processTicketmasterData(data);
        } else {
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

    document.getElementById('primaryicon1').textContente = ''
    document.getElementById('primaryicon2').textContent = ''
    document.getElementById('primaryname').textContent = ''
    document.getElementById('primarydate').textContent = ''

        let eventname = data[0].name
        let eventdate = data[0].date.slice(0, 10)
        document.getElementById('primaryicon1').textContent = ''
        document.getElementById('primaryicon2').textContent = ''
        document.getElementById('primaryname').textContent = eventname.slice(0, 10) + '...'
        document.getElementById('primarydate').textContent = eventdate

    console.log(prefSections);

    chartprimary.data.datasets.splice(1, 3);
    chartprimary.update();

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
    chartprimary.data.datasets[0].data = sortedPrimaryData.sortedAmounts;
    chartprimary.config.data.labels = sortedPrimaryData.sortedDates;

    // Ensure primary dataset is always present
    chartprimary.data.datasets = [{
        data: sortedPrimaryData.sortedAmounts,
        label: `TM Primary`,
        backgroundColor: 'rgba(0, 102, 51, 1)',
        borderColor: 'rgba(0, 102, 51, 1)',
        borderWidth: 1
    }];

    // Add other datasets conditionally, only if prefSections are not empty or "null"
    if (prefSections.pref1 && prefSections.pref1 !== "null" && sortedData1.sortedAmounts.length > 0) {
        chartprimary.data.datasets.push({
            data: sortedData1.sortedAmounts,
            label: `${prefSections.pref1}`,
            backgroundColor: 'rgba(52, 152, 219, 1)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        });
    }

    if (prefSections.pref2 && prefSections.pref2 !== "null" && sortedData2.sortedAmounts.length > 0) {
        chartprimary.data.datasets.push({
            data: sortedData2.sortedAmounts,
            label: `${prefSections.pref2}`,
            backgroundColor: 'rgba(46, 204, 113, 1)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1
        });
    }

    if (prefSections.pref3 && prefSections.pref3 !== "null" && sortedData3.sortedAmounts.length > 0) {
        chartprimary.data.datasets.push({
            data: sortedData3.sortedAmounts,
            label: `${prefSections.pref3}`,
            backgroundColor: 'rgba(241, 196, 15, 1)',
            borderColor: 'rgba(241, 196, 15, 1)',
            borderWidth: 1
        });
    }

    console.log("Final datasets for the chart:", chartprimary.data.datasets);

    // Update the chart
    chartprimary.update();

    document.querySelector("#chart3").style.display = "flex";
    document.querySelector("#chartloading3").style.display = "none";
    document.querySelector("#loading3").style.display = "flex";
    document.querySelector("#loadingfailed3").style.display = "none";
}


// Helper function to display loading failed
function displayLoadingFailed() {
    document.querySelector("#loading3").style.display = "none";
    document.querySelector("#loadingfailed3").style.display = "flex";
    document.querySelector("#chart3").style.display = "none";
    document.querySelector("#chartloading3").style.display = "flex";
}

// Function to fetch weather data and update the DOM
async function fetchWeatherData(q, dt,source) {
    document.querySelector('#vivid-weather').textContent = '';
    document.querySelector('#vivid-weathericon').src = '';
    document.querySelector('#vivid-weathericon').style.display = 'none';

    const apiKey = '177ea20bfbc344c7bf2130946241605';
    const today = new Date();
    const targetDate = new Date(dt);
    const dateDifference = (targetDate - today) / (1000 * 60 * 60 * 24);

    let url;
    if (dateDifference <= 14) {
        url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&dt=${dt}`;
    } else {
        url = `https://api.weatherapi.com/v1/future.json?key=${apiKey}&q=${q}&dt=${dt}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const icon = data.forecast.forecastday[0].day.condition.icon;
        const weather = data.forecast.forecastday[0].day.condition.text;
        const hourarray = data.forecast.forecastday[0].hour;
        let time = document.querySelector('#vividtime').textContent;

        let hresult = findClosestWeatherByTime(hourarray, time);
        if (hresult) {
            let temperature = hresult.temp_f;

            if(source === 'vivid'){
                document.querySelector('#vivid-weather').textContent = `${weather} ${temperature}°F`;
                document.querySelector('#vivid-weathericon').src = icon;
                document.querySelector('#vivid-weathericon').style.display = 'flex';
            } else if(source === 'stub'){
                document.querySelector('#vivid-weather2').textContent = `${weather} ${temperature}°F`;
                document.querySelector('#vivid-weathericon2').src = icon;
                document.querySelector('#vivid-weathericon2').style.display = 'flex';
            }


        } else {
            console.error('Time not found in the data.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Function to find closest weather by time
function findClosestWeatherByTime(hourArray, time) {
    let [hour, minute] = time.split(':').map(Number);
    if (minute >= 30) hour += 1;
    let targetTime = hour.toString().padStart(2, '0') + ':00';

    return hourArray.find(item => item.time.split(' ')[1] === targetTime);
}

// Function to get vivid sections data


async function vividsections() {
    const controller = new AbortController();
    abortControllers.push(controller);

    document.getElementById('event-clickable').href = ''
    document.querySelector('#seatinghide').style.display = 'none';
    document.querySelector('#vividevent').textContent = '';
    document.querySelector('#vividlocation').textContent = '';
    document.querySelector('#vividdate').textContent = '';
    document.querySelector('#vividtime').textContent = '';
    document.querySelector('#vivid-tix').textContent = '';
    document.querySelector('#vivid-tl').textContent = '';
    document.querySelector('#vivid-min').textContent = '';
    document.querySelector('#vivid-max').textContent = '';
    document.querySelector('#vivid-median').textContent = '';
    document.querySelector('#vivid-avg').textContent = '';
    document.querySelector('#vivid-capacity').textContent = '';
    document.querySelector('#vivid-dow').textContent = '';
    document.querySelector('.seatingmap').src = '';
    let elements = document.querySelectorAll('.top-part-section');
    elements.forEach(element => {
        if (element.id !== 'sampleitem') {
            element.parentNode.removeChild(element);
        } else if (element.id === 'sampleitem') {
            element.style.display = 'flex';
        }
    });

    // Get the vivid_id from the attribute
    let vivid_id = document.querySelector('#vseats').getAttribute('url').split('productionId=')[1];
    const csvUrl = `https://ubikdata.wiki:3000/listing/${vivid_id}`;

    // Function to fetch data with retries
    const fetchData = async (url, options, retries) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.text();
            } catch (error) {
                if (i === retries - 1) throw error;
                console.error(`Retrying... (${i + 1})`);
            }
        }
    };

    try {
        const signal = controller.signal;
        const data = await fetchData(csvUrl, { signal }, 5); // Fetch data using the updated URL
        const evd = JSON.parse(data);
        const eventDetails = evd;
        const globalDetails = eventDetails.global[0];
        const ticketsDetails = eventDetails.tickets;

        let tickets = [];
        const vdcapacity = globalDetails.venueCapacity;
        const seatchart = globalDetails.staticMapUrl;

        document.getElementById('event-clickable').addEventListener('click', function() {
            let url = document.querySelector('#vseats').getAttribute('url')
            if (url.length > 10) window.open(url, 'vividmain');
        });


        ticketsDetails.forEach(ticket => {
            tickets.push({
                "section": ticket.s,
                "row": ticket.r,
                "price": ticket.aip ? ticket.aip : ticket.p,
                "quantity": ticket.q
            });
        });

        tickets.sort((a, b) => a.price - b.price);

        processPreferredInfo(tickets, vdcapacity, seatchart);
        document.querySelector('#sampleitem').style.display = 'none';
        document.querySelector('#vividclick').style.display = 'flex';
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}




async function stubhubsections() {
    const controller = new AbortController();
    abortControllers.push(controller);

    document.getElementById('event-clickable2').href = '';
    document.querySelector('#seatinghide2').style.display = 'none';
    document.querySelector('#vividevent2').textContent = '';
    document.querySelector('#vividlocation2').textContent = '';
    document.querySelector('#vividdate2').textContent = '';
    document.querySelector('#vividtime2').textContent = '';
    document.querySelector('#vivid-tix2').textContent = '';
    document.querySelector('#vivid-tl2').textContent = '';
    document.querySelector('#vivid-min2').textContent = '';
    document.querySelector('#vivid-max2').textContent = '';
    document.querySelector('#vivid-median2').textContent = '';
    document.querySelector('#vivid-avg2').textContent = '';
    document.querySelector('#vivid-dow2').textContent = '';
    document.querySelector('.seatingmap2').src = '';

    let elements = document.querySelectorAll('.top-part-section-stub');
    elements.forEach(element => {
        if (element.id !== 'sampleitem3') {
            element.parentNode.removeChild(element);
        } else if (element.id === 'sampleitem3') {
            element.style.display = 'flex';
        }
    });

    let stub_id = document.querySelector('#shub').getAttribute('url').split('/event/')[1].split('/')[0];
    const csvUrl = `https://ubik.wiki/api/query/stubhub/?q=E-${stub_id}`;

    // Function to fetch data with retries
    const fetchData = async (url, options, retries) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.text();
            } catch (error) {
                if (i === retries - 1) throw error;
                console.error(`Retrying... (${i + 1})`);
            }
        }
    };

    try {
        const signal = controller.signal;
        const data = await fetchData(
            csvUrl,
            {
                signal,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            },
            5
        );
        const evd = JSON.parse(data);
        eventDetailshub = evd;

        const ticketsDetails = eventDetailshub.grid.items

        let tickets = [];

        const seatchart = eventDetailshub.svgMapUrl;

        document.getElementById('event-clickable2').addEventListener('click', function() {
            let url = document.querySelector('#shub').getAttribute('url');
            if (url.length > 10) window.open(url, 'vividmain');
        });

        ticketsDetails.forEach(ticket => {
            if (ticket.availableTickets > 0) {
                tickets.push({
                    "section": ticket.section,
                    "row": ticket.row,
                    "price": ticket.rawPrice,
                    "quantity": ticket.availableTickets
                });
            }
        });
        tickets.sort((a, b) => a.price - b.price);

        processPreferredInfo2(tickets, seatchart);


        document.querySelector('#sampleitem3').style.display = 'none';
        document.querySelector('#stubhubclick').style.display = 'flex';
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}



function processPreferredInfo2(tickets, seatchart) {
    let eventdate = document.querySelector('#eventdate').textContent;
    document.querySelector('#vividevent2').textContent = document.querySelector('#selectedevent').textContent;
    document.querySelector('#vividlocation2').textContent = document.querySelector('#eventlocation').textContent;
    document.querySelector('#vividdate2').textContent = eventdate;
    document.querySelector('#vivid-dow2').textContent = getDayOfWeek(eventdate);
    document.querySelector('#vividtime2').textContent = document.querySelector('#eventtime').textContent;
    document.querySelector('.seatingmap2').src = seatchart;
    document.querySelector('#seatinghide2').style.display = 'flex';

    let container = document.querySelector('.sections-wrapper2');
    let allPrices = [];
    let totalQuantity = 0;

    tickets.forEach(ticket => {
        let quantity = parseInt(ticket.quantity, 10);
        let section = ticket.section;
        let row = ticket.row;
        let price = parseFloat(ticket.price);

        totalQuantity += quantity;
        allPrices.push(price);

        let clone = document.querySelector('.top-part-section-stub').cloneNode(true);
        clone.id = '';
        clone.setAttribute('section', section);
        clone.setAttribute('row', row);
        clone.setAttribute('quantity', quantity);
        clone.querySelector('.main-text-vivid-section2').textContent = section;
        clone.querySelector('.main-text-vivid-row2').textContent = row;
        clone.querySelector('.main-text-vivid-quantity2').textContent = quantity.toString();
        clone.querySelector('.main-text-vivid-price2').textContent = '$' + price.toFixed(2);



        container.appendChild(clone);
    });

    let lowestPrice = Math.min(...allPrices);
    let highestPrice = Math.max(...allPrices);
    let medianPrice = calculateMedian(allPrices);
    let averagePrice = allPrices.reduce((acc, cur) => acc + cur, 0) / allPrices.length;

    document.querySelector('#vivid-tl2').textContent = tickets.length;
    document.querySelector('#vivid-tix2').textContent = totalQuantity;
    document.querySelector('#vivid-min2').textContent = `$${lowestPrice.toFixed(2)}`;
    document.querySelector('#vivid-max2').textContent = `$${highestPrice.toFixed(2)}`;
    document.querySelector('#vivid-median2').textContent = `$${medianPrice.toFixed(2)}`;
    document.querySelector('#vivid-avg2').textContent = `$${averagePrice.toFixed(2)}`;



    let city = document.querySelector('#vividlocation2').textContent.split(',')[0];
    fetchWeatherData(city, eventdate,"stub");
}




// Function to process preferred info
function processPreferredInfo(tickets, vdcapacity, seatchart) {
    let eventdate = document.querySelector('#eventdate').textContent;
    document.querySelector('#vividevent').textContent = document.querySelector('#selectedevent').textContent;
    document.querySelector('#vividlocation').textContent = document.querySelector('#eventlocation').textContent;
    document.querySelector('#vividdate').textContent = eventdate;
    document.querySelector('#vivid-dow').textContent = getDayOfWeek(eventdate);
    document.querySelector('#vivid-capacity').textContent = 'Capacity: ' + vdcapacity;
    document.querySelector('#vividtime').textContent = document.querySelector('#eventtime').textContent;
    document.querySelector('.seatingmap').src = seatchart;
    document.querySelector('#seatinghide').style.display = 'flex';

    let container = document.querySelector('.sections-wrapper');
    let allPrices = [];
    let totalQuantity = 0;

    tickets.forEach(ticket => {
        let quantity = parseInt(ticket.quantity, 10);
        let section = ticket.section;
        let row = ticket.row;
        let price = parseFloat(ticket.price);

        totalQuantity += quantity;
        allPrices.push(price);

        let clone = document.querySelector('.top-part-section').cloneNode(true);
        clone.id = '';
        clone.setAttribute('section', section);
        clone.setAttribute('row', row);
        clone.setAttribute('quantity', quantity);
        clone.querySelector('.main-text-vivid-section').textContent = section;
        clone.querySelector('.main-text-vivid-row').textContent = row;
        clone.querySelector('.main-text-vivid-quantity').textContent = quantity.toString();
        clone.querySelector('.main-text-vivid-price').textContent = '$' + price.toFixed(2);



        container.appendChild(clone);
    });

    let lowestPrice = Math.min(...allPrices);
    let highestPrice = Math.max(...allPrices);
    let medianPrice = calculateMedian(allPrices);
    let averagePrice = allPrices.reduce((acc, cur) => acc + cur, 0) / allPrices.length;

    document.querySelector('#vivid-tl').textContent = tickets.length;
    document.querySelector('#vivid-tix').textContent = totalQuantity;
    document.querySelector('#vivid-min').textContent = `$${lowestPrice.toFixed(2)}`;
    document.querySelector('#vivid-max').textContent = `$${highestPrice.toFixed(2)}`;
    document.querySelector('#vivid-median').textContent = `$${medianPrice.toFixed(2)}`;
    document.querySelector('#vivid-avg').textContent = `$${averagePrice.toFixed(2)}`;



    let city = document.querySelector('#vividlocation').textContent.split(',')[0];
    fetchWeatherData(city, eventdate,"vivid");
}

// Helper function to calculate median
function calculateMedian(arr) {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

// Helper function to get day of week
function getDayOfWeek(dateString) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}

async function getchartvs() {
    let venuecap = 0;
    let dataEntries = [];
    let evurl = vividseatsurl;

    const controller = new AbortController();
    abortControllers.push(controller);

    try {
        const response = await fetch(`https://ubik.wiki/api/sbox-data/?limit=1000&vividseats_event_url__icontains=${evurl}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal
        });

        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);

        const vividresponse = await response.json();
        const commits = vividresponse.results;

        if (commits.length > 0) {
            processVividChartData(commits, dataEntries, venuecap);
        } else {
            displayChartLoadingFailed();
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('There was an error fetching the vivid chart data:', error);
            displayChartLoadingFailed();
        }
    }
}


// Helper function to process vivid chart data
function processVividChartData(commits, dataEntries, venuecap) {
    for (let i = 0; i < commits.length; i++) {
        if (commits[i].ticket_count > 0) {
            dataEntries.push({
                date: commits[i].date_scraped,
                amount: Math.round(commits[i].ticket_count),
                pref: Math.round(commits[i].preferred_count),
                lowestPrice: Math.round(commits[i].lowest_price),
                lowestPricePref: Math.round(commits[i].lowest_preferred_price)
            });
        }
    }

    dataEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    const datesvs = dataEntries.map(entry => entry.date);
    const amountsvs = dataEntries.map(entry => entry.amount);
    const prefvs = dataEntries.map(entry => entry.pref);
    const lowestprice = dataEntries.map(entry => entry.lowestPrice);
    const lowestpricepref = dataEntries.map(entry => entry.lowestPricePref);

    const lastCommit = commits[commits.length - 1];
    document.getElementById("venueresale").textContent = Math.round((lastCommit.ticket_count / venuecap) * 100) + "%";
    document.getElementById("venuecap").textContent = venuecap.toString();

    const threeDaysAgoIndex = Math.max(0, amountsvs.length - 4);
    const todayIndex = Math.max(0, amountsvs.length - 1);
    const movingAverage = (amountsvs[threeDaysAgoIndex] - amountsvs[todayIndex]) / 3;
    const movingAveragePref = (prefvs[threeDaysAgoIndex] - prefvs[todayIndex]) / 3;

    document.getElementById("fwicontotal3day").textContent = "";
    document.getElementById("total3daytext").textContent = "Total 3 Day:";
    document.getElementById("total3dayamount").textContent = movingAverage.toFixed(2);

    document.getElementById("fwiconpreferred3day").textContent = "";
    document.getElementById("preferred3daytext").textContent = "Preferred 3 Day:";
    document.getElementById("preferred3dayamount").textContent = movingAveragePref.toFixed(2);

    chartvs.data.datasets[0].data = amountsvs;
    chartvs.data.datasets[1].data = prefvs;
    chartvs.data.datasets[2].data = lowestprice;
    chartvs.data.datasets[3].data = lowestpricepref;
    chartvs.config.data.labels = datesvs;
    chartvs.update();

    document.querySelector("#chart2").style.display = "flex";
    document.querySelector("#chartloading2").style.display = "none";
    document.querySelector("#loading2").style.display = "flex";
    document.querySelector("#loadingfailed2").style.display = "none";
}

// Helper function to display chart loading failed
function displayChartLoadingFailed() {
    document.querySelector("#loading2").style.display = "none";
    document.querySelector("#loadingfailed2").style.display = "flex";
    document.querySelector("#chart2").style.display = "none";
    document.querySelector("#chartloading2").style.display = "flex";
}

// Function to get pdates

async function getpdates() {
    const curUser = firebase.auth().currentUser;
    const myFS = firebase.firestore();
    const docRef = myFS.doc("users/" + curUser.uid);

    try {
        const docSnap = await docRef.get();
        const data = docSnap.data();
        const pauth = data['pyeo'];
        const eventBoxes = document.querySelectorAll('.event-box');
        const maxConcurrentRequests = 50;
        let concurrentRequestCount = 0;

        for (let i = 0; i < eventBoxes.length; i++) {
            const eventBox = eventBoxes[i];
            const pdateElement = eventBox.querySelector('.main-text-pdate');




            if (pdateElement.textContent || eventBox.id === 'samplestyle') {
                continue;
            }

            const eventId = eventBox.id;
            const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_inventory_created?searchkey=${eventId}&user=aleksei@ubikanalytic.com`;

            if (concurrentRequestCount >= maxConcurrentRequests) {
                await sleep(1000);
            }

            fetch(url, {
                headers: {
                    'Authorization': pauth
                }
            })
            .then(async (response) => {
                if (!response.ok) throw new Error('Response not OK');
                const data = await response.text();
                const formattedDate = data.substring(2, 12);
                pdateElement.textContent = formattedDate;
                pdateElement.setAttribute('date', formattedDate);
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                concurrentRequestCount--;
            });

            concurrentRequestCount++;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('scrapedates').addEventListener('click', getpdates);





document.querySelector('#priceconfirm').addEventListener("click", () => {
    $('#priceconfirm').css({pointerEvents: "none"})
    $('.event-box-pricing').css({pointerEvents: "none"})
    $('.event-box').removeClass('pricechange');

    let uszz = datas['Email']
    var http = new XMLHttpRequest();
    var urll = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_confirm?user=" + uszz;
    pa = datas['pyeo']
    http.open("PUT", urll, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader("Authorization", pa);
    http.onload = function() {

    document.querySelector(".confirmation-pricing").style.display = 'none'
    $('#priceconfirm').css({pointerEvents: "auto"})
    $('.event-box-pricing').css({pointerEvents: "auto"})

    let selected = document.getElementsByClassName("event-box pricing selected")
    if(selected.length>0 && http.status >= 200 && http.status < 400) {
        selected[0].click()
    document.querySelector("#eventsamount").textContent = '0'

    }
    }
    http.send();
    })


document.querySelector("#pricecancel").addEventListener('click', function() {
    $('#pricecancel').css({pointerEvents: "none"})
    $('.event-box-pricing').css({pointerEvents: "none"})
    $('.event-box').removeClass('pricechange');
    let usz = datas['Email']
    var http = new XMLHttpRequest();
    var url = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_remove_queue?user=" + usz
    pa = datas['pyeo']
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader("Authorization", pa);

    http.onload = function() {
    let selected = document.getElementsByClassName("event-box pricing selected")
    if(selected.length>0 && http.status >= 200 && http.status < 400){
        selected[0].click()
    }
    document.querySelector(".confirmation-pricing").style.display = 'none'
    $('#pricecancel').css({pointerEvents: "auto"})
    $('.event-box-pricing').css({pointerEvents: "auto"})

    document.querySelector("#eventsamount").textContent = '0'
    document.querySelector(".notbt").style.display = 'none'
    $(".main-field-price").prop("readonly", false)
    }
    http.send();
    })

    const ids = ['vseats', 'shub', 'vseatsmobile', 'shubmobile'];

    ids.forEach(id => {
        const element = document.querySelector(`#${id}`);
        element.addEventListener('click', function handleClick() {
        const url = element.getAttribute('url');
        if(url.length>10){
        window.open(url,id)
        element.style.pointerEvents = "cursor";
        } else {
        element.style.pointerEvents = "none";
        }
    })
})



function checkexp() {
const xanoUrl = new URL(`https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/check_permissions`);
const userEmail = dataz['Email'];
const apiToken = dataz['pyeo'];
const request = new XMLHttpRequest();
const url = `${xanoUrl}?user=${userEmail}`;

request.open('GET', url, true);
request.setRequestHeader("Authorization", apiToken);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
    const response = JSON.parse(this.response);
    let queue = response.queue_events;
    let then = Number(response.expirydate);
    let now = Date.now();

    if (then < now) {
        document.querySelector('.locked-content').style.display = 'flex';
    } else {
        document.querySelector('.locked-content').style.display = 'none';
    }

    let count = 0;
    if (queue.length > 0) {
        queue.forEach(event => {
        count++;
        let card = document.getElementById(event.event_id);
        function checkCard() {
            if (card) {
            card.classList.add("pricechange");
            } else {
            setTimeout(checkCard, 1000);
            }
        }
        checkCard();
        });

        document.querySelector('#confirmprice').style.display = 'flex';
        document.querySelector('#eventsamount').textContent = count;

        if (count === 1) {
        document.querySelector('#eventtext').textContent = 'event';
        } else if (count > 1) {
        document.querySelector('#eventtext').textContent = 'events';
        }
    }
    } else {
        document.querySelector('.locked-content').style.display = 'flex';

    }
};

request.onerror = function() {
    console.error('Request failed');
};

request.send();
}


function checkpurchdates(){

fetch('https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_events_purchdate')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      // Get the element by its eventid
      const element = document.getElementById(String(item.eventid));
      if (element) {
        // Calculate days difference and set as an attribute
        let curdate = item.days_purch;
        let inhands = item.in_hand_date;
	let feesincl = item.feesincluded
        const daysDiff = getDaysDifference(curdate);
        element.setAttribute('createddate', daysDiff);

        const mainTextPdateElement = element.querySelector('.main-text-pdate');
        const maintextinhands = element.querySelector('.main-text-inhands');

	if(feesincl === 'true' || feesincl === true){
	element.classList.add('includesfees');
	}
          if(maintextinhands){
          maintextinhands.textContent = inhands
          }

        if (mainTextPdateElement) {
        mainTextPdateElement.textContent = daysDiff + ' Days'
        element.setAttribute('purchdate',daysDiff)
        }
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function getDaysDifference(timestamp) {
  // Ensure the timestamp is a number
  const ts = Number(timestamp);
  if (isNaN(ts)) {
    throw new Error('Invalid timestamp provided');
  }

  const dateFromTimestamp = moment.tz(ts, "America/New_York");

  // Get the current date/time in the America/New_York timezone
  const currentDate = moment.tz("America/New_York");

  // Calculate the difference in days and use Math.abs to ensure it's non-negative
  const daysDifference = Math.abs(dateFromTimestamp.diff(currentDate, 'days'));

  return daysDifference;
}


function inclfees(eventId) {

const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/remove_pricechanges?event_id=${eventId}`;

const http = new XMLHttpRequest();
http.open('PUT', url, true);
http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

http.onload = function() {
    if (http.status >= 200 && http.status < 300) {
        console.log('Request successful:', http.responseText);
    } else {
        console.error('Request failed:', http.status, http.statusText);
    }
};

http.onerror = function() {
    console.error('Request error:', http.status, http.statusText);
};

http.send();
}





document.querySelector('.closestubhub').addEventListener('click',function(){
    document.querySelector('#searchbarvivid2').value = ''
    document.querySelector('#filterquantity2').value = '99999'
    })
     document.getElementById('filterquantity2').addEventListener('change', function () {
        var selectedValue = parseInt(this.value);

        var sections = document.querySelectorAll('.top-part-section-stub');
        sections.forEach(function(section) {
            var quantity = parseInt(section.getAttribute('quantity'));
            if (quantity <= selectedValue) {
                section.style.display = 'flex';
            } else {
                section.style.display = 'none';
            }
        });
    });


    function updateSections2() {
        let searchValue = document.querySelector('#searchbarvivid2').value.toLowerCase();
        let selectedValue = parseInt(document.getElementById('filterquantity2').value);
        let sections = document.querySelectorAll('.top-part-section-stub');
        let totalQuantity = 0;
        let allPrices = [];

        sections.forEach(section => {
            // Skip the section if its id is 'sampleitem'
            if (section.id === 'sampleitem3') {
                return;
            }

            let sectionAttribute = section.getAttribute('section');
            let rowattr = section.getAttribute('row');
            let quantity = parseInt(section.getAttribute('quantity'));

            // Check both search and filter conditions
            let matchesSearch = sectionAttribute && sectionAttribute.toLowerCase().includes(searchValue);
            let matchesSearcht = rowattr && rowattr.toLowerCase().includes(searchValue);
            let matchesQuantity = quantity <= selectedValue;

            if ((matchesSearch || matchesSearcht) && matchesQuantity) {
                section.style.display = '';
                let sectionQuantity = parseInt(section.querySelector('.main-text-vivid-quantity2').textContent, 10);
                let price = parseFloat(section.querySelector('.main-text-vivid-price2').textContent.replace('$', ''));
                totalQuantity += sectionQuantity;
                allPrices.push(price);
            } else {
                section.style.display = 'none';
            }
        });


        // Update the total tickets and other stats
        document.querySelector('#vivid-tix2').textContent = totalQuantity;
        document.querySelector('#vivid-tl2').textContent = allPrices.length;
        if (allPrices.length > 0) {
            let lowestPrice = Math.min(...allPrices);
            let highestPrice = Math.max(...allPrices);
            let medianPrice = calculateMedian2(allPrices);
            let averagePrice = allPrices.reduce((acc, cur) => acc + cur, 0) / allPrices.length;
            document.querySelector('#vivid-min2').textContent = `$${lowestPrice.toFixed(2)}`;
            document.querySelector('#vivid-max2').textContent = `$${highestPrice.toFixed(2)}`;
            document.querySelector('#vivid-median2').textContent = `$${medianPrice.toFixed(2)}`;
            document.querySelector('#vivid-avg2').textContent = `$${averagePrice.toFixed(2)}`;
        } else {
            document.querySelector('#vivid-min2').textContent = '';
            document.querySelector('#vivid-max2').textContent = '';
            document.querySelector('#vivid-median2').textContent = '';
            document.querySelector('#vivid-avg2').textContent = '';
        }
    }

    function calculateMedian2(arr) {
        arr.sort((a, b) => a - b);
        let mid = Math.floor(arr.length / 2);
        return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    }

    document.querySelector('#searchbarvivid2').addEventListener('input', updateSections2);
    document.getElementById('filterquantity2').addEventListener('change', updateSections2);
    document.querySelector('#stubhubclick').addEventListener('click',function(){
    updateSections2()
    })
