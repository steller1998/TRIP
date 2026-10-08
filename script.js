/* =========================================
   TRIPORA JAVASCRIPT
========================================= */

const WHATSAPP_NUMBER = "919181565815";
const WHATSAPP_URL = "https://wa.me/" + WHATSAPP_NUMBER;


/* =========================================
   NAVBAR
========================================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {

  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

});


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", function () {

  navMenu.classList.toggle("open");

});


document.querySelectorAll(".nav-menu a").forEach(function (link) {

  link.addEventListener("click", function () {

    navMenu.classList.remove("open");

  });

});


/* =========================================
   WHATSAPP BUTTONS
========================================= */

document
  .querySelectorAll("[data-message]")
  .forEach(function (button) {

    button.addEventListener("click", function () {

      const message = button.getAttribute("data-message");

      const url =
        WHATSAPP_URL +
        "?text=" +
        encodeURIComponent(message);

      window.open(
        url,
        "_blank"
      );

    });

  });


/* =========================================
   SERVICE BOOKING MODAL
========================================= */

const serviceModal = document.getElementById("serviceModal");
const serviceModalTitle = document.getElementById("serviceModalTitle");
const serviceModalIntro = document.getElementById("serviceModalIntro");
const serviceFields = document.getElementById("serviceFields");
const serviceBookingForm = document.getElementById("serviceBookingForm");
let activeService = "";

const serviceFieldSets = {
  "Flight Booking": [
    ["from", "From Airport / City", "text", "e.g. Guwahati"],
    ["to", "To Airport / City", "text", "e.g. Delhi / Dubai"],
    ["departure", "Departure Date", "date", ""],
    ["return", "Return Date", "date", ""],
    ["passengers", "Passengers", "number", "1"],
    ["class", "Travel Class", "text", "e.g. Economy"]
  ],
  "Train Booking": [
    ["from", "From Station / City", "text", "e.g. Guwahati"],
    ["to", "To Station / City", "text", "e.g. New Delhi"],
    ["journey", "Journey Date", "date", ""],
    ["passengers", "Passengers", "number", "1"],
    ["coach", "Coach Preference", "text", "e.g. Sleeper / 3A"]
  ],
  "Hotel Booking": [
    ["destination", "Hotel City / Destination", "text", "e.g. Goa"],
    ["checkin", "Check-in Date", "date", ""],
    ["checkout", "Check-out Date", "date", ""],
    ["guests", "Guests", "number", "2"],
    ["rooms", "Rooms", "number", "1"],
    ["hoteltype", "Hotel Preference", "text", "e.g. 4-star / Budget"]
  ],
  "Holiday Packages": [
    ["destination", "Holiday Destination", "text", "e.g. Kashmir / Dubai"],
    ["date", "Preferred Travel Date", "date", ""],
    ["days", "Trip Duration (Days)", "number", "5"],
    ["travellers", "Travellers", "number", "2"],
    ["budget", "Approx. Budget", "text", "e.g. ₹30,000"],
    ["interest", "Trip Type", "text", "e.g. Family / Honeymoon / Adventure"]
  ]
};

function openServiceModal(service) {
  activeService = service;
  serviceModalTitle.textContent = service;
  serviceModalIntro.textContent = `Share your ${service.toLowerCase()} requirements and Tripora will help you with the next step.`;
  serviceFields.innerHTML = (serviceFieldSets[service] || []).map(([id, label, type, placeholder]) => `
    <label>${label}<input id="service-${id}" name="${id}" type="${type}" ${type === "number" ? 'min="1" value="' + placeholder + '"' : `placeholder="${placeholder}"`} required></label>
  `).join("");
  serviceModal.classList.add("open");
  serviceModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeServiceModal() {
  serviceModal.classList.remove("open");
  serviceModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-service]").forEach(function (element) {
  element.addEventListener("click", function (event) {
    if (event.target.closest("button")) return;
    openServiceModal(element.getAttribute("data-service"));
  });

  element.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openServiceModal(element.getAttribute("data-service"));
    }
  });
});

document.querySelectorAll("[data-close-service]").forEach(function (button) {
  button.addEventListener("click", closeServiceModal);
});

/* Directly wire the visible Book Now buttons too. */
document.querySelectorAll(".text-button[data-service]").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    openServiceModal(button.getAttribute("data-service"));
  });
});

serviceBookingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(serviceBookingForm);
  const lines = [`Hello Tripora,`, ``, `I want ${activeService}.`, ``];
  for (const [key, value] of formData.entries()) {
    if (value) lines.push(`${key.replace(/^./, c => c.toUpperCase())}: ${value}`);
  }
  lines.push("", "Please share the available options and booking details.");
  window.open(WHATSAPP_URL + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
  closeServiceModal();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && serviceModal.classList.contains("open")) closeServiceModal();
});


/* =========================================
   TRAVEL ENQUIRY TABS
========================================= */

const tabs = document.querySelectorAll(".tab");
const travelType = document.getElementById("travelType");
const travelFields = document.getElementById("travelFields");

const travelFieldSets = {
  Flight: [
    ["from", "From Airport / City", "text", "e.g. Delhi"],
    ["to", "To Airport / City", "text", "e.g. Dubai"],
    ["travelDate", "Departure Date", "date", ""],
    ["returnDate", "Return Date", "date", ""],
    ["travellers", "Passengers", "number", "1"]
  ],
  Train: [
    ["from", "From Station / City", "text", "e.g. Guwahati"],
    ["to", "To Station / City", "text", "e.g. New Delhi"],
    ["travelDate", "Journey Date", "date", ""],
    ["travellers", "Passengers", "number", "1"],
    ["coach", "Coach Preference", "text", "e.g. Sleeper / 3A"]
  ],
  Hotel: [
    ["destination", "Hotel City / Destination", "text", "e.g. Goa"],
    ["checkin", "Check-in Date", "date", ""],
    ["checkout", "Check-out Date", "date", ""],
    ["guests", "Guests", "number", "2"],
    ["rooms", "Rooms", "number", "1"]
  ],
  Holiday: [
    ["destination", "Holiday Destination", "text", "e.g. Kashmir"],
    ["travelDate", "Preferred Travel Date", "date", ""],
    ["days", "Trip Duration (Days)", "number", "5"],
    ["travellers", "Travellers", "number", "2"],
    ["budget", "Approx. Budget", "text", "e.g. ₹30,000"]
  ]
};

function renderTravelFields(type) {
  const fields = travelFieldSets[type] || travelFieldSets.Flight;

  travelFields.innerHTML = fields.map(function ([id, label, inputType, placeholder]) {
    if (inputType === "number") {
      return `
        <label>
          ${label}
          <input
            type="number"
            id="${id}"
            name="${id}"
            min="1"
            value="${placeholder}"
            inputmode="numeric"
            required>
        </label>
      `;
    }

    return `
      <label>
        ${label}
        <input
          type="${inputType}"
          id="${id}"
          name="${id}"
          placeholder="${placeholder}"
          required>
      </label>
    `;
  }).join("");

  const todayValue = new Date().toISOString().split("T")[0];
  travelFields.querySelectorAll('input[type="date"]').forEach(function (input) {
    input.min = todayValue;
  });
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (item) {
      item.classList.remove("active");
    });

    tab.classList.add("active");

    const type = tab.getAttribute("data-type");
    travelType.value = type;
    renderTravelFields(type);
  });
});

renderTravelFields("Flight");


/* =========================================
   ENQUIRY FORM
========================================= */

const travelForm = document.getElementById("travelForm");

travelForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const type = travelType.value;
  const formData = new FormData(travelForm);
  const lines = [
    "Hello Tripora,",
    "",
    `I want ${type.toLowerCase()} booking assistance.`,
    ""
  ];

  for (const [key, value] of formData.entries()) {
    if (key === "travelType" || !value) continue;

    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (c) { return c.toUpperCase(); });

    lines.push(`${label}: ${value}`);
  }

  lines.push("", "Please help me with the available options.");

  window.open(
    WHATSAPP_URL + "?text=" + encodeURIComponent(lines.join("\n")),
    "_blank"
  );
});


/* =========================================
   TESTIMONIAL SLIDER
========================================= */

const track =
  document.getElementById("testimonialTrack");

const dots =
  document.querySelectorAll(".dot");

let currentSlide = 0;


function showSlide(index) {

  if (index < 0) {
    index = 2;
  }

  if (index > 2) {
    index = 0;
  }

  currentSlide = index;


  track.style.transform =
    "translateX(-" +
    (index * 100) +
    "%)";


  dots.forEach(function (dot, i) {

    dot.classList.toggle(
      "active",
      i === index
    );

  });

}


dots.forEach(function (dot) {

  dot.addEventListener("click", function () {

    showSlide(
      Number(
        dot.getAttribute("data-slide")
      )
    );

  });

});


/* Auto slider */

setInterval(function () {

  showSlide(currentSlide + 1);

}, 5000);


/* =========================================
   DATE MINIMUM
========================================= */

const dateInput =
  document.getElementById("travelDate");

const today =
  new Date()
    .toISOString()
    .split("T")[0];

dateInput.min = today;


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
  document.querySelectorAll(
    ".service-card, .feature, .destination-card, .about-image, .about-content, .testimonial, .enquiry-box"
  );


const revealObserver =
  new IntersectionObserver(

    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          entry.target.style.opacity = "1";

          entry.target.style.transform =
            "translateY(0)";

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.12
    }

  );


revealElements.forEach(function (element) {

  element.style.opacity = "0";

  element.style.transform =
    "translateY(30px)";

  element.style.transition =
    "opacity .8s ease, transform .8s ease";

  revealObserver.observe(element);

});


/* =========================================
   SMOOTH NAVIGATION
========================================= */

document.querySelectorAll(
  'a[href^="#"]'
).forEach(function (link) {

  link.addEventListener("click", function (event) {

    const target =
      document.querySelector(
        link.getAttribute("href")
      );

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth"
    });

  });

});


/* =========================================
   PREVENT EMPTY SOCIAL LINKS
========================================= */

document.querySelectorAll(
  ".social-icons a"
).forEach(function (link) {

  link.addEventListener("click", function (event) {

    if (link.getAttribute("href") === "#") {

      event.preventDefault();

    }

  });

});