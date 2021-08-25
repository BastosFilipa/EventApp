

function convert(value) {
  return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00').toFixed(0).padStart(2, '0');
}
  document.addEventListener("DOMContentLoaded", function() {

    const player = document.getElementById("myAudio"); 
    const play = document.getElementById("play"); 
    const pause = document.getElementById("pause"); 
    const currentTime = document.getElementById("currentTime");
    let progressBar = document.getElementById("progressBar");

    currentTime.innerHTML = "0:00";
    play.addEventListener("click", function() {   player.play(); });
    pause.addEventListener("click", function() {   player.pause(); });

    player.addEventListener('loadedmetadata',function(){
      currentTime.innerHTML =convert(player.duration);
  },false);
    
    player.addEventListener('timeupdate',function(){
      let currentTimeMs = player.currentTime;
      let percentPlayed = (currentTimeMs / player.duration) * 100;
      progressBar.style.width = percentPlayed + "%";
      currentTime.innerHTML = convert(player.duration - currentTimeMs);
  },false);


   

  });