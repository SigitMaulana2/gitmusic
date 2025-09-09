// main.js (versi fix)
const modal = document.getElementById("modal");
const modalAudio = document.getElementById("modalAudio"); // Ubah dari modalVideo
const modalTitle = document.getElementById("modalTitle");
const closeBtn = document.getElementById("closeBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const karaokeLyricsDiv = document.getElementById("karaokeLyrics");
const laguContainer = document.getElementById("laguContainer");
const modalPrevBtn = document.getElementById("modalPrevBtn");
const modalNextBtn = document.getElementById("modalNextBtn");

let currentPlayingIndex = -1;
let currentLyrics = [];

// Fungsi untuk membuat card lagu
function createSongCards() {
  laguContainer.innerHTML = "";
  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.title = song.title;
    card.dataset.audio = song.audioSrc; // Ubah dari dataset.video

    card.innerHTML = `
      <h3>${song.displayTitle}</h3>
      <img src="${song.imageSrc}" alt="${song.displayTitle}" class="card-image">
    `;

    laguContainer.appendChild(card);

    // Animasi muncul
    requestAnimationFrame(() => {
      card.classList.add("show");
    });

    // Event klik
    card.addEventListener("click", () => {
      openModal(index);
    });
  });
}
document.addEventListener("DOMContentLoaded", createSongCards);

// Fungsi tampilkan lirik
function displayLyrics(lyrics) {
  karaokeLyricsDiv.innerHTML = "";
  currentLyrics = lyrics;
  lyrics.forEach((line, index) => {
    const span = document.createElement("span");
    span.textContent = line.text;
    span.dataset.time = line.time;
    span.dataset.index = index;
    karaokeLyricsDiv.appendChild(span);
  });
}

// Update lirik aktif
function updateActiveLyric() {
  const currentTime = modalAudio.currentTime; // Ubah dari modalVideo
  const lyricSpans = karaokeLyricsDiv.querySelectorAll("span");
  let activeLyricFound = false;

  for (let i = 0; i < currentLyrics.length; i++) {
    const line = currentLyrics[i];
    const nextLineTime =
      i + 1 < currentLyrics.length
        ? currentLyrics[i + 1].time
        : modalAudio.duration + 1; // Ubah dari modalVideo

    if (currentTime >= line.time && currentTime < nextLineTime) {
      lyricSpans[i].classList.add("active");
      if (!activeLyricFound) {
        lyricSpans[i].scrollIntoView({ behavior: "smooth", block: "center" });
        activeLyricFound = true;
      }
    } else {
      lyricSpans[i].classList.remove("active");
    }
  }
}

// Buka modal
async function openModal(index) {
  currentPlayingIndex = index;
  const song = songs[index];

  modalTitle.textContent = song.title;
  modalAudio.src = song.audioSrc; // Ubah dari modalVideo.src
  modalAudio.currentTime = 0;

  // Ambil lirik langsung dari lyricsData.js
  const lyrics = lyricsData[song.title] || [];
  displayLyrics(lyrics);

  modalAudio.play(); // Ubah dari modalVideo.play()
  modal.style.display = "block";
  progressFill.style.width = "0%";
}

// Tutup modal
function closeModal() {
  modal.style.display = "none";
  modalAudio.pause(); // Ubah dari modalVideo.pause()
  modalAudio.src = ""; // Ubah dari modalVideo.src
  karaokeLyricsDiv.innerHTML = "";
  currentLyrics = [];
}
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Update progress bar
modalAudio.addEventListener("timeupdate", () => { // Ubah dari modalVideo
  if (modalAudio.duration) { // Ubah dari modalVideo
    const progressPercent =
      (modalAudio.currentTime / modalAudio.duration) * 100; // Ubah dari modalVideo
    progressFill.style.width = progressPercent + "%";
    updateActiveLyric();
  }
});
modalAudio.addEventListener("ended", () => { // Ubah dari modalVideo
  progressFill.style.width = "0%";
});

// Navigasi lagu
function playNextSongInModal() {
  if (currentPlayingIndex !== -1) {
    const nextIndex = (currentPlayingIndex + 1) % songs.length;
    openModal(nextIndex);
  }
}
function playPrevSongInModal() {
  if (currentPlayingIndex !== -1) {
    const prevIndex = (currentPlayingIndex - 1 + songs.length) % songs.length;
    openModal(prevIndex);
  }
}
modalNextBtn.addEventListener("click", playNextSongInModal);
modalPrevBtn.addEventListener("click", playPrevSongInModal);

particlesJS("particles-js", {
  particles: { number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 6 }
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true }
  },
  retina_detect: true
});

const themeToggleBtn = document.getElementById("themeToggle");
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggleBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const title = card.dataset.title.toLowerCase();
    card.style.display = title.includes(searchTerm) ? "block" : "none";
  });
});
// Tambahkan di bawah event timeupdate di main.js
modalAudio.addEventListener("ended", () => {
  progressFill.style.width = "0%";
  playNextSongInModal(); // Otomatis lanjut lagu berikutnya
});