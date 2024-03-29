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
        cancelFetchRequests();
        document.querySelector('#loading').style.display = "flex";
        document.querySelector('#flexbox').style.display = "none";
            
      var searchbar1 = document.getElementById('searchbar1');
      searchbar1.value = searchbar1.value.trimEnd();
      
      var searchbar2 = document.getElementById('searchbar2');
      searchbar2.value = searchbar2.value.trimEnd();
    
    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value)
    $('.event-box').hide()
    
    let baseUrl = 'https://ubik.wiki/api/event-venue/?';
    let params = [];
    
    if (keywords1.length > 0) {
        params.push('event_name__icontains=' + keywords1.replaceAll("'", "''"));
    }
    
    if (keywords2.length > 0) {
        params.push('&venue_name__icontains=' + keywords2.replaceAll("'", "''"));
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
            const evid = events.site_event_id
            const eventdate = card.getElementsByClassName('main-text-date')[0]
            
            card.setAttribute('id', '');
            card.setAttribute('checked','false')
            card.setAttribute('name', events.event_name);
          
           if(events.date){
            card.setAttribute('date', events.date.slice(0, 10).replaceAll("-","/"));
            card.setAttribute('vivid_ed', events.date.slice(0,10));   
               
            var tdate = events.date.slice(0, 10).replaceAll("-","/")
            tdate = [tdate.slice(5), tdate.slice(0,4)].join('/');
            eventdate.textContent = tdate
            
           }
                
            card.setAttribute('eventid', evid);
            
            card.setAttribute('time', events.time.slice(0, 8));
            card.setAttribute('venue', events.venue_name);
            card.setAttribute('source', events.source_site);
            card.setAttribute('vivid_id', events.vdid);
            card.setAttribute('capacity', events.venue_capacity);
    


    
                
        function vschartdata(VDID) {
        
        const url = `https://ubik.wiki/api/vividseats/${VDID}/?format=json`;  // Fixed the stray "
        
        
        // Use the fetch API to make the GET request
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
          .then(response => {
            if (response.ok) {
              document.querySelector('#vsloader').style.display = 'none';
              document.querySelector('#vschart').style.display = 'flex';
              document.querySelector('#vserror').style.display = 'none';
              return response.json();
            } else {
              document.querySelector('#vsloader').style.display = 'none';
              document.querySelector('#vschart').style.display = 'none';
              document.querySelector('#vserror').style.display = 'flex';
              throw new Error("Failed to fetch data");
            }
          })
          .then(data => {
            const str = data.results[0].data_scrapes;
            
            // Replace single quotes with double quotes
            const replacedStr = str.replace(/'/g, '"');
            
              const correctedData = replacedStr.replace(/:\s*None,/g, ':"None",');
            let datas;
        
            try {
              datas = JSON.parse(correctedData);
            console.log(datas[0])
        
            } catch (e) {
              // If parsing fails, log the error
              console.error("Parsing failed:", e);
            }
        
            // Extract chart labels and data from the fetched data
            const labels = datas.map(item => item.scrape_datetime).reverse();
            const totalCount = datas.map(item => item.total_count).reverse();
            const pref1Count = datas.map(item => item.pref1_count).reverse();
            const pref2Count = datas.map(item => item.pref2_count).reverse();
            const pref3Count = datas.map(item => item.pref3_count).reverse();
            const lowestprice = datas.map(item => item.lowest_price).reverse();
            const pref1lowest = datas.map(item => item.pref1_lowest).reverse();
            const pref2lowest = datas.map(item => item.pref2_lowest).reverse();
            const pref3lowest = datas.map(item => item.pref3_lowest).reverse();
            
            const p1name = datas[0].pref1_title
            const p2name = datas[0].pref2_title
            const p3name = datas[0].pref3_title
        
            // Update chart
            chartvs.data.labels = labels;
            chartvs.data.datasets[0].data = totalCount;
            chartvs.data.datasets[1].data = pref1Count;
            chartvs.data.datasets[2].data = pref2Count;
            chartvs.data.datasets[3].data = pref3Count;
              
            chartvs.data.datasets[4].data = lowestprice;
              
            chartvs.data.datasets[5].data = pref1lowest;
            chartvs.data.datasets[6].data = pref2lowest;
            chartvs.data.datasets[7].data = pref3lowest;
            
            chartvs.data.datasets[1].label = p1name
            chartvs.data.datasets[2].label = p2name
            chartvs.data.datasets[3].label = p3name
        
            chartvs.data.datasets[5].label = p1name + ' Lowest Price'
            chartvs.data.datasets[6].label = p2name + ' Lowest Price'
            chartvs.data.datasets[7].label = p3name + ' Lowest Price'
              
            chartvs.update();
          })
          .catch(error => {
            console.error("Error:", error);
             document.querySelector('#vsloader').style.display = 'none';
              document.querySelector('#vschart').style.display = 'none';
              document.querySelector('#vserror').style.display = 'flex';
          });
        }
        
        
        const charticon = card.getElementsByClassName('main-text-chart')[0];
        
        
        charticon.addEventListener('click', function () {
            vschartdata(events.vdid)
            document.querySelector('#graph-overlay').style.display = 'flex';
            if (events.source_site === 'TM') {
            document.querySelector('#tmurl').href = 'http://142.93.115.105:8100/event/' + evid + "/details/"
         
            let dates = [];
            let amounts = [];
            var http = new XMLHttpRequest();
            var url = "https://shibuy.co:8443/142data?eventid=" + evid
            http.open("GET", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            
            // Set a timeout for the request (5 seconds)
            const requestTimeout = 5000; // 5 seconds
            
            // Create a timer to log an error if the request takes too long
            const timeoutTimer = setTimeout(() => {
              document.querySelector('#tmloader').style.display = 'none';
              document.querySelector('#tmerror').style.display = 'flex';
              document.querySelector('#tmchart').style.display = 'none';
              http.abort(); // Abort the request
            }, requestTimeout);
            
            http.onload = function () {
              // Clear the timeout timer since the request has completed
              clearTimeout(timeoutTimer);
            
              let data = JSON.parse(this.response);
            
              data.forEach(event => {
                event.summaries.forEach(summary => {
                  // Assuming there is an array called sections, and you want to sum the amount from all sections
                  const totalAmount = summary.sections.reduce((accumulator, section) => accumulator + section.amount, 0);
            
                  // Parse the date string into components
                  const parts = summary.scrape_date.split(/[-T:Z]/);
                  const year = parseInt(parts[0], 10);
                  const month = parseInt(parts[1] - 1, 10);
                  const day = parseInt(parts[2], 10);
                  const hours = parseInt(parts[3], 10);
                  const minutes = parseInt(parts[4], 10);
            
                  // Create a Date object with the components and subtract 4 hours
                  const scrapeDate = new Date(year, month, day, hours, minutes);
                  scrapeDate.setHours(scrapeDate.getHours() - 1);
            
                  // Format the date as a string
                  const formattedDate = scrapeDate.toISOString().slice(0, 16).replace("T", " ");
            
                  dates.push({ date: scrapeDate.toISOString(), formattedDate: formattedDate, amount: totalAmount });
                });
              });
            
              // Sort the dates array by ISO date string (oldest to newest)
              dates.sort((a, b) => a.date.localeCompare(b.date));
            
              // Extract formatted dates and amounts after sorting
              const sortedDates = dates.map(item => item.formattedDate);
              const sortedAmounts = dates.map(item => item.amount);
              console.log(sortedAmounts);
            
              chart.data.datasets[0].data = sortedAmounts;
              chart.config.data.labels = sortedDates;
              chart.update();
              document.querySelector('#tmloader').style.display = 'none';
              document.querySelector('#tmchart').style.display = 'flex';
              document.querySelector('#tmerror').style.display = 'none';
            };
            
            http.send();
        
        
        }
        });
                
              if (events.source_site !== 'TM' || events.vdid.length === 0 ) {
        charticon.style.display = 'none'
              }
                
            const primrem = card.getElementsByClassName('main-text-primary')[0]
            const dpd = card.getElementsByClassName('main-text-aday')[0]
            primrem.textContent = ''
          
          const scrapeurl = (eventid) => {
            const url = 'https://shibuy.co:8443/primaryurl?eventid=' + eventid;
          
            const request = fetch(url)
              .then(response => response.json())
              .then(data => {
                if (typeof data.count === 'number' && data.count !== 0) {
                  primrem.textContent = data.count;
                } else {
                  primrem.textContent = 'unknown'
                }
                  
                if (typeof data.diffperday === 'number') {
                  dpd.textContent = data.diffperday;
                }
              })
              .catch(error => {
                console.log('Error:', error);
              });
          };
    
                
        const scrapetm = (eventid) => {
          const url = 'https://shibuy.co:8443/scrapeurl';
        
          const data = {
            eventid: eventid
          };
        
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: JSON.stringify(data) // Convert data to JSON format
          };
        
          const request = fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data);
        scrapeurl(eventid)
            })
            .catch(error => {
        if(error.includes('No amounts available')){
        primrem.textContent = 'unavailable'
        }
            });
        };
          
     
            
            let rescrapebutton = card.getElementsByClassName('re-scrape-div')[0]
            
            let scrapebutton = card.getElementsByClassName('scrape-div-fresh')[0]
            
            
            scrapebutton.addEventListener('click',function(){
            scrapetm(evid)
            primrem.textContent = ''
            dpd.textContent = ''
            })
            
            
            rescrapebutton.addEventListener('click',function(){
            primrem.textContent = ''
            dpd.textContent = ''
            scrapeurl(evid)
            })
            
            
            if(events.source_site == 'TM' && !evid.startsWith('Z') && evid.length == 16) {
            primrem.textContent = '0'
            dpd.textContent = '0'
            fetchEventData(events.site_event_id)
            rescrapebutton.style.display = 'flex'
            scrapebutton.style.display = 'flex'
            }
            
        
            card.style.display = 'flex';
 
            const eventname = card.getElementsByClassName('main-text-event')[0]
            eventname.textContent = events.event_name;
            if(eventname.textContent.length>10) {
            eventname.textContent = events.event_name.slice(0, 10)+'...'
            }
            
             const eventur = card.getElementsByClassName('main-text-url')[0]
             eventur.textContent = events.event_url
             
             
            let eventtime = card.getElementsByClassName('main-text-time')[0]
            eventtime.textContent = events.time.slice(0, 8)
            
            const eventvenue = card.getElementsByClassName('main-text-venue')[0]
            eventvenue.textContent = events.venue_name
            if(eventvenue.textContent.length>13) {
            eventvenue.textContent = events.venue_name.slice(0, 13)+'...'
            }
            
            const eventlocation = card.getElementsByClassName('main-text-location')[0]
            eventlocation.textContent = events.city
            
            const capacity = card.getElementsByClassName('main-text-capacity')[0]
            capacity.textContent = events.venue_capacity
    
            let txtsource = card.getElementsByClassName('main-textsource')[0]
            txtsource.textContent = events.source_site
            
            if(events.source_site == 'TM') {
                
            txtsource.addEventListener('click',function(){
            window.open('http://142.93.115.105:8100/event/' + evid +'/details/', "142")
            });
            txtsource.classList.add("clickable");
            }
    
    
            if(events.hidden === 'true'){
            card.style.display = "none";
            }
    
            const eventurl = events.event_url
                
            
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
           searchcompleted = true
                
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
