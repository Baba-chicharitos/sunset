const screens = Array.from(document.querySelectorAll(".quiz-screen"));

const siteYesButton = document.querySelector("#site-yes");
const siteNoButton = document.querySelector("#site-no");
const siteStatus = document.querySelector("#site-status");

const programmeYesButton = document.querySelector("#programme-yes");
const programmeNoButton = document.querySelector("#programme-no");
const programmeStatus = document.querySelector("#programme-status");

const suggestionsButton = document.querySelector("#suggestions-button");
const contactModal = document.querySelector("#contact-modal");
const closeContactModalButton = document.querySelector("#close-contact-modal");

const finalYesButton = document.querySelector("#final-yes");
const finalNoButton = document.querySelector("#final-no");
const finalAnswerZone = document.querySelector("#final-answer-zone");
const finalStatus = document.querySelector("#final-status");
const finalTitle = document.querySelector("#final-title");
const finalDescription = document.querySelector("#final-description");
const finalCard = document.querySelector(".question-card--final");

const confettiCanvas = document.querySelector("#confetti-canvas");
const confettiContext = confettiCanvas.getContext("2d");

let currentScreenIndex = 0;
let finalAnswerAccepted = false;

/* ==================================================
   CHANGEMENT D’ÉCRAN
   ================================================== */

function showScreen(nextScreenIndex) {
  const currentScreen = screens[currentScreenIndex];
  const nextScreen = screens[nextScreenIndex];

  if (!currentScreen || !nextScreen) {
    return;
  }

  currentScreen.classList.add("is-leaving");

  window.setTimeout(() => {
    currentScreen.classList.remove("is-active", "is-leaving");
    nextScreen.classList.add("is-active");

    currentScreenIndex = nextScreenIndex;
  }, 500);
}

/* ==================================================
   REDÉMARRER UNE ANIMATION CSS
   ================================================== */

function restartAnimation(element, className) {
  element.classList.remove(className);

  // Force le navigateur à recalculer l’élément.
  void element.offsetWidth;

  element.classList.add(className);
}

/* ==================================================
   QUESTION 1 : AVIS SUR LE SITE
   ================================================== */

siteNoButton.addEventListener("click", () => {
  restartAnimation(siteNoButton, "is-rejected");

  siteStatus.textContent = "";
});

siteYesButton.addEventListener("click", () => {
  siteYesButton.classList.add("is-accepted");
  siteYesButton.textContent = "Excellente réponse ✓";

  siteStatus.textContent = "Validation en cours…";

  window.setTimeout(() => {
    showScreen(1);
  }, 850);
});

/* ==================================================
   QUESTION 2 : AVIS SUR LE PROGRAMME
   ================================================== */

programmeNoButton.addEventListener("click", () => {
  programmeNoButton.classList.add("is-offline");
  programmeNoButton.textContent = "Hors service";

  programmeNoButton.disabled = true;

  programmeStatus.textContent =
    "Le service des réponses négatives est temporairement indisponible.";
});

programmeYesButton.addEventListener("click", () => {
  const programmeScreen = document.querySelector("#question-programme");

  programmeYesButton.textContent = "Programme validé ✓";
  programmeYesButton.classList.add("is-accepted");

  programmeStatus.textContent =
    "Le programme vient d’obtenir son homologation officielle.";

  createApprovalSparks(programmeYesButton);

  programmeScreen.classList.add("is-approved");

  window.setTimeout(() => {
    programmeScreen.classList.remove("is-approved");
    showScreen(2);
  }, 850);
});

function createApprovalSparks(button) {
  const numberOfSparks = 18;

  for (let index = 0; index < numberOfSparks; index += 1) {
    const spark = document.createElement("span");

    spark.className = "approval-spark";
    spark.textContent = index % 2 === 0 ? "✦" : "✓";

    spark.style.setProperty("--angle", `${(360 / numberOfSparks) * index}deg`);

    spark.style.setProperty("--distance", `${65 + Math.random() * 55}px`);

    spark.style.animationDelay = `${Math.random() * 120}ms`;

    button.appendChild(spark);

    window.setTimeout(() => {
      spark.remove();
    }, 1100);
  }
}

/* ==================================================
   POPUP DES SUGGESTIONS
   ================================================== */

function openContactModal() {
  contactModal.classList.add("is-open");
  contactModal.setAttribute("aria-hidden", "false");

  closeContactModalButton.focus();
}

function closeContactModal() {
  contactModal.classList.remove("is-open");
  contactModal.setAttribute("aria-hidden", "true");

  suggestionsButton.focus();
}

suggestionsButton.addEventListener("click", openContactModal);
closeContactModalButton.addEventListener("click", closeContactModal);

contactModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) {
    closeContactModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactModal.classList.contains("is-open")) {
    closeContactModal();
  }
});

/* ==================================================
   QUESTION FINALE : BOUTON NON QUI SE DÉPLACE
   ================================================== */

finalNoButton.addEventListener("click", () => {
  if (finalAnswerAccepted) {
    return;
  }

  moveFinalNoButton();

  const messages = [
    "Raté.",
    "Ce bouton refuse visiblement de coopérer.",
    "Il va falloir essayer plus vite.",
    "Une autre réponse semble plus accessible.",
    "Le bouton Non poursuit sa fuite.",
    "Tentative enregistrée, mais complètement ignorée.",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  finalStatus.textContent = randomMessage;
});

function moveFinalNoButton() {
  const zoneWidth = finalAnswerZone.clientWidth;
  const zoneHeight = finalAnswerZone.clientHeight;

  const noButtonWidth = finalNoButton.offsetWidth;
  const noButtonHeight = finalNoButton.offsetHeight;

  const padding = 8;
  const safetyGap = 14;

  const maximumX = Math.max(padding, zoneWidth - noButtonWidth - padding);

  const maximumY = Math.max(padding, zoneHeight - noButtonHeight - padding);

  const yesRectangle = {
    left: finalYesButton.offsetLeft - safetyGap,
    top: finalYesButton.offsetTop - safetyGap,
    right: finalYesButton.offsetLeft + finalYesButton.offsetWidth + safetyGap,
    bottom: finalYesButton.offsetTop + finalYesButton.offsetHeight + safetyGap,
  };

  let randomX = padding;
  let randomY = padding;
  let positionIsValid = false;
  let attempts = 0;

  while (!positionIsValid && attempts < 40) {
    randomX = padding + Math.random() * Math.max(0, maximumX - padding);

    randomY = padding + Math.random() * Math.max(0, maximumY - padding);

    const proposedRectangle = {
      left: randomX,
      top: randomY,
      right: randomX + noButtonWidth,
      bottom: randomY + noButtonHeight,
    };

    const overlapsYesButton =
      proposedRectangle.left < yesRectangle.right &&
      proposedRectangle.right > yesRectangle.left &&
      proposedRectangle.top < yesRectangle.bottom &&
      proposedRectangle.bottom > yesRectangle.top;

    positionIsValid = !overlapsYesButton;
    attempts += 1;
  }

  finalNoButton.style.right = "auto";
  finalNoButton.style.bottom = "auto";
  finalNoButton.style.left = `${randomX}px`;
  finalNoButton.style.top = `${randomY}px`;
}

/* ==================================================
   QUESTION FINALE : RÉPONSE OUI
   ================================================== */

finalYesButton.addEventListener("click", () => {
  if (finalAnswerAccepted) {
    return;
  }

  finalAnswerAccepted = true;

  finalCard.classList.add("question-card--success");

  finalYesButton.textContent = "Séjour accepté 🎉";

  finalTitle.textContent = "Le séjour à Toulouse est officiellement validé !";

  finalDescription.textContent =
    "La réservation morale vient d’être confirmée. Le service annulation est, lui aussi, hors service.";

  finalStatus.textContent =
    "Félicitations, tu viens de débloquer dix secondes de confettis.";

  startConfetti(10000);
});

/* ==================================================
   CONFETTIS
   ================================================== */

const confettiColors = [
  "#f94144",
  "#f3722c",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
  "#9b5de5",
  "#f15bb5",
  "#00bbf9",
];

let confettiPieces = [];
let confettiAnimationFrame = null;
let confettiGenerationInterval = null;

function resizeConfettiCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  confettiCanvas.width = window.innerWidth * pixelRatio;
  confettiCanvas.height = window.innerHeight * pixelRatio;

  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;

  confettiContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createConfettiPiece() {
  return {
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 100,

    width: 6 + Math.random() * 8,
    height: 8 + Math.random() * 12,

    velocityX: -2.5 + Math.random() * 5,
    velocityY: 2.5 + Math.random() * 4,

    gravity: 0.035 + Math.random() * 0.055,

    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: -0.15 + Math.random() * 0.3,

    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],

    opacity: 0.75 + Math.random() * 0.25,
  };
}

function addConfettiBatch(amount = 35) {
  for (let index = 0; index < amount; index += 1) {
    confettiPieces.push(createConfettiPiece());
  }
}

function updateConfetti() {
  confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach((piece) => {
    piece.velocityY += piece.gravity;

    piece.x += piece.velocityX;
    piece.y += piece.velocityY;

    piece.rotation += piece.rotationSpeed;

    confettiContext.save();

    confettiContext.globalAlpha = piece.opacity;

    confettiContext.translate(piece.x, piece.y);
    confettiContext.rotate(piece.rotation);

    confettiContext.fillStyle = piece.color;

    confettiContext.fillRect(
      -piece.width / 2,
      -piece.height / 2,
      piece.width,
      piece.height,
    );

    confettiContext.restore();
  });

  confettiPieces = confettiPieces.filter((piece) => {
    return (
      piece.y < window.innerHeight + 50 &&
      piece.x > -80 &&
      piece.x < window.innerWidth + 80
    );
  });

  if (confettiPieces.length > 0 || confettiGenerationInterval !== null) {
    confettiAnimationFrame = window.requestAnimationFrame(updateConfetti);
  } else {
    confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiAnimationFrame = null;
  }
}

function startConfetti(duration) {
  resizeConfettiCanvas();

  if (confettiGenerationInterval !== null) {
    window.clearInterval(confettiGenerationInterval);
  }

  if (confettiAnimationFrame !== null) {
    window.cancelAnimationFrame(confettiAnimationFrame);
  }

  confettiPieces = [];

  addConfettiBatch(180);

  confettiGenerationInterval = window.setInterval(() => {
    addConfettiBatch(45);
  }, 250);

  updateConfetti();

  window.setTimeout(() => {
    window.clearInterval(confettiGenerationInterval);
    confettiGenerationInterval = null;
  }, duration);
}

window.addEventListener("resize", resizeConfettiCanvas);

resizeConfettiCanvas();
