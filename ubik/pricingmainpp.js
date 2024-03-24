let abortControllers = []
Webflow.push(function() {
    $('form').submit(function() {
    return false;
    });
    });
    var input = document.getElementById("searchbar1");
    input.addEventListener("keyup", function(event)     {
    if (event.keyCode === 13) {
    event.preventDefault();
    }
    });

    document.querySelector('#search-button').addEventListener("click", () => {
        document.getElementById('venuebox').style.display = 'none';

    $('#search-button').css({pointerEvents: "none"})
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    document.querySelector('#selectedevent').textContent = ''
    document.querySelector('#eventdate').textContent = ''
    document.querySelector('#eventtime').textContent = ''
    document.querySelector('#eventlocation').textContent = ''
    document.querySelector('#shub').setAttribute('url', '');
    document.querySelector('#vseats').setAttribute('url', '');
    document.querySelector('#shubmobile').setAttribute('url', '');
    document.querySelector('#vseatsmobile').setAttribute('url', '');
    document.querySelector('#fwicon1').textContent = ''
    document.querySelector('#fwicon2').textContent = ''
    document.querySelector('#fwicon3').textContent = ''
    document.querySelector('#fwicon4').textContent = ''
    document.querySelector('#fwicon5').textContent = ''
    document.querySelector('#selectedevent').setAttribute('lastfetched','')
    document.querySelector('#fwicon5').textContent = ''

    document.querySelector('#chart2').style.display = 'none'
    document.querySelector('#chartloading2').style.display = 'none'
    document.querySelector("#loading2").style.display = "flex";
    document.querySelector("#loadingfailed2").style.display = "none";

    document.querySelector('#chart3').style.display = 'none'
    document.querySelector('#chartloading3').style.display = 'none'

    document.querySelector("#loading3").style.display = "flex";
    document.querySelector("#loadingfailed3").style.display = "none";



    document.querySelector('#pricingpart1').style.display = 'none'
    document.querySelector('#pricingpart2').style.display = 'flex'
    document.querySelector('#lowerable').checked = false
    document.querySelector('#urlmain').style.display = 'none'
    document.querySelector('#changedata').style.display = 'none'
    document.querySelector('#urlmainmobile').style.display = 'none'
    document.getElementById('142box').style.display = 'none'
    document.getElementById('142boxmobile').style.display = 'none'
    document.querySelector('#urlmain').setAttribute('url','')
    document.querySelector('#urlmainmobile').setAttribute('url','')

document.getElementById('mainurl').value = ''

    $('.event-box-pricing').hide()

    chartvs.data.datasets[0].data = ''
    chartvs.data.datasets[1].data = ''
    chartvs.config.data.labels = ''
    chartvs.update();


    let curUser = firebase.auth().currentUser;
    let myFS = firebase.firestore();
    let docRef = myFS.doc("users/" + curUser.uid);
    docRef.get().then((docSnap) => {
    let datas = docSnap.data();
    let usr = datas['Email']
    $(".platform-icon").hide()
$('.event-box').each(function(i, obj) {
if(this.id !== 'samplestyle'){
this.remove()
}
});
    $('#samplestyle').show()
    const dt = new Date();
    let stimestamp2 = moment(dt).format('YYYY-MM-DD')
    let xanoUrl = new URL('https://shibuy.co:8443/sboxinventory?searchkey=');
    let request = new XMLHttpRequest();
    let url = xanoUrl.toString() + keywords1.replaceAll("'", "''") + '&curdate=' + stimestamp2+'&user='+usr
    pa = datas['pyeo']
    request.open('GET', url, true)
    request.setRequestHeader("Authorization", pa);
    request.onload = function() {
    $('#search-button').css({pointerEvents: "auto"})
    let data = JSON.parse(this.response)
    if(request.status === 401){
    } else if (request.status >= 200 && request.status < 400) {
    const cardContainer = document.getElementById("Cards-Container")
    let quantityseatdata = 0

    data.forEach(events => {
    quantityseatdata + Number(events.quantity)
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)

    if(events.tags === 'lowerable'){
    card.setAttribute('tags',events.tags)
    }

    if(events[0] === 'unlisted'){
    card.classList.add('unlisted')
    }

    if(datas['Email'] === 'aleksei@ubikanalytic.com' || datas['Email'] === 'tim@ubikanalytic.com'){
    document.querySelector('.totalcounts').style.display = 'flex'
    card.setAttribute('id', events.id)
    } else {
    card.setAttribute('id', events.id);

    document.querySelector('#lowerbox').style.display = 'none'
    document.querySelector('#searchblock').style.display = 'none'
    }

    card.setAttribute('event', events.name);
    card.setAttribute('venue', events.venue.name);

    card.setAttribute('location', events.venue.city);
    card.setAttribute('date', events.date.slice(0,10))

    const eventname = card.getElementsByClassName('main-text-event')[0]
    eventname.textContent = events.name
    if(eventname.textContent.length>10) {
    eventname.textContent = events.name.slice(0, 10)+'...'
    }
    const eventdate = card.getElementsByClassName('main-text-date')[0]
    eventdate.textContent = events.date.slice(0, 10)

    const eventtime = card.getElementsByClassName('main-text-time')[0]
    eventtime.textContent = events.date.slice(11, 16)
    const eventvenue = card.getElementsByClassName('main-text-venue')[0]
    eventvenue.textContent = events.venue.name
    if(eventvenue.textContent.length>10) {
    eventvenue.textContent = events.venue.name.slice(0, 10)+'...'
    }
    const eventlocation = card.getElementsByClassName('main-text-loc')[0]
    eventlocation.textContent = events.venue.city
    const eventquant = card.getElementsByClassName('main-text-quant')[0]
    eventquant.textContent = events.quantity
    const eventcost = card.getElementsByClassName('main-text-cost')[0]
    eventcost.textContent = '$' + events.cost

async function getchartprimary(){


    let mainurl = document.querySelector('#urlmain').getAttribute('url');
    let amountsprimary = [];
    let datesprimary = [];

    fetch(`https://ubik.wiki/api/primary-events/?event_url__icontains=${mainurl}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let event = data.results[0];
        let counts = event.counts;
        let source = event.scraper_name.toLowerCase()
        chartprimary.data.datasets[0].label = source.toUpperCase() + ' Primary'
        evids = event.site_event_id
        if(evids.includes('tm')){
        evids = evids.substring(2)
        }
        if (counts && counts.length > 0 && !source.includes('tm')) {

            for (var i = 0; i < counts.length; i++) {
                    amountsprimary.push(Math.round(counts[i].primary_amount));
                    datesprimary.push(counts[i].scrape_date);
            }

            // Sorting dates and corresponding amounts
            const indices = Array.from({ length: datesprimary.length }, (_, i) => i);
            indices.sort((a, b) => new Date(datesprimary[a]) - new Date(datesprimary[b]));
            amountsprimary = indices.map(i => amountsprimary[i]);
            datesprimary = indices.map(i => datesprimary[i]);

            // Update chart data
            chartprimary.data.datasets[0].data = amountsprimary;
            chartprimary.config.data.labels = datesprimary;
            chartprimary.update();

            // Update display elements
            document.querySelector("#chart3").style.display = "flex";
            document.querySelector("#chartloading3").style.display = "none";
            document.querySelector("#loading3").style.display = "flex";
            document.querySelector("#loadingfailed3").style.display = "none";

        } else if(source === 'tm' || source === 'ticketmaster'){
        let dates = [];
        var http = new XMLHttpRequest();
        var url = "https://shibuy.co:8443/142data?eventid=" + evids
        http.open("GET", url, true);
        http.setRequestHeader("Content-type", "application/json; charset=utf-8");


        http.onload = function () {

        let data = JSON.parse(this.response);

        if(data.length>0) {
        data.forEach(event => {
        event.summaries.forEach(summary => {

        const nonResaleSections = summary.sections.filter(section => section.type !== 'resale');
        console.log(nonResaleSections)

            const totalAmount = nonResaleSections.reduce((accumulator, section) => accumulator + section.amount, 0);

              const parts = nonResaleSections.scrape_date.split(/[-T:Z]/);
              const year = parseInt(parts[0], 10);
              const month = parseInt(parts[1] - 1, 10);
              const day = parseInt(parts[2], 10);
              const hours = parseInt(parts[3], 10);
              const minutes = parseInt(parts[4], 10);

              const scrapeDate = new Date(year, month, day, hours, minutes);
              scrapeDate.setHours(scrapeDate.getHours() - 1);

              const formattedDate = scrapeDate.toISOString().slice(0, 16).replace("T", " ");

              dates.push({ date: scrapeDate.toISOString(), formattedDate: formattedDate, amount: totalAmount });
            });
          });

          dates.sort((a, b) => a.date.localeCompare(b.date));
          const sortedDates = dates.map(item => item.formattedDate);
          const sortedAmounts = dates.map(item => item.amount);
            chartprimary.data.datasets[0].label
            chartprimary.data.datasets[0].data = sortedAmounts;
            chartprimary.config.data.labels = sortedDates;
            chartprimary.update();

            document.querySelector("#chart3").style.display = "flex";
            document.querySelector("#chartloading3").style.display = "none";
            document.querySelector("#loading3").style.display = "flex";
            document.querySelector("#loadingfailed3").style.display = "none";

        } else {

            document.querySelector("#loading3").style.display = "none";
            document.querySelector("#loadingfailed3").style.display = "flex";
            document.querySelector("#chart3").style.display = "none";
            document.querySelector("#chartloading3").style.display = "flex";


        }
    
    
    };

    http.send();

        } else {

            document.querySelector("#loading3").style.display = "none";
            document.querySelector("#loadingfailed3").style.display = "flex";
            document.querySelector("#chart3").style.display = "none";
            document.querySelector("#chartloading3").style.display = "flex";
        }
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
    });

}

async function getchartvs() {
    let venuecap = 0;
    let dataEntries = []; // Array to hold combined data entries
    let evurl = events.vividSeatsEventUrl;

    var http = new XMLHttpRequest();
    var url = "https://ubik.wiki/api/sbox-data/?limit=1000&vividseats_event_url__icontains=" + evurl;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader('Authorization', `Bearer ${token}`);
    http.onload = function () {
        var vividresponse = JSON.parse(this.response);
        var commits = vividresponse.results;

        if (commits.length > 0) {
            for (var i = 0; i < commits.length; i++) {
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

            // Sort the combined data array by date
            dataEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Extract the sorted data into separate arrays
            const datesvs = dataEntries.map(entry => entry.date);
            const amountsvs = dataEntries.map(entry => entry.amount);
            const prefvs = dataEntries.map(entry => entry.pref);
            const lowestprice = dataEntries.map(entry => entry.lowestPrice);
            const lowestpricepref = dataEntries.map(entry => entry.lowestPricePref);

            const lastCommit = commits[commits.length - 1];
            document.getElementById("venueresale").textContent =
                Math.round((lastCommit.ticket_count / venuecap) * 100) + "%";
            document.getElementById("venuecap").textContent = venuecap.toString();

            let threeDaysAgoIndex = Math.max(0, amountsvs.length - 4); // Ensuring non-negative index
            let todayIndex = Math.max(0, amountsvs.length - 1); // Ensuring non-negative index
            let movingAverage = (amountsvs[threeDaysAgoIndex] - amountsvs[todayIndex]) / 3;
            let movingAveragePref = (prefvs[threeDaysAgoIndex] - prefvs[todayIndex]) / 3;

            document.getElementById("fwicontotal3day").textContent = "";
            document.getElementById("total3daytext").textContent = "Total 3 Day:";
            document.getElementById("total3dayamount").textContent = movingAverage.toFixed(2);

            document.getElementById("fwiconpreferred3day").textContent = "";
            document.getElementById("preferred3daytext").textContent = "Preferred 3 Day:";
            document.getElementById("preferred3dayamount").textContent = movingAveragePref.toFixed(2);

            // Assuming 'chartvs' is already defined and is a Chart.js instance
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
        } else {
            document.querySelector("#loading2").style.display = "none";
            document.querySelector("#loadingfailed2").style.display = "flex";
            document.querySelector("#chart2").style.display = "none";
            document.querySelector("#chartloading2").style.display = "flex";
        }
    };

    http.send();
}



const primaryurl = async function(){
document.querySelector('#urlmain').setAttribute('url','');
 abortControllers = []; // Array to hold all AbortControllers

    const controller = new AbortController();
    abortControllers.push(controller); // Add controller to the array

    let getevent = 'https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5:v1/getevent_primaryurl?search-key='+events.venue.id+events.date.slice(0,10)+'&search-key2='+events.name+'&search-key3='+events.date.slice(0,10);
    let response = await fetch(getevent, { signal: controller.signal });
    let commits = await response.json();

    if(commits.length>0) {
        document.querySelector('#urlmain').setAttribute('url', commits[0].Event_Url);
        document.querySelector('#mainurl').value = commits[0].Event_Url;
        document.querySelector('#urlmain').style.display = 'flex';
        document.querySelector('#changedata').style.display = 'flex';
        document.querySelector('#urlmainmobile').setAttribute('url', commits[0].Event_Url);
        document.querySelector('#urlmainmobile').style.display = 'flex';

        let url = document.querySelector('#urlmain').getAttribute('url')
        document.querySelector('#urlmain').addEventListener('click', function() {
        if(commits[0].Event_Url !== 'null') {
        window.open(url, 'urlmain');
        $('#urlmain').css('cursor', 'pointer');
        }});

        document.querySelector('#fwicon6').textContent = '';

        if(url.includes('ticketmaster') || url.includes('livenation')) {
            document.getElementById('142box').style.display = 'flex';
            document.getElementById('142boxmobile').style.display = 'flex';
            let onefourtwo = 'http://142.93.115.105:8100/event/' + url.split('/event/')[1] + '/details/';

            const tmcount = async function() {
                const tmController = new AbortController();
                abortControllers.push(tmController); // Add controller to the array

                let getevent = 'https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5:v1/tmcount?eventid=' + url.split('/event/')[1];
                let response = await fetch(getevent, { signal: tmController.signal });
                let commits = await response.json();
                if(commits.count) {
                    document.getElementById('tmcount').textContent = commits.count;
                }
            };

            tmcount();

            document.getElementById('142box').addEventListener('click', function() {
                window.open(onefourtwo, 'onefourtwo');
            });

            document.getElementById('142boxmobile').addEventListener('click', function() {
                window.open(onefourtwo, 'onefourtwomobile');
            });

        } else if(url === 'null') {
            $('#urlmain').css('cursor', 'default');
            document.getElementById('142box').style.display = 'none';
            document.getElementById('142boxmobile').style.display = 'none';
        }
    }

getchartprimary()
};

// Function to cancel all fetch requests
const cancelFetch = function() {
    abortControllers.forEach(controller => controller.abort());
    abortControllers = []; // Clear the array after aborting all requests
};


card.addEventListener('click', function() {
cancelFetch();
document.querySelector('#mainurl').value = ''
document.querySelector('#urlmain').style.display = 'none'
document.querySelector('#changedata').style.display = 'none'
document.querySelector('#urlmainmobile').style.display = 'none'
document.getElementById('142box').style.display = 'none'
document.getElementById('142boxmobile').style.display = 'none'
document.querySelector('#urlmain').setAttribute('url','')
document.querySelector('#selectedevent').setAttribute('VDID','')
document.querySelector('#urlmainmobile').setAttribute('url','')
document.querySelector('#sdatacount').textContent = '0'
document.querySelector('#shubcross').style.display = 'none'

document.querySelector('#chart2').style.display = 'none'
document.querySelector('#chartloading2').style.display = 'flex'
document.querySelector("#loading2").style.display = "flex";
document.querySelector("#loadingfailed2").style.display = "none";

document.querySelector('#chart3').style.display = 'none'
document.querySelector('#chartloading3').style.display = 'flex'

document.querySelector("#loading3").style.display = "flex";
document.querySelector("#loadingfailed3").style.display = "none";



chartvs.data.datasets[0].data = ''
chartvs.data.datasets[1].data = ''
chartvs.config.data.labels = ''
chartvs.update();


chartprimary.data.datasets[0].data = ''
chartprimary.config.data.labels = ''
chartprimary.data.datasets[0].label = ''
chartprimary.update();


    $('#mainpricing').hide()
    $('#loadingpricing').css("display", "flex");
    $(this).closest('div').find(".main-field-price").prop("readonly", true);
    document.querySelector('#fwicon5').textContent = ''
    $('.event-box-pricing').each(function(i, obj) {
    if(this.id !== 'samplestyle2'){
    this.remove()
    }
    });
    document.querySelector('#samplestyle2').style.display = 'flex'
    $(".event-box").removeClass("selected");

    card.classList.add("selected");

    setTimeout(() => {
    if(events.stubhubEventUrl !== null && events.stubhubEventUrl.length>0){
    let stuburl = events.stubhubEventUrl
    const regex = /event\/(\d+)/;
    const match = stuburl.match(regex);
    const stubhubid = match ? match[1] : null;
    document.querySelector("#refreshstub").click()
    document.querySelector('#selectedevent').setAttribute('stubhub-id',stubhubid);
    document.querySelector('#shubcross').style.display = 'none'
    document.querySelector("#shub").style.pointerEvents = "auto";
    } else {
    document.querySelector('#shubcross').style.display = 'flex'
    document.querySelector("#shub").style.pointerEvents = "none";
    }

    }, 500);

    if(datas['Email'] === 'aleksei@ubikanalytic.com' || datas['Email'] === 'tim@ubikanalytic.com'){
    document.querySelector('#selectedevent').setAttribute('eventid', events.id)
    } else {
    document.querySelector('#selectedevent').setAttribute('eventid', events.id)
    }
let shubid = events.stubhubEventId

if(shubid !== 0){

const urlon = `https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/seatdata_data?eventid=${shubid}`;

fetch(urlon).then(response => response.text()

).then(data => {
    if(!data.includes('message')){
    document.querySelector('#sdatacount').textContent = data;
    }
    })
}
    document.querySelector('#selectedevent').textContent = events.name.slice(0,15)
    document.querySelector('#selectedevent').setAttribute('VDID',events.venue.id + events.date.slice(0,10))
    document.querySelector('#eventdate').textContent = events.date.slice(0,10)
    document.querySelector('#eventtime').textContent = events.date.slice(11, 16)
    document.querySelector('#eventlocation').textContent = events.venue.city + ", " + events.venue.state
    document.querySelector('#shub').setAttribute('url', events.stubhubEventUrl);

    document.querySelector('#vseats').setAttribute('url', events.vividSeatsEventUrl);
    document.querySelector('#shubmobile').setAttribute('url', events.stubhubEventUrl);
    document.querySelector('#vseatsmobile').setAttribute('url', events.vividSeatsEventUrl);

    $(".platform-icon").css('display', 'flex');
    document.querySelector('#fwicon1').textContent = ''
    document.querySelector('#fwicon2').textContent = ''
    document.querySelector('#fwicon3').textContent = ''
    document.querySelector('#fwicon4').textContent = ''

    {

    let eventid = document.querySelector('#selectedevent').getAttribute('eventid')

    $('.event-box-2').hide()

    let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_inventory?searchkey=');
    let userr = datas['Email']
    let request = new XMLHttpRequest();
    let url = xanoUrl.toString() + eventid + '&user='+userr
    pa = datas['pyeo']
    request.open('GET', url, true)
    request.setRequestHeader("Authorization", pa);
    request.onload = function() {
    let data = JSON.parse(this.response)

    if(data === 'lowerable_soldout'){


const eventBoxes = document.querySelectorAll('.event-box');
eventBoxes.forEach(eventBox => {
if (eventBox.classList.contains('selected')) {
eventBox.remove();
}});

$('#search-button').css({pointerEvents: "none"})
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    document.querySelector('#selectedevent').textContent = ''
    document.querySelector('#selectedevent').setAttribute('VDID','')
    document.querySelector('#eventdate').textContent = ''
    document.querySelector('#eventtime').textContent = ''
    document.querySelector('#eventlocation').textContent = ''
    document.querySelector('#mainurl').value = ''

    document.querySelector('#shub').setAttribute('url', '');
    document.querySelector('#vseats').setAttribute('url', '');
    document.querySelector('#shubmobile').setAttribute('url', '');
    document.querySelector('#vseatsmobile').setAttribute('url', '');
    document.querySelector('#fwicon1').textContent = ''
    document.querySelector('#fwicon2').textContent = ''
    document.querySelector('#fwicon3').textContent = ''
    document.querySelector('#fwicon4').textContent = ''
    document.querySelector('#fwicon5').textContent = ''
    document.querySelector('#selectedevent').setAttribute('lastfetched','')
    document.querySelector('#fwicon5').textContent = ''
    document.querySelector('#lowerable').checked = false
    document.querySelector('#urlmain').style.display = 'none'
    document.querySelector('#changedata').style.display = 'none'
    document.querySelector('#urlmainmobile').style.display = 'none'
    document.getElementById('142box').style.display = 'none'
    document.getElementById('142boxmobile').style.display = 'none'
    document.querySelector('#urlmain').setAttribute('url','')
    document.querySelector('#urlmainmobile').setAttribute('url','')

    $('.event-box-pricing').hide()
    chartvs.data.datasets[0].data = ''
    chartvs.data.datasets[1].data = ''
    chartvs.config.data.labels = ''
    chartvs.update();

} else {
primaryurl()
getchartvs()
}

    if((request.status === 429) || (request.status === 500)){
    alert('Something went wrong... Contact Aleksei')
    } else if (request.status >= 200 && request.status < 400) {
    setTimeout(() => {
    const cardContainer = document.getElementById("Cards-Container2")
    data.forEach(events => {
    const style = document.getElementById('samplestyle2')
    const card = style.cloneNode(true)
    const lowerablecheck = card.getElementsByClassName('main-checkbox-lowerprice')[0]
    card.setAttribute('id', events.id);

    if(events.tags === 'lowerable'){
    card.setAttribute('tags',events.tags)
    lowerablecheck.checked = true
    }

    if(events.tags !== null){
    if(events.tags.includes('lowerable')){
    card.setAttribute('tags',events.tags)
    lowerablecheck.checked = true
    }}


    const eventid = card.getElementsByClassName('main-text-id')[0]
    eventid.textContent = events.id
    const eventsection = card.getElementsByClassName('main-text-section')[0]
    eventsection.textContent = events.section
    const eventrow = card.getElementsByClassName('main-text-rows')[0]
    eventrow.textContent = events.row

    const eventqty = card.getElementsByClassName('main-text-qty')[0]
    eventqty.textContent = events.quantity

    const eventprice = card.getElementsByClassName('main-field-price')[0]



if(datas['Email'] === 'aleksei@ubikanalytic.com' || datas['Email'] === 'tim@ubikanalytic.com'){
lowerablecheck.style.display = 'flex'
document.querySelector('#lowerabletext').style.display = 'flex'
} else {
lowerablecheck.style.display = 'none'
document.querySelector('#lowerabletext').style.display = 'none'
}




lowerablecheck.setAttribute('id', "check"+events.id);

    eventprice.value = events.listPrice





//setup before functions
let typingTimer;                //timer identifier
let doneTypingInterval = 1000;  //time in ms (5 seconds)
let myInput = eventprice

//on keyup, start the countdown
myInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    if (myInput.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

//user is "finished typing," do something
function doneTyping() {
if (document.querySelector('#vspricing').checked && eventprice.value) {
    var X_given = Math.round(Number(eventprice.value));

    if (isNaN(X_given)) {
    console.error('X_given is not a number');
    return; // Exit the function if X_given is not a number
    }

    // Calculating Y using the derived formula
    let Y_predicted = (
    -0.56 +
    1.20 * X_given
    // Removed the zero terms as they don't affect the result
    );

    // Rounding Y to two decimal places
    let Y_predicted_rounded = Y_predicted.toFixed(2);
    eventprice.value = Y_predicted_rounded; // Assign the rounded value back to the input field
}
}


const lowerablecheckbox = card.getElementsByClassName('main-checkbox-lowerprice')[0]

lowerablecheckbox.addEventListener('change', function (event) {
    if (lowerablecheckbox.checked === true) {
    const ticket_id = lowerablecheckbox.parentNode.parentElement.parentElement.parentElement.id
    const event_id = document.querySelector('#selectedevent').getAttribute('eventid')
    var http = new XMLHttpRequest();
    var url = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/allow_pricechanges?event_id="+event_id+"&ticket_id="+ticket_id;
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.send();
}

    else if(lowerablecheckbox.checked === false){
    const ticket_id = lowerablecheckbox.parentNode.parentElement.parentElement.parentElement.id
    const event_id = document.querySelector('#selectedevent').getAttribute('eventid')
    var http = new XMLHttpRequest();
    var url = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/remove_pricechanges?ticket_id="+ticket_id+"&event_id="+event_id;
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.send();
}

})




const eventpriceticket = card.getElementsByClassName('main-text-priceticket')[0]
let dticket = String((events.cost/events.quantity))

if(dticket.includes('.')){
let pti = dticket.split(".");

let ptix = pti[0] + '.' + pti[1].slice(0,2)

    eventpriceticket.textContent = '$' + ptix
} else {
    eventpriceticket.textContent = '$' + dticket
}

const savepricebutton = card.getElementsByClassName('save-price-button')[0]





eventprice.addEventListener("keypress", (event) => {

if( (event.keyCode === 13) && (eventprice.readOnly == false) ) {
savepricebutton.click()
document.querySelector('#isfocus').textContent = '1'
setTimeout(() => {
document.querySelector('#isfocus').textContent = '0'
}, 5000);

}
});

savepricebutton.addEventListener("click", (event) => {
if(eventprice.readOnly == false)  {
document.querySelector('#isfocus').textContent = '1'
setTimeout(() => {
document.querySelector('#isfocus').textContent = '0'
}, 5000);

}
});


savepricebutton.addEventListener('click', function() {

$(this).closest('div').find(".main-field-price").prop("readonly", true);
$(this).hide()
$(this).closest('div').find(".notbt").css("display", "flex");
document.querySelector(".confirmation-pricing").style.display = 'flex'
let nmb = Number(document.querySelector("#eventsamount").textContent)
nmb++
if(nmb===1) {
document.querySelector("#eventtext").textContent = "event"
} else {
document.querySelector("#eventtext").textContent = "events"}
document.querySelector("#eventsamount").textContent = nmb
let activeticket = ($(this).closest(".event-box-pricing").attr('id'));
let prc = eventprice.value
let usr = datas['Email']
var http = new XMLHttpRequest();
var url = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_add_to_queue?ticket-id=" + activeticket + "&price=" + prc + "&user=" + usr;
pa = datas['pyeo']
http.open("PUT", url, true);

http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.setRequestHeader("Authorization", pa);


http.send();

})

    const eventcst = card.getElementsByClassName('main-text-cst')[0]
    eventcst.textContent = '$' + events.cost


    const eventnotes = card.getElementsByClassName('main-text-notes')[0]
    eventnotes.textContent = events.notes

    var startDate = moment(events.lastPriceUpdate.slice(0,10), "YYYY/DD/MM");

    var currenDate = moment(new Date()).format("YYYY-DD-MM");
    var endDate = moment(currenDate, "YYYY-DD-MM");
    var result = endDate.diff(startDate, 'days');


    const lastupdated = card.getElementsByClassName('main-text-updated')[0]

    let time1 = moment.utc(events.lastPriceUpdate).format('MM-DD HH:mm');

    let updatedTime = moment.utc(time1, 'MM-DD HH:mm').subtract(4, 'hours');

    lastupdated.textContent = updatedTime.format('MM-DD HH:mm')
    const vwprice = card.getElementsByClassName('main-text-vw')[0];

var Xgiven = Math.round(Number(events.listPrice));

if (isNaN(Xgiven)) {
console.error('Xgiven is not a number');
return;
}

// Define the coefficients for the linear formula
const a = 1.3513; // Constant term
const b = 0.8123; // Coefficient for X

// Calculate Y using the linear formula
let Ypredicted = a + b * Xgiven;

let Ypredictedrounded = Ypredicted.toFixed(2);
vwprice.textContent = Ypredictedrounded;

    let tixid = events.id
    let usz = datas['Email']
    var http = new XMLHttpRequest();
    var urll = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_check_item?ticket_id=" + tixid;
    pa = datas['pyeo']
    http.open("GET", urll, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader("Authorization", pa);

http.send();
http.onload = function() {
let resp = http.response
if(resp === 'true' ) {
card.getElementsByClassName('main-field-price')[0].readOnly = true;
card.getElementsByClassName('save-price-button')[0].style.display = 'none';
card.getElementsByClassName('notbt')[0].style.display = 'flex';
document.querySelector(".confirmation-pricing").style.display = 'flex'
}}

    cardContainer.appendChild(card);
}, 1500);
    })
}
    setTimeout(() => {
    $('#mainpricing').css("display", "block");
    $('#loadingpricing').css("display", "none");
    $('#samplestyle2').hide()

}, 750);
}


    request.send();


    }

    });

    document.querySelector('#pricingpart1').style.display = 'flex'
    document.querySelector('#pricingpart2').style.display = 'none'
    cardContainer.appendChild(card);

    })}}
    request.send();

{

if(datas['Email'] === 'aleksei@ubikanalytic.com' || datas['Email'] === 'tim@ubikanalytic.com'){
document.querySelector('#lowerable').checked = false
} else {
document.querySelector('#lowerable').checked = true
}}

    document.querySelector("#pricecancel").addEventListener('click', function() {
    $('#pricecancel').css({pointerEvents: "none"})
    $('.event-box.pricing').css({pointerEvents: "none"})

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
    $('.event-box.pricing').css({pointerEvents: "auto"})

    document.querySelector("#eventsamount").textContent = '0'
    document.querySelector(".notbt").style.display = 'none'
    $(".main-field-price").prop("readonly", false)
    }
    http.send();
    })



    let uszz = datas['Email']
    var http2 = new XMLHttpRequest();
    var urlll = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_count?user=" + uszz;
    http2.open("GET", urlll, true);
    http2.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http2.setRequestHeader("Authorization", pa);

    http2.send();
    http2.onload = function() {
        if(this.status>201){
            document.querySelector('.locked-content').style.display = 'flex'
            document.querySelector('.pageloading').style.display = 'none'
            } else {
                document.querySelector('.locked-content').style.display = 'none'
                document.querySelector('.pageloading').style.display = 'none'

            }
    let resp = http2.response
    if(resp>=1 ) {
    document.querySelector(".confirmation-pricing").style.display = 'flex'
    document.querySelector("#eventsamount").textContent = resp
    }}

document.querySelector('#priceconfirm').addEventListener("click", () => {
    $('#priceconfirm').css({pointerEvents: "none"})
    $('.event-box.pricing').css({pointerEvents: "none"})

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
    $('.event-box.pricing').css({pointerEvents: "auto"})

    let selected = document.getElementsByClassName("event-box pricing selected")
    if(selected.length>0 && http.status >= 200 && http.status < 400) {
        selected[0].click()
    document.querySelector("#eventsamount").textContent = '0'

    }
    }
    http.send();
    })
})


    {

    $('#shub').click(function () {
    let url = document.querySelector('#shub').getAttribute('url') + '?quantity=2';
    if(url !== 'null') {
    window.open(url,'shub')
    $('#shub').css('cursor', 'pointer');
    } else if(url === 'null') {
    $('#shub').css('cursor', 'default');
    }
    })

    $('#shubmobile').click(function () {
    let url = document.querySelector('#shubmobile').getAttribute('url') + '?quantity=2';
    if(url !== 'null') {
    window.open(url,'shubmobile')
    $('#shubmobile').css('cursor', 'pointer');
    } else if(url === 'null') {
    $('#shubmobile').css('cursor', 'default');
    }
    })

    var intervalId = window.setInterval(function(){
    let urls = document.querySelector('#shub').getAttribute('url');
    if(urls !== 'null') {
    $('#stubhubidnomobile').hide()
    $('#shub').css('cursor', 'pointer');
    } else if(urls === 'null') {
    $('#stubhubidnomobile').show()
    $('#shub').css('cursor', 'default');
    }
    }, 100);
    }

    {
    $('#vseats').click(function () {
    let url = document.querySelector('#vseats').getAttribute('url');
    if(url !== 'null') {
    window.open(url,'vseats')
    $('#vseats').css('clsor', 'pointer');
    } else if(url === 'null') {
    $('#vseats').css('cursor', 'default');
    }
    })

    $('#vseatsmobile').click(function () {
    let url = document.querySelector('#vseatsmobile').getAttribute('url');
    if(url !== 'null') {
    window.open(url,'vseatsmobile')
    $('#vseatsmobile').css('clsor', 'pointer');
    } else if(url === 'null') {
    $('#vseatsmobile').css('cursor', 'default');
    }
    })

    var intervalId = window.setInterval(function(){
    let urls = document.querySelector('#vseats').getAttribute('url');
    if(urls !== 'null') {
    $('#vseats').css('cursor', 'pointer');
    } else if(urls === 'null') {
    $('#vseats').css('cursor', 'default');
    }

    }, 100);
    }

    })



{
document.addEventListener('keydown', (e) => {
setTimeout(function() {
let isfoc = document.querySelector('#isfocus').textContent
if (e.repeat) return;
if (e.key === 'Enter' && isfoc === '0' && document.querySelector('#confirmprice').style.display == 'flex') {
        document.getElementById("priceconfirm").click();
        $('#confirmprice').css({pointerEvents: "none"})
        setTimeout(() => {
        $('#confirmprice').css({pointerEvents: "auto"})
        },1000)


}    }, 1000)
})
}

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
            // Wait for some requests to complete before sending more
            await sleep(1000); // You can adjust the sleep duration as needed
        }

        fetch(url, {
            headers: {
                'Authorization': pauth
            }
        })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error('Response not OK');
            }
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

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}


document.getElementById('scrapedates').addEventListener('click', getpdates);
