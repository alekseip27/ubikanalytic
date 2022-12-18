$("#purchasequantity").attr({"min" : 0});
{
var pkid = document.location.href.split('https://www.ubikanalytic.com/buy-manual?id=')[1]

var request = new XMLHttpRequest()
let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/getevent?search-key=' + pkid);

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
let purchasequantity = data[0].Event_Other_Master_Bought_Amnt
if(purchasequantity.length>0) { 
  

document.querySelector('#amountbought1').textContent = data[0].Event_Other_Master_Bought_Amnt }
else { document.querySelector('#amountbought1').textContent = "0" }
  
document.querySelector('#amountbought2').textContent =  data[0].Event_Other_Master_User_Purch_Amnt 
document.querySelector('#purchasefreq').textContent =  data[0].Event_Other_Master_User_Purch_Frequency
document.querySelector('#purchasealltime').textContent = data[0].Purchased_Amount_Alltime
  





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
}{
emailstats = async function() {
let bm = document.querySelector('#purchaseemail').value
let src = document.querySelector('#purchasesource').textContent
let myFS = firebase.firestore()
let docSnap = await myFS.doc("stats/"+ bm).get();
let data = docSnap.data()
let i = data[src]
if(Number(data[src]) == 0 || isNaN(i)) {
myFS.doc("stats/" + bm).set({[src] : 1}, { merge: true })
} else {
myFS.doc("stats/" + bm).set({[src] : i+1}, { merge: true })
}}

accountstats = async function() {
let acm = document.querySelector("#purchaseemail").value.slice(0,1).toUpperCase();

 

let src = document.querySelector('#purchasesource').textContent
let myFS = firebase.firestore()
let docSnap = await myFS.doc("accountstats/"+ acm).get();
let data = docSnap.data()
let i = data[src]
if(Number(data[src]) == 0 || isNaN(i)) {
myFS.doc("accountstats/" + acm).set({[src] : 1}, { merge: true })
} else {
myFS.doc("accountstats/" + acm).set({[src] : i+1}, { merge: true })
}}

document.querySelector('#buybtn').addEventListener("click", () => {
$('#buybtn').css({pointerEvents: "none"})
let bm = document.querySelector('#purchaseemail').value


let deliveryselected = document.querySelector('#deliveryselected').value

let acm = document.querySelector("#purchaseemail").value.slice(0,1).toUpperCase();
let myFS = firebase.firestore()
myFS.doc("stats/" + bm).set({}, {merge:true})
myFS.doc("accountstats/" + acm).set({}, {merge:true})
setTimeout(() => {
emailstats()
accountstats()
}, 2000);
{
let bought = Number(document.querySelector('#amountbought1').textContent)
let cpr = Number(document.querySelector('#purchasequantity').value)
let combined = bought+cpr
let alltime = Number(document.querySelector('#purchasealltime').textContent)

let allt = bought+cpr+alltime

let limit = Number(document.querySelector('#amountbought2').textContent)
var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-manual?id=')[1]


let bought2 = Number(document.querySelector('#amountbought1').textContent)
let currentam2 = Number(document.querySelector('#purchasequantity').value)
let newalltime2 = bought+currentam2


let num1 = Number(document.querySelector('#purchasealltime').value)
let num2 = Number(document.querySelector('#purchasequantity').value)
let alltogether = num1+num2


var http = new XMLHttpRequest();
var url = "https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/update_event_second_manual";
if(combined>=limit) {
var params = JSON.stringify(
{
"search-key": eventid,
"Bought_Amnt": num2,
"Purchased_Amount_Alltime": alltogether,

"Delivery_Method_Selected": deliveryselected
})
http.open("PUT", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.send(params);
} else {
var params = JSON.stringify(
{
"search-key": eventid,
"Bought_Amnt": combined,
"Event_Other_Master_Buy_Status": "Completed",
"Delivery_Method_Selected": deliveryselected
})
http.open("PUT", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.send(params);
}}
  
  
let purchaseacc = document.querySelector('#purchaseemail').value
let maxamount = document.querySelector('#amountbought2').textContent
let eventname = document.querySelector('#event').textContent
let eventdate = document.querySelector('#date').textContent
let eventtime = document.querySelector('#time').textContent
let eventvenue = document.querySelector('#venue').textContent

const date = new Date();
let purchasedate = 
date.toLocaleString('en-US', {
timeZone: 'America/New_York',
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
})

let date2 = 
date.toLocaleString('en-GB', {
timeZone: 'America/New_York',
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
second: '2-digit'
})
let purchrequest = document.querySelector('#purchaserequest').textContent
let then = moment(purchrequest,"MM/DD/YYYY HH:mm:ss")
let now = moment(date2,"DD/MM/YYYY HH:mm:ss")

var mss = moment(now).diff(moment(then));
var dd = moment.duration(mss);
  
let pq = document.querySelector('#purchasequantity').value
let pa = document.querySelector("#purchaseemail").value.slice(0,1).toUpperCase();
let pc = document.querySelector('#purchaseconfirmation').value
let pem = document.querySelector('#purchaseemail').value
let purchasedby = document.querySelector('#username').textContent
let psrc = document.querySelector('#purchasesource').textContent

let bought = Number(document.querySelector('#amountbought1').textContent)
let currentam = Number(document.querySelector('#purchasequantity').value)
let newalltime = bought+currentam

let purchurgency = document.querySelector('#purchasefrequency').textContent

var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-manual?id=')[1]
var http = new XMLHttpRequest();
var url = "https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/buy_event_manual";
var params = JSON.stringify(

{
"ID": eventid,
"Event_Name": eventname,
"Event_Date": eventdate,
"Event_Time": eventtime,
"Event_Venue": eventvenue,
"Purchase_Date": purchasedate,
"Purchase_Quantity": currentam,
"Purchase_Quantity_Alltime": newalltime,
"Confirmation": pc,
"Purchase_Email": pem,
"Purchased_By": purchasedby
})
http.open("POST", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.onreadystatechange = function() {

if(http.readyState == 4 && http.status == 200) {
document.querySelector('#loading').style.display = "flex";
document.querySelector('#Item-Container').style.display = "none";
setTimeout(() => {
window.location.href = "/events";
}, 2000);
}
}
http.send(params);
})
}


setTimeout(() => {
if(!!$('#purchaseacc').text() == false) {
$('#purchaseacc').text('noaccount')
$('#purchaseacc').css('opacity', '0');
}
}, 1000);
