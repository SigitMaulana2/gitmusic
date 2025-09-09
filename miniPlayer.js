// miniPlayer.js
const miniPlayer = document.getElementById("miniPlayer");
const miniAudio = document.getElementById("miniAudio"); // Ubah dari miniVideo
const miniPlayPauseBtn = document.getElementById("miniPlayPauseBtn");
const miniPrevBtn = document.getElementById("miniPrevBtn");
const miniNextBtn = document.getElementById("miniNextBtn");
const miniTitle = document.getElementById("miniTitle");
const wave = document.getElementById("wave");

let currentMiniIndex = 0;

// Fade in/out audio
function fadeAudio(audio, type = "in", duration = 1000) { // Ubah dari video
  let step = 50;
  let volumeStep = 1 / (duration / step);
  if (type === "in") {
    audio.volume = 0; // Ubah dari video
    let fadeIn = setInterval(() => {
      if (audio.volume < 1) { // Ubah dari video
        audio.volume = Math.min(audio.volume + volumeStep, 1); // Ubah dari video
      } else {
        clearInterval(fadeIn);
      }
    }, step);
  } else if (type === "out") {
    let fadeOut = setInterval(() => {
      if (audio.volume > 0) { // Ubah dari video
        audio.volume = Math.max(audio.volume - volumeStep, 0); // Ubah dari video
      } else {
        clearInterval(fadeOut);
        audio.pause(); // Ubah dari video
      }
    }, step);
  }
}

// Update mini player info dengan fade
function updateMiniPlayer(index) {
  if (songs.length === 0) {
    // Jika songs belum dimuat, coba lagi setelah sedikit waktu
    setTimeout(() => updateMiniPlayer(index), 100);
    return;
  }

  const song = songs[index];
  
  fadeAudio(miniAudio, "out", 800); // Ubah dari miniVideo
  setTimeout(() => {
    miniAudio.src = song.audioSrc; // Ubah dari miniVideo.src
    miniTitle.textContent = song.title;
    miniAudio.play(); // Ubah dari miniVideo.play()
    fadeAudio(miniAudio, "in", 800); // Ubah dari miniVideo
    miniPlayPauseBtn.textContent = "⏸️";
    wave.classList.remove("paused");
  }, 800); // Tunggu fade out selesai sebelum ganti lagu
}

// Inisialisasi mini player saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Pastikan songs array sudah terisi dari musicData.js
  if (typeof songs !== 'undefined' && songs.length > 0) {
    updateMiniPlayer(currentMiniIndex);
  } else {
    // Jika songs belum ada, tunggu sebentar dan coba lagi
    const checkSongsInterval = setInterval(() => {
      if (typeof songs !== 'undefined' && songs.length > 0) {
        clearInterval(checkSongsInterval);
        updateMiniPlayer(currentMiniIndex);
      }
    }, 50);
  }
});


// Play/Pause
miniPlayPauseBtn.addEventListener("click", () => {
  if (miniAudio.paused) { // Ubah dari miniVideo
    miniAudio.play(); // Ubah dari miniVideo
    miniPlayPauseBtn.textContent = "⏸️";
    wave.classList.remove("paused");
  } else {
    miniAudio.pause(); // Ubah dari miniVideo
    miniPlayPauseBtn.textContent = "▶️";
    wave.classList.add("paused");
  }
});

// Next & Prev
miniNextBtn.addEventListener("click", () => {
  currentMiniIndex = (currentMiniIndex + 1) % songs.length;
  updateMiniPlayer(currentMiniIndex);
});

miniPrevBtn.addEventListener("click", () => {
  currentMiniIndex = (currentMiniIndex - 1 + songs.length) % songs.length;
  updateMiniPlayer(currentMiniIndex);
});
// Tambahkan di bawah inisialisasi mini player di miniPlayer.js
miniAudio.addEventListener("ended", () => {
  currentMiniIndex = (currentMiniIndex + 1) % songs.length;
  updateMiniPlayer(currentMiniIndex);
});