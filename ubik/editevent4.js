
function getevent(){
var pkid = document.location.href.split('https://www.ubikanalytic.com/edit-event?id=')[1];

var request = new XMLHttpRequest();
let xanoUrl = new URL('https://ubik.wiki/api/buying-queue/' + encodeURIComponent(pkid) + '/');

request.open('GET', xanoUrl.toString(), true);
request.setRequestHeader("Content-type", "application/json; charset=utf-8");
request.setRequestHeader('Authorization', `Bearer ${token}`);

request.onload = function() {
    var event = JSON.parse(this.response);
    let events = event
    if (request.status >= 200 && request.status < 400) {

        const itemContainer = document.getElementById("Item-Container");
        const item = document.getElementById('samplestyle');

        document.querySelector('#event').textContent = events.event_name;
        document.querySelector('#venue').textContent =  events.event_venue;
        document.querySelector('#source').textContent =  events.event_source;

        var tdate = events.event_date;
        document.querySelector('#date').textContent = tdate;

        document.querySelector('#time').textContent =  events.event_time;

        if(events.source_site == 'TM') {
            document.querySelector('#url2').textContent =  'http://142.93.115.105:8100/event/' + pkid +'/details/';
            document.querySelector('#url2box').style.display = "flex";
        }

        document.querySelector('#url').textContent =  events.event_url;

        document.querySelector('#purchasetotal').value =  events.purchase_total;

        document.querySelector('#quantityper').value =  events.quantity_per;

        document.querySelector('#section').value =  events.section;

        document.querySelector('#buyingurgency').value =  events.buying_urgency;

        document.querySelector('#creditaccount').value =  events.credit_account;

        document.querySelector('#presalecode').value =  events.presale_code;

        document.querySelector('#notes').value =  events.purchase_notes;

        itemContainer.appendChild(item);

        function copyToClipboard(text) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();
        }

        $('#urlx').click(function () { copyToClipboard($('#url').text()); });
        $('#url2').click(function () { copyToClipboard($('#url2').text()); });

        document.querySelector('#loading').style.display = "none";
        document.querySelector('#Item-Container').style.display = "flex";
    } else {
        console.log('error');
    }
};

request.send();
}

var eventid = document.location.href.split('https://www.ubikanalytic.com/edit-event?id=')[1];
var urltwo = "https://ubik.wiki/api/update/buying-queue/"

document.querySelector('#buybtn').addEventListener("click", () => {
    $('#buybtn').css({pointerEvents: "none"});

const nowInEastern = moment().tz("America/New_York");

const year = nowInEastern.year();
const month = nowInEastern.format('MM'); 
const day = nowInEastern.format('DD'); 
const hours24 = nowInEastern.hours();
const minutes = nowInEastern.format('mm'); 

const hours = hours24 % 12 || 12; 
const amPm = hours24 >= 12 ? 'PM' : 'AM';
const formattedHours = nowInEastern.format('hh'); 

 dategoal = `${month}/${day}/${year}, ${formattedHours}:${minutes} ${amPm}`;

    let purchasetotal = document.querySelector('#purchasetotal').value;
    let quantityper = document.querySelector('#quantityper').value;
    let section = document.querySelector('#section').value;
    let buyingurgency = document.querySelector('#buyingurgency').value;
    let creditacc = document.querySelector('#creditaccount').value;
    let presale = document.querySelector('#presalecode').value;
    let note = document.querySelector('#notes').value;
    let queueid = location.href.split('id=')[1]

    let params = JSON.stringify({
        "id":queueid,
        "purchase_total": purchasetotal,
        "quantity_per": quantityper,
        "section": section,
        "buying_urgency": buyingurgency,
        "credit_account": creditacc,
        "presale_code": presale,
        "purchase_notes": note,
        "added_timestamp": dategoal
    });

    fetch(urltwo, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: params
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.querySelector('#loading').style.display = "flex";
        document.querySelector('#Item-Container').style.display = "none";
        setTimeout(() => {
            window.location.href = "/buy-queue";
        }, 750);
    })
    .catch(error => {
        console.log(error);
    });
});



let intervalIds;

intervalIds = setInterval(retryClickingSearchBar, 1000);

function retryClickingSearchBar() {
if (token.length === 40) {
getevent()
clearInterval(intervalIds);
}}
