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
    ["city","City / Property","text","Goa or Taj Palace"],
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

    if(ch === '"'){
      if(quoted && line[i+1] === '"'){
        field += '"';
        i++;
      }else{
        quoted = !quoted;
      }
    }else if(ch === "," && !quoted){
      out.push(field);
      field="";
    }else{
      field += ch;
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

const stationSuggestions=[
  "New Delhi Railway Station · New Delhi",
  "Old Delhi Railway Station · Delhi",
  "Anand Vihar Terminal · Delhi",
  "Hazrat Nizamuddin · Delhi",
  "Mumbai Central · Mumbai",
  "Chhatrapati Shivaji Maharaj Terminus · Mumbai",
  "Lokmanya Tilak Terminus · Mumbai",
  "Bandra Terminus · Mumbai",
  "Howrah Junction · Kolkata",
  "Sealdah · Kolkata",
  "Kolkata Railway Station · Kolkata",
  "Chennai Central · Chennai",
  "Chennai Egmore · Chennai",
  "Bengaluru City Railway Station · Bengaluru",
  "KSR Bengaluru · Bengaluru",
  "Hyderabad Deccan · Hyderabad",
  "Secunderabad Junction · Hyderabad",
  "Guwahati Railway Station · Guwahati",
  "Pune Junction · Pune",
  "Ahmedabad Junction · Ahmedabad",
  "Jaipur Junction · Jaipur",
  "Lucknow Charbagh · Lucknow",
  "Varanasi Junction · Varanasi",
  "Patna Junction · Patna",
  "Bhopal Junction · Bhopal",
  "Indore Junction · Indore",
  "Bhubaneswar · Bhubaneswar",
  "Cuttack · Cuttack",
  "Amritsar Junction · Amritsar",
  "Chandigarh · Chandigarh",
  "Dehradun · Dehradun",
  "Haridwar Junction · Haridwar",
  "Rishikesh · Rishikesh",
  "Agra Cantt · Agra",
  "Kanpur Central · Kanpur",
  "Nagpur · Nagpur",
  "Surat · Surat",
  "Kochi Ernakulam · Kochi",
  "Thiruvananthapuram Central · Thiruvananthapuram",
  "Goa Madgaon · Goa",
  "Vijayawada Junction · Vijayawada"
];

const countries=[
  "India","United Arab Emirates","United Kingdom","United States","Singapore","Thailand","Malaysia","Indonesia",
  "France","Germany","Italy","Spain","Switzerland","Netherlands","Australia","New Zealand","Japan","South Korea",
  "Canada","Qatar","Saudi Arabia","Oman","Bahrain","Kuwait","Nepal","Bhutan","Sri Lanka","Maldives","Mauritius",
  "Egypt","Turkey","Vietnam","Philippines","Hong Kong","China","South Africa","Kenya","Tanzania","Seychelles",
  "Bangladesh","Bhutan","Pakistan","Bangladesh","Ireland","Portugal","Greece","Austria","Belgium","Norway",
  "Sweden","Denmark","Finland","Brazil","Mexico","Russia","Georgia","Armenia","Azerbaijan","Uzbekistan"
];

const activities=[
  "City Tour","Sightseeing","Desert Safari","Scuba Diving","Snorkelling","Paragliding","Trekking",
  "River Rafting","Skiing","Cruise Dinner","Museum Visit","Theme Park","Water Park","Wildlife Safari",
  "Adventure Activities","Beach Activities","Cultural Tour","Food Tour","Shopping Tour","Photography Tour"
];

const currencies=[
  "INR – Indian Rupee","AED – UAE Dirham","USD – US Dollar","EUR – Euro","GBP – British Pound",
  "SGD – Singapore Dollar","THB – Thai Baht","MYR – Malaysian Ringgit","AUD – Australian Dollar",
  "CAD – Canadian Dollar","JPY – Japanese Yen","SAR – Saudi Riyal","QAR – Qatari Riyal","OMR – Omani Rial",
  "BHD – Bahraini Dinar","KWD – Kuwaiti Dinar","CHF – Swiss Franc"
];

const hotelCities=[
  "Agra, India","Ahmedabad, India","Amritsar, India","Aurangabad, India","Bengaluru, India","Bhopal, India",
  "Bhubaneswar, India","Chandigarh, India","Chennai, India","Coimbatore, India","Dehradun, India","Delhi, India",
  "Dharamshala, India","Goa, India","Gurugram, India","Guwahati, India","Haridwar, India","Hyderabad, India",
  "Jaipur, India","Jaisalmer, India","Jammu, India","Jodhpur, India","Kochi, India","Kolkata, India",
  "Kullu, India","Lucknow, India","Manali, India","Mumbai, India","Mysuru, India","Nagpur, India",
  "New Delhi, India","Noida, India","Ooty, India","Panchgani, India","Patna, India","Pondicherry, India",
  "Pune, India","Rishikesh, India","Shillong, India","Shimla, India","Srinagar, India","Surat, India",
  "Thiruvananthapuram, India","Udaipur, India","Varanasi, India","Vijayawada, India","Visakhapatnam, India",
  "Abu Dhabi, United Arab Emirates","Al Ain, United Arab Emirates","Dubai, United Arab Emirates",
  "Sharjah, United Arab Emirates","Singapore, Singapore","Bangkok, Thailand","Phuket, Thailand",
  "Pattaya, Thailand","Kuala Lumpur, Malaysia","Langkawi, Malaysia","Bali, Indonesia","Jakarta, Indonesia",
  "Malé, Maldives","Colombo, Sri Lanka","Kathmandu, Nepal","Thimphu, Bhutan","Dhaka, Bangladesh",
  "London, United Kingdom","Manchester, United Kingdom","Edinburgh, United Kingdom","Paris, France",
  "Nice, France","Rome, Italy","Milan, Italy","Venice, Italy","Barcelona, Spain","Madrid, Spain",
  "Amsterdam, Netherlands","Berlin, Germany","Munich, Germany","Zurich, Switzerland","Vienna, Austria",
  "Athens, Greece","Lisbon, Portugal","Dublin, Ireland","Istanbul, Türkiye","New York, United States",
  "Los Angeles, United States","San Francisco, United States","Las Vegas, United States","Orlando, United States",
  "Miami, United States","Chicago, United States","Toronto, Canada","Vancouver, Canada","Montreal, Canada",
  "Sydney, Australia","Melbourne, Australia","Brisbane, Australia","Auckland, New Zealand","Tokyo, Japan",
  "Osaka, Japan","Seoul, South Korea","Hong Kong, Hong Kong","Doha, Qatar","Riyadh, Saudi Arabia",
  "Jeddah, Saudi Arabia","Muscat, Oman","Manama, Bahrain","Kuwait City, Kuwait","Cairo, Egypt",
  "Cape Town, South Africa","Nairobi, Kenya","Mauritius, Mauritius"
];

const hotelProperties=[
  {n:"Taj Palace, New Delhi",c:"New Delhi",o:"India"},
  {n:"The Leela Palace New Delhi",c:"New Delhi",o:"India"},
  {n:"ITC Maurya, a Luxury Collection Hotel",c:"New Delhi",o:"India"},
  {n:"The Imperial New Delhi",c:"New Delhi",o:"India"},
  {n:"The Lalit New Delhi",c:"New Delhi",o:"India"},
  {n:"JW Marriott Hotel New Delhi Aerocity",c:"New Delhi",o:"India"},
  {n:"Radisson Blu Plaza Delhi Airport",c:"New Delhi",o:"India"},
  {n:"The Oberoi Gurgaon",c:"Gurugram",o:"India"},
  {n:"Trident Gurgaon",c:"Gurugram",o:"India"},
  {n:"Taj City Centre Gurugram",c:"Gurugram",o:"India"},
  {n:"The Leela Ambience Gurugram Hotel & Residences",c:"Gurugram",o:"India"},
  {n:"Taj Mahal Palace, Mumbai",c:"Mumbai",o:"India"},
  {n:"The Oberoi Mumbai",c:"Mumbai",o:"India"},
  {n:"Trident Nariman Point",c:"Mumbai",o:"India"},
  {n:"ITC Maratha, a Luxury Collection Hotel",c:"Mumbai",o:"India"},
  {n:"The St. Regis Mumbai",c:"Mumbai",o:"India"},
  {n:"Taj Santacruz",c:"Mumbai",o:"India"},
  {n:"Taj Exotica Resort & Spa, Goa",c:"Goa",o:"India"},
  {n:"W Goa",c:"Goa",o:"India"},
  {n:"The Leela Goa",c:"Goa",o:"India"},
  {n:"ITC Grand Goa Resort & Spa",c:"Goa",o:"India"},
  {n:"Grand Hyatt Goa",c:"Goa",o:"India"},
  {n:"Taj Fort Aguada Resort & Spa",c:"Goa",o:"India"},
  {n:"Taj West End",c:"Bengaluru",o:"India"},
  {n:"The Leela Palace Bengaluru",c:"Bengaluru",o:"India"},
  {n:"ITC Gardenia, a Luxury Collection Hotel",c:"Bengaluru",o:"India"},
  {n:"The Oberoi Bengaluru",c:"Bengaluru",o:"India"},
  {n:"Taj Krishna",c:"Hyderabad",o:"India"},
  {n:"ITC Kohenur, a Luxury Collection Hotel",c:"Hyderabad",o:"India"},
  {n:"Taj Deccan",c:"Hyderabad",o:"India"},
  {n:"The Leela Palace Chennai",c:"Chennai",o:"India"},
  {n:"ITC Grand Chola",c:"Chennai",o:"India"},
  {n:"Taj Coromandel",c:"Chennai",o:"India"},
  {n:"Taj Bengal",c:"Kolkata",o:"India"},
  {n:"ITC Royal Bengal",c:"Kolkata",o:"India"},
  {n:"The Oberoi Grand Kolkata",c:"Kolkata",o:"India"},
  {n:"Rambagh Palace",c:"Jaipur",o:"India"},
  {n:"The Oberoi Rajvilas Jaipur",c:"Jaipur",o:"India"},
  {n:"ITC Rajputana, a Luxury Collection Hotel",c:"Jaipur",o:"India"},
  {n:"Taj Jai Mahal Palace",c:"Jaipur",o:"India"},
  {n:"Taj Lake Palace",c:"Udaipur",o:"India"},
  {n:"The Oberoi Udaivilas",c:"Udaipur",o:"India"},
  {n:"Trident Udaipur",c:"Udaipur",o:"India"},
  {n:"The Oberoi Amarvilas",c:"Agra",o:"India"},
  {n:"ITC Mughal, a Luxury Collection Resort & Spa",c:"Agra",o:"India"},
  {n:"Taj Hotel & Convention Centre Agra",c:"Agra",o:"India"},
  {n:"Taj Rishikesh Resort & Spa",c:"Rishikesh",o:"India"},
  {n:"Aloha On The Ganges",c:"Rishikesh",o:"India"},
  {n:"Taj Madikeri Resort & Spa",c:"Coorg",o:"India"},
  {n:"The Leela Palace Udaipur",c:"Udaipur",o:"India"},
  {n:"Taj Corbett Resort & Spa",c:"Corbett",o:"India"},
  {n:"The Oberoi Cecil",c:"Shimla",o:"India"},
  {n:"Wildflower Hall, An Oberoi Resort",c:"Shimla",o:"India"},
  {n:"Hyatt Regency Delhi",c:"New Delhi",o:"India"},
  {n:"Hyatt Regency Mumbai",c:"Mumbai",o:"India"},
  {n:"Hyatt Regency Goa Resort and Spa",c:"Goa",o:"India"},
  {n:"Taj Dubai",c:"Dubai",o:"United Arab Emirates"},
  {n:"Burj Al Arab Jumeirah",c:"Dubai",o:"United Arab Emirates"},
  {n:"Atlantis, The Palm",c:"Dubai",o:"United Arab Emirates"},
  {n:"JW Marriott Marquis Hotel Dubai",c:"Dubai",o:"United Arab Emirates"},
  {n:"Jumeirah Beach Hotel",c:"Dubai",o:"United Arab Emirates"},
  {n:"The Ritz-Carlton Dubai",c:"Dubai",o:"United Arab Emirates"},
  {n:"Palace Downtown",c:"Dubai",o:"United Arab Emirates"},
  {n:"Raffles Dubai",c:"Dubai",o:"United Arab Emirates"},
  {n:"Emirates Palace Mandarin Oriental",c:"Abu Dhabi",o:"United Arab Emirates"},
  {n:"The Ritz-Carlton Abu Dhabi, Grand Canal",c:"Abu Dhabi",o:"United Arab Emirates"},
  {n:"The Savoy",c:"London",o:"United Kingdom"},
  {n:"The Ritz London",c:"London",o:"United Kingdom"},
  {n:"The Langham, London",c:"London",o:"United Kingdom"},
  {n:"The Dorchester",c:"London",o:"United Kingdom"},
  {n:"Park Hyatt Paris-Vendôme",c:"Paris",o:"France"},
  {n:"The Ritz Paris",c:"Paris",o:"France"},
  {n:"Shangri-La Paris",c:"Paris",o:"France"},
  {n:"The Plaza",c:"New York",o:"United States"},
  {n:"The St. Regis New York",c:"New York",o:"United States"},
  {n:"Park Hyatt New York",c:"New York",o:"United States"},
  {n:"Marina Bay Sands",c:"Singapore",o:"Singapore"},
  {n:"Raffles Singapore",c:"Singapore",o:"Singapore"},
  {n:"The Fullerton Hotel Singapore",c:"Singapore",o:"Singapore"},
  {n:"The Peninsula Hong Kong",c:"Hong Kong",o:"Hong Kong"},
  {n:"The Tokyo Station Hotel",c:"Tokyo",o:"Japan"},
  {n:"Park Hyatt Tokyo",c:"Tokyo",o:"Japan"},
  {n:"The Peninsula Tokyo",c:"Tokyo",o:"Japan"},
  {n:"The Grand Hyatt Bangkok",c:"Bangkok",o:"Thailand"},
  {n:"The Peninsula Bangkok",c:"Bangkok",o:"Thailand"},
  {n:"The Westin Resort Nusa Dua",c:"Bali",o:"Indonesia"},
  {n:"Four Seasons Resort Bali at Sayan",c:"Bali",o:"Indonesia"},
  {n:"The St. Regis Maldives Vommuli Resort",c:"Maldives",o:"Maldives"},
  {n:"Anantara Iko Mauritius Resort & Villas",c:"Mauritius",o:"Mauritius"},
  {n:"Burj Al Arab",c:"Dubai",o:"United Arab Emirates"}
];

const suggestionOptions={
  class:["Economy","Premium Economy","Business","First Class","Sleeper","3A","2A","1A","AC Chair Car"],
  hoteltype:["Budget","3 Star","4 Star","5 Star","Luxury","Resort","Business Hotel"],
  staytype:["Homestay","Villa","Apartment","Guest House","Resort","Cottage"],
  busType:["AC Seater","AC Sleeper","Non-AC","Volvo","Luxury","Sleeper"],
  cabin:["Interior","Ocean View","Balcony","Suite","Family Cabin"],
  visaType:["Tourist Visa","Business Visa","Student Visa","Transit Visa","Work Visa","Family / Visit Visa"],
  nationality:["Indian","British","American","Canadian","Australian","Singaporean","UAE","Nepalese","Bangladeshi"],
  purpose:["Holiday","Business","Study","Family Visit","Medical Travel"],
  plan:["Individual","Family","Senior","Couple","Single Trip","Multi Trip"]
};

function citySuggestions(query,limit=8){
  const q=normalizeAirportText(query);
  if(q.length<2) return [];

  const results=[];
  const seen=new Set();

  for(const airport of airportData){
    const city=airport.c || "";
    const name=airport.n || "";
    const iata=airport.i || "";
    const hay=normalizeAirportText([city,name,iata].join(" "));
    if(!hay.includes(q)) continue;

    const key=city.toLowerCase()+"|"+airport.o;
    if(seen.has(key)) continue;
    seen.add(key);

    let score=0;
    if(normalizeAirportText(city).startsWith(q)) score+=500;
    if(normalizeAirportText(name).startsWith(q)) score+=350;
    if(normalizeAirportText(iata)===q) score+=300;
    if(hay.includes(q)) score+=120;

    results.push({
      label:city || name,
      sub:airport.o || "",
      score
    });
  }

  results.sort((a,b)=>b.score-a.score || a.label.localeCompare(b.label));
  return results.slice(0,limit);
}

function textListSuggestions(list,query,limit=8){
  const q=normalizeAirportText(query);
  if(q.length<2) return [];

  return list
    .map(item=>({label:item,sub:"",score:normalizeAirportText(item).startsWith(q)?500:(normalizeAirportText(item).includes(q)?250:0)}))
    .filter(item=>item.score>0)
    .sort((a,b)=>b.score-a.score || a.label.localeCompare(b.label))
    .slice(0,limit);
}

function getServiceSuggestions(service,id,query){
  if(service==="Flights") return [];

  if(service==="Trains" && (id==="from" || id==="to")){
    const q=normalizeAirportText(query);
    return stationSuggestions
      .map(item=>({label:item.split(" · ")[0],sub:item.split(" · ")[1]||"",score:normalizeAirportText(item).includes(q)?300:0}))
      .filter(item=>item.score>0)
      .slice(0,8);
  }

  if(service==="Visa" && id==="destination") return textListSuggestions(countries,query);
  if(service==="Visa" && id==="visaType") return textListSuggestions(suggestionOptions.visaType,query);
  if(service==="Visa" && id==="nationality") return textListSuggestions(suggestionOptions.nationality,query);

  if(service==="Tours" && id==="activity") return textListSuggestions(activities,query);
  if(service==="Tours" && id==="destination") return citySuggestions(query);
  if(service==="Forex" && id==="currency") return textListSuggestions(currencies,query);
  if(service==="Forex" && id==="purpose") return textListSuggestions(suggestionOptions.purpose,query);

  if(service==="Hotels" && id==="city"){
    const q=normalizeAirportText(query);
    const cityItems=textListSuggestions(hotelCities,query,6).map(item=>({
      ...item,
      code:"CITY",
      label:item.label.split(", ")[0],
      sub:(item.label.includes(", ")?item.label.split(", ").slice(1).join(", "):"")+" · Destination"
    }));

    const hotelItems=hotelProperties
      .map(hotel=>{
        const name=normalizeAirportText(hotel.n);
        const city=normalizeAirportText(hotel.c);
        const hay=name+" "+city+" "+normalizeAirportText(hotel.o);
        let score=0;
        if(name===q) score+=1000;
        if(name.startsWith(q)) score+=650;
        if(city===q) score+=600;
        if(city.startsWith(q)) score+=420;
        if(hay.includes(q)) score+=260;
        return {hotel,score};
      })
      .filter(item=>item.score>0)
      .sort((a,b)=>b.score-a.score || a.hotel.n.localeCompare(b.hotel.n))
      .slice(0,8)
      .map(item=>({
        code:"HOTEL",
        label:item.hotel.n,
        sub:item.hotel.c+" · "+item.hotel.o+" · Hotel",
        score:item.score
      }));

    const merged=[...hotelItems,...cityItems];
    const seen=new Set();
    return merged.filter(item=>{
      const key=item.label+"|"+item.code;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0,10);
  }
  if(service==="Hotels" && id==="hoteltype") return textListSuggestions(suggestionOptions.hoteltype,query);
  if(service==="Homestays" && id==="staytype") return textListSuggestions(suggestionOptions.staytype,query);
  if(service==="Buses" && id==="busType") return textListSuggestions(suggestionOptions.busType,query);
  if(service==="Cruise" && id==="cabin") return textListSuggestions(suggestionOptions.cabin,query);
  if(service==="Insurance" && id==="plan") return textListSuggestions(suggestionOptions.plan,query);
  if((service==="Flights" || service==="Trains") && id==="class") return textListSuggestions(suggestionOptions.class,query);

  const placeFields=["city","destination","from","to","pickup","drop"];
  if(placeFields.includes(id)) return citySuggestions(query);

  return [];
}

function setupServiceAutocomplete(){
  if(activeTab==="Flights") return;

  const fieldIds=[...document.querySelectorAll("#dynamicFields input")];

  fieldIds.forEach(input=>{
    if(input.dataset.autocompleteReady==="1") return;

    const id=(input.name||"").trim();
    if(!id) return;

    input.dataset.autocompleteReady="1";
    input.setAttribute("autocomplete","off");
    input.setAttribute("aria-autocomplete","list");

    const host=input.parentElement;
    host.classList.add("airport-field");

    const box=document.createElement("div");
    box.className="airport-suggestions";
    box.setAttribute("role","listbox");
    host.appendChild(box);

    let timer=null;

    const renderItems=(items)=>{
      box.innerHTML="";
      if(!items.length){
        box.classList.remove("show");
        return;
      }

      items.forEach(item=>{
        const option=document.createElement("button");
        option.type="button";
        option.className="airport-option";
        option.setAttribute("role","option");
        option.innerHTML=`
          <span class="airport-code">${item.code || "•"}</span>
          <span class="airport-main">
            <strong>${item.label}</strong>
            <small>${item.sub || ""}</small>
          </span>`;
        option.addEventListener("mousedown",event=>event.preventDefault());
        option.addEventListener("click",()=>{
          input.value=item.label;
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

      timer=setTimeout(async()=>{
        if(!airportData.length) await loadAirports();
        renderItems(getServiceSuggestions(activeTab,id,query));
      },70);
    });

    input.addEventListener("focus",()=>{
      if(input.value.trim().length>=2){
        renderItems(getServiceSuggestions(activeTab,id,input.value));
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
  setupServiceAutocomplete();
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