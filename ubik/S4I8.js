
function getEvents() {
    document.querySelector('#sampleitem').style.display = 'none'

    let keywords1 = document.getElementById('source').value
    let baseUrl = 'https://ubik.wiki/api/source-instructions/?';
    let params = [];

    if (keywords1.length > 0) {
    params.push('source__iexact=' + keywords1)
    }

    params.push('limit=100');
    let mainurl = baseUrl + params.join('&');

let request = new XMLHttpRequest();

let url = mainurl

request.open('GET', url, true)
request.setRequestHeader('Authorization', `Bearer ${token}`);
request.setRequestHeader("Content-type", "application/json; charset=utf-8");
request.onload = function() {
let data = JSON.parse(this.response)

if (request.status = 200 && request.status < 400) {
const cardContainer = document.getElementById("items-container")

data.results.forEach(events => {
const style = document.getElementById('sampleitem')
const card = style.cloneNode(true)
card.id = events.source
if(card.id !== 'sampleitem') {
card.style.display = 'flex'
}
card.setAttribute('id', events.id);
card.setAttribute('checked','false')

const instructions = events.instructions;
const contains = events.contains;
const browser = events.browser;
const source = events.source;
const id = events.id;
const eventprefix = events.event_prefix;
const venueprefix = events.venue_prefix;

const sourcecard = card.getElementsByClassName('main-text-sourcei')[0]
sourcecard.textContent = source

const sourcecard = card.getElementsByClassName('main-text-contains')[0]
sourcecard.textContent = contains

const browsercard = card.getElementsByClassName('main-text-browser')[0]
browsercard.textContent = browser

const instructionscard = card.getElementsByClassName('main-text-instruction')[0]
instructionscard.textContent = instructions

const eventprefixcard = card.getElementsByClassName('main-text-eprefix')[0]
eventprefixcard.textContent = eventprefix

const venueprefixcard = card.getElementsByClassName('main-text-vprefix')[0]
venueprefixcard.textContent = venueprefix

if(instructions.length > 33) {
instructionscard.textContent = instructions.slice(0, 30) + '...'
} else {
instructionscard.textContent = instructions
}

card.addEventListener('click', function(){
    document.querySelector('#edit-id').value = ''
    document.querySelector('#edit-source').value = ''
    document.querySelector('#edit-browser').value = ''
    document.querySelector('#edit-event-prefix').value = ''
    document.querySelector('#edit-venue-prefix').value = ''
    document.querySelector('#edit-instructions').value = ''
    document.querySelector('#edit-contains').value = ''

    if (event.target.closest('.main-text-delete')) {
    return;
    }

    document.querySelector('#errortext').textContent = ''
    document.querySelector("#editwrapper1").style.display = 'flex'

    document.querySelector('#edit-id').value = id
    document.querySelector('#edit-source').value = source
    document.querySelector('#edit-browser').value = browser
    document.querySelector('#edit-instructions').value = instructions
    document.querySelector('#edit-contains').value = contains
    document.querySelector('#edit-event-prefix').value = eventprefix
    document.querySelector('#edit-venue-prefix').value = venueprefix
    })


const deletebutton = card.getElementsByClassName('main-text-delete')[0];
const evids = card.getAttribute('id');
deletebutton.addEventListener('click', function() {
document.querySelector('#editwrapper1').style.display = 'none';
document.querySelector('#editwrapper2').style.display = 'none';
const url = `https://ubik.wiki/api/delete/source-instructions/`;
const bodyData = JSON.stringify({
id: evids
});

fetch(url, {
method: 'DELETE',
headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
},
body: bodyData
});

card.style.display = 'none';
});


cardContainer.appendChild(card);






})


searchcompleted = true

} else if(request.status>400){
console.log('searchfailed')
}
}
request.send();
}


let intervalIds;

intervalIds = setInterval(retryClickingSearchBar, 250);

function retryClickingSearchBar() {
if (token.length === 40) {
document.querySelector('#loading').style.display = "none";
document.querySelector('#flexbox').style.display = "flex";
getEvents()
clearInterval(intervalIds);
}}

document.getElementById('source').addEventListener('change', async function () {
let boxes = document.querySelectorAll('.listitem')
for (let i = 0; i<boxes.length;i++) {
boxes[i].style.display = 'none'
}
getEvents();
});


{
var intervalId = window.setInterval(function(){
let boxes = document.querySelectorAll('.listitem')
for (let i = 0; i<boxes.length;i++) {
if(boxes[i].style.display == 'none' && boxes[i].id !== 'sampleitem') {
boxes[i].remove()
}}
}, 100);
}


document.querySelector('#search-button').addEventListener('click', async function () {
let boxes = document.querySelectorAll('.listitem')
for (let i = 0; i<boxes.length;i++) {
boxes[i].style.display = 'none'
}
getEvents();
});




{
document.querySelector('#edit-id').disabled = true

document.querySelector('#editbtn').addEventListener('click', function() {
    document.querySelector('#editbtn').style.pointerEvents = "none";
let itemid = document.querySelector('#edit-id').value
let source = document.querySelector('#edit-source').value
let browser = document.querySelector('#edit-browser').value
let instructions = document.querySelector('#edit-instructions').value
let contains = document.querySelector('#edit-contains').value
let eventprefix = document.querySelector('#edit-event-prefix').value
let venueprefix = document.querySelector('#edit-venue-prefix').value
const endpointUrl = 'https://ubik.wiki/api/update/source-instructions/'

const newRowData = {
id: itemid,
source: source,
browser: browser,
instructions: instructions,
contains: contains,
event_prefix: eventprefix,
venue_prefix: venueprefix
};


fetch(endpointUrl, {
method: 'PUT',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${token}`
},
body: JSON.stringify(newRowData)
})
.then(function (response) {
response.text().then(text => {
document.querySelector('#errortext').textContent = "Error: " + text;
});

        document.querySelector('#editbtn').style.pointerEvents = "auto";
    document.querySelector('#search-button').click()
document.querySelector('#editwrapper1').style.display = 'none';
document.querySelector("#editwrapper2").style.display = 'none'
    return response.text();
})
.catch(error => {
});
})
}


const intervalWebflow = setInterval(function() {
if (!!Webflow) {
Webflow.push(function() {
$('form').submit(function() {
return false;
})
})
clearInterval(intervalWebflow);
}
}, 1000);



function createInstruction() {

    const endpointUrl = 'https://ubik.wiki/api/create/source-instructions/'

    let source = document.querySelector('#add-source').value
    let browser = document.querySelector('#add-browser').value
    let instructions = document.querySelector('#add-instructions').value
    let vprefix = document.querySelector('#add-venue-prefix').value
    let eprefix = document.querySelector('#add-event-prefix').value


    const newRowData = {
        source: source,
        browser: browser,
        instructions: instructions,
        event_prefix: eprefix,
        venue_prefix: vprefix
    };

    fetch(endpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRowData)
    })
    .then(function (response) {
        response.text().then(text => {
            document.querySelector('#errortext2').textContent = "Error: " + text;
        });
        document.querySelector("#editwrapper2").style.display = 'none'
        document.querySelector('#search-button').click()
            return response.text();
    })
    .catch(error => {
    });
}

document.getElementById('editbtn2').addEventListener('click', function() {
    const fld1 = !!document.querySelector("#add-source").value;
    if (!fld1) {
        document.querySelector('#errortext2').textContent = "All required fields must be filled.";
        return;
    } else {
        createInstruction();
        document.querySelector('#errortext2').textContent = '';
    }
});


document.getElementById('addnew').addEventListener('click', function() {
document.querySelector('#editbtn2').style.pointerEvents = "none";
document.querySelector('#editwrapper2').style.display = 'flex';
document.querySelector('#errortext2').textContent = ''
document.querySelector('#add-source').value = ''
document.querySelector('#add-browser').value = ''
document.querySelector('#add-instructions').value = ''
document.querySelector('#add-venue-prefix').value = ''
document.querySelector('#add-event-prefix').value = ''
});


document.addEventListener("input", () => {
    const fld1 = !!document.querySelector("#add-source").value;
    if (!!fld1) {
        document.querySelector('#editbtn2').style.pointerEvents = "auto";
    } else {
        document.querySelector('#editbtn2').style.pointerEvents = "none";

    }
});


