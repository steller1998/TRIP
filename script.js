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

const AIRPORT_DATA_URL="https://davidmegginson.github.io/ourairports-data/airports.csv";
let airportDataPromise=null;
let airportData=[];

const fallbackAirports=[
  {i:"DEL",n:"Indira Gandhi International Airport",c:"Delhi",o:"India"},
  {i:"BOM",n:"Chhatrapati Shivaji Maharaj International Airport",c:"Mumbai",o:"India"},
  {i:"BLR",n:"Kempegowda International Airport",c:"Bengaluru",o:"India"},
  {i:"HYD",n:"Rajiv Gandhi International Airport",c:"Hyderabad",o:"India"},
  {i:"MAA",n:"Chennai International Airport",c:"Chennai",o:"India"},
  {i:"CCU",n:"Netaji Subhas Chandra Bose International Airport",c:"Kolkata",o:"India"},
  {i:"GOI",n:"Manohar International Airport",c:"Goa",o:"India"},
  {i:"GOX",n:"Manohar International Airport",c:"North Goa",o:"India"},
  {i:"GAU",n:"Lokpriya Gopinath Bordoloi International Airport",c:"Guwahati",o:"India"},
  {i:"DXB",n:"Dubai International Airport",c:"Dubai",o:"United Arab Emirates"},
  {i:"AUH",n:"Zayed International Airport",c:"Abu Dhabi",o:"United Arab Emirates"},
  {i:"LHR",n:"Heathrow Airport",c:"London",o:"United Kingdom"},
  {i:"LGW",n:"Gatwick Airport",c:"London",o:"United Kingdom"},
  {i:"JFK",n:"John F. Kennedy International Airport",c:"New York",o:"United States"},
  {i:"SIN",n:"Singapore Changi Airport",c:"Singapore",o:"Singapore"},
  {i:"HND",n:"Haneda Airport",c:"Tokyo",o:"Japan"},
  {i:"CDG",n:"Charles de Gaulle Airport",c:"Paris",o:"France"},
  {i:"SYD",n:"Sydney Kingsford Smith Airport",c:"Sydney",o:"Australia"}
];

function today(){return new Date().toISOString().split("T")[0];}

function parseCsvLine(line){
  const out=[];
  let field="";
  let quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==="""){
      if(quoted && line[i+1]==="""){field+=""";i++;}
      else quoted=!quoted;
    }else if(ch==="," && !quoted){
      out.push(field);field="";
    }else{
      field+=ch;
    }
  }
  out.push(field);
  return out;
}

async function loadAirports(){
  if(airportData.length) return airportData;
  if(airportDataPromise) return airportDataPromise;

  airportDataPromise=(async()=>{
    try{
      const cached=localStorage.getItem("tripora_airports_v1");
      if(cached){
        const parsed=JSON.parse(cached);
        if(Array.isArray(parsed) && parsed.length>1000){
          airportData=parsed;
          return airportData;
        }
      }
    }catch(_){}

    try{
      const response=await fetch(AIRPORT_DATA_URL,{cache:"force-cache"});
      if(!response.ok) throw new Error("Airport data request failed");
      const csv=await response.text();
      const lines=csv.split(/\r?\n/);
      const headers=parseCsvLine(lines.shift()||"");
      const index={};
      headers.forEach((h,i)=>index[h]=i);

      const records=[];
      for(const line of lines){
        if(!line) continue;
        const row=parseCsvLine(line);
        const iata=(row[index.iata_code]||"").trim().toUpperCase();
        const type=(row[index.type]||"").trim().toLowerCase();
        if(!iata || iata.length!==3 || type==="closed") continue;

        const name=(row[index.name]||"").trim();
        const city=(row[index.municipality]||"").trim();
        const country=(row[index.iso_country]||"").trim();
        const gps=(row[index.gps_code]||"").trim().toUpperCase();
        const keywords=(row[index.keywords]||"").trim();

        records.push({i:iata,n:name,c:city,o:country,g:gps,k:keywords});
      }

      const unique=new Map();
      for(const airport of records){
        const key=airport.i+"|"+airport.n+"|"+airport.c;
        if(!unique.has(key)) unique.set(key,airport);
      }

      airportData=[...unique.values()];
      try{
        localStorage.setItem("tripora_airports_v1",JSON.stringify(airportData));
      }catch(_){}
      return airportData;
    }catch(error){
      airportData=fallbackAirports;
      return airportData;
    }
  })();

  return airportDataPromise;
}

function normalizeAirportText(value){
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}

function rankAirportMatches(query){
  const q=normalizeAirportText(query);
  if(q.length<2) return [];

  const words=q.split(/\s+/).filter(Boolean);
  const scored=[];

  for(const airport of airportData){
    const name=normalizeAirportText(airport.n);
    const city=normalizeAirportText(airport.c);
    const iata=normalizeAirportText(airport.i);
    const keywords=normalizeAirportText(airport.k||"");
    const haystack=[name,city,iata,airport.g||"",keywords].join(" ");

    let score=0;
    if(iata===q) score+=1000;
    if(name.startsWith(q)) score+=600;
    if(city.startsWith(q)) score+=550;
    if(haystack.includes(q)) score+=300;

    let allWords=true;
    for(const word of words){
      if(!haystack.includes(word)){allWords=false;break;}
    }
    if(allWords) score+=220;

    if(score>0) scored.push({airport,score});
  }

  scored.sort((a,b)=>{
    if(b.score!==a.score) return b.score-a.score;
    return a.airport.n.localeCompare(b.airport.n);
  });

  return scored.slice(0,8).map(item=>item.airport);
}

function setupAirportAutocomplete(){
  if(activeTab!=="Flights") return;

  ["from","to"].forEach(id=>{
    const input=document.getElementById("field-"+id);
    if(!input || input.dataset.airportReady==="1") return;

    input.dataset.airportReady="1";
    input.setAttribute("autocomplete","off");
    input.setAttribute("aria-autocomplete","list");

    const host=input.parentElement;
    host.classList.add("airport-field");

    const box=document.createElement("div");
    box.className="airport-suggestions";
    box.setAttribute("role","listbox");
    host.appendChild(box);

    let timer=null;

    const renderSuggestions=(items,message)=>{
      box.innerHTML="";
      if(message){
        box.innerHTML=`<div class="airport-status">${message}</div>`;
        box.classList.add("show");
        return;
      }
      if(!items.length){
        box.classList.remove("show");
        return;
      }

      items.forEach(airport=>{
        const option=document.createElement("button");
        option.type="button";
        option.className="airport-option";
        option.setAttribute("role","option");
        option.innerHTML=`
          <span class="airport-code">${airport.i}</span>
          <span class="airport-main">
            <strong>${airport.n}</strong>
            <small>${airport.c ? airport.c+" · " : ""}${airport.o || ""}</small>
          </span>`;
        option.addEventListener("mousedown",event=>event.preventDefault());
        option.addEventListener("click",()=>{
          input.value=`${airport.n} (${airport.i})`;
          box.classList.remove("show");
          input.dispatchEvent(new Event("change",{bubbles:true}));
        });
        box.appendChild(option);
      });
      box.classList.add("show");
    };

    input.addEventListener("input",()=>{
      const query=input.value.trim();
      clearTimeout(timer);
      if(query.length<2){
        box.classList.remove("show");
        return;
      }

      if(!airportData.length){
        renderSuggestions([], "Loading worldwide airports…");
      }

      timer=setTimeout(async()=>{
        await loadAirports();
        const matches=rankAirportMatches(query);
        renderSuggestions(matches,matches.length?"":"No matching airport found");
      },80);
    });

    input.addEventListener("focus",()=>{
      if(input.value.trim().length>=2){
        const matches=rankAirportMatches(input.value);
        if(matches.length) renderSuggestions(matches);
      }
      if(!airportData.length) loadAirports();
    });

    input.addEventListener("blur",()=>{
      setTimeout(()=>box.classList.remove("show"),160);
    });
  });
}

function getActiveFields(tabName){
  if(tabName !== "Flights") return configs[tabName].fields;

  const mode = document.querySelector('input[name="flightMode"]:checked')?.value || "One Way";
  const base = [
    ["from","From","text","Delhi / Airport"],
    ["to","To","text","Mumbai / Dubai"],
    ["departure","Departure","date",""]
  ];

  if(mode === "Round Trip"){
    return [
      ...base,
      ["return","Return","date",""],
      ["travellers","Travellers & Class","text","1 Traveller · Economy"]
    ];
  }

  if(mode === "Multi City"){
    return [
      ...base,
      ["nextDestination","Next Destination","text","e.g. Mumbai"],
      ["travellers","Travellers & Class","text","1 Traveller · Economy"]
    ];
  }

  // One Way: no Return Date field.
  return [
    ...base,
    ["travellers","Travellers & Class","text","1 Traveller · Economy"]
  ];
}

function render(tabName){
  activeTab=tabName;
  const cfg=configs[tabName];
  const activeFields=getActiveFields(tabName);

  fieldsEl.innerHTML=activeFields.map(([id,label,type,placeholder])=>{
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

  setupAirportAutocomplete();
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

document.querySelectorAll('input[name="flightMode"]').forEach(input=>{
  input.addEventListener("change",()=>{
    render("Flights");
  });
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