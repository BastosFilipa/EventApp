import { Events } from "./components/events/events.js";
import { ScrollButton } from "./components/scrollBtn.js";

document.addEventListener("DOMContentLoaded", () => {
  Events.init();
  ScrollButton.init();
});
