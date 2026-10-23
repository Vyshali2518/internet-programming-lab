
document.addEventListener("DOMContentLoaded",function(){
 const input=document.getElementById("home-search");
 const cards=[...document.querySelectorAll(".experiment-card")];
 input.addEventListener("input",function(){
   const q=input.value.trim().toLowerCase();let shown=0;
   cards.forEach(card=>{const match=card.textContent.toLowerCase().includes(q);card.classList.toggle("hidden",!match);if(match)shown++;});
   let empty=document.getElementById("home-empty");
   if(!shown&&!empty){empty=document.createElement("div");empty.id="home-empty";empty.className="empty-state";empty.textContent="No experiments match that search.";document.getElementById("experiment-grid").appendChild(empty);}
   if(shown&&empty)empty.remove();
 });
});
