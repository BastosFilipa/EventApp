import { renderResults } from "../events/renderResults.js"; 
import { Events } from "../events/events.js";

const Bookmark = (() => {

    let events;
    let actionLink;
    let actioEvent;

    
    function init(target){
       actionLink =document.querySelector(target);
       actionLink.addEventListener("click", preventDefault);
       events = parse(window.localStorage.getItem("events"));
       if(!events){
           events = [];
           save();
       }

       document.querySelector("#bookmark").addEventListener("click", load);

       updateCount();
    }

    function updateCount(){

        document.querySelector("#bookmarkCount").innerText = events.length;
        
    }

    function preventDefault(e){
        e.preventDefault();
        e.stopPropagation();
    }

    function bind(target, event){
        
        actioEvent = event;
        if(exists(event)!= undefined){
            setRemove();
        }else{
            setAdd();
        }
        
    }

    function setAdd(){
        actionLink.innerText = "Add to bookmarks";
        actionLink.removeEventListener("click", remove);
        actionLink.addEventListener("click", add);  
    }

    function setRemove(){
        actionLink.innerText = "Remove from Bookmarks";
        actionLink.removeEventListener("click", add);
        actionLink.addEventListener("click", remove);
    }

    function add(){
        events.push(actioEvent);
        save();
        setRemove();
        
    }
    function remove(){
        events=Object.values(events).filter((obj) => {
            return JSON.stringify(obj) != JSON.stringify(actioEvent);
        });
        save();
        setAdd();
        load();
        
    }

    function load(){
        document.querySelector("#cards-container").innerHTML = "";
        renderResults(events);
        Events.bindModal();
    }

    function save(){
        window.localStorage.setItem("events", JSON.stringify(events));
        updateCount();
    }

    function parse(event){
        return JSON.parse(event);
    }

    function exists(event){
        return Object.values(events).find((obj) => {
            return JSON.stringify(obj) == JSON.stringify(event);
        });;
    }

    return{
        init,
        bind,
        add,
        remove,
        load
    }
})();

export {Bookmark};