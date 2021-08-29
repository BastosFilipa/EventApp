const groupDuplicateEvents = (events = []) => {
    const duplicateChecker = {};
    let newEvent;
  
    return events.reduce((uniqueEvents, event) => {
      // for existing event.name dont create a new card, just add the event date to the card with the same name.
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
          venue: event._embedded.venues[0]?.name ?? "-",
          postalCode: event._embedded.venues[0].postalCode ?? "",
          address: event._embedded.venues[0].address?.line1 ?? "",
          city: event._embedded.venues[0].city?.name,
          country: event._embedded.venues[0].country?.name,
          state: event._embedded.venues[0].state?.name,
          location: {
            longitude: event._embedded.venues[0]?.location?.longitude ?? "",
            latitude: event._embedded.venues[0]?.location?.latitude ?? "",
          },
          classification: event.classifications[0].genre.name && 
            event.classifications[0].genre.name  !== 'Undefined' ? event.classifications[0].genre.name : "-",
          status: event.dates.status.code,
          price: {
            min: event.priceRanges ? `| ${event.priceRanges[0]?.min}€` : "",
            max:
              event.priceRanges &&
              event.priceRanges[0]?.min !== event.priceRanges[0]?.max
                ? `- ${event.priceRanges[0]?.max}€`
                : "",
          },
          dates: [event.dates.start.localDate],
          urlTicket: event.url,
          attractions: event._embedded?.attractions?.map(({ id, name, externalLinks = {} }) => (
            {
              id,
              name,
              externalLinks: Object.keys(externalLinks).reduce((cumulator, current) => {
                switch (current) {
                  case "facebook":
                  case "instagram":
                  case "twitter":
                  case "homepage":
                    cumulator[current] = externalLinks[current][0].url;
                    break;
                }
      
                return cumulator;
              }, {})
            }))
        };
      }
  
      duplicateChecker[event.name] = newEvent; // mark event as found by name
  
      return [...uniqueEvents, newEvent];
    }, []);
}

export { groupDuplicateEvents };