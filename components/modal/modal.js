import { Spotify } from "../spotify/spotify.js";
import { Player } from "../player/player.js";
import { Map } from "./map.js";

const Modal = (() => {
  let modal;

  function htmlToElements(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
  }

  function init() {
    fetch("/components/modal/template.html")
      .then((data) => data.text())
      .then((html) => {
        const myModalEl = htmlToElements(html);
        const domModal = document.body.appendChild(myModalEl[0]);
        modal = bootstrap.Modal.getOrCreateInstance(domModal);
        Player.init("playerWrapper");
        domModal.addEventListener("hidden.bs.modal", function (event) {
          Player.reset();
        });
      });
  }

  function setModal(event) {
    resetModal();
    setEventTitleAndImage(event);
    setEventDetails(event);
    setEventDates(event);
    setPlayer(event.name);
    const latLang = {
      lat: parseFloat(event.location.latitude),
      lng: parseFloat(event.location.longitude),
    };

    setMap(latLang, event.venue);

    modal.show();
  }

  function resetModal() {
    document.querySelector("#modal-dates-text").innerHTML = "";
    document.querySelector("#modal-genre-text").innerHTML = "";
    document.querySelector("#modal-tickets-text").href = "#";
    document.querySelector("#modal-venue").innerText = "";
  
  }

  function setEventTitleAndImage(event) {
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
  }

  function setEventDetails(event) {
    document.querySelector("#modal-venue").innerText = event.venue;
    document.querySelector("#modal-genre-text").innerText =
      event.classification;

    document.querySelector("#modal-tickets-text").href = event.urlTicket;
    document.querySelector("#modal-tickets-price").innerText =
      "From: " + event.price.min + " " + event.price.max;
  }

  function setEventDates(event) {
    const dateDiv = document.querySelector("#modal-dates-text");
    const dates = event.dates.map((date) => new Date(date));

    dates.forEach((date) => {
      const dateStartText = document.createElement("span");
      dateStartText.classList.add("date-start-text");
      dateStartText.innerText = date.toString().substring(0, 15);
      dateDiv.appendChild(dateStartText);
    });
  }

  function setMap(latLang, venue) {
    let mapElement = document.querySelector("#map");

    if (latLang.lat === NaN || latLang.lat === 0) {
      mapElement.innerHTML = "No location found";
      return;
    }
    document.querySelector(
      "#modal-directions"
    ).href = `https://www.google.com/maps/dir//${venue}/@${latLang.lat},${latLang.lng},12z/`;

    const mapOptions = {
      center: latLang,
      zoom: 15,
    };

    Map.loadMap(mapElement, mapOptions);
  }

  async function setPlayer(artist) {
    let tracks = await Spotify.getArtistTracks(artist);
    Player.addTracks(tracks);
  }

  return {
    init,
    setModal,
  };
})();

export { Modal };
