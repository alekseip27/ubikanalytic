Webflow.push(function() {
$('form').submit(function() {
return false;
});
});
var input = document.getElementById("searchbar1");
input.addEventListener("keyup", function(event) {
if (event.keyCode === 13) {
event.preventDefault();
document.getElementById("search-button").click();
}
});
document.querySelector('#search-button').addEventListener("click", () => {
let keywords1 = document.getElementById('searchbar1').value
document.querySelector('#selectedevent').textContent = ''
document.querySelector('#eventdate').textContent = ''
document.querySelector('#eventtime').textContent = ''
document.querySelector('#eventlocation').textContent = ''
document.querySelector('#shub').setAttribute('url', '');
document.querySelector('#vseats').setAttribute('url', '');
document.querySelector('#fwicon1').textContent = ''
document.querySelector('#fwicon2').textContent = ''
document.querySelector('#fwicon3').textContent = ''
document.querySelector('#fwicon4').textContent = ''
$(".platform-icon").hide()
$('.event-box').hide()
$('.event-box-2').hide()
$('#samplestyle').show()
const dt = new Date();
let stimestamp2 = moment(dt).format('YYYY-MM-DD')
let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_events?searchkey=');
let request = new XMLHttpRequest();
let url = xanoUrl.toString() +  encodeURIComponent(keywords1).replace(/%20/g, "%") + '&curdate=' + stimestamp2
request.open('GET', url, true)
request.onload = function() {
let data = JSON.parse(this.response)
if((request.status === 429) || (request.status === 500)){
alert('API request rate limit reached, please try again later.')
} else if (request.status >= 200 && request.status < 400) {
const cardContainer = document.getElementById("Cards-Container")
let quantityseatdata = 0
data.forEach(events => {
quantityseatdata + Number(events.quantity)
const style = document.getElementById('samplestyle')
const card = style.cloneNode(true)
card.setAttribute('id', '');
const eventname = card.getElementsByClassName('main-text-event')[0]
eventname.textContent = events.name
if(eventname.textContent.length>15) {
eventname.textContent = events.name.slice(0, 15)+'...'
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
card.addEventListener('click', function() {
$('.event-box-4').hide()
$('#samplestyle4').show()
$(".event-box").removeClass("selected");
card.classList.add("selected");
setTimeout(() => {
let stubhubid = document.querySelector('#selectedevent').getAttribute('stubhub-id');
if(stubhubid !== '0') {
}}, 1500);
document.querySelector('#selectedevent').textContent = events.name.slice(0,15) 
document.querySelector('#eventdate').textContent = events.date.slice(0,10)
document.querySelector('#eventtime').textContent = events.date.slice(11, 16)
document.querySelector('#eventlocation').textContent = events.venue.city + ", " + events.venue.state
document.querySelector('#selectedevent').setAttribute('eventid', events.id);
document.querySelector('#selectedevent').setAttribute('stubhub-id', events.stubhubEventId);
document.querySelector('#shub').setAttribute('url', events.stubhubEventUrl);
document.querySelector('#vseats').setAttribute('url', events.vividSeatsEventUrl);
$(".platform-icon").css('display', 'flex');
document.querySelector('#fwicon1').textContent = ''
document.querySelector('#fwicon2').textContent = ''
document.querySelector('#fwicon3').textContent = ''
document.querySelector('#fwicon4').textContent = ''
{
let eventid = document.querySelector('#selectedevent').getAttribute('eventid');
$('.event-box-pricing').hide()
$('.event-box-2').hide()
$('#samplestyle2').show()
let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_inventory?searchkey=');
let request = new XMLHttpRequest();
let url = xanoUrl.toString() + eventid
request.open('GET', url, true)
request.onload = function() {
let data = JSON.parse(this.response)
if((request.status === 429) || (request.status === 500)){
alert('API request rate limit reached, please try again later.')
} else if (request.status >= 200 && request.status < 400) {
const cardContainer = document.getElementById("Cards-Container2")
data.forEach(events => {
const style = document.getElementById('samplestyle2')
const card = style.cloneNode(true)
card.setAttribute('id', '');
const eventid = card.getElementsByClassName('main-text-id')[0]
eventid.textContent = events.id
const eventsection = card.getElementsByClassName('main-text-section')[0]
eventsection.textContent = events.section
const eventrow = card.getElementsByClassName('main-text-rows')[0]
eventrow.textContent = events.row

const eventqty = card.getElementsByClassName('main-text-qty')[0]
eventqty.textContent = events.quantity

const eventprice = card.getElementsByClassName('main-text-priced')[0]
eventprice.textContent = '$' + events.listPrice

const eventcst = card.getElementsByClassName('main-text-cst')[0]
eventcst.textContent = '$' + events.cost

const eventnotes = card.getElementsByClassName('main-text-notes')[0]
eventnotes.textContent = events.notes

var startDate = moment(events.lastPriceUpdate.slice(0,10), "YYYY/DD/MM");

var currenDate = moment(new Date()).format("YYYY-DD-MM");
var endDate = moment(currenDate, "YYYY-DD-MM");
var result = endDate.diff(startDate, 'days');

    
const lastupdated = card.getElementsByClassName('main-text-updated')[0]


cardContainer.appendChild(card);
})}}
request.send();
setTimeout(() => {
{
let now = new Date()
let date1 = moment(now).format('YYYY/MM/DD')
$(function() {
$('.event-box').sort(function(a, b) {
if (date1 > $(b).attr('date')) {return 1;}
else {return -1;}
}).appendTo('#Cards-Container');
});
}
}
}, 2000);
});
  

cardContainer.appendChild(card);
})}}
request.send();
})
{
$('#shub').click(function () {
let url = document.querySelector('#shub').getAttribute('url');
if(url !== 'null') {
window.open(url, '_blank').focus();
$('#shub').css('cursor', 'pointer');
} else if(url === 'null') {
$('#shub').css('cursor', 'default');
}
})
var intervalId = window.setInterval(function(){
let urls = document.querySelector('#shub').getAttribute('url');
if(urls !== 'null') {
$('#stubhubidno').hide()
$('#shub').css('cursor', 'pointer');
} else if(urls === 'null') {
$('#stubhubidno').show()
$('#shub').css('cursor', 'default');
}
}, 100);
}

{
$('#vseats').click(function () {
let url = document.querySelector('#vseats').getAttribute('url');
if(url !== 'null') {
window.open(url, '_blank').focus();
$('#vseats').css('cursor', 'pointer');
} else if(url === 'null') {
$('#vseats').css('cursor', 'default');
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

{
var intervalId = window.setInterval(function(){
let boxes = document.querySelectorAll('.event-box-2')
for (let i = 0; i<boxes.length;i++) {
if(boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle3') {
boxes[i].remove()  
}}
}, 100);
}

$('#fetchbutton').click(function () {
let stid = document.querySelector('#selectedevent').getAttribute('stubhub-id');
if(stid !== 'null') {
{
let eventid = document.querySelector('#selectedevent').getAttribute('stubhub-id');
$('.event-box-2').hide()
$('#samplestyle3').show()
let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/seatdata_0?eventid=');
let request = new XMLHttpRequest();
let url = xanoUrl.toString() + eventid
request.open('GET', url, true)
request.onload = function() {
let data = JSON.parse(this.response)
if((request.status === 429) || (request.status === 500)){
alert('API request rate limit reached, please try again later.')
} else if (request.status >= 200 && request.status < 400) {
const cardContainer = document.getElementById("Cards-Container3")
data.forEach(events => {
const style = document.getElementById('samplestyle3')
const card = style.cloneNode(true)
card.setAttribute('id', '');
const eventsection = card.getElementsByClassName('main-text-section3')[0]
eventsection.textContent = events.section
if(eventsection.textContent.length>15) {
eventsection.textContent = events.section.slice(0, 15)+'...'
}
const eventrow = card.getElementsByClassName('main-text-row3')[0]
eventrow.textContent = events.row
const eventqty = card.getElementsByClassName('main-text-qty3')[0]
eventqty.textContent = events.quantity
const eventprice = card.getElementsByClassName('main-text-price3')[0]
eventprice.textContent = '$' + events.price
const eventdate = card.getElementsByClassName('main-text-date3')[0]
eventdate.textContent = moment.unix(events.timestamp).format("MM/DD/YYYY hh:mm");
cardContainer.appendChild(card);
})}}
request.send();
}}})
