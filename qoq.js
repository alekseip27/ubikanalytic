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
    let keywords1 = document.getElementById('searchbar1').value
    document.querySelector('#selectedevent').textContent = ''
    document. querySelector('#eventdate').textContent = ''
    document.querySelector('#eventtime').textContent = ''
    document.querySelector('#eventlocation').textContent = ''
    document.querySelector('#shub').setAttribute('url', '');
    document.querySelector('#vseats').setAttribute('url', '');
    document.querySelector('#eventlastfetchedtime').textContent = ''
    document.querySelector('#fwicon1').textContent = ''
    document.querySelector('#fwicon2').textContent = ''
    document.querySelector('#fwicon3').textContent = ''
    document.querySelector('#fwicon4').textContent = ''
    document.querySelector('#fwicon5').textContent = ''
    document.querySelector('#selectedevent').setAttribute('lastfetched','')
    document.querySelector('#eventlastfetchedtime').textContent = ''
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
    let url = xanoUrl.toString() +  encodeURIComponent(keywords1).replace(/%20/g, "%") + '&curdate=' + stimestamp2
    let pa = datas['pyeo']
    request.open('GET', url, true)
    request.setRequestHeader("Authorization", pa);
    request.onload = function() {
    $('#search-button').css({pointerEvents: "auto"})
    let data = JSON.parse(this.response)
    if((request.status === 429) || (request.status === 500)){
    alert('API request rate limit reached, please try again later.')
    } if(request.status === 401){
     document.querySelector(".locked-content").style.display = 'flex'
     document.querySelector(".pageloading").style.display = 'none'
}
    else if (request.status >= 200 && request.status < 400) {
    document.querySelector(".locked-content").style.display = 'none'
    document.querySelector(".pageloading").style.display = 'none'
    const cardContainer = document.getElementById("Cards-Container")
    let quantityseatdata = 0
    data.forEach(events => {
    quantityseatdata + Number(events.quantity)
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)
    card.setAttribute('id', '');
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
    
    card.addEventListener('click', function() {
    $('.event-box.pricing').css({pointerEvents: "none"})
    $('#mainpricing').hide()
    $('#loadingpricing').css("display", "flex");
    $(this).closest('div').find(".main-field-price").prop("readonly", true);
    document.querySelector('#eventlastfetchedtime').textContent = ''
    document.querySelector('#fwicon5').textContent = ''
    $('.event-box-4').hide()
    $('#samplestyle4').show()
    $('.event-box-pricing').hide()
    $('#samplestyle2').show()
    $(".event-box").removeClass("selected");
    
    card.classList.add("selected");
    setTimeout(() => {
    if (events.stubhubEventUrl !== null) {
    let stubhubid = events.stubhubEventUrl.split('/event/')[1].slice(0, -1);
    if(stubhubid.length === 9) {
    document.querySelector("#refreshstub").click()
    document.querySelector('#selectedevent').setAttribute('stubhub-id', events.stubhubEventUrl.split('/event/')[1].slice(0, -1));
    }}}, 500);
    
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
console.log(eventprice.readOnly)
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
    window.open(url, url)
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
    window.open(url, url)
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
    
    {
    var intervalId = window.setInterval(function(){
    let boxes = document.querySelectorAll('.event-box-2')
    for (let i = 0; i<boxes.length;i++) {
    if(boxes[i].style.display == 'none' && boxes[i].id !== 'samplestyle3') {
    boxes[i].remove()  
    }}
    }, 100);
    }
    
    $('#fetchbutton').click(function () {
    $('#fetchbutton').css({pointerEvents: "none"})
    let stid = document.querySelector('#shub').getAttribute('url').slice(-10,-1)
    if(stid !== 'null') {
    {
    let eventid = document.querySelector('#shub').getAttribute('url').slice(-10,-1)
    let eventurl = document.querySelector('#shub').getAttribute('url')
    $('.event-box-2').hide()
    $('#samplestyle3').show()
    let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/seatdata_0?eventid=');
    let request = new XMLHttpRequest();
    let url = xanoUrl.toString() + eventid + "&Event_Url=" + eventurl;
    request.open('GET', url, true)
    request.onload = function() {
    let data = JSON.parse(this.response)
    if((request.status === 429) || (request.status === 500)){
    alert('API request rate limit reached, please try again later.')
    } else if (request.status >= 200 && request.status < 400) {
    $('#fetchbutton').css({pointerEvents: "auto"})
    const cardContainer = document.getElementById("Cards-Container3")
    data.forEach(events => {
    const style = document.getElementById('samplestyle3')
    const card = style.cloneNode(true)
    card.setAttribute('id', '');
    const eventsection = card.getElementsByClassName('main-text-section3')[0]
    eventsection.textContent = events.section
    if(eventsection.textContent.length>15) {
    eventsection.textContent = events.section.slice(0, 15)+'...'
    }
    const eventrow = card.getElementsByClassName('main-text-row3')[0]
    eventrow.textContent = events.row
    const eventqty = card.getElementsByClassName('main-text-qty3')[0]
    eventqty.textContent = events.quantity
    const eventprice = card.getElementsByClassName('main-text-price3')[0]
    eventprice.textContent = '$' + events.price




    const eventdate = card.getElementsByClassName('main-text-date3')[0]
    eventdate.textContent = moment.unix(events.timestamp).format("MM/DD/YYYY hh:mm");
    cardContainer.appendChild(card);
    })}}
    request.send();
    }}})
    })
