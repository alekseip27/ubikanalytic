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
    
    let baseUrl = 'https://ubik.wiki/api/venues/?';
    let params = [];
    
    if (keywords1.length > 0) {
    params.push('name__icontains=' + keywords1.replaceAll("'", "''"));
    }
    
    if (keywords2.length > 0) {
    params.push('site_venue_id__icontains=' + keywords2.replaceAll("'", "''"));
    }
    
    if (keywords3.length > 0) {
    params.push('source_site__icontains=' + keywords3.replaceAll("'", "''"));
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
    const evid = encodeURIComponent(events.site_venue_id)
    const eventdate = card.getElementsByClassName('main-text-date')[0]
    
    card.setAttribute('id', '');
    card.setAttribute('checked','false')
    card.setAttribute('name', events.name);
    
    
    card.setAttribute('eventid', evid);
    
    card.setAttribute('source', events.source_site);
    
    card.addEventListener('click', function(){

    if (event.target.closest('.main-edit-button')) {
    return;
    }
            
    document.querySelector('#errortext').textContent = ''
    document.querySelector(".edit-wrapper").style.display = 'flex'
    
    document.querySelector('#editvenueid').value = events.site_venue_id
    document.querySelector('#editvenueidvs').value = events.vivid_venue_id
    document.querySelector('#editvenueidsh').value = events.stubhub_venue_id
         
    document.querySelector('#editwarning').value = events.warning
    
    document.querySelector('#editurl').value = events.venue_url
    document.querySelector('#editurlsh').value = events.stubhub_url
    document.querySelector('#editurlvs').value = events.vivid_url
    
    document.querySelector('#editname').value = events.name
    document.querySelector('#editcity').value = events.city
    document.querySelector('#editsource').value = events.source_site
    document.querySelector('#editstate').value = events.state
    document.querySelector('#editcountry').value = events.country
    document.querySelector('#editzip').value = events.zip_code
    document.querySelector('#edit-tzone').value = events.timezone
    document.querySelector('#edit-capacity').value = events.capacity
    document.querySelector('#edit-addedby').value = events.created_by
    document.querySelector('#edit-addedtime').value = events.created_date
    })
    
    card.style.display = 'flex';
    
    const venueids = card.getElementsByClassName('main-text-venueid')[0]
    venueids.textContent = events.site_venue_id;
    
    if(venueids.textContent.length>15) {
    venueids.textContent = events.site_venue_id.slice(0, 15)+'..'
    }
    
    const venurl = card.getElementsByClassName('main-text-url')[0]
    venurl.textContent = events.venue_url;
    if(venurl.textContent.length>15) {
    venurl.textContent = events.venue_url.slice(0, 15)+'..'
    }
    
    const venuename = card.getElementsByClassName('main-text-vname')[0]
    venuename.textContent = events.name;
    if(venuename.textContent.length>10) {
    venuename.textContent = events.name.slice(0, 10)+'..'
    }
    
    const vencity = card.getElementsByClassName('main-text-city')[0]
    vencity.textContent = events.city;
    
    const vensrc = card.getElementsByClassName('main-text-srcs')[0]
    vensrc.textContent = events.source_site;
    
    const venstate = card.getElementsByClassName('main-text-state')[0]
    venstate.textContent = events.state;
    
    const vencntry = card.getElementsByClassName('main-text-country')[0]
    vencntry.textContent = events.country;
    
    const venzip = card.getElementsByClassName('main-text-zipcode')[0]
    venzip.textContent = events.zip_code;
    
    const timezone = card.getElementsByClassName('main-text-timezone')[0]
    timezone.textContent = events.timezone;
    
    const venuecap = card.getElementsByClassName('main-text-venuecap')[0]
    venuecap.textContent = events.capacity;
    
    const addedby = card.getElementsByClassName('main-text-addedby')[0]
    addedby.textContent = events.created_by;
    
    const addedtime = card.getElementsByClassName('main-text-timeadded')[0]
    addedtime.textContent = events.created_date;
    


    const deletebutton = card.getElementsByClassName('main-edit-button')[0];
    const evids = card.getAttribute('eventid');
    deletebutton.addEventListener('click', function() {
    document.querySelector('.edit-wrapper').style.display = 'none';

    const url = `https://ubik.wiki/api/delete/venues/${evids}/`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer acf84a57bf2522fe825ea158d1dc38ef9c9a41e6',
            'Content-Type': 'application/json',
        },
    });

    card.style.display = 'none';
});

    
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
