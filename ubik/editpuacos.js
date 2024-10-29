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

   var input = document.getElementById("searchbar3");
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

    let keywords1 = encodeURIComponent(document.getElementById('searchbar1').value)
    let keywords2 = encodeURIComponent(document.getElementById('searchbar2').value)
    let keywords3 = encodeURIComponent(document.getElementById('searchbar3').value)

    $('.event-box').hide()

    let baseUrl = 'https://ubik.wiki/api/purchasing-accounts/?';
    let params = [];

    if (keywords1.length > 0) {
        params.push('email__icontains=' + keywords1)
    }

    if (keywords2.length > 0) {
        params.push('state__icontains=' + keywords2)
    }

    if (keywords3.length > 0) {
        params.push('phone_number__icontains=' + keywords3)
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
            const idcard =  events.id

            card.setAttribute('id', '');
            card.setAttribute('cardid', idcard);

            card.setAttribute('source', events.scraper_name);
            card.setAttribute('vivid_id', events.vdid);

            card.addEventListener('click', function(){

            if (event.target.closest('.main-edit-button')) {
            return;
            }

            document.querySelector('#errortext').textContent = ''
            document.querySelector(".edit-wrapper").style.display = 'flex'

            document.querySelector('#editid').value = events.id
            document.querySelector('#edit-email').value = events.email
            document.querySelector('#edit-fname').value = events.first_name
            document.querySelector('#edit-lname').value = events.last_name
            document.querySelector('#edit-gender').value = events.gender
            document.querySelector('#edit-bday').value = events.birthdate
            document.querySelector('#edit-pnumber').value = events.phone_number
            document.querySelector('#edit-plocation').value = events.phone_location
            document.querySelector('#edit-country').value = events.country
            document.querySelector('#edit-address').value = events.address
            document.querySelector('#edit-city').value = events.city
            document.querySelector('#edit-state').value = events.state
            document.querySelector('#edit-zip').value = events.zip
            })

            card.style.display = 'flex';

            const emailcard = card.getElementsByClassName('main-text-acc')[0]
            emailcard.textContent = events.email;

            const numbercard = card.getElementsByClassName('main-text-numbers')[0]
            numbercard.textContent = events.phone_number;

            const fname = card.getElementsByClassName('main-text-fname')[0]
            fname.textContent = events.first_name

            const lname = card.getElementsByClassName('main-text-lname')[0]
            lname.textContent = events.last_name;

            const addresscard = card.getElementsByClassName('main-text-address')[0]
            addresscard.textContent = events.address;

            if(addresscard.textContent.length>10) {
            addresscard.textContent = events.address.slice(0, 10)+'...'
            }

            const statecard = card.getElementsByClassName('main-text-states')[0]
            statecard.textContent = events.state;

            const zipcard = card.getElementsByClassName('main-text-zip')[0]
            zipcard.textContent = events.zip;

            const countrycard = card.getElementsByClassName('main-text-countrys')[0]
            countrycard.textContent = events.country;

            const gendercard = card.getElementsByClassName('main-text-genders')[0]
            gendercard.textContent = events.gender;


            const deletebutton = card.getElementsByClassName('main-edit-button')[0];
            const cardid = card.getAttribute('cardid');
            let clickCount = 0; // Track the number of clicks on deletebutton
            
            deletebutton.addEventListener('click', function() {
                if (clickCount === 0) {
                    // First click: change button color to red
                    deletebutton.style.color = 'red';
                    clickCount++; // Increment click count
                } else if (clickCount === 1) {
                    // Second click: run the API call and hide elements
                    document.querySelector('.edit-wrapper').style.display = 'none';
                    const url = `https://ubik.wiki/api/delete/purchasing-accounts/`;
                    const bodyData = JSON.stringify({
                        id: cardid
                    });
            
                    fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: bodyData
                    })
                    .then(response => {
                        if (response.ok) {
                            // Hide the card only if the API call is successful
                            card.style.display = 'none';
                        } else {
                            console.error('Failed to delete:', response.statusText);
                        }
                    })
                    .catch(error => console.error('Error:', error));
                    
                    clickCount = 0; // Reset click count in case of re-use
                }
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
