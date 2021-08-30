import { Events } from "./components/events/events.js";
import { ScrollButton } from "./components/scrollBtn.js";
import { Modal } from "./components/modal/modal.js";
document.addEventListener("DOMContentLoaded", () => {
  Events.init();
  Modal.init();
  ScrollButton.init();
});
