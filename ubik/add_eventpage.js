

$('#event_date').datepicker({
    dateFormat: 'yy-mm-dd'
    });
    
    Webflow.push(function() {
    $('form').submit(function() {
    return false;
    })
    })
    
     
    document.querySelector('#search-buttoneventid').addEventListener("click", () => {
    
        let eventid = encodeURIComponent(document.querySelector('#prefix-event').value) + encodeURIComponent(document.querySelector('#checkeventid').value)
    
        var url = "https://ubik.wiki/api/primary-events/?site_event_id__icontains=" + eventid
    
        fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=utf-8",
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(function (response) {
                if (response.status === 200) {
                    return response.text(); // This returns a promise with the response text
                } else {
                    throw new Error("Error: " + response.status);
                }
            })
            .then(function (data) {
                let end = JSON.parse(data); // You can access the response text here
                if(end.count>=1){
        $('#search-result').css({ opacity: 1.0 })
        $('#search-result').html('Event ID already exists')
        $('#search-result').css('color', 'red')
                } else {
        $('#search-result').css({ opacity: 1.0 })
        $('#search-result').html('Event ID does not exist')
        $('#search-result').css('color', 'green')
                }
            })
            .catch(function (error) {
                console.error(error);
            });
        
    })
    
    
    document.querySelector('#search-buttonvenueid').addEventListener("click", () => {
    
        let venueid = encodeURIComponent(document.querySelector('#venueprefixsearch').value) + encodeURIComponent(document.querySelector('#checkvenueid').value)
    
        var url = "https://ubik.wiki/api/venues/?site_venue_id__iexact=" + venueid
    
        fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=utf-8",
                'Authorization': `Bearer ${token}`,

            },
        })
            .then(function (response) {
                if (response.status === 200) {
                    return response.text(); // This returns a promise with the response text
                } else {
                    throw new Error("Error: " + response.status);
                }
            })
            .then(function (data) {
                let end = JSON.parse(data); // You can access the response text here
                if(end.count>=1){
        $('#search-result2').css({ opacity: 1.0 })
        $('#search-result2').html('Venue ID already exists')
        $('#search-result2').css('color', 'red')
                } else {
        $('#search-result2').css({ opacity: 1.0 })
        $('#search-result2').html('Venue ID does not exist')
        $('#search-result2').css('color', 'green')
                }
            })
            .catch(function (error) {
                console.error(error);
            });
        
    })
    
    document.addEventListener("input", () => {
    const fld1 = !!document.querySelector("#site_event_id").value
    const fld2 = !!document.querySelector("#site_venue_id").value
    const fld3 = !!document.querySelector("#event_name").value;
    const fld4 = !!document.querySelector("#event_url").value;
    const fld5 = !!document.querySelector("#event_time").value;
    const fld6 = !!document.querySelector("#event_date").value;
    if(!!fld1 && !!fld2 && !!fld3 && !!fld4 && !!fld5 && !!fld6) {
    $("#buyfake").css("display", "none");
    $("#buybtn").css("display", "flex");
    }else {
    $("#buyfake").css("display", "flex");
    $("#buybtn").css("display", "none");
    }
    })
    
    document.addEventListener("input", () => {
    const fld11 = !!document.querySelector("#venueid").value;
    const fld22 = !!document.querySelector("#venuename").value;
    const fld33 = !!document.querySelector("#venueurl").value;
    const fld44 = !!document.querySelector("#venuecity").value;
    const fld55 = !!document.querySelector("#venuestate").value;
    const fld66 = !!document.querySelector("#venuecountry").value;
    const fld77 = !!document.querySelector("#venuetimezone").value;
    const fld88 = !!document.querySelector("#venuecapacity").value;
    const fld99 = !!document.querySelector("#zipcode").value;
    if(!!fld11 && !!fld22 && !!fld33 && !!fld44 && !!fld55 && !!fld66 && !!fld77 && !!fld88 && !!fld99) {
    $("#buyfake2").css("display", "none");
    $("#buybtn2").css("display", "flex");
    }else {
    $("#buyfake2").css("display", "flex");
    $("#buybtn2").css("display", "none");
    }
    })
    
    
    document.querySelector('#venueurl').addEventListener('keyup', (event) => {
    let val = document.querySelector('#venueurl').value
    if(val.includes('etix') && val.includes('/v/')){
    let val1 = 'https://www.etix.com/ticket/v/'
    let vsid = val.split('v/')[1]
    document.querySelector('#venueurl').value = val1 + vsid.split('/')[0]
    }if(val.includes('seetickets') && val.includes('=yes&s=')){
    
    let val1 = 'https://www.seetickets.us/wafform.aspx?_act=fullsearchv3&v3=yes&s='
    
    document.querySelector('#venueurl').value = val1 + (val.split('=yes&s=')[1])
    }
    });
    
    let venueid = document.querySelector('#venueid');
    let venueurl = document.querySelector('#venueurl');

    
    document.querySelector('#buybtn').addEventListener("click", () => {
    
    
    var inputElement = document.getElementById('event_date'); 
    var inputValue = inputElement.value;
    var formattedValue = inputValue.replace(/\//g, '-');
    inputElement.value = formattedValue;
    let eventurl = document.querySelector('#event_url').value;
    let prefix;
    let venueprefix;

if(eventurl.includes('ticketmaster.com') || eventurl.includes('livenation.com')){
prefix = 'tm'
venueprefix = 'tm'
}

if(eventurl.includes('axs.com')){
prefix = 'axs'
venueprefix = 'axs'
}


if(eventurl.includes('24tix')){
prefix = '24tix'
venueprefix = ''
}

if(eventurl.includes('admitone')){
prefix = 'admit'
venueprefix = ''
}

if(eventurl.includes('dice.fm')){
prefix = ''
venueprefix = ''
}

if(eventurl.includes('etix.com')){
prefix = 'etix'
venueprefix = 'etix'
}

if(eventurl.includes('eventbrite')){
prefix = 'ebrite'
venueprefix = 'ebrite'
}

if(eventurl.includes('evenue')){
prefix = ''
venueprefix = ''
}

if(eventurl.includes('freshtix')){
prefix = ''
venueprefix = ''
}


if(eventurl.includes('holdmyticket')){
prefix = 'hold'
venueprefix = ''
}


if(eventurl.includes('prekindle')){
prefix = 'pre'
venueprefix = ''
}

if(eventurl.includes('showclix')){
prefix = 'show'
venueprefix = 'show'
}

if(eventurl.includes('ticketweb')){
prefix = 'tweb'
venueprefix = 'tweb'
}

if(eventurl.includes('ticketswest')){
prefix = ''
venueprefix = ''
}

if(eventurl.includes('tixr')){
prefix = 'tixr'
venueprefix = 'tixr'
}


if(eventurl.includes('gruenehall')){
prefix = ''
venueprefix = ''
}


if(eventurl.includes('meowwolf')){
prefix = ''
venueprefix = ''
}


if(eventurl.includes('stubs.net')){
prefix = 'stubs'
venueprefix = 'stubs'
}


if(eventurl.includes('stubwire')){
prefix = 'stub'
venueprefix = ''
}

if(eventurl.includes('universe.com')){
prefix = 'unv'
venueprefix = ''
}

if(eventurl.includes('thevogue')){
prefix = ''
venueprefix = ''
}

if(eventurl.includes('mpv.tickets')){
prefix = 'mpv'
venueprefix = ''
}

if(eventurl.includes('frontgatetickets')){
prefix = ''
venueprefix = ''
}


if(eventurl.includes('amptickets')){
prefix = 'amp'
venueprefix = ''
}


if(eventurl.includes('zoukgrouplv')){
prefix = 'zouk-'
venueprefix = 'zouk-'
}


if(eventurl.includes('seetickets.us')){
prefix = 'see'
venueprefix = ''
}



    let venueid =  document.querySelector('#site_venue_id').value;
    let eventid =  document.querySelector('#site_event_id').value;

    let eventname = document.querySelector('#event_name').value;
    let eventtime = document.querySelector('#event_time').value;
    let eventdate = document.querySelector('#event_date').value;
    let addedby = document.querySelector('#username').textContent;
    
    var endpointUrl = "https://ubik.wiki/api/create/primary-events/";
    
    var params = {
      "site_event_id": prefix + eventid,
      "site_venue_id": venueprefix + venueid,
      "name": eventname,
      "event_url": eventurl,
      "time": eventtime,
      "date": eventdate,
      "added_by": addedby
    };
    
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params)
    })
    .then(response => {

        response.text().then(text => {
            error = text
            document.querySelector('#errortext').textContent = "Error: " + error
          });

      if (response.status === 200 || response.status === 201) {
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#Item-Container').style.display = "none";
    setTimeout(() => {
    window.location.href = "/add-event";
    }, 2000);
    
      } else {

    document.querySelector('#loading').style.display = "none";
    document.querySelector('#Item-Container').style.display = "flex";
      document.querySelector('#errortext').style.display = 'flex';
    
      }
    })
    .then(data => {
      // Handle the response data or error message here
    })
    .catch(error => {
        
      console.log(error);
      document.querySelector('#loading').style.display = "none";
      document.querySelector('#Item-Container').style.display = "flex";
    
      document.querySelector('#errortext').style.display = 'flex';
    
      document.querySelector('#errortext').textContent = error;
    });
    })
    
    
    
    document.querySelector('#buybtn2').addEventListener("click", () => {
    
    var venueUrl = document.querySelector('#venueurl').value
    var result = "";
    
    if (venueUrl.includes("ticketmaster.com") || venueUrl.includes("livenation.com")) {
    result = "tm";
    }
    else if (venueUrl.includes("axs.com")) {
        result = "axs";
    }
    else if (venueUrl.includes("etix.com")) {
        result = "etix";
     }
     else if (venueUrl.includes("eventbrite")) {
        result = "ebrite";
     }
     else if (venueUrl.includes("showclix")) {
        result = "show";
     }
     else if (venueUrl.includes("ticketweb")) {
        result = "tweb";
     }
     else if (venueUrl.includes("tixr")) {
        result = "tixr";
     }
     else if (venueUrl.includes("zoukgrouplv")) {
        result = "zouk-";
     }
     else if (venueUrl.includes("stubs.net")) {
        result = "stubs";
     } 
     else {
        result = "";
     }

        venueids = result + document.querySelector('#venueid').value    
        
        let venuename = document.querySelector('#venuename').value
        let venueurl = document.querySelector('#venueurl').value
        let venuecity = document.querySelector('#venuecity').value
        let venuestate = document.querySelector('#venuestate').value
        let venuecountry = document.querySelector('#venuecountry').value
        let venuetimezone = document.querySelector('#venuetimezone').value
        let venuecapacity = document.querySelector('#venuecapacity').value
        let venuezip = document.querySelector('#zipcode').value
        let stubhuburl = document.querySelector('#stubhuburl').value
        let vividseatsurl = document.querySelector('#vividseatsurl').value
        let addedbyt = document.querySelector('#username').textContent
        let shid = document.querySelector('#stubhuburl').value.replace(/[^0-9]/g, '');
        
        if(document.querySelector('#stubhuburl').value.includes('/venue/')){
        let shid = document.querySelector('#stubhuburl').value.split('venue/')[1].replace("/", "")}
        let vsid = document.querySelector('#vividseatsurl').value.replace(/[^0-9]/g, '');
        
        if(document.querySelector('#vividseatsurl').value.includes('/venue/')){
        let vsid = document.querySelector('#vividseatsurl').value.split('venue/')[1].replace("/", "")}
        
        else if(document.querySelector('#vividseatsurl').value.includes('/performer/')){
        let vsid = document.querySelector('#vividseatsurl').value.split('performer/')[1].replace("/", "");
        }
    
        var endpointUrl = "https://ubik.wiki/api/create/venues/";
        
        var params = {
            "site_venue_id": venueids,
            "added_by":addedbyt,
            "name":venuename,
            "venue_url":venueurl,
            "city":venuecity,
            "state":venuestate,
            "country":venuecountry,
            "timezone":venuetimezone,
            "capacity":venuecapacity,
            "zip_code":venuezip,
            "vivid_url":vividseatsurl,
            "stubhub_url":stubhuburl,
            "vivid_venue_id":vsid,
            "stubhub_venue_id":shid,
            "source_site":result
        }
        
        fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(params)
        })
        .then(response => {
            response.text().then(text => {
            document.querySelector('#errortext2').textContent = "Error: " + text;
            });
            
          if (response.status === 200 || response.status === 201) {
        document.querySelector('#loading').style.display = "flex";
        document.querySelector('#Item-Container').style.display = "none";
        setTimeout(() => {
        window.location.href = "/add-event";
        }, 2000);
        
        } else {

        document.querySelector('#loading').style.display = "none";
        document.querySelector('#Item-Container').style.display = "flex";
        document.querySelector('#errortext2').style.display = 'flex';
        }
        })
        .then(data => {
          // Handle the response data or error message here
        })
        .catch(error => {
        
          console.log(error);
          document.querySelector('#loading').style.display = "none";
          document.querySelector('#Item-Container').style.display = "flex";
          document.querySelector('#errortext2').style.display = 'flex';
          document.querySelector('#errortext2').textContent = "Error: Venue Already Exists:"
        });
        })
        
    
    

