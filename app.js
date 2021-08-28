import { Modal } from "./modal.js";
import { eventsApiRequest, parseResponse, getEventsFromResponse } from "./utils/fetchApiRequest.js";
import { groupDuplicateEvents } from "./eventsHandle/groupDuplicateEvents.js";
import { renderResults } from "./eventsHandle/renderResults.js";

let actualPage = 0;
let city;
let defaultDate = new Date().toISOString().replace(/\.\d\d\dZ/g, "Z");

$(document).ready(async function () {
  Modal.init();
  searchInLocation();

  // bind the event handler to the input box

  $("#calendar").change((event) => {
    let queryDate = event.target.value;
    //defaultDate = queryDate;
    defaultDate = new Date(queryDate).toISOString().replace(/\.\d\d\dZ/g, "Z");
    $("#cards-container").html("");
    searchInLocation(city, 0, defaultDate);

  });

  $("#location").change((event) => {
    
    let query = event.target.value;
    city = query;

    if (document.getElementById("calendar").value) {
      let getDate = document.getElementById("calendar").value;
      defaultDate = new Date(getDate).toISOString().replace(/\.\d\d\dZ/g, "Z");
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
    .then(parseResponse) 
    .then(getEventsFromResponse)
    .then(groupDuplicateEvents)
    .then(renderResults)
    .then(bindModal)
    .then(addObserver)
    .catch(handleErrors);
}

function bindModal(results) {
  document.querySelectorAll('.button-learnMore:not([data-binded="true"]').forEach((card) => {
    card.setAttribute("data-binded", "true");
      card.addEventListener("click", () => {
        let eventObj = JSON.parse(
          decodeURIComponent(card.dataset.event)
        );
        console.log(eventObj);
        Modal.setModal(eventObj);
      });
    
  });
}

function addObserver() {
  let allEvents = document.querySelector("#cards-container");
  let cards=allEvents.querySelectorAll("div.card");
  let lastEvent = cards[cards.length - 1];

  if (lastEvent.tagName.toLowerCase() == "span") {
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

function handleErrors(err) {
  console.error(err);
}
 