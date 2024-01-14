document.addEventListener("DOMContentLoaded", function(){

    function getEvents2() {
    
    $('.event-box').hide()
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#flexbox').style.display = "none";
    
    let xanoUrl = new URL('https://ubik.wiki/api/order-history/');
    
    var searchbar1 = document.getElementById('searchbar1');
    searchbar1.value = searchbar1.value.trimEnd();
    
    var searchbar2 = document.getElementById('searchbar2');
    searchbar2.value = searchbar2.value.trimEnd();
    
    var searchbar3 = document.getElementById('searchbar3');
    searchbar3.value = searchbar3.value.trimEnd();
    
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value);
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value);
    let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value);
    
    let keywords4 = encodeURIComponent(document.getElementById('not1ticketcheck').checked);
    let keywords5 = encodeURIComponent(!document.getElementById('1ticketcheck').checked);
    
    
    $('.event-box').hide();
    
    let params = [];
    
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
    
    params.push('limit=1000');
    
    
    let queryString = params.join('&');
    if (queryString.length > 0) {
    queryString = '?' + queryString; // Add the initial question mark
    }
    
    xanoUrl.search = queryString;
    
    
    let request = new XMLHttpRequest();
    
    let url = xanoUrl.toString()
    
    request.open('GET', url, true)
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.onload = function() {
    
    let data = JSON.parse(this.response)
    
    if (request.status >= 200 && request.status < 400) {
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
    card.setAttribute('quantity', events.purchase_quantity)
    card.setAttribute('account', events.purchase_account)
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
    
    let purchasequantity = card.getElementsByClassName('main-text-quantity')[0]
    purchasequantity.textContent = events.purchase_quantity
    
    let purchasequantitymax = card.getElementsByClassName('main-text-quantity-max')[0]
    purchasequantitymax.textContent = events.purchase_quantity_total
    
    let purchaseaccount = card.getElementsByClassName('main-text-purchased-account')[0]
    purchaseaccount.textContent = events.purchase_account
    
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
    var url = "https://ubik.wiki/api/update/order-history/" + errorid + "/";
    
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
    var url = "https://ubik.wiki/api/update/order-history/" + errorid + "/";
    
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
getEvents2()
    clearInterval(intervalIds);
    }}

  intervalIds = setInterval(retryClickingSearchBar, 1000);
  
    checkresults()
    
    document.querySelector('#search-button').addEventListener("click", () => {
    getEvents2()
    })
    
    })
    
    
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
    
