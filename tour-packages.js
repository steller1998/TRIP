
/* ABIDA TRAVELS — TOUR PACKAGES */
(() => {
  "use strict";
  const WA_NUMBER = "918403834454";
  const CALL_NUMBER = "9395378017";
  const waLink = message => "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  const packages = [
    {
      id:"kashmir", name:"Kashmir Tour Package", tag:"Scenic India", image:"assets/kashmir.jpg",
      destination:"Srinagar, Gulmarg, Pahalgam & Sonamarg", duration:"4 Nights / 5 Days", price:9750, priceLabel:"₹9,750", priceType:"per person", category:"Deluxe Room",
      summary:"A scenic Kashmir escape with hotel stay, breakfast and sightseeing transfers.",
      inclusions:["Airport pickup and drop","Transportation and sightseeing transfers as per itinerary","4 nights hotel accommodation in a Deluxe Room","Daily breakfast at the hotel"],
      exclusions:["Flight tickets","Lunch and dinner","Entry tickets and activity charges, including Gondola rides","Personal expenses","Anything not listed in package inclusions"],
      itinerary:[
        ["DAY 1 — ARRIVAL IN SRINAGAR","Airport pickup, arrival in Srinagar and local sightseeing."],
        ["DAY 2 — GULMARG","Enjoy a full-day excursion to Gulmarg."],
        ["DAY 3 — PAHALGAM","Explore Pahalgam on a day excursion."],
        ["DAY 4 — SONAMARG","Enjoy the scenic Sonamarg excursion."],
        ["DAY 5 — DEPARTURE","Breakfast at the hotel followed by airport drop."]
      ],
      note:"This is an indicative package quotation. Final price, hotel, cab arrangements and itinerary depend on travel dates, number of guests, availability and supplier confirmation. Please confirm all inclusions before accepting payment."
    },
    {
      id:"alibaug", name:"Alibaug Couple Tour Package", tag:"Couple Special", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      destination:"Alibaug, Maharashtra", duration:"3 Nights / 4 Days", price:29999, priceLabel:"₹29,999", priceType:"for 2 adults", category:"3 Star / Similar",
      summary:"A private couple getaway with a Deluxe room, breakfast and AC sedan transfers.",
      inclusions:["3 nights hotel accommodation in an AC Double Deluxe Room","Daily breakfast","Private AC sedan","Mumbai pickup and drop","Sightseeing transfers to destinations listed in the itinerary"],
      exclusions:["Lunch and dinner","Entry tickets","Boat ride charges","Water sports and adventure activities","Personal expenses","Anything not mentioned in package inclusions"],
      itinerary:[
        ["DAY 1 — MUMBAI TO ALIBAUG","Pickup from Mumbai, drive to Alibaug, hotel check-in, visit Alibaug Beach and enjoy the sunset."],
        ["DAY 2 — ALIBAUG SIGHTSEEING","Breakfast, visit Kolaba Fort (subject to tide and access), Varsoli Beach and Nagaon Beach."],
        ["DAY 3 — KASHID & REVDANDA","Breakfast, visit Kashid Beach and Revdanda Fort, enjoy sightseeing and return to the hotel."],
        ["DAY 4 — DEPARTURE","Breakfast, hotel check-out and private AC sedan transfer to Mumbai."]
      ],
      hotelDetails:["3 Star hotel / similar category","3 nights accommodation","1 AC Double Deluxe Room","Suggested hotels, subject to availability: Blue Waves Resort – Varsoli; Oceanature – Nagaon; The Enchanted Nest – Akshi"],
      note:"Package price is ₹29,999 for 2 adults. Hotel and transportation are subject to availability. Final price depends on travel dates and supplier confirmation. Fort access may depend on weather and tide conditions. Confirm all inclusions before accepting payment.",
      fixedGuests:2
    },
    {
      id:"shimla", name:"Shimla Tour Package", tag:"Family / Couple", image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
      destination:"Shimla & Kufri, Himachal Pradesh", duration:"3 Nights / 4 Days", price:5999, priceLabel:"₹5,999", priceType:"per person", category:"Deluxe Room",
      summary:"A mountain holiday covering Shimla town, Kufri and popular local attractions.",
      inclusions:["3 nights hotel accommodation in a Deluxe Room","Daily breakfast","Transportation as per itinerary","Shimla local sightseeing","Kufri sightseeing","Pickup and drop as per package plan"],
      exclusions:["Train / flight tickets","Lunch and dinner","Entry tickets","Adventure activities","Kufri activity charges","Personal expenses","Anything not mentioned in inclusions"],
      itinerary:[
        ["DAY 1 — ARRIVAL IN SHIMLA","Arrival, hotel pickup and check-in, visit Mall Road, The Ridge and Christ Church."],
        ["DAY 2 — KUFRI SIGHTSEEING","Breakfast, visit Kufri, Green Valley and Jakhoo Temple, then return to the hotel."],
        ["DAY 3 — SHIMLA LOCAL SIGHTSEEING","Breakfast, explore local attractions, shop at Mall Road and visit nearby viewpoints."],
        ["DAY 4 — DEPARTURE","Breakfast, hotel check-out and transfer to Shimla Bus Stand."]
      ],
      note:"Package price is an estimated quotation. Final price depends on travel dates and number of guests. Hotel and cab are subject to availability. Snow and adventure activities are not included. The itinerary may change depending on weather. Confirm all inclusions before accepting payment."
    },
    {
      id:"manali", name:"Manali Tour Package", tag:"Family / Couple", image:"assets/manali.jpg",
      destination:"Manali, Solang Valley, Atal Tunnel & Sissu", duration:"4 Nights / 5 Days", price:7999, priceLabel:"₹7,999", priceType:"per person", category:"Deluxe Room",
      summary:"A Himalayan getaway with mountain sightseeing and private cab arrangements.",
      inclusions:["4 nights hotel accommodation in a Deluxe Room","Daily breakfast","Private cab / transportation as per itinerary (full inclusion details pending)"],
      exclusions:["Full exclusions list not yet supplied"],
      itinerary:[
        ["DAY 1 — ARRIVAL IN MANALI","Arrival in Manali, hotel check-in, leisure time, explore Mall Road and overnight stay."],
        ["DAY 2 — SOLANG VALLEY & ATAL TUNNEL","Breakfast, visit Solang Valley, Atal Tunnel and Sissu (subject to weather conditions), then return to hotel."],
        ["DAY 3 — MANALI LOCAL SIGHTSEEING","Breakfast, visit Hadimba Temple, Old Manali, Vashisht Temple and local markets."],
        ["DAY 4 — DETAILS PENDING","The Day 4 itinerary was cut off in the package details provided."],
        ["DAY 5 — DETAILS PENDING","Departure details have not yet been provided."]
      ],
      note:"The supplied Manali package information is incomplete after Day 4 begins. Day 4, Day 5, full inclusions and exclusions must be confirmed before accepting payment. Rohtang Pass is subject to permit and availability; Sissu visits depend on weather. The listed price is an indicative quotation."
    }
  ];

  const section = document.createElement("section");
  section.className = "section tour-packages-section";
  section.id = "tour-packages";
  section.innerHTML = `
    <div class="container">
      <div class="section-head">
        <div>
          <span class="section-kicker">CURATED HOLIDAY EXPERIENCES</span>
          <h2>Find your next <span>beautiful escape.</span></h2>
          <p class="tour-packages-intro">Explore handpicked trips from ABIDA TRAVELS. Open any package to see its itinerary, inclusions, exclusions and estimated price.</p>
        </div>
      </div>
      <div class="tour-package-grid" id="tourPackageGrid"></div>
    </div>`;
  const offers = document.getElementById("offers");
  if (offers) offers.insertAdjacentElement("afterend", section);
  else document.querySelector("main")?.appendChild(section);

  const modal = document.createElement("div");
  modal.className = "tour-modal-backdrop";
  modal.id = "tourPackageModal";
  modal.innerHTML = `
    <div class="tour-modal" role="dialog" aria-modal="true" aria-labelledby="tourModalTitle">
      <button type="button" class="tour-modal-close" aria-label="Close package details">×</button>
      <div id="tourModalContent"></div>
    </div>`;
  document.body.appendChild(modal);

  const success = document.createElement("div");
  success.className = "tour-success";
  success.id = "tourBookingSuccess";
  success.innerHTML = `
    <div class="tour-success-card" role="dialog" aria-modal="true" aria-labelledby="tourSuccessTitle">
      <div class="tour-success-icon">✓</div>
      <h3 id="tourSuccessTitle">Your Enquiry Is Ready!</h3>
      <p>Your booking details have been prepared in WhatsApp. Please tap <strong>Send</strong> there to submit your request to ABIDA TRAVELS. Our team will contact you shortly after receiving it to confirm availability and the final price.</p>
      <p>Need immediate assistance? Call <strong>9395378017</strong>.</p>
      <div class="tour-success-actions">
        <button type="button" id="tourSuccessWhatsapp">Open WhatsApp</button>
        <button type="button" class="secondary" id="tourSuccessClose">Close</button>
      </div>
    </div>`;
  document.body.appendChild(success);

  let currentPackage = null;
  let pendingWhatsAppUrl = "";

  const formatINR = value => "₹" + Math.round(value).toLocaleString("en-IN");
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const listHTML = items => "<ul>" + items.map(item => "<li>" + escapeHTML(item) + "</li>").join("") + "</ul>";

  document.getElementById("tourPackageGrid").innerHTML = packages.map(pkg => `
    <article class="tour-package-card">
      <div class="tour-package-photo">
        <img src="${escapeHTML(pkg.image)}" alt="${escapeHTML(pkg.name)}" loading="lazy">
        <span class="tour-package-tag">${escapeHTML(pkg.tag)}</span>
        <span class="tour-package-duration">◷ ${escapeHTML(pkg.duration)}</span>
      </div>
      <div class="tour-package-content">
        <h3>${escapeHTML(pkg.name)}</h3>
        <p class="tour-package-subtitle">${escapeHTML(pkg.destination)}</p>
        <div class="tour-package-price-row">
          <div class="tour-package-price">${pkg.priceLabel}<small> / ${escapeHTML(pkg.priceType)}</small></div>
        </div>
        <div class="tour-package-facts">
          <span>🏨 ${escapeHTML(pkg.category)}</span>
          <span>✈ ${pkg.fixedGuests ? "2 Adults" : "Flexible travellers"}</span>
        </div>
        <div class="tour-package-card-actions">
          <button type="button" class="tour-view-btn" data-tour-view="${pkg.id}">View Details</button>
          <button type="button" class="tour-ask-btn" data-tour-ask="${pkg.id}">Ask an Expert ↗</button>
          <button type="button" class="tour-share-btn" data-tour-share="${pkg.id}">↗ Share</button>
        </div>
      </div>
    </article>`).join("");

  function openPackage(pkg) {
    currentPackage = pkg;
    const hotelBlock = pkg.hotelDetails ? `<div class="tour-detail-block"><h3>Hotel Details</h3>${listHTML(pkg.hotelDetails)}</div>` : "";
    const inclusions = `<div class="tour-detail-block"><h3>What's Included</h3>${listHTML(pkg.inclusions)}</div>`;
    const exclusions = `<div class="tour-detail-block"><h3>What's Not Included</h3>${listHTML(pkg.exclusions)}</div>`;
    const itinerary = `<div class="tour-detail-block"><h3>Day-wise Itinerary</h3><div class="tour-itinerary">${pkg.itinerary.map(day => `<div class="tour-day"><strong>${escapeHTML(day[0])}</strong><p>${escapeHTML(day[1])}</p></div>`).join("")}</div></div>`;
    document.getElementById("tourModalContent").innerHTML = `
      <div class="tour-modal-hero">
        <img src="${escapeHTML(pkg.image)}" alt="${escapeHTML(pkg.name)}">
        <div class="tour-modal-hero-copy"><small>ABIDA TRAVELS • ${escapeHTML(pkg.tag.toUpperCase())}</small><h2 id="tourModalTitle">${escapeHTML(pkg.name)}</h2></div>
      </div>
      <div class="tour-modal-body">
        <div class="tour-modal-summary">
          <span><strong>Duration:</strong> ${escapeHTML(pkg.duration)}</span>
          <span><strong>Destination:</strong> ${escapeHTML(pkg.destination)}</span>
          <span><strong>Hotel:</strong> ${escapeHTML(pkg.category)}</span>
          <span><strong>Price:</strong> ${pkg.priceLabel} ${escapeHTML(pkg.priceType)}</span>
        </div>
        <div class="tour-detail-grid">
          ${inclusions}${exclusions}${hotelBlock}${itinerary}
        </div>
        <div class="tour-note"><strong>Important information:</strong> ${escapeHTML(pkg.note)}</div>
        <div class="tour-detail-actions">
          <button type="button" class="tour-book-btn" id="tourShowBooking">Book Now</button>
          <button type="button" class="tour-whatsapp-btn" id="tourDetailWhatsapp">Talk to Our Travel Expert</button>
        </div>
        <form class="tour-booking-form" id="tourBookingForm" hidden>
          <div class="tour-form-field"><label for="tourTravelDate">Travel Date</label><input id="tourTravelDate" name="travelDate" type="date" required></div>
          <div class="tour-form-field"><label for="tourTravellers">Number of Travellers</label><select id="tourTravellers" name="travellers" ${pkg.fixedGuests ? "disabled" : ""}>${(pkg.fixedGuests ? [2] : Array.from({length:20},(_,i)=>i+1)).map(n => `<option value="${n}" ${(pkg.fixedGuests===n || (!pkg.fixedGuests && n===2)) ? "selected" : ""}>${n} ${n===1?"Person":"People"}</option>`).join("")}</select></div>
          <div class="tour-form-field"><label for="tourPlace">Travel Place</label><input id="tourPlace" name="destination" value="${escapeHTML(pkg.destination)}" readonly></div>
          <div class="tour-form-field"><label for="tourPackagePrice">Package Price (Estimated)</label><input id="tourPackagePrice" name="packagePrice" value="${escapeHTML(pkg.priceLabel + (pkg.fixedGuests ? " for 2 adults" : " per person"))}" readonly></div>
          <div class="tour-form-field"><label for="tourCustomerName">Your Full Name</label><input id="tourCustomerName" name="customerName" type="text" placeholder="Enter your full name" autocomplete="name" required></div>
          <div class="tour-form-field"><label for="tourCustomerPhone">Mobile Number</label><input id="tourCustomerPhone" name="customerPhone" type="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10-digit mobile number" required></div>
          <div class="tour-form-total"><span>Estimated package amount</span><strong id="tourTotalAmount">${pkg.fixedGuests ? "₹29,999" : "₹" + pkg.price.toLocaleString("en-IN") + " × 2"}</strong></div>
          <button type="submit" class="tour-form-submit">Submit Booking Enquiry →</button>
        </form>
      </div>`;
    const dateInput = document.getElementById("tourTravelDate");
    const today = new Date();
    dateInput.min = [today.getFullYear(),String(today.getMonth()+1).padStart(2,"0"),String(today.getDate()).padStart(2,"0")].join("-");
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    modal.querySelector(".tour-modal").scrollTop = 0;

    document.getElementById("tourShowBooking").addEventListener("click", () => {
      const form = document.getElementById("tourBookingForm");
      form.hidden = false;
      document.getElementById("tourShowBooking").scrollIntoView({behavior:"smooth",block:"center"});
    });
    document.getElementById("tourDetailWhatsapp").addEventListener("click", () => {
      const message = "Hello ABIDA TRAVELS, I would like to know more about the " + pkg.name + ". Please share availability and final pricing.\n\nDestination: " + pkg.destination + "\nPackage price: " + pkg.priceLabel + " " + pkg.priceType;
      window.open(waLink(message), "_blank", "noopener");
    });
    const travellerSelect = document.getElementById("tourTravellers");
    travellerSelect.addEventListener("change", updateTotal);
    function updateTotal() {
      const count = Number(travellerSelect.value);
      const totalField = document.getElementById("tourTotalAmount");
      const priceField = document.getElementById("tourPackagePrice");
      if (pkg.fixedGuests) {
        totalField.textContent = "₹29,999 (2 adults)";
        priceField.value = "₹29,999 for 2 adults";
      } else {
        totalField.textContent = formatINR(pkg.price * count);
        priceField.value = pkg.priceLabel + " × " + count + " = " + formatINR(pkg.price * count);
      }
    }
    updateTotal();
    document.getElementById("tourBookingForm").addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const message = [
        "Hello ABIDA TRAVELS,",
        "",
        "I would like to submit a booking enquiry.",
        "Package: " + pkg.name,
        "Destination: " + pkg.destination,
        "Travel date: " + formData.get("travelDate"),
        "Travellers: " + (pkg.fixedGuests ? "2 Adults (Couple Package)" : formData.get("travellers")),
        "Estimated package price: " + formData.get("packagePrice"),
        "Name: " + formData.get("customerName"),
        "Mobile: " + formData.get("customerPhone"),
        "",
        "Please contact me to confirm availability, final price and booking details."
      ].join("\n");
      pendingWhatsAppUrl = waLink(message);
      window.open(pendingWhatsAppUrl, "_blank", "noopener");
      modal.classList.remove("open");
      document.body.classList.remove("modal-open");
      success.classList.add("open");
    });
  }

  document.getElementById("tourPackageGrid").addEventListener("click", event => {
    const view = event.target.closest("[data-tour-view]");
    const ask = event.target.closest("[data-tour-ask]");
    if (view) openPackage(packages.find(pkg => pkg.id === view.dataset.tourView));
    if (ask) {
      const pkg = packages.find(item => item.id === ask.dataset.tourAsk);
      if (pkg) window.open(waLink("Hello ABIDA TRAVELS, I am interested in the " + pkg.name + ". Please contact me with availability and final pricing."), "_blank", "noopener");
    }
  });

  modal.addEventListener("click", event => {
    if (event.target === modal || event.target.closest(".tour-modal-close")) {
      modal.classList.remove("open");
      document.body.classList.remove("modal-open");
    }
  });
  success.addEventListener("click", event => {
    if (event.target === success) success.classList.remove("open");
  });
  document.getElementById("tourSuccessWhatsapp").addEventListener("click", () => {
    if (pendingWhatsAppUrl) window.open(pendingWhatsAppUrl, "_blank", "noopener");
  });
  document.getElementById("tourSuccessClose").addEventListener("click", () => success.classList.remove("open"));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      modal.classList.remove("open");
      success.classList.remove("open");
      document.body.classList.remove("modal-open");
    }
  });

  const holidayNav = document.querySelector('.primary-nav [data-tab="Holidays"]');
  if (holidayNav && !document.querySelector('.primary-nav [data-tour-anchor]')) {
    const link = document.createElement("a");
    link.href = "#tour-packages";
    link.className = "nav-link";
    link.dataset.tourAnchor = "true";
    link.textContent = "Tour Packages";
    holidayNav.insertAdjacentElement("afterend", link);
  }
})();
