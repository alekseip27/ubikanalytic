window.addEventListener('DOMContentLoaded', (event) => {

    let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/getdata_buylist');
    function getEvents() {
    
    let request = new XMLHttpRequest();
    
    let url = xanoUrl.toString()
    
    request.open('GET', url, true)
    
    request.onload = function() {
    
    let data = JSON.parse(this.response) 
    
    if (request.status >= 200 && request.status < 400) {
    
    const cardContainer = document.getElementById("Cards-Container")
    console.log(request)
    data.forEach(events => {
    
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)
    
    card.setAttribute('id', '');
    card.setAttribute('name', events.Other_Master_Event_Name)
    card.setAttribute('venue', events.Venue_Master_Venue)
    card.setAttribute('source', events.Event_Other_Master_Source_Formula)
    
    card.style.display = 'flex';
    
    const buybutton = card.getElementsByClassName('main-buy-button')[0]
    buybutton.addEventListener('click', function() {
    window.location.assign("https://www.ubikanalytic.com/buy-event?id=" + events.Other_Master_Site_Event_Id);
    });
    
    const eventname = card.getElementsByClassName('main-text-event')[0]
    eventname.textContent = events.Other_Master_Event_Name;
    if(eventname.textContent.length>21) {
    eventname.textContent = events.Other_Master_Event_Name.slice(0, 21)+'...'
    }
    
    let eventtime = card.getElementsByClassName('main-text-time')[0]
    eventtime.textContent = events.Other_Master_Event_Time.slice(0, 8)
    
    let eventtl = card.getElementsByClassName("main-text-tl")[0]
    eventtl.textContent = events.Other_Buy_Request_Date
    card.setAttribute('dateposted', events.Other_Buy_Request_Date)
    
    let eventsrc = card.getElementsByClassName('main-text-src')[0]
    eventsrc.textContent = events.Event_Other_Master_Source_Formula
    
    const eventvenue = card.getElementsByClassName('main-text-venue')[0]
    eventvenue.textContent = events.Venue_Master_Venue
    if(eventvenue.textContent.length>20) {
    eventvenue.textContent = events.Venue_Master_Venue.slice(0, 20)+'...'
    }
     
    const eventdate = card.getElementsByClassName('main-text-date')[0]
    
    var tdate = events.Other_Master_Event_Date.slice(0, 10).replaceAll("-","/")
    tdate = [tdate.slice(5), tdate.slice(0,4)].join('/');
    eventdate.textContent = tdate
    
    card.setAttribute('date', tdate)
    
    let purchasequantity = card.getElementsByClassName('main-text-quantity')[0]
    if(events.Event_Other_Master_Bought_Amnt.length>0) {
    purchasequantity.textContent = events.Event_Other_Master_Bought_Amnt 
    card.setAttribute('fulfilled', events.Event_Other_Master_Bought_Amnt)
    }
    else { purchasequantity.textContent = "0"
    card.setAttribute('fulfilled', "0")
    
    }
    
    let purchasequantitymax = card.getElementsByClassName('main-text-quantity-max')[0]
    purchasequantitymax.textContent = events.Event_Other_Master_User_Purch_Amnt
    
    const eventurl = events.Other_Master_Event_Url
    
    function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove(); 
    }
    
    eventname.addEventListener('click', function() { copyToClipboard(eventurl); });
    
    
    
    // Calculate time left
    let urgency = events.Event_Other_Master_User_Buy_Urgency
    let buytimestamp = events.Other_Buy_Request_Date
    let date = moment(buytimestamp).format('MM/DD/YYYY HH:mm:ss')
    const thnd = new Date();
    let thn = 
    thnd.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    })
    let then = moment(thn).format('MM/DD/YYYY HH:mm:ss')
    let eventstatus = card.getElementsByClassName('main-text-status')[0]
    
    switch (urgency) {
    case 'error': {
    eventstatus.textContent = 'ERROR'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "999999999")
    card.setAttribute('error', "true")
    break; }
    case 'Immediate': {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    card.setAttribute('asap', "true")
    break; }
   
    case '15 min': {
    let purchasedate = moment(date).add(15, 'minutes').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
   
    case '30 min': {
    let purchasedate = moment(date).add(30, 'minutes').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    
     case '45 min': {
    let purchasedate = moment(date).add(45, 'minutes').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    
    case '1 hr': {
    let purchasedate = moment(date).add(1, 'hours').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
   
    case '2 hrs': {
    let purchasedate = moment(date).add(2, 'hours').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    case '4 hrs': {
    let purchasedate = moment(date).add(4, 'hours').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    case '12 hrs': {
    let purchasedate = moment(date).add(12, 'hours').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    case '1 day': {
    let purchasedate = moment(date).add(24, 'hours').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    case '2 days': {
    let purchasedate = moment(date).add(48, 'hours').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    case '4 days': {
    let purchasedate = moment(date).add(96, 'hours').format('MM/DD/YYYY HH:mm:ss')
    var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    eventstatus.textContent = s
    card.setAttribute('timeleft', Math.floor(d.asMinutes()))
    if(then>purchasedate) {
    eventstatus.textContent = 'ASAP'
    eventstatus.style.color = "red";
    card.setAttribute('timeleft', "0")
    }
    break; }
    }
    
    if(card.getAttribute('error') === 'true'){
    const errorbutton = card.getElementsByClassName('main-buy-button')[0]
    errorbutton.textContent = 'Respond'
    errorbutton.addEventListener('click', function() {
    window.location.assign("https://www.ubikanalytic.com/error-respond?id=" +events.Other_Master_Site_Event_Id)
    })}
    
    const confirmbutton = card.getElementsByClassName('main-confirm-button')[0]
    const deletebutton = card.getElementsByClassName('main-delete-button-confirm')[0]
    const eventid = events.Other_Master_Site_Event_Id
    confirmbutton.addEventListener('click', function() {
    confirmbutton.style.display = "none";
    deletebutton.style.display = "flex";
    });
    
    deletebutton.addEventListener('click', function() {
    var http = new XMLHttpRequest();
    var url = "https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/delete_event";
    var params = JSON.stringify({
    "search-key": eventid,
    "Purchase_Total": "",
    "Quantity_Per": "",
    "Section": "",
    "Buying_Urgency": "",
    "Purchase_Frequency": "",
    "Purchase_Account": "",
    "Other_Buy_Request_Date": "",
    "Event_Other_Master_Buy_Status": "",
    "Presale_Code": "",
    "Notes": ""
    })
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.send(params);
    card.style.display = "none";
    });
    
    
    
    
    
    cardContainer.appendChild(card);
    })}}
    request.send();
  
    
    }
  
    setTimeout(() => {
  
    function play() {
sound = new Howl({
  src: ['https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3']
});
sound.play();
    }

  
   let nowcount = document.querySelectorAll(".event-box").length -1
   let timer = setInterval(function () {
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#flexbox').style.display = "none";
    getEvents()
   let count = nowcount
   let results = document.querySelectorAll('.event-box')

   for (let i = 0; i<results.length;i++) {
   if(results[i].style.display !== 'none' && results[i].getAttribute('id') !== 'samplestyle') {
  results[i].remove() 
}

   if(results[i].getAttribute('asap') === 'true' || results[i].getAttribute('timeleft') === '0') {
  count++ 
}}

    console.log("count" + count)
    console.log("now" + nowcount)
    if(count>nowcount){
    document.querySelector('#samplestyle').style.display = "none";
    play()
    let nowcount = 0
    let count = 0
  
    }
    setTimeout(() => {
  
    document.querySelector('#loading').style.display = "none";
    document.querySelector('#flexbox').style.display = "flex";
  
    }, 5000);
setTimeout(() => {
   var wrapper = $('#Cards-Container');
   wrapper.find('.event-box').sort(function(a, b) {
   return +a.getAttribute("timeleft") - +b.getAttribute("timeleft")
   }).appendTo(wrapper);
    }, 5000);
    }, 180000);

    }, 3500);
  
  
    (function() {
    getEvents();
    })();
    
    
    setTimeout(() => {
    $("#samplestyle").hide()
    document.querySelector('#loading').style.display = "none";
    document.querySelector('#flexbox').style.display = "flex";
    }, 3500);
    });
    
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
   return +a.getAttribute("timeleft") - +b.getAttribute("timeleft")
   }).appendTo(wrapper);
   }, 2500);
   
   })
   
  
