/* =========================================
   TRIPORA JAVASCRIPT
========================================= */

const WHATSAPP_NUMBER = "917002067055";
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
   TRAVEL ENQUIRY TABS
========================================= */

const tabs = document.querySelectorAll(".tab");

const travelType =
  document.getElementById("travelType");

const fromInput =
  document.getElementById("from");

const toInput =
  document.getElementById("to");


tabs.forEach(function (tab) {

  tab.addEventListener("click", function () {

    tabs.forEach(function (item) {
      item.classList.remove("active");
    });

    tab.classList.add("active");

    const type =
      tab.getAttribute("data-type");

    travelType.value = type;


    if (type === "Hotel") {

      fromInput.placeholder =
        "e.g. Goa";

      toInput.placeholder =
        "e.g. 4-star hotel";

    }

    else if (type === "Holiday") {

      fromInput.placeholder =
        "e.g. Delhi";

      toInput.placeholder =
        "e.g. Kashmir";

    }

    else if (type === "Train") {

      fromInput.placeholder =
        "e.g. Guwahati";

      toInput.placeholder =
        "e.g. New Delhi";

    }

    else {

      fromInput.placeholder =
        "e.g. Delhi";

      toInput.placeholder =
        "e.g. Dubai";

    }

  });

});


/* =========================================
   ENQUIRY FORM
========================================= */

const travelForm =
  document.getElementById("travelForm");


travelForm.addEventListener("submit", function (event) {

  event.preventDefault();


  const type =
    travelType.value;

  const from =
    document.getElementById("from").value;

  const to =
    document.getElementById("to").value;

  const date =
    document.getElementById("travelDate").value;

  const travellers =
    document.getElementById("travellers").value;


  const message =
`Hello Tripora,

I want ${type.toLowerCase()} booking assistance.

From: ${from}
To: ${to}
Travel Date: ${date}
Number of Travellers: ${travellers}

Please help me with the available options.`;


  const whatsappLink =
    WHATSAPP_URL +
    "?text=" +
    encodeURIComponent(message);


  window.open(
    whatsappLink,
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