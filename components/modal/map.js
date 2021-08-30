import mapStyle from './mapstyle.js';

const Map = (() => {
  let apikey = "AIzaSyCzp7p_uX5EJ92S9fnQFG3Con5TcewcWjE";
  let loader;

  function initMap() {
    loader = new google.maps.plugins.loader.Loader({
      apiKey: apikey,
      version: "weekly",
      libraries: ["places"],
    });
  }

  function loadMap(mapElement, mapOptions) {
    if (!loader) {
      initMap();
    }

    loader.load().then(function () {
      mapOptions.zoom=15;
      mapOptions.mapTypeId= google.maps.MapTypeId.ROADMAP;
      mapOptions.mapTypeControl= false;
      mapOptions.styles= mapStyle;
      let map = new google.maps.Map(mapElement, mapOptions);
      new google.maps.Marker({
        position: mapOptions.center,
        map: map,
      });

      return map;
    });
  }


  return {
    initMap,
    loadMap
  };
})();

export { Map };
