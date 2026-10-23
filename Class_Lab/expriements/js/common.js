
const PAGE_TEXT = {
  library:{catalog:"Library catalogue",form:"Library service request",desc:"Search books and request a sample borrow, material or contact action."},
  hotel:{catalog:"Featured stays",form:"Hotel booking request",desc:"Choose a sample stay and enter your travel details."},
  bus:{catalog:"Available buses",form:"Bus ticket request",desc:"Select your bus, journey date and passenger count."},
  train:{catalog:"Available trains",form:"Train reservation request",desc:"Choose a sample train and travel class."},
  flight:{catalog:"Available flights",form:"Flight ticket request",desc:"Choose a sample flight and passenger details."},
  cake:{catalog:"Cakes, flowers & gifts",form:"Order request",desc:"Choose an item, delivery date and a short message."},
  beauty:{catalog:"Salon services",form:"Appointment request",desc:"Choose a service, stylist, date and time."},
  hospital:{catalog:"Find a doctor",form:"Hospital appointment request",desc:"Choose a doctor and request an appointment slot."},
  electronics:{catalog:"Popular gadgets",form:"Demo checkout",desc:"Add products to the demo cart and enter checkout details."},
  fashion:{catalog:"Trending styles",form:"Demo checkout",desc:"Choose a fashion item, size and quantity."},
  realestate:{catalog:"Featured properties",form:"Property viewing request",desc:"Filter properties and request a viewing."}
};
let activeConfig = null;
let selectedRecord = null;
let cart = [];
let currentRecords = [];

function startExperiment(config){
  activeConfig=config; currentRecords=config.records.slice();
  const text=PAGE_TEXT[config.slug];
  document.getElementById("catalog-title").textContent=text.catalog;
  document.getElementById("form-heading").textContent=text.form;
  document.getElementById("form-description").textContent=text.desc;
  const category=document.getElementById("category-filter");
  [...new Set(config.records.map(x=>x.category))].sort().forEach(c=>{
    const option=document.createElement("option"); option.value=c; option.textContent=c; category.appendChild(option);
  });
  document.getElementById("search-input").addEventListener("input",renderCatalog);
  category.addEventListener("change",renderCatalog);
  document.getElementById("sort-filter").addEventListener("change",renderCatalog);
  document.getElementById("demo-form").addEventListener("submit",submitDemoForm);
  renderCatalog(); buildForm(config.slug);
}
function money(n){return "₹"+Number(n).toLocaleString("en-IN");}
function renderCatalog(){
  const q=document.getElementById("search-input").value.trim().toLowerCase();
  const cat=document.getElementById("category-filter").value;
  const sort=document.getElementById("sort-filter").value;
  let list=activeConfig.records.filter(r=>(cat==="all"||r.category===cat)&&[r.name,r.category,r.detail,r.info].join(" ").toLowerCase().includes(q));
  if(sort==="price-low")list.sort((a,b)=>a.price-b.price);
  if(sort==="price-high")list.sort((a,b)=>b.price-a.price);
  if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
  currentRecords=list;
  document.getElementById("result-count").textContent=list.length+" option"+(list.length===1?"":"s")+" found";
  const grid=document.getElementById("catalog-grid"); grid.innerHTML="";
  if(!list.length){grid.innerHTML='<div class="empty-state">No matches found. Try a different search or category.</div>';return;}
  list.forEach(r=>{
    const originalIndex=activeConfig.records.indexOf(r);
    const card=document.createElement("article");card.className="product-card";
    const priceLabel=activeConfig.slug==="realestate"?"Sample asking price":(activeConfig.slug==="beauty"||activeConfig.slug==="hospital"?"Estimated fee": "Sample price");
    card.innerHTML=`<div class="product-visual"><span>${r.icon}</span><small class="product-tag">${escapeHTML(r.category)}</small></div><div class="product-content"><h3>${escapeHTML(r.name)}</h3><p>${escapeHTML(r.detail)}<br>${escapeHTML(r.info)}</p><div class="product-bottom"><strong class="price">${money(r.price)}<small>${priceLabel}</small></strong><button type="button" class="small-button" data-select="${originalIndex}">${buttonText(activeConfig.slug)}</button></div></div>`;
    card.querySelector("button").addEventListener("click",()=>selectRecord(r));
    grid.appendChild(card);
  });
}
function buttonText(slug){return ({library:"View / request",hotel:"Choose stay",bus:"Choose bus",train:"Choose train",flight:"Choose flight",cake:"Add item",beauty:"Choose service",hospital:"Choose doctor",electronics:"Add to cart",fashion:"Add to cart",realestate:"View property"})[slug]||"Choose";}
function selectRecord(r){
  selectedRecord=r;
  if(["electronics","fashion","cake"].includes(activeConfig.slug)){
    cart.push(r); showMessage("Added "+r.name+" to your demo selection. Items selected: "+cart.length+".","success");
    updateTotal(); if(activeConfig.slug==="cake")document.getElementById("selected-item").value=r.name;
    if(activeConfig.slug==="electronics"||activeConfig.slug==="fashion")document.getElementById("selected-item").value=r.name;
  }else{
    document.getElementById("selected-item").value=r.name;
    updateTotal();
    document.getElementById("demo-form").scrollIntoView({behavior:"smooth",block:"center"});
    showMessage("Selected: "+r.name+". Complete the form to continue.","success");
  }
}
function field(label,name,type,opts={},full=false){
  const wrap=document.createElement("div");wrap.className="field"+(full?" full":"");
  const lab=document.createElement("label");lab.htmlFor=name;lab.textContent=label+(opts.required===false?"":" *");wrap.appendChild(lab);
  let el;
  if(type==="select"){el=document.createElement("select");const first=document.createElement("option");first.value="";first.textContent=opts.placeholder||"Choose an option";el.appendChild(first);(opts.options||[]).forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;el.appendChild(o);});}
  else if(type==="textarea"){el=document.createElement("textarea");el.rows=3;el.placeholder=opts.placeholder||"";}
  else{el=document.createElement("input");el.type=type;el.placeholder=opts.placeholder||"";if(opts.min!==undefined)el.min=opts.min;if(opts.max!==undefined)el.max=opts.max;if(opts.step)el.step=opts.step;}
  el.id=name;el.name=name;if(opts.required!==false)el.required=true;
  if(opts.value!==undefined)el.value=opts.value;
  if(opts.minlength)el.minLength=opts.minlength;
  if(opts.maxlength)el.maxLength=opts.maxlength;
  if(opts.readonly)el.readOnly=true;
  el.addEventListener("input",()=>{wrap.classList.remove("invalid");const err=wrap.querySelector(".field-error");if(err)err.textContent="";updateTotal();});
  el.addEventListener("change",updateTotal);
  wrap.appendChild(el);const err=document.createElement("small");err.className="field-error";wrap.appendChild(err);
  document.getElementById("form-fields").appendChild(wrap);return el;
}
function buildForm(slug){
  const area=document.getElementById("form-fields");area.innerHTML="";
  field("Full name","customer-name","text",{placeholder:"Enter your name",minlength:2});
  field("Email address","customer-email","email",{placeholder:"you@example.com"});
  const selected=field("Selected option","selected-item","text",{placeholder:"Choose from the cards above",readonly:true,required:slug!=="library"},true);
  if(["hotel","bus","train","flight","cake","beauty","hospital","realestate","electronics","fashion"].includes(slug))selected.required=true;
  if(slug==="library"){
    field("Request type","request-type","select",{options:["Borrow a book","Study material request","Contact librarian"]});
    field("Student ID","student-id","text",{placeholder:"e.g. 24CSE101"});
    field("Issue date","issue-date","date",{value:new Date().toISOString().slice(0,10)});
    field("Expected return date","return-date","date",{value:new Date(Date.now()+14*86400000).toISOString().slice(0,10)});
    field("Late days (for fine estimate)","late-days","number",{min:0,max:365,value:0});
    field("Fine per day (₹)","fine-rate","number",{min:0,max:500,value:5});
    field("Message","message","textarea",{required:false,placeholder:"Optional note to the librarian"},true);
    document.getElementById("form-total").hidden=false;
  }else if(slug==="hotel"){
    field("Check-in date","travel-date","date",{min:new Date().toISOString().slice(0,10)});
    field("Check-out date","end-date","date",{min:new Date().toISOString().slice(0,10)});
    field("Guests","quantity","number",{min:1,max:8,value:2});
    field("Room type","room-type","select",{options:["Standard","Deluxe","Suite"]});
    document.getElementById("form-total").hidden=false;
  }else if(["bus","train","flight"].includes(slug)){
    field("Journey date","travel-date","date",{min:new Date().toISOString().slice(0,10)});
    field("Passengers","quantity","number",{min:1,max:8,value:1});
    if(slug==="train")field("Travel class","room-type","select",{options:["Sleeper","3A","2A","Chair Car"]});
    if(slug==="flight")field("Travel class","room-type","select",{options:["Economy","Premium","Business"]});
    if(slug==="bus")field("Seat preference","room-type","select",{options:["Window","Aisle","No preference"]});
    document.getElementById("form-total").hidden=false;
  }else if(slug==="cake"){
    field("Delivery date","travel-date","date",{min:new Date().toISOString().slice(0,10)});
    field("Quantity","quantity","number",{min:1,max:20,value:1});
    field("Gift message","message","textarea",{required:false,placeholder:"Add a short greeting"},true);
    field("Delivery address","address","text",{placeholder:"Area and street"},true);
    document.getElementById("form-total").hidden=false;
  }else if(slug==="beauty"){
    field("Appointment date","travel-date","date",{min:new Date().toISOString().slice(0,10)});
    field("Time slot","time-slot","select",{options:["10:00 AM","11:30 AM","01:00 PM","02:30 PM","04:00 PM","05:30 PM"]});
    field("Stylist","room-type","select",{options:["Ananya","Meera","Divya","Riya","Any available stylist"]});
    document.getElementById("form-total").hidden=false;
  }else if(slug==="hospital"){
    field("Appointment date","travel-date","date",{min:new Date().toISOString().slice(0,10)});
    field("Preferred time","time-slot","select",{options:["09:00 AM","10:30 AM","12:00 PM","02:00 PM","03:30 PM"]});
    field("Patient age","age","number",{min:0,max:120});
    field("Reason for visit","message","textarea",{placeholder:"Brief reason (optional)",required:false},true);
    document.getElementById("form-total").hidden=false;
  }else if(slug==="electronics"){
    field("Quantity","quantity","number",{min:1,max:10,value:1});
    field("Delivery address","address","text",{placeholder:"Area and street"},true);
    field("Payment demo","room-type","select",{options:["Demo card (no charge)","Pay on delivery (demo)"]});
    document.getElementById("form-total").hidden=false;
  }else if(slug==="fashion"){
    field("Size","room-type","select",{options:["XS","S","M","L","XL","6","7","8","9","10","One size","2–8 years"]});
    field("Quantity","quantity","number",{min:1,max:10,value:1});
    field("Delivery address","address","text",{placeholder:"Area and street"},true);
    document.getElementById("form-total").hidden=false;
  }else if(slug==="realestate"){
    field("Viewing date","travel-date","date",{min:new Date().toISOString().slice(0,10)});
    field("Preferred time","time-slot","select",{options:["10:00 AM","12:00 PM","02:00 PM","04:00 PM"]});
    field("Budget (₹)","budget","number",{min:0,step:100000,placeholder:"Your approximate budget"},true);
    field("Message to agent","message","textarea",{required:false,placeholder:"Any questions or preferences"},true);
  }
  updateTotal();
}
function updateTotal(){
  if(!activeConfig)return;
  const slug=activeConfig.slug;const qty=Math.max(1,Number(document.getElementById("quantity")?.value||1));
  let amount=selectedRecord?selectedRecord.price:0;
  if(["electronics","fashion","cake"].includes(slug)&&cart.length)amount=cart.reduce((sum,item)=>sum+item.price,0);
  if(slug==="library"){
    const days=Math.max(0,Number(document.getElementById("late-days")?.value||0));
    const rate=Math.max(0,Number(document.getElementById("fine-rate")?.value||0));
    amount=days*rate;document.getElementById("total-value").textContent=money(amount)+" fine estimate";
  }else{
    if(["hotel","bus","train","flight","beauty","hospital"].includes(slug))amount*=qty;
    if(["electronics","fashion","cake"].includes(slug)&&!cart.length)amount*=qty;
    if(slug==="hotel"){
      const a=document.getElementById("travel-date")?.value,b=document.getElementById("end-date")?.value;
      if(a&&b){const nights=Math.max(1,Math.ceil((new Date(b)-new Date(a))/86400000));amount*=nights;document.getElementById("total-value").textContent=money(amount)+" estimate";}
      else document.getElementById("total-value").textContent=money(amount)+" / night";
    }else document.getElementById("total-value").textContent=money(amount)+(slug==="realestate"?" asking price":" estimate");
  }
}
function submitDemoForm(event){
  event.preventDefault();let valid=true;
  const form=document.getElementById("demo-form");
  form.querySelectorAll(".field").forEach(w=>{
    const input=w.querySelector("input,select,textarea");const err=w.querySelector(".field-error");w.classList.remove("invalid");err.textContent="";
    if(input.required&&!input.value.trim()){valid=false;w.classList.add("invalid");err.textContent="This field is required.";return;}
    if(input.type==="email"&&input.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)){valid=false;w.classList.add("invalid");err.textContent="Enter a valid email address.";}
    if(input.type==="number"&&input.value&&(Number(input.value)<Number(input.min||0)||Number(input.value)>Number(input.max||999999999))){valid=false;w.classList.add("invalid");err.textContent="Enter a value within the allowed range.";}
    if(input.type==="date"&&input.value&&input.min&&input.value<input.min){valid=false;w.classList.add("invalid");err.textContent="Choose today or a future date.";}
    if(input.id==="end-date"&&input.value&&document.getElementById("travel-date").value&&input.value<=document.getElementById("travel-date").value){valid=false;w.classList.add("invalid");err.textContent="Check-out must be after check-in.";}
    if(input.id==="selected-item"&&!input.value&&["hotel","bus","train","flight","cake","beauty","hospital","electronics","fashion","realestate"].includes(activeConfig.slug)){valid=false;w.classList.add("invalid");err.textContent="Choose an option from the cards above.";}
  });
  if(!valid){showMessage("Please check the highlighted fields and try again.","error");const first=form.querySelector(".invalid input,.invalid select,.invalid textarea");if(first)first.focus();return;}
  let ref="DEMO-"+Math.random().toString(36).slice(2,8).toUpperCase();
  const label=activeConfig.slug==="library"?"request":activeConfig.slug==="beauty"||activeConfig.slug==="hospital"?"appointment":activeConfig.slug==="realestate"?"viewing request":"request";
  showMessage("Your "+label+" request has been submitted successfully. Reference: "+ref+".","success");
  form.reset();selectedRecord=null;cart=[];const d=document.getElementById("selected-item");if(d)d.value="";updateTotal();
}
function showMessage(message,type){
  const box=document.getElementById("form-message");box.textContent=message;box.className="form-message "+type;box.hidden=false;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
