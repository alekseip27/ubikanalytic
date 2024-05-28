$("#purchasequantity").attr({"min" : 0});
{
    let intervalIds;
    step1 = false
    step2 = false
    step3 = false
    emailchecked = false

    function retryClickingSearchBar() {
        if (token.length === 40) {
        clearInterval(intervalIds);
var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event?id=')[1];
document.querySelector('#evids').value = eventid;
document.querySelector('#queueid').value = eventid;
var request = new XMLHttpRequest()
let xanoUrl = new URL("https://ubik.wiki/api/buying-queue/" + encodeURIComponent(eventid) + "/")

console.log(xanoUrl.toString())
request.open('GET', xanoUrl.toString(), true)
request.setRequestHeader("Content-type", "application/json; charset=utf-8");
request.setRequestHeader('Authorization', `Bearer ${token}`);

request.onload = function() {
    const eventdata = JSON.parse(this.response)

if (request.status >= 200 && request.status < 400) {
const itemContainer = document.getElementById("Item-Container")
const item = document.getElementById('samplestyle')
    
thiseventid = eventdata.event_id

purchaseaccounts = eventdata.purchase_account

emailsused = eventdata.used_emails
emailsarray = []


    
encodedthiseventid = encodeURIComponent(eventdata.event_id)

    
document.querySelector('#seid').value = encodedthiseventid


function makeRequest(url, successCallback, errorCallback, maxRetries = 3, retryDelay = 1000) {
  let retries = 0;

  function sendRequest() {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.onload = function () {
      if (request.status === 200) {
        successCallback(JSON.parse(request.response));
      } else {
        retries++;
        if (retries < maxRetries) {
          console.log(`Request failed. Retrying in ${retryDelay / 1000} seconds...`);
          setTimeout(sendRequest, retryDelay);
        } else {
          errorCallback(`Request failed after ${maxRetries} retries.`);
        }
      }
    };

    request.onerror = function () {
      retries++;
      if (retries < maxRetries) {
        console.log(`Request failed. Retrying in ${retryDelay / 1000} seconds...`);
        setTimeout(sendRequest, retryDelay);
      } else {
        errorCallback(`Request failed after ${maxRetries} retries.`);
      }
    };

    request.send();
  }

  sendRequest();
}

// Example usage for the first request
const eventVenueUrl = `https://ubik.wiki/api/event-venue/?site_event_id__iexact=${encodedthiseventid}`;
makeRequest(
  eventVenueUrl,
  function (data) {
    if (data.count === 1) {
      let pam = data.results[0].purchased_amount;
      let evname = data.results[0].event_name;
      let vename = data.results[0].venue_name;
      let evdate = data.results[0].date;
      let evtime = data.results[0].time;
      let evurl = data.results[0].event_url
    document.querySelector('#purchasetotal').textContent = parseInt(pam || '0', 10);
        
    document.querySelector('#evname').value = evname
    document.querySelector('#evdate').value = evdate
    document.querySelector('#evurl').value = evurl
    document.querySelector('#evtime').value = evtime
    document.querySelector('#vename').value = vename
        
    }
  },
  function (error) {
    console.error(`Error: ${error}`);
  }
);


    
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
document.querySelector('#purchasesource').textContent = eventdata.scraper_name
document.querySelector('#eventid').textContent = eventdata.event_id
document.querySelector('#purchasealltime').textContent = eventdata.purchase_total
document.querySelector('#presalecode').textContent = eventdata.presale_code
document.querySelector('#notes').textContent = eventdata.purchase_notes

  
document.querySelector('#purchasefrequency').textContent = eventdata.purchase_frequency
document.querySelector('#purchaseurgency').textContent = eventdata.buying_urgency

document.querySelector('#purchaserequest').textContent = eventdata.added_timestamp
category = eventdata.category
  
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
}
}}

request.send()

}

intervalIds = setInterval(retryClickingSearchBar, 1000);

}

function emailpart1() {
  let emailused = document.getElementById('purchaseaccounts').value;
  const emailurl = 'https://ubik.wiki/api/buyer-emails/?email__iexact=' + emailused;
  let http = new XMLHttpRequest();

  http.open("GET", emailurl, true);
  http.setRequestHeader("Content-type", "application/json; charset=utf-8");
  http.setRequestHeader('Authorization', `Bearer ${token}`);

  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      if (http.status == 200) {
        let data = JSON.parse(http.responseText);
        emailid = data.results[0].id;
        openpurchases = data.results[0].open_purchases;
        email1 = true;
        // Call emailpart2() after emailpart1() has run
        emailpart2();
      }
    }
  };

  http.send();
}

function emailpart2() {
  let bought = Number(document.querySelector('#amountbought1').textContent);
  let cpr = Number(document.querySelector('#purchasequantity').value);
  let combined = bought + cpr;
  let limit = Number(document.querySelector('#amountbought2').textContent);

    const emailurl2 = 'https://ubik.wiki/api/update/buyer-emails/';

    if (openpurchases>0) {
      openpurchases++;

      var params = {
        "id": emailid,
        "open_purchases": openpurchases
      };

      
    } else {

      var params = {
        "id": emailid,
        "open_purchases": 1
      };

      
    }
      let http = new XMLHttpRequest();

      http.open("PUT", emailurl2, true);
      http.setRequestHeader("Content-type", "application/json; charset=utf-8");
      http.setRequestHeader('Authorization', `Bearer ${token}`);

      http.onreadystatechange = function() {
        if (http.readyState == 4) {
          if (http.status == 200) {
            emailchecked = true;
          }
        }
      };

      http.send(JSON.stringify(params));
    

}








function part1(){

// 1. Update Buying Queue
let bought = Number(document.querySelector('#amountbought1').textContent)
let cpr = Number(document.querySelector('#purchasequantity').value)
let combined = bought+cpr
let limit = Number(document.querySelector('#amountbought2').textContent)
let purchacc = document.querySelector('#purchaseaccounts').value
let purchmanual = document.querySelector('#purchaseaccount').value  
var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event?id=')[1]
var http = new XMLHttpRequest();
var urll = "https://ubik.wiki/api/update/buying-queue/"

var params = {
  "id": eventid,
  "purchased_amount": combined
}

if (combined >= limit) {
    params["completed"] = 'TRUE'; 
}

if (!emailsarray.find(email => email === purchacc) && purchacc.value !== manual) {
  emailsarray.push(purchacc);
} else if (!emailsarray.find(email => email === purchmanual) && purchacc.value === 'manual'){
emailsarray.push(purchmanual);
}
 

http.open("PUT", urll, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.setRequestHeader('Authorization', `Bearer ${token}`);

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
  let pthistime = Number(document.querySelector('#purchasequantity').value)
  let pcombined = palltime + pthistime
  var http = new XMLHttpRequest();
  var urll = "https://ubik.wiki/api/update/primary-events/"
  
  var params = {
  "site_event_id": thiseventid,
  "purchased_amount": pcombined
  }    
  http.open("PUT", urll, true);
  http.setRequestHeader("Content-type", "application/json; charset=utf-8");
  http.setRequestHeader('Authorization', `Bearer ${token}`);

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
    let pa = document.querySelector("#purchaseaccounts").value.slice(0,1).toUpperCase();
    let pm = document.querySelector('#purchaseaccounts').value
    let pc = document.querySelector('#purchaseconfirmation').value
    let purchasedby = document.querySelector('#username').textContent
    
  let palltime = Number(document.querySelector('#purchasetotal').textContent)
  let pthistime = Number(document.querySelector('#purchasequantity').value)
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
    
    
    var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event?id=')[1]
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

    const purchaseAccValue = document.getElementById('purchaseaccount').value;
    const purchaseAccsValue = document.getElementById('purchaseaccounts').value;
    
    if (purchaseAccValue.trim() !== "") {
      param.purchase_account = purchaseAccValue;
    } else if (purchaseAccsValue.trim() !== "") {
      param.purchase_account = purchaseAccsValue;
    }

    
    fetch(endpointUrl, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
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
}



document.querySelector('#buybtn').addEventListener("click", () => {
$('#buybtn').css({pointerEvents: "none"})
part1()
part2()
part3()
emailpart1()

})

const checkStepsInterval = setInterval(() => {
  if (step1 && step2 && step3 && emailchecked) {
    clearInterval(checkStepsInterval);
    setTimeout(() => {
      window.location.href = "/buy-queue";
    }, 2000);
  }
}, 1000);

function sortoptions() {
  const select = document.getElementById('purchaseaccounts');
  if (!select) {
    console.error('Select element not found');
    return;
  }

  const optionsArray = Array.from(select.options);

  optionsArray.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));

  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }

  optionsArray.forEach(option => {
    select.appendChild(option);
  });
}


function getaccounts(account,category) {

  let baseUrl = `https://ubik.wiki/api/buyer-emails/?one1ticket_add__iexact=true&email_suspended__iexact=false&retired__iexact=false&tm_added__iexact=true&one1ticket_verify__iexact=true&second_forward_verify__iexact=true&retired__iexact=false&email_suspended__iexact=false&account__istartswith=${account}`

  let params = [];
  
  if (category !== '') {
      params.push(`&category__iexact=${category}`)
  }
 
  params.push('&limit=1000'); 
   
  let url = baseUrl +  params.join('&')
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader("Content-type", "application/json; charset=utf-8");
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.onload = function() {
    let data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      const selectDropdown = document.getElementById("purchaseaccounts");

      const emails = data.results.map(event => event.email).sort();

      emails.forEach(email => {
          if (!emailsarray.find(email => email === email)) {
        const option = document.createElement("option");
        option.value = email; 
        option.textContent = email;
        selectDropdown.appendChild(option);
      }});
    }

  }; 
  request.send();
}

let intervalIdtwo;
let intervalthree;

function retryaccounts() {
    const letters = purchaseaccounts.split(',');

    if (token.length === 40) {
        letters.forEach(letter => {
            getaccounts(letter.trim(), category);
        });
        clearInterval(intervalIdtwo);
    } else if (letters.length === 1) {
        getaccounts(letters[0], category);
        clearInterval(intervalIdtwo);
    }
}



intervalIdtwo = setInterval(retryaccounts, 1000);
// intervalthree = setInterval(sortoptions, 1000);




const selectDropdown = document.getElementById("purchaseaccounts");
const purchaseAcc = document.getElementById("purchaseaccount");


const manualOption = document.createElement("option");
manualOption.value = "manual";
manualOption.textContent = "Manual";
selectDropdown.appendChild(manualOption);

// Event listener to handle the "manual" option
selectDropdown.addEventListener("change", function() {
  if (this.value === "manual") {
    purchaseAcc.style.display = "block";
    selectDropdown.style.display = "none";
    document.querySelector('.returnbtn').style.display = 'flex'
  } else {
    purchaseAcc.style.display = "none";
    selectDropdown.style.display = "block";
    document.querySelector('.returnbtn').style.display = 'none'
      
  }
});
