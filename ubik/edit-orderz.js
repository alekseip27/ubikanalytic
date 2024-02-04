function checkresults() {
    let results = document.querySelectorAll('.event-box')
    let count = 0
    for (let i = 0; i<results.length;i++) {
    if(results[i].style.display !== 'none') {
    count++
    document.querySelector('#counter').textContent = count
    }
    if(count<2) {
    document.querySelector('#countertxt').textContent = 'Result'
    } else {
    document.querySelector('#countertxt').textContent = 'Results'
    }}}
    let datear = function(){
    setTimeout(() => {
    let now = new Date()
    let date1 = moment(now).format('YYYY/MM/DD')
    $('.event-box').sort(function(a, b) {
    if (date1 > $(b).attr('date')) {return 1;}
    else {return -1;}
    }).appendTo('#Cards-Container');
    }, 2500)}
    
    var intervalId = window.setInterval(function(){
    checkresults()
    }, 100);
    
    {
    var input = document.getElementById("searchbar1");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });
    }
    
    {
    var input = document.getElementById("searchbar2");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });
    }
    
    
    {
    var input = document.getElementById("searchbar3");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });
    }
    
    
    document.querySelector('#search-button').addEventListener("click", () => {
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#flexbox').style.display = "none";
    
    var searchbar1 = document.getElementById('searchbar1');
    searchbar1.value = searchbar1.value.trimEnd();
    var searchbar2 = document.getElementById('searchbar2');
    searchbar2.value = searchbar2.value.trimEnd();
    var searchbar3 = document.getElementById('searchbar3');
    searchbar3.value = searchbar3.value.trimEnd();
    
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value)
    let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value)
    $('.event-box').hide()
    
    let baseUrl = 'https://ubik.wiki/api/order-history/?';
    let params = [];
    
    if (keywords1.length > 0) {
    params.push('event_name__icontains=' + keywords1.replaceAll("'", "''"));
    }
    
    if (keywords2.length > 0) {
    params.push('confirmation__icontains=' + keywords2.replaceAll("'", "''"));
    }
    
    if (keywords3.length > 0) {
    params.push('purchased_by__icontains=' + keywords3.replaceAll("'", "''"));
    }
    
    
    
    params.push('limit=100');
    
    let xanoUrl = baseUrl + params.join('&');
    
    
    function getEvents() {
    
    let request = new XMLHttpRequest();
    
    let url = xanoUrl
    
    request.open('GET', url, true)
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.onload = function() {
    let data = JSON.parse(this.response)
    
    if (request.status >= 200 && request.status < 400) {
    document.querySelector('#loading').style.display = "none";
    document.querySelector('#flexbox').style.display = "flex";
    const cardContainer = document.getElementById("Cards-Container")
    
    data.results.forEach(events => {
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)
    const evid = encodeURIComponent(events.id)    
    card.setAttribute('id', '');
    card.setAttribute('checked','false')
    card.setAttribute('name', events.event_name);
    card.setAttribute('eventid', evid);
    card.setAttribute('source', events.purchase_source);
    
    card.addEventListener('click', function(){

    if (event.target.closest('.main-edit-button')) {
    return;
    }
        
    cardid = events.id
    document.querySelector('#errortext').textContent = ''
    document.querySelector(".edit-wrapper").style.display = 'flex'
    document.querySelector('#editid').value = events.event_id
    document.querySelector('#editname').value =  events.event_name
    document.querySelector('#editvenue').value = events.event_venue
    document.querySelector('#editconfirmation').value = events.confirmation
    document.querySelector('#editaccount').value = events.purchase_account
    document.querySelector('#editemail').value = events.purchase_email
    document.querySelector('#editpquantity').value = events.purchase_quantity
    document.querySelector('#editsource').value = events.purchase_source
    document.querySelector('#edit-requested').value = events.purchase_requested
    document.querySelector('#edit-boughtby').value = events.purchased_by
    document.querySelector('#edit-pdate').value = events.purchase_date
    document.querySelector('#edit-urgency').value = events.purchase_urgency
    })
 
    card.style.display = 'flex';


const deletebutton = card.getElementsByClassName('main-edit-button')[0];
const evids = card.getAttribute('eventid');
deletebutton.addEventListener('click', function() {
    document.querySelector('.edit-wrapper').style.display = 'none';

    const url = `https://ubik.wiki/api/delete/order-history/${evids}/`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    card.style.display = 'none';
});


        
    const evname = card.getElementsByClassName('main-text-enm')[0]
    evname.textContent = events.event_name;
    
    if(evname.textContent.length>15) {
    evname.textContent = events.event_name.slice(0, 15)+'..'
    }
    
    const evenue = card.getElementsByClassName('main-text-even')[0]
    evenue.textContent = events.event_venue;
    
    if(evenue.textContent.length>15) {
    evenue.textContent = events.event_venue.slice(0, 15)+'..'
    }
    
    const confirmation = card.getElementsByClassName('main-text-conf')[0]
    confirmation.textContent = events.confirmation;
    
    if(confirmation.textContent.length>15) {
    confirmation.textContent = events.confirmation.slice(0, 15)+'..'
    }
 
    const account = card.getElementsByClassName('main-text-acc')[0]
    account.textContent = events.purchase_account;

    const emails = card.getElementsByClassName('main-text-emls')[0]
    emails.textContent = events.purchase_email;

    const pquant = card.getElementsByClassName('main-text-purchquant')[0]
    pquant.textContent = events.purchase_quantity;
 
    const source = card.getElementsByClassName('main-text-sources')[0]
    source.textContent = events.purchase_source;

    const requested = card.getElementsByClassName('main-text-requested')[0]
    requested.textContent = events.purchase_requested;
 
    const purchasedby = card.getElementsByClassName('main-text-purchasedby')[0]
    purchasedby.textContent = events.purchased_by;
 
    const pdate = card.getElementsByClassName('main-text-purchasedate')[0]
    pdate.textContent = events.purchase_date;
  
    const urgency = card.getElementsByClassName('main-text-urgency')[0]
    urgency.textContent = events.purchase_urgency;

    const difference = card.getElementsByClassName('main-text-difference')[0]
    difference.textContent = events.purchase_difference;
 
    cardContainer.appendChild(card);
    })
    
    searchcompleted = true
    
    } else if(request.status>400){
    document.querySelector('#loading').style.display = "none";
    document.querySelector('#flexbox').style.display = "flex";
    console.log('searchfailed')
    }
    }
    
    request.send();
    
    }
    
let intervalIds;

intervalIds = setInterval(retryClickingSearchBar, 250);

function retryClickingSearchBar() {
if (token.length === 40) {
getEvents()
clearInterval(intervalIds);
}}
     
        
    
    
    {
    var intervalId = window.setInterval(function(){
    let boxes = document.querySelectorAll('.event-box')
    for (let i = 0; i<boxes.length;i++) {
    if(boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
    boxes[i].remove()
    }}
    }, 100);
    }
    
    
    })  
