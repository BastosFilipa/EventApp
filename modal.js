import { Spotify } from "./spotify.js";
import { Player } from "./player.js";
const Modal = (() => {
  let modal;
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
              <div class="clearfix">
                <div class="box col-md-6 float-md-end mb-3 ms-md-3">
                  <div class="ribbon">
                    <span id="ribbon-title">
                      On Sale
                    </span>
  
                  </div>
  
                  <img
                    src="https://s1.ticketm.net/dam/a/5ba/e61d38c6-4173-46fe-9b34-f84adf6295ba_1433851_EVENT_DETAIL_PAGE_16_9.jpg"
                    class="modal-image" alt="..." width="100%" />
                    <div id="playerWrapper" class="center-content">
                </div>
                </div>
             
                
             
                <div>
                <p>
                A paragraph of placeholder text. We're using it here to show
                the use of the clearfix class. We're adding quite a few
                meaningless phrases here to demonstrate how the columns
                interact here with the floated image.
              </p>

              <p>
                As you can see the paragraphs gracefully wrap around the
                floated image. Now imagine how this would look with some
                actual content in here, rather than just this boring
                placeholder text that goes on and on, but actually conveys no
                tangible information at. It simply takes up space and should
                not really be read.
              </p>

              <p>
                And yet, here you are, still persevering in reading this
                placeholder text, hoping for some more insights, or some
                hidden easter egg of content. A joke, perhaps. Unfortunately,
                there's none of that here.
              </p>
                </div>
  
               
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
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
    
  }




  async function setModal(event) {
    console.log(event);
    document.querySelector(".modal-title").innerText = event.name;
    document.querySelector(".modal-image").src = event.image;
    document.querySelector(".modal-image").alt = event.name;
    document.querySelector(".modal-image").title = event.name;
    document.querySelector("#ribbon-title").innerText = event.status;
    document.querySelector("#ribbon-title").classList.add("ribbon-red");
    if (event.status === "onsale") {
      document.querySelector("#ribbon-title").classList.replace("ribbon-red", "ribbon-green");
    }




    modal.show();
    let tracks;
    Player.reset();
    try { 
      tracks = await Spotify.getArtistTracks(event.name);
    } catch (error) {
      throw new Error("No artist tracks found")
    }finally{
      Player.addTracks(tracks);
    }
   
    
    

   
    
  }

  return {
    init,
    setModal,
  };
})();

export { Modal };
