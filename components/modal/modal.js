import { Spotify } from "../spotify/spotify.js";
import { Player } from "../player/player.js";

const Modal = (() => {
  let modal;
  let apikey = "AIzaSyCzp7p_uX5EJ92S9fnQFG3Con5TcewcWjE";
  let loader;

  function htmlToElements(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
  }

  const modalTemplate = `<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Modal title</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
             
                <div class="box col-md-6 float-md-end mb-3 ms-md-3">
                  <div class="ribbon">
                    <span id="ribbon-title">
                    </span>
                  </div>
  
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    class="modal-image" alt="..." width="100%" />
                    <div id="playerWrapper" class="center-content">
                  </div>
                </div>
             
                
             
                <div class="modal-info-container">

                  <div class="modal-info-content">
                    <div class="modal-info-title">
                    <i class="fa fa-calendar" aria-hidden="true"></i> Event Dates:
                    </div>
                    <div id="modal-dates-text" class="modal-info-dates">
                    </div>
                  </div>
                  <div class="modal-info-content">
                    <div id="modal-genre"  class="modal-info-title">
                    <i class="fas fa-music"></i> Genre:</div>
                     <div id="modal-genre-text" class="modal-info-text"></div>
                    </div>
                  </div>
                  <div class="modal-info-content">
                    <div id="modal-tickets" class="modal-info-title">
                    <i class="fas fa-ticket-alt"></i> Tickets: <a href="#" target="_blank" id="modal-tickets-text">Buy tickets</a></div>
                    <div  class="modal-info-text">
                    <span id="modal-tickets-price"></span>
                      
                    </div>
                  </div>
                 
                  <div class="modal-info-content">
                    <div  class="modal-info-title" ><i class="fas fa-map-marker-alt"></i> Venue: <a href="" id="modal-directions" target="_blank"></a></div>
                    <div class="modal-info-text">
                    <span id="modal-venue"></span>
                    </div>
                     
                    
                  </div>
                 
                  <div id="map"></div>
                </div>
             
             
            </div>
            <div class="modal-footer">
            <!--  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>`;

  function init() {
    const myModalEl = htmlToElements(modalTemplate);
    const domModal = document.body.appendChild(myModalEl[0]);
    modal = bootstrap.Modal.getOrCreateInstance(domModal);
    Player.init("playerWrapper");

    domModal.addEventListener("hidden.bs.modal", function (event) {
      Player.reset();
    });

    initMap();
  }

  function initMap() {
    loader = new google.maps.plugins.loader.Loader({
      apiKey: apikey,
      version: "weekly",
      libraries: ["places"],
    });
  }

  function setMap(latLang, venue) {
    if (latLang.lat === 0) {
      document.querySelector("#map").innerHTML = "No location found";
      return;
    }
    const mapOptions = {
      center: latLang,
      zoom: 15,
    };
    loader.loadCallback((e) => {
      if (e) {
        console.log(e);
      } else {
        document.querySelector("#modal-directions").innerText =
          "Get directions";
        document.querySelector(
          "#modal-directions"
        ).href = `https://www.google.com/maps/dir//${venue}/@${latLang.lat},${latLang.lng},12z/`;

        const map = new google.maps.Map(
          document.querySelector("#map"),
          mapOptions
        );
        const marker = new google.maps.Marker({
          position: latLang,
          map: map,
        });
      }
    });
  }

  function resetModal() {
    document.querySelector("#modal-dates-text").innerHTML = "";
    document.querySelector("#modal-genre-text").innerHTML = "";
    document.querySelector("#modal-tickets-text").href = "#";
    document.querySelector("#modal-venue").innerText = "";
    document.querySelector("#modal-directions").innerHTML = "";
  }

function setEventDetails(event) {
  
}

  async function setModal(event) {

    resetModal();
    document.querySelector(".modal-title").innerText = event.name;
    document.querySelector("#ribbon-title").innerText = event.status;
    document.querySelector("#ribbon-title").classList.add("ribbon-red");
    if (event.status === "onsale") {
      document
        .querySelector("#ribbon-title")
        .classList.replace("ribbon-red", "ribbon-green");
    }
    document.querySelector(".modal-image").src = event.image;
    document.querySelector(".modal-image").alt = event.name;
    document.querySelector(".modal-image").title = event.name;

    document.querySelector("#modal-venue").innerText = event.venue;
    document.querySelector("#modal-genre-text").innerText =
      event.classification;


    document.querySelector("#modal-tickets-text").href = event.urlTicket;
    document.querySelector("#modal-tickets-price").innerText = 'From: ' + event.price.min + ' ' + event.price.max;
   
  
    const dateDiv = document.querySelector("#modal-dates-text");
    dateDiv.innerHTML = "";
    const dates = event.dates.map((date) => new Date(date));


    dates.forEach((date) => {
      const dateStartText = document.createElement("span");
      dateStartText.classList.add("date-start-text");
      dateStartText.innerText = date.toString().substring(0, 15);
      dateDiv.appendChild(dateStartText);
    });

    modal.show();

    let tracks = await Spotify.getArtistTracks(event.name);

    Player.addTracks(tracks);

    const latLang = {
      lat: parseFloat(event.location.latitude),
      lng: parseFloat(event.location.longitude),
    };

    setMap(latLang, event.venue);
  }

  return {
    init,
    setModal,
  };
})();

export { Modal };
