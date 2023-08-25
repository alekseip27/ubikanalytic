$("#purchasequantity").attr({"min" : 0});
{
var pkid = document.location.href.split('https://www.ubikanalytic.com/buy-manual?id=')[1]

var request = new XMLHttpRequest()
let xanoUrl = new URL('https://shibuy.co:8443/getevent?eventid=' + encodeURIComponent(pkid));
  
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
document.querySelector('#purchasesource').textContent = data[0].Event_Other_Master_Source_Formula

let purchasequantity = data[0].Event_Other_Master_Bought_Amnt
if(purchasequantity.length>0) { 
  

document.querySelector('#amountbought1').textContent = data[0].Event_Other_Master_Bought_Amnt }
else { document.querySelector('#amountbought1').textContent = "0" }
  
document.querySelector('#amountbought2').textContent =  data[0].Event_Other_Master_User_Purch_Amnt 
document.querySelector('#purchasefreq').textContent =  data[0].Event_Other_Master_User_Purch_Frequency
document.querySelector('#purchasealltime').textContent = data[0].Purchased_Amount_Alltime

  
 
let alltt = data[0].Purchased_Amount_Alltime
if(alltt.length>0) { 
document.querySelector('#purchasealltime').textContent = data[0].Purchased_Amount_Alltime
} else {
document.querySelector('#purchasealltime').textContent = "0"
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


let deliveryselected = document.querySelector('#deliveryselected').value

{

var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-manual?id=')[1]
let bght = Number(document.querySelector('#purchasealltime').textContent)
let cram = Number(document.querySelector('#purchasequantity').value)
let nallt = bght+cram

var http = new XMLHttpRequest();
const url = "https://shibuy.co:8443/update_event_second?" +
"eventid=" + encodeURIComponent(eventid) +
"&Purchased_Amount_Alltime="+ nallt +
"&Delivery_Method_Selected="+ deliveryselected
  
http.open("PUT", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.send();
}
   
let eventname = document.querySelector('#event').textContent
let eventdate = document.querySelector('#date').textContent
let eventtime = document.querySelector('#time').textContent
let eventvenue = document.querySelector('#venue').textContent

let purchasedate = moment().tz('America/New_York').format('MM/DD/YYYY, hh:mm A')

let pc = document.querySelector('#purchaseconfirmation').value
let pem = document.querySelector('#purchaseemail').value
let purchasedby = document.querySelector('#username').textContent

let bght = Number(document.querySelector('#purchasealltime').textContent)
let cram = Number(document.querySelector('#purchasequantity').value)
let nallt = bght+cram


var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-manual?id=')[1]
var http = new XMLHttpRequest();

var endpointUrl = "https://shibuy.co:8443/buy_event";


const newRowData = {
ID: encodeURIComponent(eventid),
Event_Name: eventname,
Event_Date: eventdate,
Event_Time: eventtime,
Event_Venue: eventvenue,
Purchase_Date: purchasedate,
Purchase_Source: "manual",
Purchase_Quantity: cram,
Purchase_Quantity_Alltime: nallt,
Purchase_Account: "manual",
Confirmation: pc,
Purchase_Email: pem,
Purchased_By: purchasedby,
Purchase_Requested: "manual",
Purchase_Urgency: "manual",
Purchase_Difference:"manual",
p_filled:pfilled
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
})
