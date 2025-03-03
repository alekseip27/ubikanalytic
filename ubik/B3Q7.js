let xanoUrl = new URL('https://ubik.wiki/api/buying-queue/?completed__iexact=false&limit=1000');
function getEvents() {
let request = new XMLHttpRequest();

let url = xanoUrl.toString()

request.open('GET', url, true)
request.setRequestHeader('Authorization', `Bearer ${token}`);
request.setRequestHeader("Content-type", "application/json; charset=utf-8");
request.onload = function() {


let data = JSON.parse(this.response)

if (request.status >= 200 && request.status < 400) {

const cardContainer = document.getElementById("Cards-Container")
console.log(request)
data.results.forEach(events => {

const style = document.getElementById('samplestyle')
const card = style.cloneNode(true)

card.setAttribute('id', '');
card.setAttribute('name', events.event_name)
card.setAttribute('venue', events.event_venue)
card.setAttribute('source', events.event_source)

card.style.display = 'flex';

const buybutton = card.getElementsByClassName('main-buy-button')[0]
buybutton.addEventListener('click', function() {
window.location.assign("https://www.ubikanalytic.com/buy-event?id=" + events.id)
});


const editbutton = card.getElementsByClassName('main-edit-button')[0]
editbutton.style.display = 'none'
editbutton.addEventListener('click', function() {
window.location.assign("https://www.ubikanalytic.com/edit-event?id=" + events.id)
});

let ems = document.querySelector('#email').textContent

const eventname = card.getElementsByClassName('main-text-event')[0]
eventname.textContent = events.event_name;
if(eventname.textContent.length>21) {
eventname.textContent = events.event_name.slice(0, 21)+'...'
}

let eventtime = card.getElementsByClassName('main-text-time')[0]
eventtime.textContent = events.event_time

if(eventtime.textContent.length>8) {
eventtime.textContent = events.event_time.slice(0, 8)
}


let eventtl = card.getElementsByClassName("main-text-tl")[0]
eventtl.textContent = events.added_timestamp
card.setAttribute('dateposted', events.added_timestamp)

let txtsource = card.getElementsByClassName('main-text-src')[0]

let eventUrl = events.event_url


switch(true) {
  case eventUrl.includes('showclix'):
  txtsource.textContent = 'SHOW';
  break;
  case eventUrl.includes('thecomplexslc'):
  txtsource.textContent = 'SHOW';
  break;
  case eventUrl.includes('TM'):
    txtsource.textContent = 'TM';
  break;
  case eventUrl.includes('ticketmaster.ca'):
    txtsource.textContent = 'TM';
  break;
  case eventUrl.includes('ticketmaster'):
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
  case eventUrl.includes('bigtickets.com'):
  txtsource.textContent = 'big';
  break;
  default:
    txtsource.textContent = 'OTHER';
    break;
}

//

const eventvenue = card.getElementsByClassName('main-text-venue')[0]
eventvenue.textContent = events.event_venue
if(eventvenue.textContent.length>20) {
eventvenue.textContent = events.event_venue.slice(0, 20)+'...'
}

const eventdate = card.getElementsByClassName('main-text-date')[0]

var tdate = events.event_date
eventdate.textContent = tdate

card.setAttribute('date', tdate)

let purchasequantity = card.getElementsByClassName('main-text-quantity')[0]
if(events.purchased_amount) {
purchasequantity.textContent = events.purchased_amount
card.setAttribute('fulfilled', events.purchased_amount)
}
else { purchasequantity.textContent = "0"
card.setAttribute('fulfilled', "0")
}

let purchasequantitymax = card.getElementsByClassName('main-text-quantity-max')[0]
purchasequantitymax.textContent = events.purchase_total

const eventurl = events.event_url

function copyToClipboard(text) {
var $temp = $("<input>");
$("body").append($temp);
$temp.val(text).select();
document.execCommand("copy");
$temp.remove();
}

eventname.addEventListener('click', function() { copyToClipboard(eventurl); });


// Helper function to calculate time left
function calculateTimeLeft(date, interval, currentTime) {
    const purchasedate = moment(date).add(interval, 'minutes').toDate();
    const ms = purchasedate - currentTime;
    const d = moment.duration(ms);
    const s = `${Math.floor(d.asHours())}:${moment.utc(ms).format("mm:ss")}`;
    return { timeLeft: Math.floor(d.asMinutes()), displayText: s, expired: ms < 0 };
}

// Calculate time left
const urgency = events.buying_urgency;
const buytimestamp = events.added_timestamp;
const date = moment(buytimestamp).toDate();
const currentTime = new Date(); // Use current time in correct timezone
const eventstatus = card.getElementsByClassName('main-text-status')[0];

// Predefined urgency mappings
const urgencyMap = {
    "15 min": 15,
    "30 min": 30,
    "45 min": 45,
    "1 hr": 60,
    "2 hrs": 120,
    "3 hrs": 180,
    "4 hrs": 240,
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

if(card.getAttribute('error') === 'true'){
const errorbutton = card.getElementsByClassName('main-buy-button')[0]
errorbutton.textContent = 'Respond'
errorbutton.addEventListener('click', function() {
window.location.assign("https://www.ubikanalytic.com/error-respond?id=" +encodeURIComponent(events.error_id).replace('%20','+'));
})}

const confirmbutton = card.getElementsByClassName('main-confirm-button')[0]
const deletebutton = card.getElementsByClassName('main-delete-button-confirm')[0]
const eventid = encodeURIComponent(events.id)
confirmbutton.addEventListener('click', function() {
confirmbutton.style.display = "none";
deletebutton.style.display = "flex";
});

deletebutton.addEventListener('click', function() {
    var http = new XMLHttpRequest();
    var url = "https://ubik.wiki/api/delete/buying-queue/"
    var params = JSON.stringify({
    "id": eventid
    })
    http.open("DELETE", url, true);
    http.setRequestHeader('Authorization', `Bearer ${token}`);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.send(params);
    card.style.display = "none";
})

cardContainer.appendChild(card);
})}}
request.send();


}

let intervalIds;

function retryClickingSearchBar() {
    if (token.length === 40) {
getEvents()
    clearInterval(intervalIds);
    }}

  intervalIds = setInterval(retryClickingSearchBar, 1000);


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



setTimeout(() => {
$("#samplestyle").hide()
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
return +a.getAttribute("timeleft") - +b.getAttribute("timeleft")
}).appendTo(wrapper);
}, 2500);



checkeditbutton = setInterval(function () {

let myFS = firebase.firestore();
let docRef = myFS.doc("users/" + firebase.auth().currentUser.uid);
docRef.get().then((docSnap) => {
let data = docSnap.data();
let admin = data["admin"];

if(admin === true){
var ebutton = document.getElementsByClassName("main-edit-button");
for (var i = 0; i < ebutton.length; i++) {
ebutton[i].style.display = 'flex'
}}
clearInterval(checkeditbutton);

})

}, 1000);

})
