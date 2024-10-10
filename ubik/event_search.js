let abortControllers = [];

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

    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value)
    let keywords3 = document.getElementById('countryselect').value
    let keywords4 = document.querySelector('#categoryselect').value
    let keywords5 = document.querySelector('#sourceselect').value
    let keywords6 = document.querySelector('#sortby').value

    let favoritecbox = document.getElementById('favorite').checked
    let preonsales = document.getElementById('preonsales').checked
    $('.event-box').hide()

    let baseUrl = 'https://ubik.wiki/api/event-venue/?';
    params = [];

    if (keywords1.length > 0) {
        params.push('event_name__icontains=' + keywords1)
    }

    if (keywords2.length > 0) {
        params.push('venue_name__icontains=' + keywords2)
    }

    if (keywords3 === 'uscanada') {
        params.push('country__icontains=USA&country__icontains=Canada');
    }

    if (keywords3 === 'international') {
        params.push('country__idoesnotcontains=USA&country__idoesnotcontains=Canada');
    }

    if (keywords4) {
    params.push(`category__iexact=${keywords4}`);
}

if (keywords5 === 'axs' || keywords5 === 'seetickets') {
    params.push(`event_url__icontains=${keywords5}`);
}

if (keywords5 === 'ticketmaster') {
    params.push(`event_url__icontains=ticketmaster&event_url__icontains=livenation`);
}

    if (keywords5 === 'nontm') {
    params.push(`event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster`);
}

if (keywords5 === 'nontmaxs') {
    params.push(`event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster&event_url__idoesnotcontains=axs`);
}

if (keywords5 === 'nonseeticketstmaxs') {
    params.push(`event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster&event_url__idoesnotcontains=axs&event_url__idoesnotcontains=seetickets`);
}

if (keywords6 === 'recentlyadded') {
    params.push(`date_created__sort=-1`);
}

if (keywords6 === 'lowestamount') {
    params.push(`app_142_primary_amount__sort=1`);
}

if (keywords6 === 'fastmovement') {
    params.push(`app_142_difference_per_day__sort=-1`);
}
if (keywords6 === 'fastmovement' && keywords5 === 'seetickets') {
    params.push(`app_142_primary_amount__gt=0`);
}


if (favoritecbox) {
    params.push('&favorites__iexact=true');
}

if (preonsales) {
    params.push('&is_preonsale__iexact=true');
}

    params.push('limit=100');

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
    console.log('Constructed URL:', xanoUrl);


    }


    document.querySelector('#search-button').addEventListener("click", () => {
    savedevents = []
    constructURL()
    })





            function getEvents(fetchurl) {

            let request = new XMLHttpRequest();

            request.open('GET', fetchurl, true)
            request.setRequestHeader("Content-type", "application/json; charset=utf-8");
            request.setRequestHeader('Authorization', `Bearer ${token}`);

            request.onload = function() {
            let data = JSON.parse(this.response)

            if (request.status >= 200 && request.status < 400) {


            $('.event-box').hide()

            nexturl = data.next
            prevurl = data.previous
            pcount = parseInt(data.count/100)

            document.getElementById('maxpages').textContent = pcount


            if(nexturl){
                const match = nexturl.match(/offset=(\d+)/);

                let result;

                if (match && match[1]) {
                if (match[1].length >= 4) {
                result = match[1].slice(0, 2); // Return the first two digits if the number has 4 or more digits
                } else {
                result = match[1][0]; // Return the first digit if the number has less than 4 digits
                }
                } else {
                result = '1'
                }

                document.getElementById('curpage').textContent = result
                } else {
                document.getElementById('curpage').textContent = '1'
                document.getElementById('maxpages').textContent = '1'
                }



            document.querySelector('#loading').style.display = "none";
            document.querySelector('#flexbox').style.display = "flex";
            const cardContainer = document.getElementById("Cards-Container")

            data.results.forEach(events => {
            const style = document.getElementById('samplestyle')
            const card = style.cloneNode(true)
            const evid = encodeURIComponent(events.site_event_id)
            if(evid.startsWith('tm')){
            const evid = encodeURIComponent(events.site_event_id).substring(2)
            }

            const eventdate = card.getElementsByClassName('main-text-date')[0]

            card.setAttribute('id', '');
            card.setAttribute('checked','false')
            card.setAttribute('name', events.event_name);
            card.setAttribute('url',events.event_url);
            card.setAttribute('country', events.country);
            card.setAttribute('city', events.city);
            card.setAttribute('state', events.state);


        if(events.date){
            card.setAttribute('date', events.date.slice(0, 10).replaceAll("-","/"));
            card.setAttribute('vivid_ed', events.date.slice(0,10));

            var tdate = events.date.slice(0, 10).replaceAll("-","/")
            tdate = [tdate.slice(5), tdate.slice(0,4)].join('/');
            eventdate.textContent = tdate

        }

            card.setAttribute('eventid', evid);

    if (evid.startsWith("tm")) {
            card.setAttribute('eventid', evid.substring(2));
    }
            if(events.time){
            card.setAttribute('time', events.time.slice(0, 8));
            }
            card.setAttribute('venue', events.venue_name);
            card.setAttribute('source', events.scraper_name);
            card.setAttribute('vivid_id', events.vdid);
            card.setAttribute('capacity', events.venue_capacity);


    const purchasedamount = card.getElementsByClassName('main-text-purchased')[0];

    if ((events.purchased_amount) && (events.purchased_amount !== null || events.purchased_amount !== 0)) {
    card.setAttribute('purchased', parseInt(events.purchased_amount,10))
    purchasedamount.textContent = parseInt(events.purchased_amount, 10).toString();
    }


    const status = card.getElementsByClassName('main-text-status')[0];

    if (events.status) {
    status.textContent = events.status
    }

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


        const charticon = card.getElementsByClassName('main-text-chart')[0];

function updateChartWithPrimaryAndPreferred() {
    let amountsPrimary = [];
    let datesPrimary = [];
    let combinedDates = new Set();
    let preferredData = [];
    let counts = events.counts;
    let source = events.scraper_name.toLowerCase();
    let venueid = events.site_venue_id
    chart.data.datasets[0].label = `${source.toUpperCase()} Primary`;

    chart.data.datasets.splice(1,3)
        // Ensure primary dataset is always present
    chart.update();

    // Populate primary amounts and dates
    counts.forEach(count => {
        amountsPrimary.push(Math.round(count.primary_amount));
        datesPrimary.push(count.scrape_date);
        combinedDates.add(count.scrape_date);
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
        fetch(`https://ubik.wiki/api/primary-counts/?tickets_by_sections__icontains={&event_id__icontains=${events.site_event_id}&format=json`, {
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
                let prefAmounts = [];
                let prefDates = [];

                data.results.forEach(result => {
                    let scrapeDate = new Date(result.event.scrape_date);
                    let hours = scrapeDate.getHours() % 12 || 12;  // Convert 0 (midnight) or 12 (noon) to 12
                    let formattedDate = `${scrapeDate.getMonth() + 1}/${scrapeDate.getDate()}/${scrapeDate.getFullYear()}, ${hours}:${("0" + scrapeDate.getMinutes()).slice(-2)}:${("0" + scrapeDate.getSeconds()).slice(-2)} ${scrapeDate.getHours() >= 12 ? 'PM' : 'AM'}`;

                    result.tickets_by_sections.forEach(section => {
                        if (section.section.toLowerCase().includes(pref.toLowerCase())) {
                            prefAmounts.push(Math.round(section.amount));
                            prefDates.push(formattedDate);
                            combinedDates.add(formattedDate);
                            console.log(`Inserting value ${section.amount} for ${section.section} on ${formattedDate}`);
                        }
                    });
                });

                preferredData.push({
                    label: pref,
                    amounts: prefAmounts,
                    dates: prefDates,
                    backgroundColor: `rgba(${75 + index * 40}, 179, 113, 1)`,
                    borderColor: `rgba(${75 + index * 40}, 170, 113, 1)`,
                });
            });

            // Step 3: Combine and sort all dates
            combinedDates = Array.from(combinedDates).sort((a, b) => new Date(a) - new Date(b));

            // Step 4: Align primary data with combined dates
            let alignedPrimaryData = combinedDates.map(date => {
                let index = datesPrimary.indexOf(date);
                return index !== -1 ? amountsPrimary[index] : null;
            });

            // Step 5: Align preferred data with combined dates
            preferredData.forEach(prefDataset => {
                let alignedAmounts = combinedDates.map(date => {
                    let index = prefDataset.dates.indexOf(date);
                    return index !== -1 ? prefDataset.amounts[index] : null;
                });

                chart.data.datasets.push({
                    data: alignedAmounts,
                    label: prefDataset.label,
                    backgroundColor: prefDataset.backgroundColor,
                    borderColor: prefDataset.borderColor,
                    borderWidth: 1
                });
            });

            // Step 6: Update the chart with combined data
            chart.config.data.labels = combinedDates;
            chart.data.datasets[0].data = alignedPrimaryData;
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


function fetchTicketmasterData() {
    chart.update();
    let evidp = events.site_event_id.substring(2);
    const controller = new AbortController();
    abortControllers.push(controller);

    var http = new XMLHttpRequest();
    var url = `https://shibuy.co:8443/142data?eventid=${evidp}`;
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



//
        charticon.addEventListener('click', function () {

                    document.querySelector('#chart-date').textContent = ''
                    document.querySelector('#chart-event').textContent = ''
                    document.querySelector('#chart-venue').textContent = ''
                    document.querySelector('#chart-location').textContent = ''
                    document.querySelector('#chart-time').textContent = ''
                    chart.data.datasets.splice(1,3)
                    chart.data.labels.splice(0,100)
                    chart.update();
                    const eventBoxParent = charticon.closest('.event-box')
                    const daten = eventBoxParent.getAttribute('date')
                    const eventn = eventBoxParent.getAttribute('name')
                    const venuen = eventBoxParent.getAttribute('venue')
                    const cityn = eventBoxParent.getAttribute('city')
                    const staten = eventBoxParent.getAttribute('state')
                    const timen = eventBoxParent.getAttribute('time')

                    document.querySelector('#chart-date').textContent = daten
                    document.querySelector('#chart-event').textContent = eventn
                    document.querySelector('#chart-venue').textContent = venuen
                    document.querySelector('#chart-location').textContent = cityn + ',' + staten
                    document.querySelector('#chart-time').textContent = timen


                    chart.data.datasets[0].label = ''
                    chart.data.datasets[0].data = []
                    chart.config.data.labels = []
                    chart.update();
                    document.querySelector('#tmloader').style.display = 'flex';
                    document.querySelector('#tmerror').style.display = 'none';
                    document.querySelector('#tmchart').style.display = 'none';

            vschartdata(events.vdid)
            document.querySelector('#graph-overlay').style.display = 'flex';
            document.querySelector('#closecharts').style.display = 'flex'


if(events.event_url.includes('ticketmaster') || events.event_url.includes('livenation')) {
document.querySelector('#eventicon').style.display = 'none'
document.querySelector('#tmurl').style.display = 'block'
document.querySelector('#tmurl').href = 'http://142.93.115.105:8100/event/' + evid.substring(2) + "/details/"
fetchTicketmasterData()
} else {
updateChartWithPrimaryAndPreferred()
}
});


let count = events.counts
let src = events.event_url
if (count && count.length > 0 || (src.includes('ticketmaster') || src.includes('livenation')) && !src.includes('ticketmaster.com.mx') && !src.includes('ticketmaster.co.uk') && !src.includes('ticketmaster.de')) {
charticon.style.display = 'flex'
} else {
charticon.style.display = 'none'
}

            const timezone = card.getElementsByClassName('main-text-timezone')[0]
            timezone.textContent = events.timezone
            card.setAttribute('timezone',events.timezone)

            const primrem = card.getElementsByClassName('main-text-primary')[0]
            const dpd = card.getElementsByClassName('main-text-aday')[0]

        const scrapeurl = (eventid) => {
            const url = 'https://shibuy.co:8443/primaryurl?eventid=' + eventid;

            const request = fetch(url)
            .then(response => response.json())
            .then(data => {
                if (typeof data.count === 'number' && data.count !== 0) {
                primrem.textContent = data.count;
                } else {
                primrem.textContent = 'unknown'
                }

                if (typeof data.diffperday === 'number') {
                dpd.textContent = parseInt(data.diffperday);
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });
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

const scrapetm = (eventid) => {
    const url = 'https://shibuy.co:8443/scrapeurl';
    let eventidscrape = eventid
    if(eventidscrape.startsWith('tm')){
    let eventidscrape = eventid.substring(2)
    }
    const data = {
    eventid: eventidscrape
    };

    const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data) // Convert data to JSON format
    };

    const request = fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
        scrapeurl(eventid)
        console.log(data);
        const checktrue = data.amounts.some(item => item.amount === undefined || item.amount < 50);
        if(checktrue){
        updatedata(eventid)
    }})
    .catch(error => {
        const searchText = 'No amounts available';
        const includesText = Object.keys(data).some(key => key.includes(searchText));
        if(includesText){
        console.log(error)
        primrem.textContent = 'unavailable';
        }
    });
};

            let rescrapebutton = card.getElementsByClassName('re-scrape-div')[0]
            let topbox = card.getElementsByClassName('topbox')[0]
            let scrapebutton = card.getElementsByClassName('scrape-div-fresh')[0]


            scrapebutton.addEventListener('click',function(){
            scrapetm(evid.substring(2))
            primrem.textContent = ''
            dpd.textContent = ''
            })


            rescrapebutton.addEventListener('click',function(){
            primrem.textContent = ''
            dpd.textContent = ''
            scrapeurl(evid.substring(2))
            })

            if(!events.event_url.includes('ticketmaster.com.mx') && (events.event_url.includes('ticketmaster.com') || events.event_url.includes('livenation'))) {
            topbox.style.display = 'flex'
            rescrapebutton.style.display = 'flex'
            scrapebutton.style.display = 'flex'
            } else {
            topbox.style.display = 'flex'
            rescrapebutton.style.display = 'none'
            scrapebutton.style.display = 'none'
            }

            card.style.display = 'flex';

            const buybutton = card.getElementsByClassName('main-buy-button')[0]
            buybutton.addEventListener('click', function() {
            window.location.assign('https://www.ubikanalytic.com/event?id=' + evid)
            });

            const mbutton = card.getElementsByClassName('manualbutton')[0]
            mbutton.addEventListener('click', function() {
            window.location.assign('https://www.ubikanalytic.com/buy-manual?id=' + evid)
            });

            const eventname = card.getElementsByClassName('main-text-event')[0]
            eventname.textContent = events.event_name;
            if(eventname.textContent.length>10) {
            eventname.textContent = events.event_name.slice(0, 10)+'...'
            }

            const eventur = card.getElementsByClassName('main-text-url')[0]
            eventur.textContent = events.event_url
            countsarray = events.counts

            //

            if(events.time){
                let eventtime = card.getElementsByClassName('main-text-time')[0]
                eventtime.textContent = events.time.slice(0, 8)
                }
                const eventvenue = card.getElementsByClassName('main-text-venue')[0]
                eventvenue.textContent = events.venue_name
                if(eventvenue.textContent.length>13) {
                eventvenue.textContent = events.venue_name.slice(0, 13)+'...'
                }

                const eventlocation = card.getElementsByClassName('main-text-location')[0]
                eventlocation.textContent = events.city

                const capacity = card.getElementsByClassName('main-text-capacity')[0]
                capacity.textContent = events.venue_capacity

                let txtsource = card.getElementsByClassName('main-textsource')[0]
                txtsource.textContent = events.scraper_name

                let eventUrl = events.event_url

                switch(true) {
                    case eventUrl.includes('showclix'):
                    txtsource.textContent = 'SHOW';
                    break;
                    case eventUrl.includes('thecomplexslc'):
                    txtsource.textContent = 'SHOW';
                    break;
                    case eventUrl.includes('ticketmaster.co.uk'):
                    txtsource.textContent = 'TM-UK';
                    break;
                    case eventUrl.includes('ticketmaster.ca'):
                    txtsource.textContent = 'TM';
                    break;
                    case eventUrl.includes('ticketmaster.de'):
                    txtsource.textContent = 'TM-DE';
                    break;
                    case eventUrl.includes('ticketmaster.com.mx'):
                    txtsource.textContent = 'TM-MX';
                    break;
                    case eventUrl.includes('ticketmaster.com'):
                    txtsource.textContent = 'TM';
                    break;
                    case eventUrl.includes('livenation'):
                    txtsource.textContent = 'TM';
                    break;
                    case eventUrl.includes('24tix'):
                    txtsource.textContent = '24TIX';
                    break;
                    case eventUrl.includes('admitone'):
                    txtsource.textContent = 'ADMIT1';
                    break;
                    case eventUrl.includes('axs'):
                    txtsource.textContent = 'AXS';
                    break;
                    case eventUrl.includes('dice'):
                    txtsource.textContent = 'DICE';
                    break;
                    case eventUrl.includes('etix'):
                    txtsource.textContent = 'ETIX';
                    break;
                    case eventUrl.includes('eventbrite'):
                    txtsource.textContent = 'EBRITE';
                    break;
                    case eventUrl.includes('freshtix'):
                    txtsource.textContent = 'FRESH';
                    break;
                    case eventUrl.includes('frontgate'):
                    txtsource.textContent = 'FGATE';
                    break;
                    case eventUrl.includes('holdmyticket'):
                    txtsource.textContent = 'HOLDMT';
                    break;
                    case eventUrl.includes('prekindle'):
                    txtsource.textContent = 'PRE';
                    break;
                    case eventUrl.includes('seetickets'):
                    txtsource.textContent = 'SEETIX';
                    break;
                    case eventUrl.includes('showclix'):
                    txtsource.textContent = 'SHOW';
                    break;
                    case eventUrl.includes('ticketweb'):
                    txtsource.textContent = 'TWEB';
                    break;
                    case eventUrl.includes('ticketswest'):
                    txtsource.textContent = 'TWEST';
                    break;
                    case eventUrl.includes('tixr'):
                    txtsource.textContent = 'TIXR';
                    break;
                    case eventUrl.includes('stubwire'):
                    txtsource.textContent = 'STUBW';
                    break;
                    case eventUrl.includes('fgtix'):
                    txtsource.textContent = 'FGATE';
                    break;
                    case eventUrl.includes('evenue'):
                    txtsource.textContent = 'EVENUE';
                    break;
                    case eventUrl.includes('gruenehall'):
                    txtsource.textContent = 'gruenehall';
                    break;
                    case eventUrl.includes('meowwolf'):
                    txtsource.textContent = 'MEOW';
                    break;
                    case eventUrl.includes('thevogue.com'):
                    txtsource.textContent = 'thevogue';
                    break;
                default:
                    txtsource.textContent = 'OTHER';
                    break;
                }

            //


            function getLatestCount(counts) {
                if(counts && counts.length>0){

                counts.sort((a, b) => {
                const dateA = new Date(a.scrape_date);
                const dateB = new Date(b.scrape_date);
                return dateB - dateA;
                });

                return counts[0].primary_amount;
                } else {
                return 0;
                }
            }


if(events.app_142_scrape_date && !events.event_url.includes('ticketmaster') && !events.event_url.includes('livenation')){
let oldDate = events.app_142_scrape_date

const scrapedate = card.getElementsByClassName('main-text-scrapedate')[0];
scrapedate.textContent = events.app_142_scrape_date
card.setAttribute('scrapedate',events.app_142_scrape_date)

if(events.app_142_scrape_date.length<10){
card.setAttribute('scrapedate','1998-09-09')
}

let estDate = moment().tz('America/New_York').format('YYYY/MM/DD');

let mOldDate = moment(oldDate);
let mEstDate = moment(estDate);

let differenceInDays = mEstDate.diff(mOldDate, 'days');
let primam = parseInt(events.app_142_primary_amount)
keyword6 = document.querySelector('#sortby').value
const primamount = card.getElementsByClassName('main-text-primary')[0];


if(Number(getLatestCount(countsarray))){
    primamount.textContent = primam;
    card.setAttribute('primaryamount', primam);
} else {
    primamount.textContent = '';
    card.setAttribute('primaryamount', '-1');
}


if(events.app_142_difference_per_day){
const aday = card.getElementsByClassName('main-text-aday')[0]
aday.textContent = parseInt(events.app_142_difference_per_day)
card.setAttribute('perday',parseInt(events.app_142_difference_per_day))
}

} if(events.event_url.includes('ticketmaster') || events.event_url.includes('livenation')) {

            txtsource.addEventListener('click',function(){
            window.open('http://142.93.115.105:8100/event/' + evid.substring(2) +'/details/', "142")
            });
            txtsource.classList.add("clickable");
            }

            if(events.hidden === 'true'){
            card.style.display = "none";
            }

            const eventurl = events.event_url

            const hidebtn = card.getElementsByClassName('hidebtn')[0]
            let eventid = evid
            hidebtn.addEventListener('click', function() {


            var http = new XMLHttpRequest();
            var url = "https://ubik.wiki/api/update/primary-events/"
            var params = JSON.stringify({
            "site_event_id": eventid,
            "hidden": "true"
            })
            http.open("PUT", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.setRequestHeader('Authorization', `Bearer ${token}`);
            http.send(params);
            card.style.display = "none";
            });




//

const checkbox = card.getElementsByClassName('main-checkbox-favorite')[0]

checkbox.checked = events.favorites
let eventids = evid


checkbox.addEventListener('click', function() {


var http = new XMLHttpRequest();
var url = "https://ubik.wiki/api/update/primary-events/"
var params = JSON.stringify({
"site_event_id": eventids,
"favorites": checkbox.checked
})
http.open("PUT", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.setRequestHeader('Authorization', `Bearer ${token}`);
http.send(params);
});

//



            function copyToClipboard(text) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();
            }

            eventname.addEventListener('click', function() { copyToClipboard(eventurl); });

            cardContainer.appendChild(card);
            })


            } else if(request.status>400){
            document.querySelector('#loading').style.display = "none";
            document.querySelector('#flexbox').style.display = "flex";
            console.log('searchfailed')
            }
            }

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





        function checkresults() {
        let results = document.querySelectorAll('.event-box')
            let count = 0
            for (let i = 0; i<results.length;i++) {
            if(results[i].style.display !== 'none') {
            count++
            document.querySelector('#counter').textContent = count
            }
            if(count<2) {
            document.querySelector('#countertxt').textContent = 'Result'
            } else {
            document.querySelector('#countertxt').textContent = 'Results'
            }}}
            let datear = function(){
            setTimeout(() => {
            let now = new Date()
            let date1 = moment(now).format('YYYY/MM/DD')
            $('.event-box').sort(function(a, b) {
            if (date1 > $(b).attr('date')) {return 1;}
            else {return -1;}
            }).appendTo('#Cards-Container');
            }, 2500)}

            var intervalId = window.setInterval(function(){
            checkresults()
            }, 100);

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
