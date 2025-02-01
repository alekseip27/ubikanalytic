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
    $('.event-box-chart').hide()

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


            $('.event-box-chart').hide()

            nexturl = data.next
            prevurl = data.previous
            pcount = parseInt(data.count/100)

            document.getElementById('maxpages').textContent = pcount

            if(nexturl){
                const match = nexturl.match(/offset=(\d+)/);

                let result;
                if (match && match[1]) {
                if (match[1].length >= 4) {
                result = match[1].slice(0, 2);
                } else {
                result = match[1][0];
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


            function copyToClipboard(text) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();
            }

            const eventname = card.getElementsByClassName('main-text-event-name')[0]
            eventname.textContent = events.event_name + ' - '

            const locationcard = card.getElementsByClassName('chartloc')[0]
            locationcard.textContent = events.city + ', ' + events.state + ', ' + events.country



            const favorite1 = card.getElementsByClassName('favorite-icon1')[0]
            const favorite2 = card.getElementsByClassName('favorite-icon2')[0]


            if(events.favorites === true) {
            favorite1.style.display = 'none'
            favorite2.style.display = 'block'
            }


            const buybutton = card.getElementsByClassName('event-buy')[0]
            buybutton.addEventListener('click', function() {
            window.location.assign('https://www.ubikanalytic.com/event?id=' + evid)
            });

            const manualbuy = card.getElementsByClassName('event-manual')[0]
            manualbuy.addEventListener('click', function() {
            window.location.assign('https://www.ubikanalytic.com/buy-manual?id=' + evid)
            });

            const eventhide = card.getElementsByClassName('event-hide')[0]
            eventhide.addEventListener('click', function() {

                var http = new XMLHttpRequest();
                var url = "https://ubik.wiki/api/update/primary-events/"
                var params = JSON.stringify({
                "site_event_id": evid,
                "hidden": "true"
                })
                http.open("PUT", url, true);
                http.setRequestHeader("Content-type", "application/json; charset=utf-8");
                http.setRequestHeader('Authorization', `Bearer ${token}`);
                http.send(params);
                card.style.display = "none";



            });






            const datecard = card.getElementsByClassName('chartdate')[0]
            const latestdate = getLatestCount(events.counts)
            const latestdate2 = events.app_142_scrape_date

            if(latestdate !== 0) {
            datecard.textContent = latestdate
            } else if(latestdate === 0 && !!latestdate && latestdate2.length > 4) {
            datecard.textContent = events.app_142_scrape_date
            } else {
            datecard.textContent = 'Unavailable'
            card.getElementsByClassName('chartscrapedate')[0].style.display = 'none'
            }


            const latestcount = getLatestCount2(events.counts)
            const primaryam = card.getElementsByClassName('chartprim')[0]

        if(primaryam !== 0) {
        primaryam.textContent = latestcount
        } else if(latestcount === 0 && !!latestcount && latestcount.length > 4) {
        datecard.textContent = events.app_142_primary_amount
        } else {
        primaryam.textContent = 'Unavailable'
        card.getElementsByClassName('chartprimambox')[0].style.display = 'none'
        }



            const capacitycard = card.getElementsByClassName('chartcap')[0]
            if(events.venue_capacity) {
            capacitycard.textContent = events.venue_capacity
            } else {
            card.getElementsByClassName('chartcapacitybox')[0].style.display = 'none'
            }

            const txtsource = card.getElementsByClassName('chart-venueid')[0]
            txtsource.textContent = events.scraper_name
            let eventUrl = events.event_url

            let prefs = []
            let pref1 = events.pref_section1
            let pref2 = events.pref_section2
            let pref3 = events.pref_section3

            if(pref1){
            prefs.push(pref1)
            }
            if(pref2){
            prefs.push(pref2)
            }
            if(pref3){
            prefs.push(pref3)
            }

            const preftext = card.getElementsByClassName('chartprefs')[0]
            if(prefs.length>0) {
            preftext.textContent = prefs.join(', ')
            } else {
            card.getElementsByClassName('chartprefbox')[0].style.display = 'none'
            }

            const charteventdate = card.getElementsByClassName('charteventdate')[0]
            if(events.date){
            charteventdate.textContent = events.date
            } else {
            card.getElementsByClassName('chart-datebox')[0].style.display = 'none'
            }

            const charteventtime = card.getElementsByClassName('charteventtime')[0]
            if(events.time){
                charteventtime.textContent = events.time
                } else {
                card.getElementsByClassName('chart-time-box')[0].style.display = 'none'
                }


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
                case eventUrl.includes('axs.'):
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
                case eventUrl.includes('bigtickets.com'):
                txtsource.textContent = 'big';
                break;
            default:
                txtsource.textContent = 'OTHER';
                break;
            }


            if(events.event_url.includes('ticketmaster') || events.event_url.includes('livenation')) {

                eventname.addEventListener('click',function(){
                window.open('http://142.93.115.105:8100/event/' + evid.substring(2) +'/details/', "primary")
                });
                } else {
                    eventname.addEventListener('click',function(){
                    window.open(events.event_url, "primary")
                });
                }

                if(events.hidden === 'true'){
                card.style.display = "none";
                }



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
            let boxes = document.querySelectorAll('.event-box-chart')
            for (let i = 0; i<boxes.length;i++) {
            if(boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
            boxes[i].remove()
            }}
            }, 100);
            }


           function getLatestCount(counts) {
                if(counts && counts.length>0){

                counts.sort((a, b) => {
                const dateA = new Date(a.scrape_date);
                const dateB = new Date(b.scrape_date);
                return dateB - dateA;
                });

                return counts[0].scrape_date;
                } else {
                return 0;
                }
            }

            function getLatestCount2(counts) {
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


        function checkresults() {
        let results = document.querySelectorAll('.event-box-chart')
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
            $('.event-box-chart').sort(function(a, b) {
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
