
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
        const fld5 = document.getElementById('purchasefreq').value.trim() !== '';
  
        document.getElementById('buyfake').style.display = fld1 && fld2 && fld3 && fld4 && fld5 ? 'none' : 'flex';
        document.getElementById('buybtn').style.display = fld1 && fld2 && fld3 && fld4 && fld5 ? 'flex' : 'none';
    }
  
    ['purchasetotal', 'quantityper', 'section', 'buyingurgency', 'purchasefreq'].forEach(function(id) {
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
            document.getElementById('source').textContent = eventData.source_site;
            document.getElementById('date').textContent = eventData.date;
            document.getElementById('time').textContent = eventData.time;

    
            if(eventData.warning){
            document.getElementById('warning').textContent = eventData.warning;
            }
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
  purchase_frequency: document.getElementById('purchasefreq').value,
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
};

const purchaseAccValue = document.getElementById('purchaseacc').value;
const purchaseAccsValue = document.getElementById('purchaseaccs').value;

if (purchaseAccValue.trim() !== "") {
  requestData.purchase_account = purchaseAccValue;
} else if (purchaseAccsValue.trim() !== "") {
  requestData.purchase_account = purchaseAccsValue;
}

  
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



function getaccounts() {
  let url = new URL('https://ubik.wiki/api/email-types/?limit=1000');
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader("Content-type", "application/json; charset=utf-8");
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.onload = function() {
    let data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      const selectDropdown = document.getElementById("purchaseaccs");
      const purchaseAcc = document.getElementById("purchaseacc");

      selectDropdown.innerHTML = "";

      data.results.forEach(event => {
        const option = document.createElement("option");
        option.value = event.accounts; // Set the value to event's ID or any unique identifier
        option.textContent = event.type; // Set the text content to event's name or description
        selectDropdown.appendChild(option);
      });

      // Add "manual" option
      const manualOption = document.createElement("option");
      manualOption.value = "manual";
      manualOption.textContent = "Manual";
      selectDropdown.appendChild(manualOption);

      // Event listener to handle the "manual" option
      selectDropdown.addEventListener("change", function() {
        if (this.value === "manual") {
          purchaseAcc.style.display = "block";
          selectDropdown.style.display = "none";
        } else {
          purchaseAcc.style.display = "none";
          selectDropdown.style.display = "block";
        }
      });
    }
  };
  
  request.send();
}




let intervalIdtwo;

function retryaccounts() {
  if (token.length === 40) {
getaccounts()
  clearInterval(intervalIdtwo);
  }}

intervalIdtwo = setInterval(retryaccounts, 1000);

