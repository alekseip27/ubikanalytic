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
        
        document.querySelector('#search-button').addEventListener("click", () => {
        document.querySelector('#loading').style.display = "flex";
        document.querySelector('#flexbox').style.display = "none";
            
      var searchbar1 = document.getElementById('searchbar1');
      searchbar1.value = searchbar1.value.trimEnd();
      var searchbar2 = document.getElementById('searchbar2');
      searchbar2.value = searchbar2.value.trimEnd();
      var searchbar3 = document.getElementById('searchbar3');
      searchbar3.value = searchbar3.value.trimEnd();
      var searchbar4 = document.getElementById('searchbar4');
      searchbar4.value = searchbar4.value.trimEnd();
      
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value)
    let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value)
    let keywords4 = encodeURIComponent(document.getElementById('searchbar4').value)
    $('.event-box').hide()
    
    let baseUrl = 'https://ubik.wiki/api/primary-events/?';
    let params = [];
    
    if (keywords1.length > 0) {
        params.push('name__icontains=' + keywords1.replaceAll("'", "''"));
    }

    if (keywords2.length > 0) {
        params.push('site_event_id__icontains=' + keywords2.replaceAll("'", "''"));
    }

    if (keywords3.length > 0) {
        params.push('venue__icontains=' + keywords3.replaceAll("'", "''"));
    }
    if (keywords4.length > 0) {
        params.push('site_venue_id__icontains=' + keywords4.replaceAll("'", "''"));
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
            const evid = encodeURIComponent(events.site_event_id)
            const eventdate = card.getElementsByClassName('main-text-date')[0]
            
            card.setAttribute('id', '');
            card.setAttribute('checked','false')
            card.setAttribute('name', events.name);

          
           if(events.date){
            card.setAttribute('date', events.date.slice(0, 10).replaceAll("-","/"));
            card.setAttribute('vivid_ed', events.date.slice(0,10));   
               
            var tdate = events.date.slice(0, 10).replaceAll("-","/")
            tdate = [tdate.slice(5), tdate.slice(0,4)].join('/');
            eventdate.textContent = tdate
            
           }



                
            card.setAttribute('eventid', evid);
            card.setAttribute('time', events.time.slice(0, 8));
            card.setAttribute('source', events.scraper_name);
            card.setAttribute('vivid_id', events.vdid);
    
            card.addEventListener('click', function(){
            document.querySelector('#errortext').textContent = ''
            document.querySelector(".edit-wrapper").style.display = 'flex'
            document.querySelector('#editname').value = events.name
            document.querySelector('#editdate').value = events.date
            document.querySelector('#edittime').value = events.time
            document.querySelector('#editeventid').value = events.site_event_id
            document.querySelector('#editvenueid').value = events.site_venue_id
            document.querySelector('#editurl').value = events.event_url
            document.querySelector('#editsource').value = events.scraper_name
            })

            card.style.display = 'flex';
            
            const eventname = card.getElementsByClassName('main-text-event')[0]
            eventname.textContent = events.name;
            if(eventname.textContent.length>10) {
            eventname.textContent = events.name.slice(0, 10)+'..'
            }
            
            const eventur = card.getElementsByClassName('main-text-urls')[0]
            eventur.textContent = events.event_url;

            if(eventur.textContent.length>15) {
            eventur.textContent = events.event_url.slice(0, 15)+'..'
            }
            
            const eventid = card.getElementsByClassName('main-text-event-id')[0]
            eventid.textContent = events.site_event_id;

            const venue = card.getElementsByClassName('main-text-venue')[0]
            venue.textContent = events.venue;

            if(eventid.textContent.length>10) {
            eventid.textContent = events.site_event_id.slice(0, 10)+'..'
            }


            const deletebutton = card.getElementsByClassName('main-edit-button')[0]
            const evids = card.getAttribute('eventid');
            deletebutton.addEventListener('click',function(){
            document.querySelector('.edit-wrapper').style.display = 'none'
                
                const url = `https://ubik.wiki/api/delete/primary-events/${evids}`+"/";

                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer acf84a57bf2522fe825ea158d1dc38ef9c9a41e6',
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(data => {
                card.style.display = 'none';
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            })




            const venueid = card.getElementsByClassName('main-text-venue-id')[0]
            venueid.textContent = events.site_venue_id;
             
            let eventtime = card.getElementsByClassName('main-text-time')[0]
            eventtime.textContent = events.time.slice(0, 8)
        
            let txtsource = card.getElementsByClassName('main-textsource')[0]
            txtsource.textContent = events.scraper_name

            let addedby = card.getElementsByClassName('main-addedby')[0]
            addedby.textContent = events.added_by

            let timeadded = card.getElementsByClassName('main-timeadded')[0]
            timeadded.textContent = events.date_created
                
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
    
