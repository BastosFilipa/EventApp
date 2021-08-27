



window.onload = function(){
    const mybutton = document.getElementById("scrollToTop");
    
    window.onscroll = function (){

        scrollFunction();
    }

    function topFunction() {
        document.documentElement.scrollTop = 0;
      }

      mybutton.onclick = function (){
        topFunction();
      } 
      
      

    function scrollFunction (){
        if (document.documentElement.scrollTop >= 300){
           mybutton.style.display = "block";
        }
       else {
           mybutton.style.display = "none";
       }
   }

   
}
