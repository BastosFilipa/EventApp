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
        .then(getEvents) // extract useful info
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

function getEvents(data) {
    console.log('data', data);

    return data._embedded?.events; // ?. operator returns undefined if previous identifier does not exist
}

function renderResults(events = []) {
    console.log(events);
    let result = '';

    if (events.length > 0) {
        const eventsListHTML = events.reduce((eventsHTML, event) => {
            return eventsHTML + `<li>${event.name}</li>`;
        }, '');

        result += '<ul>' + eventsListHTML + '</ul>';
    } else {
        result += '<span>No results found</span>';
    }


    $('#info').html(result);
}

function handleErrors(err) {
    console.error(err);
}