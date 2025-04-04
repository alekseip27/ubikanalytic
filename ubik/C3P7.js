
let sourceInstructions = [];

function initializeSourceInstructions() {
  return fetch('https://ubik.wiki/api/source-instructions/?limit=100', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      sourceInstructions = data.results;
      console.log("Source instructions loaded.");
    })
    .catch(error => {
      console.error('Error occurred during fetch:', error);
    });
}

function retrievefetch(url) {
  if (!sourceInstructions.length) {
    console.log("Source instructions not loaded yet.");
    return {
      event_prefix: "other",
      venue_prefix: "other",
      url: url
    };
  }

  let matchingRecord = sourceInstructions.find(record => {
    if (record.contains) {
      let tokens = record.contains.split(',');
      return tokens.some(token => url.includes(token.trim()));
    }
    return false;
  });

  if (matchingRecord) {
    return {
      source: matchingRecord.source,
      event_prefix: matchingRecord.event_prefix,
      venue_prefix: matchingRecord.venue_prefix,
      url: url
    };
  } else {
    return {
      source:"OTHER",
      event_prefix: "other",
      venue_prefix: "other",
      url: url
    };
  }
}


let abortControllers = [];

// Global pagination variables
let pageLimit = 20; // Change this value as needed.
let currentOffset = 0;
let nexturl, prevurl, dcount;

document.getElementById('rightarrow').addEventListener('click', function() {
    if (nexturl) {
        constructURL(nexturl);
    }
});

document.getElementById('leftarrow').addEventListener('click', function() {
    if (prevurl) {
        constructURL(prevurl);
    }
});

function constructURL(next) {
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#flexbox').style.display = "none";

    var searchbar1 = document.getElementById('searchbar1');
    searchbar1.value = searchbar1.value.trimEnd();

    var searchbar2 = document.getElementById('searchbar2');
    searchbar2.value = searchbar2.value.trimEnd();

    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
    let keywords3 = document.getElementById('countryselect').value;
    let keywords4 = document.querySelector('#categoryselect').value;
    let keywords5 = document.querySelector('#sourceselect').value;
    let keywords6 = document.querySelector('#sortby').value;

    let favoritecbox = document.getElementById('favorite').checked;
    let preonsales = document.getElementById('preonsales').checked;

    let baseUrl = 'https://ubik.wiki/api/event-venue/?';
    let params = [];

    if (keywords1.length > 0) {
        params.push('event_name__icontains=' + keywords1);
    }

    if (keywords2.length > 0) {
        params.push('venue_name__icontains=' + keywords2);
    }

    if (keywords3 === 'uscanada') {
        // This adds two filters in one string; adjust as needed.
        params.push('country__icontains=US&country__icontains=Canada');
    }

    if (keywords3 === 'international') {
        params.push('country__idoesnotcontains=US&country__idoesnotcontains=Canada');
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

if (keywords5 === 'seatgeek') {
    params.push(`event_url__icontains=seatgeek.com`);
}
  

if (keywords5 === 'nonseeticketstmaxsgeek') {
    params.push(`event_url__idoesnotcontains=livenation&event_url__idoesnotcontains=ticketmaster&event_url__idoesnotcontains=axs&event_url__idoesnotcontains=seetickets&event_url__idoesnotcontains=seatgeek`);
}

    if (keywords6 === 'recentlyadded') {
        params.push(`date_created__sort=-1`);
    }

    if (keywords6 === 'lowestamount') {
        params.push(`app_142_primary_amount__sort=1`);
    }


if (keywords6 === 'fastall') {
    params.push(`app_142_difference_per_day__sort=-1`);
}

if (keywords6 === 'fast10') {
    params.push(`app_142_scrape_date__yte=10&app_142_difference_per_day__sort=-1`);
}

if (keywords6 === 'fast3') {
    params.push(`app_142_scrape_date__yte=3&app_142_difference_per_day__sort=-1`);
}

if (keywords6 === 'before10') {
    params.push(`app_142_scrape_date__ote=10&app_142_difference_per_day__sort=-1`);
}

    if (keywords6 === 'fastmovement' && keywords5 === 'seetickets') {
        params.push(`app_142_primary_amount__gt=0`);
    }

    if (favoritecbox) {
        params.push('favorites__iexact=true');
    }

    if (preonsales) {
        params.push('is_preonsale__iexact=true');
    }

    // Use pageLimit instead of a hardcoded number.
    params.push('limit=' + pageLimit);

    let xanoUrl = '';

    if (next) {
        const nurl = new URL(next);
        const searchParams = new URLSearchParams(nurl.search);
        const offset = searchParams.get('offset') || 0;
        currentOffset = parseInt(offset, 10);
        console.log('Offset:', currentOffset);
        params.push('offset=' + currentOffset);
        xanoUrl = nurl.origin + nurl.pathname + '?' + params.join('&');
    } else {
        currentOffset = 0;
        xanoUrl = baseUrl + params.join('&');
    }
    getEvents(xanoUrl);
    console.log('Constructed URL:', xanoUrl);
}

document.querySelector('#search-button').addEventListener("click", () => {
    savedevents = [];
    initializeSourceInstructions()
    constructURL();
});

function getEvents(fetchurl) {

    $('.eventbox-chart').not('#samplestyle').remove();
    document.querySelector('#samplestyle').style.display = "none";

    let request = new XMLHttpRequest();

    request.open('GET', fetchurl, true);
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.setRequestHeader('Authorization', `Bearer ${token}`);

    request.onload = function() {
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {

            nexturl = data.next;
            prevurl = data.previous;
            dcount = data.count;

            // Calculate maximum pages based on pageLimit
            let pcount = Math.ceil(data.count / pageLimit);
            document.getElementById('maxpages').textContent = pcount;

            // Calculate current page based on currentOffset and pageLimit.
            let currentPage = Math.floor(currentOffset / pageLimit) + 1;
            document.getElementById('curpage').textContent = currentPage;

            document.querySelector('#loading').style.display = "none";
            document.querySelector('#flexbox').style.display = "flex";

            const cardContainer = document.getElementById("Cards-Container");

            data.results.forEach(eventData => {

                const style = document.getElementById('samplestyle');
                const card = style.cloneNode(true);

                let evid = encodeURIComponent(eventData.site_event_id);
                if (evid.startsWith('tm')) {
                    evid = encodeURIComponent(eventData.site_event_id).substring(2);
                }

                function copyToClipboard(text) {
                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val(text).select();
                    document.execCommand("copy");
                    $temp.remove();
                }

                card.setAttribute('id', eventData.site_event_id);

                const eventname = card.getElementsByClassName('main-text-event-name')[0];
                eventname.textContent = eventData.event_name + ' - ';


                const eventvenue = card.getElementsByClassName('chart-venuename')[0];
                eventvenue.textContent = '- ' + eventData.venue_name

                const locationcard = card.getElementsByClassName('chartloc')[0];
                locationcard.textContent = eventData.city + ', ' + eventData.state + ', ' + eventData.country;

                const favorite1 = card.getElementsByClassName('favorite-icon1')[0];
                const favorite2 = card.getElementsByClassName('favorite-icon2')[0];

                if (eventData.favorites === true) {
                    favorite1.style.display = 'none';
                    favorite2.style.display = 'block';
                }

                const buybutton = card.getElementsByClassName('event-buy')[0];

                buybutton.addEventListener('click', function() {
                const url = 'https://www.ubikanalytic.com/event?id=' + evid;
                window.open(url, '_blank', 'noopener,noreferrer');
                });

                const manualbuy = card.getElementsByClassName('event-manual')[0];
                manualbuy.addEventListener('click', function() {
                const url = 'https://www.ubikanalytic.com/buy-manual?id=' + evid
                window.open(url, '_blank', 'noopener,noreferrer');
                });

                const favoriteIcon1 = card.getElementsByClassName('favorite-icon1')[0];
                const favoriteIcon2 = card.getElementsByClassName('favorite-icon2')[0];
                let eventids = evid;

                function toggleFavorite() {
                    let favoritesStatus;

                    if (favoriteIcon1.style.display !== 'none') {
                        favoriteIcon1.style.display = 'none';
                        favoriteIcon2.style.display = 'block';
                        favoritesStatus = true;
                    } else {
                        favoriteIcon1.style.display = 'block';
                        favoriteIcon2.style.display = 'none';
                        favoritesStatus = false;
                    }

                    var http = new XMLHttpRequest();
                    var url = "https://ubik.wiki/api/update/primary-events/";
                    var params = JSON.stringify({
                        "site_event_id": eventids,
                        "favorites": favoritesStatus
                    });

                    http.open("PUT", url, true);
                    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
                    http.setRequestHeader("Authorization", `Bearer ${token}`);
                    http.send(params);
                }

                favoriteIcon1.addEventListener('click', toggleFavorite);
                favoriteIcon2.addEventListener('click', toggleFavorite);

                const eventhide = card.getElementsByClassName('event-hide')[0];
                eventhide.addEventListener('click', function() {
                    var http = new XMLHttpRequest();
                    var url = "https://ubik.wiki/api/update/primary-events/";
                    var params = JSON.stringify({
                        "site_event_id": evid,
                        "hidden": "true"
                    });
                    http.open("PUT", url, true);
                    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
                    http.setRequestHeader('Authorization', `Bearer ${token}`);
                    http.send(params);
                    card.style.display = "none";
                });

                const datecard = card.getElementsByClassName('chartdate')[0];
                const latestdate = getLatestCount(eventData.counts);
                const latestdate2 = eventData.app_142_scrape_date;

                if (latestdate !== 0) {
                    datecard.textContent = latestdate;
                } else if (latestdate === 0 && !!latestdate && latestdate2.length > 4) {
                    datecard.textContent = eventData.app_142_scrape_date;
                } else {
                    datecard.textContent = 'Unavailable';
                    card.getElementsByClassName('chartscrapedate')[0].style.display = 'none';
                }

                const latestcount = getLatestCount2(eventData.counts);
                const primaryam = card.getElementsByClassName('chartprim')[0];
                card.getElementsByClassName('chartprim')[0].id = 'prim'+eventData.site_event_id;


                const chartperday = card.getElementsByClassName('chartperday')[0];
                chartperday.textContent = eventData.app_142_difference_per_day;
                card.getElementsByClassName('chartperday')[0].id = 'diff'+eventData.site_event_id;




                if (primaryam !== 0) {
                    primaryam.textContent = latestcount;
                } else if (latestcount === 0 && !!latestcount && latestcount.length > 4) {
                    datecard.textContent = eventData.app_142_primary_amount;
                } else {
                    primaryam.textContent = 'Unavailable';
                    card.getElementsByClassName('chartprimambox')[0].style.display = 'none';
                }

                const capacitycard = card.getElementsByClassName('chartcap')[0];
                if (eventData.venue_capacity) {
                    capacitycard.textContent = '- ' + eventData.venue_capacity;
                } else {
                    card.getElementsByClassName('chartcapacitybox')[0].style.display = 'none';
                }

                const txtsource = card.getElementsByClassName('chart-venueid')[0];
                let eventUrl = eventData.event_url;


                let prefs = [];
                let pref1 = eventData.pref_section1;
                let pref2 = eventData.pref_section2;
                let pref3 = eventData.pref_section3;

                if (pref1) {
                    prefs.push(pref1);
                }
                if (pref2) {
                    prefs.push(pref2);
                }
                if (pref3) {
                    prefs.push(pref3);
                }

                const preftext = card.getElementsByClassName('chartprefs')[0];
                if (prefs.length > 0) {
                    preftext.textContent = prefs.join(', ');
                } else {
                    card.getElementsByClassName('chartprefbox')[0].style.display = 'none';
                }

                const charteventdate = card.getElementsByClassName('charteventdate')[0];
                if (eventData.date) {
                    charteventdate.textContent = eventData.date + ' - '
                } else {
                    card.getElementsByClassName('chart-datebox')[0].style.display = 'none';
                }

                const charteventtime = card.getElementsByClassName('charteventtime')[0];
                if (eventData.time) {
                    charteventtime.textContent = eventData.time;
                } else {
                    card.getElementsByClassName('chart-time-box')[0].style.display = 'none';
                }

                let prefixes = retrievefetch(eventUrl);

                if(prefixes && prefixes.source){
                txtsource.textContent = prefixes.source
                }


                if (eventData.event_url.includes('ticketmaster') || eventData.event_url.includes('livenation')) {
                    eventname.addEventListener('click', function () {
                        copyToClipboard('http://142.93.115.105:8100/event/' + evid + '/details/');
                    });

                    chartperday.textContent = eventData.app_142_difference_per_day;

                } else {
                    eventname.addEventListener('click', function () {
                        copyToClipboard(eventData.event_url);
                    });
                }
                if (eventData.hidden === 'true') {
                    card.style.display = "none";
                } else {
                    card.style.display = 'flex';
                }

                // ------------------------
                // DYNAMIC CHART CREATION
                // ------------------------
                // Use eventData (which contains counts, site_event_id, etc.) to create the chart.
                let labels = [];
                let primaryData = [];
                let preferredData = [];

                if (eventData.counts && eventData.counts.length > 0) {
                    // Sort counts by scrape_date (ascending)
                    let sortedCounts = eventData.counts.sort((a, b) => new Date(a.scrape_date) - new Date(b.scrape_date));
                    sortedCounts.forEach(count => {
                        labels.push(count.scrape_date);
                        primaryData.push(count.primary_amount);
                        preferredData.push(count.preferred_amount !== undefined ? count.preferred_amount : 0);
                    });
                }

                // Modified: Only hide the chart container if there is no data (labels empty)
                // and the event is not from Ticketmaster/LiveNation.
                let eventUrlLower = eventData.event_url.toLowerCase();
                if (labels.length === 0 &&
                    !eventUrlLower.includes('ticketmaster') &&
                    !eventUrlLower.includes('livenation')) {
                    console.log("No labels generated for event", eventData.site_event_id, "- hiding chart container");
                    let chartBox = card.querySelector('.chart-box');
                    if (chartBox) {
                        chartBox.style.display = 'none';
                    }
                } else {
                    // Create the chart if data is available or if it is a Ticketmaster/LiveNation event.
                    const canvasContainer = card.querySelector('.chart-box');
                    const chartCanvas = document.createElement('canvas');
                    const chartId = 'chart-' + eventData.site_event_id;
                    chartCanvas.setAttribute('id', chartId);
                    chartCanvas.style.height = '250px';
                    chartCanvas.style.maxHeight = '250px';
                    chartCanvas.style.width = '100%';

                    // Replace the old container with the new canvas element
                    canvasContainer.replaceWith(chartCanvas);

                    // Initialize Chart.js on the created canvas
                    var ctx = chartCanvas.getContext('2d');
                    var chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Primary Listed',
                                    backgroundColor: 'rgba(6, 123, 194, 1)',
                                    borderColor: 'rgba(6, 123, 194, 1)',
                                    data: primaryData
                                },
                                {
                                    label: 'Preferred Sections',
                                    backgroundColor: 'rgba(175, 123, 64, 1)',
                                    borderColor: 'rgba(175, 123, 64, 1)',
                                    data: preferredData
                                }
                            ]
                        },
                        options: {
                            tooltips: {
                                mode: 'index',
                                intersect: false
                            },
                            hover: {
                                mode: 'index',
                                intersect: false
                            },
                            scales: {
                                yAxes: [{
                                    position: 'right',
                                    ticks: {
                                        callback: function (yValue) {
                                            return Math.floor(yValue);
                                        }
                                    }
                                }]
                            },
                            maintainAspectRatio: false,
                            plugins: {
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                },
                                legend: {
                                    display: true,
                                }
                            }
                        }
                    });

                    // Always update the chart based on the event’s source.
                    updateChartData(eventData, chart);
                }

                cardContainer.appendChild(card);
                // End of dynamic chart creation

            });
        } else if (request.status > 400) {
            document.querySelector('#loading').style.display = "none";
            document.querySelector('#flexbox').style.display = "flex";
            console.log('searchfailed');
        }
    };

    request.send();
}

// ------------------------
// HELPER FUNCTIONS
// ------------------------

function normalizeDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function displayLoadingFailed() {
    // You can implement a failure message display here.
    // For example, you might hide the chart container if provided.
}

// ------------------------
// CHART UPDATE FUNCTIONS
// ------------------------

function updateChartWithPrimaryAndPreferred(eventData, chart) {
    let amountsPrimary = [];
    let datesPrimary = [];
    let combinedDates = new Set();
    let preferredDataArr = [];
    let counts = eventData.counts;
    let venueid = eventData.site_venue_id;
    let prefixes = retrievefetch(eventData.event_url);

    chart.data.datasets[0].label = `${prefixes.source} Primary`;
    chart.data.datasets.splice(1, 3);

    counts.forEach(count => {
        amountsPrimary.push(Math.round(count.primary_amount));
        let normalizedDate = normalizeDate(count.scrape_date);
        datesPrimary.push(normalizedDate);
        combinedDates.add(normalizedDate);
    });

    console.log("Primary data amounts:", amountsPrimary);
    console.log("Primary data dates:", datesPrimary);

    const controller = new AbortController();
    abortControllers.push(controller);

    var http = new XMLHttpRequest();
    var url = `https://ubik.wiki/api/venues/${venueid}/`;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader('Authorization', `Bearer ${token}`);
    http.signal = controller.signal;

    http.onload = function () {
        let dataResponse = JSON.parse(this.response);
        let prefSections = {
            pref1: dataResponse.pref_section1,
            pref2: dataResponse.pref_section2,
            pref3: dataResponse.pref_section3
        };

        console.log("Preferred sections:", prefSections);

        fetch(`https://ubik.wiki/api/primary-counts/?tickets_by_sections__icontains={&event_id__icontains=${eventData.site_event_id}&limit=1000&format=json`, {
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

                const validPrefs = [prefSections.pref1, prefSections.pref2, prefSections.pref3].filter(pref => pref && pref !== 'null' && pref !== null);
                validPrefs.forEach((pref, index) => {
                    let datewiseAggregation = {};

                    data.results.forEach(result => {
                        let scrapeDate = normalizeDate(result.event.scrape_date);

                        if (!datewiseAggregation[scrapeDate]) {
                            datewiseAggregation[scrapeDate] = 0;
                        }

                        result.tickets_by_sections.forEach(section => {
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

                    preferredDataArr.push({
                        label: pref,
                        amounts: prefAmounts,
                        dates: prefDates,
                        backgroundColor: `rgba(${75 + index * 40}, 179, 113, 1)`,
                        borderColor: `rgba(${75 + index * 40}, 170, 113, 1)`
                    });
                });

                combinedDates = Array.from(combinedDates).sort((a, b) => new Date(a) - new Date(b));

                let alignedPrimaryData = combinedDates.map(date => {
                    let index = datesPrimary.indexOf(date);
                    return index !== -1 ? amountsPrimary[index] : 0;
                });

                preferredDataArr.forEach(prefDataset => {
                    prefDataset.alignedAmounts = combinedDates.map(date => {
                        let index = prefDataset.dates.indexOf(date);
                        return index !== -1 ? prefDataset.amounts[index] : 0;
                    });
                });

                chart.config.data.labels = combinedDates;
                chart.data.datasets[0].data = alignedPrimaryData;

                preferredDataArr.forEach(prefDataset => {
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

            })
            .catch(error => {
                console.error('There was an error with the fetch request for preferred counts.', error);
                displayLoadingFailed();
            });
    };

    http.onerror = function () {
        console.error('There was an error with the XMLHttpRequest for preferred sections.');
        displayLoadingFailed();
    };

    http.send();
}

function fetchTicketmasterData(eventData, chart) {
    let evidp = eventData.site_event_id.slice(2);
    const controller = new AbortController();
    abortControllers.push(controller);

    var http = new XMLHttpRequest();
    var url = `https://shibuy.co:8443/142data?eventid=${evidp}`;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.signal = controller.signal;

    http.onload = function () {
        let data = JSON.parse(this.response);
        if (data.length > 0) {
            processTicketmasterData(eventData, chart, data);
        } else {
            console.log("No data received from Ticketmaster.");
            let eventid = eventData.site_event_id
            document.querySelector(`#diff${eventid}`).parentElement.style.display = 'none'
            document.querySelector(`#prim${eventid}`).parentElement.style.display = 'none'
            chart.canvas.style.display = 'none';
        }
    };

    http.onerror = function () {
        console.error('There was an error with the XMLHttpRequest.');
        displayLoadingFailed();
    };

    http.send();
}

function processTicketmasterData(eventData, chart, data) {
    const eventid = eventData.site_event_id
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

    if(data[0].summaries[0].total_difference_per_day){
    document.querySelector(`#diff${eventid}`).textContent = data[0].summaries[0].total_difference_per_day
    document.querySelector(`#diff${eventid}`).parentElement.style.display = 'flex'
    } else {
    document.querySelector(`#diff${eventid}`).parentElement.style.display = 'none'
    }

    console.log(prefSections);

    chart.data.datasets.splice(1, 3);

    data.forEach(event => {
        event.summaries.forEach((summary, index) => {

            if (!summary.sections || summary.sections.length === 0) {
                console.log("No sections available for this summary:", summary.scrape_date);
                return;
            }

            const filteredSections = summary.sections.filter(section => section.type !== 'resale');
            const totalAmount = filteredSections.reduce((accumulator, section) => accumulator + section.amount, 0);

            if (totalAmount > 0) {
                const scrapeDateStr = summary.scrape_date;
                const formattedDate = scrapeDateStr.slice(0, 16).replace("T", " ");
                console.log("Formatted Date:", formattedDate);

                dates.push(formattedDate);
                amounts.push(totalAmount);

                if (prefSections.pref1 && prefSections.pref1 !== "null") {
                    const matchingSections1 = filteredSections.filter(section => section.section.includes(prefSections.pref1));
                    if (matchingSections1.length > 0) {
                        const prefAmount1 = matchingSections1.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates1.push(formattedDate);
                        preferredAmounts1.push(prefAmount1);
                    }
                }

                if (prefSections.pref2 && prefSections.pref2 !== "null") {
                    const matchingSections2 = filteredSections.filter(section => section.section.includes(prefSections.pref2));
                    if (matchingSections2.length > 0) {
                        const prefAmount2 = matchingSections2.reduce((acc, sec) => acc + sec.amount, 0);
                        preferredDates2.push(formattedDate);
                        preferredAmounts2.push(prefAmount2);
                    }
                }

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

    chart.data.datasets[0].data = sortedPrimaryData.sortedAmounts;
    chart.config.data.labels = sortedPrimaryData.sortedDates;

    chart.data.datasets = [{
        data: sortedPrimaryData.sortedAmounts,
        label: "TICKETMASTER Primary",
        backgroundColor: 'rgba(0, 102, 51, 1)',
        borderColor: 'rgba(0, 102, 51, 1)',
        borderWidth: 1
    }];

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

    chart.update();

    let latestcount = sortedPrimaryData.sortedAmounts[sortedPrimaryData.sortedAmounts.length - 1];

    if(latestcount && latestcount !== 0) {
    document.querySelector(`#prim${eventid}`).textContent = sortedPrimaryData.sortedAmounts[sortedPrimaryData.sortedAmounts.length - 1];
    document.querySelector(`#prim${eventid}`).parentElement.style.display = 'flex'
    } else {
    document.querySelector(`#prim${eventid}`).parentElement.style.display = 'none'
    }


}

function updateChartData(eventData, chart) {
    console.log("updateChartData called for event:", eventData.site_event_id);
    console.log("Original event URL:", eventData.event_url);
    let eventUrl = eventData.event_url ? eventData.event_url.toLowerCase() : '';
    console.log("Lowercase event URL:", eventUrl);
    if (eventUrl.includes('ticketmaster') || eventUrl.includes('livenation')) {
        console.log("Detected Ticketmaster or Livenation event, calling fetchTicketmasterData");
        fetchTicketmasterData(eventData, chart);
    } else {
        console.log("Not a Ticketmaster or Livenation event, calling updateChartWithPrimaryAndPreferred");
        updateChartWithPrimaryAndPreferred(eventData, chart);
    }
}

// ------------------------
// INTERVALS AND OTHER FUNCTIONS
// ------------------------

var removeHiddenIntervalId = window.setInterval(function(){
    let boxes = document.querySelectorAll('.eventbox-chart');
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
            boxes[i].remove();
        }
    }
}, 100);

function getLatestCount(counts) {
    if (counts && counts.length > 0) {
        counts.sort((a, b) => new Date(b.scrape_date) - new Date(a.scrape_date));
        return counts[0].scrape_date;
    } else {
        return 0;
    }
}

function getLatestCount2(counts) {
    if (counts && counts.length > 0) {
        counts.sort((a, b) => new Date(b.scrape_date) - new Date(a.scrape_date));
        return counts[0].primary_amount;
    } else {
        return 0;
    }
}

function checkresults() {
    let results = document.querySelectorAll('.eventbox-chart');
    let count = 0;
    for (let i = 0; i < results.length; i++) {
        if (results[i].style.display !== 'none') {
            count++;
            document.querySelector('#counter').textContent = count;
        }
        if (count < 2) {
            document.querySelector('#countertxt').textContent = 'Result';
        } else {
            document.querySelector('#countertxt').textContent = 'Results';
        }
    }
}

let datear = function(){
    setTimeout(() => {
        let now = new Date();
        let date1 = moment(now).format('YYYY/MM/DD');
        $('.eventbox-chart').sort(function(a, b) {
            if (date1 > $(b).attr('date')) {
                return 1;
            } else {
                return -1;
            }
        }).appendTo('#Cards-Container');
    }, 2500);
};

var checkResultsIntervalId = window.setInterval(function(){
    checkresults();
}, 100);

var input1 = document.getElementById("searchbar1");
input1.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});
var input2 = document.getElementById("searchbar2");
input2.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});
