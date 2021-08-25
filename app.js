function eventsApiRequest(params = {}) {
    const apikey = '7elxdku9GGG5k8j0Xm8KWdANDgecHMV0';
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}`;

    let uriParams = Object.keys(params).reduce((cumulative, key) => {
        return cumulative + `&${key}=${encodeURIComponent(params[key])}`;
    }, '');

    if (uriParams) {
        url += uriParams;
    }

    return fetch(url);
}


$(document).ready(function () {

    console.log('app starting');
    // bind the event handler to the input box
    $('#location').change((event) => {
        console.log('mudou', event.target.value);
        let query = event.target.value;

        if (!query) {
            return;
        }

        searchInLocation(query);
    });
});

function searchInLocation(query) {
    console.log('searching...');

    eventsApiRequest({ city: query })
        .then(parseResponse) // async deserialize response json
        .then(getEventsFromResponse) // extract useful info
        .then(groupDuplicateEvents)
        .then(renderResults)
        .catch(handleErrors);
}

function parseResponse(response) {
    console.log(response);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json(); //data
}

function getEventsFromResponse(data) {
    console.log('data', data);

    return data._embedded?.events; // ?. operator returns undefined if previous identifier does not exist
}


function groupDuplicateEvents(events = []) { //for existing event.name dont create a new card, just add the event date to the card with the same name.
    const duplicateChecker = {};
    let newEvent;

    return events.reduce((uniqueEvents, event) => {
        if (duplicateChecker[event.name]) { // if already found event, just add new date
            duplicateChecker[event.name].dates.push(event.dates.start.localDate);
            return uniqueEvents;

        } else { // haven't seen this event, add to list
            newEvent = { // adapt data structure to my preference
                name: event.name.charAt(0).toUpperCase() + event.name.slice(1).toLowerCase(),
                venue: event._embedded.venues[0]?.name,
                image: event.images[0].url,
                classification: event.classifications[0].genre.name,
                status: event.dates.status.code,
                price: {
                    min: event.priceRanges ? `${event.priceRanges[0]?.min}€` : '',
                    max: event.priceRanges &&
                        event.priceRanges[0]?.min !== event.priceRanges[0]?.max ?
                        `- ${event.priceRanges[0]?.max}€` : '',
                },
                dates: [
                    event.dates.start.localDate,
                ],
                urlTicket: event._embedded.venues[0]?.url,
                externalLinks: Object.keys(event._embedded?.attractions?.externalLinks ?? {}).reduce((cumulator, current) => {

                    console.log({ cumulator: cumulator, current: current });

                    switch (current) {
                        case 'facebook':
                        case 'instagram':
                        case 'twitter':
                        case 'homepage':

                            cumulator[current] = event._embedded.attractions.externalLinks[current][0].url;
                            break;
                    }

                    consolo.log('cumulator1', cumulator);
                    return cumulator;
                }, {})
            }

        };

        duplicateChecker[event.name] = newEvent; // mark event as found by name

        return [...uniqueEvents, newEvent];
    }, []);
}



function renderResults(events = []) {
    console.log(events);

    $('#cards-container').html((events.length > 0) ? renderEventsList(events) : renderNoResults());
}

function renderEventsList(events) {
    return events.map((event) => renderEvent(event)).join('');
}

function renderEvent(event) {
    return `
    <div class="card">
        <img class="card-image" alt='${event.name} image' src='${event.image}' />
        <div class="card-text">
            <h4>${event.name}</h4>
            <p>${event.venue}</p>
            <a>${event.externalLinks}</a>
            <p>${event.classification} ${(event.dates.join(', '))}</p>
            <p>${event.status}</p>
            <p>${event.price.min} ${event.price.max}</p></div>
            <div class="buttons-container">
                <button class="button-learnMore">Learn more</button>
                <a class="share">Share this</a>
        </div>
    </div>`;
}




function renderNoResults() {
    return '<span>No results found</span>';
}

function handleErrors(err) {
    console.error(err);
}