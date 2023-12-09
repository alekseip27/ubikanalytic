Webflow.push(function() {
    $('form').submit(function() {
    return false;
    });
    });
    var input = document.getElementById("searchbar1");
    input.addEventListener("keyup", function(event)     {
    if (event.keyCode === 13) {
    event.preventDefault();

    document.getElementById("search-button").click();
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
    document.querySelector('#chart1').style.display = 'none'
    document.querySelector('#chart2').style.display = 'none'
    document.querySelector('#chartloading1').style.display = 'none'
    document.querySelector('#chartloading2').style.display = 'none'

    document.querySelector("#loading1").style.display = "flex";
    document.querySelector("#loadingfailed1").style.display = "none";

    document.querySelector("#loading2").style.display = "flex";
    document.querySelector("#loadingfailed2").style.display = "none";


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
    chart.data.datasets[1].data = ''
    chart.data.datasets[0].data = ''
    chart.config.data.labels =  ''
    chart.update();

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
    document.querySelector(".locked-content").style.display = 'flex'
    document.querySelector(".pageloading").style.display = 'none'
    } else if (request.status >= 200 && request.status < 400) {
    document.querySelector(".locked-content").style.display = 'none'
    document.querySelector(".pageloading").style.display = 'none'
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

    function cancelFetch() {
        if (controller) {
            controller.abort();
            controller = null; // Reset controller after aborting
            console.log('abort')
        }
    }



function formatTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to JavaScript timestamp
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return formattedDate;
}

/**
function getvenuedata() {
    document.getElementById('venueresale').textContent = '';
    document.getElementById('venuecap').textContent = '';
    document.getElementById('venuename').textContent = '';
    document.getElementById('fwicon').textContent = '';
    document.getElementById('lowcaptext').textContent = '';

    let getevent = 'https://ubik.wiki/api/event-venue/?vdid__iexact=' + events.venue.id + events.date.slice(0, 10);

    fetch(getevent)
      .then(response => response.json())
      .then(commits => {
        try {
          if (commits.results.length > 0) {
            document.getElementById('fwicon').textContent = '';
            document.getElementById('lowcaptext').textContent = '/';
            document.getElementById('venuebox').style.display = 'flex';
            let venuecap = commits.results[0].venue_capacity;
            document.getElementById('venuename').textContent = commits.results[0].venue_name;

            let geteventparttwo = 'https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/vividseats_data?id=' + card.getAttribute('id');
            fetch(geteventparttwo)
              .then(response => response.json())
              .then(commits => {
                if (commits.length>1) {
                  let lastCommit = commits[commits.length - 1];
                  console.log(lastCommit)+"lastcom";
                  document.getElementById('venueresale').textContent = Math.round(lastCommit.ticket_count / venuecap * 100) + '%';
                  document.getElementById('venuecap').textContent = venuecap;
                } else if (commits.length === 0) {
                    let lastCommit = commits[0]+"lastcom";
                    console.log(lastCommit)
                    document.getElementById('venueresale').textContent = Math.round(lastCommit.ticket_count / venuecap * 100) + '%';
                    document.getElementById('venuecap').textContent = venuecap;
                }
              });
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      });
  }
  */


  async function getchartsd() {
    let dates_sd = [];
    let amounts_sd = [];
    let prices_sd = [];
    let rows_sd = [];
    let sections_sd = [];

    if (!events.stubhubEventUrl) {
        $('.event-box.pricing').css({ pointerEvents: "auto" });
        document.querySelector("#chart1").style.display = "none";
        document.querySelector("#chartloading1").style.display = "flex";
        document.querySelector("#loading1").style.display = "none";
        document.querySelector("#loadingfailed1").style.display = "flex";
        return; // Early return if stubhubEventUrl is not available

    }

    const eventid = events.stubhubEventUrl.slice(-10, -1);
    const eventurl = events.stubhubEventUrl;
    const getevent = `https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/seatdata_0?eventid=${eventid}&Event_Url=${eventurl}`;

    try {
        const response = await fetch(getevent);

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const commits = await response.json();

        if (!Array.isArray(commits)) {
            $('.event-box.pricing').css({ pointerEvents: "auto" });
            document.querySelector("#chart1").style.display = "none";
            document.querySelector("#chartloading1").style.display = "flex";
            document.querySelector("#loading1").style.display = "none";
            document.querySelector("#loadingfailed1").style.display = "flex";
            throw new Error('Data is not an array.');

        }

        for (const commit of commits) {
            amounts_sd.push(commit.quantity);
            prices_sd.push(commit.price);
            rows_sd.push(commit.row);
            sections_sd.push(commit.section);
            dates_sd.push(commit.timestamp);
        }

        const data = dates_sd.map((timestamp, index) => ({
            timestamp,
            price: prices_sd[index],
            amount: amounts_sd[index],
            section: sections_sd[index],
            row: rows_sd[index]
        }));

        data.sort((a, b) => a.timestamp - b.timestamp);

        updateChartData(data); // Extract chart updating logic into a separate function

        document.querySelector('#chart1').style.display = 'flex';
        document.querySelector('#chartloading1').style.display = 'none';
        document.querySelector("#loading1").style.display = "flex";
        document.querySelector("#loadingfailed1").style.display = "none";
        $('.event-box.pricing').css({ pointerEvents: "auto" });

    } catch (error) {
        console.error('An error occurred:', error);
        document.querySelector("#chart1").style.display = "none";
        document.querySelector("#chartloading1").style.display = "flex";
        document.querySelector("#loading1").style.display = "none";
        document.querySelector("#loadingfailed1").style.display = "flex";
        $('.event-box.pricing').css({ pointerEvents: "auto" });
    }
}

function updateChartData(data) {
    // Update chart data and labels
    chart.data.datasets[0].data = data.map(item => item.price);
    chart.data.datasets[1].data = data.map(item => item.amount);
    chart.data.datasets[2].data = data.map(item => item.section);
    chart.data.datasets[3].data = data.map(item => item.row);
    chart.data.labels = data.map(item => formatTimestamp(item.timestamp));
    chart.update();
}




  async function getchartvs() {
    let venuecap = 0;
    let datesvs = [];
    let amountsvs = [];
    let prefvs = [];
    let lowestprice = [];
    let lowestpricepref = [];
    let evid = events.venue.id;
    let evdate = events.date;
    let evurl = events.vividSeatsEventUrl;

    // Create an AbortController instance
    const controller = new AbortController();
    const signal = controller.signal;

    var http = new XMLHttpRequest();
    var url = "https://ubik.wiki/api/sbox-data/?vividseats_event_url__icontains=" + evurl;
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");

    http.onload = function () {
        vividresponse = JSON.parse(this.response);
        commits = vividresponse.results;

        if (commits.length > 0) {
            for (var i = 0; i < commits.length; i++) {
                if (commits[i].ticket_count > 0) {
                    amountsvs.push(Math.round(commits[i].ticket_count));
                    prefvs.push(Math.round(commits[i].preferred_count));
                    datesvs.push(commits[i].date_scraped);

                    lowestprice.push(Math.round(commits[i].lowest_price));
                    lowestpricepref.push(Math.round(commits[i].lowest_preferred_price));
                }
            }

            const lastCommit = commits[commits.length - 1];
            document.getElementById("venueresale").textContent =
                Math.round((lastCommit.ticket_count / venuecap) * 100) + "%";
            document.getElementById("venuecap").textContent = venuecap;

            let threeDaysAgoCount = amountsvs[amountsvs.length - 4]; // 3 days ago count
            let todayCount = amountsvs[amountsvs.length - 1]; // Today's count
            let movingAverage = (threeDaysAgoCount - todayCount) / 3;

            let threeDaysAgoCountpref = prefvs[prefvs.length - 4]; // 3 days ago count
            let todayCountpref = prefvs[prefvs.length - 1]; // Today's count
            let movingAveragepref = (threeDaysAgoCountpref - todayCountpref) / 3;

            document.getElementById("fwicontotal3day").textContent = "";
            document.getElementById("total3daytext").textContent = "Total 3 Day:";
            document.getElementById("total3dayamount").textContent = movingAverage.toFixed(2);

            document.getElementById("fwiconpreferred3day").textContent = "";
            document.getElementById("preferred3daytext").textContent = "Preferred 3 Day:";
            document.getElementById("preferred3dayamount").textContent = movingAveragepref.toFixed(2);

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
            $('.event-box.pricing').css({pointerEvents: "auto"})
        } else {
            // No data available, show "loadingfailed2" and hide other elements
            document.querySelector("#loading2").style.display = "none";
            document.querySelector("#loadingfailed2").style.display = "flex";
            document.querySelector("#chart2").style.display = "none";
            document.querySelector("#chartloading2").style.display = "flex";
            $('.event-box.pricing').css({pointerEvents: "auto"})

        }
    };

    // Function to cancel the ongoing fetch request
    function cancelFetch() {
        controller.abort();
    }
    http.send();
}






const primaryurl = async function(){
    let getevent = 'https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5:v1/getevent_primaryurl?search-key='+events.venue.id+events.date.slice(0,10)+'&search-key2='+events.name+'&search-key3='+events.date.slice(0,10)
    let response = await fetch(getevent);
    let commits = await response.json()

    if(commits.length>0){
    document.querySelector('#mainurl').value = commits[0].Event_Url

    document.querySelector('#urlmain').style.display = 'flex'
    document.querySelector('#changedata').style.display = 'flex'
    document.querySelector('#urlmainmobile').setAttribute('url',commits[0].Event_Url)
    document.querySelector('#urlmainmobile').style.display = 'flex'

    document.querySelector('#urlmain').addEventListener('click',function(){
    if(url !== 'null') {
    window.open(url,'urlmain')
    $('#urlmain').css('cursor', 'pointer');
    }
    })


    document.querySelector('#fwicon6').textContent = ''
    let url = commits[0].Event_Url


    if(url.includes('ticketmaster') || url.includes('livenation')){
    document.getElementById('142box').style.display = 'flex'
    document.getElementById('142boxmobile').style.display = 'flex'
    let onefourtwo = 'http://142.93.115.105:8100/event/' + url.split('/event/')[1] + '/details/'


    const tmcount = async function(){
    let getevent = 'https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5:v1/tmcount?eventid=' + url.split('/event/')[1]
    let response = await fetch(getevent);
    let commits = await response.json()
    if(typeof commits === 'number'){
    document.getElementById('tmcount').textContent = commits
    }}

    tmcount()

    document.getElementById('142box').addEventListener('click',function(){
    window.open(onefourtwo,'onefourtwo')
    })

    document.getElementById('142boxmobile').addEventListener('click',function(){
    window.open(onefourtwo,'onefourtwomobile')
      })

    } else if(url === 'null') {
    $('#urlmain').css('cursor', 'default');
    document.getElementById('142box').style.display = 'none'
    document.getElementById('142boxmobile').style.display = 'none'
    }

}}



  card.addEventListener('click', function() {
    controller = new AbortController();

    $('.event-box.pricing').css({pointerEvents: "none"})

  document.querySelector('#urlmain').style.display = 'none'
  document.querySelector('#changedata').style.display = 'none'
  document.querySelector('#urlmainmobile').style.display = 'none'
  document.getElementById('142box').style.display = 'none'
  document.getElementById('142boxmobile').style.display = 'none'
  document.querySelector('#urlmain').setAttribute('url','')
  document.querySelector('#selectedevent').setAttribute('VDID','')
  document.querySelector('#urlmainmobile').setAttribute('url','')
  document.querySelector('#sdatacount').textContent = '0'

  document.querySelector('#chart1').style.display = 'none'
  document.querySelector('#chart2').style.display = 'none'
  document.querySelector('#chartloading1').style.display = 'flex'
  document.querySelector('#chartloading2').style.display = 'flex'

  document.querySelector("#loading1").style.display = "flex";
  document.querySelector("#loadingfailed1").style.display = "none";

  document.querySelector("#loading2").style.display = "flex";
  document.querySelector("#loadingfailed2").style.display = "none";




document.getElementById('mainurl').value = ''

  chart.data.datasets[1].data = ''
  chart.data.datasets[0].data = ''
  chart.config.data.labels =  ''
  chart.update();


  chartvs.data.datasets[0].data = ''
  chartvs.data.datasets[1].data = ''
  chartvs.config.data.labels = ''
  chartvs.update();


    $('.event-box.pricing').css({pointerEvents: "none"})
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
    if (events.stubhubEventUrl !== null && events.stubhubEventUrl.length>0 && !events.stubhubEventUrl.includes('viagogo')) {
    let stubhubid = events.stubhubEventUrl.slice(-9).replace('/','')
    document.querySelector("#refreshstub").click()
    document.querySelector('#selectedevent').setAttribute('stubhub-id',stubhubid);
    }

    if(events.stubhubEventUrl !== null && events.stubhubEventUrl.length>0 && events.stubhubEventUrl.includes('viagogo')){
    let stubhubid = events.stubhubEventUrl.slice(-9)
    document.querySelector("#refreshstub").click()
    document.querySelector('#selectedevent').setAttribute('stubhub-id',stubhubid);
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
    //document.querySelector('#chart1').style.display = 'none'
    //document.querySelector('#chart2').style.display = 'none'
    //document.querySelector('#chartloading1').style.display = 'flex'
    //document.querySelector('#chartloading2').style.display = 'flex'
    document.querySelector('#lowerable').checked = false
    document.querySelector('#urlmain').style.display = 'none'
    document.querySelector('#changedata').style.display = 'none'
    document.querySelector('#urlmainmobile').style.display = 'none'
    document.getElementById('142box').style.display = 'none'
    document.getElementById('142boxmobile').style.display = 'none'
    document.querySelector('#urlmain').setAttribute('url','')
    document.querySelector('#urlmainmobile').setAttribute('url','')

    $('.event-box-pricing').hide()
    chart.data.datasets[1].data = ''
    chart.data.datasets[0].data = ''
    chart.config.data.labels =  ''
    chart.update();

    chartvs.data.datasets[0].data = ''
    chartvs.data.datasets[1].data = ''
    chartvs.config.data.labels = ''
    chartvs.update();

    } else {

  getchartvs()
  getchartsd()
  primaryurl()
//getvenuedata()
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



    async function getchartvs() {
        let venuecap = 0;
        let datesvs = [];
        let amountsvs = [];
        let prefvs = [];
        let lowestprice = [];
        let lowestpricepref = [];
        let evid = events.venue.id;
        let evdate = events.date;
        let evurl = events.vividSeatsEventUrl;

        // Create an AbortController instance
        const controller = new AbortController();
        const signal = controller.signal;

        var http = new XMLHttpRequest();
        var url =
            "https://ubik.wiki/api/sbox-data/?vividseats_event_url__icontains=" + evurl;
        http.open("GET", url, true);
        http.setRequestHeader("Content-type", "application/json; charset=utf-8");

        http.onload = function () {
            vividresponse = JSON.parse(this.response);
            commits = vividresponse.results;

            if (commits.length > 0) {
                for (var i = 0; i < commits.length; i++) {
                    if (commits[i].ticket_count > 0) {
                        amountsvs.push(Math.round(commits[i].ticket_count));
                        prefvs.push(Math.round(commits[i].preferred_count));
                        datesvs.push(commits[i].date_scraped);

                        lowestprice.push(Math.round(commits[i].lowest_price));
                        lowestpricepref.push(Math.round(commits[i].lowest_preferred_price));
                    }
                }

                const lastCommit = commits[commits.length - 1];
                document.getElementById("venueresale").textContent =
                    Math.round((lastCommit.ticket_count / venuecap) * 100) + "%";
                document.getElementById("venuecap").textContent = venuecap;

                let threeDaysAgoCount = amountsvs[amountsvs.length - 4]; // 3 days ago count
                let todayCount = amountsvs[amountsvs.length - 1]; // Today's count
                let movingAverage = (threeDaysAgoCount - todayCount) / 3;

                let threeDaysAgoCountpref = prefvs[prefvs.length - 4]; // 3 days ago count
                let todayCountpref = prefvs[prefvs.length - 1]; // Today's count
                let movingAveragepref = (threeDaysAgoCountpref - todayCountpref) / 3;

                document.getElementById("fwicontotal3day").textContent = "";
                document.getElementById("total3daytext").textContent = "Total 3 Day:";
                document.getElementById("total3dayamount").textContent = movingAverage.toFixed(2);

                document.getElementById("fwiconpreferred3day").textContent = "";
                document.getElementById("preferred3daytext").textContent = "Preferred 3 Day:";
                document.getElementById("preferred3dayamount").textContent = movingAveragepref.toFixed(2);

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
                // No data available, show "loadingfailed2" and hide other elements
                document.querySelector("#loading2").style.display = "none";
                document.querySelector("#loadingfailed2").style.display = "flex";
                document.querySelector("#chart2").style.display = "none";
                document.querySelector("#chartloading2").style.display = "flex";
            }
        };

        // Function to cancel the ongoing fetch request
        function cancelFetch() {
            controller.abort();

        }

        http.send();
    }



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



function getpdates() {

  let curUser = firebase.auth().currentUser;
  let myFS = firebase.firestore();
  let docRef = myFS.doc("users/" + curUser.uid);
  docRef.get().then(async (docSnap) => {
    let data = docSnap.data();
    pauth = data['pyeo'];

    const eventBoxes = document.querySelectorAll('.event-box');

    // Iterate over the first 5 event boxes
    for (let i = 0; i < eventBoxes.length; i++) {
      const eventBox = eventBoxes[i];

      const pdateElement = eventBox.querySelector('.main-text-pdate');

      // Skip if pdateElement already has text content
      if (pdateElement.textContent || eventBox.id === 'samplestyle') {
        continue;
      }

      const eventId = eventBox.id;
      const url = `https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_inventory_created?searchkey=${eventId}&user=aleksei@ubikanalytic.com`;

      let success = false;
      while (!success) {
        try {
          // Send the fetch request
          const response = await fetch(url, {
            headers: {
              'Authorization': pauth
            }
          });

          if (response.ok) {
            const data = await response.text();
            const formattedDate = data.substring(2, 12);
            pdateElement.textContent = formattedDate;
            pdateElement.setAttribute('date', formattedDate);
            success = true;
          } else {
            throw new Error('Response not OK');
          }
        } catch (error) {
          console.error('Error:', error);
          // Retry until success
        }
      }
    }
  });
}

document.getElementById('scrapedates').addEventListener('click', getpdates);


