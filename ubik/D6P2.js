
let intervalIds;

function retryClickingSearchBar() {
    if (token.length === 40) {


document.getElementById('purchasetotal').setAttribute('min', '0');
document.getElementById('quantityper').setAttribute('min', '0');

function updateBuyButtonVisibility() {
    const fld1 = document.getElementById('purchasetotal').value.trim() !== '';
    const fld2 = document.getElementById('quantityper').value.trim() !== '';
    const fld3 = document.getElementById('section').value.trim() !== '';
    const fld4 = document.getElementById('buyingurgency').value.trim() !== '';
    const fld5 = document.getElementById('purchaseaccs').value.trim() !== '';

    document.getElementById('buyfake').style.display = fld1 && fld2 && fld3 && fld4 && fld5 ? 'none' : 'flex';
    document.getElementById('buybtn').style.display = fld1 && fld2 && fld3 && fld4 && fld5 ? 'flex' : 'none';
}

['purchasetotal', 'quantityper', 'section', 'buyingurgency','purchaseaccs'].forEach(function(id) {
    document.getElementById(id).addEventListener('input', updateBuyButtonVisibility);
});

function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

document.getElementById('urlx').addEventListener('click', function() {
    copyToClipboard(document.getElementById('url').textContent);
});

document.getElementById('url2').addEventListener('click', function() {
    copyToClipboard(document.getElementById('url2').textContent);
});

var pkid = new URLSearchParams(window.location.search).get('id');
fetch('https://ubik.wiki/api/event-venue/?site_event_id__iexact=' + encodeURIComponent(pkid), {
headers: {
'Authorization': `Bearer ${token}`
}
})
.then(response => response.json())
    .then(data => {
        const eventData = data.results[0];
        document.getElementById('event').textContent = eventData.event_name;
        document.getElementById('venue').textContent = eventData.venue_name;
        getsource(eventData.event_url)
        document.getElementById('date').textContent = eventData.date;
        document.getElementById('time').textContent = eventData.time;


        if(eventData.warning){
        document.getElementById('warning').textContent = eventData.warning;
        }

// Get the current time in Eastern Time, accounting for daylight saving automatically
const nowInEastern = moment().tz("America/New_York");

const year = nowInEastern.year();
const month = nowInEastern.format('MM'); // Zero-padded month
const day = nowInEastern.format('DD'); // Zero-padded day
const hours24 = nowInEastern.hours();
const minutes = nowInEastern.format('mm'); // Zero-padded minutes

// Convert hours from 24h to 12h format and set AM or PM
const hours = hours24 % 12 || 12; // Convert to 12 hour format, making sure 0 is represented as 12
const amPm = hours24 >= 12 ? 'PM' : 'AM';
const formattedHours = nowInEastern.format('hh'); // Zero-padded hour in 12h format

// Construct the date string
dategoal = `${month}/${day}/${year}, ${formattedHours}:${minutes} ${amPm}`;



  estdates = `${month}/${day}/${year} ${hours}:${minutes}`;



        if(eventData.Event_Other_Master_Source_Formula === 'TM') {
            document.getElementById('url2').textContent = 'http://142.93.115.105:8100/event/' + pkid + '/details/';
            document.getElementById('url2box').style.display = 'flex';
        }
        document.getElementById('url').textContent = eventData.event_url;
        document.getElementById('pref1rem').textContent = eventData.Event_Other_Master_Pref1_Remaining;
        document.getElementById('pref2rem').textContent = eventData.Event_Other_Master_Pref2_Remaining;
        document.getElementById('pref3rem').textContent = eventData.Event_Other_Master_Pref3_Remaining;
        document.getElementById('remcheckdate').textContent = eventData.Event_Other_Master_Remain_Check_Date;
        document.getElementById('remchecktime').textContent = eventData.Event_Other_Master_Remain_Check_Time;
        document.getElementById('totalresale').textContent = eventData.Event_Other_Master_Resale_Total_Amnt;
        document.getElementById('prefresale').textContent = eventData.Event_Other_Master_Resale_Pref_Amnt;
        document.getElementById('prefsec1').textContent = eventData.Venue_Other_Master_Pref_Section1;
        document.getElementById('prefsec2').textContent = eventData.Venue_Other_Master_Pref_Section2;
        document.getElementById('prefsec3').textContent = eventData.Venue_Other_Master_Pref_Section3;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('Item-Container').style.display = 'flex';
    })
    .catch(error => console.error('Error:', error));

    clearInterval(intervalIds);
}}

intervalIds = setInterval(retryClickingSearchBar, 1000);

document.getElementById('buybtn').addEventListener('click', function() {
    this.style.pointerEvents = 'none';
    var pkid = new URLSearchParams(window.location.search).get('id');
    const url = 'https://ubik.wiki/api/create/buying-queue/';
const requestData = {
purchase_total: document.getElementById('purchasetotal').value,
quantity_per: document.getElementById('quantityper').value,
section: document.getElementById('section').value,
buying_urgency: document.getElementById('buyingurgency').value,
presale_code: document.getElementById('presalecode').value,
purchase_notes: document.getElementById('notes').value,
added_timestamp: dategoal,
event_name: document.getElementById('event').textContent,
event_id: pkid,
event_venue: document.getElementById('venue').textContent,
event_date: document.getElementById('date').textContent,
event_url: document.getElementById('url').textContent,
event_time: document.getElementById('time').textContent,
event_source: document.getElementById('source').textContent,
purchase_account: document.getElementById('purchaseaccs').value,
credit_account: document.getElementById('purchaseaccs').value
};

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Request-Method': 'POST'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
            fetch('https://hook.us1.make.com/c7ug12vaoqk99aomiix1279qrhv13tk1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "New Buy": document.getElementById('buyingurgency').value })
            })
            .then(() => {
                document.getElementById('loading').style.display = 'flex';
                document.getElementById('Item-Container').style.display = 'none';
                setTimeout(() => {
                    window.location.href = '/buy-queue';
                }, 2000);
            })
            .catch(error =>
              console.error('Error:', error)
              );

    })
    .catch(error => {
console.log(error)
    });
});




function getsource(eventUrl) {
    const purchaseSource = document.querySelector('#source');

    switch (true) {
        case eventUrl.includes('showclix'):
            purchaseSource.textContent = 'SHOW';
            break;
        case eventUrl.includes('thecomplexslc'):
            purchaseSource.textContent = 'SHOW';
            break;
        case eventUrl.includes('ticketmaster.co.uk'):
            purchaseSource.textContent = 'TM-UK';
            break;
        case eventUrl.includes('ticketmaster.ca'):
            purchaseSource.textContent = 'TM';
            break;
        case eventUrl.includes('ticketmaster.de'):
            purchaseSource.textContent = 'TM-DE';
            break;
        case eventUrl.includes('ticketmaster.com.mx'):
            purchaseSource.textContent = 'TM-MX';
            break;
        case eventUrl.includes('ticketmaster.com'):
            purchaseSource.textContent = 'TM';
            break;
        case eventUrl.includes('livenation'):
            purchaseSource.textContent = 'TM';
            break;
        case eventUrl.includes('24tix'):
            purchaseSource.textContent = '24TIX';
            break;
        case eventUrl.includes('admitone'):
            purchaseSource.textContent = 'ADMIT1';
            break;
        case eventUrl.includes('axs'):
            purchaseSource.textContent = 'AXS';
            break;
        case eventUrl.includes('dice'):
            purchaseSource.textContent = 'DICE';
            break;
        case eventUrl.includes('etix'):
            purchaseSource.textContent = 'ETIX';
            break;
        case eventUrl.includes('eventbrite'):
            purchaseSource.textContent = 'EBRITE';
            break;
        case eventUrl.includes('freshtix'):
            purchaseSource.textContent = 'FRESH';
            break;
        case eventUrl.includes('frontgate'):
            purchaseSource.textContent = 'FGATE';
            break;
        case eventUrl.includes('holdmyticket'):
            purchaseSource.textContent = 'HOLDMT';
            break;
        case eventUrl.includes('prekindle'):
            purchaseSource.textContent = 'PRE';
            break;
        case eventUrl.includes('seetickets'):
            purchaseSource.textContent = 'SEETIX';
            break;
        case eventUrl.includes('ticketweb'):
            purchaseSource.textContent = 'TWEB';
            break;
        case eventUrl.includes('ticketswest'):
            purchaseSource.textContent = 'TWEST';
            break;
        case eventUrl.includes('tixr'):
            purchaseSource.textContent = 'TIXR';
            break;
        case eventUrl.includes('stubwire'):
            purchaseSource.textContent = 'STUBW';
            break;
        case eventUrl.includes('fgtix'):
            purchaseSource.textContent = 'FGATE';
            break;
        case eventUrl.includes('evenue'):
            purchaseSource.textContent = 'EVENUE';
            break;
        case eventUrl.includes('gruenehall'):
            purchaseSource.textContent = 'gruenehall';
            break;
        case eventUrl.includes('meowwolf'):
            purchaseSource.textContent = 'MEOW';
            break;
        case eventUrl.includes('thevogue.com'):
            purchaseSource.textContent = 'thevogue';
            break;
        case eventUrl.includes('bigtickets.com'):
            purchaseSource.textContent = 'big';
            break;
        default:
            purchaseSource.textContent = 'OTHER';
            break;
    }
}
