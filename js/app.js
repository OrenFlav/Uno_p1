// ─────────────────────────────────────────────────────────────
// CONFESSION SITE — app.js
// ─────────────────────────────────────────────────────────────

// ── FLOATING HEARTS ──────────────────────────────────────────
(function spawnHearts() {
  const container = document.getElementById("heartsBg");
  const symbols = ["💕", "💗", "💖", "💓", "🌸", "✨", "💝", "🌷"];

  function makeHeart() {
    const el = document.createElement("span");
    el.className = "heart-float";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = 0.9 + Math.random() * 1.4 + "rem";
    el.style.animationDuration = 6 + Math.random() * 8 + "s";
    el.style.animationDelay = Math.random() * 4 + "s";
    container.appendChild(el);

    // Remove after animation to keep DOM clean
    setTimeout(
      () => el.remove(),
      (parseFloat(el.style.animationDuration) +
        parseFloat(el.style.animationDelay)) *
        1000,
    );
  }

  // Spawn hearts continuously
  setInterval(makeHeart, 700);
  // Immediate first batch
  for (let i = 0; i < 8; i++) makeHeart();
})();

// ── ENVELOPE OPENING ─────────────────────────────────────────
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const envelope = document.getElementById("envelope");
  const sceneEnv = document.getElementById("sceneEnvelope");
  const sceneCard = document.getElementById("sceneCard");

  // 1. Add opening class — CSS handles the flap flip + letter rise
  envelope.classList.add("opening");

  // 2. After flap animation, fade out envelope and show card
  setTimeout(() => {
    // Fade out the envelope scene
    sceneEnv.style.transition = "opacity .45s ease";
    sceneEnv.style.opacity = "0";
  }, 600);

  setTimeout(() => {
    sceneEnv.classList.add("hidden");
    sceneCard.classList.remove("hidden");
    // Scroll card into view smoothly on mobile
    sceneCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 1050);
}

// ── REPLY MODAL ───────────────────────────────────────────────
function openReplyModal() {
  document.getElementById("replyModal").classList.add("open");
  document.body.style.overflow = "hidden";
  // Focus name field
  setTimeout(() => document.getElementById("senderName").focus(), 300);
}

function closeReplyModal() {
  document.getElementById("replyModal").classList.remove("open");
  document.body.style.overflow = "";
}

// Close modal when clicking the overlay (not the box)
document.getElementById("replyModal").addEventListener("click", function (e) {
  if (e.target === this) closeReplyModal();
});

// ── FORM SUBMISSION VIA EMAILJS ───────────────────────────────
document.getElementById("replyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const senderName = "Uno";
  const replyMessage = document.getElementById("replyMessage").value.trim();
  const btnSend = document.getElementById("btnSend");
  const sendNote = document.getElementById("sendNote");

  if (!replyMessage) return;

  // Disable button while sending
  btnSend.disabled = true;
  btnSend.textContent = "Sending... 💌";
  sendNote.textContent = "";
  sendNote.className = "send-note";

  // ── EmailJS send ──────────────────────────────────────────
  // These template variables must match your EmailJS template.
  // In your EmailJS template, use:
  //   {{from_name}}    → sender's name
  //   {{message}}      → reply message
  //   {{to_email}}     → your Gmail (already set below)
  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: senderName,
      message: replyMessage,
      to_email: "crissstmads@gmail.com", // your Gmail — already set
      reply_to: "noreply@confession.site",
    })
    .then(() => {
      // Success!
      btnSend.textContent = "Sent! 😲";
      sendNote.textContent = "Oh my nagreply syaaa kala ko hindi na 😭";
      sendNote.className = "send-note success";
      launchConfetti();

      // Reset form after 3 seconds
      setTimeout(() => {
        document.getElementById("replyForm").reset();
        btnSend.disabled = false;
        btnSend.textContent = "Send it 💌";
        sendNote.textContent = "";
        closeReplyModal();
      }, 10000);
    })
    .catch((err) => {
      // Error — tell user to try again
      console.error("EmailJS error:", err);
      btnSend.disabled = false;
      btnSend.textContent = "Send it 💌";
      sendNote.textContent = "Oops, something went wrong. Try again? 🥺";
      sendNote.className = "send-note error";
    });
});

// ── CONFETTI ──────────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#f48fb1",
    "#ff80ab",
    "#ffd6e0",
    "#ff6b9d",
    "#ff4081",
    "#ffe4ec",
    "#ffb3c6",
  ];
  const pieces = [];
  const count = 120;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: 4 + Math.random() * 6,
      d: 2 + Math.random() * 3, // fall speed
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      drift: (Math.random() - 0.5) * 1.5,
    });
  }

  let frame;
  let tick = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tick++;

    pieces.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      ctx.restore();

      p.y += p.d;
      p.x += p.drift;
      p.angle += p.spin;
    });

    // Stop after 3.5 seconds
    if (tick < 210) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(frame);
    }
  }

  draw();
}

// ── KEYBOARD ESC closes modal ─────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeReplyModal();
});

// ── RESIZE confetti canvas ────────────────────────────────────
window.addEventListener("resize", () => {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
