const Player = (() => {
  let player;
  let play;
  let pause;
  let backward;
  let currentTime;
  let controls;
  let progressBar;

  const template = `
  <div class="controls-wrapper">
                    <div class="player-title">
                        <a id="songTitle" href="#"></a>
                        <a id="currentTime" href="#"></a>
                    </div>
                    <div class="controls">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" id="song-pic" >
                        <div class="controls-center">
                            <i class='fas fa-fast-backward' id="backward"></i>
                            <i class='far fa-play-circle' id="play" ></i>
                            <i class='far fa-pause-circle' id="pause" ></i>   
                        </div>
                        <audio id="myAudio">
                            <source
                                src=""
                                type="audio/mp4">
                        </audio>

                    </div>
                    <div class="progress" >
                        <div id="progressBar" class="progress-bar" role="progressbar" style="width: 0%"  aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                      <div class="tracks">
                        
                      </div>
  </div>
  `;

  function init(idElement) {
    if (!idElement) {
      throw new Error("You must provide an element to insert player");
    }
    document.querySelector("#" + idElement).innerHTML = template;
    setElements();
    addEventListeners();
  }
  
  function removeClass(element, className) {
    element.classList.remove(className);
  }
  function addClass(element, className) {
    element.classList.add(className);
  }

  function formatToSeconds(value) {
    if (isNaN(value)) {
      return "-:--";
    }
    return (
      Math.floor(value / 60) +
      ":" +
      (value % 60 ? value % 60 : 0).toFixed(0).padStart(2, "0")
    );
  }

  function playMusic() {
    if (player.src !== "") {
      player.play();
      addClass(play, "on");
      removeClass(pause, "on");
    }
  }

  function pauseMusic() {
    if (player.src !== "") {
      player.pause();
      addClass(pause, "on");
      removeClass(play, "on");
    }
  }

  function backwardMusic() {
    if (player.src !== "") {
      player.currentTime = 0;
      pauseMusic();
    }
  }

  function updateProgressBar() {
    let percentPlayed = (player.currentTime / player.duration) * 100;
    progressBar.style.width = percentPlayed + "%";
  }

  function updateCurrentTime(time) {
    currentTime.innerHTML = formatToSeconds(time);
  }

  function removeTracks() {
    let tracks = document.querySelector(".tracks");
    tracks.innerHTML = "";
  }

  function addTracks(tracks) {
    let tracksContainer = document.querySelector(".tracks");
    if (!tracks || tracks.length === 0) {
      tracksContainer.innerHTML = "No tracks";
      removeClass(tracksContainer, "tracks-full");
      return;
    }
    for (let track of tracks) {
      let trackElement = document.createElement("div");
      addClass(trackElement, "track");
      trackElement.dataset.id = track.id;
      trackElement.dataset.url = track.preview;
      trackElement.dataset.duration = track.duration;
      trackElement.innerHTML = `
      <div class="track-info">${track.id}</div>
     
      <img src="${track.imageUrl}">
      <div class="track-name">${track.name}</div>
      <div class="track-duration">${formatToSeconds(track.duration)}</div>
      `;
      tracksContainer.appendChild(trackElement);
      trackElement.addEventListener("click", () => {
        setTrackPlaying(trackElement);
        playMusic();
      });
    }
    addClass(tracksContainer, "tracks-full");
    //tracksContainer.classList.add("tracks-full");
    tracksContainer.scrollTo(0, 0);
  }

  function setPlayerInfo(trackName, imageUrl) {
    document.querySelector("#songTitle").innerHTML = trackName;
    document.querySelector("#song-pic").src = imageUrl;
  }

  function resetTrackPlaying() {
    let currentPlaying = document.querySelector(".track-playing");
    if (currentPlaying) {
      removeClass(currentPlaying, "track-playing");
      currentPlaying.querySelector(".track-info").innerHTML =
        currentPlaying.dataset.id;
    }
  }

  function loadFirstTrack() {
    let tracks = document.querySelectorAll(".track");
    if (tracks.length > 0) {
      setTrackPlaying(tracks[0]);
    }
  }

  function setTrackPlaying(trackElement) {
    resetTrackPlaying();
    let trackUrl = trackElement.dataset.url;
    let trackImageUrl = trackElement.querySelector("img").src;
    let trackName = trackElement.querySelector(".track-name").innerHTML;
    addClass(trackElement, "track-playing");
    trackElement.querySelector(".track-info").innerHTML =
      " <i class='fas fa-play'></i>";

    setPlayerInfo(trackName, trackImageUrl);
    player.src = trackUrl;
  }

  function addEventListeners() {
    // add event listeners to the controls
    play.addEventListener("click", playMusic);
    pause.addEventListener("click", pauseMusic);
    backward.addEventListener("click", backwardMusic);
    player.addEventListener(
      "loadedmetadata",
      function () {
        updateCurrentTime(player.duration);
      },
      false
    );
    player.addEventListener(
      "timeupdate",
      function () {
        updateProgressBar();
        updateCurrentTime(player.duration - player.currentTime);
      },
      false
    );
  }

  function setElements() {
    player = document.querySelector("#myAudio");
    play = document.querySelector("#play");
    pause = document.querySelector("#pause");
    backward = document.querySelector("#backward");
    currentTime = document.querySelector("#currentTime");
    controls = document.querySelectorAll(".controls-center");
    progressBar = document.querySelector("#progressBar");
  }

 

  function reset() {
    pauseMusic();
    player.src = "";
    removeTracks();
    setPlayerInfo(
      "",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    );
    removeClass(play, "on");
    removeClass(pause, "on");
    removeClass(backward, "on");
    progressBar.style.width = 0;
    currentTime.innerHTML = "-:--";
  }

  return {
    init,
    addTracks,
    reset,
    loadFirstTrack
  };
})();

export { Player };
