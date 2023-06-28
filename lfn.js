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
    
    var input = document.getElementById("searchbar1");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });
    var input = document.getElementById("searchbar2");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });
    
    document.querySelector('#search-button').addEventListener("click", () => {
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value)
    $('.event-box').hide()
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#flexbox').style.display = "none";

    let xanoUrl = new URL('https://shibuy.co:8443/eventdata?ename=') + keywords1.replaceAll("'", "''") + "&vname=" + keywords2.replaceAll("'", "''")        
    // let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/getdata?search-key-1=') + keywords1.replaceAll("'", "''") + "&search-key-2=" + keywords2.replaceAll("'", "''")
    function getEvents() {
    checkresults()
    datear()
    
    
    let request = new XMLHttpRequest();
    
    let url = xanoUrl
    
    request.open('GET', url, true)
    
    request.onload = function() {
    
    let data = JSON.parse(this.response)
    
    if (request.status >= 200 && request.status < 400) {
    document.querySelector('#loading').style.display = "none";
    document.querySelector('#flexbox').style.display = "flex";
    const cardContainer = document.getElementById("Cards-Container")
    
    data.forEach(events => {
    
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)
    const evid = events.Other_Master_Site_Event_Id
    
    card.setAttribute('id', '');
    card.setAttribute('name', events.Other_Master_Event_Name);
    
    card.setAttribute('date', events.Other_Master_Event_Date.slice(0, 10).replaceAll("-","/"));
    
    card.setAttribute('eventid', evid);
    
    card.setAttribute('time', events.Other_Master_Event_Time.slice(0, 8));
    card.setAttribute('venue', events.Venue_Master_Venue);
    card.setAttribute('location', events.Venue_Master_City);
    card.setAttribute('capacity', events.Venue_Master_Venue_Capacity);
    card.setAttribute('source', events.Event_Other_Master_Source_Formula);
    card.setAttribute('status', events.Event_Other_Master_Status_Formula);
    card.setAttribute('purchased', events.Purchased_Amount_Alltime);
    
    card.setAttribute('vivid_id', events.Event_Other_Master_Vivid_Venue_Id);
    card.setAttribute('vivid_ed', events.Other_Master_Event_Date.slice(0,10));
    
    const primrem = card.getElementsByClassName('main-text-primary')[0]
    const dpd = card.getElementsByClassName('main-text-aday')[0]
    
    if(events.Event_Other_Master_Primary_Remain_Amnt.length === 0) {
    card.setAttribute('primaryamount', '0');
    } else {
    card.setAttribute('primaryamount', events.Event_Other_Master_Primary_Remain_Amnt);
    primrem.textContent = events.Event_Other_Master_Primary_Remain_Amnt
    }

const primaryurl = () => {
  const url = 'https://shibuy.co:8443/primaryurl?eventid=' + evid ;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
       
        if (typeof data.count === 'number') {
          primrem.textContent = data.count;
        }
        
        if (typeof data.diffperday === 'number') {
          dpd.textContent = data.diffperday;
        }
    })
    .catch(error => {
      console.log('Error:', error);
      // Handle any errors that occurred during the request
    });
};
    
    const scrapetm = async function(){
    const url = 'https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/142_scrape_event?eventid='+evid
    
    const response = await fetch(url, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    });
    
    const result = await response.json();
    
    //primaryurl()
    
    }
    
    
    
    
    let rescrapebutton = card.getElementsByClassName('re-scrape-div')[0]
    
    let scrapebutton = card.getElementsByClassName('scrape-div-fresh')[0]
    
    
    scrapebutton.addEventListener('click',function(){
    scrapetm()
    primrem.textContent = ''
    dpd.textContent = ''
    })
    
    
    rescrapebutton.addEventListener('click',function(){
    primrem.textContent = ''
    dpd.textContent = ''
    //primaryurl()
    })
    
    
    if(events.Event_Other_Master_Source_Formula == 'TM' && !evid.startsWith('Z') && evid.length == 16) {
    primrem.textContent = '0'
    dpd.textContent = '0'
    //primaryurl()
    rescrapebutton.style.display = 'flex'
    scrapebutton.style.display = 'flex'
    }
    

    if(events.Event_Other_Master_Primary_Remain_Amnt.length === 0) {
    card.setAttribute('primaryamount', '0');
    } else {
    card.setAttribute('primaryamount', events.Event_Other_Master_Primary_Remain_Amnt);
    }
    card.style.display = 'flex';
    
    const buybutton = card.getElementsByClassName('main-buy-button')[0]
    buybutton.addEventListener('click', function() {
    window.location.assign('https://www.ubikanalytic.com/event?id=' + encodeURIComponent(evid))
    });
    
    const mbutton = card.getElementsByClassName('manualbutton')[0]
    mbutton.addEventListener('click', function() {
    window.location.assign('https://www.ubikanalytic.com/buy-manual?id=' + encodeURIComponent(evid))
    });
    
    const eventname = card.getElementsByClassName('main-text-event')[0]
    eventname.textContent = events.Other_Master_Event_Name;
    if(eventname.textContent.length>13) {
    eventname.textContent = events.Other_Master_Event_Name.slice(0, 13)+'...'
    }
    
     const eventur = card.getElementsByClassName('main-text-url')[0]
     eventur.textContent = events.Other_Master_Event_Url
     
     
    let eventtime = card.getElementsByClassName('main-text-time')[0]
    eventtime.textContent = events.Other_Master_Event_Time.slice(0, 8)
    
    const eventvenue = card.getElementsByClassName('main-text-venue')[0]
    eventvenue.textContent = events.Venue_Master_Venue
    if(eventvenue.textContent.length>13) {
    eventvenue.textContent = events.Venue_Master_Venue.slice(0, 13)+'...'
    }
    
    let purchasequantity = card.getElementsByClassName('main-text-purchased')[0]
    purchasequantity.textContent = events.Purchased_Amount_Alltime
    
    
    let txtsource = card.getElementsByClassName('main-textsource')[0]
    txtsource.textContent = events.Event_Other_Master_Source_Formula
    
    if(events.Event_Other_Master_Source_Formula == 'TM') {
    $(txtsource).click(function() {
    window.open('http://142.93.115.105:8100/event/' + evid +'/details/', "142")
    });
    txtsource.classList.add("clickable");
    }
    
    const eventdate = card.getElementsByClassName('main-text-date')[0]
    
    var tdate = events.Other_Master_Event_Date.slice(0, 10).replaceAll("-","/")
    tdate = [tdate.slice(5), tdate.slice(0,4)].join('/');
    eventdate.textContent = tdate
    
    const eventlocation = card.getElementsByClassName('main-text-location')[0]
    eventlocation.textContent = events.Venue_Master_City
    
    const eventcap = card.getElementsByClassName('main-text-capacity')[0]
    eventcap.textContent = events.Venue_Master_Venue_Capacity
    
    const eventstatus = card.getElementsByClassName('main-text-status')[0]
    eventstatus.textContent = events.Event_Other_Master_Status_Formula
    const eventurl = events.Other_Master_Event_Url
    
    const hidebtn = card.getElementsByClassName('hidebtn')[0]
    let eventid = evid
    hidebtn.addEventListener('click', function() {
    var http = new XMLHttpRequest();
    var url = "https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/hide_event";
    var params = JSON.stringify({
    "search-key": eventid
    })
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.send(params);
    card.style.display = "none";
    });
    
    
    if(events.Event_Other_Master_Buy_Status === 'hidden') {
    card.style.display = "none";
    }
    
    
    
    
    function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
    }
    
    eventname.addEventListener('click', function() { copyToClipboard(eventurl); });
    
    
    cardContainer.appendChild(card);
    })
    } else if(request.status>400){
    document.querySelector('#loading').style.display = "none";
    document.querySelector('#flexbox').style.display = "flex";
    console.log('searchfailed')
    }
    }
    
    request.send();
    
    }
    
    (function() {
    getEvents();
    
    })();
    
    })
    
    {
    document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("search-button").click();
    
    
    
    })
    }
    
    {
    var intervalId = window.setInterval(function(){
    let boxes = document.querySelectorAll('.event-box')
    for (let i = 0; i<boxes.length;i++) {
    if(boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle') {
    boxes[i].remove()
    }}
    }, 100);
    }
