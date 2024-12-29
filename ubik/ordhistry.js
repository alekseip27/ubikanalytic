
document.getElementById('rightarrow').addEventListener('click', function() {
    if(nexturl){
    constructURL(nexturl)
    }
    });
    
    
    document.getElementById('leftarrow').addEventListener('click', function() {
    if(prevurl){
    constructURL(prevurl)
    }
    });
 
    function constructURL(next) {
        document.querySelector('#loading').style.display = "flex";
        document.querySelector('#flexbox').style.display = "none";
            
        let baseUrl = 'https://ubik.wiki/api/order-history/?';
        params = [];
      
        var searchbar1 = document.getElementById('searchbar1');
        searchbar1.value = searchbar1.value.trimEnd();
        
        var searchbar2 = document.getElementById('searchbar2');
        searchbar2.value = searchbar2.value.trimEnd();
        
        var searchbar3 = document.getElementById('searchbar3');
        searchbar3.value = searchbar3.value.trimEnd();

        var searchbar4 = document.getElementById('searchbar4');
        searchbar4.value = searchbar4.value.trimEnd();
        
        var searchbar5 = document.getElementById('searchbar5');
        searchbar5.value = searchbar5.value.trimEnd();
        
        let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
        let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
        let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value);
        let keywords4 = encodeURIComponent(document.getElementById('not1ticketcheck').checked);
        let keywords5 = encodeURIComponent(!document.getElementById('1ticketcheck').checked);
        let keywords6 = encodeURIComponent(document.getElementById('searchbar4').value);
        let keywords7 = encodeURIComponent(document.getElementById('searchbar5').value);

    if (keywords1.length > 0) {
        params.push('event_name__icontains=' + keywords1.replaceAll("'", "''"));
        }
        
        if (keywords2.length > 0) {
        params.push('event_venue__icontains=' + keywords2.replaceAll("'", "''"));
        }
        
        if (keywords3.length > 0) {
        params.push('confirmation__icontains=' + keywords3.replaceAll("'", "''"));
        }
        
        if (keywords4 === 'true') {
        params.push("not_one_ticket__iexact="+keywords4)
        }
        
        if (keywords5 === 'false') {
        params.push("one_ticket__iexact="+keywords5)
        }

        if (keywords6.length > 0) {
        params.push('event_date__icontains=' + keywords6.replaceAll("'", "''"));
        }
        
        if (keywords7.length > 0) {
        params.push("purchase_email__icontains="+keywords7)
        }
            
        params.push('limit=100'); 



        
    $('.event-box').hide()
  
    xanoUrl = ''

    if (next) {
      const nurl = new URL(next);
      const param = new URLSearchParams(nurl.search);
      const offset = param.get('offset');
      console.log('Offset:', offset);
      params.push('offset=' + offset);
      xanoUrl = nurl.origin + nurl.pathname + '?' + params.join('&');
      } else {
      xanoUrl = baseUrl + params.join('&');
      }
      getEvents(xanoUrl);
      }

      document.querySelector('#search-button').addEventListener("click", () => {
      savedevents = []
      constructURL()
      })
  
    function getEvents(fetchurl) {

    let request = new XMLHttpRequest();
 
    request.open('GET', fetchurl, true)
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.onload = function() {
    
    let data = JSON.parse(this.response)
    
    if (request.status >= 200 && request.status < 400) {


        $('.event-box').hide()
  
        nexturl = data.next
        prevurl = data.previous
        pcount = parseInt(data.count/100)

        document.getElementById('maxpages').textContent = pcount


        if(nexturl){
          const match = nexturl.match(/offset=(\d+)/);
          
          let result;
          
          if (match && match[1]) {
          if (match[1].length >= 4) {
          result = match[1].slice(0, 2);
          } else {
          result = match[1][0];
          }
          } else {
          result = '1'
          }
          
          document.getElementById('curpage').textContent = result
          } else {
          document.getElementById('curpage').textContent = '1'
          document.getElementById('maxpages').textContent = '1'
          }


  
          document.querySelector('#loading').style.display = "none";
          document.querySelector('#flexbox').style.display = "flex";

    const cardContainer = document.getElementById("Cards-Container")
    
    data.results.forEach(events => {
    
    const style = document.getElementById('samplestyle')
    const card = style.cloneNode(true)
    
    card.setAttribute('id', '')
    card.setAttribute('name', events.event_name)
    card.setAttribute('date', events.event_date)
    card.setAttribute('purchased', events.purchase_date)
    card.setAttribute('venue', events.event_venue)
    card.setAttribute('time', events.event_time)
    card.setAttribute('email', events.purchase_email)
    card.setAttribute('source', events.purchase_Source)
    card.setAttribute('requested', events.purchase_requested)
    card.setAttribute('bought', events.purchased_by)
    card.setAttribute('confirmation', events.confirmation)
    card.setAttribute('oneticket', events.one_ticket)
    card.setAttribute('notoneticket', events.not_one_ticket)
    
    card.style.display = 'flex';
    
    const purchdate = card.getElementsByClassName('main-text-date-purchased')[0]
    purchdate.textContent = events.purchase_date
    
    const eventname = card.getElementsByClassName('main-text-event')[0]
    eventname.textContent = events.event_name;
    if(eventname.textContent.length>10) {
    eventname.textContent = events.event_name.slice(0, 10)+'..'
    }

    eventname.addEventListener('click', function() { copyToClipboard(events.event_name); });
        
    const eventdate = card.getElementsByClassName('main-text-event-date')[0]
    var tdate = events.event_date
    eventdate.textContent = tdate
    
    let eventtime = card.getElementsByClassName('main-text-time')[0]
    eventtime.textContent = events.event_time
    
    const eventvenue = card.getElementsByClassName('main-text-venue')[0]
    eventvenue.textContent = events.event_venue
    if(eventvenue.textContent.length>10) {
    eventvenue.textContent = events.event_venue.slice(0, 10)+'...'
    }

    eventvenue.addEventListener('click', function() { copyToClipboard(events.event_venue); });
        
    
    let confirmation = card.getElementsByClassName('main-text-confirmation')[0]
    
    confirmation.textContent = events.confirmation
    if(confirmation.textContent.length>10) {
    confirmation.textContent = events.confirmation.slice(0, 10)+'..'
    }
    
    function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
    }
    
    confirmation.addEventListener('click', function() { copyToClipboard(events.confirmation); });
    
    let purchaseemail = card.getElementsByClassName('main-text-purchased-email')[0]
    
    purchaseemail.textContent = events.purchase_email
    if(purchaseemail.textContent.length>10) {
    purchaseemail.textContent = events.purchase_email.slice(0, 10)+'..'
    }
    
    purchaseemail.addEventListener('click', function() { copyToClipboard(events.purchase_email); });
    
    let purchasedby = card.getElementsByClassName('main-text-purchased-by')[0]
    purchasedby.textContent = events.purchased_by
    
    let oneticket = card.getElementsByClassName('main-checkbox-1ticket')[0]
    oneticket.checked = events.one_ticket
    
    let onenotticket = card.getElementsByClassName('main-checkbox-not-1ticket')[0]
    onenotticket.checked = events.not_one_ticket
    
    let purchrequested = card.getElementsByClassName('main-text-event-date-requested')[0]
    purchrequested.textContent = events.purchase_requested
    
    
    //
    
    var selector = oneticket
    selector.addEventListener('change', function (event) {
    const errorid = encodeURIComponent(events.id);
    var http = new XMLHttpRequest();
    var url = "https://ubik.wiki/api/update/order-history/"
    
    var params = {
    "id": errorid,
    "one_ticket": selector.checked,
    "one_ticket_id": events.one_ticket_id
    };
    
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader('Authorization', `Bearer ${token}`);
    var jsonParams = JSON.stringify(params);
    http.send(jsonParams);
    })
    
    var selector2 = onenotticket
    selector2.addEventListener('change', function (event) {
    const errorid = encodeURIComponent(events.id);
    var http = new XMLHttpRequest();
    var url = "https://ubik.wiki/api/update/order-history/"
    
    var paramst = {
    "id": errorid,
    "not_one_ticket": selector2.checked,
    "one_ticket_id": events.one_ticket_id
    };
    
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader('Authorization', `Bearer ${token}`);
    var jsonParamst = JSON.stringify(paramst);
    http.send(jsonParamst);
    })
    //
    
    
    const eventurl = events.Other_Master_Event_Url
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
    }
    }
    
    request.send();
    
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
    
    let intervalIds;

function retryClickingSearchBar() {
    if (token.length === 40) {
        constructURL()
    clearInterval(intervalIds);
    }}

  intervalIds = setInterval(retryClickingSearchBar, 1000);
    
    
    
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
    var input = document.getElementById("searchbar3");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });
    var input = document.getElementById("searchbar4");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });
    var input = document.getElementById("searchbar5");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
    }
    });

$('#searchbar4').datepicker({
  dateFormat: 'yy-mm-dd'
  });
    
