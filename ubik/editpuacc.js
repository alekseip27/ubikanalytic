function checkresults() {
    let results = document.querySelectorAll('.event-box');
    let count = 0;
    for (let i = 0; i < results.length; i++) {
        if (results[i].style.display !== 'none') {
            count++;
            document.querySelector('#counter').textContent = count;
        }
        if (count < 2) {
            document.querySelector('#countertxt').textContent = 'Result';
        } else {
            document.querySelector('#countertxt').textContent = 'Results';
        }
    }
}

let datear = function() {
    setTimeout(() => {
        let now = new Date();
        let date1 = moment(now).format('YYYY/MM/DD');
        $('.event-box').sort(function(a, b) {
            return date1 > $(b).attr('date') ? 1 : -1;
        }).appendTo('#Cards-Container');
    }, 2500);
};

var intervalId = window.setInterval(function() {
    checkresults();
}, 100);

document.querySelectorAll("#searchbar1, #searchbar2, #searchbar3").forEach(input => {
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("search-button").click();
        }
    });
});

document.querySelector('#search-button').addEventListener("click", () => {
    document.querySelector('#loading').style.display = "flex";
    document.querySelector('#flexbox').style.display = "none";

    ['searchbar1', 'searchbar2', 'searchbar3'].forEach(id => {
        const input = document.getElementById(id);
        input.value = input.value.trimEnd();
    });

    let keywords = [
        `email__icontains=${encodeURIComponent(document.getElementById('searchbar1').value)}`,
        `state__icontains=${encodeURIComponent(document.getElementById('searchbar2').value)}`,
        `phone_number__icontains=${encodeURIComponent(document.getElementById('searchbar3').value)}`
    ].filter(Boolean).join('&') + '&limit=100';

    let xanoUrl = `https://ubik.wiki/api/purchasing-accounts/?${keywords}`;

    function getEvents() {
        let request = new XMLHttpRequest();
        request.open('GET', xanoUrl, true);
        request.setRequestHeader('Authorization', `Bearer ${token}`);
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");

        request.onload = function() {
            let data = JSON.parse(this.response);
            if (request.status >= 200 && request.status < 400) {
                document.querySelector('#loading').style.display = "none";
                document.querySelector('#flexbox').style.display = "flex";
                const cardContainer = document.getElementById("Cards-Container");

                data.results.forEach(events => {
                    const style = document.getElementById('samplestyle');
                    const card = style.cloneNode(true);
                    card.setAttribute('id', '');
                    card.setAttribute('cardid', events.id);
                    card.setAttribute('source', events.scraper_name);
                    card.setAttribute('vivid_id', events.vdid);
                    card.style.display = 'flex';

                    const deletebutton = card.getElementsByClassName('main-edit-button')[0];
                    const confirmbutton = card.getElementsByClassName('main-edit-button-confirm')[0]

                
                    function handleDelete() {
                        document.querySelector('.edit-wrapper').style.display = 'none';
                        const url = `https://ubik.wiki/api/delete/purchasing-accounts/`;
                        const bodyData = JSON.stringify({ id: events.id });
                    
                        fetch(url, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            body: bodyData
                        }).then(() => {
                            card.style.display = 'none';
                        }).catch((error) => {
                            console.error('Error deleting item:', error);
                        });
                    }
                    
                    // Main card click handler for opening the edit dialog
                    card.addEventListener('click', function(event) {
                        // Prevent click if the click originated from the delete or confirm button
                        if (event.target.closest('.main-edit-button') || event.target.closest('.main-edit-button-confirm')) {
                            return;
                        }
                    
                        document.querySelector('#errortext').textContent = '';
                        document.querySelector(".edit-wrapper").style.display = 'flex';
                    
                        document.querySelector('#editid').value = events.id;
                        document.querySelector('#edit-email').value = events.email;
                        document.querySelector('#edit-fname').value = events.first_name;
                        document.querySelector('#edit-lname').value = events.last_name;
                        document.querySelector('#edit-gender').value = events.gender;
                        document.querySelector('#edit-bday').value = events.birthdate;
                        document.querySelector('#edit-pnumber').value = events.phone_number;
                        document.querySelector('#edit-plocation').value = events.phone_location;
                        document.querySelector('#edit-country').value = events.country;
                        document.querySelector('#edit-address').value = events.address;
                        document.querySelector('#edit-city').value = events.city;
                        document.querySelector('#edit-state').value = events.state;
                        document.querySelector('#edit-zip').value = events.zip;
                    });
                    
                    // Confirm button click handler
                    confirmbutton.addEventListener('click', function() {
                        deletebutton.style.display = 'flex';
                        confirmbutton.style.display = 'none';
                    
                        // Remove any existing event listener on deletebutton to ensure only one listener exists
                        deletebutton.removeEventListener('click', handleDelete);
                    
                        // Attach the handleDelete function to deletebutton
                        deletebutton.addEventListener('click', handleDelete);
                    });
                    
                    
                    // Fill card content
                    card.querySelector('.main-text-acc').textContent = events.email;
                    card.querySelector('.main-text-numbers').textContent = events.phone_number;
                    card.querySelector('.main-text-fname').textContent = events.first_name;
                    card.querySelector('.main-text-lname').textContent = events.last_name;
                    const address = events.address;
                    card.querySelector('.main-text-address').textContent = address.length > 10 ? address.slice(0, 10) + '...' : address;
                    card.querySelector('.main-text-states').textContent = events.state;
                    card.querySelector('.main-text-zip').textContent = events.zip;
                    card.querySelector('.main-text-countrys').textContent = events.country;
                    card.querySelector('.main-text-genders').textContent = events.gender;

                    cardContainer.appendChild(card);
                });
                searchcompleted = true;
            } else if (request.status > 400) {
                document.querySelector('#loading').style.display = "none";
                document.querySelector('#flexbox').style.display = "flex";
                console.log('searchfailed');
            }
        };
        request.send();
    }

    let intervalIds = setInterval(() => {
        if (token.length === 40) {
            getEvents();
            clearInterval(intervalIds);
        }
    }, 250);

    var intervalId = window.setInterval(function() {
        let boxes = document.querySelectorAll('.event-box');
        boxes.forEach(box => {
            if (box.style.display == 'none' && box.id !== 'samplestyle') {
                box.remove();
            }
        });
    }, 100);
});
