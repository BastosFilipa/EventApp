function toggleLike() {
    var x = document.getElementById("heart");
    x.classList.toggle("fa-heart-broken");
   }
   
   var x = document.getElementById("myAudio"); 
   
   function playAudio() { 
     x.play(); 
   } 
   
   function pauseAudio() { 
     x.pause(); 
   } 