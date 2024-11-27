let purcharray = []
let abortControllers = [];

const apiUrl = 'https://ubik.wiki/api/purchasing-accounts/';
let headers;

// Function to initialize headers and proceed with code
function initialize() {
    headers = {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json; charset=utf-8'
    };

    // Your main code that requires headers goes here
    initializeStates(); // Example function call
}

// Set interval to check for token length
const tokenCheckInterval = setInterval(() => {
    if (token && token.length === 40) {
        clearInterval(tokenCheckInterval); // Clear interval once token is valid
        initialize(); // Call function to initialize headers and proceed
    }
}, 1000); // Check every 1 second


    // Fetch data from the API
    async function fetchData(url) {
        const response = await fetch(url.toString(), { method: 'GET', headers });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    }




    async function initializeStates(states) {
        try {
            const url = new URL(`${apiUrl}?limit=1000`);
            const data = await fetchData(url);
            const items = Array.isArray(data) ? data : data.results;

            if (!Array.isArray(items)) throw new Error("Expected an array in 'data' or 'data.results'.");

            const stateCounts = items.reduce((counts, item) => {
                counts[item.state] = (counts[item.state] || 0) + 1;
                return counts;
            }, {});

            const buyerStateSelect = document.getElementById('buyer_state');
            buyerStateSelect.innerHTML = '';

            // Add "Select one..." as the first option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select one...';
            buyerStateSelect.appendChild(defaultOption);

            // If specified `states` is in the list, add it as the first selectable option
            if (states && stateCounts[states]) {
                const specifiedStateOption = document.createElement('option');
                specifiedStateOption.value = states;
                specifiedStateOption.textContent = `${states} (${stateCounts[states]})`;
                buyerStateSelect.appendChild(specifiedStateOption);
                delete stateCounts[states]; // Remove from the list to avoid duplication
            }

            // Populate other states in alphabetical order
            Object.keys(stateCounts).sort().forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = `${state} (${stateCounts[state]})`;
                buyerStateSelect.appendChild(option);
            });

            // Convert emailsused string to an array for easy filtering
            const usedEmails = emailsused.split(',').map(email => email.trim());
            // Add change event listener to filter out used emails
            buyerStateSelect.addEventListener('change', () => {
                erasedata();
                const selectedState = buyerStateSelect.value.split(" (")[0];
                if (selectedState) populateEmails(items, selectedState, usedEmails);
            });

            // If `states` is specified, set it as the selected option and trigger the event
            if (states) {
                buyerStateSelect.value = states;
            } else {
                buyerStateSelect.value = ''; // Default to "Select one..."
            }

            // Trigger change event to populate based on initial selection
            const event = new Event("change");
            buyerStateSelect.dispatchEvent(event);

        } catch (error) {
            console.error('Error initializing states:', error);
        }
    }

    function addDefaultOption(selectElement, text) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = text;
        selectElement.appendChild(option);
    }


    function populateEmails(items, selectedState, emailsused) {
        const buyerEmailSelect = document.getElementById('buyer_email');
        buyerEmailSelect.innerHTML = '';
        addDefaultOption(buyerEmailSelect, 'Select one...');

        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }); // Get today's date in EST (YYYY-MM-DD)

        const source = getsource(document.querySelector('#url').textContent); // Get the source
        // Collect emails and their counts
        const emailOptions = items.filter(item => item.state === selectedState).map(item => {
            let count = 0;

            // Check if purchases_tracking exists and process it
            if (item.purchases_tracking && Array.isArray(item.purchases_tracking)) {
                item.purchases_tracking.forEach(purchase => {
                    if (purchase[source]) {
                        Object.values(purchase[source]).forEach(date => {
                            if (date >= today) {
                                count++;
                            }
                        });
                    }
                });
            }

            // Return the email and its count (default 0 if no purchases_tracking)
            return { email: item.email.trim(), count };
        });

        // Exclude emails already used
        const filteredEmailOptions = emailOptions.filter(option => !emailsused.map(email => email.trim()).includes(option.email));
        // Sort by count (ascending)
        filteredEmailOptions.sort((a, b) => a.count - b.count);

        // Populate dropdown
        filteredEmailOptions.forEach(option => {
            const emailOption = document.createElement('option');
            emailOption.value = option.email; // Set plain email as value
            emailOption.textContent = option.count > 0 ? `${option.email} (${option.count})` : option.email; // Add count if > 0
            buyerEmailSelect.appendChild(emailOption);
        });
    }




    async function displayBuyerData(buyerEmail) {
        try {
            const url = new URL(`${apiUrl}?email__iexact=${buyerEmail}`);
            const data = await fetchData(url);

            const accountInfo = data.results[0];
            if (!accountInfo) throw new Error("No account information found.");

            document.querySelector('#firstname').textContent = accountInfo.first_name;
            document.querySelector('#lastname').textContent = accountInfo.last_name;
            document.querySelector('#phonenumber').textContent = accountInfo.phone_number;
            document.querySelector('#birthdate').textContent = accountInfo.birthdate;
            document.querySelector('#gender').textContent = accountInfo.gender;
            document.querySelector('#street').textContent = accountInfo.address;
            document.querySelector('#city').textContent = accountInfo.city;
            document.querySelector('#zip').textContent = accountInfo.zip;
        } catch (error) {
            console.error('Error displaying buyer data:', error);
        }
    }

    document.getElementById('buyer_email').addEventListener('change', function() {
        abortAllRequests();
        erasedata();
        const buyerEmail = this.value; // Get the plain email as the value

        if (buyerEmail) {
            retrievedatato(buyerEmail);
            displayBuyerData(buyerEmail);
            setvalue(buyerEmail);
        }
    });



function abortAllRequests() {
    abortControllers.forEach(controller => controller.abort());
    abortControllers = [];
}

async function retrievedatato(buyerEmail) {
    const maxRetries = 5;
    const delay = 1000;
    let attempts = 0;

    const controller = new AbortController();
    const signal = controller.signal;
    abortControllers.push(controller);

    const url = `https://shibuy.co:8443/retrievedata?id=${buyerEmail}&token=${token}`;

    while (attempts < maxRetries) {
        try {
            const response = await fetch(url, { signal });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const cd = data.data;

            document.querySelector('#dnum3').textContent = cd.n2;
            document.querySelector('#dnum4').textContent = 'Ramp'
            document.querySelector('#dnum5').textContent = 'Visa'

            document.getElementById('unlock').setAttribute('retrieve',buyerEmail)
            document.getElementById('unlock').style.pointerEvents = "auto";
            document.getElementById('unlock').classList.remove('none')
            document.getElementById('unlock').style.display = 'flex'

            document.getElementById('unlock2').setAttribute('retrieve',cd.n1)
            document.getElementById('unlock2').style.pointerEvents = "auto";
            document.getElementById('unlock2').classList.remove('none')
            document.getElementById('unlock2').style.display = 'flex'





            return; // Exit function upon successful response
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('Request was aborted.');
                return; // Exit the function if the request is aborted
            }

            attempts += 1;
            console.error(`Attempt ${attempts} failed: ${error.message}`);

            if (attempts >= maxRetries) {
                console.error("Max retries reached. Error fetching data:", error);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
        }
    }
}

function copyToClipboard1(text) {
    const tempInput1 = document.createElement('input');
    document.body.appendChild(tempInput1);
    tempInput1.value = text;
    tempInput1.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput1);
}

function copyToClipboard2(text) {
    const tempInput2 = document.createElement('input');
    document.body.appendChild(tempInput2);
    tempInput2.value = text;
    tempInput2.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput2);
}


document.querySelector('#unlock').addEventListener("click", () => {
let id = document.querySelector('#unlock').getAttribute('retrieve')
retrievezip(id)
})

document.querySelector('#unlock2').addEventListener("click", () => {
let id = document.querySelector('#unlock2').getAttribute('retrieve')
copyToClipboard2(id)
})

async function retrievezip(id) {
    const maxRetries = 5;
    const delay = 1000;
    let attempts = 0;
    let buyerEmail = id;
    const controller = new AbortController();
    const signal = controller.signal;
    abortControllers.push(controller);

    const url = `https://shibuy.co:8443/retrievezip?id=${buyerEmail}&token=${token}`;

    while (attempts < maxRetries) {
        try {
            const response = await fetch(url, { signal });
            const text = await response.text(); // Get raw response body

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Check if the response is JSON
            let data;
            try {
                data = JSON.parse(text); // Try parsing as JSON
            } catch (parseError) {
                data = text; // Fallback to raw text if parsing fails
            }

            copyToClipboard1(data); // Use the response (JSON or plain text)
            document.querySelector('.hdnclick').click()
            return; // Exit function upon successful response
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('Request was aborted.');
                return; // Exit the function if the request is aborted
            }

            attempts += 1;
            console.error(`Attempt ${attempts} failed: ${error.message}`);

            if (attempts >= maxRetries) {
                console.error("Max retries reached. Error fetching data:", error);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
        }
    }
}





function erasedata(){
    document.querySelector('#firstname').textContent = ''
    document.querySelector('#lastname').textContent = ''
    document.querySelector('#phonenumber').textContent = ''
    document.querySelector('#birthdate').textContent = ''
    document.querySelector('#gender').textContent = ''
    document.querySelector('#street').textContent = ''
    document.querySelector('#city').textContent = ''
    document.querySelector('#zip').textContent = ''
    document.querySelector('#dnum3').textContent = ''
    document.querySelector('#dnum4').textContent = ''
    document.querySelector('#dnum5').textContent = ''

    document.getElementById('unlock').style.pointerEvents = "none";
    document.getElementById('unlock').setAttribute('retrieve','')
    document.getElementById('unlock').style.display = 'none'

    document.getElementById('unlock2').style.pointerEvents = "auto";
    document.getElementById('unlock2').setAttribute('retrieve','')
    document.getElementById('unlock2').style.display = 'none'


    document.querySelector('#purchaseaccounts').value = ''
    document.querySelector('#failedemail').value = ''


}


function setvalue(buyerEmail){
document.querySelector('#purchaseaccounts').value = buyerEmail
document.querySelector('#failedemail').value = buyerEmail
}



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
var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event-copy?id=')[1];
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

emailsarray = []
emailsused = eventdata.used_emails

emailsarray.push(emailsused.split(','))

emails = emailsarray.join(',')

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
      states = data.results[0].state
      state = getStateName(states)
      initializeStates(state);

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

document.getElementById("buyer_state").value = "Georgia";


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
document.querySelector('#purchasesource').textContent = eventdata.scraper_name
document.querySelector('#eventid').textContent = eventdata.event_id
document.querySelector('#purchasealltime').textContent = eventdata.purchase_total
document.querySelector('#presalecode').textContent = eventdata.presale_code
document.querySelector('#notes').textContent = eventdata.purchase_notes

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
let purchacc = document.querySelector('#purchaseaccounts').value
const emailurl = 'https://ubik.wiki/api/purchasing-accounts/?email__iexact=' + purchacc;
let http = new XMLHttpRequest();

http.open("GET", emailurl, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.setRequestHeader('Authorization', `Bearer ${token}`);

http.onreadystatechange = function() {
if (http.readyState == 4) {
if (http.status == 200) {
let data = JSON.parse(http.responseText);
emailid = data.results[0].id;
purcharray = data.results[0].purchases_tracking
if(purcharray === null){
purcharray = []
}
email1 = true;
emailpart2();
}
}
};

  http.send();
}




function emailpart2() {
    let keyToCheck = getsource(document.querySelector('#url').textContent);
    let date = document.getElementById('date').textContent.trim();
    let found = false;

    // Check if the source already exists in purcharray
    for (let item of purcharray) {
        if (item[keyToCheck] !== undefined) {
            // Add new event with eventid as the key
            item[keyToCheck][encodedthiseventid] = date;
            found = true;
            break;
        }
    }

    if (!found) {
        purcharray.push({
            [keyToCheck]: { [encodedthiseventid]: date }
        });
    }

    const emailurl2 = 'https://ubik.wiki/api/update/purchasing-accounts/';
        params = {
            "id": emailid,
            "purchases_tracking": purcharray
        };


    let http = new XMLHttpRequest();
    http.open("PUT", emailurl2, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader('Authorization', `Bearer ${token}`);

    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status == 200) {
                emailchecked = true;
            }
        }
    };
    http.send(JSON.stringify(params));
}




function part1(){
let bought = Number(document.querySelector('#amountbought1').textContent)
let cpr = Number(document.querySelector('#purchasequantity').value)
let combined = bought+cpr
let limit = Number(document.querySelector('#amountbought2').textContent)
let purchacc = document.querySelector('#purchaseaccounts').value
var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event-copy?id=')[1]
var http = new XMLHttpRequest();
var urll = "https://ubik.wiki/api/update/buying-queue/"

var params = {
  "id": eventid,
  "purchased_amount": combined
}

if (combined >= limit) {
    params["completed"] = 'TRUE';
}


if(!emails.includes(purchacc)) {
    emails = emails + ',' + purchacc
    params["used_emails"] = emails
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


    var eventid = document.location.href.split('https://www.ubikanalytic.com/buy-event-copy?id=')[1]
    var http = new XMLHttpRequest();
    var endpointUrl = "https://ubik.wiki/api/create/order-history/"

    var param = {
    "event_name":eventname,
    "event_id":thiseventid,
    "event_date":eventdate,
    "event_venue":eventvenue,
    "event_time":eventtime,
    "purchase_source":eventsource,
    "purchase_quantity":pq,
    "purchase_quantity_total":pmax,
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
    "purchase_urgency":purchurgency
    }

    const email_list = document.getElementById('purchaseaccounts').value;

        param.purchase_account = email_list.slice(0,1).toUpperCase();
        param.purchase_email = email_list

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



const stateMap = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

const reverseStateMap = Object.fromEntries(
    Object.entries(stateMap).map(([abbr, fullName]) => [fullName, abbr])
);

function getStateName(input) {
    input = input.toUpperCase();
    if (stateMap[input]) {
        return stateMap[input];
    }

    input = input[0] + input.slice(1).toLowerCase();
    if (reverseStateMap[input]) {
        return reverseStateMap[input];
    }

    return "";
}



function getsource(eventUrl) {
    switch(true) {
        case eventUrl.includes('showclix'):
        return('SHOW');
        break;
        case eventUrl.includes('thecomplexslc'):
        return('SHOW');
        break;
        case eventUrl.includes('ticketmaster.co.uk'):
        return('TM-UK');
        break;
        case eventUrl.includes('ticketmaster.ca'):
        return('TM');
        break;
        case eventUrl.includes('ticketmaster.de'):
        return('TM-DE');
        break;
        case eventUrl.includes('ticketmaster.com.mx'):
        return('TM-MX');
        break;
        case eventUrl.includes('ticketmaster.com'):
        return('TM');
        break;
        case eventUrl.includes('livenation'):
        return('TM');
        break;
        case eventUrl.includes('24tix'):
        return('24TIX');
        break;
        case eventUrl.includes('admitone'):
        return('ADMIT1');
        break;
        case eventUrl.includes('axs'):
        return('AXS');
        break;
        case eventUrl.includes('dice'):
        return('DICE');
        break;
        case eventUrl.includes('etix'):
        return('ETIX');
        break;
        case eventUrl.includes('eventbrite'):
        return('EBRITE');
        break;
        case eventUrl.includes('freshtix'):
        return('FRESH');
        break;
        case eventUrl.includes('frontgate'):
        return('FGATE');
        break;
        case eventUrl.includes('holdmyticket'):
        return('HOLDMT');
        break;
        case eventUrl.includes('prekindle'):
        return('PRE');
        break;
        case eventUrl.includes('seetickets'):
        return('SEETIX');
        break;
        case eventUrl.includes('showclix'):
        return('SHOW');
        break;
        case eventUrl.includes('ticketweb'):
        return('TWEB');
        break;
        case eventUrl.includes('ticketswest'):
        return('TWEST');
        break;
        case eventUrl.includes('tixr'):
        return('TIXR');
        break;
        case eventUrl.includes('stubwire'):
        return('STUBW');
        break;
        case eventUrl.includes('fgtix'):
        return('FGATE');
        break;
        case eventUrl.includes('evenue'):
        return('EVENUE');
        break;
        case eventUrl.includes('gruenehall'):
        return('gruenehall');
        break;
        case eventUrl.includes('meowwolf'):
        return('MEOW');
        break;
        case eventUrl.includes('thevogue.com'):
        return('thevogue');
        break;
    default:
        return('OTHER');
        break;
    }}
