
const currentYear = document.getElementById("currentYear");
const profilePhoto = document.getElementById("profilePhoto");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

// Update the copyright year automatically.
currentYear.textContent = new Date().getFullYear();

// Show initials if no profile photo has been added.
function showPhotoPlaceholder() {
  profilePhoto.hidden = true;
  photoPlaceholder.hidden = false;
}

profilePhoto.addEventListener("error", showPhotoPlaceholder);

if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
  showPhotoPlaceholder();
}

// Mobile navigation menu.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after choosing a section.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.textContent = "☰";
  });
});

// Prepare an email using the visitor's default email app.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("visitorName").value.trim();
  const email = document.getElementById("visitorEmail").value.trim();
  const message = document.getElementById("visitorMessage").value.trim();

  // Replace this example with your own email address.
  const yourEmail = "sksairohith123@gmail.com";

  if (
    !name ||
    !email ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    formNote.textContent = "Please enter a valid name, email and message.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  formNote.textContent =
    "Opening your email app. If it doesn't open, check your email app settings.";

  window.location.href =
    `mailto:${yourEmail}?subject=${subject}&body=${body}`;
});

/* ===== ANIMATED BLUE PARTICLES ===== */

(() => {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reducedMotion.matches) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;
  let lastFrame = 0;

  const particleCount = () =>
    Math.min(65, Math.floor((width * height) / 18000));

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = particleCount();

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function draw(timestamp) {
    animationId = null;

    if (document.hidden) return;

    // Limit animation to approximately 30 frames per second.
    if (timestamp - lastFrame < 33) {
      animationId = requestAnimationFrame(draw);
      return;
    }

    lastFrame = timestamp;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
      ctx.fill();

      // Connect nearby particles with delicate blue lines.
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 105) {
          const opacity = (1 - distance / 105) * 0.16;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  function startAnimation() {
    if (animationId !== null || document.hidden) return;
    lastFrame = 0;
    animationId = requestAnimationFrame(draw);
  }

  function stopAnimation() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  resizeCanvas();
  startAnimation();

  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      stopAnimation();
      ctx.clearRect(0, 0, width, height);
    } else {
      startAnimation();
    }
  });
})();

