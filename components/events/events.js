
import { eventsApiRequest, parseResponse, getEventsFromResponse } from "./utils/fetchApiRequest.js";
import { groupDuplicateEvents } from "./groupDuplicateEvents.js";
import { renderResults } from "./renderResults.js";
import { Modal } from "../modal/modal.js";

const Events = (() => {

    let actualPage = 0;
    let city;
    let defaultDate = new Date().toISOString().replace(/\.\d\d\dZ/g, "Z");

    function init(){
        bindCalendar();
        bindCityInput();
        searchInLocation();
    }


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

      function bindCalendar(){

        document.querySelector("#calendar").addEventListener("change", (event) => {
            defaultDate = new Date( event.target.value).toISOString().replace(/\.\d\d\dZ/g, "Z");;
            document.querySelector("#cards-container").innerHTML = "";
            searchInLocation(city, 0, defaultDate);
        });
      }

      function bindCityInput(){
        document.querySelector("#location").addEventListener("change", (event) => {
            let query = event.target.value;
            city = query;
            document.querySelector("#cards-container").innerHTML = "";
            searchInLocation(query, 0, defaultDate);
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

      function bindModal() {
        document.querySelectorAll('.button-learnMore:not([data-binded="true"]').forEach((card) => {
          card.setAttribute("data-binded", "true");
            card.addEventListener("click", () => {
              let eventObj = JSON.parse(
                decodeURIComponent(card.dataset.event)
              );
             
              Modal.setModal(eventObj);
            });
          
        });
      }

      function handleErrors(err) {
        console.error(err);
      }
 
return {    
    init
}
      
})();

export {Events};