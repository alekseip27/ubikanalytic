
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

        document.querySelector('#purchasefreq').value =  events.purchase_frequency;

        document.querySelector('#purchaseacc').value =  events.purchase_account;

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

    const now = new Date();

    const estOffset = -5 * 60; // EST is UTC-5 hours
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert local time to UTC
    const estDate = new Date(utc + (estOffset * 60000)); // Convert UTC to EST

    const year = estDate.getFullYear();
    const month = (estDate.getMonth() + 1).toString().padStart(2, '0');
    const day = estDate.getDate().toString().padStart(2, '0');
    const hours24 = estDate.getHours();
    const minutes = estDate.getMinutes().toString().padStart(2, '0');

    // Convert hours from 24h to 12h format and set AM or PM
    const hours = hours24 % 12 || 12; // convert to 12 hour AM PM format, making sure 0 is represented as 12
    const amPm = hours24 >= 12 ? 'PM' : 'AM';
    const formattedHours = hours.toString().padStart(2, '0'); // Ensure two digits

    // Construct the date string
    dategoal = `${month}/${day}/${year}, ${formattedHours}:${minutes} ${amPm}`;

    let purchasetotal = document.querySelector('#purchasetotal').value;
    let quantityper = document.querySelector('#quantityper').value;
    let section = document.querySelector('#section').value;
    let buyingurgency = document.querySelector('#buyingurgency').value;
    let purchasefreq = document.querySelector('#purchasefreq').value;
    let purchaseacc = document.querySelector('#purchaseacc').value;
    let presale = document.querySelector('#presalecode').value;
    let note = document.querySelector('#notes').value;
    let queueid = location.href.split('id=')[1]

    let params = JSON.stringify({
        "id":queueid,
        "purchase_total": purchasetotal,
        "quantity_per": quantityper,
        "section": section,
        "buying_urgency": buyingurgency,
        "purchase_frequency": purchasefreq,
        "purchase_account": purchaseacc,
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
