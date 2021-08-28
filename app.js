import { Modal } from "./modal.js";

function eventsApiRequest(params = {}) {
  const apikey = "7elxdku9GGG5k8j0Xm8KWdANDgecHMV0";
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}`;

  let uriParams = Object.keys(params).reduce((cumulative, key) => {
    return cumulative + `&${key}=${encodeURIComponent(params[key])}`;
  }, "");

  if (uriParams) {
    url += uriParams;
  }

  return fetch(url);
}

let actualPage = 0;
let city;
let defaultDate = new Date().toISOString().replace(/\.\d\d\dZ/g, "Z");

$(document).ready(async function () {
  Modal.init();
  searchInLocation();

  // bind the event handler to the input box
  $("#location").change((event) => {
    let query = event.target.value;
    city = query;

    if (document.getElementById("calendar").value) {
      let getDate = document.getElementById("calendar").value;
      defaultDate = new Date(getDate).toISOString().replace(/\.\d\d\dZ/g, "Z");
      console.log(defaultDate);
    }

    if (!query) {
      return;
    }
    $("#cards-container").html("");
    searchInLocation(query);
  });
});

function searchInLocation(query, page = 0, date = defaultDate) {
  let params = { city: query, page: page, startDateTime: date };
  if (!query) {
    params = { page: page, startDateTime: date };
  }

  eventsApiRequest(params)
    .then(parseResponse) // async deserialize response json
    .then(getEventsFromResponse) // extract useful info
    .then(groupDuplicateEvents)
    .then(renderResults)
    .then(btnToshare)
    .then(bindModal)
    .then(addObserver)
    .catch(handleErrors);
}

function parseResponse(response) {
  console.log(response);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json(); //data
}

function getEventsFromResponse(data) {
  console.log("data", data);

  return data._embedded?.events; // ?. operator returns undefined if previous identifier does not exist
}

function groupDuplicateEvents(events = []) {
  //for existing event.name dont create a new card, just add the event date to the card with the same name.
  const duplicateChecker = {};
  let newEvent;

  return events.reduce((uniqueEvents, event) => {
    if (duplicateChecker[event.name]) {
      // if already found event, just add new date
      duplicateChecker[event.name].dates.push(event.dates.start.localDate);
      return uniqueEvents;
    } else {
      // haven't seen this event, add to list
      newEvent = {
        // adapt data structure to my preference
        name: event.name,
        image: event.images.filter((image) => {
          return  image.ratio == "16_9" && image.width >= 300;
         })[0].url, //event.images[1].url,
        venue: event._embedded.venues[0]?.name,
        postalCode: event._embedded.venues[0].postalCode ?? "",
        address: event._embedded.venues[0].address?.line1 ?? "",
        city: event._embedded.venues[0].city.name,
        venues: Object.keys(event._embedde?.venues[0] ?? {}).reduce(
          (cumulator, current) => {
            console.log("current aqui", current);
            switch (current) {
              case "city":
              case "country":
              case "state":
                cumulator[current] = event._embedded.venues[0][current].name;
                break;
            }
            return cumulator;
          },
          {}
        ),
        location: {
          longitude: event._embedded.venues[0]?.location.longitude ?? "",
          latitude: event._embedded.venues[0]?.location.latitude ?? "",
        },
        classification: event.classifications[0].genre.name,
        status: event.dates.status.code,
        price: {
          min: event.priceRanges ? `${event.priceRanges[0]?.min}€` : "",
          max:
            event.priceRanges &&
            event.priceRanges[0]?.min !== event.priceRanges[0]?.max
              ? `- ${event.priceRanges[0]?.max}€`
              : "",
        },
        dates: [event.dates.start.localDate],
        urlTicket: event.url,
        externalLinks: Object.keys(
          event._embedded?.attractions?.externalLinks ?? {}
        ).reduce((cumulator, current) => {
          switch (current) {
            case "facebook":
            case "instagram":
            case "twitter":
            case "homepage":
              cumulator[current] =
                event._embedded.attractions.externalLinks[current][0].url;
              break;
          }

          return cumulator;
        }, {}),
      };
    }

    duplicateChecker[event.name] = newEvent; // mark event as found by name

    return [...uniqueEvents, newEvent];
  }, []);
}

function renderResults(events = []) {
  console.log(events);

  $("#cards-container").append(
    events.length > 0 ? renderEventsList(events) : renderNoResults()
  );
}

function bindModal(results) {
  document.querySelectorAll('.button-learnMore:not([data-binded="true"]').forEach((card) => {
    card.setAttribute("data-binded", "true");
      card.addEventListener("click", () => {
        let eventObj = JSON.parse(
          decodeURIComponent(card.dataset.event).replace('";', "")
        );
        Modal.setModal(eventObj);
      });
    
  });
}

function addObserver() {
  let allEvents = document.querySelector("#cards-container");
  let lastEvent = allEvents.lastChild;
  console.log(lastEvent);

  if (lastEvent.tagName.toLowerCase() == "span") {
    console.log("sai");
    return;
  }
  const options = {
    rootMargin: "0px",
    threshold: 0.3,
  };
  const callback = (el, ol) => {
    if (el[0].intersectionRatio > 0) {
      //console.log(el);
      observer.unobserve(lastEvent);

      actualPage++;
      searchInLocation(city, actualPage, defaultDate);
    }
  };
  const observer = new IntersectionObserver(callback, options);

  observer.observe(lastEvent);
}

function renderEventsList(events) {
  return events.map((event) => renderEvent(event)).join("");
}

function renderEvent(event) {
  return `
    <div class="card">
        <img class="card-image" alt='${event.name} image' src='${
    event.image
  }' />
        <div class="card-text">
            <h5>${event.name}</h5>
            <div class="card-genre-details">
                <p>${event.venue}</p>
                <p>Genre: ${
                  event.classification
                }<br><p class="card-date">${event.dates.join(" | ")}</p></p>
            </div>
            <p class="card-status">${event.status}</p>
            <p class="card-price">${event.price.min} ${
    event.price.max
  }</p></div>
            <div class="buttons-container">
                <button class="button-learnMore" data-event=${encodeURIComponent(
                  JSON.stringify(event)
                )} >Learn more</button>
                <a class="share">Share this</a>
                <div class = "shareLink">
                  <div class = "share-btn-container">
                    <button href="#" class="facebook-btn">
                      <i class = "fab fa-facebook"></i>
                    </button>
                    <form action = "${(event.urlTicket)}">
                    <button type"submit" value="hey">Buy Tickets</button>
                  </form>
                  </div>
                  
                </div>
        </div>
    </div>`;
}


    
// function btnToshare(event){
//   const facebookBtn = document.querySelector(".facebook-btn");
//   console.log('aqui');

//     let postUrl = `${(event.urlTicket)}`;
//     console.log(postUrl);
//     facebookBtn.setAttribute("href", );
//     console.log('oi');

//     //`https://www.facebook.com/sharer.php?u=${postUrl}`
// }

function renderNoResults() {
  return "<span>No results found</span>";
}

function handleErrors(err) {
  console.error(err);
}

/* <p>${event.externalLinks.facebook}</p>
<p>${event.venues.city}</p>
<p>${event.venues.country}</p> */
