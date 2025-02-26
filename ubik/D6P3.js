
let intervalIds;

function retryClickingSearchBar() {
    if (token.length === 40) {
initializeSourceInstructions()

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
    copyToClipboard(document.getElementById('url2x').textContent);
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

        let eventUrl = eventData.event_url
        let prefixes = retrievefetch(eventUrl);

        if(prefixes && prefixes.source){
        document.getElementById('source').textContent = prefixes.source
        }


        if(prefixes && prefixes.source.includes('TM')) {
            document.getElementById('url2x').textContent = 'http://142.93.115.105:8100/event/' + pkid + '/details/';
            document.getElementById('url2box').style.display = 'flex';
        }


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




let sourceInstructions = [];

function initializeSourceInstructions() {
  return fetch('https://ubik.wiki/api/source-instructions/?limit=100', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      sourceInstructions = data.results;
      console.log("Source instructions loaded.");
    })
    .catch(error => {
      console.error('Error occurred during fetch:', error);
    });
}

function retrievefetch(url) {
  if (!sourceInstructions.length) {
    console.log("Source instructions not loaded yet.");
    return {
      event_prefix: "other",
      venue_prefix: "other",
      url: url
    };
  }

  let matchingRecord = sourceInstructions.find(record => {
    if (record.contains) {
      let tokens = record.contains.split(',');
      return tokens.some(token => url.includes(token.trim()));
    }
    return false;
  });

  if (matchingRecord) {
    return {
      source: matchingRecord.source,
      event_prefix: matchingRecord.event_prefix,
      venue_prefix: matchingRecord.venue_prefix,
      url: url
    };
  } else {
    return {
      source:"OTHER",
      event_prefix: "other",
      venue_prefix: "other",
      url: url
    };
  }
}


