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
    let cb1 = document.getElementById('tevo-id').checked
        
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value)
    let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value)
    $('.event-box').hide()
    
    let baseUrl = 'https://ubik.wiki/api/artists/?';
    let params = [];
    
    if (keywords1.length > 0) {
    params.push('artist_name__icontains=' + keywords1)
    }
    
    if (keywords2.length > 0) {
    params.push('artist_id__icontains=' + keywords2)
    }
    
    if (keywords3.length > 0) {
    params.push('sbox_id__icontains=' + keywords3)
    }
    
    if (cb1) {
    params.push('&sbox_id__isblank=true');
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
    const evid = events.id
    const eventdate = card.getElementsByClassName('main-text-date')[0]
    
    card.setAttribute('id', '');
    card.setAttribute('checked','false')
    card.setAttribute('name', events.name);
    
    
    card.setAttribute('eventid', evid);

    card.addEventListener('click', function(){

    if (event.target.closest('.main-edit-button')) {
    return;
    }
            
    document.querySelector('#errortext').textContent = ''
    document.querySelector(".edit-wrapper").style.display = 'flex'
    
    document.querySelector('#edit-id').value = events.id
        
    document.querySelector('#edit-name').value = events.artist_name
    document.querySelector('#edit-aliases').value = events.artist_aliases
    
    document.querySelector('#edit-vividid').value = events.artist_id
      
    document.querySelector('#edit-tevoid').value = events.sbox_id
        
    })
    
    card.style.display = 'flex';
    
    const performer = card.getElementsByClassName('main-text-performer')[0]
    performer.textContent = events.artist_name;
  
    const aliases = card.getElementsByClassName('main-text-aliases')[0]
    aliases.textContent = events.tevo_venue_id;
    
    const vividid = card.getElementsByClassName('main-text-vivid-id')[0]
    vividid.textContent = events.artist_id;    

   const tevoid = card.getElementsByClassName('main-text-tevo-id')[0]
    tevoid.textContent = events.sbox_id;

        
const deletebutton = card.getElementsByClassName('main-edit-button')[0];
const evids = card.getAttribute('eventid');
deletebutton.addEventListener('click', function() {
    document.querySelector('.edit-wrapper').style.display = 'none';
    const url = `https://ubik.wiki/api/delete/artists/`;
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
