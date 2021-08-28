const renderEventsList = (events) => {
    return events.map((event) => renderEvent(event)).join("");
};

const renderEvent = (event) => {
    return `
        <div class="card">
            <div class="card-image">
                <img alt='${event.name} image' src='${event.image}' />
            </div>
            <div class="card-text">
                <h5>${event.name}</h5>
                <div class="card-genre-details">
                    <p class="card-label">${event.venue}</p>
                    <p class="card-label">${event.classification}<br>
                        <div class="card-date">
                        <p>${event.dates.join(" ")}</p>
                        </div>
                    </p>
                </div>
                <div class="card-status-details">${event.status} ${event.price.min} ${event.price.max}</div>
                </div>
                <div class="buttons-container">
                <button class="button-learnMore" data-event=${encodeURIComponent(JSON.stringify(event))} >Learn more</button>
                <a class="share">Share this</a>
            </div>
        </div>
    `;
};
    
const renderNoResults = () => {
    return "<span>No results found</span>";
};

function renderResults(events = []) {
    $("#cards-container").append(
      events.length > 0 ? renderEventsList(events) : renderNoResults()
    );
}

export { renderResults };
