$("#purchasequantity").attr({"min" : 0});
{

step1 = false
step2 = false
step3 = false
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
    
thiseventid = eventdata.event_id
    
document.querySelector('#seid').value = thiseventid



var requestam = new XMLHttpRequest()
let xanoUrlam = new URL("https://ubik.wiki/api/event-venue/?site_event_id__iexact="+thiseventid)

requestam.open('GET', xanoUrlam.toString(), true)

requestam.onload = function() {
let data = JSON.parse(requestam.response) 

if (data.count === 1) {

let data = JSON.parse(requestam.response) 
let pam = data.results[0].purchased_amount
    
if(pam){
document.querySelector('#purchasetotal').textContent = parseInt(pam,10)
} else {
document.querySelector('#purchasetotal').textContent = '0'
}}}

requestam.send()


{
var requestam = new XMLHttpRequest()
let xanoUrlam = new URL("https://ubik.wiki/api/buying-queue/?event_id__iexact="+thiseventid)

requestam.open('GET', xanoUrlam.toString(), true)

requestam.onload = function() {
let data = JSON.parse(requestam.response) 

if (data.count === 1) {

let data = JSON.parse(requestam.response) 
let evid = data.results[0].id
    
document.querySelector('#evids').value = evid

}}

requestam.send()        
}


    
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
document.querySelector('#purchasesource').textContent = eventdata.event_source
document.querySelector('#eventid').textContent = eventdata.event_id
document.querySelector('#purchasealltime').textContent = eventdata.purchase_total
document.querySelector('#presalecode').textContent = eventdata.presale_code
document.querySelector('#notes').textContent = eventdata.purchase_notes

  
document.querySelector('#purchasefrequency').textContent = eventdata.purchase_frequency
document.querySelector('#purchaseurgency').textContent = eventdata.buying_urgency

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

function part1(){

// 1. Update Buying Queue
let bought = Number(document.querySelector('#amountbought1').textContent)
let cpr = Number(document.querySelector('#purchasequantity').value)
let combined = bought+cpr
let limit = Number(document.querySelector('#amountbought2').textContent)
var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event-copy?id=')[1]
var http = new XMLHttpRequest();
var urll = "https://ubik.wiki/api/update/buying-queue/" + encodeURIComponent(eventid) + "/"

var params = {
  "id": eventid,
  "purchased_amount": combined
}

if (combined >= limit) {
    params["completed"] = 'TRUE'; 
}

http.open("PUT", urll, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");

// Add response and error handling
http.onreadystatechange = function() { 
if (http.readyState == 4) {
if (http.status == 200) { 
step1 = true
}}}
http.send(JSON.stringify(params));
}

function part2(){
// 2. Update Event
  let palltime = Number(document.querySelector('#purchasetotal').textContent)
  let pthistime = Number(document.querySelector('#amountbought2').textContent)
  let pcombined = palltime + pthistime
  var http = new XMLHttpRequest();
  var urll = "https://ubik.wiki/api/update/primary-events/" + encodeURIComponent(thiseventid) + "/"
  
  var params = {
  "site_event_id": thiseventid,
  "purchased_amount": pcombined
  }    
  http.open("PUT", urll, true);
  http.setRequestHeader("Content-type", "application/json; charset=utf-8");

http.onreadystatechange = function() { 
if (http.readyState == 4) {
if (http.status == 200) { 
var response = JSON.parse(http.responseText);
step2 = true
} else {

}
  }
};
  
http.send(JSON.stringify(params));
  

}

function part3(){

    let eventname = document.querySelector('#event').textContent
    let eventdate = document.querySelector('#date').textContent
    let eventvenue = document.querySelector('#venue').textContent
    let eventsource = document.querySelector('#purchasesource').textContent
    
    let pq = document.querySelector('#purchasequantity').value
    let pmax = document.querySelector('#amountbought2').textContent
    let pa = document.querySelector("#purchaseemail").value.slice(0,1).toUpperCase();
    let pm = document.querySelector('#purchaseemail').value
    let pc = document.querySelector('#purchaseconfirmation').value
    let purchasedby = document.querySelector('#username').textContent
    
    let palltime = Number(document.querySelector('#purchasetotal').textContent)
    let pthistime = Number(document.querySelector('#amountbought2').textContent)
    let pcombined = palltime + pthistime
    
    let eventtime = document.querySelector('#time').textContent
    
    let purchaseDate = moment().tz('America/New_York').format('MM/DD/YYYY, hh:mm A')
    
    const pfilled = moment().tz('America/New_York').format('MM/DD/YYYY HH:mm:ss')
    document.querySelector('#purchd').value = pfilled
    
    const prequested = moment(document.querySelector('#purchaserequest').textContent, 'MM/DD/YYYY, h:mm').format('MM/DD/YYYY HH:mm:ss')
    const now = moment(moment().tz('America/New_York').format('MM/DD/YYYY, h:mm:ss A'))
    const then = moment(document.querySelector('#purchaserequest').textContent, 'MM/DD/YYYY, h:mm A')
    
    let duration = moment.duration(now.diff(then));
    let hours = Math.round(duration.asHours());
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    
    let pdifference = `${hours}:${minutes}:${seconds}`;
    let purchrequest = document.querySelector('#purchaserequest').textContent
    
    let purchfreq = document.querySelector('#purchasefreq').textContent
    let purchurgency = document.querySelector('#purchaseurgency').textContent
    
    let dmatch = document.querySelector('#detailsmatch').checked
    let selectwc = document.querySelector('#willcall').checked
    
      const prefix = "Oneticket_";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const idLength = 8;
      let randomId = prefix;
    
      for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
      }
    
    
    var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event-copy?id=')[1]
    var http = new XMLHttpRequest();
    var endpointUrl = "https://ubik.wiki/api/create/order-history/"
    
    var param = {
    "event_name":eventname,
    "event_date":eventdate,
    "event_venue":eventvenue,
    "event_time":eventtime,
    "purchase_source":eventsource,
    "purchase_quantity":pq,
    "purchase_quantity_total":pmax,
    "purchase_account":pa,
    "purchase_email":pm,
    "confirmation":pc,
    "purchased_by":purchasedby,
    "purchase_requested":purchrequest,
    "purchase_difference":pdifference,
    "p_filled":pfilled,
    "p_requested":prequested,
    "purchase_date":purchaseDate,
    "purchase_quantity_alltime":pcombined,
    "one_ticket_id":randomId,
    "details_match":dmatch,
    "did_not_select_wc":selectwc,
    "purchase_frequency":purchfreq,
    "purchase_urgency":purchurgency
    }
    
    fetch(endpointUrl, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
    })
    .then(response => response.json())
    .then(data => {
    
        
    step3 = true
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#Item-Container').style.display = "none";
    })
    .catch(error => {
    console.log(error);
    });
    
    setTimeout(() => {
    if(!!$('#purchaseacc').text() == false) {
    $('#purchaseacc').text('noaccount')
    $('#purchaseacc').css('opacity', '0');
    }
    }, 1000);
}



document.querySelector('#buybtn').addEventListener("click", () => {
$('#buybtn').css({pointerEvents: "none"})
part1()
part2()
part3()

})

const checkStepsInterval = setInterval(() => {
  if (step1 && step2 && step3) {
    clearInterval(checkStepsInterval);
    setTimeout(() => {
      window.location.href = "/buy-queue-copy";
    }, 2000);
  }
}, 1000);
