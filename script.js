/*
 * PERSONALISASI CEPAT
 * Ubah isi BIRTHDAY_CONFIG di bawah ini untuk menyesuaikan kartu ucapan.
 * Nama, pesan, dan pengirim akan diperbarui otomatis saat halaman dibuka.
 */
const BIRTHDAY_CONFIG = {
  recipientName: "Nadia",
  senderName: "seseorang yang peduli padamu",
  introText: "Semoga hal-hal baik selalu menemukan jalan pulang kepadamu. Tumbuh dengan bahagia, ya!",
  surpriseMessage: "Semoga kamu selalu dikelilingi orang-orang yang menyayangimu, diberi keberanian untuk mengejar mimpi, dan punya banyak alasan untuk tersenyum. Kamu pantas mendapatkan hal-hal yang indah. ♡",
  photoCaption: "hari indah, kenangan manis",
  initialPalette: "strawberry", // pilihan: strawberry, lemon, mint, lilac
};

(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const recipientName = $("#recipientName");
  const senderName = $("#senderName");
  const introText = $("#introText");
  const surpriseMessage = $("#surpriseMessage");
  const photoCaption = $("#photoCaption");
  const surpriseButton = $("#surpriseButton");
  const surpriseButtonLabel = $("#surpriseButtonLabel");
  const surpriseNote = $("#surpriseNote");
  const photoButton = $("#photoButton");
  const photoInput = $("#photoInput");
  const photoPlaceholder = $("#photoPlaceholder");
  const uploadedPhoto = $("#uploadedPhoto");
  const paletteButton = $("#paletteButton");
  const statusMessage = $("#statusMessage");
  const canvas = $("#confettiCanvas");
  const context = canvas.getContext("2d");

  const palettes = ["strawberry", "lemon", "mint", "lilac"];
  const paletteNames = {
    strawberry: "stroberi",
    lemon: "lemon",
    mint: "mint",
    lilac: "lilac",
  };
  let currentPaletteIndex = Math.max(0, palettes.indexOf(BIRTHDAY_CONFIG.initialPalette));
  let activeObjectUrl = null;
  let confettiAnimation = null;
  let resizeTimeout = null;

  function applyConfiguration() {
    recipientName.textContent = BIRTHDAY_CONFIG.recipientName || "Kamu";
    senderName.textContent = BIRTHDAY_CONFIG.senderName || "seseorang yang menyayangimu";
    introText.textContent = BIRTHDAY_CONFIG.introText || "Semoga hari-harimu dipenuhi hal-hal baik.";
    surpriseMessage.textContent = BIRTHDAY_CONFIG.surpriseMessage || "Semoga semua harapan baik menemukan jalannya untuk menjadi nyata. ♡";
    photoCaption.textContent = BIRTHDAY_CONFIG.photoCaption || "hari indah, kenangan manis";
    document.title = `Selamat Ulang Tahun, ${BIRTHDAY_CONFIG.recipientName || "Kamu"}!`;
    currentPaletteIndex = Math.max(0, palettes.indexOf(BIRTHDAY_CONFIG.initialPalette));
    setPalette(palettes[currentPaletteIndex], false);
  }

  function setPalette(palette, announce = true) {
    if (!palettes.includes(palette)) return;
    document.body.dataset.palette = palette;
    currentPaletteIndex = palettes.indexOf(palette);
    if (announce) {
      statusMessage.textContent = `Palet warna ${paletteNames[palette]} diterapkan.`;
    }
  }

  paletteButton.addEventListener("click", () => {
    const nextIndex = (currentPaletteIndex + 1) % palettes.length;
    setPalette(palettes[nextIndex]);
    paletteButton.animate(
      [{ transform: "scale(1)" }, { transform: "scale(.96)" }, { transform: "scale(1)" }],
      { duration: 240, easing: "ease-out" }
    );
  });

  surpriseButton.addEventListener("click", () => {
    const isOpen = surpriseButton.getAttribute("aria-expanded") === "true";
    const willOpen = !isOpen;
    surpriseButton.setAttribute("aria-expanded", String(willOpen));
    surpriseNote.hidden = !willOpen;
    surpriseButtonLabel.textContent = willOpen ? "Tutup pesan" : "Buka kejutan";
    surpriseButton.querySelector(".button-arrow").textContent = willOpen ? "↙" : "↗";
    statusMessage.textContent = willOpen ? "Pesan kejutan dibuka." : "Pesan kejutan ditutup.";
    if (willOpen) {
      launchConfetti(145);
      if (window.matchMedia("(max-width: 760px)").matches) {
        window.setTimeout(() => surpriseNote.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
      }
    }
  });

  photoButton.addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      statusMessage.textContent = "File belum berupa gambar. Silakan pilih foto dengan format gambar.";
      photoInput.value = "";
      return;
    }
    const maxSizeInBytes = 8 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      statusMessage.textContent = "Ukuran foto terlalu besar. Pilih foto berukuran maksimal 8 MB.";
      photoInput.value = "";
      return;
    }

    const nextObjectUrl = URL.createObjectURL(file);
    uploadedPhoto.onload = () => {
      photoPlaceholder.hidden = true;
      uploadedPhoto.hidden = false;
      if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
      activeObjectUrl = nextObjectUrl;
      statusMessage.textContent = `Foto ${file.name} berhasil ditampilkan. Foto hanya tampil di halaman ini.`;
      photoButton.innerHTML = "<span aria-hidden=\"true\">↻</span> Ganti foto";
      launchConfetti(70);
    };
    uploadedPhoto.onerror = () => {
      URL.revokeObjectURL(nextObjectUrl);
      statusMessage.textContent = "Foto tidak dapat dibuka. Coba pilih file gambar lain.";
      photoInput.value = "";
    };
    uploadedPhoto.src = nextObjectUrl;
  });

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const confettiColors = ["#e98489", "#f7d57b", "#b8d8c7", "#d3c3e7", "#f4b9a8", "#fff0c5"];
  function launchConfetti(amount = 120) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (confettiAnimation) cancelAnimationFrame(confettiAnimation);
    resizeCanvas();
    const pieces = Array.from({ length: amount }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.35,
      width: 4 + Math.random() * 5,
      height: 6 + Math.random() * 7,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      velocityX: -1.8 + Math.random() * 3.6,
      velocityY: 2 + Math.random() * 3.6,
      rotation: Math.random() * Math.PI,
      rotationSpeed: -0.12 + Math.random() * 0.24,
      opacity: 0.75 + Math.random() * 0.25,
    }));

    let frameCount = 0;
    function render() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let remaining = 0;
      for (const piece of pieces) {
        piece.x += piece.velocityX;
        piece.y += piece.velocityY;
        piece.rotation += piece.rotationSpeed;
        piece.velocityY += 0.025;
        if (piece.y < window.innerHeight + 20) remaining++;
        context.save();
        context.globalAlpha = piece.opacity;
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        context.restore();
      }
      frameCount++;
      if (remaining > 0 && frameCount < 210) {
        confettiAnimation = requestAnimationFrame(render);
      } else {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        confettiAnimation = null;
      }
    }
    confettiAnimation = requestAnimationFrame(render);
  }

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(resizeCanvas, 120);
  });
  window.addEventListener("beforeunload", () => {
    if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
    if (confettiAnimation) cancelAnimationFrame(confettiAnimation);
  });

  applyConfiguration();
})();
