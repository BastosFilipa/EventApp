
const ScrollButton = (() => {

    const scrollToTop = document.getElementById('scrollToTop');

    const scrollToTopFunc = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    };

    const scrollToTopClick = () => {
        scrollToTop.addEventListener('click', scrollToTopFunc);
    };

    window.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop >= 300){
        scrollToTop.style.display = "block";
     }
    else {
      scrollToTop.style.display = "none";
    }
    });

    const init = () => {
        scrollToTopClick();
    };

    return {
        init
    };
})();

export {ScrollButton};




