let abortControllers = [];

Webflow.push(function() {
    $('form').submit(function() {
        return false;
    });
});

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
        let url = xanoUrl.toString() + keywords1.replaceAll("'", "''") + '&curdate=' + stimestamp2 + '&user=' + usr;
        let pa = datas['pyeo'];
        request.open('GET', url, true);
        request.setRequestHeader("Authorization", pa);
        request.onload = function() {
            $('#search-button').css({ pointerEvents: "auto" });
            let data = JSON.parse(this.response);
            if (request.status === 401) {
            } else if (request.status >= 200 && request.status < 400) {
                const cardContainer = document.getElementById("Cards-Container");
                let quantityseatdata = 0;
                

                data.forEach(events => {
                    quantityseatdata += Number(events.quantity);
                    const style = document.getElementById('samplestyle');
                    const card = style.cloneNode(true);

                    if (events.tags === 'lowerable') {
                        card.setAttribute('tags', events.tags);
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


                    function abortAllRequests() {
                        abortControllers.forEach(controller => controller.abort());
                        abortControllers = []; // Clear the array after aborting
                    }


//

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
document.querySelector('.locked-content').style.display = 'flex';
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
            
            if (events.tags === 'lowerable') {
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
            const doneTypingInterval = 1000
        
            eventPrice.addEventListener('keyup', () => {
                clearTimeout(typingTimer);
                if (eventPrice.value && document.querySelector('#vspricing').checked) {
                    typingTimer = setTimeout(() => {
                        var X_given = Number(eventPrice.value);
        
                        if (isNaN(X_given)) {
                            console.error('X_given is not a number');
                            return;
                        }
        
                        let Y_predicted = (
                            -0.56 +
                            1.20 * X_given
                        );
        
                        let Y_predicted_rounded = Y_predicted.toFixed(2);
                        eventPrice.value = Y_predicted_rounded;
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

            const ticketID = document.querySelector('.event-box.selected').id
            const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/remove_pricechanges?ticket_id=${ticketID}`;
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
card.querySelector('.main-text-qty').textContent = events.quantity;
card.querySelector('.main-field-price').value = events.listPrice;
card.querySelector('.main-text-cst').textContent = `$${events.cost}`;
card.querySelector('.main-text-notes').textContent = events.notes;


updateLowerableCheck(lowerableCheck, events, eventID);
updateLastUpdated(card, events);
updateViewPrice(card, events);
checkPricingStatus(card, events.id);

const savePriceButton = card.querySelector('.save-price-button');
savePriceButton.addEventListener('click', function() {
    handleSavePriceButtonClick(card);
});
}

function updateLowerableCheck(lowerableCheck, events, eventID) {
if (events.tags && events.tags.includes('lowerable')) {
    lowerableCheck.checked = true;
}

lowerableCheck.addEventListener('change', function () {
    const ticketID = lowerableCheck.closest('.event-box-pricing').id;
    const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/${lowerableCheck.checked ? 'allow' : 'remove'}_pricechanges?ticket_id=${ticketID}&event_id=${eventID}`;
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
}

function updateLastUpdated(card, events) {
const lastUpdated = card.querySelector('.main-text-updated');
const updatedTime = moment.utc(events.lastPriceUpdate).subtract(4, 'hours').format('MM-DD HH:mm');

lastUpdated.textContent = updatedTime;
}

function updateViewPrice(card, events) {
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
}

function checkPricingStatus(card, ticketID) {
const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_check_item?ticket_id=${ticketID}`;
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
        document.querySelector(".confirmation-pricing").style.display = 'flex';
    }
};
}
                    card.addEventListener('click', function() {
                        abortAllRequests();
                        document.querySelector('#vividclick').style.display = 'none';
                        document.querySelector('#mainurl').value = '';
                        document.querySelector('#urlmain').style.display = 'none';
                        document.querySelector('#changedata').style.display = 'none';
                        document.querySelector('#urlmainmobile').style.display = 'none';
                        document.getElementById('142box').style.display = 'none';
                        document.getElementById('142boxmobile').style.display = 'none';
                        document.querySelector('#urlmain').setAttribute('url', '');
                        document.querySelector('#selectedevent').setAttribute('VDID', '');
                        document.querySelector('#urlmainmobile').setAttribute('url', '');
                        document.querySelector('#sdatacount').textContent = '0';
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

                        let shubid = events.stubhubEventId;
                        if (shubid !== 0) {
                            const urlon = `https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/seatdata_data?eventid=${shubid}`;
                            fetch(urlon).then(response => response.text()).then(data => {
                                if (!data.includes('message')) {
                                    document.querySelector('#sdatacount').textContent = data;
                                }
                            });
                        }
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
                    });

                    cardContainer.appendChild(card);
                });

                $('#mainpricing').css("display", "block");
                $('#loadingpricing').css("display", "none");
                $('#samplestyle2').hide();
            }
        };

        request.send();
    });
});

async function getchartprimary() {

    abortControllers = [];
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
            let source = event.scraper_name.toLowerCase();

            chartprimary.data.datasets[0].label = `${source.toUpperCase()} Primary`;
            let evids = event.site_event_id;
            if (evids.includes('tm')) evids = evids.substring(2);

            document.querySelector('#urlmain').setAttribute('url', event.event_url);
            document.querySelector('#mainurl').value = event.event_url;
            document.querySelector('#urlmain').style.display = 'flex';
            document.querySelector('#changedata').style.display = 'flex';
            document.querySelector('#urlmainmobile').setAttribute('url', event.event_url);
            document.querySelector('#urlmainmobile').style.display = 'flex';

            let url = document.querySelector('#urlmain').getAttribute('url');
            document.querySelector('#urlmain').addEventListener('click', function() {
                if (event.event_url !== 'null') window.open(url, 'urlmain');
                $('#urlmain').css('cursor', 'pointer');
            });

            document.querySelector('#fwicon6').textContent = '';

            if (url.includes('ticketmaster') || url.includes('livenation')) {
                handleTicketmasterUrl(url);
                fetchTicketmasterData(evids);
            } else if (counts && counts.length > 0 && !source.includes('tm')) {
                updatePrimaryChart(counts);
            }  else {
                displayLoadingFailed();
            }
        } else {
            displayLoadingFailed();
        }
    } catch (error) {
        console.error('There was an error fetching the data:', error);
        displayLoadingFailed();
    }
}

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

// Helper function to update primary chart
function updatePrimaryChart(counts) {
    let amountsprimary = [];
    let datesprimary = [];

    for (let i = 0; i < counts.length; i++) {
        amountsprimary.push(Math.round(counts[i].primary_amount));
        datesprimary.push(counts[i].scrape_date);
    }

    const indices = Array.from({ length: datesprimary.length }, (_, i) => i);
    indices.sort((a, b) => new Date(datesprimary[a]) - new Date(datesprimary[b]));

    amountsprimary = indices.map(i => amountsprimary[i]);
    datesprimary = indices.map(i => datesprimary[i]);

    chartprimary.data.datasets[0].data = amountsprimary;
    chartprimary.config.data.labels = datesprimary;
    chartprimary.update();

    document.querySelector("#chart3").style.display = "flex";
    document.querySelector("#chartloading3").style.display = "none";
    document.querySelector("#loading3").style.display = "flex";
    document.querySelector("#loadingfailed3").style.display = "none";
}

// Helper function to fetch ticketmaster data
function fetchTicketmasterData(evids) {
    let dates = [];
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
            processTicketmasterData(data, dates);
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

// Helper function to process ticketmaster data
function processTicketmasterData(data, dates) {
    data.forEach(event => {
        event.summaries.forEach(summary => {
            const filteredSections = summary.sections.filter(section => section.type !== 'resale');
            const totalAmount = filteredSections.reduce((accumulator, section) => accumulator + section.amount, 0);

            const parts = summary.scrape_date.split(/[-T:Z]/);
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1] - 1, 10);
            const day = parseInt(parts[2], 10);
            const hours = parseInt(parts[3], 10);
            const minutes = parseInt(parts[4], 10);

            const scrapeDate = new Date(year, month, day, hours, minutes);
            scrapeDate.setHours(scrapeDate.getHours() - 1);

            const formattedDate = scrapeDate.toISOString().slice(0, 16).replace("T", " ");

            dates.push({
                date: scrapeDate.toISOString(),
                formattedDate: formattedDate,
                amount: totalAmount
            });
        });
    });

    dates.sort((a, b) => a.date.localeCompare(b.date));
    const sortedDates = dates.map(item => item.formattedDate);
    const sortedAmounts = dates.map(item => item.amount);

    chartprimary.data.datasets[0].data = sortedAmounts;
    chartprimary.config.data.labels = sortedDates;
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

activeRequests = [];

// Function to fetch weather data and update the DOM
async function fetchWeatherData(q, dt) {
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
            document.querySelector('#vivid-weather').textContent = `${weather} ${temperature}°F`;
            document.querySelector('#vivid-weathericon').src = icon;
            document.querySelector('#vivid-weathericon').style.display = 'flex';
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

    let vivid_id = document.querySelector('#vseats').getAttribute('url').split('productionId=')[1];
    const csvUrl = `https://ubikdata.wiki:3000/listing/${vivid_id}`;

    try {
        const controller = new AbortController();
        const signal = controller.signal;
        activeRequests.push(controller);

        const response = await fetch(csvUrl, { signal });
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.text();
        const evd = JSON.parse(data);
        const eventDetails = evd[0];
        const globalDetails = eventDetails.global[0];
        const ticketsDetails = eventDetails.tickets;

        let tickets = [];
        const vdcapacity = globalDetails.venueCapacity;
        const seatchart = globalDetails.staticMapUrl;

        ticketsDetails.forEach(ticket => {
            tickets.push({
                "section": ticket.s,
                "price": ticket.p,
                "quantity": ticket.q
            });
        });

        processPreferredInfo(tickets, vdcapacity, seatchart);
        document.querySelector('#sampleitem').style.display = 'none';
        document.querySelector('#vividclick').style.display = 'flex';
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
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
        let price = parseFloat(ticket.price);

        totalQuantity += quantity;
        allPrices.push(price);

        let clone = document.querySelector('.top-part-section').cloneNode(true);
        clone.id = '';
        clone.setAttribute('section', section);
        clone.querySelector('.main-text-vivid-section').textContent = section;
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
    fetchWeatherData(city, eventdate);
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

document.querySelector('#search-button').click()



document.querySelector('#priceconfirm').addEventListener("click", () => {
    $('#priceconfirm').css({pointerEvents: "none"})
    $('.event-box-pricing').css({pointerEvents: "none"})

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
