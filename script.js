const WHATSAPP_NUMBER="919181565815";
const WHATSAPP_URL="https://wa.me/"+WHATSAPP_NUMBER;

const configs={
  Flights:{helper:"Book domestic and international flights with Tripora.",fields:[
    ["from","From","text","Delhi / Airport"],
    ["to","To","text","Mumbai / Dubai"],
    ["departure","Departure","date",""],
    ["return","Return","date",""],
    ["travellers","Travellers & Class","text","1 Traveller · Economy"]
  ]},
  Hotels:{helper:"Find a stay by city, dates, guests and hotel preference.",fields:[
    ["city","City / Property","text","Goa"],
    ["checkin","Check-in","date",""],
    ["checkout","Check-out","date",""],
    ["guests","Rooms & Guests","text","1 Room · 2 Guests"],
    ["hoteltype","Hotel Preference","text","4 Star / Budget"]
  ]},
  Homestays:{helper:"Find homestays, villas and unique stays.",fields:[
    ["city","City / Destination","text","Manali"],
    ["checkin","Check-in","date",""],
    ["checkout","Check-out","date",""],
    ["guests","Guests","number","2"],
    ["staytype","Stay Type","text","Villa / Homestay"]
  ]},
  Holidays:{helper:"Build a complete holiday with stays and experiences.",fields:[
    ["destination","Destination","text","Kashmir"],
    ["from","Starting City","text","Delhi"],
    ["date","Travel Date","date",""],
    ["nights","Nights","number","4"],
    ["travellers","Travellers","number","2"]
  ]},
  Trains:{helper:"Share your route, journey date and class preference.",fields:[
    ["from","From Station / City","text","Guwahati"],
    ["to","To Station / City","text","New Delhi"],
    ["date","Journey Date","date",""],
    ["passengers","Passengers","number","1"],
    ["class","Class","text","3A / Sleeper"]
  ]},
  Buses:{helper:"Find bus options for your route and travel date.",fields:[
    ["from","From City","text","Noida"],
    ["to","To City","text","Delhi"],
    ["date","Journey Date","date",""],
    ["passengers","Passengers","number","1"],
    ["busType","Bus Preference","text","AC / Sleeper"]
  ]},
  Cabs:{helper:"Plan airport transfers and point-to-point cab rides.",fields:[
    ["pickup","Pickup","text","Delhi Airport"],
    ["drop","Drop","text","Noida"],
    ["date","Date","date",""],
    ["time","Pickup Time","time",""],
    ["passengers","Passengers","number","2"]
  ]},
  Tours:{helper:"Plan tours, activities and local attractions.",fields:[
    ["destination","Destination","text","Dubai"],
    ["activity","Activity","text","City Tour"],
    ["date","Date","date",""],
    ["travellers","Travellers","number","2"],
    ["budget","Approx. Budget","text","₹10,000"]
  ]},
  Visa:{helper:"Tell us where and when you are travelling for visa help.",fields:[
    ["destination","Destination Country","text","UAE"],
    ["travelDate","Travel Date","date",""],
    ["travellers","Travellers","number","1"],
    ["visaType","Visa Type","text","Tourist Visa"],
    ["nationality","Nationality","text","Indian"]
  ]},
  Cruise:{helper:"Tell us your preferred route, dates and travellers for cruise assistance.",fields:[
    ["destination","Cruise Destination","text","Dubai / Mediterranean"],
    ["date","Travel Date","date",""],
    ["nights","Nights","number","4"],
    ["travellers","Travellers","number","2"],
    ["cabin","Cabin Preference","text","Balcony / Interior"]
  ]},
  Forex:{helper:"Get assistance with travel money, forex cards and currency needs.",fields:[
    ["currency","Required Currency","text","USD / AED / EUR"],
    ["amount","Approx. Amount","text","₹50,000"],
    ["travelDate","Travel Date","date",""],
    ["travellers","Travellers","number","1"],
    ["purpose","Purpose","text","Holiday / Business"]
  ]},
  Insurance:{helper:"Choose travel insurance assistance for your journey.",fields:[
    ["destination","Destination","text","UAE"],
    ["travelDate","Departure Date","date",""],
    ["returnDate","Return Date","date",""],
    ["travellers","Travellers","number","1"],
    ["plan","Plan Preference","text","Individual / Family"]
  ]}
};

const tabs=[...document.querySelectorAll("[data-tab]")];
const fieldsEl=document.getElementById("dynamicFields");
const helper=document.getElementById("bookHelper");
const flightModes=document.getElementById("flightModes");
const specialFareBox=document.getElementById("specialFareBox");
const booking=document.getElementById("booking");
let activeTab="Flights";

function today(){return new Date().toISOString().split("T")[0];}

function render(tabName){
  activeTab=tabName;
  const cfg=configs[tabName];
  fieldsEl.innerHTML=cfg.fields.map(([id,label,type,placeholder])=>{
    const valueAttr=type==="number"?` value="${placeholder}" min="1"`:"";
    return `<div class="search-field"><label for="field-${id}">${label}</label><input id="field-${id}" name="${id}" type="${type}" placeholder="${placeholder}"${valueAttr} required></div>`;
  }).join("");

  fieldsEl.querySelectorAll('input[type="date"]').forEach(el=>el.min=today());
  helper.textContent=cfg.helper;
  flightModes.style.display=tabName==="Flights"?"flex":"none";
  specialFareBox.style.display=tabName==="Flights"?"flex":"none";

  tabs.forEach(t=>{
    const active=t.getAttribute("data-tab")===tabName;
    t.classList.toggle("active",active);
    if(t.classList.contains("nav-service")) t.setAttribute("aria-current",active?"page":"false");
    if(t.classList.contains("booking-tab")) t.setAttribute("aria-selected",active?"true":"false");
  });

  document.querySelectorAll(".fare-option").forEach(option=>{
    option.classList.toggle("active",option.querySelector("input")?.checked);
  });
}

function selectTab(tabName,shouldScroll){
  if(!configs[tabName]) return;
  render(tabName);
  if(shouldScroll) booking.scrollIntoView({behavior:"smooth",block:"start"});
}

tabs.forEach(t=>t.addEventListener("click",()=>{
  const name=t.getAttribute("data-tab");
  const fromNav=t.classList.contains("nav-service");
  selectTab(name,fromNav && window.innerWidth<900);
  if(fromNav) closeMobileNav();
}));

document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const lines=["Hello Tripora,","",`I want ${activeTab} booking assistance.`,""];
  if(activeTab==="Flights"){
    const mode=document.querySelector('input[name="flightMode"]:checked');
    const fare=document.querySelector('input[name="specialFare"]:checked');
    if(mode) lines.push("Trip Type: "+mode.value);
    if(fare) lines.push("Special Fare: "+fare.value);
  }
  for(const [key,val] of data.entries()){
    if(!val || key==="specialFare" || key==="flightMode") continue;
    const label=key.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase());
    lines.push(`${label}: ${val}`);
  }
  lines.push("","Please share the available options and booking details.");
  window.open(WHATSAPP_URL+"?text="+encodeURIComponent(lines.join("\n")),"_blank");
});

document.querySelectorAll(".fare-option input").forEach(input=>{
  input.addEventListener("change",()=>{
    document.querySelectorAll(".fare-option").forEach(option=>option.classList.toggle("active",option.querySelector("input")?.checked));
  });
});

document.querySelectorAll("[data-message]").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault();
    window.open(WHATSAPP_URL+"?text="+encodeURIComponent(btn.getAttribute("data-message")),"_blank");
  });
});

document.querySelectorAll("[data-jump]").forEach(link=>{
  link.addEventListener("click",()=>{
    selectTab(link.getAttribute("data-jump"),false);
  });
});

const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("primaryNav");
function closeMobileNav(){
  nav?.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuBtn?.setAttribute("aria-expanded","false");
}
menuBtn?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  document.body.classList.toggle("menu-open",open);
  menuBtn.setAttribute("aria-expanded",open?"true":"false");
});

const accountModal=document.getElementById("accountModal");
function openAccountModal(mode){
  accountModal.classList.add("open");
  accountModal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
  const title=document.getElementById("accountTitle");
  if(title) title.textContent=mode==="wishlist"?"Save your favourites":"Login / Sign up";
}
function closeAccountModal(){
  accountModal.classList.remove("open");
  accountModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}
document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeAccountModal));
document.querySelectorAll("[data-action]").forEach(el=>{
  el.addEventListener("click",()=>{
    const action=el.getAttribute("data-action");
    if(action==="login"||action==="trips"||action==="wishlist") openAccountModal(action);
  });
});
accountModal.addEventListener("click",e=>{if(e.target===accountModal) closeAccountModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape") closeAccountModal();});

document.getElementById("accountForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const name=data.get("name");
  const phone=data.get("phone");
  const title=document.getElementById("accountTitle")?.textContent||"Login / Sign up";
  const msg=`Hello Tripora,\n\nI want to use Tripora account support.\nName: ${name}\nMobile: ${phone}\nRequest: ${title}.\n\nPlease help me with the next step.`;
  window.open(WHATSAPP_URL+"?text="+encodeURIComponent(msg),"_blank");
  closeAccountModal();
  e.currentTarget.reset();
});

document.querySelectorAll(".social-row a[href='#']").forEach(a=>a.addEventListener("click",e=>e.preventDefault()));

render("Flights");