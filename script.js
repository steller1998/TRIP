const WHATSAPP_NUMBER="919181565815";
const WHATSAPP_URL="https://wa.me/"+WHATSAPP_NUMBER;

const configs={
  Flights:{helper:"Book domestic and international flights with Tripora.",fields:[
    ["from","From","text","Delhi"],
    ["to","To","text","Dubai"],
    ["departure","Departure","date",""],
    ["return","Return","date",""],
    ["travellers","Travellers & Class","text","1 Traveller · Economy"]
  ]},
  Hotels:{helper:"Find a stay that matches your dates, city and budget.",fields:[
    ["city","City / Area","text","Goa"],
    ["checkin","Check-in","date",""],
    ["checkout","Check-out","date",""],
    ["guests","Guests & Rooms","text","2 Guests · 1 Room"],
    ["hoteltype","Hotel Preference","text","4 Star / Budget"]
  ]},
  Homestays:{helper:"Discover homestays, villas and unique stays.",fields:[
    ["city","City / Destination","text","Manali"],
    ["checkin","Check-in","date",""],
    ["checkout","Check-out","date",""],
    ["guests","Guests","number","2"],
    ["staytype","Stay Type","text","Villa / Homestay"]
  ]},
  Holidays:{helper:"Plan a complete holiday with stays, sightseeing and transfers.",fields:[
    ["destination","Destination","text","Kashmir"],
    ["from","Starting City","text","Delhi"],
    ["date","Travel Date","date",""],
    ["nights","Nights","number","4"],
    ["travellers","Travellers","number","2"]
  ]},
  Trains:{helper:"Share your route and journey date for train booking assistance.",fields:[
    ["from","From Station / City","text","Guwahati"],
    ["to","To Station / City","text","New Delhi"],
    ["date","Journey Date","date",""],
    ["passengers","Passengers","number","1"],
    ["class","Class","text","3A / Sleeper"]
  ]},
  Buses:{helper:"Find bus options for your route and journey date.",fields:[
    ["from","From City","text","Noida"],
    ["to","To City","text","Delhi"],
    ["date","Journey Date","date",""],
    ["passengers","Passengers","number","1"],
    ["busType","Bus Preference","text","AC / Sleeper"]
  ]},
  Cabs:{helper:"Plan airport transfers and point-to-point cab travel.",fields:[
    ["pickup","Pickup","text","Delhi Airport"],
    ["drop","Drop","text","Noida"],
    ["date","Date","date",""],
    ["time","Pickup Time","time",""],
    ["passengers","Passengers","number","2"]
  ]},
  Tours:{helper:"Explore activities, attractions and local experiences.",fields:[
    ["destination","Destination","text","Dubai"],
    ["activity","Activity","text","City Tour"],
    ["date","Date","date",""],
    ["travellers","Travellers","number","2"],
    ["budget","Approx. Budget","text","₹10,000"]
  ]},
  Visa:{helper:"Tell us your destination and travel plan for visa assistance.",fields:[
    ["destination","Destination Country","text","UAE"],
    ["travelDate","Travel Date","date",""],
    ["travellers","Travellers","number","1"],
    ["visaType","Visa Type","text","Tourist Visa"],
    ["nationality","Nationality","text","Indian"]
  ]}
};

const tabs=[...document.querySelectorAll("[data-tab]")];
const fieldsEl=document.getElementById("dynamicFields");
const helper=document.getElementById("bookHelper");
const flightModes=document.getElementById("flightModes");
const specialRow=document.getElementById("specialRow");
let activeTab="Flights";

function today(){
  return new Date().toISOString().split("T")[0];
}
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
  specialRow.style.display=tabName==="Flights"?"flex":"none";
  tabs.forEach(t=>{
    const active=t.getAttribute("data-tab")===tabName;
    t.classList.toggle("active",active);
    if(t.classList.contains("nav-service")) t.setAttribute("aria-current",active?"page":"false");
    if(t.classList.contains("booking-tab")) t.setAttribute("aria-selected",active?"true":"false");
  });
}
function selectTab(tabName,scroll=true){
  render(tabName);
  if(scroll && window.innerWidth<900){
    document.getElementById("booking").scrollIntoView({behavior:"smooth",block:"start"});
  }
}
tabs.forEach(t=>t.addEventListener("click",()=>selectTab(t.getAttribute("data-tab"),t.classList.contains("nav-service"))));

document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const lines=["Hello Tripora,","",`I want ${activeTab} booking assistance.`,""];
  const flightMode=document.querySelector('input[name="flightMode"]:checked');
  if(activeTab==="Flights" && flightMode) lines.push("Trip Type: "+flightMode.value);
  for(const [key,val] of data.entries()){
    if(!val || key==="student"||key==="senior"||key==="armed"||key==="doctor") continue;
    const label=key.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase());
    lines.push(`${label}: ${val}`);
  }
  const fares=[];
  ["student","senior","armed","doctor"].forEach(k=>{const el=document.querySelector(`input[name="${k}"]`);if(el&&el.checked)fares.push(el.value)});
  if(fares.length) lines.push("Special Fares: "+fares.join(", "));
  lines.push("","Please share the available options and booking details.");
  window.open(WHATSAPP_URL+"?text="+encodeURIComponent(lines.join("\n")),"_blank");
});

document.querySelectorAll("[data-message]").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault();
    const message=btn.getAttribute("data-message");
    window.open(WHATSAPP_URL+"?text="+encodeURIComponent(message),"_blank");
  });
});

document.querySelectorAll("[data-jump]").forEach(link=>{
  link.addEventListener("click",()=>{
    const tab=link.getAttribute("data-jump");
    selectTab(tab,false);
  });
});

const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("primaryNav");
menuBtn?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  document.body.classList.toggle("menu-open",open);
  menuBtn.setAttribute("aria-expanded",open?"true":"false");
});
document.querySelectorAll(".nav-service").forEach(btn=>btn.addEventListener("click",()=>nav.classList.remove("open")));

document.querySelectorAll(".social-row a[href='#']").forEach(a=>a.addEventListener("click",e=>e.preventDefault()));

render("Flights");