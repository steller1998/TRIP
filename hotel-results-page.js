(function(){
  "use strict";
  const params=new URLSearchParams(window.location.search);
  const $=selector=>document.querySelector(selector);
  const allHotels=Array.isArray(window.TRIPORA_HOTELS)?window.TRIPORA_HOTELS:[];
  const query=(params.get("city")||"").trim();
  const checkin=params.get("checkin")||"";
  const checkout=params.get("checkout")||"";
  const guests=params.get("guests")||"1 Room, 2 Guests";
  const roomDetails=params.get("roomDetails")||"Room 1: 2 Adults, 0 Children";
  const preference=params.get("hoteltype")||"Any hotel";
  const nights=calculateNights(checkin,checkout);
  const destinationImages={
    "goa":"assets/goa.jpg","dubai":"assets/dubai.jpg","mumbai":"assets/mumbai.jpg",
    "delhi":"assets/delhi.jpg","new delhi":"assets/delhi.jpg","manali":"assets/manali.jpg",
    "shimla":"assets/manali.jpg","srinagar":"assets/kashmir.jpg","kashmir":"assets/kashmir.jpg"
  };
  let matchingHotels=[];

  function escapeHtml(value){
    return String(value==null?"":value).replace(/[&<>"']/g,character=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[character]));
  }
  function normalize(value){
    return String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
  }
  function calculateNights(start,end){
    if(!start||!end) return 0;
    const a=new Date(start+"T12:00:00"),b=new Date(end+"T12:00:00");
    const n=Math.round((b-a)/86400000);
    return Number.isFinite(n)&&n>0?n:0;
  }
  function displayDate(value){
    if(!value) return "Not selected";
    const date=new Date(value+"T12:00:00");
    if(Number.isNaN(date.getTime())) return "Not selected";
    return new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric"}).format(date);
  }
  function stayLength(){
    if(!nights) return "Not calculated";
    return nights+" night"+(nights===1?"":"s");
  }
  function buildStayContext(){
    return [
      "Destination / property: "+(query||"Not specified"),
      "Check-in: "+displayDate(checkin),
      "Check-out: "+displayDate(checkout),
      "Length of stay: "+stayLength(),
      "Rooms & Guests: "+guests,
      "Room-wise occupancy: "+roomDetails,
      "Hotel preference: "+preference
    ];
  }
  function getImage(hotel){
    return destinationImages[normalize(hotel.c)]||"";
  }
  function hotelScore(hotel,q){
    if(!q) return 1;
    const name=normalize(hotel.n),city=normalize(hotel.c),country=normalize(hotel.o);
    const hay=[name,city,country].join(" ");
    if(name===q) return 1600;
    if(name.startsWith(q)) return 1350;
    if(name.includes(q)) return 1100;
    if(city===q) return 1000;
    if(city.startsWith(q)) return 850;
    if(city.includes(q)) return 720;
    if(country.includes(q)) return 450;
    const words=q.split(/\s+/).filter(Boolean);
    if(words.length>1&&words.every(word=>hay.includes(word))) return 650;
    return 0;
  }
  function createDetailsGroup(title,rows){
    return '<section class="hotel-detail-group"><h5>'+escapeHtml(title)+'</h5>'+
      rows.map(row=>'<div class="hotel-detail-row"><span>'+escapeHtml(row[0])+'</span><strong class="'+(row[2]?"pending-detail":"")+'">'+escapeHtml(row[1])+'</strong></div>').join("")+
      '</section>';
  }
  function buildDetailGroups(hotel){
    const pending="Pending TBO API";
    return [
      createDetailsGroup("Property overview",[
        ["Hotel / property name",hotel.n],
        ["Destination",hotel.c],
        ["Country",hotel.o],
        ["Exact property address",pending,true],
        ["Verified star rating",pending,true],
        ["Guest review score / count",pending,true],
        ["Official property description",pending,true]
      ]),
      createDetailsGroup("Your stay",[
        ["Check-in",displayDate(checkin)],
        ["Check-out",displayDate(checkout)],
        ["Length of stay",stayLength()],
        ["Rooms & guests",guests],
        ["Room-wise occupancy",roomDetails],
        ["Selected preference",preference],
        ["Check-in / check-out times",pending,true]
      ]),
      createDetailsGroup("Room & price details",[
        ["Available room types",pending,true],
        ["Bed configuration",pending,true],
        ["Meal plan / breakfast",pending,true],
        ["Price per night",pending,true],
        ["Taxes and fees",pending,true],
        ["Total price",pending,true],
        ["Currency / payment terms",pending,true]
      ]),
      createDetailsGroup("Facilities & policies",[
        ["Amenities and facilities",pending,true],
        ["Wi-Fi / parking",pending,true],
        ["Accessibility / child policy",pending,true],
        ["Cancellation / refund policy",pending,true],
        ["Deposit / extra-bed policy",pending,true],
        ["Property contact details",pending,true],
        ["Verified property photos",pending,true]
      ])
    ].join("");
  }
  function makeEnquiryLink(hotel){
    const lines=[
      "Hello Tripora,",
      "",
      "Please help me enquire about this hotel sample listing: "+hotel.n,
      ...buildStayContext(),
      "",
      "Please confirm the real property address, room types, amenities, total amount including taxes, availability and cancellation rules before I book."
    ];
    return "https://wa.me/919181565815?text="+encodeURIComponent(lines.join("\n"));
  }
  function renderCard(hotel,index){
    const id="hotelDetails"+index;
    const image=getImage(hotel);
    const picture=image
      ? '<img src="'+escapeHtml(image)+'" alt="'+escapeHtml(hotel.c)+' destination preview" loading="lazy"><span>Illustrative destination image · not the hotel photo</span>'
      : '<span class="hotel-image-icon" aria-hidden="true">⌂</span><span>Verified property photo pending</span>';
    return '<article class="hotel-card-full">'+
      '<div class="hotel-card-image">'+picture+'</div>'+
      '<div class="hotel-card-body">'+
        '<div class="hotel-card-overline"><span class="sample-badge">SAMPLE LISTING</span><span class="hotel-card-location">⌖ '+escapeHtml(hotel.c)+', '+escapeHtml(hotel.o)+'</span></div>'+
        '<h3>'+escapeHtml(hotel.n)+'</h3>'+
        '<p class="hotel-card-description">Sample property-name match for your search. Supplier details have not been verified.</p>'+
        '<div class="hotel-card-highlights"><span class="hotel-highlight">Availability: pending</span><span class="hotel-highlight">Rates: pending</span><span class="hotel-highlight">Amenities: pending</span></div>'+
        '<div class="hotel-card-bottom"><div class="hotel-price-status"><strong>Live price unavailable</strong><small>Not connected to TBO inventory</small></div>'+
        '<div class="hotel-card-actions"><button type="button" class="hotel-details-toggle" data-detail-target="'+id+'" aria-expanded="false">View full details</button><a class="hotel-enquire" href="'+makeEnquiryLink(hotel)+'" target="_blank" rel="noopener">Enquire on WhatsApp</a></div></div>'+
      '</div>'+
      '<div class="hotel-full-details" id="'+id+'" hidden><div class="hotel-detail-heading"><div><h4>Full property details</h4><p>Confirmed information is required before booking or taking payment.</p></div><span class="sample-badge">PREVIEW MODE</span></div>'+
      '<div class="hotel-detail-groups">'+buildDetailGroups(hotel)+'</div>'+
      '<p class="hotel-details-disclaimer">Only the sample listing name and its sample city/country are present in the current dataset. All fields marked “Pending TBO API” are unknown here and are not being guessed. Property photos currently shown are destination images, not verified hotel photographs.</p></div>'+
    '</article>';
  }
  function showContext(){
    $("#resultsTitle").textContent=query?"Hotels in "+query:"Hotel search results";
    $("#resultsSubtitle").textContent="Review the search criteria and sample listings below. No hotel is booked or held by this page.";
    $("#sideDestination").textContent=query||"Not specified";
    $("#sideCheckin").textContent=displayDate(checkin);
    $("#sideCheckout").textContent=displayDate(checkout);
    $("#sideNights").textContent=stayLength();
    $("#sideGuests").textContent=guests;
    $("#sideRoomDetails").textContent=roomDetails;
    $("#sidePreference").textContent=preference;
    const chips=[
      ["Check-in",displayDate(checkin)],
      ["Check-out",displayDate(checkout)],
      ["Stay",stayLength()],
      ["Guests",guests],
      ["Preference",preference]
    ];
    $("#staySummaryChips").innerHTML=chips.map(chip=>'<span class="stay-chip"><span>'+escapeHtml(chip[0])+'</span>'+escapeHtml(chip[1])+'</span>').join("");
    $("#generalEnquiry").href="https://wa.me/919181565815?text="+encodeURIComponent(["Hello Tripora, I need hotel booking help.","",...buildStayContext()].join("\n"));
  }
  function drawResults(){
    const sort=$("#sortResults").value;
    let list=[...matchingHotels];
    if(sort==="name") list.sort((a,b)=>a.n.localeCompare(b.n));
    if(sort==="location") list.sort((a,b)=>a.c.localeCompare(b.c)||a.n.localeCompare(b.n));
    $("#sampleCount").textContent=list.length
      ? list.length+" sample listing"+(list.length===1?"":"s")+" · not live supplier results"
      : "No matching sample names";
    $("#hotelCards").innerHTML=list.map(renderCard).join("");
    $("#emptyResults").hidden=list.length!==0;
    $("#hotelCards").hidden=list.length===0;
  }
  $("#hotelCards").addEventListener("click",event=>{
    const button=event.target.closest("[data-detail-target]");
    if(!button) return;
    const target=document.getElementById(button.dataset.detailTarget);
    if(!target) return;
    const opening=target.hidden;
    target.hidden=!opening;
    button.setAttribute("aria-expanded",opening?"true":"false");
    button.textContent=opening?"Hide full details":"View full details";
  });
  $("#sortResults").addEventListener("change",drawResults);
  showContext();
  matchingHotels=allHotels
    .map(hotel=>({hotel,score:hotelScore(hotel,normalize(query))}))
    .filter(item=>!query||item.score>0)
    .sort((a,b)=>b.score-a.score||a.hotel.n.localeCompare(b.hotel.n))
    .slice(0,30)
    .map(item=>item.hotel);
  drawResults();
})();