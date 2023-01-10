
Webflow.push(function() {
    $('form').submit(function() {
    return false;
    });
    });
    var input = document.getElementById("searchbar1");
    input.addEventListener("keyup", function(event)     {
    if (event.keyCode === 13) {
    event.preventDefault();
  
    document.getElementById("search-button").click();
    }
    });
    document.querySelector('#search-button').addEventListener("click", () => {
    $('#search-button').css({pointerEvents: "none"})
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    document.querySelector('#selectedevent').textContent = ''
    document. querySelector('#eventdate').textContent = ''
    document.querySelector('#eventtime').textContent = ''
    document.querySelector('#eventlocation').textContent = ''
    document.querySelector('#shub').setAttribute('url', '');
    document.querySelector('#vseats').setAttribute('url', '');
    document.querySelector('#fwicon1').textContent = ''
    document.querySelector('#fwicon2').textContent = ''
    document.querySelector('#fwicon3').textContent = ''
    document.querySelector('#fwicon4').textContent = ''
    document.querySelector('#fwicon5').textContent = ''
    document.querySelector('#selectedevent').setAttribute('lastfetched','')
    document.querySelector('#fwicon5').textContent = ''
    let curUser = firebase.auth().currentUser;
    let myFS = firebase.firestore();
    let docRef = myFS.doc("users/" + curUser.uid);
    docRef.get().then((docSnap) => {
    let datas = docSnap.data();
    $(".platform-icon").hide()
    $('.event-box').hide()
    $('#samplestyle').show()
    const dt = new Date();
    let stimestamp2 = moment(dt).format('YYYY-MM-DD')
    let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_events?searchkey=');
    let request = new XMLHttpRequest();
    let url = xanoUrl.toString() + keywords1.replaceAll("'", "''") + '&curdate=' + stimestamp2
    let pa = datas['pyeo']
    request.open('GET', url, true)
    request.setRequestHeader("Authorization", pa);
    request.onload = function() {
    $('#search-button').css({pointerEvents: "auto"})
    let data = JSON.parse(this.response)
    if((request.status === 429) || (request.status === 500)){
    alert('API request rate limit reached, please try again later.')
    } else if (request.status >= 200 && request.status < 400) {
    document.querySelector(".locked-content").style.display = 'none'
    document.querySelector(".pageloading").style.display = 'none'
    const cardContainer = document.getElementById("Cards-Container")
    let quantityseatdata = 0
    data.forEach(events => {
    quantityseatdata + Number(events.quantity)
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)
    card.setAttribute('id', events.id);
    card.setAttribute('date', events.date.slice(0,10))
    const eventname = card.getElementsByClassName('main-text-event')[0]
    eventname.textContent = events.name
    if(eventname.textContent.length>10) {
    eventname.textContent = events.name.slice(0, 10)+'...'
    }
    const eventdate = card.getElementsByClassName('main-text-date')[0]
    eventdate.textContent = events.date.slice(0, 10)
  
    const eventtime = card.getElementsByClassName('main-text-time')[0]
    eventtime.textContent = events.date.slice(11, 16)
    const eventvenue = card.getElementsByClassName('main-text-venue')[0]
    eventvenue.textContent = events.venue.name
    if(eventvenue.textContent.length>10) {
    eventvenue.textContent = events.venue.name.slice(0, 10)+'...'
    }
    const eventlocation = card.getElementsByClassName('main-text-loc')[0]
    eventlocation.textContent = events.venue.city
    const eventquant = card.getElementsByClassName('main-text-quant')[0]
    eventquant.textContent = events.quantity
    const eventcost = card.getElementsByClassName('main-text-cost')[0]
    eventcost.textContent = '$' + events.cost
    

                
 const getchartsd = async function(){
    let dates_sd = []
    let amounts_sd = []
    let prices_sd = []
    
    let eventid = '150597262'
    let eventurl = 'https://www.stubhub.com/frisky-cowboys-quebec-tickets-1-14-2023/event/150597262/'
    let getevent = ('https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/seatdata_0?eventid=') +  eventid + "&Event_Url=" + eventurl;
    
    let response = await fetch(getevent);
    let commits = await response.json()
    
for (let commit of commits) {
    amounts_sd.push(commit.quantity)
    prices_sd.push(commit.price)
    dates_sd.push(moment.unix(commit.timestamp).format("MM/DD/YYYY hh:mm"))
}




chart.data.datasets[0].data = amounts_sd.map(amounts_sd.pop,[...amounts_sd])
chart.data.datasets[1].data = prices_sd.map(prices_sd.pop,[...prices_sd]) 
chart.config.data.labels =  dates_sd.map(dates_sd.pop,[...dates_sd]) 
chart.update();

    }
 
 
        
const getchartvs = async function(){
let datesvs = []
let amountsvs = []

let currentid = card.getAttribute('id')
let getevent = 'https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/vividseats_data?id='+currentid

let response = await fetch(getevent);
let commits = await response.json()

for(var i = 0; i < commits.length; i++){
if(commits[i].ticket_count>0){
amountsvs.push(Math.round(commits[i].ticket_count))
datesvs.push(commits[i].date_scraped)

chartvs.data.datasets[0].data = amountsvs
chartvs.config.data.labels = datesvs
chartvs.update();

}}}
        
        
    card.addEventListener('click', function() {

getchartvs()
getchartsd()


    $('.event-box.pricing').css({pointerEvents: "none"})
    $('#mainpricing').hide()
    $('#loadingpricing').css("display", "flex");
    $(this).closest('div').find(".main-field-price").prop("readonly", true);
    document.querySelector('#fwicon5').textContent = ''
    $('.event-box-pricing').hide()
    $('#samplestyle2').show()
    $(".event-box").removeClass("selected");
    
    card.classList.add("selected");
    
    setTimeout(() => {
    if (events.stubhubEventUrl !== null && events.stubhubEventUrl.length>0 && !events.stubhubEventUrl.includes('viagogo')) {
    let stubhubid = events.stubhubEventUrl.slice(-9).replace('/','')
    document.querySelector("#refreshstub").click()
    document.querySelector('#selectedevent').setAttribute('stubhub-id',stubhubid);
    } 
    
    if(events.stubhubEventUrl !== null && events.stubhubEventUrl.length>0 && events.stubhubEventUrl.includes('viagogo')){
    let stubhubid = events.stubhubEventUrl.slice(-9)
    document.querySelector("#refreshstub").click()
    document.querySelector('#selectedevent').setAttribute('stubhub-id',stubhubid);
    } 

    }, 500);
    
    document.querySelector('#selectedevent').textContent = events.name.slice(0,15) 
    document.querySelector('#eventdate').textContent = events.date.slice(0,10)
    document.querySelector('#eventtime').textContent = events.date.slice(11, 16)
    document.querySelector('#eventlocation').textContent = events.venue.city + ", " + events.venue.state
    document.querySelector('#selectedevent').setAttribute('eventid', events.id)
    document.querySelector('#shub').setAttribute('url', events.stubhubEventUrl);
    document.querySelector('#vseats').setAttribute('url', events.vividSeatsEventUrl);

    $(".platform-icon").css('display', 'flex');
    document.querySelector('#fwicon1').textContent = ''
    document.querySelector('#fwicon2').textContent = ''
    document.querySelector('#fwicon3').textContent = ''
    document.querySelector('#fwicon4').textContent = ''
    {
    let eventid = document.querySelector('#selectedevent').getAttribute('eventid');
    
    $('.event-box-2').hide()
  
  
    let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/get_inventory?searchkey=');
    
    let request = new XMLHttpRequest();
    let url = xanoUrl.toString() + eventid
    let pa = datas['pyeo']
    request.open('GET', url, true)
    request.setRequestHeader("Authorization", pa);
    request.onload = function() {
    let data = JSON.parse(this.response)
    if((request.status === 429) || (request.status === 500)){
    alert('Something went wrong... Contact the senior engineer philantrophist business man investor and professional problem solver Mike Serrano')
    } else if (request.status >= 200 && request.status < 400) {
      setTimeout(() => {
    $('.event-box.pricing').css({pointerEvents: "auto"})
    const cardContainer = document.getElementById("Cards-Container2")
    data.forEach(events => {
    const style = document.getElementById('samplestyle2')
    const card = style.cloneNode(true)
    card.setAttribute('id', events.id);
    const eventid = card.getElementsByClassName('main-text-id')[0]
    eventid.textContent = events.id
    const eventsection = card.getElementsByClassName('main-text-section')[0]
    eventsection.textContent = events.section
    const eventrow = card.getElementsByClassName('main-text-rows')[0]
    eventrow.textContent = events.row
    
    const eventqty = card.getElementsByClassName('main-text-qty')[0]
    eventqty.textContent = events.quantity
    
    const eventprice = card.getElementsByClassName('main-field-price')[0]
    
    eventprice.value = events.listPrice

//setup before functions
let typingTimer;                //timer identifier
let doneTypingInterval = 1000;  //time in ms (5 seconds)
let myInput = eventprice

//on keyup, start the countdown
myInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    if (myInput.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

//user is "finished typing," do something
function doneTyping () {
if(document.querySelector('#vspricing').checked){
eventprice.value = (eventprice.value/85 * 100).toFixed(2)
}
}

      

    const eventpriceticket = card.getElementsByClassName('main-text-priceticket')[0]
    let dticket = String((events.cost/events.quantity))

if(dticket.includes('.')){
    let pti = dticket.split(".");

    let ptix = pti[0] + '.' + pti[1].slice(0,2)

    eventpriceticket.textContent = '$' + ptix
} else {
    eventpriceticket.textContent = '$' + dticket
}
        
const savepricebutton = card.getElementsByClassName('save-price-button')[0]   

 
 


eventprice.addEventListener("keypress", (event) => {

if( (event.keyCode === 13) && (eventprice.readOnly == false) ) {
savepricebutton.click()
document.querySelector('#isfocus').textContent = '1'
setTimeout(() => {
document.querySelector('#isfocus').textContent = '0'
}, 5000);

}
});

savepricebutton.addEventListener("click", (event) => {
if(eventprice.readOnly == false)  {
document.querySelector('#isfocus').textContent = '1'
setTimeout(() => {
document.querySelector('#isfocus').textContent = '0'
}, 5000);

}
});
        

  savepricebutton.addEventListener('click', function() {

  $(this).closest('div').find(".main-field-price").prop("readonly", true);
  $(this).hide()
  $(this).closest('div').find(".notbt").css("display", "flex");
  document.querySelector(".confirmation-pricing").style.display = 'flex'
  let nmb = Number(document.querySelector("#eventsamount").textContent)
  nmb++
  if(nmb===1) {
  document.querySelector("#eventtext").textContent = "event"
  } else {
  document.querySelector("#eventtext").textContent = "events"}
  document.querySelector("#eventsamount").textContent = nmb
  let activeticket = ($(this).closest(".event-box-pricing").attr('id'));
  let prc = eventprice.value
  let usr = datas['Email']
  var http = new XMLHttpRequest();
  var url = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_add_to_queue?ticket-id=" + activeticket + "&price=" + prc + "&user=" + usr;
  let pa = datas['pyeo']
  http.open("PUT", url, true);
  
  http.setRequestHeader("Content-type", "application/json; charset=utf-8");
  http.setRequestHeader("Authorization", pa);
  
  
  http.send();
  
  })    
        
 
    const eventcst = card.getElementsByClassName('main-text-cst')[0]
    eventcst.textContent = '$' + events.cost
   

    const eventnotes = card.getElementsByClassName('main-text-notes')[0]
    eventnotes.textContent = events.notes
 
    var startDate = moment(events.lastPriceUpdate.slice(0,10), "YYYY/DD/MM");
    
    var currenDate = moment(new Date()).format("YYYY-DD-MM");
    var endDate = moment(currenDate, "YYYY-DD-MM");
    var result = endDate.diff(startDate, 'days');
  
  
    const lastupdated = card.getElementsByClassName('main-text-updated')[0]
   
    let tixid = events.id
    let usz = datas['Email']
    var http = new XMLHttpRequest();
    var urll = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_check_item?ticket_id=" + tixid;
    let pa = datas['pyeo']
    http.open("GET", urll, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader("Authorization", pa);
       
   http.send();
   http.onload = function() {
   let resp = http.response
   if(resp === 'true' ) {
   card.getElementsByClassName('main-field-price')[0].readOnly = true;
   card.getElementsByClassName('save-price-button')[0].style.display = 'none';
   card.getElementsByClassName('notbt')[0].style.display = 'flex';
   document.querySelector(".confirmation-pricing").style.display = 'flex'
  
   }}
  
    cardContainer.appendChild(card);
  }, 1500);
    })
  }
    setTimeout(() => {
    $('#mainpricing').css("display", "block");
    $('#loadingpricing').css("display", "none");
    $('#samplestyle2').hide()
  }, 750);
  }
  
  
    request.send();
  
  
    }
  
    });
    cardContainer.appendChild(card);
  
    })}}
    request.send();
    document.querySelector("#pricecancel").addEventListener('click', function() {
    $('#pricecancel').css({pointerEvents: "none"})
    $('.event-box.pricing').css({pointerEvents: "none"})

      let usz = datas['Email']
      var http = new XMLHttpRequest();
      var url = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_remove_queue?user=" + usz
      let pa = datas['pyeo']
      http.open("GET", url, true);
      http.setRequestHeader("Content-type", "application/json; charset=utf-8");
      http.setRequestHeader("Authorization", pa);
        
      http.onload = function() {
      let selected = document.getElementsByClassName("event-box pricing selected")
      if(selected.length>0 && http.status >= 200 && http.status < 400){
        selected[0].click()
      }
      document.querySelector(".confirmation-pricing").style.display = 'none'
      $('#pricecancel').css({pointerEvents: "auto"})
      $('.event-box.pricing').css({pointerEvents: "auto"})

      document.querySelector("#eventsamount").textContent = '0'
      document.querySelector(".notbt").style.display = 'none'
      $(".main-field-price").prop("readonly", false)
      }
      http.send();
      })    
  
  
  
      let uszz = datas['Email']
      var http2 = new XMLHttpRequest();
      var urlll = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_count?user=" + uszz;
      http2.open("GET", urlll, true);
      http2.setRequestHeader("Content-type", "application/json; charset=utf-8");
      http2.setRequestHeader("Authorization", pa);
    
     http2.send();
     http2.onload = function() {
      console.log(http2)
     let resp = http2.response
     if(resp>=1 ) {
     document.querySelector(".confirmation-pricing").style.display = 'flex'
     document.querySelector("#eventsamount").textContent = resp
     }}
  
  document.querySelector('#priceconfirm').addEventListener("click", () => {
    $('#priceconfirm').css({pointerEvents: "none"})
    $('.event-box.pricing').css({pointerEvents: "none"})

      let uszz = datas['Email']
      var http = new XMLHttpRequest();
      var urll = "https://x828-xess-evjx.n7.xano.io/api:Owvj42bm/pricing_confirm?user=" + uszz;
      let pa = datas['pyeo']
      http.open("PUT", urll, true);
      http.setRequestHeader("Content-type", "application/json; charset=utf-8");
      http.setRequestHeader("Authorization", pa);
     http.onload = function() {

      document.querySelector(".confirmation-pricing").style.display = 'none'
      $('#priceconfirm').css({pointerEvents: "auto"})
      $('.event-box.pricing').css({pointerEvents: "auto"})

      let selected = document.getElementsByClassName("event-box pricing selected")
      if(selected.length>0 && http.status >= 200 && http.status < 400) {
          selected[0].click()
      document.querySelector("#eventsamount").textContent = '0'

      } 
    }
    http.send();
    })
  })
  
  
    {
    $('#shub').click(function () {
    let url = document.querySelector('#shub').getAttribute('url') + '?quantity=2';
    if(url !== 'null') {
    window.open(url,'shub')
    $('#shub').css('cursor', 'pointer');
    } else if(url === 'null') {
    $('#shub').css('cursor', 'default');
    }
    })
    var intervalId = window.setInterval(function(){
    let urls = document.querySelector('#shub').getAttribute('url');
    if(urls !== 'null') {
    $('#stubhubidno').hide()
    $('#shub').css('cursor', 'pointer');
    } else if(urls === 'null') {
    $('#stubhubidno').show()
    $('#shub').css('cursor', 'default');
    }
    }, 100);
    }
    
    {
    $('#vseats').click(function () {
    let url = document.querySelector('#vseats').getAttribute('url');
    if(url !== 'null') {
    window.open(url,'vseats')
    $('#vseats').css('cursor', 'pointer');
    } else if(url === 'null') {
    $('#vseats').css('cursor', 'default');
    }
    })
    var intervalId = window.setInterval(function(){
    let urls = document.querySelector('#vseats').getAttribute('url');
    if(urls !== 'null') {
    $('#vseats').css('cursor', 'pointer');
    } else if(urls === 'null') {
    $('#vseats').css('cursor', 'default');
    }
    
    }, 100);
    }

    })


{
document.addEventListener('keydown', (e) => {
setTimeout(function() {
let isfoc = document.querySelector('#isfocus').textContent
if (e.repeat) return;
if (e.key === 'Enter' && isfoc === '0' && document.querySelector('#confirmprice').style.display == 'flex') {
        document.getElementById("priceconfirm").click();
        $('#confirmprice').css({pointerEvents: "none"})
        setTimeout(() => {
        $('#confirmprice').css({pointerEvents: "auto"})
        },1000)


}    }, 1000)
})
}