const APIKEY = "7elxdku9GGG5k8j0Xm8KWdANDgecHMV0";

const eventsApiRequest = (params = {}) => {
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=${APIKEY}`;
  
    let uriParams = Object.keys(params).reduce((cumulative, key) => {
      return cumulative + `&${key}=${encodeURIComponent(params[key])}`;
    }, "");
  
    if (uriParams) {
      url += uriParams;
    }
  
    return fetch(url);
};

const parseResponse = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json(); 
}

const getEventsFromResponse = (data) => {
  return data._embedded?.events; // ?. operator returns undefined if previous identifier does not exist
}

export { eventsApiRequest, parseResponse, getEventsFromResponse }