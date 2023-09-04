$("#purchasequantity").attr({"min" : 0});
{
var pkid = document.location.href.split('https://www.ubikanalytic.com/buy-event?id=')[1]
 
var request = new XMLHttpRequest()
let xanoUrl = new URL('https://shibuy.co:8443/getevent?eventid=' + pkid);

console.log(xanoUrl.toString())
request.open('GET', xanoUrl.toString(), true)

request.onload = function() {
var data = JSON.parse(this.response)
if (request.status >= 200 && request.status < 400) {
const itemContainer = document.getElementById("Item-Container")
const item = document.getElementById('samplestyle')
  
var tdate = data[0].Other_Master_Event_Date.slice(0, 10).replaceAll("-","/")
tdate = [tdate.slice(5), tdate.slice(0,4)].join('/');
document.querySelector('#date').textContent = tdate
document.querySelector('#event').textContent =  data[0].Other_Master_Event_Name
document.querySelector('#venue').textContent =  data[0].Venue_Master_Venue
document.querySelector('#time').textContent =  data[0].Other_Master_Event_Time
document.querySelector('#url').textContent =  data[0].Other_Master_Event_Url
document.querySelector('#purchasetotal').textContent =  data[0].Event_Other_Master_User_Purch_Amnt 
document.querySelector('#quantityper').textContent =  data[0].Event_Other_Master_User_Quant_Per
let purchasequantity = data[0].Event_Other_Master_Bought_Amnt
if(purchasequantity.length>0) { 
document.querySelector('#amountbought1').textContent = data[0].Event_Other_Master_Bought_Amnt }
else { document.querySelector('#amountbought1').textContent = "0" }
document.querySelector('#amountbought2').textContent =  data[0].Event_Other_Master_User_Purch_Amnt 
document.querySelector('#section').textContent =  data[0].Event_Other_Master_User_Section
document.querySelector('#purchasefreq').textContent =  data[0].Event_Other_Master_User_Purch_Frequency
document.querySelector('#purchaseacc').textContent = data[0].Event_Other_Master_User_Purch_Account
document.querySelector('#purchaseemail').value = data[0].Event_Other_Master_Purchase_Email
document.querySelector('#purchasesource').textContent = data[0].Event_Other_Master_Source_Formula
document.querySelector('#eventid').textContent = data[0].Other_Master_Site_Event_Id
document.querySelector('#purchasealltime').textContent = data[0].Purchased_Amount_Alltime
document.querySelector('#presalecode').textContent = data[0].Event_Other_Master_Presale_Code
document.querySelector('#notes').textContent = data[0].Event_Other_Master_Notes

  
document.querySelector('#purchasefrequency').textContent = data[0].Event_Other_Master_User_Buy_Urgency

document.querySelector('#purchaserequest').textContent = data[0].Other_Buy_Request_Date
  
let pt = document.querySelector('#purchasealltime').textContent
if(pt.length == 0) {
document.querySelector('#purchasealltime').textContent = '0'
}
    
let urgency = data[0].Event_Other_Master_User_Buy_Urgency
let buytimestamp = data[0].Other_Buy_Request_Date
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



document.querySelector('#buybtn').addEventListener("click", () => {
$('#buybtn').css({pointerEvents: "none"})
let bm = document.querySelector('#purchaseemail').value
let detailsmatch = !!document.querySelector('#detailsmatch').checked
let willcall = !!document.querySelector('#willcall').checked

let dmatch = 'false'
if(!!detailsmatch) {
let dmatch = 'true'
} else {
let dmatch = 'false'
}

let wcall = 'false'
if(!!willcall) {
let wcall = 'true'
} else {
let wcall = 'false'
}
 
let deliveryselected = document.querySelector('#deliveryselected').value

{
let bought = Number(document.querySelector('#amountbought1').textContent)
let cpr = Number(document.querySelector('#purchasequantity').value)
let combined = bought+cpr
let alltime = Number(document.querySelector('#purchasealltime').textContent)
let allt = alltime+cpr
let limit = Number(document.querySelector('#amountbought2').textContent)
var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event?id=')[1]
var http = new XMLHttpRequest();
const url = "https://shibuy.co:8443/update_event_second?" +
"eventid=" + encodeURIComponent(eventid) +
"&Purchased_Amount_Alltime="+ allt +
"&Details_Match=" + dmatch +
"&No_Will_Call="+ wcall +
"&Delivery_Method_Selected="+ deliveryselected
if(combined>=limit) {
urll = url + "&Event_Other_Master_Buy_Status=Completed"+ "&Bought_Amnt=0"
} else {
urll = url + "&Event_Other_Master_Buy_Status=Added" + "&Bought_Amnt=" + combined
}

http.open("PUT", urll, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.send();

let purchaseacc = document.querySelector('#purchaseemail').value
let maxamount = document.querySelector('#amountbought2').textContent
let eventname = document.querySelector('#event').textContent
let eventdate = document.querySelector('#date').textContent
let eventtime = document.querySelector('#time').textContent
let eventvenue = document.querySelector('#venue').textContent

let purchaseDate = moment().tz('America/New_York').format('MM/DD/YYYY, hh:mm A')
let purchaseRequest = document.querySelector('#purchaserequest').textContent;


const pfilled = moment().tz('America/New_York').format('MM/DD/YYYY HH:mm:ss')
const prequested = moment(document.querySelector('#purchaserequest').textContent, 'MM/DD/YYYY, h:mm').format('MM/DD/YYYY HH:mm:ss')

const now = moment(moment().tz('America/New_York').format('MM/DD/YYYY, h:mm:ss A'))
const then = moment(document.querySelector('#purchaserequest').textContent, 'MM/DD/YYYY, h:mm A')

let duration = moment.duration(now.diff(then));
let hours = Math.round(duration.asHours());
let minutes = duration.minutes();
let seconds = duration.seconds();

let pdifference = `${hours}:${minutes}:${seconds}`;



  
let pq = document.querySelector('#purchasequantity').value
let pa = document.querySelector("#purchaseemail").value.slice(0,1).toUpperCase();
let pc = document.querySelector('#purchaseconfirmation').value
let pem = document.querySelector('#purchaseemail').value
let purchasedby = document.querySelector('#username').textContent
let psrc = document.querySelector('#purchasesource').textContent
let cpur = Number(document.querySelector('#purchasequantity').value)
let purchrequest = document.querySelector('#purchaserequest').textContent

let altm = alltime + cpur


let purchurgency = document.querySelector('#purchasefrequency').textContent


var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event?id=')[1]
  
var http = new XMLHttpRequest();
var endpointUrl = "https://shibuy.co:8443/buy_event";


const newRowData = {
ID: encodeURIComponent(eventid),
Event_Name: eventname,
Event_Date: eventdate,
Event_Time: eventtime,
Event_Venue: eventvenue,
Purchase_Date: purchaseDate,
Purchase_Source: psrc,
Purchase_Quantity: pq,
Purchase_Quantity_Total: maxamount,
Purchase_Quantity_Alltime: altm,
Purchase_Account: pa,
Confirmation: pc,
Purchase_Email: pem,
Purchased_By: purchasedby,
Purchase_Requested: purchrequest,
Purchase_Urgency: purchurgency,
Purchase_Difference:pdifference,
p_filled:pfilled,
p_requested:prequested
};

  fetch(endpointUrl, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRowData)
    })
    .then(response => response.json())
    .then(data => {

document.querySelector('#loading').style.display = "flex";
document.querySelector('#Item-Container').style.display = "none";
setTimeout(() => {
window.location.href = "/buy-queue";
}, 2000);
     
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
}})