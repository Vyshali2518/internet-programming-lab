// JavaScript and TypeScript
const STORAGE_KEY = "site-18-records";
const records = [{"title": "Hybrid Maize Seeds", "description": "High-yield · 1 kg", "price": "₹420"}, {"title": "Organic Compost", "description": "Soil conditioner · 5 kg", "price": "₹260"}, {"title": "Drip Irrigation Kit", "description": "Water-saving · 20 m", "price": "₹1,450"}, {"title": "Hand Sprayer", "description": "Manual · 2 litre", "price": "₹380"}];
const searchInput = document.getElementById("searchInput");
const recordGrid = document.getElementById("recordGrid");
const mainForm = document.getElementById("mainForm");
const formMessage = document.getElementById("formMessage");
let basket = [];
function escapeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function renderRecords(list = records) {
  recordGrid.innerHTML = list.map((item,index) => `<article class="card"><div class="visual">${String(index+1).padStart(2,"0")}</div><div><span class="badge">Farm supplies</span><h3>${escapeText(item.title)}</h3><p>${escapeText(item.description)}</p></div><div class="bottom"><span class="price">${escapeText(item.price)}</span><button type="button" class="select-item" data-item="${escapeText(item.title)}">Select</button></div></article>`).join("") || '<div class="empty">No matching results. Try another search.</div>';
}
function getSavedRecords() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
function renderActivity() {
  const rows=document.getElementById("activityRows"), saved=getSavedRecords();
  rows.innerHTML=saved.length?saved.map((r,i)=>`<tr><td>#${String(saved.length-i).padStart(3,"0")}</td><td>${escapeText(r.summary)}</td><td>${escapeText(r.date)}</td><td><span class="badge">Received</span></td></tr>`).join(""):'<tr><td colspan="4" class="muted">No activity yet.</td></tr>';
}
function saveRecord(record) { const saved=getSavedRecords(); saved.unshift(record); localStorage.setItem(STORAGE_KEY,JSON.stringify(saved)); renderActivity(); }
function selectItem(name) {
  const matching=[...mainForm.querySelectorAll("select")].find(el=>[...el.options].some(o=>o.text===name));
  if(matching) matching.value=name;
  basket.push(name);
  const basketBox=document.getElementById("basketItems");
  if(basketBox) basketBox.innerHTML=basket.map(escapeText).join("<br>");
  formMessage.className="notice";
  formMessage.textContent="Selected: " + name + ". Complete the form to continue.";
  document.getElementById("request").scrollIntoView({behavior:"smooth",block:"start"});
}
recordGrid.addEventListener("click",event=>{const button=event.target.closest(".select-item");if(button)selectItem(button.dataset.item);});
searchInput.addEventListener("input",()=>{const term=searchInput.value.trim().toLowerCase();renderRecords(records.filter(item=>(item.title+" "+item.description).toLowerCase().includes(term)));});
document.getElementById("clearSearch").addEventListener("click",()=>{searchInput.value="";renderRecords();});
mainForm.addEventListener("submit",event=>{
  event.preventDefault(); if(!mainForm.reportValidity())return;
  const values=[...new FormData(mainForm).entries()].map(([key,value])=>`${key}: ${value}`);
  saveRecord({summary:values.join(" · "),date:new Date().toLocaleString()});
  formMessage.className="notice";formMessage.textContent="Your details have been saved successfully.";mainForm.reset();
});
document.getElementById("clearRecords").addEventListener("click",()=>{if(confirm("Clear all saved activity from this browser?")){localStorage.removeItem(STORAGE_KEY);renderActivity();}});
renderRecords();renderActivity();
