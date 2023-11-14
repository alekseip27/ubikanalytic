$("#purchasequantity").attr({"min" : 0});
{
    var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event-copy?id=')[1];
var request = new XMLHttpRequest()
let xanoUrl = new URL("https://ubik.wiki/api/buying-queue/" + encodeURIComponent(eventid) + "/")

console.log(xanoUrl.toString())
request.open('GET', xanoUrl.toString(), true)

request.onload = function() {
    const eventdata = JSON.parse(this.response)

if (request.status >= 200 && request.status < 400) {
const itemContainer = document.getElementById("Item-Container")
const item = document.getElementById('samplestyle')

document.querySelector('#date').textContent = eventdata.event_date
document.querySelector('#event').textContent =  eventdata.event_name
document.querySelector('#venue').textContent =  eventdata.event_venue
document.querySelector('#time').textContent =  eventdata.event_time
document.querySelector('#url').textContent =  eventdata.event_url
document.querySelector('#quantityper').textContent =  eventdata.quantity_per

purchasequantity = eventdata.purchased_amount

if(purchasequantity>0) { 
document.querySelector('#amountbought1').textContent = eventdata.purchased_amount }
else { 
document.querySelector('#amountbought1').textContent = "0"
}

document.querySelector('#amountbought2').textContent =  eventdata.purchase_total 
document.querySelector('#section').textContent =  eventdata.section
document.querySelector('#purchasefreq').textContent =  eventdata.purchase_frequency
document.querySelector('#purchaseacc').textContent = eventdata.purchase_account
document.querySelector('#purchaseemail').value = eventdata.purchase_account
document.querySelector('#purchasesource').textContent = eventdata.event_source
document.querySelector('#eventid').textContent = eventdata.event_id
document.querySelector('#purchasealltime').textContent = eventdata.purchase_total
document.querySelector('#presalecode').textContent = eventdata.presale_code
document.querySelector('#notes').textContent = eventdata.purchase_notes

  
document.querySelector('#purchasefrequency').textContent = eventdata.purchase_frequency

document.querySelector('#purchaserequest').textContent = eventdata.added_timestamp
  
let pt = document.querySelector('#purchasealltime').textContent
if(pt.length == 0) {
document.querySelector('#purchasealltime').textContent = '0'
}

let urgency = eventdata.buying_urgency
let buytimestamp = eventdata.added_timestamp
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
let evs = document.querySelector('#buytimestamp') 

switch (urgency) {
case '15 min': {
let purchasedate = moment(date).add(15, 'minutes').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '30 min': {
let purchasedate = moment(date).add(30, 'minutes').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '45 min': {
let purchasedate = moment(date).add(45, 'minutes').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '1 hr': {
let purchasedate = moment(date).add(1, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '2 hrs': {
let purchasedate = moment(date).add(2, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '3 hrs': {
let purchasedate = moment(date).add(3, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '4 hrs': {
let purchasedate = moment(date).add(4, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '6 hrs': {
let purchasedate = moment(date).add(6, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '7 hrs': {
let purchasedate = moment(date).add(7, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '8 hrs': {
let purchasedate = moment(date).add(8, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '9 hrs': {
let purchasedate = moment(date).add(9, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '10 hrs': {
let purchasedate = moment(date).add(10, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '11 hrs': {
let purchasedate = moment(date).add(11, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '12 hrs': {
let purchasedate = moment(date).add(12, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '14 hrs': {
let purchasedate = moment(date).add(14, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '16 hrs': {
let purchasedate = moment(date).add(16, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '18 hrs': {
let purchasedate = moment(date).add(18, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '20 hrs': {
let purchasedate = moment(date).add(20, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '1 day': {
let purchasedate = moment(date).add(24, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '2 days': {
let purchasedate = moment(date).add(48, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
case '4 days': {
let purchasedate = moment(date).add(96, 'hours').format('MM/DD/YYYY HH:mm:ss')
var ms = moment(purchasedate,"MM/DD/YYYY HH:mm:ss").diff(moment(then,"MM/DD/YYYY HH:mm:ss"));
var d = moment.duration(ms);
var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
evs.textContent = s
if(then>purchasedate) {
evs.textContent = 'ASAP'
evs.style.color = "red";
}
break; }
}


itemContainer.appendChild(item);

function copyToClipboard(text) {
var $temp = $("<input>");
$("body").append($temp);
$temp.val(text).select();
document.execCommand("copy");
$temp.remove(); 
}
$('#url').click(function () { copyToClipboard($('#url').text()); });

document.querySelector('#loading').style.display = "none";
document.querySelector('#Item-Container').style.display = "flex";
} else {
console.log('error')
}}
request.send()
}

// Done until here
