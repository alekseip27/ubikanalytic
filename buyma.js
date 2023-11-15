step1 = false
step2 = false

$("#purchasequantity").attr({"min" : 0});
{
event_id = document.location.href.split('https://www.ubikanalytic.com/buy-manual-copy?id=')[1];
var request = new XMLHttpRequest()
let xanoUrl = new URL("https://ubik.wiki/api/event-venue/?site_event_id__iexact="+event_id)
  
request.open('GET', xanoUrl.toString(), true)

request.onload = function() {
var event = JSON.parse(this.response)
const events = event.results[0]
if (request.status >= 200 && request.status < 400) {
const itemContainer = document.getElementById("Item-Container")
const item = document.getElementById('samplestyle')

console.log(events)
document.querySelector('#date').textContent = events.date
document.querySelector('#event').textContent =  events.event_name
document.querySelector('#venue').textContent =  events.venue_name
document.querySelector('#time').textContent =  events.time
document.querySelector('#url').textContent =  events.event_url
document.querySelector('#purchasesource').textContent = events.source_site

let pam = events.purchased_amount
if(pam){
document.querySelector('#purchasetotal').textContent = parseInt(pam,10)
} else {
document.querySelector('#purchasetotal').textContent = '0'
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

// Functions

function part1(){
    // 2. Update Event
      let palltime = Number(document.querySelector('#purchasetotal').textContent)
      let pthistime = Number(document.querySelector('#purchasequantity').value)
      let pcombined = palltime + pthistime
      var http = new XMLHttpRequest();
      var urll = "https://ubik.wiki/api/update/primary-events/" + encodeURIComponent(event_id) + "/"
      
      var params = {
      "site_event_id": event_id,
      "purchased_amount": pcombined
      }    
      http.open("PUT", urll, true);
      http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    
    http.onreadystatechange = function() { 
    if (http.readyState == 4) {
    if (http.status == 200) { 
    var response = JSON.parse(http.responseText);
    step1 = true
    } else {
    
    }
      }
    };
      
    http.send(JSON.stringify(params));
      
    
    }
    
    function part2(){
    
        let eventname = document.querySelector('#event').textContent
        let eventdate = document.querySelector('#date').textContent
        let eventvenue = document.querySelector('#venue').textContent
        let eventsource = document.querySelector('#purchasesource').textContent
        
        let pq = document.querySelector('#purchasequantity').value
        let pm = document.querySelector('#purchaseemail').value
        let pc = document.querySelector('#purchaseconfirmation').value
        let purchasedby = document.querySelector('#username').textContent
        
        let palltime = Number(document.querySelector('#purchasetotal').textContent)
        let pthistime = Number(document.querySelector('#purchasequantity').value)
        let pcombined = palltime + pthistime
        
        let eventtime = document.querySelector('#time').textContent
        
        const pfilled = moment().tz('America/New_York').format('MM/DD/YYYY HH:mm:ss')
        
          const prefix = "Oneticket_";
          const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          const idLength = 8;
          let randomId = prefix;
        
          for (let i = 0; i < idLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomId += characters.charAt(randomIndex);
          }
        
        
        var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-manual-copy?id=')[1]
        var http = new XMLHttpRequest();
        var endpointUrl = "https://ubik.wiki/api/create/order-history/"
        var param = {
        "event_name":eventname,
        "event_date":eventdate,
        "event_venue":eventvenue,
        "event_time":eventtime,
        "purchase_source":eventsource,
        "purchase_quantity":pq,
        "purchase_email":pm,
        "confirmation":pc,
        "purchased_by":purchasedby,
        "purchase_requested":"manual",
        "purchase_account":"manual",
        "purchase_urgency":"manual",
        "purchase_difference":"manual",
        "p_requested":"manual",
        "p_filled":pfilled,
        "purchase_date":pfilled,
        "one_ticket_id":randomId
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
        
        step2 = true
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
    
// Functions end


document.querySelector('#buybtn').addEventListener("click", () => {
$('#buybtn').css({pointerEvents: "none"})
part1()
part2()

})


const checkStepsInterval = setInterval(() => {
    if (step1 && step2) {
      clearInterval(checkStepsInterval);
      setTimeout(() => {
        window.location.href = "/events-new";
      }, 2000);
    }
  }, 1000);
