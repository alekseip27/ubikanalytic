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
  let keywords3 = document.getElementById('countryselect').value

  let favoritecbox = document.getElementById('favorite').checked

  $('.event-box').hide()

  let baseUrl = 'https://ubik.wiki/api/event-venue/?';
  let params = [];
  
  if (keywords1.length > 0) {
      params.push('event_name__icontains=' + keywords1.replaceAll("'", "''"));
  }
  
  if (keywords2.length > 0) {
      params.push('venue_name__icontains=' + keywords2.replaceAll("'", "''"));
  }

  if (keywords3 === 'uscanada') {
      params.push('country__icontains=USA&country__icontains=Canada');
  }

  if (keywords3 === 'international') {
      params.push('country__idoesnotcontains=USA&country__idoesnotcontains=Canada');
  }

  if (favoritecbox) {
    params.push('&favorites__iexact=true');
}

  
  params.push('limit=100');
  
  let xanoUrl = baseUrl + params.join('&');
  
          function getEvents() {
          
          let request = new XMLHttpRequest();
          let url = xanoUrl
          
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
          const evid = encodeURIComponent(events.site_event_id)
          const eventdate = card.getElementsByClassName('main-text-date')[0]
          
          card.setAttribute('id', '');
          card.setAttribute('checked','false')
          card.setAttribute('name', events.event_name);
              
          card.setAttribute('country', events.country);
        
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
          card.setAttribute('source', events.scraper_name);
          card.setAttribute('vivid_id', events.vdid);
          card.setAttribute('capacity', events.venue_capacity);
  
  
  const purchasedamount = card.getElementsByClassName('main-text-purchased')[0];
      
  if ((events.purchased_amount) && (events.purchased_amount !== null || events.purchased_amount !== 0)) {
    card.setAttribute('purchased', parseInt(events.purchased_amount,10))
    purchasedamount.textContent = parseInt(events.purchased_amount, 10).toString();
  }
  
  
  const status = card.getElementsByClassName('main-text-status')[0];
  
  if (events.status) {
  status.textContent = events.status
  }
function vschartdata(VDID) {

  chartvs.data.datasets[0].data = []
  chartvs.data.datasets[1].data = []
  chartvs.data.datasets[2].data = []
  chartvs.data.datasets[3].data = []
  chartvs.data.datasets[4].data = []
  chartvs.data.datasets[5].data = []
  chartvs.data.datasets[6].data = []
  chartvs.data.datasets[7].data = []
  chartvs.data.datasets[0].label = "Total"
  chartvs.data.datasets[1].label = ""
  chartvs.data.datasets[2].label = ""
  chartvs.data.datasets[3].label = ""
  chartvs.data.datasets[4].label = "Lowest Price"
  chartvs.data.datasets[5].label = ""
  chartvs.data.datasets[6].label = ""
  chartvs.data.datasets[7].label = ""
  chartvs.config.data.labels = []
  chartvs.update();
  document.querySelector('#vsloader').style.display = 'flex';
  document.querySelector('#vserror').style.display = 'none';
  document.querySelector('#vschart').style.display = 'none';

const url = `https://ubik.wiki/api/vividseats/${VDID}/?format=json`;  // Fixed the stray "


const headers = new Headers({
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json; charset=utf-8',
});

// Create the request object
const request = new Request(url, {
method: 'GET',
headers: headers
});

// Use the fetch API to make the GET request
fetch(request)
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

if(str){

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



} else {
  document.querySelector('#vsloader').style.display = 'none';
  document.querySelector('#vschart').style.display = 'none';
  document.querySelector('#vserror').style.display = 'flex';


}


})
.catch(error => {
console.error("Error:", error);
document.querySelector('#vsloader').style.display = 'none';
document.querySelector('#vschart').style.display = 'none';
document.querySelector('#vserror').style.display = 'flex';
});
}

      const charticon = card.getElementsByClassName('main-text-chart')[0];

      async function getchartprimary(){
                  chart.data.datasets[0].label = ''
                  chart.data.datasets[0].data = []
                  chart.config.data.labels = []
                  chart.update();
                  document.querySelector('#tmloader').style.display = 'flex';
                  document.querySelector('#tmerror').style.display = 'none';
                  document.querySelector('#tmchart').style.display = 'none';
          let mainurl = events.event_url
          let amountsprimary = [];
          let datesprimary = [];

          const headers = new Headers({
          'Authorization': `Bearer ${token}`
            });
          
            fetch(`https://ubik.wiki/api/primary-events/?event_url__icontains=${mainurl}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
          .then(response => {
          
          if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
          })
          .then(data => {
              let event = data.results[0];
              let counts = event.counts;

              let source = event.scraper_name
            
              chart.data.datasets[0].label = source.toUpperCase() + ' Primary'
              evids = event.site_event_id
              if (counts && counts.length > 0 && !source.includes('tm')) {
              document.querySelector('#tmurl').style.display = 'none'
              for (var i = 0; i < counts.length; i++) {
              amountsprimary.push(Math.round(counts[i].primary_amount));
              datesprimary.push(counts[i].scrape_date);
              }
                  // Sorting dates and corresponding amounts
                  const indices = Array.from({ length: datesprimary.length }, (_, i) => i);
                  indices.sort((a, b) => new Date(datesprimary[a]) - new Date(datesprimary[b]));
                  amountsprimary = indices.map(i => amountsprimary[i]);
                  datesprimary = indices.map(i => datesprimary[i]);
      
                  // Update chart data
                  chart.data.datasets[0].data = amountsprimary;
                  chart.config.data.labels = datesprimary;
                  chart.update();

                  // Update display elements
                  document.querySelector('#tmloader').style.display = 'none';
                  document.querySelector('#tmerror').style.display = 'none';
                  document.querySelector('#tmchart').style.display = 'flex';
      
              } else {
                  document.querySelector('#tmloader').style.display = 'none';
                  document.querySelector('#tmerror').style.display = 'flex';
                  document.querySelector('#tmchart').style.display = 'none';
      }
      })
      .catch(error => {
      console.error('There was an error fetching the data:', error);
      });
      }

  
      charticon.addEventListener('click', function () {
                  chart.data.datasets[0].label = ''
                  chart.data.datasets[0].data = []
                  chart.config.data.labels = []
                  chart.update();
                  document.querySelector('#tmloader').style.display = 'flex';
                  document.querySelector('#tmerror').style.display = 'none';
                  document.querySelector('#tmchart').style.display = 'none';
          
          vschartdata(events.vdid)
          document.querySelector('#graph-overlay').style.display = 'flex';
          document.querySelector('#closecharts').style.display = 'flex'
          if (events.scraper_name === 'ticketmaster') {
          document.querySelector('#tmurl').href = 'http://142.93.115.105:8100/event/' + evid + "/details/"
       
          let dates = [];
          let amounts = [];
          var http = new XMLHttpRequest();
          var url = "https://shibuy.co:8443/142data?eventid=" + evid
          http.open("GET", url, true);
          http.setRequestHeader("Content-type", "application/json; charset=utf-8");
          http.setRequestHeader('Authorization', `Bearer ${token}`);
          
          
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
            chart.data.datasets[0].label = 'TM Total'
            chart.data.datasets[0].data = sortedAmounts;
            chart.config.data.labels = sortedDates;
            chart.update();
            document.querySelector('#tmloader').style.display = 'none';
            document.querySelector('#tmchart').style.display = 'flex';
            document.querySelector('#tmerror').style.display = 'none';
          };
          
          http.send();
      
      
      } else {


getchartprimary()


}
});
          

let count = events.counts
let src = events.scraper_name
if (count && count.length > 0 && !src.includes('ticketmaster')) {
charticon.style.display = 'flex'
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
  
function updatedata(eventid){
  const url = 'https://ubik.wiki/api/update/primary-events/'+eventid+'/';
  
  const date1 = new Date();
  let date2 = 
  date1.toLocaleString('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  })
  
let currentdate = date2.replace(',','')

  const options = {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    "site_event_id":eventid,
    "status":"sold out",
    "previous_status":currentdate
    })
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      // Handle the response of the PUT request
      console.log(data);
    })
    .catch(error => {
      // Handle errors from the PUT request
      console.error('Error:', error);
    });


}

const scrapetm = (eventid) => {
  const url = 'https://shibuy.co:8443/scrapeurl'; 

  const data = {
    eventid: eventid
  };
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data) // Convert data to JSON format
  };

  const request = fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      scrapeurl(eventid)
      console.log(data);
      const checktrue = data.amounts.some(item => item.amount === undefined || item.amount < 50);
      if(checktrue){
      updatedata(eventid)
    }})
    .catch(error => {
      const searchText = 'No amounts available';
      const includesText = Object.keys(data).some(key => key.includes(searchText));
      if(includesText){
        console.log(error)
        primrem.textContent = 'unavailable';
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
          
          
          if(events.scraper_name === 'ticketmaster' && !evid.startsWith('Z') && evid.length == 16) {
          primrem.textContent = '0'
          dpd.textContent = '0'
          fetchEventData(events.site_event_id)
          rescrapebutton.style.display = 'flex'
          scrapebutton.style.display = 'flex'
          }
          
          card.style.display = 'flex';
          
          const buybutton = card.getElementsByClassName('main-buy-button')[0]
          buybutton.addEventListener('click', function() {
          window.location.assign('https://www.ubikanalytic.com/event?id=' + evid)
          });
          
          const mbutton = card.getElementsByClassName('manualbutton')[0]
          mbutton.addEventListener('click', function() {
          window.location.assign('https://www.ubikanalytic.com/buy-manual?id=' + evid)
          });
          
          const eventname = card.getElementsByClassName('main-text-event')[0]
          eventname.textContent = events.event_name;
          if(eventname.textContent.length>10) {
          eventname.textContent = events.event_name.slice(0, 10)+'...'
          }
          
           const eventur = card.getElementsByClassName('main-text-url')[0]
           eventur.textContent = events.event_url

           const counts = events.counts
          let source = ''
          if(events.scraper_name){
           const source = events.scraper_name.toLowerCase()
          }

           function getTwoLatestCounts(counts) {
              // Parsing dates and sorting the array in descending order by date
              counts.sort((a, b) => {
                  const dateA = new Date(a.scrape_date);
                  const dateB = new Date(b.scrape_date);
                  return dateB - dateA; // For descending order
              });
          
              // Returning the first two elements of the sorted array
              return counts.slice(0, 2);
          }

           function getLatestCount(counts) {
              // Parsing dates and sorting the array in descending order by date
              counts.sort((a, b) => {
                  const dateA = new Date(a.scrape_date);
                  const dateB = new Date(b.scrape_date);
                  return dateB - dateA; // For descending order
              });
          
              // Returning the first element of the sorted array
              return counts[0];
          }

           if(counts && source !== 'tm' && source !== 'ticketmaster'){
          const latestCount = getLatestCount(counts)
          const primamount = card.getElementsByClassName('main-text-primary')[0]
          primamount.textContent = parseFloat(latestCount.primary_amount)
          card.setAttribute('primaryamount',parseFloat(latestCount.primary_amount))
          const aday = card.getElementsByClassName('main-text-aday')[0]

          if(counts.length>1){
          let twolatest = getTwoLatestCounts(counts)
          let difference = Math.abs(parseFloat(twolatest[0].primary_amount) - parseFloat(twolatest[1].primary_amount));
          aday.textContent = difference
          card.setAttribute('perday',difference)
          }
          }

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
          txtsource.textContent = events.scraper_name

          let eventUrl = events.event_url
          
          switch(true) {
            case eventUrl.includes('ticketmaster'):
              txtsource.textContent = 'TM';
              break;
            case eventUrl.includes('livenation'):
              txtsource.textContent = 'TM';
              break;
            case eventUrl.includes('24tix'):
              txtsource.textContent = '24TIX';
              break;
            case eventUrl.includes('admitone'):
              txtsource.textContent = 'ADMIT1';
              break;
            case eventUrl.includes('axs'):
              txtsource.textContent = 'AXS';
              break;
            case eventUrl.includes('dice'):
              txtsource.textContent = 'DICE';
              break;
            case eventUrl.includes('etix'):
              txtsource.textContent = 'ETIX';
              break;
            case eventUrl.includes('eventbrite'):
              txtsource.textContent = 'EBRITE';
              break;
            case eventUrl.includes('freshtix'):
              txtsource.textContent = 'FRESH';
              break;
            case eventUrl.includes('frontgate'):
              txtsource.textContent = 'FGATE';
              break;
            case eventUrl.includes('holdmyticket'):
              txtsource.textContent = 'HOLDMT';
              break;
            case eventUrl.includes('prekindle'):
              txtsource.textContent = 'PRE';
              break;
            case eventUrl.includes('seetickets'):
              txtsource.textContent = 'SEETIX';
              break;
              case eventUrl.includes('showclix'):
              txtsource.textContent = 'SHOW';
              break;
            case eventUrl.includes('ticketweb'):
              txtsource.textContent = 'TWEB';
              break;
            case eventUrl.includes('ticketswest'):
              txtsource.textContent = 'TWEST';
              break;
            case eventUrl.includes('tixr'):
              txtsource.textContent = 'TIXR';
              break;
            case eventUrl.includes('stubwire'):
              txtsource.textContent = 'STUBW';
              break;
            case eventUrl.includes('fgtix'):
              txtsource.textContent = 'FGATE';
              break;
            case eventUrl.includes('evenue'):
              txtsource.textContent = 'EVENUE';
              break;
            case eventUrl.includes('gruenehall'):
              txtsource.textContent = 'gruenehall';
              break;
            case eventUrl.includes('meowwolf'):
              txtsource.textContent = 'MEOW';
              break;
            case eventUrl.includes('thevogue.com'):
              txtsource.textContent = 'thevogue';
              break;
            default:
              txtsource.textContent = 'OTHER';
              break;
          }
          

          if(events.scraper_name.includes('ticketmaster') || events.scraper_name.includes('livenation')) {
              
          txtsource.addEventListener('click',function(){
          window.open('http://142.93.115.105:8100/event/' + evid +'/details/', "142")
          });
          txtsource.classList.add("clickable");
          }
  
          if(events.hidden === 'true'){
          card.style.display = "none";
          }
  
          const eventurl = events.event_url
          
          const hidebtn = card.getElementsByClassName('hidebtn')[0]
          let eventid = evid
          hidebtn.addEventListener('click', function() {
  
  
          var http = new XMLHttpRequest();
          var url = "https://ubik.wiki/api/update/primary-events/"+evid + "/";
          var params = JSON.stringify({
          "site_event_id": eventid,
          "hidden": "true"
          })
          http.open("PUT", url, true);
          http.setRequestHeader("Content-type", "application/json; charset=utf-8");
          http.setRequestHeader('Authorization', `Bearer ${token}`);
          http.send(params);
          card.style.display = "none";
          });
              



//

const checkbox = card.getElementsByClassName('main-checkbox-favorite')[0]

checkbox.checked = events.favorites
let eventids = evid


checkbox.addEventListener('click', function() {


var http = new XMLHttpRequest();
var url = "https://ubik.wiki/api/update/primary-events/"+evid + "/";
var params = JSON.stringify({
"site_event_id": eventids,
"favorites": checkbox.checked
})
http.open("PUT", url, true);
http.setRequestHeader("Content-type", "application/json; charset=utf-8");
http.setRequestHeader('Authorization', `Bearer ${token}`);
http.send(params);
});

//



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
